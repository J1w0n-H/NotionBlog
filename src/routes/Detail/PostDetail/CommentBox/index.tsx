import { TPost } from "src/types"
import { CONFIG } from "site.config"
import dynamic from "next/dynamic"

const UtterancesComponent = dynamic(
  () => {
    return import("./Utterances")
  },
  { ssr: false }
)
const CusdisComponent = dynamic(
  () => {
    return import("./Cusdis")
  },
  { ssr: false }
)

type Props = {
  data: TPost
}

function resolveCommentProvider(): "cusdis" | "utterances" | null {
  const cusdisReady =
    CONFIG.cusdis.enable && Boolean(CONFIG.cusdis.config.appid?.trim())
  const utterancesReady =
    CONFIG.utterances.enable && Boolean(CONFIG.utterances.config.repo?.trim())

  if (cusdisReady) return "cusdis"
  if (utterancesReady) return "utterances"
  return null
}

const CommentBox: React.FC<Props> = ({ data }) => {
  const provider = resolveCommentProvider()

  if (provider === "utterances") {
    return (
      <div>
        <UtterancesComponent issueTerm={data.id} />
      </div>
    )
  }

  if (provider === "cusdis") {
    return (
      <div>
        <CusdisComponent id={data.id} slug={data.slug} title={data.title} />
      </div>
    )
  }

  return null
}

export default CommentBox
