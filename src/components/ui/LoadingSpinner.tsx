// src/components/ui/LoadingSpinner.tsx
"use client";

import styled from "styled-components";

const SpinnerContainer = styled.div<{ $fullScreen?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  ${(props) =>
    props.$fullScreen &&
    `
    min-height: 100vh;
  `}
  padding: ${(props) => props.theme.spacing.xl};
`;

const Spinner = styled.div`
  width: 60px;
  height: 60px;
  border: 4px solid ${(props) => props.theme.colors.border};
  border-top-color: ${(props) => props.theme.colors.primary};
  border-radius: 50%;
  animation: spin 1s linear infinite;
`;

const BearMessage = styled.div`
  text-align: center;
  margin-top: ${(props) => props.theme.spacing.lg};

  .bear {
    font-size: 2rem;
    animation: bounce 1s ease infinite;
  }

  p {
    color: ${(props) => props.theme.colors.textLight};
    margin-top: ${(props) => props.theme.spacing.sm};
  }
`;

interface LoadingSpinnerProps {
  fullScreen?: boolean;
  message?: string;
}

export default function LoadingSpinner({
  fullScreen = false,
  message,
}: LoadingSpinnerProps) {
  return (
    <SpinnerContainer $fullScreen={fullScreen}>
      <div>
        {/* <Spinner /> */}
        <BearMessage>
          <div className="bear">🐻</div>
          {message && <p>{message}</p>}
        </BearMessage>
      </div>
    </SpinnerContainer>
  );
}
