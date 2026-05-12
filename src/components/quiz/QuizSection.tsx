// src/components/quiz/QuizSection.tsx
"use client";

import { useState } from "react";
import styled from "styled-components";
import Button from "@/components/ui/Button";

const Container = styled.div`
  animation: fadeIn 0.3s ease;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  color: ${(props) => props.theme.colors.text};
  margin-bottom: ${(props) => props.theme.spacing.sm};
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.sm};
`;

const QuizDescription = styled.p`
  color: ${(props) => props.theme.colors.textLight};
  margin-bottom: ${(props) => props.theme.spacing.xl};
`;

const QuestionCard = styled.div`
  background: ${(props) => props.theme.colors.background};
  border-radius: ${(props) => props.theme.borderRadius.lg};
  padding: ${(props) => props.theme.spacing.xl};
  margin-bottom: ${(props) => props.theme.spacing.lg};
`;

const QuestionText = styled.p`
  font-size: 1.1rem;
  font-weight: 500;
  margin-bottom: ${(props) => props.theme.spacing.lg};
`;

const OptionsGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing.sm};
`;

const OptionLabel = styled.label<{
  $selected?: boolean;
  $showResult?: boolean;
  $isCorrect?: boolean;
}>`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.sm};
  padding: ${(props) => props.theme.spacing.sm};
  border-radius: ${(props) => props.theme.borderRadius.md};
  cursor: pointer;
  transition: all 0.2s;
  background: ${(props) => {
    if (props.$showResult && props.$isCorrect)
      return props.theme.colors.success + "20";
    if (props.$showResult && props.$selected && !props.$isCorrect)
      return props.theme.colors.danger + "20";
    return "transparent";
  }};

  &:hover {
    background: ${(props) => props.theme.colors.primary}10;
  }
`;

const RadioInput = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
`;

const TextInput = styled.input`
  width: 100%;
  padding: ${(props) => props.theme.spacing.md};
  border: 2px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.md};
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.colors.primary};
  }
`;

const ResultMessage = styled.div<{ $isCorrect: boolean }>`
  background: ${(props) =>
    props.$isCorrect
      ? props.theme.colors.success + "20"
      : props.theme.colors.danger + "20"};
  color: ${(props) =>
    props.$isCorrect ? props.theme.colors.success : props.theme.colors.danger};
  padding: ${(props) => props.theme.spacing.md};
  border-radius: ${(props) => props.theme.borderRadius.md};
  margin-top: ${(props) => props.theme.spacing.md};
  font-size: 0.875rem;
`;

const SubmitButton = styled(Button)`
  margin-top: ${(props) => props.theme.spacing.xl};
`;

const ResultsCard = styled.div`
  text-align: center;
  padding: ${(props) => props.theme.spacing.xl};
`;

const ScoreCircle = styled.div<{ $score: number }>`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: conic-gradient(
    ${(props) => props.theme.colors.success} 0deg
      ${(props) => (props.$score / 100) * 360}deg,
    ${(props) => props.theme.colors.border}
      ${(props) => (props.$score / 100) * 360}deg
  );
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto ${(props) => props.theme.spacing.lg};
  position: relative;

  &::before {
    content: "";
    position: absolute;
    width: 120px;
    height: 120px;
    background: white;
    border-radius: 50%;
  }

  span {
    position: relative;
    font-size: 2rem;
    font-weight: bold;
    color: ${(props) => props.theme.colors.success};
  }
`;

const NewQuizButton = styled(Button)`
  margin-top: ${(props) => props.theme.spacing.lg};
`;

interface Question {
  id: string;
  text: string;
  type: string;
  options: string | null;
  correctAnswer: string;
  explanation: string | null;
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  passingScore: number;
  questions: Question[];
}

interface QuizSectionProps {
  quiz: Quiz;
  topicId: string;
  topicTitle: string;
  onComplete: (score: number) => void;
  isCompleted: boolean;
}

