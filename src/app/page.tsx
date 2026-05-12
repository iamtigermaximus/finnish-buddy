// src/app/dashboard/page.tsx
"use client";

import { AuthGuard } from "@/components/layout/AuthGuard";
import { useAuth } from "@/hooks/useAuth";
import styled from "styled-components";
import Link from "next/link";

const Container = styled.div`
  min-height: 100vh;
  background: ${(props) => props.theme.colors.background};
`;

const Header = styled.header`
  background: linear-gradient(
    135deg,
    ${(props) => props.theme.colors.primary} 0%,
    ${(props) => props.theme.colors.secondary} 100%
  );
  color: white;
  padding: ${(props) => props.theme.spacing.xl};
  text-align: center;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: ${(props) => props.theme.spacing.sm};
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${(props) => props.theme.spacing.xl};
`;

const WelcomeCard = styled.div`
  background: white;
  border-radius: ${(props) => props.theme.borderRadius.lg};
  padding: ${(props) => props.theme.spacing.xl};
  margin-bottom: ${(props) => props.theme.spacing.xl};
  box-shadow: ${(props) => props.theme.shadows.md};
  text-align: center;
`;

const BearWave = styled.div`
  font-size: 3rem;
  margin-bottom: ${(props) => props.theme.spacing.md};
`;

export default function HomePage() {
  const { user } = useAuth();

  return (
    <AuthGuard>
      <Container>
        <Header>
          <Title>🐻 Finnish Buddy</Title>
          <p>Your journey to Finnish fluency starts here!</p>
        </Header>

        <Content>
          <WelcomeCard>
            <BearWave>🐻👋</BearWave>
            <h2>Hei, {user?.name || "Friend"}!</h2>
            <p>Welcome to your Finnish learning dashboard.</p>
            <p style={{ marginTop: "1rem", color: "#666" }}>
              Levels and topics coming soon!
            </p>
            <Link
              href="/levels"
              style={{
                display: "inline-block",
                marginTop: "1rem",
                padding: "0.75rem 1.5rem",
                background: "#667eea",
                color: "white",
                borderRadius: "8px",
                textDecoration: "none",
              }}
            >
              Explore Levels →
            </Link>
          </WelcomeCard>
        </Content>
      </Container>
    </AuthGuard>
  );
}
