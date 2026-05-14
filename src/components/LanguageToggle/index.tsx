import React from "react"
import SegmentedToggle from "src/components/SegmentedToggle"

type LanguageType = "ko" | "en"

type Props = {
  currentLanguage: LanguageType
  onLanguageChange: (language: LanguageType) => void
}

const LanguageToggle: React.FC<Props> = ({
  currentLanguage,
  onLanguageChange,
}) => {
  return (
    <SegmentedToggle
      aria-label="Language"
      left={{
        label: "EN",
        selected: currentLanguage === "en",
        onSelect: () => onLanguageChange("en"),
      }}
      right={{
        label: "KO",
        selected: currentLanguage === "ko",
        onSelect: () => onLanguageChange("ko"),
      }}
    />
  )
}

export default LanguageToggle
