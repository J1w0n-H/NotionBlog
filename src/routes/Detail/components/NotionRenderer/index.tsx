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

  /* PR4: reading column typography (Inter Tight / Pretendard stack via CSS vars) */
  .notion-page-content {
    font-family: var(--font-display), var(--font-sans);
    font-size: 17px;
    line-height: 1.7;
    letter-spacing: -0.005em;
    color: ${({ theme }) => theme.brand.text};
  }

  .notion-page-content .notion-h,
  .notion-page-content h1,
  .notion-page-content h2,
  .notion-page-content h3 {
    font-family: var(--font-display), var(--font-sans);
    letter-spacing: -0.02em;
    color: ${({ theme }) => theme.brand.text};
  }

  .notion-page-content .notion-h1,
  .notion-page-content h1.notion-h1 {
    margin-top: 2.5rem;
    margin-bottom: 0.35rem;
    font-size: 1.875rem;
    line-height: 1.25;
    font-weight: 700;
  }

  .notion-page-content .notion-h2,
  .notion-page-content h2.notion-h2 {
    margin-top: 4rem;
    margin-bottom: 0.35rem;
    font-size: 1.5rem;
    line-height: 1.3;
    font-weight: 700;
  }

  .notion-page-content .notion-h3,
  .notion-page-content h3.notion-h3 {
    margin-top: 2.5rem;
    margin-bottom: 0.35rem;
    font-size: 1.25rem;
    line-height: 1.35;
    font-weight: 650;
  }

  .notion-page-content .notion-h1:first-child,
  .notion-page-content .notion-h2:first-child,
  .notion-page-content .notion-h3:first-child {
    margin-top: 0;
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

  @media (min-width: 900px) {
    .notion-page-content .notion-asset-wrapper {
      margin-left: -4rem;
      margin-right: -4rem;
      max-width: none;
    }
  }
`
