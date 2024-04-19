import { cn } from '@/lib/utils';

interface InputCardProps {
  title: string;
  description?: string;
  className?: string;
  children: React.ReactNode;
}

export default function InputCard({
  title,
  description,
  className,
  children,
}: InputCardProps) {
  return (
    <>
      <div className={cn('grid', className)}>
        <div className="text-2xl font-bold">{title}</div>
        {description && (
          <div className="text-foreground/80 whitespace-pre-line font-semibold">
            {description}
          </div>
        )}

        <div className="my-2">{children}</div>
      </div>
    </>
  );
}
