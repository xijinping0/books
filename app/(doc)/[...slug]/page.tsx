import { source } from '@/lib/source';
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/page';
import { notFound } from 'next/navigation';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import { getMDXComponents } from '@/mdx-components';
import Link from 'fumadocs-core/link';
import React from 'react';
import { Metadata } from 'next';
import { BOOK_NAMES } from '@/lib/constants';
import { AbsoluteString } from 'next/dist/lib/metadata/types/metadata-types';

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
          <div className="flex flex-col gap-2">
            <Link
              href={`https://github.com/xijinping0/books/blob/main/content/${page.path}`}
              rel="noreferrer noopener"
              className="text-sm text-fd-muted-foreground hover:text-fd-accent-foreground transition-colors [overflow-wrap:anywhere]"
              external
              target="_blank"
            >
              在 GitHub 上编辑此页
            </Link>
            {/*<div className="my-10 flex flex-col gap-2">*/}
            {/*  <h2>*/}
            {/*    <b>评论</b>*/}
            {/*  </h2>*/}
            {/*  /!* Container with proper constraints for ToC placement *!/*/}
            {/*  <div className="relative max-w-full overflow-hidden">*/}
            {/*    <CommentBlock page={{ url: page.url, data: { title: page.data.title } }} />*/}
            {/*  </div>*/}
            {/*</div>*/}
          </div>
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
  return source.generateParams().filter((param) => {
    // Filter out the index page (empty slug or root path)
    return param.slug && param.slug.length > 0;
  });
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const params = await props.params;
  if (!params.slug || params.slug.length === 0) {
    return {};
  }

  const page = source.getPage(params.slug);
  if (!page) {
    return {};
  }

  const bookName = BOOK_NAMES[page.slugs?.[0]];
  const chapterName = page.data.title;
  const title: string | AbsoluteString =
    bookName === chapterName ? bookName : { absolute: `${chapterName} | ${bookName}` };

  return {
    title,
    description: page.data.description,
  };
}
