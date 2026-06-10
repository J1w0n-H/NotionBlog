import React, { type RefObject } from "react"
import styled from "@emotion/styled"
import useLanguage from "src/hooks/useLanguage"
import AboutHeroViz from "src/components/AboutHeroViz"
import { catVars, type CategoryToken } from "src/constants/categoryColors"
import {
  ABOUT_SECTIONS,
  type AboutSection,
  type NarrativeBlock,
} from "src/constants/aboutContent"
import { KO_ABOUT } from "src/constants/i18n"
import { createTranslator } from "src/libs/utils/i18n"


type Props = {
  scrollRootRef?: RefObject<HTMLDivElement | null>
}

const AboutDrawerContent: React.FC<Props> = ({ scrollRootRef }) => {
  const [language] = useLanguage()
  const isKo = language === "ko"
  const tr = createTranslator(language, KO_ABOUT)

  const navSections = ABOUT_SECTIONS
  const [activeId, setActiveId] = React.useState<string>(navSections[0]?.id ?? "")

  React.useEffect(() => {
    const elements = navSections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null)
    if (elements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id)
        })
      },
      {
        root: scrollRootRef?.current ?? null,
        threshold: 0,
        rootMargin: "-12% 0px -78% 0px",
      }
    )
    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [scrollRootRef, navSections])

  const handleNavClick = (id: string, e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const target = document.getElementById(id)
    if (!target) return
    if (!scrollRootRef?.current) {
      target.scrollIntoView({ behavior: "smooth", block: "start" })
      return
    }
    const container = scrollRootRef.current
    const offsetTop =
      target.getBoundingClientRect().top -
      container.getBoundingClientRect().top +
      container.scrollTop
    container.scrollTo({ top: offsetTop - 12, behavior: "smooth" })
  }

  return (
    <DrawerWrap>
    <Shell>
      <MainContent>
        <AboutHeroViz />
        {ABOUT_SECTIONS.map((section, idx) => (
          <React.Fragment key={section.id}>
            {idx > 0 && <SectionDividerEl num={section.number} />}
            {section.id === "path" ? (
              <PathGlassCard section={section} isKo={isKo} />
            ) : (
              <SectionBlock
                id={section.id}
                style={catVars(section.catToken as CategoryToken)}
              >
                <SectionHead>
                  {section.ghost && <SectionGhost>{section.ghost}</SectionGhost>}
                  <SectionHeadRow>
                    <SectionNumber>{section.number}</SectionNumber>
                    <SectionTitle>
                      {isKo && section.titleKo ? section.titleKo : section.title}
                    </SectionTitle>
                    {section.subtitle && (
                      <SectionSub>
                        {isKo && section.subtitleKo ? section.subtitleKo : section.subtitle}
                      </SectionSub>
                    )}
                  </SectionHeadRow>
                </SectionHead>
                <SectionBody section={section} isKo={isKo} />
              </SectionBlock>
            )}
          </React.Fragment>
        ))}
      </MainContent>

      <Sidebar>
        <StatusLine>
          <StatusDot />
          <span>{isKo ? "보안 직무 채용 중" : "Open to security roles"}</span>
          <StatusSep>·</StatusSep>
          <StatusDim>{isKo ? "2026년 5월 졸업" : "grad May 2026"}</StatusDim>
        </StatusLine>

        <SidebarPart>
          <SidebarLabel>{tr("ON THIS PAGE")}</SidebarLabel>
          {navSections.map((s) => (
            <SidebarNavItem
              key={s.id}
              href={`#${s.id}`}
              onClick={(e: React.MouseEvent<HTMLAnchorElement>) => handleNavClick(s.id, e)}
              data-active={activeId === s.id ? "true" : "false"}
            >
              <NavNum>{s.number}</NavNum>
              <NavText>{isKo && s.titleKo ? s.titleKo : s.title}</NavText>
            </SidebarNavItem>
          ))}
        </SidebarPart>

      </Sidebar>
    </Shell>
    </DrawerWrap>
  )
}

/* ── PATH glass card ── */

