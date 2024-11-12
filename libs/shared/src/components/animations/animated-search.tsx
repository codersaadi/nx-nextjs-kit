'use client';
import React, { useState } from 'react';
import { cn } from '../../lib/utils';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';

interface AnimatedSearchProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  iconClassName?: string;
  containerClassName?: string;
  placeholder?: string;
  expanded?: boolean;
  defaultExpanded?: boolean;
  onSearch?: (value: string) => void;
  iconPosition?: 'left' | 'right';
  variant?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: {
    container: 'h-8',
    input: 'text-sm h-8',
    icon: 'w-4 h-4',
    expandedWidth: 'w-48',
  },
  md: {
    container: 'h-10',
    input: 'text-base h-10',
    icon: 'w-5 h-5',
    expandedWidth: 'w-64',
  },
  lg: {
    container: 'h-12',
    input: 'text-lg h-12',
    icon: 'w-6 h-6',
    expandedWidth: 'w-72',
  },
};

export function AnimatedSearch({
  className,
  iconClassName,
  containerClassName,
  placeholder = 'Search...',
  expanded: controlledExpanded,
  defaultExpanded = false,
  onSearch,
  iconPosition = 'left',
  variant = 'md',
  ...props
}: AnimatedSearchProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [isFocused, setIsFocused] = useState(false);

  const expanded = controlledExpanded ?? isExpanded;
  const sizeConfig = sizeClasses[variant];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = (
      e.currentTarget.elements.namedItem('search') as HTMLInputElement
    )?.value;
    onSearch?.(value);
  };

  const toggleExpand = () => {
    if (!controlledExpanded) {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        'relative inline-flex items-center',
        sizeConfig.container,
        containerClassName
      )}
    >
      <div
        className={cn(
          'relative overflow-hidden rounded-full',
          'transition-all duration-300 ease-in-out',
          'bg-background border border-input hover:border-accent',
          'flex items-center',
          sizeConfig.container,
          expanded ? sizeConfig.expandedWidth : 'w-10',
          isFocused && 'ring-1 ring-ring',
          expanded
            ? 'px-3 gap-2'
            : iconPosition === 'left'
            ? 'pl-3 pr-2'
            : 'pr-3 pl-2',
          !expanded && 'justify-center',
          className
        )}
      >
        {iconPosition === 'left' && (
          <MagnifyingGlassIcon
            className={cn(
              'cursor-pointer',
              sizeConfig.icon,
              'text-muted-foreground transition-colors hover:text-foreground',
              iconClassName
            )}
            onClick={toggleExpand}
          />
        )}

        <input
          type="search"
          name="search"
          placeholder={expanded ? placeholder : ''}
          className={cn(
            'w-full bg-transparent outline-none placeholder:text-muted-foreground',
            'transition-all duration-300 ease-in-out',
            expanded ? 'opacity-100' : 'opacity-0 w-0',
            sizeConfig.input
          )}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />

        {iconPosition === 'right' && (
          <MagnifyingGlassIcon
            className={cn(
              'cursor-pointer',
              sizeConfig.icon,
              'text-muted-foreground transition-colors hover:text-foreground',
              iconClassName
            )}
            onClick={toggleExpand}
          />
        )}
      </div>
    </form>
  );
}