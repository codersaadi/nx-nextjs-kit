import { allBlogs } from 'contentlayer/generated';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Calendar, Clock, Tag } from 'lucide-react';
import { RelatedPosts } from '@web/components/blog/RelatedPosts';
import MdxContent from '@web/components/blog/RenderMdx';
interface PromiseParams<T> {
  params: Promise<T>;
}

export const generateStaticParams = async () =>
  allBlogs.map((post) => ({ slug: post._raw.flattenedPath }));

export const generateMetadata = async ({
  params: paramsPromise,
}: PromiseParams<{ slug: string }>) => {
  const params = await paramsPromise;
  const post = allBlogs.find((post) => post._raw.flattenedPath === params.slug);
  if (!post) throw new Error(`Post not found for slug: ${params.slug}`);
  return { title: post.title };
};

const getPost = (slug: string) => {
  const post = allBlogs.find((post) => post.slug === slug);
  if (!post) notFound();
  return post;
};

export default async function BlogPost({
  params,
}: PromiseParams<{ slug: string }>) {
  const resolvedParams = await params;
  const post = getPost(resolvedParams.slug);

  return (
    <div className="relative min-h-screen  dark">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="mx-auto max-w-2xl">
          {/* Back button */}
          <Link
            href="/blog"
            className="group inline-flex items-center text-sm text-zinc-400 hover:text-zinc-100 mb-8"
          >
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to blog
          </Link>

          <article className="prose prose-invert  max-w-none">
            {/* Post header */}
            <header className="mb-12 not-prose">
              {post.image && (
                <div className="relative h-[400px]  w-full mb-8 overflow-hidden rounded-xl">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              <h1 className="text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl">
                {post.title}
              </h1>

              <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-zinc-400">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <time dateTime={post.date}>
                    {format(new Date(post.date), 'MMMM d, yyyy')}
                  </time>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{post.readingTime.text}</span>
                </div>
              </div>

              {/* Categories and Tags */}
              <div className="mt-6 flex flex-wrap gap-4">
                {post.categories && post.categories.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {post.categories.map((category) => (
                      <span
                        key={category}
                        className="inline-flex items-center rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400 ring-1 ring-inset ring-blue-500/20"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                )}

                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center rounded-full bg-zinc-800 px-3 py-1 text-xs font-medium text-zinc-400"
                      >
                        <Tag className="mr-1.5 h-3 w-3" />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </header>

            {/* Post content */}
            <div className="mt-8">
              <MdxContent code={post.body.code} />
            </div>
          </article>

          {/* Related Posts */}
        </div>
        <RelatedPosts currentPost={post} posts={allBlogs} />
      </div>
    </div>
  );
}
