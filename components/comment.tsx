'use client';

import { ReactCusdis } from 'react-cusdis';
import React from 'react';
import { type Page } from 'fumadocs-core/source';

interface CommentBlockProps {
  page: Pick<Page, 'url' | 'data'>;
}

const CommentBlock = ({ page }: CommentBlockProps) => {
  const host = process.env.NEXT_PUBLIC_CUSDIS_HOST;
  const appId = process.env.NEXT_PUBLIC_CUSDIS_APP_ID;

  if (host == null || appId == null) {
    return null;
  }

  return (
    <div style={{ minHeight: '400px' }}>
      <ReactCusdis
        lang="zh-cn"
        attrs={{
          host,
          appId,
          pageId: page.url,
          pageTitle: page.data.title,
          pageUrl: page.url,
        }}
        style={{
          display: 'flex',
          minHeight: '400px',
        }}
      />
      <style jsx>{`
        :global(#cusdis_thread iframe) {
          min-height: 400px !important;
          height: auto !important;
        }
      `}</style>
    </div>
  );
};

export default CommentBlock;
