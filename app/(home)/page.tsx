import { source } from '@/lib/source';
import { notFound } from 'next/navigation';
import defaultMdxComponents from 'fumadocs-ui/mdx';

export default async function HomePage() {
  const page = source.getPage([]);

  if (!page) {
    notFound();
  }

  const MDX = page.data.body;

  return (
    <div className="container py-12 max-w-xl">
      <article className="prose prose-neutral dark:prose-invert max-w-none">
        <MDX components={defaultMdxComponents} />
      </article>
    </div>
  );
}
