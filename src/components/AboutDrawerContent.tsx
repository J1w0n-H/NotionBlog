import React, { type RefObject } from "react"
import styled from "@emotion/styled"
import useLanguage from "src/hooks/useLanguage"
import { ABOUT_SECTIONS } from "src/constants/aboutContent"
import { CONFIG } from "site.config"

const { email, github, linkedin } = CONFIG.profile

type Props = { scrollRootRef?: RefObject<HTMLDivElement | null> }

const TOC = [
  { id: "s-path",      en: "Path",         ko: "경로" },
  { id: "s-built",     en: "Built",        ko: "구축" },
  { id: "s-protected", en: "Protected",    ko: "보호" },
  { id: "s-broke",     en: "Broke",        ko: "침투" },
  { id: "s-designs",   en: "Designs next", ko: "다음 설계" },
  { id: "s-person",    en: "The person",   ko: "나에 대해" },
  { id: "s-seek",      en: "What I want",  ko: "찾는 것" },
]

const AboutDrawerContent: React.FC<Props> = ({ scrollRootRef }) => {
  const [language] = useLanguage()
  const isKo = language === "ko"
  const [activeId, setActiveId] = React.useState("")
  const [pct, setPct] = React.useState(0)

  React.useEffect(() => {
    const c = scrollRootRef?.current
    if (!c) return
    const sync = () => {
      const max = c.scrollHeight - c.clientHeight
      setPct(max > 0 ? Math.round((c.scrollTop / max) * 100) : 0)
      const top = c.scrollTop + 90
      let cur = ""
      TOC.forEach(({ id }) => {
        const el = document.getElementById(id)
        if (el && el.offsetTop <= top) cur = id
      })
      setActiveId(cur)
    }
    c.addEventListener("scroll", sync, { passive: true })
    sync()
    return () => c.removeEventListener("scroll", sync)
  }, [scrollRootRef])

  const navTo = (id: string, e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const c = scrollRootRef?.current
    const el = document.getElementById(id)
    if (!c || !el) return
    c.scrollTo({ top: el.offsetTop - 20, behavior: "smooth" })
  }

  const [P, B, Prot, Br, Res, Per, Sk] = ABOUT_SECTIONS
  const t = (en: string, ko?: string) => (isKo && ko ? ko : en)

  return (
    <Wrap>
      <Body>

        {/* ── intro ── */}
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

        {/* ── 00 Path ── */}
        <Sec id="s-path">
          <SH>
            <Num>00</Num>
            <STitle>{t(P.title, P.titleKo)}</STitle>
            <St>{t(P.subtitle ?? "", P.subtitleKo)}</St>
          </SH>
          {P.narrative?.map((b, i) => {
            if (b.type === "p")   return <SP key={i} dangerouslySetInnerHTML={{ __html: t(b.en, b.ko) }} />
            if (b.type === "sub") return <Sub key={i}>{t(b.en, b.ko)}</Sub>
            return null
          })}
        </Sec>

        {/* ── 01 Built ── */}
        <Sec id="s-built">
          <SH>
            <Num>01</Num>
            <STitle>{t(B.title, B.titleKo)}</STitle>
            <St>{t(B.subtitle ?? "", B.subtitleKo)}</St>
          </SH>
          {B.narrative?.map((b, i) => {
            if (b.type === "p")   return <SP key={i} dangerouslySetInnerHTML={{ __html: t(b.en, b.ko) }} />
            if (b.type === "sub") return <Sub key={i}>{t(b.en, b.ko)}</Sub>
            if (b.type === "metrics") return (
              <Metrics key={i}>
                {b.items.map((m, j) => (
                  <MItem key={j}><MVal>{m.val}</MVal><MLbl>{t(m.en, m.ko)}</MLbl></MItem>
                ))}
              </Metrics>
            )
            if (b.type === "quote") return <Pull key={i}>{t(b.en, b.ko)}</Pull>
            return null
          })}
        </Sec>

        {/* ── 02 Protected ── */}
        <Sec id="s-protected">
          <SH>
            <Num>02</Num>
            <STitle>{t(Prot.title, Prot.titleKo)}</STitle>
            <St>{t(Prot.subtitle ?? "", Prot.subtitleKo)}</St>
          </SH>
          {Prot.narrative?.map((b, i) => {
            if (b.type === "p")   return <SP key={i} dangerouslySetInnerHTML={{ __html: t(b.en, b.ko) }} />
            if (b.type === "sub") return <Sub key={i}>{t(b.en, b.ko)}</Sub>
            if (b.type === "quote") return (
              <Manifesto key={i}>
                <ML1>{isKo ? "제로 인시던트는 운이 아닙니다." : "Zero incidents isn't luck."}</ML1>
                <ML2>{isKo ? "시스템이 버텼다는 조용한 증거입니다." : "It's the quiet proof the system held."}</ML2>
              </Manifesto>
            )
            return null
          })}
          <Metrics>
            <MItem><MVal>ZERO</MVal><MLbl>{isKo ? "Sev-1 인시던트" : "Sev-1 incidents"}</MLbl></MItem>
            <MItem><MVal>{isKo ? "4회" : "4 cycles"}</MVal><MLbl>ISMS-P {isKo ? "인증" : "certified"}</MLbl></MItem>
            <MItem><MVal>0</MVal><MLbl>{isKo ? "감사 부적합" : "Audit failures"}</MLbl></MItem>
          </Metrics>
        </Sec>

        {/* ── 03 Broke ── */}
        <Sec id="s-broke">
          <SH>
            <Num>03</Num>
            <STitle>{t(Br.title, Br.titleKo)}</STitle>
            <St>{t(Br.subtitle ?? "", Br.subtitleKo)}</St>
          </SH>
          {Br.narrative?.map((b, i) => {
            if (b.type === "p")   return <SP key={i} dangerouslySetInnerHTML={{ __html: t(b.en, b.ko) }} />
            if (b.type === "sub") return <Sub key={i}>{t(b.en, b.ko)}</Sub>
            if (b.type === "quote") return <Pull key={i}>{t(b.en, b.ko)}</Pull>
            if (b.type === "ref") return (
              <RefRow key={i}>
                <a href={b.href} target="_blank" rel="noopener noreferrer">{b.label}</a>
              </RefRow>
            )
            return null
          })}
        </Sec>

        {/* ── 04 Designs ── */}
        <Sec id="s-designs">
          <SH>
            <Num>04</Num>
            <STitle>{t(Res.title, Res.titleKo)}</STitle>
            <St>{t(Res.subtitle ?? "", Res.subtitleKo)}</St>
          </SH>
          <SP>
            {isKo
              ? "제 연구는 운영 현장의 상처와 공격 훈련이 교차하는 지점에 있습니다 — 단일 알람을 건드리지 않는 구조적 실패들."
              : "My research sits where operational scars and offensive training meet — structural failures that don't trip a single alarm."}
          </SP>
          <RCards>
            {Res.cards?.map((card, i) => (
              <RC key={i}>
                <RCH3>{t(card.title, card.titleKo)}</RCH3>
                <RCBody dangerouslySetInnerHTML={{ __html: t(card.body, card.bodyKo) }} />
                {card.refs?.map((ref, j) => (
                  <RefRow key={j}>
                    <a href={ref.href} target="_blank" rel="noopener noreferrer">{ref.label}</a>
                  </RefRow>
                ))}
              </RC>
            ))}
          </RCards>
          {Res.footer?.map((b, i) => {
            if (b.type === "quote") return <Pull key={i}>{t(b.en, b.ko)}</Pull>
            return null
          })}
        </Sec>

        {/* ── 05 Person ── */}
        <Sec id="s-person">
          <SH>
            <Num>05</Num>
            <STitle>{t(Per.title, Per.titleKo)}</STitle>
            <St>{t(Per.subtitle ?? "", Per.subtitleKo)}</St>
          </SH>
          {Per.narrative?.map((b, i) => {
            if (b.type === "p") return <SP key={i} dangerouslySetInnerHTML={{ __html: t(b.en, b.ko) }} />
            if (b.type === "quote") return <Pull key={i}>{t(b.en, b.ko)}</Pull>
            if (b.type === "group") return (
              <PGal key={i}>
                <PGrid>
                  {b.photos.map((ph, j) => (
                    <PImg key={j} src={ph.src} alt={t(ph.altEn, ph.altKo)} loading="lazy" />
                  ))}
                </PGrid>
                <PCap>
                  <PCF>▣</PCF>
                  <span>{b.photos.map(ph => t(ph.altEn, ph.altKo)).join(" · ")}</span>
                </PCap>
                <GroupText dangerouslySetInnerHTML={{ __html: t(b.en, b.ko) }} />
              </PGal>
            )
            return null
          })}
        </Sec>

        {/* ── 06 Seek ── */}
        <Sec id="s-seek">
          <SH>
            <Num>06</Num>
            <STitle>{t(Sk.title, Sk.titleKo)}</STitle>
            <St>{t(Sk.subtitle ?? "", Sk.subtitleKo)}</St>
          </SH>
          {(() => {
            const blocks = Sk.narrative ?? []
            const liItems = blocks.filter(b => b.type === "li")
            let liDone = false
            return blocks.map((b, i) => {
              if (b.type === "p") return <SP key={i} dangerouslySetInnerHTML={{ __html: t(b.en, b.ko) }} />
              if (b.type === "li") {
                if (liDone) return null
                liDone = true
                return (
                  <SUl key={i}>
                    {liItems.map((li, j) =>
                      li.type === "li" && (
                        <SLi key={j} dangerouslySetInnerHTML={{ __html: t(li.en, li.ko) }} />
                      )
                    )}
                  </SUl>
                )
              }
              return null
            })
          })()}
        </Sec>

        {/* ── CTA ── */}
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

      {/* ── TOC sidebar ── */}
      <TocSide>
        <TocH>
          <span>{isKo ? "이 페이지" : "On this page"}</span>
          <TocPct>{pct}%</TocPct>
        </TocH>
        <TocOl>
          {TOC.map(({ id, en, ko }) => (
            <TocLi key={id}>
              <TocA
                href={`#${id}`}
                data-cur={activeId === id ? "true" : "false"}
                onClick={(e) => navTo(id, e)}
              >
                {isKo ? ko : en}
              </TocA>
            </TocLi>
          ))}
        </TocOl>
      </TocSide>
    </Wrap>
  )
}

