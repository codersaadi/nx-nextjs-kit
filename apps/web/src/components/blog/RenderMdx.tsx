import { CodeBlock } from './CodeBlock';
import { getMDXComponent } from 'next-contentlayer2/hooks';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const components = {
  img: ({ src, alt, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => {
    if (
      src &&
      typeof src === 'string' &&
      (src.startsWith('/') || src.startsWith('https') || src.startsWith('http'))
    ) {
      return (
        <div className="relative w-full h-64">
          <Image
            fill
            className="object-contain"
            src={src}
            alt={alt || ''}
            sizes="(max-width: 768px) 100vw, 768px"
          />
        </div>
      );
    }
  },
  a: ({ href, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    if (href?.startsWith('/')) {
      return <Link href={href} {...props} />;
    }
    return (
      <a target="_blank" rel="noopener noreferrer" href={href} {...props} />
    );
  },
  pre: ({ children, ...props }: React.HTMLAttributes<HTMLPreElement>) => {
    return <CodeBlock {...props}>{children}</CodeBlock>;
  },
};

interface MDXContentProps {
  code: string;
}

export default function RenderMdx({ code }: MDXContentProps) {
  const Content = getMDXComponent(code);
  return <Content components={components} />;
}