const PathGlassCard: React.FC<{ section: AboutSection; isKo: boolean }> = ({ section, isKo }) => {
  const blocks = section.narrative ?? []
  const pBlocks = blocks.filter((b): b is Extract<typeof b, { type: "p" }> => b.type === "p")
  const lede = pBlocks[0]
  const prose = pBlocks[1]
  return (
    <PathCard id={section.id}>
      <PathLabel>— {isKo && section.titleKo ? section.titleKo : section.title}</PathLabel>
      {lede && (
        <PathLede dangerouslySetInnerHTML={{ __html: lang(lede.en, lede.ko, isKo) }} />
      )}
      {prose && (
        <PathProse dangerouslySetInnerHTML={{ __html: lang(prose.en, prose.ko, isKo) }} />
      )}
    </PathCard>
  )
}

/* ── Section divider ── */

const SectionDividerEl: React.FC<{ num: string }> = ({ num }) => (
  <SectionDivider>
    <span>{num}</span>
  </SectionDivider>
)

/* ── Section body dispatcher ── */

const SectionBody: React.FC<{
  section: AboutSection
  isKo: boolean
  showLede?: boolean
}> = ({ section, isKo, showLede }) => {
  if (section.narrative) {
    return <NarrativeBlockList blocks={section.narrative} isKo={isKo} showLede={showLede} />
  }
  if (section.cards) {
    return (
      <CardSectionWrap>
        <CardGrid>
          {section.cards.map((card, i) => {
            const title = isKo && card.titleKo ? card.titleKo : card.title
            const body = isKo && card.bodyKo ? card.bodyKo : card.body
            return (
              <CardItem key={i}>
                <CardTitle>{title}</CardTitle>
                <CardBody dangerouslySetInnerHTML={{ __html: body }} />
                {card.refs?.map((ref, j) => (
                  <RefRow key={j}>
                    <a href={ref.href} target="_blank" rel="noopener noreferrer">{ref.label}</a>
                  </RefRow>
                ))}
              </CardItem>
            )
          })}
        </CardGrid>
        {section.footer && <NarrativeBlockList blocks={section.footer} isKo={isKo} />}
      </CardSectionWrap>
    )
  }
  return null
}

/* ── Narrative block renderer ── */

const lang = (en: string, ko: string | undefined, isKo: boolean): string =>
  isKo && ko ? ko : en

const NarrativeBlockList: React.FC<{ blocks: NarrativeBlock[]; isKo: boolean; showLede?: boolean }> = ({
  blocks,
  isKo,
  showLede,
}) => {
  let ledeDone = false
  return (
  <NarrativeBody>
    {blocks.map((block, i) => {
      if (block.type === "p") {
        if (showLede && !ledeDone) {
          ledeDone = true
          return <LedeLine key={i} dangerouslySetInnerHTML={{ __html: lang(block.en, block.ko, isKo) }} />
        }
        return <NarrP key={i} dangerouslySetInnerHTML={{ __html: lang(block.en, block.ko, isKo) }} />
      }
      if (block.type === "sub")
        return <SubHead key={i}>{lang(block.en, block.ko, isKo)}</SubHead>
      if (block.type === "quote")
        return <FullPullQuote key={i}><p>{lang(block.en, block.ko, isKo)}</p></FullPullQuote>
      if (block.type === "metrics")
        return (
          <InlineMetrics key={i}>
            {block.items.map((m, j) => (
              <IMCell key={j}>
                <IMVal>{m.val}</IMVal>
                <IMLbl>{lang(m.en, m.ko, isKo)}</IMLbl>
              </IMCell>
            ))}
          </InlineMetrics>
        )
      if (block.type === "group")
        return (
          <GroupBlock key={i}>
            <FigRow $count={block.photos.length}>
              {block.photos.map((photo, j) => (
                <FigItem key={j}>
                  <GroupPhoto $shape={block.shape}>
                    <PhotoImg src={photo.src} alt={lang(photo.altEn, photo.altKo, isKo)} />
                  </GroupPhoto>
                  <FigCaption>{lang(photo.altEn, photo.altKo, isKo)}</FigCaption>
                </FigItem>
              ))}
            </FigRow>
            <GroupText dangerouslySetInnerHTML={{ __html: lang(block.en, block.ko, isKo) }} />
          </GroupBlock>
        )
      if (block.type === "ref")
        return (
          <RefRow key={i}>
            <a href={block.href} target="_blank" rel="noopener noreferrer">
              {block.label}
            </a>
          </RefRow>
        )
      if (block.type === "li")
        return (
          <LiItem key={i}>
            <LiArrow aria-hidden="true">→</LiArrow>
            <span dangerouslySetInnerHTML={{ __html: lang(block.en, block.ko, isKo) }} />
          </LiItem>
        )
      return null
    })}
  </NarrativeBody>
  )
}

