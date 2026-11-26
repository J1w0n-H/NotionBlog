import React, { type RefObject } from "react"
import styled from "@emotion/styled"
import useLanguage from "src/hooks/useLanguage"
import {
  ABOUT_SECTIONS,
  type AboutSection,
  type NarrativeBlock,
} from "src/constants/aboutContent"
import { CONFIG } from "site.config"

const { email, github, linkedin } = CONFIG.profile

type Props = { scrollRootRef?: RefObject<HTMLDivElement | null> }

/** Picks the Korean string when the UI is Korean and one exists. */
type PickLang = (en: string, ko?: string) => string

const sectionDomId = (s: AboutSection) => `s-${s.id}`

/** A section counts as current once its top passes this far below the scroll top. */
const ACTIVE_SECTION_OFFSET_PX = 90
const NAV_SCROLL_MARGIN_PX = 20

/** Tracks read progress (0–100) and the current section inside `scrollRootRef`. */
function useScrollSpy(scrollRootRef: Props["scrollRootRef"], ids: string[]) {
  const [activeId, setActiveId] = React.useState("")
  const [pct, setPct] = React.useState(0)

  React.useEffect(() => {
    const root = scrollRootRef?.current
    if (!root) return
    let frame = 0
    const sync = () => {
      frame = 0
      const max = root.scrollHeight - root.clientHeight
      setPct(max > 0 ? Math.round((root.scrollTop / max) * 100) : 0)
      const top = root.scrollTop + ACTIVE_SECTION_OFFSET_PX
      let current = ""
      for (const id of ids) {
        const el = document.getElementById(id)
        if (el && el.offsetTop <= top) current = id
      }
      setActiveId(current)
    }
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(sync)
    }
    root.addEventListener("scroll", onScroll, { passive: true })
    sync()
    return () => {
      root.removeEventListener("scroll", onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [scrollRootRef, ids])

  return { activeId, pct }
}

const SECTION_IDS = ABOUT_SECTIONS.map(sectionDomId)

const AboutDrawerContent: React.FC<Props> = ({ scrollRootRef }) => {
  const [language] = useLanguage()
  const isKo = language === "ko"
  const t: PickLang = (en, ko) => (isKo && ko ? ko : en)
  const { activeId, pct } = useScrollSpy(scrollRootRef, SECTION_IDS)

  const navTo = (id: string, e: React.MouseEvent<HTMLAnchorElement>) => {
    const root = scrollRootRef?.current
    const el = document.getElementById(id)
    // Without a scroll root (mobile page) the plain #hash link does the job.
    if (!root || !el) return
    e.preventDefault()
    root.scrollTo({ top: el.offsetTop - NAV_SCROLL_MARGIN_PX, behavior: "smooth" })
  }

  return (
    <Wrap>
      <Body>
        <Intro>
          <Who><Pm>$</Pm> cat about.md</Who>
          <IntroH1>
            {isKo
              ? <>이력서 뒤에 있는 이유, <b>제 말로 직접.</b></>
              : <>The reasoning behind the résumé, <b>in my own words.</b></>}
          </IntroH1>
          <Dek>
            {isKo
              ? <><b>무엇을</b> 했는지는 피드에 있습니다. 이건 <b>왜</b>입니다 — 수학 전공자가 인프라를 운영하고, 의도적으로 부수고, 이제 무엇이 버티는지 연구하게 된 이야기입니다.</>
              : <>The feed shows <b>what</b> I did. This is <b>why</b> — how a math major ended up running infrastructure, breaking it on purpose, and now researching what holds up next.</>}
          </Dek>
        </Intro>

        {ABOUT_SECTIONS.map((section) => (
          <AboutSectionView key={section.id} section={section} t={t} />
        ))}

        <CTABox>
          <CTATitle>
            {isKo ? "이유는 설명했습니다. 연락은 이렇게 하시면 됩니다." : "That's the why. Here's how to reach me."}
          </CTATitle>
          <CTARow>
            <BtnGh href={`https://github.com/${github}`} target="_blank" rel="noopener noreferrer">github ↗</BtnGh>
            <BtnGh href={`https://linkedin.com/in/${linkedin}`} target="_blank" rel="noopener noreferrer">linkedin ↗</BtnGh>
            <BtnGh href={`mailto:${email}`}>{email}</BtnGh>
          </CTARow>
        </CTABox>
      </Body>

      <TocSide>
        <TocH>
          <span>{isKo ? "이 페이지" : "On this page"}</span>
          <TocPct>{pct}%</TocPct>
        </TocH>
        <TocOl>
          {ABOUT_SECTIONS.map((section) => {
            const id = sectionDomId(section)
            return (
              <TocLi key={id}>
                <TocA
                  href={`#${id}`}
                  aria-current={activeId === id ? "location" : undefined}
                  onClick={(e) => navTo(id, e)}
                >
                  {t(section.toc.en, section.toc.ko)}
                </TocA>
              </TocLi>
            )
          })}
        </TocOl>
      </TocSide>
    </Wrap>
  )
}

export default AboutDrawerContent

/* ── Section rendering ─────────────────────────────────────────────────── */

const AboutSectionView: React.FC<{ section: AboutSection; t: PickLang }> = ({ section, t }) => (
  <Sec id={sectionDomId(section)}>
    <SH>
      <Num>{section.number}</Num>
      <STitle>{t(section.title, section.titleKo)}</STitle>
      {section.subtitle ? <St>{t(section.subtitle, section.subtitleKo)}</St> : null}
    </SH>
    {section.narrative ? <NarrativeBlocks blocks={section.narrative} t={t} /> : null}
    {section.cards ? (
      <RCards>
        {section.cards.map((card, i) => (
          <RC key={i}>
            <RCH3>{t(card.title, card.titleKo)}</RCH3>
            <RCBody dangerouslySetInnerHTML={{ __html: t(card.body, card.bodyKo) }} />
            {card.refs?.map((ref, j) => <RefLink key={j} href={ref.href} label={ref.label} />)}
          </RC>
        ))}
      </RCards>
    ) : null}
    {section.footer ? <NarrativeBlocks blocks={section.footer} t={t} /> : null}
  </Sec>
)

type LiBlock = Extract<NarrativeBlock, { type: "li" }>
type RenderItem = NarrativeBlock | { type: "list"; items: LiBlock[] }

/** Folds runs of consecutive `li` blocks into one list item. */
function groupListItems(blocks: NarrativeBlock[]): RenderItem[] {
  const out: RenderItem[] = []
  for (const b of blocks) {
    const last = out[out.length - 1]
    if (b.type === "li") {
      if (last?.type === "list") last.items.push(b)
      else out.push({ type: "list", items: [b] })
    } else {
      out.push(b)
    }
  }
  return out
}

const NarrativeBlocks: React.FC<{ blocks: NarrativeBlock[]; t: PickLang }> = ({ blocks, t }) => (
  <>
    {groupListItems(blocks).map((b, i) => {
      switch (b.type) {
        case "p":
          return <SP key={i} dangerouslySetInnerHTML={{ __html: t(b.en, b.ko) }} />
        case "sub":
          return <Sub key={i}>{t(b.en, b.ko)}</Sub>
        case "quote":
          return <Pull key={i}>{t(b.en, b.ko)}</Pull>
        case "ref":
          return <RefLink key={i} href={b.href} label={b.label} />
        case "metrics":
          return (
            <Metrics key={i}>
              {b.items.map((m, j) => (
                <MItem key={j}>
                  <MVal>{t(m.val, m.valKo)}</MVal>
                  <MLbl>{t(m.en, m.ko)}</MLbl>
                </MItem>
              ))}
            </Metrics>
          )
        case "group":
          return (
            <PGal key={i}>
              <PGrid>
                {b.photos.map((ph, j) => (
                  <PImg key={j} src={ph.src} alt={t(ph.altEn, ph.altKo)} loading="lazy" />
                ))}
              </PGrid>
              <PCap>
                <PCF aria-hidden="true">▣</PCF>
                <span>{b.photos.map((ph) => t(ph.altEn, ph.altKo)).join(" · ")}</span>
              </PCap>
              <GroupText dangerouslySetInnerHTML={{ __html: t(b.en, b.ko) }} />
            </PGal>
          )
        case "list":
          return (
            <SUl key={i}>
              {b.items.map((li, j) => (
                <SLi key={j} dangerouslySetInnerHTML={{ __html: t(li.en, li.ko) }} />
              ))}
            </SUl>
          )
        default:
          return null
      }
    })}
  </>
)

const RefLink: React.FC<{ href: string; label: string }> = ({ href, label }) => (
  <RefRow>
    <a href={href} target="_blank" rel="noopener noreferrer">{label}</a>
  </RefRow>
)

/* ─────────────────────────────────────────────────────────────
   Styled components — colors come from sentinel-theme tokens so
   both light and dark schemes work.
───────────────────────────────────────────────────────────── */

const MONO = `var(--font-mono, "JetBrains Mono", monospace)`

const Wrap = styled.div`
  container-type: inline-size;
  container-name: about-wrap;
  display: flex;
  gap: 34px;
  max-width: 920px;
  margin: 0 auto;
  align-items: flex-start;
  padding-bottom: 5rem;
`

const Body = styled.div`
  flex: 1;
  min-width: 0;
  max-width: 640px;

  .ab-hl {
    color: var(--link);
    font-weight: 600;
  }
`

/** Emphasis inside muted body text reads at full text color. */
const emphasis = `
  strong, b {
    color: var(--text);
    font-weight: 600;
  }
`

/* ── intro ── */

const Intro = styled.div`
  margin-bottom: 8px;
`

const Who = styled.p`
  font-family: ${MONO};
  font-size: 0.75rem;
  letter-spacing: 0.04em;
  color: var(--text-faint);
  margin: 0 0 14px;
  display: flex;
  align-items: center;
  gap: 9px;
`

const Pm = styled.span`
  color: var(--signal);
`

const IntroH1 = styled.h1`
  font-size: clamp(28px, 3.4vw, 40px);
  font-weight: 800;
  letter-spacing: -0.025em;
  line-height: 1.08;
  color: var(--text);
  margin: 0 0 15px;
  text-wrap: balance;

  b {
    background: linear-gradient(100deg, var(--link), var(--accent), var(--signal));
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
`

const Dek = styled.p`
  font-size: 1rem;
  line-height: 1.62;
  color: var(--text-muted);
  margin: 0;
  text-wrap: pretty;

  ${emphasis}
`

/* ── section ── */

const Sec = styled.section`
  padding-top: 34px;
  margin-top: 32px;
  border-top: 1px solid var(--border-soft);
  scroll-margin-top: 70px;
`

const SH = styled.div`
  display: flex;
  align-items: baseline;
  gap: 14px;
  margin-bottom: 16px;
  flex-wrap: wrap;
`

const Num = styled.span`
  font-family: ${MONO};
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--accent);
  text-shadow: var(--glow-sm, 0 0 10px color-mix(in srgb, var(--accent) 40%, transparent));
`

const STitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: var(--text);
  text-transform: none;
  margin: 0;
`

const St = styled.span`
  font-family: ${MONO};
  font-size: 0.6875rem;
  color: var(--text-faint);
  margin-left: auto;
  align-self: center;
  letter-spacing: 0.02em;
`

const inlineCode = `
  code {
    font-family: ${MONO};
    font-size: 0.86em;
    color: var(--link);
    background: color-mix(in srgb, var(--link) 8%, transparent);
    border: 1px solid color-mix(in srgb, var(--link) 20%, transparent);
    border-radius: var(--radius-sm);
    padding: 1px 5px;
  }
`

/* body paragraph */
const SP = styled.p`
  font-size: 1rem;
  line-height: 1.72;
  color: var(--text-muted);
  margin-bottom: 16px;
  text-wrap: pretty;

  &:last-child { margin-bottom: 0; }

  .cl {
    color: var(--link);
    font-weight: 500;
  }

  ${emphasis}
  ${inlineCode}

  a { color: var(--link); text-decoration: underline; }
`

/* sub-section label */
const Sub = styled.p`
  font-size: 0.75rem;
  font-family: ${MONO};
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--accent);
  margin: 24px 0 12px;
`

/* pull quote */
const Pull = styled.blockquote`
  font-family: "Source Serif 4", serif;
  font-size: 1.125rem;
  line-height: 1.5;
  color: var(--text);
  border-left: 3px solid var(--accent);
  padding: 4px 0 4px 20px;
  margin: 26px 0;
  text-wrap: balance;
`

/* metrics bar */
const Metrics = styled.div`
  display: flex;
  flex-wrap: wrap;
  border: 1px solid var(--border-soft);
  border-radius: var(--radius-md);
  overflow: hidden;
  background: var(--glass-1, var(--surface));
  margin: 6px 0;
  width: fit-content;
  max-width: 100%;
`

const MItem = styled.div`
  padding: 13px 22px;
  border-right: 1px solid var(--border-soft);
  display: flex;
  flex-direction: column;
  gap: 4px;

  &:last-child { border-right: 0; }
`

const MVal = styled.span`
  font-family: ${MONO};
  font-weight: 600;
  font-size: 1.25rem;
  color: var(--text);
  text-shadow: 0 0 12px color-mix(in srgb, var(--accent) 50%, transparent);
  line-height: 1;
`

const MLbl = styled.span`
  font-family: ${MONO};
  font-size: 0.625rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-faint);
