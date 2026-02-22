// src/components/ui/badge.tsx
import * as React from 'react'
import { cn } from '@/lib/utils'

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: 'default' | 'outline'
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const base = 'inline-flex items-center rounded-full px-3 py-1 text-xs'
  const styles =
    variant === 'outline'
      ? 'border border-token text-muted'
      : 'bg-white/10 text-text'
  return <span className={cn(base, styles, className)} {...props} />
}
