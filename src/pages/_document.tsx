import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta
          name="description"
          content="Fancy Time application for a mini hackaton."
        />
        <meta
          httpEquiv="Content-Security-Policy"
          content="default-src 'self' https: localhost:* data: http://unpkg.com; script-src 'unsafe-eval' https: localhost:* blob:; style-src 'unsafe-inline' https:;"
        />
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta name="referrer" content="same-origin" />
        <link rel="icon" href="./favicon.ico" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
