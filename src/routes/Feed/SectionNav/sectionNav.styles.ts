import styled from "@emotion/styled"
import {
  feedDesktopMinMedia,
  feedTabletOnlyMedia,
} from "src/styles/feedBreakpoints"

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 0;

  &[data-nav-dock="true"] {
    flex: 1;
    min-height: 0;

    .section-nav-sticky {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.35rem;
      flex-shrink: 0;
      padding: 0.5rem 0 0.35rem;
      border-bottom: 1px solid color-mix(in srgb, white 6%, transparent);
      background: transparent;
      box-shadow: none;
      position: sticky;
      top: 0;
      z-index: 4;
    }

    .nav-box {
      flex: 1 1 auto;
      min-height: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 0.5rem 0;
      background: none;
      border: none;
      box-shadow: none;
      border-radius: 0;
      -webkit-backdrop-filter: none;
      backdrop-filter: none;
    }

    .nav-box > .nav-list {
      flex: 1 1 auto;
      min-height: 0;
      overflow-y: auto;
      overflow-x: hidden;
      gap: 5px;
      scrollbar-width: none;
      align-items: center;
      display: flex;
      flex-direction: column;

      &::-webkit-scrollbar {
        display: none;
      }
    }

    .nav-box > .nav-list > .section-nav-hint {
      display: none;
    }

    .nav-box > .nav-list > button {
      justify-content: center;
      padding: 0;
      gap: 0;
      width: 34px;
      height: 34px;
      min-width: 34px;
    }

    .nav-box > .nav-list > button .label {
      display: none;
    }
  }

  ${feedDesktopMinMedia} {
    flex: 1;
    min-height: 0;
  }

  ${feedTabletOnlyMedia} {
    flex-direction: row;
    flex-wrap: wrap;
    align-items: stretch;
    gap: 0.75rem;

    .nav-search {
      flex: 1 1 12rem;
      min-width: 12rem;
      margin-bottom: 0;

      > .top {
        display: none;
      }
    }

    .nav-box {
      flex: 1 1 100%;
      padding: 0.625rem 0.75rem;
    }
  }

  @media (max-width: 767px) {
    &:not([data-nav-dock="true"]) {
      display: block;
      .section-nav-sticky { display: block; }
    }

    &[data-nav-dock="true"] {
      flex: none;
      min-height: auto;

      .section-nav-sticky {
        padding: 0;
        border-bottom: none;
        background: transparent;
        box-shadow: none;
        position: static;
        top: auto;
        z-index: auto;
      }
    }

    .nav-box {
      display: none;
    }
  }
`

export const NavStickyTop = styled.div`
  flex-shrink: 0;

  ${feedDesktopMinMedia} {
    position: sticky;
    top: 0;
    z-index: 3;
    margin-bottom: 0.25rem;
    padding-bottom: 0.375rem;
    border-bottom: 1px solid ${({ theme }) => theme.brand.borderSoft};
    background: ${({ theme }) => theme.brand.bg};
    box-shadow: 0 8px 16px -10px oklch(0 0 0 / 0.18);
  }

  &[data-nav-dock-trim="true"] {
    ${feedDesktopMinMedia} {
      box-shadow: none;
      margin-bottom: 0.35rem;
      padding-bottom: 0.35rem;
    }
  }

  ${feedTabletOnlyMedia} {
    display: contents;
  }

  .nav-search {
    margin-bottom: 0.5rem;

    ${feedTabletOnlyMedia} {
      margin-bottom: 0;
    }

    @media (max-width: 767px) {
      margin-bottom: 0;

      > .top {
        display: none;
      }
    }
  }
`

export const DockSearchStack = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
  width: 100%;
`

export const DockSearchIconButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  padding: 0;
  border-radius: 9px;
  border: 1px solid transparent;
  background: transparent;
  color: ${({ theme }) => theme.brand.textFaint};
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.12s ease, border-color 0.12s ease, color 0.12s ease;

  &:hover {
    color: ${({ theme }) => theme.brand.text};
    border-color: ${({ theme }) => theme.brand.border};
    background: ${({ theme }) => theme.brand.surface2};
  }

  &[aria-expanded="true"] {
    color: var(--link, #2fe6ff);
    border-color: color-mix(in srgb, var(--link) 40%, transparent);
    background: color-mix(in srgb, var(--link) 8%, transparent);
  }
`

export const DockSearchInput = styled.input`
  box-sizing: border-box;
  width: 100%;
  padding: 0.45rem 0.55rem;
  border-radius: 0.65rem;
  outline: none;
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.brand.text};
  background: ${({ theme }) => theme.brand.surfaceSunk};
  border: 1px solid ${({ theme }) => theme.brand.border};
  transition: border-color 0.12s ease, box-shadow 0.12s ease;

  &::placeholder {
    color: ${({ theme }) => theme.brand.textFaint};
  }

  &:hover {
    border-color: ${({ theme }) => theme.brand.borderStrong};
  }

  &:focus {
    border-color: ${({ theme }) => theme.brand.accent};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.brand.accentSoft};
  }
`

export const DockInitial = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  pointer-events: none;
`

