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
import { Button } from '@/components/ui/button';

const FormSchema = z.object({
  file_path: z.string(),
});

export default function FileUpdateForm({
  file,
  close,
}: {
  file: {
    id: string;
    file_path: string;
  };
  close: () => void;
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      file_path: file?.file_path || '',
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setSaving(true);

    const res = await fetch(`/api/v1/test-files/${file.id}/v/0/path`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        path: data.file_path,
      }),
    });

    if (res.ok) {
      router.refresh();
      close();
    } else {
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
        <form
          onSubmit={(e) => e.preventDefault()}
          className="grid gap-4 w-full"
        >
          <div className="grid gap-2 w-full">
            <FormField
              control={form.control}
              name="file_path"
              render={({ field }) => (
                <InputCard title="File path" className="w-full">
                  <FormItem className="w-full">
                    <FormControl>
                      <Input
                        id="file_path"
                        placeholder="Enter the file path"
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
                onClick={form.handleSubmit(onSubmit)}
                disabled={
                  saving ||
                  form.formState.isSubmitting ||
                  !form.formState.isValid
                }
                className="w-full"
              >
                {saving ? 'Updating...' : 'Update file path'}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
