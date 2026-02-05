// src/components/Favicon/Favicon.tsx
import Head from 'next/head';

export default function Favicon() {
  return (
    <Head>
      <link rel="apple-touch-icon" sizes="180x180" href="/app;le-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/android-chrome-512x512.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/android-chrome-192x192.png" />
      <link rel="manifest" href="/site.webmanifest" />
      <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#073020" />
      <meta name="msapplication-TileColor" content="#073020" />
      <meta name="theme-color" content="#073020" />
    </Head>
  );
}