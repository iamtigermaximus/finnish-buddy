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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1rem;
`;

const LoginCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 2rem;
  width: 100%;
  max-width: 440px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  animation: fadeIn 0.5s ease;

  @media (max-width: 640px) {
    padding: 1.5rem;
  }
`;

const BearIcon = styled.div`
  text-align: center;
  font-size: 4rem;
  margin-bottom: 1rem;
  animation: bounce 2s ease infinite;
`;

const Title = styled.h1`
  font-size: 1.75rem;
  color: #1a1a2e;
  margin-bottom: 0.5rem;
  text-align: center;
`;

const Subtitle = styled.p`
  text-align: center;
  color: #666;
  margin-bottom: 2rem;
  font-size: 0.875rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const Label = styled.label`
  font-weight: 600;
  color: #1a1a2e;
  font-size: 0.875rem;
`;

const Input = styled.input<{ $hasError?: boolean }>`
  padding: 0.75rem;
  border: 2px solid ${(props) => (props.$hasError ? "#f56565" : "#e0e0e0")};
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: ${(props) => (props.$hasError ? "#f56565" : "#667eea")};
    box-shadow: 0 0 0 3px
      ${(props) => (props.$hasError ? "#f5656520" : "#667eea20")};
  }
`;

const ErrorMessage = styled.span`
  color: #f56565;
  font-size: 0.75rem;
  margin-top: 0.25rem;
`;

const SubmitButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.75rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const Divider = styled.div`
  text-align: center;
  margin: 1.5rem 0;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background: #e0e0e0;
  }

  span {
    background: white;
    padding: 0 1rem;
    position: relative;
    color: #666;
    font-size: 0.875rem;
  }
`;

const GoogleButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #f8f9fa;
    border-color: #667eea;
  }

  .google-icon {
    font-size: 1.25rem;
    font-weight: bold;
    color: #667eea;
  }
`;

const RegisterLink = styled.p`
  text-align: center;
  margin-top: 1.5rem;
  color: #666;
  font-size: 0.875rem;

  a {
    color: #667eea;
    font-weight: 600;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const Toast = styled.div<{ $type: "success" | "error" }>`
  background: ${(props) => (props.$type === "success" ? "#48bb78" : "#f56565")};
  color: white;
  padding: 0.75rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  text-align: center;
  font-size: 0.875rem;
  animation: fadeIn 0.3s ease;
`;

const ForgotPassword = styled.div`
  text-align: right;
  margin-top: -0.5rem;

  a {
    color: #666;
    font-size: 0.75rem;
    text-decoration: none;

    &:hover {
      color: #667eea;
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

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/" });
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
          <span>or continue with</span>
        </Divider>

        <GoogleButton onClick={handleGoogleSignIn}>
          <span className="google-icon">G</span>
          Sign in with Google
        </GoogleButton>

        <RegisterLink>
          Don&apos;t have an account? <Link href="/register">Sign up →</Link>
        </RegisterLink>
      </LoginCard>
    </Container>
  );
}