`

/* research cards */
const RCards = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  margin: 6px 0;
`

const RC = styled.div`
  border: 1px solid var(--border-soft);
  border-radius: var(--radius-md);
  padding: 16px 18px;
  background: var(--glass-1, var(--surface));
  transition: border-color 0.16s, box-shadow 0.16s;

  &:hover {
    border-color: color-mix(in srgb, var(--accent) 40%, transparent);
    box-shadow: var(--glow-sm, 0 0 10px color-mix(in srgb, var(--accent) 40%, transparent));
  }
`

const RCH3 = styled.h3`
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text);
  margin: 0 0 6px;
  display: flex;
  align-items: center;
  gap: 9px;
`

const RCBody = styled.div`
  font-size: 0.8125rem;
  line-height: 1.6;
  color: var(--text-muted);

  p { margin: 0 0 8px; }
  p:last-child { margin: 0; }

  ${emphasis}
  ${inlineCode}
`

/* ref link */
const RefRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 6px 0 4px;

  &::before {
    content: "↗";
    font-size: 0.625rem;
    color: var(--link);
    flex: none;
  }

  a {
    font-family: ${MONO};
    font-size: 0.6875rem;
    color: var(--link);
    text-decoration: none;
    border-bottom: 1px solid color-mix(in srgb, var(--link) 30%, transparent);
    transition: color 0.15s, border-color 0.15s;

    &:hover {
      color: var(--link-hover);
      border-color: var(--link);
    }
  }
