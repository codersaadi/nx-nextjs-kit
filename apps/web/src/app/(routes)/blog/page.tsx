import { allBlogs } from 'contentlayer/generated';
import { compareDesc } from 'date-fns';
import { Categories } from '@web/components/blog/Categories';
import RenderBlog from '@web/components/blog/RenderBlog';
import { Search } from '@web/components/blog/Search';

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const resolvedParams = await searchParams;
  // Get all unique categories
  const categories = Array.from(
    new Set(allBlogs.flatMap((post) => post.categories))
  );

  // Filter posts by category
  const filteredPosts =
    resolvedParams.category && resolvedParams.category !== 'All'
      ? allBlogs.filter((post) =>
          post.categories.includes(
            typeof resolvedParams.category === 'string'
              ? resolvedParams.category
              : ''
          )
        )
      : allBlogs;

  const posts = filteredPosts.sort((a, b) =>
    compareDesc(new Date(a.date), new Date(b.date))
  );

  return (
    <div className="relative min-h-screen bg-background ">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        {/* Header with Search */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold tracking-tight text-gray-800  dark:text-zinc-100 sm:text-5xl">
              Blog
            </h1>
            <p className="mt-4 dark:text-zinc-400 text-zinc-800 text-lg">
              Thoughts on programming, design, and building digital products.
            </p>
          </div>
          <Search posts={allBlogs} />
        </div>

        {/* Categories */}
        <div className="mt-8">
          <Categories categories={categories} />
        </div>

        {/* Blog Posts */}
        <RenderBlog posts={posts} />
      </div>
    </div>
  );
}
