import styled from "@emotion/styled"

const PostDetailLoading = () => {
  return <Loading>Loading post…</Loading>
}

export default PostDetailLoading

const Loading = styled.p`
  margin: 2rem 0;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.brand.textMuted};
`