`

/* person gallery */
const PGal = styled.div`
  margin: 16px 0 6px;
`

const PGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
`

const PImg = styled.img`
  width: 100%;
  aspect-ratio: 3 / 4;
  /* Uniform gallery: fill the frame instead of letterboxing each photo. */
  object-fit: cover;
  object-position: center 30%;
  background: var(--surface-sunk);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-soft);
  display: block;
`

const PCap = styled.p`
  font-family: ${MONO};
  font-size: 0.625rem;
  color: var(--text-faint);
  margin: 9px 0 0;
  display: flex;
  gap: 8px;
  align-items: baseline;
`

const PCF = styled.span`
  color: var(--accent);
`

const GroupText = styled.div`
  font-size: 1rem;
  line-height: 1.72;
  color: var(--text-muted);
  margin-top: 8px;

  p { margin: 0 0 12px; }
  p:last-child { margin: 0; }

  ${emphasis}
`

/* bullet list */
const SUl = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 11px;
  margin: 4px 0 16px;
  padding: 0;
`

const SLi = styled.li`
  font-size: 0.875rem;
  line-height: 1.6;
  color: var(--text-muted);
  padding-left: 24px;
  position: relative;

  &::before {
    content: "›";
    position: absolute;
    left: 4px;
    top: -1px;
    color: var(--link);
    font-weight: 700;
    font-size: 1rem;
  }

  ${emphasis}
