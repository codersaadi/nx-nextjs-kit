'use client';
import useContentSearch from './use-content-search';
import type { Blog } from 'contentlayer/generated';
import { motion, AnimatePresence } from 'framer-motion';
import { Search as SearchIcon, X, ArrowRight, Calendar } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

import Image from 'next/image';
interface SearchProps {
  posts: Blog[];
}

export function Search({ posts }: SearchProps) {
  const { isOpen, setIsOpen, query, setQuery, results } = useContentSearch({
    posts,
  });
  return (
    <>
      {/* Search Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="group flex items-center gap-2 rounded-full bg-zinc-800/50 px-4 py-2 text-sm text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-100"
      >
        <SearchIcon className="h-4 w-4" />
        <span>Search posts...</span>
        <kbd className="hidden rounded bg-zinc-700 px-2 py-0.5 text-xs font-light text-zinc-400 sm:inline-block">
          ⌘K
        </kbd>
      </button>

      {/* Search Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative mx-auto mt-20 max-w-xl"
            >
              <div className="overflow-hidden rounded-2xl bg-zinc-900 shadow-2xl ring-1 ring-zinc-800">
                {/* Search Input */}
                <div className="flex items-center border-b border-zinc-800 px-4">
                  <SearchIcon className="h-5 w-5 text-zinc-500" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search posts..."
                    className="flex-1 bg-transparent px-4 py-4 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none"
                  />
                  {query && (
                    <button
                      type="button"
                      onClick={() => setQuery('')}
                      className="rounded p-1 hover:bg-zinc-800"
                    >
                      <X className="h-4 w-4 text-zinc-500" />
                    </button>
                  )}
                </div>

                {/* Search Results */}
                <div className="max-h-[60vh] overflow-y-auto overscroll-contain p-2">
                  {results.length > 0 ? (
                    <div className="space-y-1">
                      {results.map((post) => (
                        <Link
                          key={post.slug}
                          href={`/blog/${post.slug}`}
                          onClick={() => setIsOpen(false)}
                          className="group flex items-center gap-4 rounded-lg p-3 transition-colors hover:bg-zinc-800/50"
                        >
                          {post.image && (
                            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg">
                              <Image
                                src={post.image}
                                alt={post.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                          <div className="flex-1 overflow-hidden">
                            <h3 className="truncate text-sm font-medium text-zinc-100 group-hover:text-blue-400">
                              {post.title}
                            </h3>
                            <div className="mt-1 flex items-center gap-3 text-xs text-zinc-500">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {format(new Date(post.date), 'MMM d, yyyy')}
                              </span>
                              {post.categories?.[0] && (
                                <span className="rounded-full bg-zinc-800 px-2 py-0.5">
                                  {post.categories[0]}
                                </span>
                              )}
                            </div>
                          </div>
                          <ArrowRight className="h-4 w-4 text-zinc-500 transition-transform group-hover:translate-x-1 group-hover:text-blue-400" />
                        </Link>
                      ))}
                    </div>
                  ) : query ? (
                    <div className="p-6 text-center text-sm text-zinc-500">
                      No posts found for "{query}"
                    </div>
                  ) : null}
                </div>

                {/* Search Tips */}
                <div className="border-t border-zinc-800 p-4">
                  <div className="flex items-center justify-between text-xs text-zinc-500">
                    <div>
                      <span className="font-medium text-zinc-400">Tip:</span>{' '}
                      Search by title, description, categories, or tags
                    </div>
                    <kbd className="rounded bg-zinc-800 px-2 py-0.5">ESC</kbd>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
