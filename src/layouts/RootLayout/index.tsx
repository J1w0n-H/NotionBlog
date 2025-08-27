import React, { ReactNode, useEffect } from "react"
import { ThemeProvider } from "./ThemeProvider"
import useScheme from "src/hooks/useScheme"
import Header from "./Header"
import styled from "@emotion/styled"
import Scripts from "src/layouts/RootLayout/Scripts"
import useGtagEffect from "./useGtagEffect"

type Props = {
  children: ReactNode
}

const RootLayout = ({ children }: Props) => {
  const [scheme] = useScheme()
  useGtagEffect()
  
  useEffect(() => {
    // Prism.js를 동적으로 로드
    const loadPrism = async () => {
      const Prism = await import("prismjs/prism")
      await import("prismjs/components/prism-markup-templating.js")
      await import("prismjs/components/prism-markup.js")
      await import("prismjs/components/prism-bash.js")
      await import("prismjs/components/prism-c.js")
      await import("prismjs/components/prism-cpp.js")
      await import("prismjs/components/prism-csharp.js")
      await import("prismjs/components/prism-docker.js")
      await import("prismjs/components/prism-java.js")
      await import("prismjs/components/prism-js-templates.js")
      await import("prismjs/components/prism-coffeescript.js")
      await import("prismjs/components/prism-diff.js")
      await import("prismjs/components/prism-git.js")
      await import("prismjs/components/prism-go.js")
      await import("prismjs/components/prism-kotlin.js")
      await import("prismjs/components/prism-graphql.js")
      await import("prismjs/components/prism-handlebars.js")
      await import("prismjs/components/prism-less.js")
      await import("prismjs/components/prism-makefile.js")
      await import("prismjs/components/prism-markdown.js")
      await import("prismjs/components/prism-objectivec.js")
      await import("prismjs/components/prism-ocaml.js")
      await import("prismjs/components/prism-python.js")
      await import("prismjs/components/prism-reason.js")
      await import("prismjs/components/prism-rust.js")
      await import("prismjs/components/prism-sass.js")
      await import("prismjs/components/prism-scss.js")
      await import("prismjs/components/prism-solidity.js")
      await import("prismjs/components/prism-sql.js")
      await import("prismjs/components/prism-stylus.js")
      await import("prismjs/components/prism-swift.js")
      await import("prismjs/components/prism-wasm.js")
      await import("prismjs/components/prism-yaml.js")
      
      Prism.highlightAll()
    }
    
    loadPrism()
  }, [])

  return (
    <ThemeProvider scheme={scheme}>
      <Scripts />
      <Header fullWidth={false} />
      <StyledMain>{children}</StyledMain>
    </ThemeProvider>
  )
}

export default RootLayout

const StyledMain = styled.main`
  margin: 0 auto;
  width: 100%;
  max-width: 1120px;
  padding: 0 1rem;
`
