'use client'

import { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'

const ImageContainer = styled.div<{ $aspectRatio: string }>`
  position: relative;
  aspect-ratio: ${props => props.$aspectRatio};
  overflow: hidden;
  background: #f0f0f0;
  border-radius: 12px;
`

const StyledImage = styled.img<{ $loaded: boolean }>`
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: ${props => props.$loaded ? 1 : 0};
  transition: opacity 0.3s ease;
`

const Placeholder = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f0f0;
  color: #666;
`

interface OptimizedImageProps {
  src: string
  alt: string
  aspectRatio?: string
  className?: string
}

export default function OptimizedImage({ src, alt, aspectRatio = '16/9', className }: OptimizedImageProps) {
  const [loaded, setLoaded] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <ImageContainer ref={ref} $aspectRatio={aspectRatio} className={className}>
      {!loaded && <Placeholder>🐻 Loading...</Placeholder>}
      {isVisible && (
        <StyledImage
          src={src}
          alt={alt}
          $loaded={loaded}
          onLoad={() => setLoaded(true)}
          loading="lazy"
        />
      )}
    </ImageContainer>
  )
}
