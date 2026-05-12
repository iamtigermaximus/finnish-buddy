'use client'

import { useEffect } from 'react'
import styled from 'styled-components'

const ToastContainer = styled.div<{ $visible: boolean }>`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 1000;
  animation: slideIn 0.3s ease;
  display: ${props => props.$visible ? 'block' : 'none'};

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

  @media (max-width: 768px) {
    left: 1rem;
    right: 1rem;
    bottom: 1rem;
  }
`

const ToastCard = styled.div<{ $type: 'success' | 'error' | 'info' }>`
  background: ${props => 
    props.$type === 'success' ? '#48bb78' :
    props.$type === 'error' ? '#f56565' :
    '#667eea'
  };
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
`

interface ToastProps {
  message: string
  type: 'success' | 'error' | 'info'
  visible: boolean
  onClose: () => void
  duration?: number
}

export default function Toast({ message, type, visible, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        onClose()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [visible, duration, onClose])

  return (
    <ToastContainer $visible={visible}>
      <ToastCard $type={type}>
        <span>{type === 'success' ? '🎉' : type === 'error' ? '⚠️' : 'ℹ️'}</span>
        {message}
      </ToastCard>
    </ToastContainer>
  )
}