export default AboutDrawerContent

/* ─── PATH glass card ─── */

const PathCard = styled.section`
  position: relative;
  overflow: hidden;
  background: rgba(8, 6, 17, 0.82);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-lg);
  padding: 1.375rem 1.625rem 1.5rem;
  box-shadow: 0 0 0 1px rgba(255,255,255,.04) inset, 0 10px 30px rgba(0,0,0,.4);

  &::before {
    content: '';
    position: absolute;
    inset: 0 0 auto 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,.15), transparent);
    pointer-events: none;
  }
`

const PathLabel = styled.p`
  margin: 0 0 0.75rem;
  font-family: ${({ theme }) => theme.brand.fontMono};
  font-size: 0.5625rem;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.brand.textFaint};
`

const PathLede = styled.p`
  margin: 0 0 0.875rem;
  font-family: ${({ theme }) => theme.brand.fontDisplay};
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1.4;
  letter-spacing: -0.01em;
  color: ${({ theme }) => theme.brand.text};

  strong { color: ${({ theme }) => theme.brand.text}; }
`

const PathProse = styled.p`
  margin: 0;
  font-size: 0.9375rem;
  line-height: 1.8;
  color: ${({ theme }) => theme.brand.textMuted};

  strong { font-weight: 600; color: ${({ theme }) => theme.brand.text}; }
`

/* ─── Outer container (provides about-drawer query context) ─── */

const DrawerWrap = styled.div`
  container-type: inline-size;
  container-name: about-drawer;
  min-width: 0;
  max-width: calc(690px + 1.625rem + 216px);
  margin: 0 auto;
  padding-bottom: 3rem;
  position: relative;
`

/* ─── Shell — responsive grid: 1-col → 2-col ─── */

const Shell = styled.div`
  min-width: 0;
  display: grid;
  grid-template-columns: 1fr;
  align-items: start;

  /* 840px accounts for FeedPanelScroll+side-l padding (52px total) so 2-col
   * activates at the default 960px panel: DrawerWrap = 908px ≥ 840px. */
  @container about-drawer (min-width: 840px) {
    grid-template-columns: minmax(0, 690px) 216px;
    column-gap: 1.625rem;
    max-width: calc(690px + 1.625rem + 216px);
  }
`

/* ─── Main content column (provides about-main query context) ─── */

const MainContent = styled.div`
  min-width: 0;
  width: 100%;
  max-width: 680px;
  container-type: inline-size;
  container-name: about-main;
`

const LedeLine = styled.p`
  margin: 0 0 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--cat-soft, ${({ theme }) => theme.brand.borderSoft});
  font-family: ${({ theme }) => theme.brand.fontDisplay};
  font-size: clamp(17px, 2.2vw, 20px);
  font-weight: 600;
  line-height: 1.45;
  letter-spacing: -0.01em;
  color: ${({ theme }) => theme.brand.text};
`

/* ─── Section divider ─── */

const SectionDivider = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 2.5rem 0;

  &::before, &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: ${({ theme }) => theme.brand.borderSoft};
  }

  span {
    font-family: ${({ theme }) => theme.brand.fontMono};
    font-size: 0.5rem;
    color: ${({ theme }) => theme.brand.textFaint};
    letter-spacing: 0.2em;
  }
`

/* ─── Section block ─── */

const SectionBlock = styled.section`
  min-width: 0;
