import Document, { Html, Head, Main, NextScript } from "next/document"
import { CONFIG } from "site.config"
import {
  inter,
  interTight,
  jetbrainsMono,
  pretendard,
  sourceSerif4,
} from "src/assets"

class MyDocument extends Document {
  render() {
    const fontRoot = [
      pretendard.variable,
      inter.variable,
      interTight.variable,
      sourceSerif4.variable,
      jetbrainsMono.variable,
    ].join(" ")

    return (
      <Html lang={CONFIG.lang} data-theme="default" className={fontRoot}>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Inter+Tight:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&family=Noto+Color+Emoji&family=Roboto:ital,wght@1,900&family=Source+Serif+4:wght@400;600;700&display=swap"
            rel="stylesheet"
          />
          {/* Blocking scheme init — reads cookie before React hydrates to prevent FOUC */}
          <script dangerouslySetInnerHTML={{ __html: `(function(){try{var m=document.cookie.match(/(?:^|; )scheme=([^;]+)/);document.documentElement.dataset.scheme=m?m[1]:window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}catch(e){}}())` }} />
          <link rel="icon" href="/favicon.ico" />
          <link
            rel="apple-touch-icon"
            sizes="192x192"
            href="/apple-touch-icon.png"
          ></link>
          <link
            rel="alternate"
            type="application/rss+xml"
            title="RSS 2.0"
            href="/feed"
          ></link>
          {/* google search console */}
          {CONFIG.googleSearchConsole.enable === true && (
            <>
              <meta
                name="google-site-verification"
                content={CONFIG.googleSearchConsole.config.siteVerification}
              />
            </>
          )}
          {/* naver search advisor */}
          {CONFIG.naverSearchAdvisor.enable === true && (
            <>
              <meta
                name="naver-site-verification"
                content={CONFIG.naverSearchAdvisor.config.siteVerification}
              />
            </>
          )}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
