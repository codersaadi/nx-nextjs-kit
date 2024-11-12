'use client';

import type { Blog } from 'contentlayer/generated';
import React from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { ArrowUpRight, Tag } from 'lucide-react';
import Image from 'next/image';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};
export default function RenderBlog({ posts }: { posts: Blog[] }) {
  return (
    <motion.div
      className="mt-16 grid gap-3 md:gap-8 sm:grid-cols-2 lg:grid-cols-3"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {posts.map((post) => (
        <motion.div key={post.slug} variants={item} className="group relative">
          <Link href={`/blog/${post.slug}`}>
            <article className="relative max-w-md mx-auto flex flex-col h-full overflow-hidden rounded-2xl transition-all duration-300  hover:border-neutral-700 hover:bg-neutral-800/50 hover:shadow-2xl hover:shadow-neutral-900/50">
              {post.image && (
                <div className="relative pt-1 overflow-hidden rounded-2xl aspect-video my-auto w-full mx-auto bg-neutral-800/50 group-hover:scale-105 transition-all duration-300 ">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="transition duration-300 blur-0  object-cover object-top  rounded-lg "
                  />
                </div>
              )}
              <div className="flex items-center flex-wrap justify-end w-full">
                {post.categories && post.categories.length > 0 && (
                  <div className="flex flex-wrap pt-3   justify-end pr-3 gap-2 ">
                    {post.categories.map((cat) => (
                      <span
                        key={cat}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                )}

                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap pt-3 justify-end pr-3 gap-2 ">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-500/10 text-neutral-400"
                      >
                        <Tag className="mr-1.5 h-3 w-3" /> {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="px-6 pt-2 pb-5">
                {/* Title & Description */}
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-neutral-100 group-hover:text-blue-400 transition-colors duration-300">
                    {post.title}
                  </h2>
                  <p className="mt-4 text-md leading-6 text-neutral-400">
                    {post.description}
                  </p>
                </div>
                {/* Category Tags */}

                {/* Metadata Footer */}
                <div className="mt-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <time
                      dateTime={post.date}
                      className="text-sm text-neutral-500"
                    >
                      {format(new Date(post.date), 'MMM d, yyyy')}
                    </time>
                    <span className="text-neutral-600">•</span>
                    <span className="text-sm text-neutral-500">
                      {post.readingTime?.text || '5 min read'}
                    </span>
                  </div>

                  <ArrowUpRight className="h-5 w-5 text-neutral-500 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-blue-400" />
                </div>

                {/* Hover Effects */}
                <div className="absolute inset-0 rounded-2xl transition duration-300 group-hover:bg-gradient-to-t group-hover:from-blue-500/5 group-hover:to-transparent" />
                <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-neutral-800 group-hover:ring-neutral-700 transition duration-300" />
              </div>
            </article>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
}
