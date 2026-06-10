import { keyframes } from "@emotion/react"

// ── Hero / About ──────────────────────────────────────────────────────────────

export const nameSlide = keyframes`
  0%   { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
`

export const cursorBlink = keyframes`
  0%, 49.9% { opacity: 1; }
  50%, 100%  { opacity: 0; }
`

export const nebulaA = keyframes`
  0%, 100% { transform: translate(0, 0) scale(1); }
  33%  { transform: translate(40px, -25px) scale(1.06); }
  66%  { transform: translate(-20px, 30px) scale(0.96); }
`

export const nebulaB = keyframes`
  0%, 100% { transform: translate(0, 0) scale(1); }
  40%  { transform: translate(-30px, 35px) scale(1.05); }
  70%  { transform: translate(25px, -20px) scale(0.97); }
`

export const nebulaC = keyframes`
  0%, 100% { transform: translate(0, 0) scale(1); }
  30%  { transform: translate(25px, 18px) scale(1.04); }
  60%  { transform: translate(-35px, -25px) scale(1.07); }
`

export const starTwinkle = keyframes`
  0%, 100% { opacity: 0.65; }
  50%       { opacity: 0.15; }
`

// ── Feed panels ───────────────────────────────────────────────────────────────

export const feedPanelEnterRight = keyframes`
  from { transform: translateX(16px); opacity: 0; }
  to   { transform: translateX(0);    opacity: 1; }
`

export const feedPanelEnterLeft = keyframes`
  from { transform: translateX(-16px); opacity: 0; }
  to   { transform: translateX(0);     opacity: 1; }
`

export const feedPanelEnterUnfold = keyframes`
  from { transform: translateY(-14px); opacity: 0; }
  to   { transform: translateY(0);     opacity: 1; }
`

export const feedAboutColFadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`

// ── Popovers ──────────────────────────────────────────────────────────────────

export const popoverIn = keyframes`
  from { opacity: 0; transform: translateY(-5px); }
  to   { opacity: 1; transform: translateY(0); }
`
