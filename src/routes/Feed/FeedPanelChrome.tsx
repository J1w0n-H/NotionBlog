import styled from "@emotion/styled"
import Link from "next/link"

export const PHead = styled.div`
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 24px;
  background: rgba(12, 9, 24, 0.82);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border-soft, rgba(255, 255, 255, 0.08));
  z-index: 5;
`

export const CloseBtn = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: 36px;
  height: 36px;
  font-family: var(--font-mono, "JetBrains Mono", monospace);
  font-size: 16px;
  color: var(--text, #f1eefb);
  background: var(--surface-2, #1c1838);
  border: 1px solid var(--border, rgba(255, 255, 255, 0.16));
  border-radius: 9px;
  padding: 0;
  cursor: pointer;
  transition: border-color 0.15s, box-shadow 0.15s;

  &:hover {
    border-color: var(--accent, #9b6cff);
    box-shadow: var(--glow-sm, 0 0 10px rgba(155, 108, 255, 0.4));
  }
`

export const Cat = styled.span`
  font-family: var(--font-mono, "JetBrains Mono", monospace);
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--accent, #9b6cff);
  border: 1px solid rgba(155, 108, 255, 0.4);
  border-radius: 999px;
  padding: 3px 10px;
  flex: none;
`

export const PTitle = styled.span`
  font-size: 14.5px;
  font-weight: 600;
  color: var(--text, #f1eefb);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
  flex: 1;
`

export const FullLink = styled(Link)`
  margin-left: auto;
  font-family: var(--font-mono, "JetBrains Mono", monospace);
  font-size: 13px;
  color: var(--dim2, rgba(241, 238, 251, 0.4));
  text-decoration: none;
  flex: none;
  transition: color 0.15s;

  &:hover {
    color: var(--link, #2fe6ff);
  }
`

export const PProgBar = styled.div`
  flex: 0 0 auto;
  height: 2px;
  background: linear-gradient(
    90deg,
    var(--link, #2fe6ff),
    var(--accent, #9b6cff),
    var(--signal, #ff5cd0)
  );
  box-shadow: 0 0 8px rgba(155, 108, 255, 0.5);
  transition: width 0.12s linear;
`

export const PanelBody = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`
