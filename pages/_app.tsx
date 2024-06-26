import type { AppProps } from 'next/app';
import PlausibleProvider from "next-plausible";
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"

function App({ Component, pageProps }: AppProps) {
  const isProduction = process.env.NEXT_PUBLIC_VERCEL_ENV === 'production';

  return (
    <PlausibleProvider domain="xijinping.one" enabled={isProduction}>
      <Component {...pageProps} />
      <Analytics />
      <SpeedInsights />
    </PlausibleProvider>
  );
}

export default App;
