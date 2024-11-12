import React from 'react';
import { useState, useCallback, useEffect } from 'react';
import { useDebounce } from '@org/shared/hooks/useDebounce';
import type { Blog } from 'contentlayer/generated';

interface SearchProps {
  posts: Blog[];
}

export default function useContentSearch({ posts }: SearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);
  const [results, setResults] = useState<Blog[]>([]);

  const searchPosts = useCallback(() => {
    if (!debouncedQuery) {
      setResults([]);
      return;
    }

    const searchResults = posts.filter((post) => {
      const searchContent = `
        ${post.title} 
        ${post.description} 
        ${post.categories?.join(' ')} 
        ${post.tags?.join(' ')}
      `.toLowerCase();

      return searchContent.includes(debouncedQuery.toLowerCase());
    });

    setResults(searchResults);
  }, [debouncedQuery, posts]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    searchPosts();
  }, [debouncedQuery, searchPosts]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return {
    isOpen,
    setIsOpen,
    query,
    setQuery,
    results,
  };
}
