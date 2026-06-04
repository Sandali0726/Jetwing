import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Card({ children, className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-xl shadow-sm overflow-hidden border",
        className
      )}
      style={{borderColor: '#E5E5E5'}}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className, ...props }: CardProps) {
  return (
    <div className={cn("p-6 pb-3", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn("text-lg font-semibold", className)} {...props} style={{color: '#8B9E23'}}>
      {children}
    </h3>
  );
}

export function CardContent({ children, className, ...props }: CardProps) {
  return (
    <div className={cn("p-6 pt-0 min-w-0", className)} {...props}>
      {children}
    </div>
  );
}
