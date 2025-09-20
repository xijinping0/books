import { source } from '@/lib/source';
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/page';
import { notFound } from 'next/navigation';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import { getMDXComponents } from '@/mdx-components';
import Link from 'fumadocs-core/link';
import React from 'react';
import { Metadata } from 'next';

export default async function Page(props: { params: Promise<{ slug?: string[] }> }) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) {
    return notFound();
  }

  const MDXContent = page.data.body;
  const toc = page.data.toc?.length ? page.data.toc : undefined;

  return (
    <DocsPage
      toc={toc}
      tableOfContent={{
        style: 'clerk',
        footer: (
          <Link
            href={`https://github.com/xijinping0/books/blob/main/content/${page.path}`}
            rel="noreferrer noopener"
            className="text-sm text-fd-muted-foreground hover:text-fd-accent-foreground transition-colors [overflow-wrap:anywhere]"
            external
            target="_blank"
          >
            在 GitHub 上编辑此页
          </Link>
        ),
      }}
      full={page.data.full}
      lastUpdate={page.data.lastModified}
      breadcrumb={{
        enabled: true,
        includeRoot: true,
        includePage: true,
      }}
    >
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <MDXContent
          components={getMDXComponents({
            // this allows you to link to other pages with relative file paths
            a: createRelativeLink(source, page),
          })}
        />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) {
    return {};
  }

  return {
    title: page.data.title,
    description: page.data.description,
  };
}
