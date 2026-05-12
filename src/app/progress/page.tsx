// src/app/progress/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import MainLayout from "@/components/layout/MainLayout";
import Container from "@/components/layout/Container";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Card from "@/components/ui/Card";

const PageHeader = styled.div`
  text-align: center;
  padding: 3rem 0 2rem;
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  color: #1a1a2e;
  margin-bottom: 0.5rem;

  @media (max-width: 768px) {
    font-size: 1.75rem;
  }
`;

const PageDescription = styled.p`
  color: #666;
  font-size: 1.125rem;
  max-width: 600px;
  margin: 0 auto;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled(Card)`
  text-align: center;
  padding: 1.5rem;

  .stat-number {
    font-size: 2.5rem;
    font-weight: bold;
    color: #667eea;
  }

  .stat-label {
    color: #666;
    font-size: 0.875rem;
    margin-top: 0.5rem;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  color: #1a1a2e;
  margin: 2rem 0 1rem;
`;

const ProgressCard = styled(Card)`
  margin-bottom: 1rem;
`;

const ProgressHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`;

const TopicName = styled.h3`
  font-size: 1.125rem;
  color: #1a1a2e;
`;

const TopicLevel = styled.span<{ $color: string }>`
  font-size: 0.75rem;
  padding: 0.25rem 0.6rem;
  border-radius: 9999px;
  background: ${(props) => props.$color}20;
  color: ${(props) => props.$color};
`;

const ProgressBarWrapper = styled.div`
  background: #e0e0e0;
  border-radius: 9999px;
  height: 8px;
  margin: 0.75rem 0;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ $width: number; $color: string }>`
  background: ${(props) => props.$color};
  width: ${(props) => props.$width}%;
  height: 100%;
  transition: width 0.5s ease;
`;

const TopicStatus = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
  color: #666;
`;

const StatusBadge = styled.span<{ $completed: boolean }>`
  font-size: 0.75rem;
  padding: 0.25rem 0.6rem;
  border-radius: 9999px;
  background: ${(props) => (props.$completed ? "#48bb7820" : "#ed893620")};
  color: ${(props) => (props.$completed ? "#48bb78" : "#ed8936")};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 16px;

  .bear {
    font-size: 4rem;
    margin-bottom: 1rem;
  }

  h3 {
    margin-bottom: 0.5rem;
  }

  p {
    color: #666;
  }
`;

const ContinueButton = styled.a`
  display: inline-block;
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background: #667eea;
  color: white;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.2s;

  &:hover {
    background: #5a67d8;
    transform: translateY(-2px);
  }
`;

interface ProgressData {
  id: string;
  completed: boolean;
  quizScore: number | null;
  grammarViewed: boolean;
  examplesViewed: boolean;
  practiceCompleted: boolean;
  quizCompleted: boolean;
  lastAccessed: string;
  topic: {
    id: string;
    title: string;
    description: string;
    level: {
      name: string;
      color: string;
    };
  };
}

const levelColors: Record<string, string> = {
  A1: "#48bb78",
  A2: "#4299e1",
  B1: "#ed8936",
  B2: "#9f7aea",
  C1: "#f56565",
  C2: "#ed64a6",
};

export default function ProgressPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [progress, setProgress] = useState<ProgressData[]>([]);
  const [loading, setLoading] = useState(true);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Fetch progress data - this is the only state update in the effect
  useEffect(() => {
    async function fetchProgress() {
      if (!session) return;

      try {
        const response = await fetch("/api/progress");
        const data = await response.json();

        if (Array.isArray(data)) {
          setProgress(data);
        } else {
          setProgress([]);
        }
      } catch (error) {
        console.error("Failed to fetch progress:", error);
        setProgress([]);
      } finally {
        setLoading(false);
      }
    }

    fetchProgress();
  }, [session]); // Only depends on session, no state in dependencies

  if (loading) {
    return (
      <MainLayout>
        <LoadingSpinner fullScreen message="Loading your progress... 🐻" />
      </MainLayout>
    );
  }

  const progressArray = progress;
  const completedTopics = progressArray.filter((p) => p.completed).length;
  const inProgressTopics = progressArray.filter(
    (p) =>
      !p.completed &&
      (p.grammarViewed ||
        p.examplesViewed ||
        p.practiceCompleted ||
        p.quizCompleted),
  ).length;

  const topicsWithScores = progressArray.filter((p) => p.quizScore !== null);
  const totalQuizScore = topicsWithScores.reduce(
    (sum, p) => sum + (p.quizScore || 0),
    0,
  );
  const avgQuizScore =
    topicsWithScores.length > 0
      ? Math.round(totalQuizScore / topicsWithScores.length)
      : 0;

  return (
    <MainLayout>
      <Container>
        <PageHeader>
          <PageTitle>📊 Your Progress</PageTitle>
          <PageDescription>
            Track your Finnish learning journey and see how far you&apos;ve come
            with Otso!
          </PageDescription>
        </PageHeader>

        <StatsGrid>
          <StatCard>
            <div className="stat-number">{completedTopics}</div>
            <div className="stat-label">Completed Topics</div>
          </StatCard>
          <StatCard>
            <div className="stat-number">{inProgressTopics}</div>
            <div className="stat-label">In Progress</div>
          </StatCard>
          <StatCard>
            <div className="stat-number">{progressArray.length}</div>
            <div className="stat-label">Total Topics Started</div>
          </StatCard>
          <StatCard>
            <div className="stat-number">{avgQuizScore}%</div>
            <div className="stat-label">Average Quiz Score</div>
          </StatCard>
        </StatsGrid>

        <SectionTitle>📚 Topic Progress</SectionTitle>

        {progressArray.length === 0 ? (
          <EmptyState>
            <div className="bear">🐻</div>
            <h3>No progress yet!</h3>
            <p>Start your Finnish learning journey by exploring the levels.</p>
            <ContinueButton href="/levels">Explore Levels →</ContinueButton>
          </EmptyState>
        ) : (
          progressArray.map((item) => {
            const levelName = item.topic?.level?.name || "A1";
            const color = levelColors[levelName] || "#667eea";

            let progressPercentage = 0;
            if (item.completed) {
              progressPercentage = 100;
            } else {
              let steps = 0;
              if (item.grammarViewed) steps++;
              if (item.examplesViewed) steps++;
              if (item.practiceCompleted) steps++;
              if (item.quizCompleted) steps += 2;
              progressPercentage = Math.min(Math.round((steps / 5) * 100), 99);
            }

            return (
              <ProgressCard key={item.id}>
                <ProgressHeader>
                  <TopicName>{item.topic?.title || "Unknown Topic"}</TopicName>
                  <TopicLevel $color={color}>{levelName}</TopicLevel>
                </ProgressHeader>
                <ProgressBarWrapper>
                  <ProgressFill $width={progressPercentage} $color={color} />
                </ProgressBarWrapper>
                <TopicStatus>
                  <StatusBadge $completed={item.completed}>
                    {item.completed ? "✓ Completed" : "🔄 In Progress"}
                  </StatusBadge>
                  {item.quizScore && <span>Quiz Score: {item.quizScore}%</span>}
                </TopicStatus>
              </ProgressCard>
            );
          })
        )}
      </Container>
    </MainLayout>
  );
}
