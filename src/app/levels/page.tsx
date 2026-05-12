// src/app/levels/page.tsx
"use client";

import { useState, useEffect, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import styled from "styled-components";
import MainLayout from "@/components/layout/MainLayout";
import Container from "@/components/layout/Container";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

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

const LevelSection = styled.div`
  margin-bottom: 3rem;
`;

const LevelHeader = styled.div<{ $color: string }>`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 3px solid ${(props) => props.$color};
  cursor: pointer;

  h2 {
    font-size: 1.75rem;
    color: ${(props) => props.$color};

    @media (max-width: 768px) {
      font-size: 1.5rem;
    }
  }
`;

const LevelProgress = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ProgressText = styled.span`
  font-size: 0.875rem;
  color: #666;
  font-weight: 500;
`;

const ProgressBarWrapper = styled.div`
  width: 100px;
`;

const ProgressBar = styled.div`
  background: #e0e0e0;
  border-radius: 9999px;
  height: 8px;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ $width: number; $color: string }>`
  background: ${(props) => props.$color};
  width: ${(props) => props.$width}%;
  height: 100%;
  transition: width 0.3s ease;
`;

const TopicsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 1.5rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const TopicCard = styled(Card)<{ $status: string; $color: string }>`
  position: relative;
  border-left: 4px solid
    ${(props) =>
      props.$status === "completed"
        ? "#48bb78"
        : props.$status === "in-progress"
          ? props.$color
          : "#e0e0e0"};
  opacity: ${(props) => (props.$status === "locked" ? 0.7 : 1)};
  cursor: ${(props) =>
    props.$status === "locked" ? "not-allowed" : "pointer"};
`;

const TopicNumber = styled.div<{ $color: string }>`
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 32px;
  height: 32px;
  background: ${(props) => props.$color}20;
  color: ${(props) => props.$color};
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.875rem;
`;

const TopicTitle = styled.h3`
  font-size: 1.25rem;
  margin-bottom: 0.25rem;
  padding-right: 40px;
  color: #1a1a2e;
`;

const TopicDescription = styled.p`
  color: #666;
  font-size: 0.875rem;
  line-height: 1.5;
  margin-bottom: 1rem;
`;

const TopicMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const StatusBadge = styled.span<{ $status: string }>`
  font-size: 0.7rem;
  padding: 0.25rem 0.6rem;
  border-radius: 9999px;
  background: ${(props) =>
    props.$status === "completed"
      ? "#48bb78" + "20"
      : props.$status === "in-progress"
        ? "#ed8936" + "20"
        : props.$status === "locked"
          ? "#e0e0e0"
          : "#667eea" + "20"};
  color: ${(props) =>
    props.$status === "completed"
      ? "#48bb78"
      : props.$status === "in-progress"
        ? "#ed8936"
        : props.$status === "locked"
          ? "#999"
          : "#667eea"};
`;

const LockedOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  border-radius: 12px;
  backdrop-filter: blur(2px);

  span {
    font-size: 2rem;
  }

  p {
    margin-top: 0.5rem;
    font-size: 0.75rem;
    color: #666;
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

interface UserProgress {
  completed: boolean;
  grammarViewed: boolean;
  examplesViewed: boolean;
  practiceCompleted: boolean;
  quizCompleted: boolean;
  quizScore: number | null;
}

interface Topic {
  id: string;
  title: string;
  description: string;
  order: number;
  userProgress: UserProgress | null;
  grammarRules: unknown[];
  quizzes: unknown[];
}

interface Level {
  id: string;
  name: string;
  title: string;
  description: string;
  order: number;
  color: string;
  progress: number;
  completedTopics: number;
  totalTopics: number;
  topics: Topic[];
}

function LevelsContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedLevel = searchParams.get("level");

  const [levels, setLevels] = useState<Level[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedLevel, setExpandedLevel] = useState<string | null>(
    selectedLevel,
  );

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (!session) return;

    let isMounted = true;

    const fetchLevels = async () => {
      try {
        const response = await fetch("/api/levels", {
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache",
          },
        });
        const data = await response.json();

        if (isMounted) {
          setLevels(data);
          setLoading(false);
        }
      } catch (error) {
        console.error("Failed to fetch levels:", error);
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchLevels();

    return () => {
      isMounted = false;
    };
  }, [session]);

  useEffect(() => {
    if (!session) return;

    let isMounted = true;

    const refreshLevels = async () => {
      try {
        const response = await fetch("/api/levels", {
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache",
          },
        });
        const data = await response.json();

        if (isMounted) {
          setLevels(data);
        }
      } catch (error) {
        console.error("Failed to refresh levels:", error);
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        refreshLevels();
      }
    };

    const handleFocus = () => {
      refreshLevels();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);

    return () => {
      isMounted = false;
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, [session]);

  const getTopicProgress = (topic: Topic) => {
    const progress = topic.userProgress;

    if (!progress) {
      return { status: "not-started", percentage: 0 };
    }

    if (progress.completed) {
      return { status: "completed", percentage: 100 };
    }

    let completedSteps = 0;
    if (progress.grammarViewed) completedSteps++;
    if (progress.examplesViewed) completedSteps++;
    if (progress.practiceCompleted) completedSteps++;
    if (progress.quizCompleted) completedSteps += 2;

    const percentage = Math.min(Math.round((completedSteps / 5) * 100), 99);

    return {
      status: percentage > 0 ? "in-progress" : "not-started",
      percentage,
    };
  };

  const isTopicLocked = (topics: Topic[], currentIndex: number) => {
    if (currentIndex === 0) return false;
    const previousTopic = topics[currentIndex - 1];
    return !previousTopic.userProgress?.completed;
  };

  const handleTopicClick = (topic: Topic, isLocked: boolean) => {
    if (!isLocked) {
      router.push(`/topics/${topic.id}`);
    }
  };

  if (loading) {
    return (
      <LoadingSpinner fullScreen message="Loading your learning path... 🐻" />
    );
  }

  return (
    <Container>
      <PageHeader>
        <PageTitle>📚 Choose Your Learning Path</PageTitle>
        <PageDescription>
          Select a level below and start learning Finnish step by step. Complete
          all topics to master each level!
        </PageDescription>
      </PageHeader>

      {levels.map((level) => (
        <LevelSection key={level.id}>
          <LevelHeader
            $color={levelColors[level.name] || level.color}
            onClick={() =>
              setExpandedLevel(expandedLevel === level.name ? null : level.name)
            }
          >
            <div>
              <h2>
                {level.name}: {level.title}
              </h2>
              <p
                style={{
                  color: "#666",
                  fontSize: "0.875rem",
                  marginTop: "0.25rem",
                }}
              >
                {level.description}
              </p>
            </div>
            <LevelProgress>
              <ProgressText>
                {level.completedTopics}/{level.totalTopics} topics
              </ProgressText>
              <ProgressBarWrapper>
                <ProgressBar>
                  <ProgressFill
                    $width={level.progress}
                    $color={levelColors[level.name] || level.color}
                  />
                </ProgressBar>
              </ProgressBarWrapper>
              <span style={{ fontSize: "0.875rem", fontWeight: "bold" }}>
                {level.progress}%
              </span>
              <span style={{ fontSize: "1rem" }}>
                {expandedLevel === level.name ? "▲" : "▼"}
              </span>
            </LevelProgress>
          </LevelHeader>

          {expandedLevel === level.name && (
            <TopicsGrid>
              {level.topics.map((topic, index) => {
                const progress = getTopicProgress(topic);
                const isLocked = isTopicLocked(level.topics, index);
                const status = isLocked ? "locked" : progress.status;
                const color = levelColors[level.name] || level.color;

                return (
                  <TopicCard
                    key={topic.id}
                    $status={status}
                    $color={color}
                    onClick={() => handleTopicClick(topic, isLocked)}
                  >
                    <TopicNumber $color={color}>{index + 1}</TopicNumber>
                    <TopicTitle>{topic.title}</TopicTitle>
                    <TopicDescription>{topic.description}</TopicDescription>

                    <TopicMeta>
                      <ProgressBarWrapper>
                        <ProgressBar>
                          <ProgressFill
                            $width={progress.percentage}
                            $color={color}
                          />
                        </ProgressBar>
                      </ProgressBarWrapper>
                      <StatusBadge $status={status}>
                        {status === "completed" && "✓ Completed"}
                        {status === "in-progress" && "🔄 In Progress"}
                        {status === "not-started" && "⏳ Not Started"}
                        {status === "locked" && "🔒 Locked"}
                      </StatusBadge>
                    </TopicMeta>

                    {isLocked && (
                      <LockedOverlay>
                        <span>🔒</span>
                        <p>Complete previous topic first</p>
                      </LockedOverlay>
                    )}
                  </TopicCard>
                );
              })}
            </TopicsGrid>
          )}
        </LevelSection>
      ))}
    </Container>
  );
}

export default function LevelsPage() {
  return (
    <MainLayout>
      <Suspense
        fallback={<LoadingSpinner fullScreen message="Loading levels... 🐻" />}
      >
        <LevelsContent />
      </Suspense>
    </MainLayout>
  );
}
