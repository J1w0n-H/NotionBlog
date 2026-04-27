import React, { useEffect, useState } from 'react'
import styled from '@emotion/styled'

type ToastType = 'success' | 'error' | 'info'

interface ToastProps {
  message: string
  type?: ToastType
  duration?: number
  onClose?: () => void
}

const Toast: React.FC<ToastProps> = ({
  message,
  type = 'info',
  duration = 3000,
  onClose
}) => {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      onClose?.()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  if (!visible) return null

  return (
    <StyledToast type={type}>
      <StyledIcon type={type}>
        {type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}
      </StyledIcon>
      <StyledMessage>{message}</StyledMessage>
    </StyledToast>
  )
}

const StyledToast = styled.div<{ type: ToastType }>`
  position: fixed;
  top: 20px;
  right: 20px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 10000;
  animation: slideIn 0.3s ease-out;

  background-color: ${({ type, theme }) =>
    type === 'success' ? '#10b981' :
    type === 'error' ? '#ef4444' :
    '#3b82f6'
  };

  color: white;

  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`

const StyledIcon = styled.span<{ type: ToastType }>`
  font-size: 1.2rem;
  font-weight: bold;
`

const StyledMessage = styled.span`
  font-size: 0.9rem;
  font-weight: 500;
`

export default Toast