`

const SectionHead = styled.div`
  position: relative;
  margin-bottom: 1.25rem;
  padding-top: 0.25rem;
  overflow: hidden;
`

const SectionGhost = styled.span`
  position: absolute;
  top: -14px;
  left: -2px;
  font-family: ${({ theme }) => theme.brand.fontDisplay};
  font-size: 72px;
  font-weight: 800;
  color: ${({ theme }) => theme.brand.text};
  opacity: 0.03;
  line-height: 1;
  pointer-events: none;
  user-select: none;
  letter-spacing: -0.04em;
  z-index: 0;
`

const SectionHeadRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  position: relative;
  z-index: 1;
  flex-wrap: wrap;
`

const SectionNumber = styled.span`
  font-family: ${({ theme }) => theme.brand.fontMono};
  font-size: 0.8125rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: var(--cat-color, ${({ theme }) => theme.brand.accent});
  border: 1px solid var(--cat-ring, rgba(155, 108, 255, 0.4));
  border-radius: 8px;
  padding: 3px 9px;
  line-height: 1;
  flex-shrink: 0;
`

const SectionTitle = styled.h2`
  margin: 0;
  font-family: ${({ theme }) => theme.brand.fontDisplay};
  font-size: 1.375rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.brand.text};
  line-height: 1.1;
`

const SectionSub = styled.span`
  margin-left: auto;
  font-family: ${({ theme }) => theme.brand.fontMono};
  font-size: 0.5625rem;
  font-weight: 400;
  letter-spacing: 0.08em;
  color: ${({ theme }) => theme.brand.textFaint};
`

/* ─── Narrative body ─── */

const NarrativeBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
`

const NarrP = styled.p`
  margin: 0;
  font-size: 1rem;
  line-height: 1.8;
  color: ${({ theme }) => theme.brand.textMuted};

  strong { font-weight: 600; color: ${({ theme }) => theme.brand.text}; }
  em { font-style: italic; }
  code {
    font-family: ${({ theme }) => theme.brand.fontMono};
    font-size: 0.75rem;
    background: ${({ theme }) => theme.brand.surface2};
    border: 1px solid ${({ theme }) => theme.brand.borderSoft};
    padding: 1px 5px;
    border-radius: 3px;
    color: ${({ theme }) => theme.brand.text};
  }
`

const SubHead = styled.p`
  margin: 1.625rem 0 0.375rem;
  font-family: ${({ theme }) => theme.brand.fontDisplay};
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: -0.01em;
  text-transform: none;
  color: ${({ theme }) => theme.brand.text};

  &::before {
    content: '— ';
    color: #2fe6ff;
    letter-spacing: 0;
    font-weight: 400;
  }
`

const FullPullQuote = styled.div`
  margin: 0.5rem 0;
  padding: 0.875rem 1.125rem;
  border-left: 3px solid #ff5cd0;
  background: transparent;
  position: relative;

  p {
    font-family: ${({ theme }) => theme.brand.fontDisplay};
    font-size: 1rem;
    font-style: normal;
    font-weight: 500;
    color: ${({ theme }) => theme.brand.text};
    line-height: 1.65;
    margin: 0;
  }
`

const InlineMetrics = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 5px;
  margin: 0.25rem 0;

  @container about-main (max-width: 420px) {
    grid-template-columns: repeat(2, 1fr);
  }
`

const IMCell = styled.div`
  background: ${({ theme }) => theme.brand.surface};
  border: 1px solid ${({ theme }) => theme.brand.borderSoft};
  border-radius: var(--radius-md);
  padding: 10px 10px 9px;
`

const IMVal = styled.div`
  font-family: ${({ theme }) => theme.brand.fontMono};
  font-size: 1.375rem;
  color: ${({ theme }) => theme.brand.text};
  line-height: 1;
  margin-bottom: 5px;
  font-weight: 500;
`

const IMLbl = styled.div`
  font-size: 0.6875rem;
  color: ${({ theme }) => theme.brand.textFaint};
  line-height: 1.35;
`

const PhotoImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`

/* ─── Group block (keyword → photos → text) ─── */

const GroupBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
`

const FigRow = styled.div<{ $count: number }>`
  display: grid;
  grid-template-columns: ${({ $count }: { $count: number }) =>
    $count === 1 ? "minmax(0, 220px)" : `repeat(${$count}, 1fr)`};
  gap: 6px;
`

const FigItem = styled.figure`
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 5px;
`

const FigCaption = styled.figcaption`
  font-family: ${({ theme }: any) => theme.brand.fontMono};
  font-size: 0.5625rem;
  letter-spacing: 0.04em;
  color: ${({ theme }: any) => theme.brand.textFaint};
  line-height: 1.4;
`

const GroupPhoto = styled.div<{ $shape?: "portrait" | "rect" }>`
  border-radius: var(--radius-md);
  overflow: hidden;
  aspect-ratio: ${({ $shape }) => $shape === "rect" ? "4 / 3" : "3 / 4"};
  max-height: 200px;
  border: 1px solid ${({ theme }) => theme.brand.borderSoft};
  position: relative;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(13, 13, 18, 0.35) 0%, transparent 50%);
    pointer-events: none;
  }
`

const GroupText = styled.div`
  font-size: 0.9375rem;
  line-height: 1.8;
  color: ${({ theme }) => theme.brand.textMuted};
  display: flex;
  flex-direction: column;
  gap: 0.65rem;

  p { margin: 0; }
  strong { font-weight: 600; color: ${({ theme }) => theme.brand.text}; }
`

const RefRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0.1rem 0 0.3rem;

  &::before {
    content: '↗';
    font-size: 0.5625rem;
    color: ${({ theme }) => theme.brand.link};
  }

  a {
    font-family: ${({ theme }) => theme.brand.fontMono};
    font-size: 0.625rem;
    color: ${({ theme }) => theme.brand.link};
    text-decoration: none;
    border-bottom: 1px solid ${({ theme }) => theme.brand.linkSoft};
    transition: color 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;

    &:hover {
      color: ${({ theme }) => theme.brand.linkHover};
      border-color: ${({ theme }) => theme.brand.link};
      box-shadow: var(--glow-cy, none);
    }
  }
`

const LiItem = styled.div`
  display: flex;
  gap: 0.6rem;
  align-items: flex-start;
  padding: 0.6rem 0.875rem;
  background: ${({ theme }) => theme.brand.surface};
  border: 1px solid ${({ theme }) => theme.brand.borderSoft};
  border-left: 2px solid ${({ theme }) => theme.brand.accent};
  border-radius: var(--radius-md);
  font-size: 0.9375rem;
  line-height: 1.7;
  color: ${({ theme }) => theme.brand.textMuted};

  strong { font-weight: 600; color: ${({ theme }) => theme.brand.text}; }
`

const LiArrow = styled.span`
  flex-shrink: 0;
  font-family: ${({ theme }) => theme.brand.fontMono};
  font-size: 0.75rem;
  color: ${({ theme }) => theme.brand.accent};
  padding-top: 3px;
`

/* ─── Cards (Designs section) ─── */

const CardSectionWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
`

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.6rem;

  @container about-main (min-width: 480px) {
    grid-template-columns: repeat(2, 1fr);

    > :last-child:nth-child(odd) {
      grid-column: 1 / -1;
    }
  }
`

const CardItem = styled.div`
  padding: 0.9rem 1rem;
  background: ${({ theme }) => theme.brand.surface};
  border: 1px solid ${({ theme }) => theme.brand.borderSoft};
  border-radius: var(--radius-md);
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  transition: border-color 0.15s ease;

  &:hover {
    border-color: ${({ theme }) => theme.brand.accent}33;
  }
`

const CardTitle = styled.p`
  margin: 0;
  font-size: 0.9375rem;
  font-weight: 600;
  color: ${({ theme }) => theme.brand.text};
