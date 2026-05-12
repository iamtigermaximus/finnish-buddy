// src/components/quiz/DynamicQuizButton.tsx
"use client";

import { useState } from "react";
import styled from "styled-components";
import Button from "@/components/ui/Button";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const Container = styled.div`
  text-align: center;
  margin: 2rem 0;
`;

const Message = styled.div`
  margin-top: 1rem;
  color: #666;
  font-size: 0.875rem;
`;

interface QuizData {
  id: string;
  title: string;
  description: string;
  passingScore: number;
  questions: Array<{
    id: string;
    text: string;
    type: string;
    options: string | null;
    correctAnswer: string;
    explanation: string | null;
  }>;
}

interface ApiError {
  error?: string;
  message?: string;
}

interface DynamicQuizButtonProps {
  topicId: string;
  topicTitle: string;
  onQuizGenerated: (quiz: QuizData) => void;
  isRegenerate?: boolean;
  previousScore?: number;
  weakAreas?: string[];
}

export default function DynamicQuizButton({
  topicId,
  topicTitle,
  onQuizGenerated,
  isRegenerate = false,
  previousScore,
  weakAreas,
}: DynamicQuizButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateQuiz = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/ai/generate-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topicId,
          regenerate: isRegenerate,
          previousScore,
          weakAreas,
        }),
      });

      const data: QuizData | ApiError = await response.json();

      if (!response.ok) {
        const errorData = data as ApiError;
        throw new Error(
          errorData.error || errorData.message || "Failed to generate quiz",
        );
      }

      onQuizGenerated(data as QuizData);
    } catch (err) {
      const error = err as Error;
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Button
        onClick={generateQuiz}
        disabled={isLoading}
        variant="bear"
        size="large"
      >
        {isLoading ? (
          <>
            <LoadingSpinner /> Generating your personalized quiz...
          </>
        ) : isRegenerate ? (
          "🎲 Generate New Practice Quiz"
        ) : (
          "🎲 Generate AI Quiz"
        )}
      </Button>
      {error && <Message>🐻 {error}</Message>}
      <Message>
        {isRegenerate
          ? "Otso will create questions targeting what you need to practice!"
          : "Otso will create a fresh quiz just for you! 🌟"}
      </Message>
    </Container>
  );
}
