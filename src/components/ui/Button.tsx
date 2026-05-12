// src/components/ui/Button.tsx
"use client";

import styled from "styled-components";
import Link from "next/link";

const StyledButton = styled.button<{
  $variant: ButtonVariant;
  $size: ButtonSize;
  $fullWidth?: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${(props) => props.theme.spacing.sm};
  font-weight: 600;
  border-radius: ${(props) => props.theme.borderRadius.md};
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
  width: ${(props) => (props.$fullWidth ? "100%" : "auto")};

  /* Sizes */
  ${(props) =>
    props.$size === "small" &&
    `
    padding: ${props.theme.spacing.sm} ${props.theme.spacing.md};
    font-size: 0.875rem;
  `}

  ${(props) =>
    props.$size === "medium" &&
    `
    padding: ${props.theme.spacing.md} ${props.theme.spacing.lg};
    font-size: 1rem;
  `}
  
  ${(props) =>
    props.$size === "large" &&
    `
    padding: ${props.theme.spacing.lg} ${props.theme.spacing.xl};
    font-size: 1.125rem;
  `}
  
  /* Variants */
  ${(props) =>
    props.$variant === "primary" &&
    `
    background: linear-gradient(135deg, ${props.theme.colors.primary} 0%, ${props.theme.colors.secondary} 100%);
    color: white;
    border: none;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: ${props.theme.shadows.lg};
    }
  `}
  
  ${(props) =>
    props.$variant === "secondary" &&
    `
    background: transparent;
    color: ${props.theme.colors.primary};
    border: 2px solid ${props.theme.colors.primary};
    
    &:hover {
      background: ${props.theme.colors.primary}10;
      transform: translateY(-2px);
    }
  `}
  
  ${(props) =>
    props.$variant === "danger" &&
    `
    background: ${props.theme.colors.danger};
    color: white;
    border: none;
    
    &:hover {
      background: ${props.theme.colors.danger}dd;
      transform: translateY(-2px);
    }
  `}
  
  ${(props) =>
    props.$variant === "bear" &&
    `
    background: linear-gradient(135deg, #8B6914 0%, #A0822A 100%);
    color: white;
    border: none;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: ${props.theme.shadows.lg};
    }
  `}
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

type ButtonVariant = "primary" | "secondary" | "danger" | "bear";
type ButtonSize = "small" | "medium" | "large";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  href?: string;
}

export default function Button({
  children,
  onClick,
  variant = "primary",
  size = "medium",
  fullWidth = false,
  disabled = false,
  type = "button",
  href,
}: ButtonProps) {
  if (href) {
    return (
      <StyledButton
        as={Link}
        href={href}
        $variant={variant}
        $size={size}
        $fullWidth={fullWidth}
      >
        {children}
      </StyledButton>
    );
  }

  return (
    <StyledButton
      as="button"
      onClick={onClick}
      $variant={variant}
      $size={size}
      $fullWidth={fullWidth}
      disabled={disabled}
      type={type}
    >
      {children}
    </StyledButton>
  );
}