`

const CardBody = styled.div`
  font-size: 0.875rem;
  line-height: 1.75;
  color: ${({ theme }) => theme.brand.textMuted};
  display: flex;
  flex-direction: column;
  gap: 0.55rem;

  p { margin: 0; }
  strong { font-weight: 600; color: ${({ theme }) => theme.brand.text}; }
  code {
    font-family: ${({ theme }) => theme.brand.fontMono};
    font-size: 0.6875rem;
    background: ${({ theme }) => theme.brand.surface2};
    border: 1px solid ${({ theme }) => theme.brand.borderSoft};
    padding: 1px 4px;
    border-radius: 3px;
    color: ${({ theme }) => theme.brand.text};
  }
`

/* ─── Sidebar ─── */

const Sidebar = styled.aside`
  display: none;

  @container about-drawer (min-width: 840px) {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    position: sticky;
    top: 5rem;
    align-self: start;
    max-height: 90vh;
    overflow-y: auto;
    scrollbar-width: none;
    &::-webkit-scrollbar { display: none; }
  }
`

const SidebarPart = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  background: var(--glass-1, ${({ theme }) => theme.brand.surface});
  backdrop-filter: var(--glass-blur, none);
  -webkit-backdrop-filter: var(--glass-blur, none);
  border: 1px solid ${({ theme }) => theme.brand.border};
  border-radius: var(--radius-lg);
  padding: 0.9375rem;
  box-shadow: var(--glass-edge, none), var(--glass-shadow, ${({ theme }) => theme.brand.shadowLg});
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0 0 auto 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,.22), transparent);
    opacity: 0.75;
    pointer-events: none;
  }
`

const SidebarLabel = styled.p`
  margin: 0 0 0.6875rem;
  font-family: ${({ theme }) => theme.brand.fontMono};
  font-size: 0.65625rem;
  font-weight: 500;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.brand.textFaint};
`

const SidebarNavItem = styled.a`
  display: flex;
  gap: 9px;
  padding: 7px 9px;
  border-radius: 8px;
  font-size: 0.78125rem;
  color: ${({ theme }) => theme.brand.textMuted};
  line-height: 1.35;
  text-decoration: none;
  transition: background 0.15s ease, color 0.15s ease, box-shadow 0.15s ease;

  &:hover {
    background: ${({ theme }) => theme.brand.surface2};
    color: ${({ theme }) => theme.brand.text};
  }

  &[data-active="true"] {
    color: ${({ theme }) => theme.brand.text};
    background: linear-gradient(90deg, rgba(155, 108, 255, 0.16), transparent);
    box-shadow: inset 2px 0 0 ${({ theme }) => theme.brand.accent};
  }
`

const NavNum = styled.span`
  font-family: ${({ theme }) => theme.brand.fontMono};
  font-size: 0.65625rem;
  color: ${({ theme }) => theme.brand.textFaint};
  padding-top: 1px;
  flex-shrink: 0;

  ${SidebarNavItem}[data-active="true"] & {
    color: ${({ theme }) => theme.brand.accent};
  }
`

const NavText = styled.span`
  font-size: inherit;
  color: inherit;
  line-height: 1.35;
  overflow-wrap: break-word;
  word-break: break-word;
`

/* ─── Status line (sidebar top) ─── */

const StatusLine = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: ${({ theme }: any) => theme.brand.fontMono};
  font-size: 0.6875rem;
  color: ${({ theme }: any) => theme.brand.text};
  letter-spacing: 0.01em;
  flex-wrap: wrap;
`

const StatusDot = styled.span`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #3ddc84;
  flex: 0 0 auto;
  box-shadow: 0 0 0 3px rgba(61, 220, 132, 0.16);
  animation: livePulse 2.4s ease-in-out infinite;

  @keyframes livePulse {
    0%, 100% { box-shadow: 0 0 0 3px rgba(61, 220, 132, 0.16); }
    50%       { box-shadow: 0 0 0 4px rgba(61, 220, 132, 0.30); }
  }

  @media (prefers-reduced-motion: reduce) { animation: none; }
`

const StatusSep = styled.span`
  color: ${({ theme }: any) => theme.brand.textFaint};
`

const StatusDim = styled.span`
  color: ${({ theme }: any) => theme.brand.textFaint};
`


