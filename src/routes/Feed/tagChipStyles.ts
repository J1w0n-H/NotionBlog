import styled from "@emotion/styled"

export const TagChipButton = styled.button<{ $hue: number }>`
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  border-radius: var(--radius-pill);
  border: 1px solid transparent;
  font-family: ${({ theme }) => theme.brand.fontSans};
  font-size: 0.8125rem;
  cursor: pointer;
  background: transparent;
  transition:
    background 0.15s ease,
    border-color 0.15s ease,
    color 0.15s ease,
    transform 0.15s ease,
    opacity 0.15s ease,
    filter 0.15s ease;

  ${({ theme, $hue }) =>
    theme.scheme === "dark"
      ? `
    border-color: oklch(0.72 0.10 ${$hue} / 0.48);
    color: oklch(0.72 0.10 ${$hue});
  `
      : `
    border-color: oklch(0.62 0.08 ${$hue} / 0.52);
    color: oklch(0.45 0.10 ${$hue});
  `}

  &:not([data-active="true"]):hover {
    ${({ theme, $hue }) =>
      theme.scheme === "dark"
        ? `
      background: oklch(0.30 0.07 ${$hue} / 0.55);
    `
        : `
      background: oklch(0.62 0.08 ${$hue} / 0.12);
    `}
    transform: translateY(-1px);
    filter: none;
  }

  &[data-active="true"] {
    ${({ theme, $hue }) =>
      theme.scheme === "dark"
        ? `
      background: oklch(0.34 0.10 ${$hue} / 0.72);
      border-color: oklch(0.78 0.12 ${$hue} / 0.55);
      color: oklch(0.94 0.04 ${$hue});
    `
        : `
      background: oklch(0.62 0.08 ${$hue} / 0.22);
      border-color: oklch(0.42 0.11 ${$hue});
      color: oklch(0.28 0.12 ${$hue});
    `}
    font-weight: 600;
    box-shadow: ${({ theme }) => theme.brand.shadowMd};

    .count {
      color: inherit;
      opacity: 0.85;
    }
  }

  &[data-active="true"]:hover {
    ${({ theme, $hue }) =>
      theme.scheme === "dark"
        ? `
      background: oklch(0.38 0.11 ${$hue} / 0.78);
      border-color: oklch(0.82 0.11 ${$hue} / 0.6);
    `
        : `
      background: oklch(0.58 0.09 ${$hue} / 0.28);
      border-color: oklch(0.36 0.12 ${$hue});
    `}
    transform: translateY(-1px);
    filter: none;
  }

  &:focus-visible {
    ${({ $hue }) => `
    outline: 2px solid oklch(0.48 0.14 ${$hue} / 0.55);
    outline-offset: 2px;
    `}
  }

  &[data-active="true"]:focus-visible {
    ${({ $hue }) => `
    outline-color: oklch(0.42 0.12 ${$hue});
    `}
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
