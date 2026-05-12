// src/app/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
    135deg,
    ${(props) => props.theme.colors.primary} 0%,
    ${(props) => props.theme.colors.secondary} 100%
  );
  padding: ${(props) => props.theme.spacing.md};
`;

const LoginCard = styled.div`
  background: ${(props) => props.theme.colors.white};
  border-radius: ${(props) => props.theme.borderRadius.xl};
  padding: ${(props) => props.theme.spacing.xl};
  width: 100%;
  max-width: 440px;
  box-shadow: ${(props) => props.theme.shadows.xl};
  animation: fadeIn 0.5s ease;

  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    padding: ${(props) => props.theme.spacing.lg};
  }
`;

const BearIcon = styled.div`
  text-align: center;
  font-size: 4rem;
  margin-bottom: ${(props) => props.theme.spacing.md};
  animation: bounce 2s ease infinite;
`;

const Title = styled.h1`
  font-size: 1.75rem;
  color: ${(props) => props.theme.colors.text};
  margin-bottom: ${(props) => props.theme.spacing.xs};
  text-align: center;
`;

const Subtitle = styled.p`
  text-align: center;
  color: ${(props) => props.theme.colors.textLight};
  margin-bottom: ${(props) => props.theme.spacing.xl};
  font-size: 0.875rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing.lg};
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing.xs};
`;

const Label = styled.label`
  font-weight: 600;
  color: ${(props) => props.theme.colors.text};
  font-size: 0.875rem;
`;

const Input = styled.input<{ $hasError?: boolean }>`
  padding: ${(props) => props.theme.spacing.md};
  border: 2px solid
    ${(props) =>
      props.$hasError ? props.theme.colors.danger : props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.md};
  font-size: 1rem;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: ${(props) =>
      props.$hasError ? props.theme.colors.danger : props.theme.colors.primary};
    box-shadow: 0 0 0 3px
      ${(props) =>
        props.$hasError
          ? props.theme.colors.danger + "20"
          : props.theme.colors.primary + "20"};
  }
`;

const ErrorMessage = styled.span`
  color: ${(props) => props.theme.colors.danger};
  font-size: 0.75rem;
  margin-top: ${(props) => props.theme.spacing.xs};
`;

const SubmitButton = styled.button`
  background: linear-gradient(
    135deg,
    ${(props) => props.theme.colors.primary} 0%,
    ${(props) => props.theme.colors.secondary} 100%
  );
  color: white;
  padding: ${(props) => props.theme.spacing.md};
  border: none;
  border-radius: ${(props) => props.theme.borderRadius.md};
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${(props) => props.theme.shadows.lg};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const Divider = styled.div`
  text-align: center;
  margin: ${(props) => props.theme.spacing.lg} 0;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background: ${(props) => props.theme.colors.border};
  }

  span {
    background: ${(props) => props.theme.colors.white};
    padding: 0 ${(props) => props.theme.spacing.md};
    position: relative;
    color: ${(props) => props.theme.colors.textLight};
    font-size: 0.875rem;
  }
`;

const RegisterLink = styled.p`
  text-align: center;
  margin-top: ${(props) => props.theme.spacing.lg};
  color: ${(props) => props.theme.colors.textLight};
  font-size: 0.875rem;

  a {
    color: ${(props) => props.theme.colors.primary};
    font-weight: 600;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const Toast = styled.div<{ $type: "success" | "error" }>`
  background: ${(props) =>
    props.$type === "success"
      ? props.theme.colors.success
      : props.theme.colors.danger};
  color: white;
  padding: ${(props) => props.theme.spacing.md};
  border-radius: ${(props) => props.theme.borderRadius.md};
  margin-bottom: ${(props) => props.theme.spacing.lg};
  text-align: center;
  font-size: 0.875rem;
  animation: fadeIn 0.3s ease;
`;

const ForgotPassword = styled.div`
  text-align: right;
  margin-top: -${(props) => props.theme.spacing.sm};

  a {
    color: ${(props) => props.theme.colors.textLight};
    font-size: 0.75rem;
    text-decoration: none;

    &:hover {
      color: ${(props) => props.theme.colors.primary};
    }
  }
`;

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <LoginCard>
        <BearIcon>🐻</BearIcon>

        <Title>Welcome Back!</Title>
        <Subtitle>Sign in to continue your Finnish learning journey</Subtitle>

        {error && <Toast $type="error">{error}</Toast>}

        <Form onSubmit={handleSubmit(onSubmit)}>
          <InputGroup>
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="maria@example.com"
              $hasError={!!errors.email}
              {...register("email")}
            />
            {errors.email && (
              <ErrorMessage>{errors.email.message}</ErrorMessage>
            )}
          </InputGroup>

          <InputGroup>
            <Label>Password</Label>
            <Input
              type="password"
              placeholder="••••••••"
              $hasError={!!errors.password}
              {...register("password")}
            />
            {errors.password && (
              <ErrorMessage>{errors.password.message}</ErrorMessage>
            )}
          </InputGroup>

          <ForgotPassword>
            <Link href="/forgot-password">Forgot password?</Link>
          </ForgotPassword>

          <SubmitButton type="submit" disabled={isLoading}>
            {isLoading ? "Signing in..." : "🐻 Sign In"}
          </SubmitButton>
        </Form>

        <Divider>
          <span>New to Finnish Buddy?</span>
        </Divider>

        <RegisterLink>
          <Link href="/register">Create free account →</Link>
        </RegisterLink>
      </LoginCard>
    </Container>
  );
}
