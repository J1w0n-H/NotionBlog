import styled from "@emotion/styled"

const FeedPanelScroll = styled.div`
  --feed-panel-pad-top: 1rem;
  --feed-panel-pad-x: 1.25rem;
  flex: 1;
  min-height: 0;
  overflow-x: hidden;
  overflow-y: auto;
  padding: var(--feed-panel-pad-top) var(--feed-panel-pad-x) 1.5rem;
  scrollbar-width: thin;
  scrollbar-color: ${({ theme }) =>
    `${theme.brand.border} transparent`};

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.brand.border};
    border-radius: 999px;
  }

  > article {
    margin: 0 auto;
    max-width: 100%;
    width: 100%;
  }
`

export default FeedPanelScroll
