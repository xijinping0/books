'use client';

import { ReactCusdis } from 'react-cusdis';
import React, { useEffect, useRef, useState } from 'react';
import { type Page } from 'fumadocs-core/source';

interface CommentBlockProps {
  page: Pick<Page, 'url' | 'data'>;
}

const CommentBlock = ({ page }: CommentBlockProps) => {
  const host = process.env.NEXT_PUBLIC_CUSDIS_HOST;
  const appId = process.env.NEXT_PUBLIC_CUSDIS_APP_ID;
  const [iframeHeight, setIframeHeight] = useState(400);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    let resizeObserver: ResizeObserver | null = null;

    const getMaxHeight = () => {
      if (!containerRef.current) return Math.floor(window.innerHeight * 0.8);

      // Get the container's position relative to viewport
      const containerRect = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Calculate available space from container top to bottom of viewport
      const availableHeight = viewportHeight - containerRect.top;

      // Use 80% of available space, but don't exceed 80% of total viewport
      const maxFromAvailable = Math.floor(availableHeight * 0.8);
      const maxFromViewport = Math.floor(viewportHeight * 0.8);

      // Use the smaller of the two, with a reasonable minimum
      return Math.max(Math.min(maxFromAvailable, maxFromViewport), 300);
    };

    const adjustIframeHeight = () => {
      const iframe = document.querySelector('#cusdis_thread iframe') as HTMLIFrameElement;
      if (!iframe) return;

      const maxHeight = getMaxHeight();

      try {
        // Method 1: Try to access iframe content (works if same-origin)
        if (iframe.contentWindow?.document?.body) {
          const scrollHeight = iframe.contentWindow.document.body.scrollHeight;
          if (scrollHeight > 0 && scrollHeight !== iframeHeight) {
            const newHeight = Math.min(Math.max(scrollHeight + 20, 400), maxHeight);
            setIframeHeight(newHeight);
          }
        }
      } catch (error) {
        // Cross-origin - use alternative methods

        // Method 2: Observe iframe size changes
        if (window.ResizeObserver && !resizeObserver) {
          resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
              const newHeight = entry.contentRect.height;
              if (newHeight > 0 && newHeight !== iframeHeight) {
                const cappedHeight = Math.min(Math.max(newHeight + 20, 400), maxHeight);
                setIframeHeight(cappedHeight);
              }
            }
          });
          resizeObserver.observe(iframe);
        }
      }
    };

    // Listen for postMessage events from Cusdis
    const handleMessage = (event: MessageEvent) => {
      // Check if it's from Cusdis iframe
      const iframe = document.querySelector('#cusdis_thread iframe') as HTMLIFrameElement;
      if (iframe && event.source === iframe.contentWindow) {
        const maxHeight = getMaxHeight();

        if (event.data && typeof event.data.height === 'number') {
          const cappedHeight = Math.min(Math.max(event.data.height + 20, 400), maxHeight);
          setIframeHeight(cappedHeight);
        }
        // Some systems send data as string
        if (typeof event.data === 'string' && event.data.includes('height')) {
          try {
            const data = JSON.parse(event.data);
            if (data.height) {
              const cappedHeight = Math.min(Math.max(data.height + 20, 400), maxHeight);
              setIframeHeight(cappedHeight);
            }
          } catch (e) {
            // Ignore parsing errors
          }
        }
      }
    };

    // Handle window resize and scroll to recalculate max height
    const handleWindowChange = () => {
      const maxHeight = getMaxHeight();
      if (iframeHeight > maxHeight) {
        setIframeHeight(maxHeight);
      }
    };

    // Wait for iframe to load
    const setupObserver = () => {
      adjustIframeHeight();

      // Set up periodic checking
      intervalId = setInterval(adjustIframeHeight, 2000);

      // Listen for messages, window resize, and scroll
      window.addEventListener('message', handleMessage);
      window.addEventListener('resize', handleWindowChange);
      window.addEventListener('scroll', handleWindowChange);
    };

    // Wait a bit for ReactCusdis to render
    const timeoutId = setTimeout(setupObserver, 1000);

    return () => {
      clearTimeout(timeoutId);
      if (intervalId) {
        clearInterval(intervalId);
      }
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      window.removeEventListener('message', handleMessage);
      window.removeEventListener('resize', handleWindowChange);
      window.removeEventListener('scroll', handleWindowChange);
    };
  }, [iframeHeight]);

  if (host == null || appId == null) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      style={{
        minHeight: `${iframeHeight}px`,
        maxHeight: '80vh',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <ReactCusdis
        lang="zh-cn"
        attrs={{
          host,
          appId,
          pageId: page.url,
          pageTitle: page.data.title,
          pageUrl: page.url,
          theme: 'auto',
        }}
        style={{
          display: 'flex',
          minHeight: `${iframeHeight}px`,
          maxHeight: '80vh',
        }}
      />
      <style jsx>{`
        :global(#cusdis_thread iframe) {
          height: ${iframeHeight}px !important;
          max-height: 100vh !important;
          min-height: 400px !important;
          width: 100% !important;
          border: none !important;
          overflow-y: auto !important;
        }
        :global(#cusdis_thread) {
          max-height: 100vh !important;
          overflow-y: auto !important;
          position: relative !important;
        }
      `}</style>
    </div>
  );
};

export default CommentBlock;
