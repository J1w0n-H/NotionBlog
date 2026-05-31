import React from "react"
import { ExtendedRecordMap } from "notion-types"
import NotionRenderer from "../NotionRenderer"

type Props = {
  recordMap: ExtendedRecordMap
  lang?: string
}

const TranslatedNotionRenderer: React.FC<Props> = ({ recordMap }) => {
  return <NotionRenderer recordMap={recordMap} />
}

export default TranslatedNotionRenderer
