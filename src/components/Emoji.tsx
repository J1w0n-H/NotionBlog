import React, { ReactNode } from "react"

const emojiStyle = {
  fontFamily: '"Noto Color Emoji", "Apple Color Emoji", "Segoe UI Emoji", sans-serif',
}

type Props = {
  className?: string
  children?: ReactNode
}

export const Emoji = ({ className, children }: Props) => {
  return (
    <span className={className} css={[emojiStyle]}>
      {children}
    </span>
  )
}
