import React, { useEffect, useState } from "react"
import styled from "@emotion/styled"

const fmt = (tz: string) =>
  new Intl.DateTimeFormat("en-GB", {
    timeZone: tz,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(new Date())

const Clocks: React.FC = () => {
  const [t, setT] = useState({ kst: "--:--:--", est: "--:--:--" })
  useEffect(() => {
    setT({ kst: fmt("Asia/Seoul"), est: fmt("America/New_York") })
    const i = setInterval(
      () => setT({ kst: fmt("Asia/Seoul"), est: fmt("America/New_York") }),
      1000
    )
    return () => clearInterval(i)
  }, [])
  return (
    <Wrapper>
      <Box>
        <span className="city">SEL</span>
        <span className="time">{t.kst}</span>
      </Box>
      <span className="sep">⇄</span>
      <Box>
        <span className="city">NYC</span>
        <span className="time">{t.est}</span>
      </Box>
    </Wrapper>
  )
}

export default Clocks

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 0.5rem;
  align-items: center;
  margin-top: 0.625rem;
  font-family: ui-monospace, "JetBrains Mono", Menlo, monospace;
  .sep { color: ${({ theme }) => theme.colors.gray10}; text-align: center; }
`
const Box = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 0.5rem 0.625rem;
  background: ${({ theme }) => theme.colors.gray2};
  border: 1px solid ${({ theme }) => theme.colors.gray6};
  border-radius: 0.5rem;
  .city {
    font-size: 0.625rem;
    letter-spacing: 0.1em;
    color: ${({ theme }) => theme.colors.gray10};
  }
  .time {
    font-size: 0.8125rem;
    color: ${({ theme }) => theme.colors.gray12};
    font-variant-numeric: tabular-nums;
  }
`
