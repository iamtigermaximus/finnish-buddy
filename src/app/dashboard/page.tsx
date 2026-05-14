// src/app/dashboard/page.tsx
"use client";

import { AuthGuard } from "@/components/layout/AuthGuard";
import MainLayout from "@/components/layout/MainLayout";
import Container from "@/components/layout/Container";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import WordOfTheDay from "@/components/word-of the-day/WordOfTheDay";

const WelcomeCard = styled(Card)`
  text-align: center;
  margin-bottom: 2rem;

  .bear {
    font-size: 4rem;
    margin-bottom: 1rem;
    animation: bounce 2s ease infinite;
  }

  h1 {
    font-size: 2rem;
    margin-bottom: 0.5rem;
  }

  p {
    color: #666;
    margin-bottom: 1rem;
  }
`;

const ProgressCard = styled(Card)`
  margin-bottom: 2rem;

  h2 {
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

const ProgressBarWrapper = styled.div`
  background: #e0e0e0;
  border-radius: 9999px;
  height: 12px;
  overflow: hidden;
  margin: 1rem 0;
`;

const ProgressFill = styled.div<{ $width: number; $color: string }>`
  background: ${(props) => props.$color};
  width: ${(props) => props.$width}%;
  height: 100%;
  transition: width 0.5s ease;
`;

const LevelsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
`;

const LevelItem = styled(Card)`
  text-align: center;
  cursor: pointer;

  .level-name {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 0.25rem;
  }

  .progress-text {
    font-size: 0.875rem;
    color: #666;
    margin: 0.5rem 0;
  }
`;

const levelColors: Record<string, string> = {
  A1: "#48bb78",
  A2: "#4299e1",
  B1: "#ed8936",
  B2: "#9f7aea",
  C1: "#f56565",
  C2: "#ed64a6",
};

interface LevelData {
  id: string;
  name: string;
  title: string;
  description: string;
  progress: number;
  completedTopics: number;
  totalTopics: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [levels, setLevels] = useState<LevelData[]>([]);
  const [loading, setLoading] = useState(true);
  const [overallProgress, setOverallProgress] = useState(0);

  useEffect(() => {
    const fetchLevels = async () => {
      try {
        const response = await fetch("/api/levels");
        const data = await response.json();
        setLevels(data);

        const totalProgress = data.reduce(
          (sum: number, level: LevelData) => sum + level.progress,
          0,
        );
        const avgProgress =
          data.length > 0 ? Math.round(totalProgress / data.length) : 0;
        setOverallProgress(avgProgress);
      } catch (error) {
        console.error("Failed to fetch levels:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLevels();
  }, []);

  const handleLevelClick = (levelName: string) => {
    router.push(`/levels?level=${levelName}`);
  };

  if (loading) {
    return (
      <MainLayout>
        <LoadingSpinner fullScreen message="Loading your progress... 🐻" />
      </MainLayout>
    );
  }

  return (
    <AuthGuard>
      <MainLayout>
        <Container>
          {/* ✅ WORD OF THE DAY */}
          <WordOfTheDay />
          <WelcomeCard variant="bear">
            <div className="bear">🐻</div>
            <h1>Hei, {user?.name || "Friend"}! 👋</h1>
            <p>
              Welcome back to your Finnish learning journey. Ready to continue
              with Otso?
            </p>
            <Button href="/levels" size="large">
              Continue Learning 🐻
            </Button>
          </WelcomeCard>

          <ProgressCard>
            <h2>
              <span>📊</span> Your Overall Progress
            </h2>
            <ProgressBarWrapper>
              <ProgressFill $width={overallProgress} $color="#667eea" />
            </ProgressBarWrapper>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "0.875rem",
                color: "#666",
              }}
            >
              <span>Beginner</span>
              <span>{overallProgress}% Complete</span>
              <span>Master</span>
            </div>
          </ProgressCard>

          <h2 style={{ marginBottom: "1rem" }}>📚 Your Learning Path</h2>
          <LevelsGrid>
            {levels.map((level) => (
              <LevelItem
                key={level.name}
                variant="default"
                onClick={() => handleLevelClick(level.name)}
              >
                <div
                  className="level-name"
                  style={{ color: levelColors[level.name] }}
                >
                  {level.name}
                </div>
                <div className="level-desc">{level.title}</div>
                <ProgressBarWrapper>
                  <ProgressFill
                    $width={level.progress}
                    $color={levelColors[level.name]}
                  />
                </ProgressBarWrapper>
                <div className="progress-text">
                  {level.completedTopics}/{level.totalTopics} topics completed
                </div>
                <Button variant="secondary" size="small">
                  Continue {level.name} →
                </Button>
              </LevelItem>
            ))}
          </LevelsGrid>
        </Container>
      </MainLayout>
    </AuthGuard>
  );
}
