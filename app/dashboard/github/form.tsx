'use client';

import InputCard from '@/components/input-card';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { useEffect, useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const FormSchema = z.object({
  username: z.string().min(1),
  repository: z.string().min(1),
  reference_branch: z.string().min(1),
  target_branch: z.string().min(1),
  path: z.string().min(1),
  content: z.string().min(1),
  commit_message: z.string().min(1),
});

export default function GithubForm() {
  const router = useRouter();

  const [branches, setBranches] = useState<string[]>([]);

  const [response, setResponse] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: 'vhpx',
      repository: 'genie',
      reference_branch: '',
      target_branch: '',
      path: '/__tests__/new-test.test.tsx',
      content:
        'import { describe, it, expect } from "vitest";\n\ndescribe("test", () => { it("works", () => { expect(true).toBe(true); }); });',
      commit_message: 'Add tests',
    },
  });

  const username = form.watch('username');
  const repository = form.watch('repository');

  const pad = (value: number) => (value < 10 ? `0${value}` : value);

  const getTime = () => {
    // return a timestamp in the format of YYYY-MM-DD-HH-mm-ss
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    // pad the month, day, hours, minutes, and seconds with a leading zero if they are less than 10
    return `${year}-${pad(month)}-${pad(day)}-${pad(hours)}-${pad(
      minutes
    )}-${pad(seconds)}`;
  };

  useEffect(() => {
    async function fetchBranches() {
      const res = await fetch(`/api/github/${username}/${repository}/branches`);
      if (!res.ok) {
        setBranches([]);
        return;
      }

      const { branches } = await res.json();
      setBranches(branches.map((branch: any) => branch.name));

      const defaultBranch =
        branches.find(
          (branch: any) => branch.name === 'main' || branch.name === 'master'
        ) || branches?.[0];

      form.setValue('reference_branch', defaultBranch?.name || '');
      form.setValue(
        'target_branch',
        `${defaultBranch?.name}-with-tests-${getTime()}`
      );

      // validate the form after setting the default values
      form.trigger();
    }

    fetchBranches();
  }, [username, repository]);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setSaving(true);

    const res = await fetch('/api/github/tests/files', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      toast({
        title: 'Tests added successfully',
        description: 'The tests have been added to the repository.',
      });

      setResponse(await res.json());
      router.refresh();
    } else {
      setResponse(null);
      toast({
        title: 'An error occurred',
        description: 'Please try again.',
      });
    }

    setSaving(false);
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
          <div className="grid md:grid-cols-3 gap-2">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <InputCard title="Github Account">
                  <FormItem className="w-full">
                    <FormControl>
                      <Input
                        id="github-account"
                        placeholder="@username"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </InputCard>
              )}
            />

            <FormField
              control={form.control}
              name="repository"
              render={({ field }) => (
                <InputCard title="Repository">
                  <FormItem className="w-full">
                    <FormControl>
                      <Input
                        id="repository"
                        placeholder="Repository"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </InputCard>
              )}
            />

            <FormField
              control={form.control}
              name="reference_branch"
              render={({ field }) => (
                <InputCard title="Reference Branch">
                  <FormItem className="w-full">
                    <FormControl>
                      <Select
                        {...field}
                        onValueChange={(value) => {
                          form.setValue('reference_branch', value);
                          form.setValue(
                            'target_branch',
                            `${value}-with-tests-${getTime()}`
                          );
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a branch" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>
                              {username}/{repository}
                            </SelectLabel>
                            {branches.map((branch) => (
                              <SelectItem key={branch} value={branch}>
                                {branch}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </InputCard>
              )}
            />

            <FormField
              control={form.control}
              name="target_branch"
              render={({ field }) => (
                <InputCard title="Target Branch" className="col-span-full">
                  <FormItem className="w-full">
                    <FormControl>
                      <Input
                        id="target-branch"
                        placeholder="Target Branch"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </InputCard>
              )}
            />

            <FormField
              control={form.control}
              name="path"
              render={({ field }) => (
                <InputCard title="Path" className="col-span-full">
                  <FormItem className="w-full">
                    <FormControl>
                      <Input id="path" placeholder="Path" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </InputCard>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <InputCard title="Content" className="col-span-full">
                  <FormItem className="w-full">
                    <FormControl>
                      <Textarea id="content" placeholder="Content" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </InputCard>
              )}
            />

            <FormField
              control={form.control}
              name="commit_message"
              render={({ field }) => (
                <InputCard title="Commit Message" className="col-span-full">
                  <FormItem className="w-full">
                    <FormControl>
                      <Textarea
                        id="commit-message"
                        placeholder="Commit Message"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </InputCard>
              )}
            />

            <div className="col-span-full flex justify-end">
              <Button
                type="submit"
                disabled={
                  saving ||
                  form.formState.isSubmitting ||
                  !form.formState.isValid
                }
              >
                {saving ? 'Executing...' : 'Execute'}
              </Button>
            </div>
          </div>
        </form>
      </Form>

      {response && (
        <pre className="mt-4 w-full bg-foreground/5 pd-2 md:p-4 rounded-lg text-sm">
          {JSON.stringify(response, null, 2)}
        </pre>
      )}
    </div>
  );
}
