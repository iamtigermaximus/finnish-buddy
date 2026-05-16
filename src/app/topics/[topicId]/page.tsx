"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import styled from "styled-components";
import MainLayout from "@/components/layout/MainLayout";
import Container from "@/components/layout/Container";
import Button from "@/components/ui/Button";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const TopicHeader = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  border-radius: 16px;
  margin-bottom: 2rem;
`;

const TopicTitle = styled.h1`
  font-size: 2rem;
  margin-bottom: 0.5rem;
`;

const LevelBadge = styled.span`
  display: inline-block;
  background: rgba(255, 255, 255, 0.2);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
`;

const StepsContainer = styled.div`
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
`;

const StepsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;

  @media (max-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const StepCard = styled.button<{ $active: boolean; $completed: boolean }>`
  padding: 1rem;
  border: 2px solid
    ${(props) =>
      props.$active ? "#667eea" : props.$completed ? "#48bb78" : "#e0e0e0"};
  background: ${(props) => (props.$active ? "#667eea10" : "white")};
  border-radius: 8px;
  cursor: ${(props) => (props.$completed ? "pointer" : "default")};
  opacity: ${(props) => (props.$completed ? 1 : 0.7)};
  text-align: left;
  transition: all 0.2s;

  &:hover {
    transform: ${(props) => (props.$completed ? "translateY(-2px)" : "none")};
  }
`;

const StepIcon = styled.div`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
`;

const StepTitle = styled.h3`
  font-size: 1rem;
  margin-bottom: 0.25rem;
`;

const StepDesc = styled.p`
  font-size: 0.75rem;
  color: #666;
`;

const ContentArea = styled.div`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  min-height: 500px;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #1a1a2e;
`;

const RulesList = styled.ul`
  margin-left: 1.5rem;
  margin-top: 1rem;
  li {
    margin-bottom: 0.5rem;
    line-height: 1.5;
  }
`;

const ExampleGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const ExampleCard = styled.div`
  background: #f5f7fa;
  padding: 1rem;
  border-radius: 8px;
  border-left: 3px solid #667eea;
`;

const FinnishText = styled.div`
  font-weight: bold;
  font-size: 1.1rem;
  color: #667eea;
  margin-bottom: 0.25rem;
`;

const EnglishText = styled.div`
  color: #666;
  font-size: 0.9rem;
`;

const MemoryAidBox = styled.div`
  background: #fff9e6;
  border-left: 4px solid #ffd700;
  padding: 1rem;
  border-radius: 8px;
  margin: 1.5rem 0;
`;

const MnemonicText = styled.div`
  font-weight: bold;
  font-size: 1.1rem;
  margin: 0.5rem 0;
  color: #8b6914;
`;

const TipsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const TipItem = styled.div`
  background: white;
  padding: 0.5rem;
  border-radius: 8px;
  font-size: 0.875rem;
`;

const ExerciseCard = styled.div`
  background: #f5f7fa;
  padding: 1.5rem;
  border-radius: 12px;
  margin-bottom: 1rem;
`;

const ExercisePrompt = styled.p`
  font-weight: 500;
  margin-bottom: 0.5rem;
`;

const AnswerInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  margin-top: 0.5rem;

  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const FeedbackText = styled.p<{ $isCorrect: boolean }>`
  color: ${(props) => (props.$isCorrect ? "#48bb78" : "#f56565")};
  margin-top: 0.5rem;
  font-size: 0.875rem;
`;

const HintDetails = styled.details`
  margin-top: 0.5rem;
  summary {
    color: #ed8936;
    cursor: pointer;
    font-size: 0.875rem;
  }
`;

const QuestionCard = styled.div`
  background: #f5f7fa;
  padding: 1.5rem;
  border-radius: 12px;
  margin-bottom: 1rem;
`;

const QuestionText = styled.p`
  font-weight: 500;
  margin-bottom: 1rem;
`;

const OptionsGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const OptionLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  &:hover {
    background: #667eea10;
  }
`;

const NavigationButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
  gap: 1rem;
`;

const NavButton = styled.button<{ $primary?: boolean }>`
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  background: ${(props) => (props.$primary ? "#667eea" : "#e0e0e0")};
  color: ${(props) => (props.$primary ? "white" : "#1a1a2e")};

  &:hover {
    transform: translateY(-2px);
  }
