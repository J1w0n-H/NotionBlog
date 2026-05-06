import React, { useEffect, useState } from "react"
import styled from "@emotion/styled"

const ACTIVITIES = [
  "hunting CVEs",
  "reading RFC 8446",
  "fuzzing libpng",
  "drafting a writeup",
]

const StatusPill: React.FC = () => {
  const [i, setI] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % ACTIVITIES.length), 4500)
    return () => clearInterval(t)
  }, [])
  return (
    <Wrapper>
      <Dot />
      <span className="label">currently</span>
      <span className="activity" key={i}>{ACTIVITIES[i]}</span>
    </Wrapper>
  )
}

export default StatusPill

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.625rem;
  background: ${({ theme }) => theme.colors.gray2};
  border: 1px solid ${({ theme }) => theme.colors.gray6};
  border-radius: 0.5rem;
  font-family: ui-monospace, "JetBrains Mono", Menlo, monospace;
  font-size: 0.6875rem;
  margin-top: 0.75rem;
  .label { color: ${({ theme }) => theme.colors.gray10}; }
  .activity {
    color: ${({ theme }) => theme.colors.gray12};
    animation: fadein 0.4s ease;
  }
  @keyframes fadein {
    from { opacity: 0; transform: translateY(2px); }
    to { opacity: 1; transform: none; }
  }
`
const Dot = styled.span`
  width: 7px; height: 7px; border-radius: 50%;
  background: ${({ theme }) => theme.colors.green10};
  box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.green5};
  animation: pulse 2s ease-in-out infinite;
  @keyframes pulse {
    0%, 100% { opacity: 1; } 50% { opacity: 0.55; }
  }
`
