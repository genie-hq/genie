'use client';

import { Message } from 'ai';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { cn } from '@/lib/utils';
import { CodeBlock } from '@/components/ui/codeblock';
import { MemoizedReactMarkdown } from '@/components/ui/markdown';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'katex/dist/katex.min.css';
import 'dayjs/locale/vi';
import { User } from 'lucide-react';

export interface ChatMessageProps {
  message: Message & { chat_id?: string; created_at?: string };
  setInput?: (input: string) => void;
  embeddedUrl?: string;
  locale?: string;
  model?: string;
}

export function ChatMessage({
  message,
  setInput,
  embeddedUrl,
  locale = 'en',
  model,
  ...props
}: ChatMessageProps) {
  dayjs.extend(relativeTime);
  dayjs.locale(locale);

  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme?.includes('dark');

  return (
    <div
      className={cn('group relative mb-4 grid h-fit w-full gap-4')}
      {...props}
    >
      <div className="flex h-fit flex-wrap justify-between gap-2">
        <div className="flex h-fit w-fit select-none items-center space-x-2 rounded-lg">
          <div
            className={cn(
              'bg-foreground/10 text-foreground flex h-10 w-10 shrink-0 items-center justify-center rounded-md border shadow'
            )}
          >
            {message.role === 'user' ? (
              <User className="h-5 w-5" />
            ) : (
              <Avatar className="h-10 w-10 rounded-md">
                <AvatarFallback className="rounded-lg font-semibold">
                  AI
                </AvatarFallback>
              </Avatar>
            )}
          </div>
          <div>
            <span className="line-clamp-1 font-semibold">
              {message.role === 'user' ? (
                'You'
              ) : (
                <span
                  className={`overflow-hidden bg-gradient-to-r bg-clip-text font-bold text-transparent ${
                    isDark
                      ? 'from-pink-300 via-amber-200 to-blue-300'
                      : 'from-pink-600 via-purple-500 to-sky-500'
                  }`}
                >
                  Genie
                </span>
              )}
            </span>

            <div className="text-xs font-semibold opacity-70">
              {dayjs(message?.created_at).fromNow()}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-2">
        <MemoizedReactMarkdown
          className="text-foreground prose prose-p:before:hidden prose-p:after:hidden prose-li:marker:text-foreground/80 prose-code:before:hidden prose-code:after:hidden prose-th:border-foreground/20 prose-th:border prose-th:text-center prose-th:text-lg prose-th:p-2 prose-td:p-2 prose-th:border-b-4 prose-td:border prose-tr:border-border dark:prose-invert prose-p:leading-relaxed prose-pre:p-2 w-[calc(100vw-8rem)] min-w-full break-words md:w-[38rem] lg:w-full"
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[rehypeKatex]}
          components={{
            h1({ children }) {
              return <h1 className="text-foreground mb-2 mt-6">{children}</h1>;
            },
            h2({ children }) {
              return <h2 className="text-foreground mb-2 mt-6">{children}</h2>;
            },
            h3({ children }) {
              return <h3 className="text-foreground mb-2 mt-6">{children}</h3>;
            },
            h4({ children }) {
              return <h4 className="text-foreground mb-2 mt-6">{children}</h4>;
            },
            h5({ children }) {
              return <h5 className="text-foreground mb-2 mt-6">{children}</h5>;
            },
            h6({ children }) {
              return <h6 className="text-foreground mb-2 mt-6">{children}</h6>;
            },
            strong({ children }) {
              return (
                <strong className="text-foreground font-semibold">
                  {children}
                </strong>
              );
            },
            a({ children, href }) {
              if (!href) return <>{children}</>;

              return (
                <Link href={href} className="text-foreground hover:underline">
                  {children}
                </Link>
              );
            },
            p({ children }) {
              // If the message is a followup, we will render it as a button
              if (
                Array.isArray(children) &&
                children?.[0] === '@' &&
                children?.[1]?.startsWith('<')
              ) {
                // content will be all the text after the @<*> excluding the last child
                const content = children
                  ?.slice(2, -1)
                  ?.map((child) => child?.toString())
                  ?.join('')
                  ?.trim();

                if (embeddedUrl)
                  return (
                    <Link
                      className="text-foreground bg-foreground/5 hover:bg-foreground/10 mb-2 inline-block rounded-full border text-left no-underline transition last:mb-0"
                      href={`${embeddedUrl}/${message?.chat_id}?input=${content}`}
                    >
                      <span className="line-clamp-1 px-3 py-1">
                        {content || '...'}
                      </span>
                    </Link>
                  );

                if (setInput)
                  return (
                    <button
                      className="text-foreground bg-foreground/5 hover:bg-foreground/10 mb-2 rounded-full border text-left transition last:mb-0"
                      onClick={() => setInput(content || '')}
                    >
                      <span className="line-clamp-1 px-3 py-1">
                        {content || '...'}
                      </span>
                    </button>
                  );

                return (
                  <span className="text-foreground bg-foreground/5 mb-2 inline-block rounded-full border text-left transition last:mb-0">
                    <span className="line-clamp-1 px-3 py-1">
                      {content || '...'}
                    </span>
                  </span>
                );
              }

              return (
                <p className="text-foreground mb-2 last:mb-0">{children}</p>
              );
            },
            blockquote({ children }) {
              return (
                <blockquote className="border-foreground/30 text-foreground/80 border-l-4 pl-2">
                  {children}
                </blockquote>
              );
            },
            code({ node, className, children, ...props }) {
              if (children && Array.isArray(children) && children.length) {
                if (children[0] == '▍') {
                  return (
                    <span
                      className={cn(
                        'mt-1 animate-pulse cursor-default',
                        className
                      )}
                    >
                      ▍
                    </span>
                  );
                }

                children[0] = (children[0] as string).replace('`▍`', '▍');
              }

              const match = /language-(\w+)/.exec(className || '');

              return match ? (
                <CodeBlock
                  key={Math.random()}
                  language={(match && match[1]) || ''}
                  value={String(children).replace(/\n$/, '')}
                  {...props}
                />
              ) : (
                <code
                  className={cn('text-foreground font-semibold', className)}
                  {...props}
                >
                  {children}
                </code>
              );
            },
            th({ children }) {
              return <th className="text-foreground">{children}</th>;
            },
            pre({ children }) {
              return (
                <pre className="bg-foreground/5 rounded-lg border">
                  {children}
                </pre>
              );
            },
          }}
        >
          {message.content}
        </MemoizedReactMarkdown>
      </div>
    </div>
  );
}
