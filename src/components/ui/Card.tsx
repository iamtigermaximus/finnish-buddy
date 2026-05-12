// src/components/ui/Card.tsx
'use client'

import styled from 'styled-components'

const StyledCard = styled.div<{ $clickable?: boolean; $variant?: 'default' | 'bear' }>`
  background: ${props => props.theme.colors.white};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.lg};
  box-shadow: ${props => props.theme.shadows.md};
  transition: all 0.3s ease;
  cursor: ${props => props.$clickable ? 'pointer' : 'default'};
  position: relative;
  overflow: hidden;
  
  ${props => props.$variant === 'bear' && `
    border-top: 4px solid ${props.theme.colors.primary};
    
    &::before {
      content: '🐻';
      position: absolute;
      bottom: 10px;
      right: 10px;
      font-size: 3rem;
      opacity: 0.05;
      pointer-events: none;
    }
  `}
  
  ${props => props.$clickable && `
    &:hover {
      transform: translateY(-4px);
      box-shadow: ${props.theme.shadows.lg};
    }
  `}
`

interface CardProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'default' | 'bear'
  className?: string
}

export default function Card({ children, onClick, variant = 'default', className }: CardProps) {
  return (
    <StyledCard 
      $clickable={!!onClick} 
      $variant={variant}
      onClick={onClick}
      className={className}
    >
      {children}
    </StyledCard>
  )
}