import React from 'react';
import { HelmetData } from 'react-helmet';

interface DocumentProps {
  content: string;
  helmet: HelmetData;
  state: any;
  css: React.ReactNode;
  linkTags: React.ReactNode;
  styleTags: React.ReactNode;
  scriptTags: React.ReactNode;
}

export function Document({
  content,
  css,
  helmet,
  state,
  linkTags,
  styleTags,
  scriptTags,
}: DocumentProps) {
  return (
    <html lang="sk">
      <head>
        <meta charSet="UTF-8" />
        <meta name="google" content="notranslate" />
        <meta property="og:site_name" content="Tip for science" />
        <meta property="og:type" content="website" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="HandheldFriendly" content="true" />
        {helmet.title.toComponent()}
        {helmet.meta.toComponent()}
        {helmet.link.toComponent()}
        {css}
        {linkTags}
        {styleTags}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Raleway:wght@900&display=swap"
          rel="stylesheet"
        ></link>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Jost:wght@300;400;700&display=swap"
          rel="stylesheet"
        ></link>
        {css}
      </head>
      <body>
        <div id="root" dangerouslySetInnerHTML={{ __html: content }} />
        {scriptTags}
        <script
          dangerouslySetInnerHTML={{
            __html: `window.__D=${JSON.stringify(state).replace(
              /</g,
              '\\u003c'
            )};`,
          }}
        />
      </body>
    </html>
  );
}
