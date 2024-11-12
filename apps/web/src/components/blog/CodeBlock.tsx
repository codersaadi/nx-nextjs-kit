'use client';
import { Check, Copy } from 'lucide-react';
import { useState } from 'react';

interface CodeBlockProps {
  children: React.ReactNode;
  className?: string;
  filename?: string;
}
import React from 'react';

export function CodeBlock({ children, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    const code = getCodeFromChildren(children);
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getCodeFromChildren = (children: React.ReactNode): string => {
    let code = '';
    React.Children.forEach(children, (child) => {
      if (typeof child === 'string') {
        code += child;
      } else if (React.isValidElement(child) && child.props.children) {
        code += getCodeFromChildren(child.props.children);
      }
    });
    return code;
  };

  return (
    <div className="group relative">
      {/* {filename && (
        <div className="absolute top-0 left-0 right-0 -mt-8 rounded-t-lg bg-zinc-800/80 px-4 py-2 font-mono text-xs text-zinc-400">
          {filename}
        </div>
      )} */}
      <pre
        className={`${className} 
         overflow-x-auto p-4`}
      >
        <div className="absolute right-4 top-4 opacity-0 transition group-hover:opacity-100">
          <button
            type="button"
            onClick={copy}
            className="rounded-lg bg-zinc-700 p-2 hover:bg-zinc-600"
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-400" />
            ) : (
              <Copy className="h-4 w-4 text-zinc-400" />
            )}
          </button>
        </div>
        {children}
      </pre>
    </div>
  );
}
