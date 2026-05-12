// src/components/ai/AIPracticeGenerator.tsx
"use client";

import { useState } from "react";
import styled from "styled-components";
import Button from "@/components/ui/Button";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const Container = styled.div`
  margin: 2rem 0;
  padding: 1.5rem;
  background: #f5f7fa;
  border-radius: 12px;
  border: 2px dashed #667eea;
`;

const Title = styled.h3`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const ExercisesContainer = styled.div`
  margin-top: 1.5rem;
`;

const ExerciseCard = styled.div`
  background: white;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
`;

const ExercisePrompt = styled.p`
  font-weight: 500;
  margin-bottom: 0.5rem;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  margin: 0.5rem 0;

  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const HintButton = styled.button`
  background: none;
  border: none;
  color: #ed8936;
  cursor: pointer;
  font-size: 0.75rem;

  &:hover {
    color: #dd7a2e;
  }
`;

const HintText = styled.div`
  font-size: 0.75rem;
  color: #ed8936;
  margin-top: 0.25rem;
`;

const CheckButton = styled(Button)`
  margin-top: 0.5rem;
`;

const Feedback = styled.div<{ $isCorrect: boolean }>`
  font-size: 0.875rem;
  margin-top: 0.5rem;
  color: ${(props) => (props.$isCorrect ? "#48bb78" : "#f56565")};
`;

const GenerateButtonWrapper = styled.div`
  margin-top: 1rem;
`;

interface Exercise {
  prompt: string;
  expectedAnswer: string;
  hint: string;
  userAnswer?: string;
  showFeedback?: boolean;
  isCorrect?: boolean;
  showHint?: boolean;
}

interface GrammarRule {
  title: string;
  explanation: string;
  rules: string;
}

interface AIPracticeGeneratorProps {
  topicId: string;
  topicTitle: string;
  grammarRules: GrammarRule[];
}

interface GeneratedExercise {
  prompt: string;
  expectedAnswer: string;
  hint: string;
}

interface ApiResponse {
  exercises: GeneratedExercise[];
}

export default function AIPracticeGenerator({
  topicId,
  topicTitle,
  grammarRules,
}: AIPracticeGeneratorProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [generated, setGenerated] = useState(false);

  const generatePractice = async () => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai/generate-practice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topicId, numberOfExercises: 3 }),
      });

      const data: ApiResponse = await response.json();
      setExercises(
        data.exercises.map((ex: GeneratedExercise) => ({
          ...ex,
          showFeedback: false,
          isCorrect: false,
          showHint: false,
        })),
      );
      setGenerated(true);
    } catch (error) {
      console.error("Failed to generate practice:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkAnswer = (index: number) => {
    setExercises((prev) =>
      prev.map((ex, i) => {
        if (i === index) {
          const isCorrect =
            ex.userAnswer?.toLowerCase().trim() ===
            ex.expectedAnswer.toLowerCase().trim();
          return { ...ex, showFeedback: true, isCorrect };
        }
        return ex;
      }),
    );
  };

  const toggleHint = (index: number) => {
    setExercises((prev) =>
      prev.map((ex, i) => {
        if (i === index) {
          return { ...ex, showHint: !ex.showHint };
        }
        return ex;
      }),
    );
  };

  return (
    <Container>
      <Title>
        <span>🐻</span>
        <span>Want Extra Practice? Let Otso Help!</span>
      </Title>

      {!generated ? (
        <Button onClick={generatePractice} disabled={isLoading} variant="bear">
          {isLoading ? <LoadingSpinner /> : "🎲 Generate AI-Powered Practice"}
        </Button>
      ) : (
        <>
          <ExercisesContainer>
            {exercises.map((exercise, idx) => (
              <ExerciseCard key={idx}>
                <ExercisePrompt>{exercise.prompt}</ExercisePrompt>
                <StyledInput
                  type="text"
                  placeholder="Type your answer..."
                  value={exercise.userAnswer || ""}
                  onChange={(e) => {
                    const newExercises = [...exercises];
                    newExercises[idx].userAnswer = e.target.value;
                    newExercises[idx].showFeedback = false;
                    setExercises(newExercises);
                  }}
                />
                <HintButton onClick={() => toggleHint(idx)}>
                  {exercise.showHint ? "Hide hint" : "💡 Show hint"}
                </HintButton>
                {exercise.showHint && <HintText>🐻 {exercise.hint}</HintText>}

                {!exercise.showFeedback ? (
                  <CheckButton
                    onClick={() => checkAnswer(idx)}
                    variant="secondary"
                    size="small"
                  >
                    Check Answer
                  </CheckButton>
                ) : (
                  <Feedback $isCorrect={exercise.isCorrect || false}>
                    {exercise.isCorrect
                      ? "✓ Correct! Great job! 🎉"
                      : `✗ Not quite. The correct answer is: "${exercise.expectedAnswer}"`}
                  </Feedback>
                )}
              </ExerciseCard>
            ))}
          </ExercisesContainer>

          <GenerateButtonWrapper>
            <Button onClick={generatePractice} variant="secondary">
              Generate New Practice Set
            </Button>
          </GenerateButtonWrapper>
        </>
      )}
    </Container>
  );
}
