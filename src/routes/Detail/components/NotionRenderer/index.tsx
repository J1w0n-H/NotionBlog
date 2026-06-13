import dynamic from "next/dynamic"
import Image from "next/image"
import Link from "next/link"
import { ExtendedRecordMap } from "notion-types"
import useScheme from "src/hooks/useScheme"

// core styles shared by all of react-notion-x (required)
import "react-notion-x/src/styles.css"

// used for code syntax highlighting (optional)
import "prismjs/themes/prism-tomorrow.css"

// used for rendering equations (optional)

import "katex/dist/katex.min.css"
import { FC } from "react"
import styled from "@emotion/styled"
import { Block } from "notion-types"
import { customMapImageUrl } from "src/libs/utils/notion/customMapImageUrl"

const _NotionRenderer = dynamic(
  () => import("react-notion-x").then((m) => m.NotionRenderer),
  { ssr: false }
)

const Code = dynamic(() =>
  import("react-notion-x/build/third-party/code").then(async (m) => m.Code)
)

const Collection = dynamic(() =>
  import("react-notion-x/build/third-party/collection").then(
    (m) => m.Collection
  )
)
const Equation = dynamic(() =>
  import("react-notion-x/build/third-party/equation").then((m) => m.Equation)
)
const Pdf = dynamic(
  () => import("react-notion-x/build/third-party/pdf").then((m) => m.Pdf),
  {
    ssr: false,
  }
)
const Modal = dynamic(
  () => import("react-notion-x/build/third-party/modal").then((m) => m.Modal),
  {
    ssr: false,
  }
)

const mapPageUrl = (id: string) => {
  if (!id) return ""
  return "https://www.notion.so/" + id.replace(/-/g, "")
}

const mapImageUrl = (url: string | undefined, block: Block): string => {
  if (!url) return ""
  try {
    return customMapImageUrl(url, block)
  } catch {
    return url
  }
}

const sanitizeRecordMap = (recordMap: ExtendedRecordMap): ExtendedRecordMap => {
  if (!recordMap?.block) return recordMap
  const block = Object.fromEntries(
    Object.entries(recordMap.block).map(([id, b]) => {
      if (!b || !b.value) return [id, b]
      // react-notion-x calls .replace() on block.value.id — ensure it's a string
      if (!b.value.id) {
        return [id, { ...b, value: { ...b.value, id } }]
      }
      return [id, b]
    })
  )
  return { ...recordMap, block }
}

type Props = {
  recordMap: ExtendedRecordMap
}

const NotionRenderer: FC<Props> = ({ recordMap }) => {
  const [scheme] = useScheme()
  const safeRecordMap = sanitizeRecordMap(recordMap)
  return (
    <StyledWrapper>
      <_NotionRenderer
        darkMode={scheme === "dark"}
        recordMap={safeRecordMap}
        components={{
          Code,
          Collection,
          Equation,
          Modal,
          Pdf,
          nextImage: Image,
          nextLink: Link,
        }}
        mapPageUrl={mapPageUrl}
        mapImageUrl={mapImageUrl}
      />
    </StyledWrapper>
  )
}

export default NotionRenderer

