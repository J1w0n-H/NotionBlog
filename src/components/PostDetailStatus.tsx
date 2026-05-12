import styled from "@emotion/styled"
import type { FC } from "react"

export type PostDetailStatusScope = "panel" | "page"
export type PostDetailStatusSubject = "post" | "about"

type StatusProps = {
  scope: PostDetailStatusScope
  subject?: PostDetailStatusSubject
}

function loadingLabel(subject: PostDetailStatusSubject = "post"): string {
  return subject === "about" ? "Loading About…" : "Loading post…"
}

function errorLabel(subject: PostDetailStatusSubject = "post"): string {
  return subject === "about" ? "Could not load About." : "Could not load this post."
}

export const PostDetailLoadingStatus: FC<StatusProps> = ({
  scope,
  subject = "post",
}) => {
  return (
    <StatusText data-scope={scope} data-kind="loading">
      {loadingLabel(subject)}
    </StatusText>
  )
}

export const PostDetailErrorStatus: FC<StatusProps> = ({
  scope,
  subject = "post",
}) => {
  return (
    <StatusText data-scope={scope} data-kind="error">
      {errorLabel(subject)}
    </StatusText>
  )
}

const StatusText = styled.p`
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.45;
  color: ${({ theme }) => theme.brand.textMuted};

  &[data-scope="panel"] {
    padding: 1rem 0;
  }

  &[data-scope="page"] {
    padding: 2rem 0;
    text-align: center;
  }

  &[data-kind="error"] {
    color: ${({ theme }) => theme.brand.text};
  }
`