`

/* CTA box */
const CTABox = styled.div`
  margin-top: 40px;
  padding: 24px 26px;
  border: 1px solid color-mix(in srgb, var(--accent) 28%, transparent);
  border-radius: var(--radius-md);
  background:
    radial-gradient(440px 200px at 0% 0%, color-mix(in srgb, var(--accent) 14%, transparent), transparent 60%),
    var(--glass-1, var(--surface));
`

const CTATitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--text);
  margin: 0 0 8px;
`

const CTARow = styled.div`
  display: flex;
  gap: 11px;
  flex-wrap: wrap;
  align-items: center;
`

const BtnGh = styled.a`
  font-size: 0.8125rem;
  font-weight: 600;
  border-radius: var(--radius-md);
  padding: 10px 17px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: border-color 0.16s;
  border: 1px solid var(--border);
  white-space: nowrap;
  text-decoration: none;
  cursor: pointer;
  background: transparent;
  color: var(--text);

  &:hover { border-color: var(--accent); }
`

/* ── TOC sidebar ── */

const TocSide = styled.aside`
  display: none;

  @container about-wrap (min-width: 680px) {
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 194px;
    flex: none;
    position: sticky;
    top: 6px;
    align-self: flex-start;
  }
`

const TocH = styled.div`
  font-family: ${MONO};
  font-size: 0.625rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-faint);
  margin-bottom: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const TocPct = styled.span`
  color: var(--link);
