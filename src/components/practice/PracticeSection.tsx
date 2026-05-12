// src/components/practice/PracticeSection.tsx
"use client";

import { useState } from "react";
import styled from "styled-components";
import Button from "@/components/ui/Button";

const Container = styled.div`
  animation: fadeIn 0.3s ease;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  color: #1a1a2e;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ExerciseCard = styled.div`
  background: #f5f7fa;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
`;

const ExerciseNumber = styled.div`
  display: inline-block;
  background: #667eea;
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 9999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  font-weight: bold;
`;

const ExerciseText = styled.p`
  font-size: 1.1rem;
  margin-bottom: 1rem;
`;

const StyledInput = styled.input<{
  $isCorrect?: boolean;
  $showFeedback?: boolean;
}>`
  width: 100%;
  padding: 1rem;
  border: 2px solid
    ${(props) =>
      props.$showFeedback
        ? props.$isCorrect
          ? "#48bb78"
          : "#f56565"
        : "#e0e0e0"};
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const Feedback = styled.div<{ $isCorrect: boolean }>`
  background: ${(props) => (props.$isCorrect ? "#48bb7820" : "#f5656520")};
  color: ${(props) => (props.$isCorrect ? "#48bb78" : "#f56565")};
  padding: 1rem;
  border-radius: 8px;
  margin-top: 1rem;
  font-size: 0.875rem;
`;

const HintButton = styled.button`
  background: none;
  border: none;
  color: #ed8936;
  cursor: pointer;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  text-decoration: underline;

  &:hover {
    color: #dd7a2e;
  }
`;

const HintText = styled.div`
  background: #ed893610;
  padding: 0.5rem;
  border-radius: 8px;
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #ed8936;
`;

const ProgressBarWrapper = styled.div`
  background: #e0e0e0;
  border-radius: 9999px;
  height: 8px;
  margin: 1.5rem 0;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ $width: number }>`
  background: #48bb78;
  width: ${(props) => props.$width}%;
  height: 100%;
  transition: width 0.3s ease;
`;

const CheckButton = styled.button`
  background: #667eea;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1rem;
  transition: all 0.2s;

  &:hover {
    background: #5a67d8;
    transform: translateY(-2px);
  }
`;

const CompleteButtonWrapper = styled.div`
  margin-top: 2rem;
`;

interface Exercise {
  id: number;
  question: string;
  correctAnswer: string;
  hint: string;
  userAnswer: string;
  showFeedback: boolean;
  isCorrect: boolean;
  showHint: boolean;
}

interface PracticeSectionProps {
  topicId: string;
  topicTitle: string;
  grammarRules: Array<{
    title: string;
    explanation: string;
    rules: string;
  }>;
  onComplete: () => void;
}

export default function PracticeSection({
  topicId,
  topicTitle,
  grammarRules,
  onComplete,
}: PracticeSectionProps) {
  const [exercises, setExercises] = useState<Exercise[]>([
    {
      id: 1,
      question: `How do you say "I speak Finnish" using the correct verb conjugation?`,
      correctAnswer: "Minä puhun suomea",
      hint: "Verb type 1: puhua → remove -a, add -n for minä",
      userAnswer: "",
      showFeedback: false,
      isCorrect: false,
      showHint: false,
    },
    {
      id: 2,
      question: `Fill in the blank: "Sinä ___ (asua) Helsingissä." (You live in Helsinki)`,
      correctAnswer: "asut",
      hint: "asua → remove -a, add -t for sinä",
      userAnswer: "",
      showFeedback: false,
      isCorrect: false,
      showHint: false,
    },
    {
      id: 3,
      question: `Translate to Finnish: "We are students."`,
      correctAnswer: "Me olemme opiskelijoita",
      hint: "We = me, are = olemme, students = opiskelijoita (partitive plural)",
      userAnswer: "",
      showFeedback: false,
      isCorrect: false,
      showHint: false,
    },
    {
      id: 4,
      question: `How do you say "I don't speak Russian" in Finnish?`,
      correctAnswer: "Minä en puhu venäjää",
      hint: "Negative: en + verb stem (no personal ending)",
      userAnswer: "",
      showFeedback: false,
      isCorrect: false,
      showHint: false,
    },
  ]);

  const [allCorrect, setAllCorrect] = useState(false);

  const handleAnswerChange = (exerciseId: number, value: string) => {
    setExercises((prev) =>
      prev.map((ex) =>
        ex.id === exerciseId
          ? { ...ex, userAnswer: value, showFeedback: false }
          : ex,
      ),
    );
  };

  const checkAnswer = (exerciseId: number) => {
    setExercises((prev) =>
      prev.map((ex) => {
        if (ex.id === exerciseId) {
          const isCorrect =
            ex.userAnswer.toLowerCase().trim() ===
            ex.correctAnswer.toLowerCase();
          return { ...ex, showFeedback: true, isCorrect };
        }
        return ex;
      }),
    );

    setTimeout(() => {
      setExercises((prev) => {
        const allNowCorrect = prev.every((ex) => ex.isCorrect);
        setAllCorrect(allNowCorrect);
        return prev;
      });
    }, 100);
  };

  const toggleHint = (exerciseId: number) => {
    setExercises((prev) =>
      prev.map((ex) =>
        ex.id === exerciseId ? { ...ex, showHint: !ex.showHint } : ex,
      ),
    );
  };

  const completedCount = exercises.filter((e) => e.isCorrect).length;
  const progress = (completedCount / exercises.length) * 100;

  const handleComplete = () => {
    if (allCorrect) {
      onComplete();
    }
  };

  return (
    <Container>
      <SectionTitle>
        <span>✏️</span> Interactive Practice
      </SectionTitle>

      <ProgressBarWrapper>
        <ProgressFill $width={progress} />
      </ProgressBarWrapper>
      <p
        style={{
          textAlign: "right",
          fontSize: "0.875rem",
          marginBottom: "1rem",
        }}
      >
        {completedCount}/{exercises.length} completed
      </p>

      {exercises.map((exercise) => (
        <ExerciseCard key={exercise.id}>
          <ExerciseNumber>{exercise.id}</ExerciseNumber>
          <ExerciseText>{exercise.question}</ExerciseText>

          <StyledInput
            type="text"
            placeholder="Type your answer in Finnish..."
            value={exercise.userAnswer}
            onChange={(e) => handleAnswerChange(exercise.id, e.target.value)}
            $showFeedback={exercise.showFeedback}
            $isCorrect={exercise.isCorrect}
          />

          <HintButton onClick={() => toggleHint(exercise.id)}>
            {exercise.showHint ? "Hide hint" : "💡 Show hint"}
          </HintButton>

          {exercise.showHint && <HintText>💡 {exercise.hint}</HintText>}

          {!exercise.showFeedback ? (
            <CheckButton onClick={() => checkAnswer(exercise.id)}>
              Check Answer
            </CheckButton>
          ) : (
            <Feedback $isCorrect={exercise.isCorrect}>
              {exercise.isCorrect
                ? "✓ Correct! Great job!"
                : `✗ Not quite. Correct answer: "${exercise.correctAnswer}"`}
            </Feedback>
          )}
        </ExerciseCard>
      ))}

      <CompleteButtonWrapper>
        {allCorrect ? (
          <Button onClick={handleComplete} variant="primary" size="large">
            ✓ Complete Practice & Continue
          </Button>
        ) : (
          <Button disabled variant="primary" size="large">
            Complete all exercises to continue
          </Button>
        )}
      </CompleteButtonWrapper>
    </Container>
  );
}