export default AboutDrawerContent

/* ─────────────────────────────────────────────────────────────
   Styled components — mirrors the mock's CSS exactly
───────────────────────────────────────────────────────────── */

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
    color: var(--cyan-500, oklch(0.85 0.14 210));
    font-weight: 600;
  }
`

/* ── intro ── */

const Intro = styled.div`
  margin-bottom: 8px;
`

const Who = styled.p`
  font-family: var(--font-mono, "JetBrains Mono", monospace);
  font-size: 12px;
  letter-spacing: 0.04em;
  color: #9a93b8;
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
  color: var(--text, #f1eefb);
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
  font-size: 16px;
  line-height: 1.62;
  color: var(--text-muted, #cdcae0);
  margin: 0;
  text-wrap: pretty;

  b {
    color: var(--text, #f1eefb);
    font-weight: 600;
  }
`

/* ── section ── */

const Sec = styled.section`
  padding-top: 34px;
  margin-top: 32px;
  border-top: 1px solid var(--border-soft, rgba(255,255,255,.08));
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
  font-family: var(--font-mono, "JetBrains Mono", monospace);
  font-size: 13px;
  font-weight: 600;
  color: var(--accent);
  text-shadow: var(--glow-sm, 0 0 10px color-mix(in srgb, var(--accent) 40%, transparent));
`

const STitle = styled.h2`
  font-size: 23px;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: var(--text, #f1eefb);
  text-transform: none;
  margin: 0;
`

const St = styled.span`
  font-family: var(--font-mono, "JetBrains Mono", monospace);
  font-size: 11px;
  color: #9a93b8;
  margin-left: auto;
  align-self: center;
  letter-spacing: 0.02em;
`

/* body paragraph */
const SP = styled.p`
  font-size: 15.5px;
  line-height: 1.72;
  color: var(--text-muted, #cdcae0);
  margin-bottom: 16px;
  text-wrap: pretty;

  &:last-child { margin-bottom: 0; }

  strong, b {
    color: var(--text, #f1eefb);
    font-weight: 600;
  }

  .cl {
    color: var(--link);
    font-weight: 500;
  }

  code {
    font-family: var(--font-mono, "JetBrains Mono", monospace);
    font-size: 0.86em;
    color: var(--link);
    background: color-mix(in srgb, var(--link) 8%, transparent);
    border: 1px solid color-mix(in srgb, var(--link) 20%, transparent);
    border-radius: 5px;
    padding: 1px 5px;
  }

  a { color: var(--link); text-decoration: underline; }
`

/* sub-section label */
const Sub = styled.p`
  font-size: 12.5px;
  font-family: var(--font-mono, "JetBrains Mono", monospace);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--accent);
  margin: 24px 0 12px;
`

/* pull quote */
const Pull = styled.blockquote`
  font-family: "Source Serif 4", serif;
  font-size: 18px;
  line-height: 1.5;
  color: var(--text, #f1eefb);
  border-left: 3px solid var(--accent);
  padding: 4px 0 4px 20px;
  margin: 26px 0;
  text-wrap: balance;
`

/* manifesto (Protected section dramatic quote) */
const Manifesto = styled.div`
  font-family: "Source Serif 4", serif;
  font-size: clamp(20px, 2.4vw, 25px);
  line-height: 1.4;
  margin: 8px 0 6px;
  text-wrap: balance;
`

const ML1 = styled.span`
  color: #ffc4d6;
  text-shadow: 0 0 16px color-mix(in srgb, var(--signal) 30%, transparent);
  display: block;
`

const ML2 = styled.span`
  color: var(--text, #f1eefb);
  display: block;
`

/* metrics bar */
const Metrics = styled.div`
  display: flex;
  flex-wrap: wrap;
  border: 1px solid var(--border-soft, rgba(255,255,255,.08));
  border-radius: 14px;
  overflow: hidden;
  background: var(--glass-1, rgba(20,16,38,.44));
  margin: 6px 0;
  width: fit-content;
  max-width: 100%;
`

const MItem = styled.div`
  padding: 13px 22px;
  border-right: 1px solid var(--border-soft, rgba(255,255,255,.08));
  display: flex;
  flex-direction: column;
  gap: 4px;

  &:last-child { border-right: 0; }
`

const MVal = styled.span`
  font-family: var(--font-mono, "JetBrains Mono", monospace);
  font-weight: 600;
  font-size: 21px;
  color: var(--text, #f1eefb);
  text-shadow: 0 0 12px color-mix(in srgb, var(--accent) 50%, transparent);
  line-height: 1;
`

const MLbl = styled.span`
  font-family: var(--font-mono, "JetBrains Mono", monospace);
  font-size: 10.5px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #9a93b8;
`

/* research cards */
const RCards = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  margin: 6px 0;
`

const RC = styled.div`
  border: 1px solid var(--border-soft, rgba(255,255,255,.08));
  border-radius: 13px;
  padding: 16px 18px;
  background: var(--glass-1, rgba(20,16,38,.44));
  transition: border-color 0.16s, box-shadow 0.16s;

  &:hover {
    border-color: color-mix(in srgb, var(--accent) 40%, transparent);
    box-shadow: var(--glow-sm, 0 0 10px color-mix(in srgb, var(--accent) 40%, transparent));
  }
`

const RCH3 = styled.h3`
  font-size: 14.5px;
  font-weight: 600;
  color: var(--text, #f1eefb);
  margin: 0 0 6px;
  display: flex;
  align-items: center;
  gap: 9px;
`

const RCBody = styled.div`
  font-size: 13px;
  line-height: 1.6;
  color: var(--text-muted, #cdcae0);

  p { margin: 0 0 8px; }
  p:last-child { margin: 0; }

  strong, b {
    color: var(--text, #f1eefb);
    font-weight: 600;
  }

  code {
    font-family: var(--font-mono, "JetBrains Mono", monospace);
    font-size: 0.86em;
    color: var(--link);
    background: color-mix(in srgb, var(--link) 8%, transparent);
    border: 1px solid color-mix(in srgb, var(--link) 20%, transparent);
    border-radius: 4px;
    padding: 1px 4px;
  }
`

/* ref link */
const RefRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 6px 0 4px;

  &::before {
    content: "↗";
    font-size: 9px;
    color: var(--link);
    flex: none;
  }

  a {
    font-family: var(--font-mono, "JetBrains Mono", monospace);
    font-size: 11px;
    color: var(--link);
    text-decoration: none;
    border-bottom: 1px solid color-mix(in srgb, var(--link) 30%, transparent);
    transition: color 0.15s, border-color 0.15s;

    &:hover {
      color: #62ecff;
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
  object-fit: contain;
  background: var(--surface-sunk, oklch(0.12 0.03 285));
  border-radius: 12px;
  border: 1px solid var(--border-soft, rgba(255,255,255,.08));
  display: block;
`

const PCap = styled.p`
  font-family: var(--font-mono, "JetBrains Mono", monospace);
  font-size: 10.5px;
  color: #9a93b8;
  margin: 9px 0 0;
  display: flex;
  gap: 8px;
  align-items: baseline;
`

const PCF = styled.span`
  color: var(--accent);
`

const GroupText = styled.div`
  font-size: 15.5px;
  line-height: 1.72;
  color: var(--text-muted, #cdcae0);
  margin-top: 8px;

  p { margin: 0 0 12px; }
  p:last-child { margin: 0; }

  strong, b {
    color: var(--text, #f1eefb);
    font-weight: 600;
  }
`

/* seek list */
const SUl = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 11px;
  margin: 4px 0 16px;
  padding: 0;
`

const SLi = styled.li`
  font-size: 15px;
  line-height: 1.6;
  color: var(--text-muted, #cdcae0);
  padding-left: 24px;
  position: relative;

  &::before {
    content: "›";
    position: absolute;
    left: 4px;
    top: -1px;
    color: var(--link);
    font-weight: 700;
    font-size: 16px;
  }

  strong, b {
    color: var(--text, #f1eefb);
    font-weight: 600;
  }
`

/* CTA box */
const CTABox = styled.div`
  margin-top: 40px;
  padding: 24px 26px;
  border: 1px solid color-mix(in srgb, var(--accent) 28%, transparent);
  border-radius: 16px;
  background:
    radial-gradient(440px 200px at 0% 0%, color-mix(in srgb, var(--accent) 14%, transparent), transparent 60%),
    var(--glass-1, rgba(20,16,38,.44));
`

const CTATitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: var(--text, #f1eefb);
  margin: 0 0 8px;
`


const CTARow = styled.div`
  display: flex;
  gap: 11px;
  flex-wrap: wrap;
  align-items: center;
`

const Btn = styled.a`
  font-size: 13.5px;
  font-weight: 600;
  border-radius: 9px;
  padding: 10px 17px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.16s;
  border: 1px solid transparent;
  white-space: nowrap;
  text-decoration: none;
  cursor: pointer;
`

const BtnGh = styled(Btn)`
  background: transparent;
  color: var(--text, #f1eefb);
  border-color: var(--border, rgba(255,255,255,.16));

  &:hover { border-color: var(--accent); }
`

/* seek social links */
const SeekLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 20px;
  flex-wrap: wrap;
  font-family: var(--font-mono, "JetBrains Mono", monospace);
  font-size: 12px;
`

const SLink = styled.a`
  text-decoration: none;
  color: var(--text-faint, #9a93b8);
  transition: color 0.15s;
  &:hover { color: var(--link); }
`

const SEmailLink = styled.a`
  text-decoration: none;
  color: var(--link);
  border: 1px solid color-mix(in srgb, var(--link) 34%, transparent);
  border-radius: 9px;
  padding: 5px 11px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: background 0.15s, border-color 0.15s, box-shadow 0.15s;
  &:hover {
    background: color-mix(in srgb, var(--link) 12%, transparent);
    border-color: var(--link);
    box-shadow: 0 0 14px color-mix(in srgb, var(--link) 32%, transparent);
  }
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
  font-family: var(--font-mono, "JetBrains Mono", monospace);
  font-size: 10px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #8b84a6;
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
  border-left: 1px solid var(--border-soft, rgba(255,255,255,.08));
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
  font-size: 12.5px;
  color: #9a93b8;
  padding: 7px 12px;
  margin-left: -1px;
  border-left: 2px solid transparent;
  border-radius: 0 8px 8px 0;
  text-decoration: none;
  transition: color 0.15s, border-color 0.15s, background 0.15s;

  &::before {
    content: "0" counter(t);
    font-family: var(--font-mono, "JetBrains Mono", monospace);
    font-size: 9.5px;
    color: #8b84a6;
    flex: none;
    transition: color 0.15s;
  }

  &:hover {
    color: var(--text, #f1eefb);
  }

  &[data-cur="true"] {
    color: var(--text, #f1eefb);
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

  &[data-cur="true"]::before {
    color: var(--link);
    text-shadow: var(--glow-cy, 0 0 10px color-mix(in srgb, var(--link) 40%, transparent));
  }
`