export const Box = styled.div`
  border-radius: 14px;
  background: var(--glass-1, ${({ theme }) => theme.brand.surface});
  backdrop-filter: var(--glass-blur, none);
  -webkit-backdrop-filter: var(--glass-blur, none);
  border: 1px solid ${({ theme }) => theme.brand.borderSoft};
  padding: 14px;
  box-shadow: var(--glass-edge, none),
    var(--glass-shadow, ${({ theme }) => theme.brand.shadowSm});

  ${feedDesktopMinMedia} {
    flex: 1 1 auto;
    min-height: 0;
    display: flex;
    flex-direction: column;
  }
`

export const Head = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;

  ${feedTabletOnlyMedia} {
    display: none;
  }

  @media (max-width: 767px) {
    display: none;
  }
`

export const Title = styled.div`
  font-family: ${({ theme }) => theme.brand.fontMono};
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.brand.textFaint};
`

export const EntryCount = styled.span`
  font-family: ${({ theme }) => theme.brand.fontMono};
  font-size: 10px;
  font-weight: 500;
  color: var(--accent, ${({ theme }) => theme.brand.accent});
`

export const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;

  ${feedTabletOnlyMedia} {
    flex-direction: row;
    flex-wrap: nowrap;
    gap: 0.375rem;
    overflow-x: auto;
    overflow-y: hidden;
    padding-bottom: 0.125rem;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: thin;
    scrollbar-color: ${({ theme }) => `${theme.brand.border} transparent`};
    &::-webkit-scrollbar {
      height: 5px;
    }
    &::-webkit-scrollbar-thumb {
      background: ${({ theme }) => theme.brand.border};
      border-radius: 999px;
    }
  }
`

export const Item = styled.button`
  text-align: left;
  padding: 5px 8px;
  border-radius: 7px;
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.brand.textMuted};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  transition: background 0.12s ease, color 0.12s ease;
  .label {
    flex: 0 0 auto;
    font-size: 13px;
    font-weight: 500;
    line-height: 1.25;
    white-space: nowrap;
  }

  ${feedTabletOnlyMedia} {
    flex: 0 0 auto;
    width: auto;

    .label {
      flex: 0 0 auto;
    }
  }
  &:hover {
    background: ${({ theme }) => theme.brand.surface2};
    color: ${({ theme }) => theme.brand.text};
  }
  &[data-active="true"] {
    background: linear-gradient(90deg, color-mix(in srgb, var(--accent) 16%, transparent), transparent);
    box-shadow: inset 2px 0 0 0 ${({ theme }) => theme.brand.accent};
    color: ${({ theme }) => theme.brand.text};
    .label {
      font-weight: 700;
    }
  }

  &[data-dock-item="true"] {
    width: 34px;
    height: 34px;
    min-width: 34px;
    border-radius: 9px;
    padding: 0;
    justify-content: center;
    border: 1px solid transparent;
    background: transparent;
    color: ${({ theme }) => theme.brand.textFaint};
    font-family: ${({ theme }) => theme.brand.fontMono};
    font-size: 13px;
    font-weight: 600;
    opacity: 1;
    gap: 0;
    box-shadow: none;
    transition: background 0.12s ease, border-color 0.12s ease,
      color 0.12s ease, box-shadow 0.12s ease;

    &:hover {
      background: ${({ theme }) => theme.brand.surface2};
      border-color: ${({ theme }) => theme.brand.border};
      color: ${({ theme }) => theme.brand.text};
      opacity: 1;
    }

    &[data-active="true"] {
      background: transparent;
      color: var(--link, #2fe6ff);
      border-color: color-mix(in srgb, var(--link) 40%, transparent);
      box-shadow: var(--glow-cy);
    }
  }
`

export const Dot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
  background: ${({ theme }) => theme.brand.textFaint};
  transition: background ${({ theme }) => theme.brand.durationFast}
    ${({ theme }) => theme.brand.ease};
  ${Item}[data-active="true"] & {
    background: var(--accent, #9b6cff);
    box-shadow: var(--glow-sm);
  }
`

export const NavHint = styled.p`
  margin: 0.25rem 0 0;
  padding: 0 0.5rem 0.25rem;
  font-size: 0.72rem;
  line-height: 1.35;
  color: ${({ theme }) => theme.brand.textFaint};
`

export const CountBadge = styled.span`
  font-family: ${({ theme }) => theme.brand.fontMono};
  font-size: 11px;
  color: ${({ theme }) => theme.brand.textFaint};
`

export const DockTooltipEl = styled.div`
  position: fixed;
  transform: translateY(-50%);
  background: ${({ theme }) => theme.brand.surface2};
  color: ${({ theme }) => theme.brand.text};
  border: 1px solid ${({ theme }) => theme.brand.borderStrong};
  border-radius: 8px;
  padding: 5px 10px;
  font-family: ${({ theme }) => theme.brand.fontMono};
  font-size: 0.6875rem;
  font-weight: 500;
  letter-spacing: 0.04em;
  white-space: nowrap;
  pointer-events: none;
  z-index: 200;
  box-shadow: ${({ theme }) => theme.brand.shadowLg};
`

export const NavGroup = styled.div`
  font-family: ${({ theme }) => theme.brand.fontMono};
  font-size: 9px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.brand.textFaint};
  padding: 9px 10px 4px;
  opacity: 0.8;

  &[data-accent="cyan"] {
    color: var(--link, #2fe6ff);
  }
`
