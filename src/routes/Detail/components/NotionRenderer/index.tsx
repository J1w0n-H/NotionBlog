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
import { FC, useEffect, useRef } from "react"
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
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = wrapperRef.current
    if (!el) return

    const cs = getComputedStyle(document.documentElement)
    const accent = cs.getPropertyValue("--accent").trim() || "oklch(0.68 0.20 22)"
    const accentSoft = cs.getPropertyValue("--accent-soft").trim() || "oklch(0.25 0.10 22)"
    const fontMono = cs.getPropertyValue("--font-mono").trim() || '"JetBrains Mono", monospace'
    const fontProse = cs.getPropertyValue("--font-prose").trim()
    const fontDisplay = cs.getPropertyValue("--font-display").trim()

    const injectBadges = () => {
      // §XX badge: shared counter across notion-h1 AND notion-h2
      // (posts use H1 for top-level like "Post Opening" and H2 for paper sections)
      let secCount = 0
      el.querySelectorAll<HTMLElement>(".notion-h1, .notion-h2").forEach((h) => {
        secCount++
        if (!h.querySelector(".h1-badge")) {
          const badge = document.createElement("span")
          badge.className = "h1-badge"
          badge.setAttribute("aria-hidden", "true")
          badge.textContent = `§${String(secCount).padStart(2, "0")}`
          Object.assign(badge.style, {
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            verticalAlign: "middle",
            height: "1.6rem",
            padding: "0 0.5rem",
            marginRight: "0.65rem",
            fontFamily: fontMono,
            fontSize: "0.75rem",
            fontWeight: "700",
            letterSpacing: "0.05em",
            lineHeight: "1",
            borderRadius: "0.35rem",
            color: accent,
            background: accentSoft,
            border: `1px solid ${accent}`,
            whiteSpace: "nowrap",
            flexShrink: "0",
          })
          h.style.display = "flex"
          h.style.alignItems = "flex-start"
          h.style.gap = "0.5rem"
          h.prepend(badge)
        }
      })
      // "—" dash only on notion-h3 (Beat-level sub-sections)
      el.querySelectorAll<HTMLElement>(".notion-h3").forEach((h) => {
        if (!h.querySelector(".h2-dash")) {
          const dash = document.createElement("span")
          dash.className = "h2-dash"
          dash.setAttribute("aria-hidden", "true")
          dash.textContent = "—"
          Object.assign(dash.style, {
            fontFamily: fontMono,
            fontSize: "inherit",
            fontWeight: "400",
            color: accent,
            opacity: "0.7",
            marginRight: "0.3rem",
            display: "inline",
          })
          h.prepend(dash)
        }
      })

      // Font injection: override react-notion-x inline font-family via inline !important
      if (fontProse) {
        el.querySelectorAll<HTMLElement>(".notion-page-content span, .notion-page-content p").forEach((e: HTMLElement) => {
          if (
            e.closest(".notion-h") ||
            e.closest(".notion-code") ||
            e.closest(".notion-inline-code") ||
            e.classList.contains("h1-badge") ||
            e.classList.contains("h2-dash")
          ) return
          e.style.setProperty("font-family", fontProse, "important")
        })
      }
      if (fontDisplay) {
        el.querySelectorAll<HTMLElement>(".notion-page-content .notion-h span").forEach((e: HTMLElement) => {
          if (e.classList.contains("h1-badge") || e.classList.contains("h2-dash")) return
          e.style.setProperty("font-family", fontDisplay, "important")
        })
      }
      if (fontMono) {
        el.querySelectorAll<HTMLElement>(".notion-page-content .notion-code span, .notion-page-content .notion-inline-code").forEach((e: HTMLElement) => {
          e.style.setProperty("font-family", fontMono, "important")
        })
      }
    }

    injectBadges()
    const observer = new MutationObserver(injectBadges)
    observer.observe(el, { childList: true, subtree: true })

    return () => {
      observer.disconnect()
      el.querySelectorAll(".h1-badge, .h2-dash").forEach((b) => b.remove())
    }
  }, [safeRecordMap])

  return (
    <StyledWrapper ref={wrapperRef} className="post-prose">
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

  /* Cover hero: editorial frame (no extra network). */
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

  /* Long-form prose: Source Serif 4 body, Inter Tight headings.
     Apply to every descendant — react-notion-x inlines font-family on spans. */
  .notion-page-content,
  .notion-page-content * {
    font-family: var(--font-prose) !important;
    font-size: inherit;
  }

  .notion-page-content {
    font-size: 17px;
    line-height: 1.7;
    letter-spacing: -0.008em;
    color: ${({ theme }) => theme.brand.text};
  }

  /* Headings override prose font → Inter Tight */
  .notion-page-content .notion-h,
  .notion-page-content h1,
  .notion-page-content h2,
  .notion-page-content h3,
  .notion-page-content h4 {
    font-family: var(--font-display) !important;
    letter-spacing: -0.02em;
    color: ${({ theme }) => theme.brand.text};
  }

  /* Code blocks keep mono font */
  .notion-page-content .notion-code,
  .notion-page-content .notion-code *,
  .notion-page-content .notion-inline-code {
    font-family: var(--font-mono) !important;
  }

  /* H1 — §01 section badge. Flex layout + badge injected via useEffect. */
  .notion-page-content .notion-h1 {
    margin-top: 4rem;
    margin-bottom: 0.35rem;
    font-size: 1.875rem;
    line-height: 1.25;
    font-weight: 700;
  }

  /* H2 — em-dash prefix injected via useEffect. */
  .notion-page-content .notion-h2 {
    margin-top: 2.5rem;
    margin-bottom: 0.35rem;
    font-size: 1.5rem;
    line-height: 1.3;
    font-weight: 700;
  }

  /* H3 */
  .notion-page-content .notion-h3 {
    margin-top: 2rem;
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

  /* Italic — accent colour */
  .notion-page-content em,
  .notion-page-content .notion-italic {
    color: ${({ theme }) => theme.brand.accent} !important;
    font-style: italic !important;
    font-family: var(--font-prose) !important;
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

  /* ── Images in body ───────────────────────────────────────────────── */
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
      margin-left: -4rem;
      margin-right: -4rem;
      max-width: none;
    }
  }

  /* ── Paragraph spacing ─────────────────────────────────────────── */
  .notion-page-content .notion-text {
    margin-bottom: 0.7em;
    line-height: 1.78;
  }

  /* ── Links in prose ────────────────────────────────────────────── */
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

  /* ── Inline code ───────────────────────────────────────────────── */
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

  /* ── Lists ─────────────────────────────────────────────────────── */
  .notion-page-content .notion-list {
    margin-bottom: 0.85rem;
    padding-left: 1.5rem;
  }
  .notion-page-content .notion-list li {
    margin-bottom: 0.4em;
    line-height: 1.7;
  }

  /* ── Callout ───────────────────────────────────────────────────── */
  .notion-page-content .notion-callout {
    border-radius: var(--radius-md);
    border: 1px solid ${({ theme }) => theme.brand.borderSoft};
    background: ${({ theme }) => theme.brand.surface2};
    padding: 0.875rem 1rem;
    margin: 1.25rem 0;
    gap: 0.75rem;
    align-items: flex-start;
  }

  /* ── Horizontal rule ───────────────────────────────────────────── */
  .notion-hr {
    border: none;
    border-top: 1px solid ${({ theme }) => theme.brand.border};
    margin: 2rem 0;
    opacity: 0.7;
  }
`
