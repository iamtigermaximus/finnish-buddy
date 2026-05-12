'use client'

import styled, { keyframes } from 'styled-components'

const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`

const SkeletonBase = styled.div<{ $width?: string; $height?: string; $borderRadius?: string }>`
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s infinite;
  width: ${props => props.$width || '100%'};
  height: ${props => props.$height || '1rem'};
  border-radius: ${props => props.$borderRadius || '4px'};
`

export const SkeletonText = styled(SkeletonBase)`
  margin-bottom: 0.5rem;
`

export const SkeletonTitle = styled(SkeletonBase)`
  width: 60%;
  height: 2rem;
  margin-bottom: 1rem;
`

export const SkeletonCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
`

export const SkeletonTopicCard = styled(SkeletonCard)`
  margin-bottom: 1rem;
`

export default function Skeleton() {
  return <SkeletonBase />
}
