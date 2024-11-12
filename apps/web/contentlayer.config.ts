import { defineDocumentType, makeSource } from 'contentlayer2/source-files';
import readingTime from 'reading-time';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeCodeTitles from 'rehype-code-titles';
import rehypePrettyCode, { type Options } from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import remarkToc from 'remark-toc';
// Remote using github repo
import { spawn } from 'node:child_process';

const syncContentFromGit = async (contentDir: string) => {
  const syncRun = async () => {
    const gitUrl = 'https://github.com/vercel/next.js.git';
    await runBashCommand(`
      if [ -d  "${contentDir}" ];
        then
          cd "${contentDir}"; git pull;
        else
          git clone --depth 1 --single-branch ${gitUrl} ${contentDir};
      fi
    `);
  };

  let wasCancelled = false;
  let syncInterval: NodeJS.Timeout;

  const syncLoop = async () => {
    console.log('Syncing content files from git');

    await syncRun();

    if (wasCancelled) return;

    syncInterval = setTimeout(syncLoop, 1000 * 60);
  };

  // Block until the first sync is done
  await syncLoop();

  return () => {
    wasCancelled = true;
    clearTimeout(syncInterval);
  };
};

// Internal for syncContentFromGit
const runBashCommand = (command: string) =>
  new Promise((resolve, reject) => {
    const child = spawn(command, [], { shell: true });

    child.stdout.setEncoding('utf8');
    child.stdout.on('data', (data) => process.stdout.write(data));

    child.stderr.setEncoding('utf8');
    child.stderr.on('data', (data) => process.stderr.write(data));

    child.on('close', function (code) {
      if (code === 0) {
        resolve(void 0);
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });
  });

export const Blog = defineDocumentType(() => ({
  name: 'Blog',
  filePathPattern: '**/*.mdx',
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    date: { type: 'date', required: true },
    description: { type: 'string', required: true },
    image: { type: 'string', required: false },
    author: { type: 'string', default: 'Anonymous' },
    categories: { type: 'list', of: { type: 'string' }, default: [] },
    tags: { type: 'list', of: { type: 'string' }, default: [] },
    status: {
      type: 'string',
      options: ['draft', 'published'],
      default: 'published',
    },
  },
  computedFields: {
    readingTime: { type: 'json', resolve: (doc) => readingTime(doc.body.raw) },
    slug: { type: 'string', resolve: (doc) => doc._raw.flattenedPath },
    // toc: {
    //   type: 'json',
    //   resolve: async (doc) => {
    //     const regex = /\n(#{1,6})\s+(.+)/g;
    //     const headings = Array.from(doc.body.raw.matchAll(regex)).map((match) => {
    //       const flag = match[1];
    //       const content = match[2];
    //       return {
    //         level: flag?.length,
    //         text: content,
    //         slug: content?.toLowerCase().replace(/[^a-zA-Z0-9]+/g, '-')
    //       };
    //     });
    //     return headings;
    //   }
    // }
  },
}));

const rehypePrettyCodeOptions = {
  theme: 'github-dark',
  // onVisitLine(node) {

  //   if (node.children.length === 0) {
  //     node.children = [{ type: 'text', value: ' ' }]
  //   }
  // },
  // onVisitHighlightedLine(node) {
  //   node?.properties?.className?.push('highlighted')
  // },
} satisfies Options;

type RehypePluginIgnore = () => undefined;
interface SyncOpts {
  type: 'remote' | 'local';
}
const syncType = 'local' as SyncOpts['type'];
const syncArgs =
  syncType === 'remote'
    ? {
        contentDirPath: 'apps/web',
        syncFiles: syncContentFromGit,
        contentDirInclude: ['docs'],
      }
    : {
        contentDirPath: 'content',
      };
export default makeSource({
  ...syncArgs,
  disableImportAliasWarning: true,
  documentTypes: [Blog],
  mdx: {
    remarkPlugins: [remarkGfm, [remarkToc, { heading: 'Table of Contents' }]],
    rehypePlugins: [
      rehypeSlug,
      [rehypeCodeTitles, {}],
      [rehypePrettyCode as RehypePluginIgnore, rehypePrettyCodeOptions],
      [rehypeAutolinkHeadings, { behavior: 'wrap' }],
    ],
  },
});
