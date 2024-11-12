import type { Blog } from 'contentlayer/generated';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { ArrowUpRight } from 'lucide-react';

export function RelatedPosts({
  currentPost,
  posts,
}: {
  currentPost: Blog;
  posts: Blog[];
}) {
  // Find posts with matching categories or tags
  const relatedPosts = posts
    .filter((post) => post.slug !== currentPost.slug) // Exclude current post
    .filter((post) => {
      const matchingCategories = post.categories?.some((cat) =>
        currentPost.categories?.includes(cat)
      );
      const matchingTags = post.tags?.some((tag) =>
        currentPost.tags?.includes(tag)
      );
      return matchingCategories || matchingTags;
    })
    .slice(0, 3); // Get top 3 related posts

  if (relatedPosts.length === 0) return null;

  return (
    <section className="mt-16 border-t border-zinc-800 pt-16">
      <h2 className="text-2xl font-bold text-zinc-100 mb-8">Related Posts</h2>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {relatedPosts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group relative flex flex-col overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50 transition-all duration-300 hover:bg-zinc-800/50 hover:shadow-xl hover:shadow-zinc-900/50"
          >
            {post.image && (
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            )}
            <div className="flex flex-1 flex-col p-4">
              {/* Categories */}
              {post.categories && post.categories.length > 0 && (
                <div className="mb-2 flex flex-wrap gap-2">
                  {post.categories.map((category) => (
                    <span
                      key={category}
                      className="inline-flex items-center rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-medium text-blue-400 ring-1 ring-inset ring-blue-500/20"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              )}

              {/* Title & Meta */}
              <h3 className="text-lg font-semibold text-zinc-100 group-hover:text-blue-400 line-clamp-2">
                {post.title}
              </h3>
              <p className="mt-2 text-sm text-zinc-400 line-clamp-2">
                {post.description}
              </p>

              <div className="mt-4 flex items-center justify-between text-sm">
                <time className="text-zinc-500">
                  {format(new Date(post.date), 'MMM d, yyyy')}
                </time>
                <ArrowUpRight className="h-4 w-4 text-zinc-500 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-blue-400" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