`

const TocOl = styled.ol`
  list-style: none;
  counter-reset: t;
  display: flex;
  flex-direction: column;
  gap: 4px;
  border-left: 1px solid var(--border-soft);
  padding: 0;
  margin: 0;
`

const TocLi = styled.li`
  counter-increment: t;
  list-style: none;
`

const TocA = styled.a`
  display: flex;
  gap: 9px;
  align-items: baseline;
  font-size: 0.75rem;
  color: var(--text-faint);
  padding: 7px 12px;
  margin-left: -1px;
  border-left: 2px solid transparent;
  border-radius: 0 8px 8px 0;
  text-decoration: none;
  transition: color 0.15s, border-color 0.15s, background 0.15s;

  &::before {
    content: "0" counter(t);
    font-family: ${MONO};
    font-size: 0.625rem;
    color: var(--text-faint);
    flex: none;
    transition: color 0.15s;
  }

  &:hover {
    color: var(--text);
  }

  &[aria-current] {
    color: var(--text);
    font-weight: 600;
    border-color: var(--link);
    background: linear-gradient(
      90deg,
      color-mix(in srgb, var(--link) 14%, transparent),
      color-mix(in srgb, var(--accent) 6%, transparent) 70%,
      transparent
    );
    box-shadow: inset 2px 0 0 var(--link), 0 0 12px color-mix(in srgb, var(--link) 12%, transparent);
  }

  &[aria-current]::before {
    color: var(--link);
    text-shadow: var(--glow-cy, 0 0 10px color-mix(in srgb, var(--link) 40%, transparent));
  }
`
