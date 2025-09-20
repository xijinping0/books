import { source } from '@/lib/source';
import type { OramaDocument } from 'fumadocs-core/search/orama-cloud';

export async function exportSearchIndexes() {
  return source.getPages().map((page) => {
    const pagePaths = page.data._file?.path?.split('/') ?? [];
    const tag = pagePaths?.[0];

    return {
      id: page.url,
      structured: page.data.structuredData,
      url: page.url,
      title: page.data.title ?? '',
      description: page.data.description,
      tag,
    } satisfies OramaDocument;
  });
}
