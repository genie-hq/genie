import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface InputCardProps {
  title: string;
  description?: string;
  className?: string;
  children: ReactNode;
  childrenClassName?: string;
}

export default function InputCard({
  title,
  description,
  className,
  children,
  childrenClassName,
}: InputCardProps) {
  return (
    <>
      <div className={cn('grid', className)}>
        <div className="text-lg md:text-xl font-bold">{title}</div>
        {description && (
          <div className="text-foreground/80 whitespace-pre-line font-semibold">
            {description}
          </div>
        )}

        <div className={cn('my-2', childrenClassName)}>{children}</div>
      </div>
    </>
  );
}