const StyledWrapper = styled.div`
  .notion-collection-page-properties {
    display: none !important;
  }
  .notion {
    --notion-max-width: 100%;
  }
  .notion-frame,
  .notion-page,
  .notion-page-content,
  .notion-page-no-cover,
  .notion-page-has-text-cover {
    max-width: 100%;
    width: 100%;
    padding-left: 0;
    padding-right: 0;
  }
  .notion-page {
    padding: 0;
  }
  .notion-list {
    width: 100%;
  }

  .notion-page-cover-wrapper {
    margin-bottom: 1.75rem;
    border-radius: var(--radius-lg);
    overflow: hidden;
    border: 1px solid ${({ theme }) => theme.brand.borderSoft};
    box-shadow: ${({ theme }) => theme.brand.shadowMd};
  }

  .notion-page-cover-wrapper img,
  .notion-page-cover-wrapper span {
    border-radius: 0 !important;
  }

  .notion-page-content {
    font-size: 18px;
    line-height: 1.75;
    letter-spacing: -0.008em;
    color: ${({ theme }) => theme.brand.text};
    counter-reset: h2-counter;
  }

  .notion-page-content .notion-h1 {
    margin-top: 4rem;
    margin-bottom: 13px;
    font-size: clamp(26px, 3vw, 35px);
    line-height: 1.12;
    font-weight: 800;
    letter-spacing: -0.02em;
    color: ${({ theme }) => theme.brand.text};
  }

  .notion-page-content .notion-h2 {
    counter-increment: h2-counter;
    margin: 2rem 0 0.625rem;
    font-size: 1.125rem;
    font-family: ${({ theme }) => theme.brand.fontDisplay};
    letter-spacing: -0.01em;
    line-height: 1.25;
    font-weight: 700;
    color: ${({ theme }) => theme.brand.text};
    scroll-margin-top: 64px;
    padding-left: 2rem;
    position: relative;
  }

  .notion-page-content .notion-h2::before {
    content: counter(h2-counter, decimal-leading-zero);
    position: absolute;
    left: 0;
    top: 0.12em;
    font-family: ${({ theme }) => theme.brand.fontMono};
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    color: var(--accent, ${({ theme }) => theme.brand.accent});
    text-shadow: var(--glow-sm, 0 0 10px rgba(155, 108, 255, 0.4));
  }

  .notion-page-content .notion-h3 {
    margin-top: 2rem;
    margin-bottom: 0.35rem;
    font-size: 1.125rem;
    line-height: 1.4;
    font-weight: 650;
    color: ${({ theme }) => theme.brand.text};
  }

  .notion-page-content .notion-h1:first-child,
  .notion-page-content .notion-h2:first-child,
  .notion-page-content .notion-h3:first-child {
    margin-top: 0;
  }

  .notion-page-content em,
  .notion-page-content .notion-italic {
    color: ${({ theme }) => theme.brand.accent} !important;
    font-style: italic !important;
  }

  .notion-quote {
    border-left: 4px solid ${({ theme }) => theme.brand.accent};
    padding: 0.25rem 0 0.25rem 1rem;
    margin: 1rem 0;
    color: ${({ theme }) => theme.brand.textMuted};
  }

  .notion-code {
    font-family: var(--font-mono);
    font-size: 14px;
    line-height: 1.55;
    background: ${({ theme }) => theme.brand.codeBg} !important;
    color: ${({ theme }) => theme.brand.codeText} !important;
    border: 1px solid ${({ theme }) => theme.brand.codeBorder};
    border-radius: var(--radius-md);
  }

  .notion-asset-wrapper {
    border-radius: var(--radius-lg);
    overflow: hidden;
    border: 1px solid ${({ theme }) => theme.brand.borderSoft};
    box-shadow: ${({ theme }) => theme.brand.shadowMd};
    margin-top: 1.125rem;
    margin-bottom: 1.75rem;
  }

  @media (min-width: 900px) {
    .notion-page-content .notion-asset-wrapper {
      margin-left: -1.5rem;
      margin-right: -1.5rem;
      max-width: none;
    }
    /* Column images sit within their column — no extra bleed */
    .notion-page-content .notion-row .notion-asset-wrapper {
      margin-left: 0;
      margin-right: 0;
    }
  }

  /* Column layouts: columns align to top so short image doesn't stretch */
  .notion-row {
    align-items: start !important;
  }

  /* Image column: sticky + width cap so it doesn't dominate on wide screens */
  .notion-row .notion-column:first-of-type {
    position: sticky;
    top: 1.25rem;
    align-self: start;
    max-width: 46%;
  }

  /* Cap portrait photos in column layouts — letterbox, no crop */
  .notion-row .notion-asset-wrapper {
    max-height: 440px;
    background-color: ${({ theme }) => theme.brand.bg};
  }
  .notion-row .notion-asset-wrapper img {
    object-fit: contain !important;
    max-height: 440px;
  }

  .notion-page-content .notion-text {
    margin-bottom: 0.7em;
    line-height: 1.78;
  }

  .notion-page-content a {
    color: ${({ theme }) => theme.brand.link};
    text-decoration: underline;
    text-underline-offset: 3px;
    text-decoration-thickness: 1px;
    transition: color 120ms ease, text-decoration-thickness 120ms ease;
  }
  .notion-page-content a:hover {
    color: ${({ theme }) => theme.brand.linkHover};
    text-decoration-thickness: 2px;
  }

  .notion-page-content .notion-inline-code {
    font-family: var(--font-mono);
    font-size: 0.875em;
    padding: 0.1em 0.375em;
    border-radius: 0.3em;
    background: ${({ theme }) => theme.brand.codeBg};
    color: ${({ theme }) => theme.brand.codeText};
    border: 1px solid ${({ theme }) => theme.brand.codeBorder};
    word-break: break-all;
  }

  .notion-page-content .notion-list {
    margin-bottom: 0.85rem;
    padding-left: 1.5rem;
  }
  .notion-page-content .notion-list li {
    margin-bottom: 0.4em;
    line-height: 1.7;
  }

  .notion-page-content .notion-callout {
    border-radius: 0;
    border: none;
    border-left: 3px solid ${({ theme }) => theme.brand.accent};
    background: transparent;
    padding: 0.625rem 0 0.625rem 1rem;
    margin: 1.25rem 0;
    gap: 0.625rem;
    align-items: flex-start;
  }

  .notion-hr {
    border: none;
    border-top: 1px solid ${({ theme }) => theme.brand.border};
    margin: 2rem 0;
    opacity: 0.7;
  }
`
