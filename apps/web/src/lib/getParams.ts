import type { Params } from 'next/dist/shared/lib/router/utils/route-matcher';
import type { z } from 'zod';
export type SearchParams = Record<string, string | null | number>;
export function getParamsStrict<T extends z.ZodTypeAny>(
  params: Params | string | number | null,
  schema: T
) {
  const result = schema.parse(params);
  return result as Zod.infer<T>;
}
export function getSearchParams<T extends z.AnyZodObject>(
  searchParams: SearchParams,
  schema: T
) {
  const result = schema.parse(searchParams);
  return result as Zod.infer<T>;
}
