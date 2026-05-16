import styled from "@emotion/styled"

/**
 * Outline-only tag chip. Color comes from `--cat-color` set on the element via
 * `style={catVars(token)}` from the calling component (TagChips / TagChipPanel).
 */
export const TagChipButton = styled.button`
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  border-radius: var(--radius-pill);
  border: 1px solid oklch(from var(--cat-color) l c h / 0.35);
  background: oklch(from var(--cat-color) l c h / 0.10);
  color: var(--cat-color);
  font-family: ${({ theme }) => theme.brand.fontSans};
  font-size: 0.8125rem;
  cursor: pointer;
  transition:
    background 0.15s ease,
    border-color 0.15s ease,
    color 0.15s ease,
    box-shadow 0.15s ease,
    transform 0.15s ease;

  &:not([data-active="true"]):hover {
    background: oklch(from var(--cat-color) l c h / 0.26);
    border-color: oklch(from var(--cat-color) l c h / 0.55);
    transform: translateY(-1px);
  }

  &[data-active="true"] {
    background: var(--cat-color);
    border-color: var(--cat-color);
    color: oklch(0.97 0 0);
    font-weight: 700;
    box-shadow: 0 2px 10px oklch(from var(--cat-color) l c h / 0.45);

    .count {
      color: inherit;
      opacity: 0.85;
    }
  }

  &[data-active="true"]:hover {
    background: oklch(from var(--cat-color) l c h / 0.85);
    transform: translateY(-1px);
  }

  &:focus-visible {
    outline: 2px solid oklch(from var(--cat-color) l c h / 0.55);
    outline-offset: 2px;
  }

  .label {
    flex: 0 1 auto;
    min-width: 0;
    text-align: left;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .count {
    flex-shrink: 0;
    font-family: ${({ theme }) => theme.brand.fontMono};
    font-size: 0.6875rem;
    opacity: 0.9;
    color: inherit;
    white-space: nowrap;
    line-height: 1rem;
    min-width: 1.125rem;
    text-align: center;
    padding-inline-start: 0.0625rem;
  }
`

export const TagChipClearButton = styled.button`
  flex-shrink: 0;
  padding: 0.25rem 0.625rem;
  border-radius: var(--radius-pill);
  border: 1px solid ${({ theme }) => theme.brand.borderSoft};
  background: ${({ theme }) => theme.brand.surface2};
  color: ${({ theme }) => theme.brand.textMuted};
  font-family: ${({ theme }) => theme.brand.fontSans};
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  cursor: pointer;
  transition:
    background 0.12s ease,
    border-color 0.12s ease,
    color 0.12s ease;

  &:hover {
    background: ${({ theme }) => theme.brand.surface};
    border-color: ${({ theme }) => theme.brand.borderStrong};
    color: ${({ theme }) => theme.brand.text};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.brand.accentRing};
    outline-offset: 2px;
  }
`
