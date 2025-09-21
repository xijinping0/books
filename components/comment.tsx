'use client';

import { ReactCusdis } from 'react-cusdis';
import React, { useEffect, useState } from 'react';
import { type Page } from 'fumadocs-core/source';

interface CommentBlockProps {
  page: Pick<Page, 'url' | 'data'>;
}

const CommentBlock = ({ page }: CommentBlockProps) => {
  const host = process.env.NEXT_PUBLIC_CUSDIS_HOST;
  const appId = process.env.NEXT_PUBLIC_CUSDIS_APP_ID;
  const [iframeHeight, setIframeHeight] = useState(600); // Start larger

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    let observerSetup = false;

    const detectHeightChange = () => {
      const iframe = document.querySelector('#cusdis_thread iframe') as HTMLIFrameElement;
      if (!iframe) {
        return;
      }

      // Method 1: Check iframe's natural height
      const iframeRect = iframe.getBoundingClientRect();
      if (iframeRect.height > 0 && Math.abs(iframeRect.height - iframeHeight) > 10) {
        setIframeHeight(Math.max(iframeRect.height + 50, 400));
      }

      // Method 2: Try content access
      try {
        if (iframe.contentWindow?.document?.body) {
          const contentHeight = Math.max(
            iframe.contentWindow.document.body.scrollHeight,
            iframe.contentWindow.document.body.offsetHeight,
            iframe.contentWindow.document.documentElement.scrollHeight,
            iframe.contentWindow.document.documentElement.offsetHeight,
          );

          if (contentHeight > 0 && Math.abs(contentHeight - iframeHeight) > 10) {
            setIframeHeight(Math.max(contentHeight + 50, 400));
          }
        }
      } catch (error) {
        // Cross-origin blocked
      }

      // Set up mutation observer if not already done
      if (!observerSetup && iframe.contentWindow) {
        try {
          const observer = new MutationObserver(() => {
            // Debounce the height check
            setTimeout(detectHeightChange, 100);
          });

          if (iframe.contentWindow.document?.body) {
            observer.observe(iframe.contentWindow.document.body, {
              childList: true,
              subtree: true,
              attributes: true,
            });
            observerSetup = true;
          }
        } catch (error) {
          // Cross-origin blocked
        }
      }
    };

    // More frequent checking initially, then less frequent
    const setupPeriodicCheck = () => {
      // Check every 500ms for the first 10 seconds
      let checkCount = 0;
      const frequentCheck = setInterval(() => {
        detectHeightChange();
        checkCount++;
        if (checkCount >= 20) {
          // 10 seconds
          clearInterval(frequentCheck);
          // Then check every 3 seconds
          intervalId = setInterval(detectHeightChange, 3000);
        }
      }, 500);
    };

    // Listen for various events that might indicate content change
    const handleMessage = (event: MessageEvent) => {
      const iframe = document.querySelector('#cusdis_thread iframe') as HTMLIFrameElement;
      if (iframe && event.source === iframe.contentWindow) {
        setTimeout(detectHeightChange, 100);
      }
    };

    const handleLoad = () => {
      setTimeout(detectHeightChange, 500);
    };

    // Start monitoring after a delay
    const timeoutId = setTimeout(() => {
      detectHeightChange();
      setupPeriodicCheck();

      window.addEventListener('message', handleMessage);
      window.addEventListener('load', handleLoad);
    }, 1000);

    return () => {
      clearTimeout(timeoutId);
      if (intervalId) {
        clearInterval(intervalId);
      }
      window.removeEventListener('message', handleMessage);
      window.removeEventListener('load', handleLoad);
    };
  }, [iframeHeight]);

  if (host == null || appId == null) {
    return null;
  }

  return (
    <div
      style={{
        minHeight: `${iframeHeight}px`,
        transition: 'min-height 0.3s ease-in-out', // Smooth transitions
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
        }}
        style={{
          display: 'flex',
          minHeight: `${iframeHeight}px`,
        }}
      />
      <style jsx>{`
        :global(#cusdis_thread iframe) {
          height: ${iframeHeight}px !important;
          min-height: 400px !important;
          width: 100% !important;
          border: none !important;
          overflow: hidden !important;
        }
        :global(#cusdis_thread) {
          overflow: visible !important;
        }
      `}</style>
    </div>
  );
};

export default CommentBlock;
