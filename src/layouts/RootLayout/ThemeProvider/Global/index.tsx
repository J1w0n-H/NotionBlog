import { Global as _Global, css, useTheme } from "@emotion/react"

import { ThemeProvider as _ThemeProvider } from "@emotion/react"
import { pretendard, inter, jetbrainsMono } from "src/assets"

export const Global = () => {
  const theme = useTheme()

  return (
    <_Global
      styles={css`
        :root {
          --font-pretendard: ${pretendard.style.fontFamily};
          --font-inter: ${inter.style.fontFamily};
          --font-jetbrains-mono: ${jetbrainsMono.style.fontFamily};

          /* Map sentinel-theme tokens to the fonts we actually load.
             Latin glyphs fall to Inter first; Hangul falls through to Pretendard. */
          --font-sans: ${inter.style.fontFamily}, ${pretendard.style.fontFamily},
            system-ui, -apple-system, "Segoe UI", sans-serif;
          --font-display: ${inter.style.fontFamily},
            ${pretendard.style.fontFamily}, system-ui, sans-serif;
          --font-mono: ${jetbrainsMono.style.fontFamily}, "IBM Plex Mono",
            ui-monospace, Menlo, "Courier New", monospace;
        }

        body {
          margin: 0;
          padding: 0;
          color: ${theme.brand.text};
          background-color: ${theme.brand.bg};
          /* Korean-primary body — Pretendard first, Inter as Latin fallback */
          font-family: ${pretendard.style.fontFamily},
            ${inter.style.fontFamily}, system-ui, -apple-system, sans-serif;
          font-weight: 400;
          font-style: normal;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          text-rendering: optimizeLegibility;
        }

        code,
        kbd,
        samp,
        pre {
          font-family: var(--font-mono);
          font-variant-ligatures: none;
        }

        * {
          color-scheme: ${theme.scheme};
          box-sizing: border-box;
        }

        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
          margin: 0;
          font-weight: inherit;
          font-style: inherit;
        }

        a {
          all: unset;
          cursor: pointer;
        }

        ul {
          padding: 0;
        }

        // init button
        button {
          all: unset;
          cursor: pointer;
        }

        // init input
        input {
          all: unset;
          box-sizing: border-box;
        }

        // init textarea
        textarea {
          border: none;
          background-color: transparent;
          font-family: inherit;
          padding: 0;
          outline: none;
          resize: none;
          color: inherit;
        }

        hr {
          width: 100%;
          border: none;
          margin: 0;
          border-top: 1px solid ${theme.brand.border};
        }
      `}
    />
  )
}