`;

const ResultsContainer = styled.div`
  text-align: center;
  padding: 2rem;
`;

const ScoreCircle = styled.div<{ $score: number }>`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: conic-gradient(
    #48bb78 0deg ${(props) => (props.$score / 100) * 360}deg,
    #e0e0e0 ${(props) => (props.$score / 100) * 360}deg
  );
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
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
    color: #48bb78;
  }
`;

const ErrorContainer = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  margin: 2rem auto;
`;

const ErrorIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`;

const ErrorTitle = styled.h2`
  font-size: 1.75rem;
  color: #f56565;
  margin-bottom: 1rem;
`;

const ErrorMessage = styled.p`
  color: #666;
  margin-bottom: 1.5rem;
  line-height: 1.6;
`;

const ErrorHint = styled.p`
  color: #999;
  font-size: 0.875rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e0e0e0;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 1rem;
  flex-wrap: wrap;
`;

const SuccessButton = styled.button`
  background: #48bb78;
  color: white;
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #38a169;
    transform: translateY(-2px);
  }
`;

const steps = [
  { icon: "📖", title: "Grammar", desc: "Learn the rules" },
  { icon: "💡", title: "Examples", desc: "See it in action" },
  { icon: "✏️", title: "Practice", desc: "Try it yourself" },
  { icon: "📝", title: "Quiz", desc: "Test your knowledge" },
];

interface GeneratedLesson {
  grammarExplanation: string;
  grammarRules: string[];
  examples: Array<{ finnish: string; english: string; explanation?: string }>;
  memoryAid: {
    mnemonic: string;
    explanation: string;
    quickTips: string[];
  };
  practiceExercises: Array<{
    prompt: string;
    expectedAnswer: string;
    hint: string;
  }>;
  quizQuestions: Array<{
    text: string;
    type: string;
    options?: string[];
    correctAnswer: string;
    explanation: string;
  }>;
}

interface QuizResultItem {
  questionText: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  explanation: string;
  userAnswerDisplay: string;
}

interface LevelTopic {
  id: string;
  title: string;
  order: number;
}

interface LevelData {
  id: string;
  name: string;
  topics: LevelTopic[];
}

export default function TopicPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [topicTitle, setTopicTitle] = useState<string>("");
  const [level, setLevel] = useState<string>("A1");
  const [lesson, setLesson] = useState<GeneratedLesson | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [friendlyError, setFriendlyError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [quizResults, setQuizResults] = useState<QuizResultItem[]>([]);
  const [nextTopicId, setNextTopicId] = useState<string | null>(null);
  const [nextTopicTitle, setNextTopicTitle] = useState<string>("");

  const [practiceAnswers, setPracticeAnswers] = useState<
    Record<string, string>
  >({});
  const [practiceResults, setPracticeResults] = useState<
    Record<string, boolean>
  >({});

  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  // Fetch topic and generate lesson
  useEffect(() => {
    const fetchTopicAndGenerateLesson = async () => {
      try {
        const topicId = params.topicId as string;

        const topicRes = await fetch(`/api/topics/${topicId}`);
        if (!topicRes.ok) {
          throw new Error("Failed to fetch topic information");
        }
        const topicData = await topicRes.json();
        setTopicTitle(topicData.title);
        setLevel(topicData.level?.name || "A1");

        const lessonRes = await fetch("/api/ai/generate-lesson", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            topicTitle: topicData.title,
            level: topicData.level?.name || "A1",
            numberOfQuestions: 10,
          }),
        });

        const lessonData = await lessonRes.json();

        if (!lessonRes.ok) {
          setFriendlyError(
            lessonData.friendlyMessage ||
              "🐻 Oops! Otso is having trouble creating your lesson right now. Please try again in a moment.",
          );
          setError(lessonData.error || "Failed to generate lesson");
          return;
        }

        setLesson(lessonData);
      } catch (err) {
        console.error("Failed to generate lesson:", err);
        setFriendlyError(
          "🐻 Oops! Otso is having trouble creating your lesson right now. This might be because our AI is busy or there's a connection issue.",
        );
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchTopicAndGenerateLesson();
    }
  }, [params.topicId, session]);

  // Find next topic after current topic loads
  useEffect(() => {
    const findNextTopic = async () => {
      if (!topicTitle || !level) return;

      try {
        const levelResponse = await fetch(`/api/levels?level=${level}`);
        const levelData = await levelResponse.json();
        const currentLevel = Array.isArray(levelData)
          ? levelData[0]
          : (levelData as LevelData);

        if (currentLevel?.topics && Array.isArray(currentLevel.topics)) {
          const currentTopicId = params.topicId as string;
          const currentIndex = currentLevel.topics.findIndex(
            (t: LevelTopic) => t.id === currentTopicId,
          );

          if (
            currentIndex !== -1 &&
            currentIndex < currentLevel.topics.length - 1
          ) {
            const nextTopic = currentLevel.topics[currentIndex + 1];
            setNextTopicId(nextTopic.id);
            setNextTopicTitle(nextTopic.title);
          }
        }
      } catch (error) {
        console.error("Failed to find next topic:", error);
      }
    };

    if (topicTitle && level) {
      findNextTopic();
    }
  }, [topicTitle, level, params.topicId]);

  const markStepCompleted = async (step: number) => {
    if (!completedSteps.includes(step)) {
      setCompletedSteps([...completedSteps, step]);

      const stepNames = ["grammar", "examples", "practice", "quiz"];
      try {
        await fetch("/api/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            topicId: params.topicId,
            step: stepNames[step],
            completed: true,
          }),
        });
        console.log(`✅ Step "${stepNames[step]}" saved to database`);
      } catch (error) {
        console.error("Failed to save step progress:", error);
      }
    }
  };

  const handleNext = async () => {
    await markStepCompleted(currentStep);
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const checkPracticeAnswer = (index: number) => {
    if (!lesson) return;
    const userAnswer = practiceAnswers[index] || "";
    const isCorrect =
      userAnswer.toLowerCase().trim() ===
      lesson.practiceExercises[index].expectedAnswer.toLowerCase();
    setPracticeResults({ ...practiceResults, [index]: isCorrect });
  };

  const submitQuiz = async () => {
    if (!lesson) return;

    const questionResults: QuizResultItem[] = [];
    let correct = 0;

    lesson.quizQuestions.forEach((q, idx) => {
      const userAnswer = quizAnswers[`q${idx}`] || "";
      const isCorrect =
        userAnswer.toLowerCase().trim() === q.correctAnswer.toLowerCase();

      if (isCorrect) {
        correct++;
      }

      questionResults.push({
        questionText: q.text,
        userAnswer: userAnswer,
        correctAnswer: q.correctAnswer,
        isCorrect: isCorrect,
        explanation: q.explanation,
        userAnswerDisplay: quizAnswers[`q${idx}`] || "(No answer)",
      });
    });

    const score = Math.round((correct / lesson.quizQuestions.length) * 100);
    setQuizScore(score);
    setQuizResults(questionResults);
    setQuizSubmitted(true);

    if (score >= 70) {
      await markStepCompleted(3);
    }
  };

  const allPracticeCompleted =
    lesson &&
    Object.keys(practiceResults).length === lesson.practiceExercises.length &&
    Object.values(practiceResults).every((v) => v === true);

  if (error) {
    return (
      <MainLayout>
        <Container>
          <ErrorContainer>
            <ErrorIcon>🐻</ErrorIcon>
            <ErrorTitle>Oops! Something went wrong</ErrorTitle>
            <ErrorMessage>{friendlyError || error}</ErrorMessage>
            <ButtonGroup>
              <Button
                onClick={() => window.location.reload()}
                variant="primary"
              >
                Try Again
              </Button>
              <Button href="/levels" variant="secondary">
                Back to Levels
              </Button>
            </ButtonGroup>
            <ErrorHint>
              {process.env.NODE_ENV === "development" && `Debug: ${error}`}
              <br />
              <small>If this keeps happening, please try again later.</small>
            </ErrorHint>
          </ErrorContainer>
        </Container>
      </MainLayout>
    );
  }

  if (loading || !lesson) {
    return (
      <MainLayout>
        <LoadingSpinner
          fullScreen
          message="✨ Otso is generating your personalized lesson ... 🐻"
        />
      </MainLayout>
    );
  }

  const isStepUnlocked = (step: number) => {
    if (step === 0) return true;
    return completedSteps.includes(step - 1);
  };

  return (
    <MainLayout>
      <Container>
        <TopicHeader>
          <TopicTitle>{topicTitle}</TopicTitle>
          <LevelBadge>{level}</LevelBadge>
        </TopicHeader>

        <StepsContainer>
          <StepsGrid>
            {steps.map((step, idx) => (
              <StepCard
                key={idx}
                $active={currentStep === idx}
                $completed={completedSteps.includes(idx)}
                onClick={() => isStepUnlocked(idx) && setCurrentStep(idx)}
              >
                <StepIcon>{step.icon}</StepIcon>
                <StepTitle>{step.title}</StepTitle>
                <StepDesc>{step.desc}</StepDesc>
              </StepCard>
            ))}
          </StepsGrid>
        </StepsContainer>

        <ContentArea>
          {currentStep === 0 && (
            <div>
              <SectionTitle>📖 Grammar Explanation</SectionTitle>
              <p style={{ lineHeight: 1.6 }}>{lesson.grammarExplanation}</p>

              <SectionTitle>📋 Key Rules</SectionTitle>
              <RulesList>
                {lesson.grammarRules.map((rule, i) => (
                  <li key={i}>{rule}</li>
                ))}
              </RulesList>

              <MemoryAidBox>
                <strong>🧠 Quick Memory Aid</strong>
                <MnemonicText>✨ {lesson.memoryAid.mnemonic}</MnemonicText>
                <p>{lesson.memoryAid.explanation}</p>
                <TipsGrid>
                  {lesson.memoryAid.quickTips.map((tip, i) => (
                    <TipItem key={i}>💡 {tip}</TipItem>
                  ))}
                </TipsGrid>
              </MemoryAidBox>
            </div>
          )}

          {currentStep === 1 && (
            <div>
              <SectionTitle>💡 Examples in Context</SectionTitle>
              <ExampleGrid>
                {lesson.examples.map((ex, i) => (
                  <ExampleCard key={i}>
                    <FinnishText>🇫🇮 {ex.finnish}</FinnishText>
                    <EnglishText>🇬🇧 {ex.english}</EnglishText>
                    {ex.explanation && (
                      <small
                        style={{
                          color: "#666",
                          display: "block",
                          marginTop: "0.5rem",
                        }}
                      >
                        📝 {ex.explanation}
                      </small>
                    )}
                  </ExampleCard>
                ))}
              </ExampleGrid>
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <SectionTitle>✏️ Practice Exercises</SectionTitle>
              {lesson.practiceExercises.map((ex, idx) => (
                <ExerciseCard key={idx}>
                  <ExercisePrompt>
                    {idx + 1}. {ex.prompt}
                  </ExercisePrompt>
                  <AnswerInput
                    type="text"
                    placeholder="Type your answer..."
                    value={practiceAnswers[idx] || ""}
                    onChange={(e) => {
                      const newAnswers = {
                        ...practiceAnswers,
                        [idx]: e.target.value,
                      };
                      setPracticeAnswers(newAnswers);
                    }}
                  />
                  <div
                    style={{
                      display: "flex",
                      gap: "0.5rem",
                      marginTop: "0.5rem",
                    }}
                  >
                    <Button
                      onClick={() => checkPracticeAnswer(idx)}
                      variant="secondary"
                      size="small"
                    >
                      Check Answer
                    </Button>
                    <HintDetails>
                      <summary>💡 Hint</summary>
                      <p style={{ marginTop: "0.5rem", fontSize: "0.875rem" }}>
                        {ex.hint}
                      </p>
                    </HintDetails>
                  </div>
                  {practiceResults[idx] !== undefined && (
                    <FeedbackText $isCorrect={practiceResults[idx]}>
                      {practiceResults[idx]
                        ? "✓ Correct! Great job!"
                        : `✗ Not quite. Correct answer: "${ex.expectedAnswer}"`}
                    </FeedbackText>
                  )}
                </ExerciseCard>
              ))}
            </div>
          )}

          {currentStep === 3 && !quizSubmitted && (
            <div>
              <SectionTitle>📝 Quiz</SectionTitle>
              {lesson.quizQuestions.map((q, idx) => (
                <QuestionCard key={idx}>
                  <QuestionText>
                    {idx + 1}. {q.text}
                  </QuestionText>
                  {q.type === "multiple_choice" && q.options && (
                    <OptionsGroup>
                      {q.options.map((opt, optIdx) => (
                        <OptionLabel key={optIdx}>
                          <input
                            type="radio"
                            name={`q${idx}`}
                            value={opt}
                            onChange={(e) =>
                              setQuizAnswers({
                                ...quizAnswers,
                                [`q${idx}`]: e.target.value,
                              })
                            }
                          />
                          {opt}
                        </OptionLabel>
                      ))}
                    </OptionsGroup>
                  )}
                  {(q.type === "fill_blank" || q.type === "translation") && (
                    <AnswerInput
                      type="text"
                      placeholder="Type your answer..."
                      onChange={(e) =>
                        setQuizAnswers({
                          ...quizAnswers,
                          [`q${idx}`]: e.target.value,
                        })
                      }
                    />
                  )}
                </QuestionCard>
              ))}
              <Button onClick={submitQuiz} variant="primary" size="large">
                Submit Quiz
              </Button>
            </div>
          )}

          {currentStep === 3 && quizSubmitted && quizScore !== null && (
            <div>
              <ResultsContainer>
                <ScoreCircle $score={quizScore}>
                  <span>{quizScore}%</span>
                </ScoreCircle>
                <h2>
                  {quizScore >= 70
                    ? "🎉 Congratulations!"
                    : "📚 Keep Practicing!"}
                </h2>
                <p style={{ marginBottom: "1rem" }}>
                  {quizScore >= 70
                    ? `You passed with ${quizScore}%! Great job mastering ${topicTitle}. 🐻`
                    : `You scored ${quizScore}%. The passing score is 70%.`}
                </p>
              </ResultsContainer>

              {/* Detailed Results */}
              <div style={{ marginTop: "2rem" }}>
                <h3>📋 Detailed Results:</h3>
                {quizResults.map((result, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: result.isCorrect ? "#48bb7820" : "#f5656520",
                      borderLeft: `4px solid ${result.isCorrect ? "#48bb78" : "#f56565"}`,
                      padding: "1rem",
                      marginBottom: "1rem",
                      borderRadius: "8px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <strong>Question {idx + 1}:</strong>
                      <span
                        style={{
                          color: result.isCorrect ? "#48bb78" : "#f56565",
                        }}
                      >
                        {result.isCorrect ? "✓ Correct" : "✗ Incorrect"}
                      </span>
                    </div>
                    <p style={{ marginTop: "0.5rem" }}>{result.questionText}</p>
                    <div style={{ marginTop: "0.5rem", fontSize: "0.875rem" }}>
                      <div>
                        <strong>Your answer:</strong> {result.userAnswerDisplay}
                      </div>
                      {!result.isCorrect && (
                        <div style={{ color: "#48bb78", marginTop: "0.25rem" }}>
                          <strong>Correct answer:</strong>{" "}
                          {result.correctAnswer}
                        </div>
                      )}
                      <div
                        style={{
                          color: "#666",
                          marginTop: "0.5rem",
                          fontStyle: "italic",
                        }}
                      >
                        💡 {result.explanation}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Button Group with Next Topic */}
              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  justifyContent: "center",
                  marginTop: "2rem",
                  flexWrap: "wrap",
                }}
              >
                <Button
                  onClick={() => router.push("/levels")}
                  variant="secondary"
                >
                  ← Back to Levels
                </Button>

                {nextTopicId && quizScore >= 70 && (
                  <SuccessButton
                    onClick={() => {
                      router.push(`/topics/${nextTopicId}`);
                    }}
                  >
                    Next Topic: {nextTopicTitle} →
                  </SuccessButton>
                )}

                {quizScore < 70 && (
                  <Button
                    onClick={() => {
                      setQuizSubmitted(false);
                      setQuizAnswers({});
                      setQuizScore(null);
                      setQuizResults([]);
                    }}
                    variant="bear"
                  >
                    Try Again 🔄
                  </Button>
                )}
              </div>
            </div>
          )}

          {currentStep < 3 && (
            <NavigationButtons>
              {currentStep > 0 && (
                <NavButton onClick={handlePrevious}>← Previous</NavButton>
              )}
              <NavButton $primary onClick={handleNext}>
                {currentStep === 2 ? "Take Quiz →" : "Next →"}
              </NavButton>
            </NavigationButtons>
          )}
        </ContentArea>
      </Container>
    </MainLayout>
  );
}
