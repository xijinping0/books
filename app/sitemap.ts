import { MetadataRoute } from 'next';
import { source } from '@/lib/source';

export const dynamic = 'force-static';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return source.getPages().map((page) => ({
    url: `https://books.xijinping.one${page.url}`,
    lastModified: page.data.lastModified ? new Date(page.data.lastModified) : new Date(),
    changeFrequency: 'weekly',
    priority: page.url === '/' ? 1 : 0.8,
  }));
}
