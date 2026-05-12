// src/components/layout/Container.tsx
"use client";

import { JSX } from "react";
import styled from "styled-components";

const StyledContainer = styled.div`
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 ${(props) => props.theme.spacing.md};

  @media (min-width: ${(props) => props.theme.breakpoints.tablet}) {
    padding: 0 ${(props) => props.theme.spacing.lg};
  }

  @media (min-width: ${(props) => props.theme.breakpoints.desktop}) {
    padding: 0 ${(props) => props.theme.spacing.xl};
  }
`;

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

export default function Container({
  children,
  className,
  as = "div",
}: ContainerProps) {
  return (
    <StyledContainer as={as} className={className}>
      {children}
    </StyledContainer>
  );
}
