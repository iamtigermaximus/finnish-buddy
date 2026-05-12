'use client'

import { Component, ReactNode } from 'react'
import styled from 'styled-components'
import Button from './Button'

const ErrorContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f7fa;
  padding: 2rem;
`

const ErrorCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 3rem;
  text-align: center;
  max-width: 500px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
`

const ErrorIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`

const ErrorTitle = styled.h2`
  color: #f56565;
  margin-bottom: 1rem;
`

const ErrorMessage = styled.p`
  color: #666;
  margin-bottom: 2rem;
`

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorContainer>
          <ErrorCard>
            <ErrorIcon>🐻</ErrorIcon>
            <ErrorTitle>Oops! Something went wrong</ErrorTitle>
            <ErrorMessage>
              {this.state.error?.message || 'An unexpected error occurred'}
            </ErrorMessage>
            <Button onClick={() => window.location.href = '/'}>
              Go Back Home
            </Button>
          </ErrorCard>
        </ErrorContainer>
      )
    }

    return this.props.children
  }
}
