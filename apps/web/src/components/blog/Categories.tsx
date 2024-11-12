'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@org/shared/lib/utils';
interface CategoriesProps {
  categories: string[];
}

export function Categories({ categories }: CategoriesProps) {
  const searchParams = useSearchParams();
  const category = searchParams.get('category');
  const pathname = usePathname();

  return (
    <div className="relative">
      {/* Category Stats */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-200">
          Categories
          <span className="ml-2 text-sm text-zinc-500 dark:text-zinc-400">
            ({categories.length})
          </span>
        </h2>
      </div>

      {/* Categories List */}
      <div className="flex flex-wrap items-center gap-3">
        <Link href={pathname} className="relative">
          <div
            className={cn(
              'relative z-10 rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
              !category
                ? 'text-zinc-100'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
            )}
          >
            All
          </div>
          {!category && (
            <motion.div
              layoutId="category-bg"
              className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/80 to-blue-600/80 dark:blur-sm"
            />
          )}
        </Link>

        {categories.map((cat) => (
          <Link
            key={cat}
            href={`${pathname}?category=${cat}`}
            className="relative"
          >
            <div
              className={cn(
                'relative z-10 rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
                category === cat
                  ? 'text-zinc-100'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
              )}
            >
              {cat}
            </div>
            {category === cat && (
              <motion.div
                layoutId="category-bg"
                className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/80 to-blue-600/80 dark:blur-sm"
              />
            )}
          </Link>
        ))}
      </div>

      {/* Active Category Info */}
      {category && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 rounded-lg border border-zinc-200/50 dark:border-zinc-800/50 bg-zinc-50/50 dark:bg-zinc-900/50 p-4"
        >
          <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
            Showing posts in category:
          </h3>
          <p className="mt-1 text-2xl font-semibold text-blue-600 dark:text-blue-400">
            {category}
          </p>
        </motion.div>
      )}
    </div>
  );
}
