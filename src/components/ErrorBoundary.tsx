import React from 'react'

interface Props {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error: Error }>
}

interface State {
  hasError: boolean
  error?: Error
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback
      return <FallbackComponent error={this.state.error!} />
    }

    return this.props.children
  }
}

const DefaultErrorFallback: React.FC<{ error: Error }> = ({ error }) => (
  <div style={{ padding: '1rem', border: '1px solid red', borderRadius: '4px', margin: '1rem 0' }}>
    <h3>⚠️ 오류가 발생했습니다</h3>
    <p>{error.message}</p>
    <details>
      <summary>상세 정보</summary>
      <pre>{error.stack}</pre>
    </details>
  </div>
)

export default ErrorBoundary