export default function QuizSection({
  quiz,
  topicId,
  topicTitle,
  onComplete,
  isCompleted,
}: QuizSectionProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [results, setResults] = useState<Record<string, boolean>>({});

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = async () => {
    let correctCount = 0;
    const newResults: Record<string, boolean> = {};

    quiz.questions.forEach((question) => {
      const userAnswer = answers[question.id]?.toLowerCase().trim() || "";
      const correctAnswer = question.correctAnswer.toLowerCase().trim();
      const isCorrect = userAnswer === correctAnswer;

      if (isCorrect) correctCount++;
      newResults[question.id] = isCorrect;
    });

    const finalScore = Math.round((correctCount / quiz.questions.length) * 100);
    setScore(finalScore);
    setResults(newResults);
    setSubmitted(true);

    // Save quiz attempt
    try {
      await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topicId,
          step: "quiz",
          completed: finalScore >= quiz.passingScore,
          score: finalScore,
        }),
      });
    } catch (error) {
      console.error("Failed to save quiz result:", error);
    }

    if (finalScore >= quiz.passingScore) {
      onComplete(finalScore);
    }
  };

  const generateNewQuiz = async () => {
    // This will call the AI quiz generation API
    window.location.href = `/quiz/generate?topicId=${topicId}`;
  };

  if (isCompleted) {
    return (
      <Container>
        <ResultsCard>
          <ScoreCircle $score={100}>
            <span>✓</span>
          </ScoreCircle>
          <h2>Quiz Completed! 🎉</h2>
          <p>You&apos;ve already passed this quiz. Great job!</p>
          <NewQuizButton onClick={generateNewQuiz} variant="bear">
            🎲 Generate a New Practice Quiz
          </NewQuizButton>
        </ResultsCard>
      </Container>
    );
  }

  if (submitted && score !== null) {
    const passed = score >= quiz.passingScore;

    return (
      <Container>
        <ResultsCard>
          <ScoreCircle $score={score}>
            <span>{score}%</span>
          </ScoreCircle>

          <h2>{passed ? "🎉 Congratulations!" : "📚 Keep Practicing!"}</h2>
          <p>
            {passed
              ? `You passed with ${score}%! You've mastered this topic.`
              : `You scored ${score}%. The passing score is ${quiz.passingScore}%.`}
          </p>

          {!passed && (
            <NewQuizButton onClick={generateNewQuiz} variant="bear">
              🎲 Generate a New Quiz to Try Again
            </NewQuizButton>
          )}

          <div style={{ marginTop: "2rem", textAlign: "left" }}>
            <h3>Review Your Answers:</h3>
            {quiz.questions.map((question, idx) => (
              <QuestionCard key={question.id}>
                <QuestionText>
                  {idx + 1}. {question.text}
                </QuestionText>
                <ResultMessage $isCorrect={results[question.id]}>
                  {results[question.id]
                    ? "✓ Correct!"
                    : `✗ Incorrect. Correct answer: ${question.correctAnswer}`}
                </ResultMessage>
                {question.explanation && (
                  <p
                    style={{
                      fontSize: "0.875rem",
                      marginTop: "0.5rem",
                      color: "#666",
                    }}
                  >
                    💡 {question.explanation}
                  </p>
                )}
              </QuestionCard>
            ))}
          </div>
        </ResultsCard>
      </Container>
    );
  }

  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return (
      <Container>
        <SectionTitle>📝 Quiz</SectionTitle>
        <p>No quiz available for this topic yet.</p>
        <NewQuizButton onClick={generateNewQuiz} variant="bear">
          🎲 Generate AI Quiz
        </NewQuizButton>
      </Container>
    );
  }

  return (
    <Container>
      <SectionTitle>
        <span>📝</span> {quiz.title}
      </SectionTitle>
      <QuizDescription>{quiz.description}</QuizDescription>

      {quiz.questions.map((question, idx) => (
        <QuestionCard key={question.id}>
          <QuestionText>
            {idx + 1}. {question.text}
          </QuestionText>

          {question.type === "MULTIPLE_CHOICE" && question.options && (
            <OptionsGroup>
              {JSON.parse(question.options).map(
                (option: string, optIdx: number) => (
                  <OptionLabel key={optIdx}>
                    <RadioInput
                      type="radio"
                      name={question.id}
                      value={option}
                      checked={answers[question.id] === option}
                      onChange={(e) =>
                        handleAnswerChange(question.id, e.target.value)
                      }
                    />
                    {option}
                  </OptionLabel>
                ),
              )}
            </OptionsGroup>
          )}

          {question.type === "FILL_BLANK" && (
            <TextInput
              type="text"
              placeholder="Type your answer..."
              value={answers[question.id] || ""}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            />
          )}

          {question.type === "TRANSLATION" && (
            <TextInput
              type="text"
              placeholder="Translate to Finnish..."
              value={answers[question.id] || ""}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            />
          )}

          {question.type === "TRUE_FALSE" && (
            <OptionsGroup>
              {["True", "False"].map((option) => (
                <OptionLabel key={option}>
                  <RadioInput
                    type="radio"
                    name={question.id}
                    value={option}
                    checked={answers[question.id] === option}
                    onChange={(e) =>
                      handleAnswerChange(question.id, e.target.value)
                    }
                  />
                  {option}
                </OptionLabel>
              ))}
            </OptionsGroup>
          )}
        </QuestionCard>
      ))}

      <SubmitButton onClick={handleSubmit} variant="primary" size="large">
        Submit Quiz
      </SubmitButton>
    </Container>
  );
}
