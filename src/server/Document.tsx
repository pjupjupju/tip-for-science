import React from 'react';
import { HelmetData } from 'react-helmet';

interface DocumentProps {
  content: string;
  helmet: HelmetData;
  js: string;
  state: any;
}

export function Document({ content, helmet, js, state }: DocumentProps) {
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
        <script
          src={js}
          defer
          crossOrigin={(process.env.NODE_ENV !== 'production').toString()}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Raleway:wght@900&display=swap"
          rel="stylesheet"
        ></link>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Jost:wght@300;400;700&display=swap"
          rel="stylesheet"
        ></link>
      </head>
      <body>
        <div id="root" dangerouslySetInnerHTML={{ __html: content }} />
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
