import React, { useCallback, useState } from "react"
import styled from "@emotion/styled"
import { CONFIG } from "site.config"
import type { TPost } from "src/types"
import { formatDate } from "src/libs/utils"

type Props = {
  data: TPost
  postUrl: string
}

/** Compact metadata + share under the post TOC (no extra data fetch). */
const PostAsideMeta: React.FC<Props> = ({ data, postUrl }) => {
  const [shareHint, setShareHint] = useState<string | null>(null)
  const dateValue = data?.date?.start_date || data.createdTime
  const category = data.category?.[0]

  const onShare = useCallback(async () => {
    setShareHint(null)
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({ title: data.title, url: postUrl })
        return
      }
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(postUrl)
        setShareHint("Link copied")
        window.setTimeout(() => setShareHint(null), 2000)
      }
    } catch {
      /* user cancelled share or clipboard blocked */
    }
  }, [data.title, postUrl])

  return (
    <Wrap>
      {category ? (
        <Block>
          <Label>Topic</Label>
          <Value>{category}</Value>
        </Block>
      ) : null}
      <Block>
        <Label>Updated</Label>
        <TimeValue dateTime={dateValue}>
          {formatDate(dateValue, CONFIG.lang)}
        </TimeValue>
      </Block>
      {data.tags && data.tags.length > 0 ? (
        <Block>
          <Label>Tags</Label>
          <TagLine>{data.tags.join(" · ")}</TagLine>
        </Block>
      ) : null}
      <Actions>
        <GhostButton type="button" onClick={onShare}>
          Share
        </GhostButton>
        {shareHint ? <ShareHint role="status">{shareHint}</ShareHint> : null}
      </Actions>
    </Wrap>
  )
}

export default PostAsideMeta

const Wrap = styled.div`
  margin-top: 1.25rem;
  padding-top: 1rem;
  border-top: 1px solid ${({ theme }) => theme.brand.borderSoft};
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
`

const Block = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
`

const Label = styled.span`
  font-family: ${({ theme }) => theme.brand.fontMono};
  font-size: 0.625rem;
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.brand.textFaint};
`

const Value = styled.span`
  font-size: 0.8125rem;
  line-height: 1.35;
  color: ${({ theme }) => theme.brand.textMuted};
`

const TimeValue = styled.time`
  font-size: 0.8125rem;
  line-height: 1.35;
  color: ${({ theme }) => theme.brand.textMuted};
`

const TagLine = styled.p`
  margin: 0;
  font-size: 0.8125rem;
  line-height: 1.45;
  color: ${({ theme }) => theme.brand.textMuted};
`

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
`

const GhostButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.35rem 0.75rem;
  border-radius: var(--radius-sm);
  border: 1px solid ${({ theme }) => theme.brand.border};
  background: transparent;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: ${({ theme }) => theme.brand.textMuted};
  cursor: pointer;
  transition:
    border-color ${({ theme }) => theme.brand.durationFast}
      ${({ theme }) => theme.brand.ease},
    color ${({ theme }) => theme.brand.durationFast} ${({ theme }) =>
      theme.brand.ease},
    background ${({ theme }) => theme.brand.durationFast}
      ${({ theme }) => theme.brand.ease};

  &:hover {
    border-color: ${({ theme }) => theme.brand.accent};
    color: ${({ theme }) => theme.brand.accent};
    background: ${({ theme }) => theme.brand.accentSoft};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.brand.accentRing};
    outline-offset: 2px;
  }
`

const ShareHint = styled.span`
  font-size: 0.6875rem;
  color: ${({ theme }) => theme.brand.textFaint};
`
