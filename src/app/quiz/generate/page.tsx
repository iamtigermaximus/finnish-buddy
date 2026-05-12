// // src/app/quiz/generate/page.tsx
// "use client";

// import { useState, useEffect, Suspense } from "react";
// import { useSearchParams, useRouter } from "next/navigation";
// import { useSession } from "next-auth/react";
// import styled from "styled-components";
// import MainLayout from "@/components/layout/MainLayout";
// import Container from "@/components/layout/Container";
// import Button from "@/components/ui/Button";
// import LoadingSpinner from "@/components/ui/LoadingSpinner";
// import Card from "@/components/ui/Card";

// const PageHeader = styled.div`
//   text-align: center;
//   padding: 3rem 0 2rem;
// `;

// const PageTitle = styled.h1`
//   font-size: 2.5rem;
//   color: #1a1a2e;
//   margin-bottom: 0.5rem;

//   @media (max-width: 768px) {
//     font-size: 1.75rem;
//   }
// `;

// const PageDescription = styled.p`
//   color: #666;
//   font-size: 1.125rem;
//   max-width: 600px;
//   margin: 0 auto;
// `;

// const QuizContainer = styled.div`
//   max-width: 800px;
//   margin: 0 auto;
//   padding: 2rem 0;
// `;

// const QuizCard = styled(Card)`
//   margin-bottom: 1.5rem;
// `;

// const QuestionText = styled.h3`
//   font-size: 1.125rem;
//   margin-bottom: 1rem;
//   color: #1a1a2e;
// `;

// const OptionsGroup = styled.div`
//   display: flex;
//   flex-direction: column;
//   gap: 0.75rem;
//   margin-top: 1rem;
// `;

// const OptionLabel = styled.label<{
//   $selected?: boolean;
//   $isCorrect?: boolean;
//   $showResult?: boolean;
// }>`
//   display: flex;
//   align-items: center;
//   gap: 0.75rem;
//   padding: 0.75rem;
//   border-radius: 8px;
//   cursor: pointer;
//   transition: all 0.2s;
//   background: ${(props) => {
//     if (props.$showResult && props.$isCorrect) return "#48bb7820";
//     if (props.$showResult && props.$selected && !props.$isCorrect)
//       return "#f5656520";
//     return "transparent";
//   }};
//   border: 1px solid
//     ${(props) => {
//       if (props.$showResult && props.$isCorrect) return "#48bb78";
//       if (props.$showResult && props.$selected && !props.$isCorrect)
//         return "#f56565";
//       return "#e0e0e0";
//     }};

//   &:hover {
//     background: #667eea10;
//   }
// `;

// const RadioInput = styled.input`
//   width: 18px;
//   height: 18px;
//   cursor: pointer;
// `;

// const TextInput = styled.input`
//   width: 100%;
//   padding: 0.75rem;
//   border: 2px solid #e0e0e0;
//   border-radius: 8px;
//   font-size: 1rem;
//   margin-top: 0.5rem;

//   &:focus {
//     outline: none;
//     border-color: #667eea;
//   }
// `;

// const SubmitButton = styled(Button)`
//   margin-top: 2rem;
//   width: 100%;
// `;

// const ResultsCard = styled.div`
//   text-align: center;
//   padding: 2rem;
// `;

// const ScoreCircle = styled.div<{ $score: number }>`
//   width: 150px;
//   height: 150px;
//   border-radius: 50%;
//   background: conic-gradient(
//     #48bb78 0deg ${(props) => (props.$score / 100) * 360}deg,
//     #e0e0e0 ${(props) => (props.$score / 100) * 360}deg
//   );
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   margin: 0 auto 1.5rem;
//   position: relative;

//   &::before {
//     content: "";
//     position: absolute;
//     width: 120px;
//     height: 120px;
//     background: white;
//     border-radius: 50%;
//   }

//   span {
//     position: relative;
//     font-size: 2rem;
//     font-weight: bold;
//     color: #48bb78;
//   }
// `;

// const NewQuizButton = styled(Button)`
//   margin-top: 1rem;
// `;

// const ErrorMessage = styled.div`
//   text-align: center;
//   padding: 2rem;
//   color: #f56565;
// `;

// const ButtonGroup = styled.div`
//   display: flex;
//   gap: 1rem;
//   justify-content: center;
//   margin-top: 1rem;
//   flex-wrap: wrap;
// `;

// const RetryButton = styled(Button)`
//   margin-top: 1rem;
// `;

// interface Question {
//   id: string;
//   text: string;
//   type: string;
//   options: string[] | null;
//   correctAnswer: string;
//   explanation: string;
//   points: number;
// }

// interface Quiz {
//   id: string;
//   title: string;
//   description: string;
//   passingScore: number;
//   questions: Question[];
// }

// function QuizGenerateContent() {
//   const { data: session, status } = useSession();
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const topicId = searchParams.get("topicId");

//   const [quiz, setQuiz] = useState<Quiz | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [answers, setAnswers] = useState<Record<string, string>>({});
//   const [submitted, setSubmitted] = useState(false);
//   const [score, setScore] = useState<number | null>(null);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     if (status === "unauthenticated") {
//       router.push("/login");
//     }
//   }, [status, router]);

//   useEffect(() => {
//     if (!topicId || !session) return;

//     const generateQuiz = async () => {
//       setLoading(true);
//       setError(null);

//       try {
//         const response = await fetch("/api/ai/generate-quiz", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ topicId, numberOfQuestions: 10 }),
//         });

//         const data = await response.json();

//         if (!response.ok) {
//           throw new Error(data.error || "Failed to generate quiz");
//         }

//         setQuiz(data);
//       } catch (err) {
//         setError(
//           err instanceof Error ? err.message : "Failed to generate quiz",
//         );
//       } finally {
//         setLoading(false);
//       }
//     };

//     generateQuiz();
//   }, [topicId, session]);

//   const handleAnswerChange = (questionId: string, answer: string) => {
//     setAnswers((prev) => ({ ...prev, [questionId]: answer }));
//   };

//   const handleSubmit = () => {
//     if (!quiz) return;

//     let correctCount = 0;
//     quiz.questions.forEach((question) => {
//       const userAnswer = answers[question.id]?.toLowerCase().trim() || "";
//       const correctAnswer = question.correctAnswer.toLowerCase().trim();
//       if (userAnswer === correctAnswer) {
//         correctCount++;
//       }
//     });

//     const finalScore = Math.round((correctCount / quiz.questions.length) * 100);
//     setScore(finalScore);
//     setSubmitted(true);
//   };

//   const handleNewQuiz = () => {
//     window.location.reload();
//   };

//   if (loading) {
//     return (
//       <LoadingSpinner
//         fullScreen
//         message="Generating your personalized quiz... 🐻"
//       />
//     );
//   }

//   if (error) {
//     return (
//       <Container>
//         <ErrorMessage>
//           <h2>❌ Oops!</h2>
//           <p>{error}</p>
//           <RetryButton onClick={handleNewQuiz} variant="primary">
//             Try Again
//           </RetryButton>
//         </ErrorMessage>
//       </Container>
//     );
//   }

//   if (!quiz) {
//     return (
//       <Container>
//         <ErrorMessage>
//           <p>No quiz generated. Please try again.</p>
//         </ErrorMessage>
//       </Container>
//     );
//   }

//   if (submitted && score !== null) {
//     const passed = score >= quiz.passingScore;

//     return (
//       <Container>
//         <ResultsCard>
//           <ScoreCircle $score={score}>
//             <span>{score}%</span>
//           </ScoreCircle>
//           <h2>{passed ? "🎉 Congratulations!" : "📚 Keep Practicing!"}</h2>
//           <p>
//             {passed
//               ? `You passed with ${score}%! Great job mastering this topic.`
//               : `You scored ${score}%. The passing score is ${quiz.passingScore}%.`}
//           </p>
//           <ButtonGroup>
//             <NewQuizButton onClick={handleNewQuiz} variant="bear">
//               🎲 Generate New Quiz
//             </NewQuizButton>
//             <Button
//               onClick={() => router.push(`/topics/${topicId}`)}
//               variant="secondary"
//             >
//               Back to Topic
//             </Button>
//           </ButtonGroup>
//         </ResultsCard>
//       </Container>
//     );
//   }

//   return (
//     <Container>
//       <PageHeader>
//         <PageTitle>📝 {quiz.title}</PageTitle>
//         <PageDescription>{quiz.description}</PageDescription>
//       </PageHeader>

//       <QuizContainer>
//         {quiz.questions.map((question, idx) => (
//           <QuizCard key={question.id}>
//             <QuestionText>
//               {idx + 1}. {question.text}
//             </QuestionText>

//             {question.type === "multiple_choice" && question.options && (
//               <OptionsGroup>
//                 {question.options.map((option, optIdx) => (
//                   <OptionLabel key={optIdx}>
//                     <RadioInput
//                       type="radio"
//                       name={question.id}
//                       value={option}
//                       checked={answers[question.id] === option}
//                       onChange={(e) =>
//                         handleAnswerChange(question.id, e.target.value)
//                       }
//                     />
//                     {option}
//                   </OptionLabel>
//                 ))}
//               </OptionsGroup>
//             )}

//             {question.type === "fill_blank" && (
//               <TextInput
//                 type="text"
//                 placeholder="Type your answer..."
//                 value={answers[question.id] || ""}
//                 onChange={(e) =>
//                   handleAnswerChange(question.id, e.target.value)
//                 }
//               />
//             )}

//             {question.type === "translation" && (
//               <TextInput
//                 type="text"
//                 placeholder="Type your translation..."
//                 value={answers[question.id] || ""}
//                 onChange={(e) =>
//                   handleAnswerChange(question.id, e.target.value)
//                 }
//               />
//             )}
//           </QuizCard>
//         ))}

//         <SubmitButton onClick={handleSubmit} variant="primary" size="large">
//           Submit Quiz
//         </SubmitButton>
//       </QuizContainer>
//     </Container>
//   );
// }

// export default function QuizGeneratePage() {
//   return (
//     <MainLayout>
//       <Suspense
//         fallback={
//           <LoadingSpinner fullScreen message="Loading quiz generator... 🐻" />
//         }
//       >
//         <QuizGenerateContent />
//       </Suspense>
//     </MainLayout>
//   );
// }
// src/app/quiz/generate/page.tsx
// src/app/quiz/generate/page.tsx
"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import styled from "styled-components";
import MainLayout from "@/components/layout/MainLayout";
import Container from "@/components/layout/Container";
import Button from "@/components/ui/Button";
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

const QuizContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 0;
`;

const QuizCard = styled(Card)<{ $isCorrect?: boolean; $showResult?: boolean }>`
  margin-bottom: 1.5rem;
  border-left: 4px solid
    ${(props) => {
      if (props.$showResult && props.$isCorrect) return "#48bb78";
      if (props.$showResult && !props.$isCorrect) return "#f56565";
      return "transparent";
    }};
`;

const QuestionText = styled.h3`
  font-size: 1.125rem;
  margin-bottom: 1rem;
  color: #1a1a2e;
`;

const OptionsGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1rem;
`;

const OptionLabel = styled.label<{
  $selected?: boolean;
  $isCorrect?: boolean;
  $showResult?: boolean;
}>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  background: ${(props) => {
    if (props.$showResult && props.$isCorrect) return "#48bb7820";
    if (props.$showResult && props.$selected && !props.$isCorrect)
      return "#f5656520";
    return "transparent";
  }};
  border: 1px solid
    ${(props) => {
      if (props.$showResult && props.$isCorrect) return "#48bb78";
      if (props.$showResult && props.$selected && !props.$isCorrect)
        return "#f56565";
      return "#e0e0e0";
    }};

  &:hover {
    background: #667eea10;
  }
`;

const RadioInput = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
`;

// ADD THIS - the missing TextInput component
const TextInput = styled.input`
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

const ExplanationBox = styled.div<{ $isCorrect: boolean }>`
  margin-top: 1rem;
  padding: 0.75rem;
  border-radius: 8px;
  background: ${(props) => (props.$isCorrect ? "#48bb7820" : "#f5656520")};
  color: ${(props) => (props.$isCorrect ? "#48bb78" : "#f56565")};
  font-size: 0.875rem;
  line-height: 1.5;
`;

const SubmitButton = styled(Button)`
  margin-top: 2rem;
  width: 100%;
`;

const ResultsCard = styled.div`
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

const NewQuizButton = styled(Button)`
  margin-top: 1rem;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #f56565;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 1rem;
  flex-wrap: wrap;
`;

const RetryButton = styled(Button)`
  margin-top: 1rem;
`;

const ResultsList = styled.div`
  margin-top: 2rem;
  text-align: left;
`;

const ResultCard = styled(Card)<{ $isCorrect: boolean }>`
  margin-bottom: 1rem;
  border-left: 4px solid
    ${(props) => (props.$isCorrect ? "#48bb78" : "#f56565")};
`;

const ResultQuestionText = styled.p`
  font-weight: 500;
  margin-bottom: 0.5rem;
`;

const ResultAnswer = styled.p`
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
`;

const CorrectAnswer = styled.p`
  font-size: 0.875rem;
  color: #48bb78;
  margin-bottom: 0.25rem;
`;

const ResultExplanation = styled.p`
  font-size: 0.875rem;
  color: #666;
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid #e0e0e0;
`;

interface Question {
  id: string;
  text: string;
  type: string;
  options: string[] | null;
  correctAnswer: string;
  explanation: string;
  points: number;
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  passingScore: number;
  questions: Question[];
}

interface AnswerResult {
  questionId: string;
  userAnswer: string;
  isCorrect: boolean;
  correctAnswer: string;
  explanation: string;
  questionText: string;
}

function QuizGenerateContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const topicId = searchParams.get("topicId");

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [results, setResults] = useState<AnswerResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (!topicId || !session) return;

    const generateQuiz = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/ai/generate-quiz", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ topicId, numberOfQuestions: 10 }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to generate quiz");
        }

        setQuiz(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to generate quiz",
        );
      } finally {
        setLoading(false);
      }
    };

    generateQuiz();
  }, [topicId, session]);

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = () => {
    if (!quiz) return;

    let correctCount = 0;
    const answerResults: AnswerResult[] = [];

    quiz.questions.forEach((question) => {
      const userAnswer = answers[question.id]?.toLowerCase().trim() || "";
      const correctAnswer = question.correctAnswer.toLowerCase().trim();
      const isCorrect = userAnswer === correctAnswer;

      if (isCorrect) {
        correctCount++;
      }

      answerResults.push({
        questionId: question.id,
        userAnswer: answers[question.id] || "(No answer)",
        isCorrect,
        correctAnswer: question.correctAnswer,
        explanation: question.explanation,
        questionText: question.text,
      });
    });

    const finalScore = Math.round((correctCount / quiz.questions.length) * 100);
    setScore(finalScore);
    setResults(answerResults);
    setSubmitted(true);
  };

  const handleNewQuiz = () => {
    window.location.reload();
  };

  if (loading) {
    return (
      <LoadingSpinner
        fullScreen
        message="Generating your personalized quiz... 🐻"
      />
    );
  }

  if (error) {
    return (
      <Container>
        <ErrorMessage>
          <h2>❌ Oops!</h2>
          <p>{error}</p>
          <RetryButton onClick={handleNewQuiz} variant="primary">
            Try Again
          </RetryButton>
        </ErrorMessage>
      </Container>
    );
  }

  if (!quiz) {
    return (
      <Container>
        <ErrorMessage>
          <p>No quiz generated. Please try again.</p>
        </ErrorMessage>
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
              ? `You passed with ${score}%! Great job mastering this topic.`
              : `You scored ${score}%. The passing score is ${quiz.passingScore}%.`}
          </p>

          <ResultsList>
            <h3>Review Your Answers:</h3>
            {results.map((result, idx) => (
              <ResultCard key={idx} $isCorrect={result.isCorrect}>
                <ResultQuestionText>
                  {idx + 1}. {result.questionText}
                </ResultQuestionText>
                <ResultAnswer>
                  <strong>Your answer:</strong> {result.userAnswer}
                </ResultAnswer>
                {!result.isCorrect && (
                  <CorrectAnswer>
                    <strong>Correct answer:</strong> {result.correctAnswer}
                  </CorrectAnswer>
                )}
                <ResultExplanation>💡 {result.explanation}</ResultExplanation>
              </ResultCard>
            ))}
          </ResultsList>

          <ButtonGroup>
            <NewQuizButton onClick={handleNewQuiz} variant="bear">
              🎲 Generate New Quiz
            </NewQuizButton>
            <Button
              onClick={() => router.push(`/topics/${topicId}`)}
              variant="secondary"
            >
              Back to Topic
            </Button>
          </ButtonGroup>
        </ResultsCard>
      </Container>
    );
  }

  return (
    <Container>
      <PageHeader>
        <PageTitle>📝 {quiz.title}</PageTitle>
        <PageDescription>{quiz.description}</PageDescription>
      </PageHeader>

      <QuizContainer>
        {quiz.questions.map((question, idx) => (
          <QuizCard key={question.id}>
            <QuestionText>
              {idx + 1}. {question.text}
            </QuestionText>

            {question.type === "multiple_choice" && question.options && (
              <OptionsGroup>
                {question.options.map((option, optIdx) => (
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
                ))}
              </OptionsGroup>
            )}

            {question.type === "fill_blank" && (
              <TextInput
                type="text"
                placeholder="Type your answer..."
                value={answers[question.id] || ""}
                onChange={(e) =>
                  handleAnswerChange(question.id, e.target.value)
                }
              />
            )}

            {question.type === "translation" && (
              <TextInput
                type="text"
                placeholder="Type your translation..."
                value={answers[question.id] || ""}
                onChange={(e) =>
                  handleAnswerChange(question.id, e.target.value)
                }
              />
            )}
          </QuizCard>
        ))}

        <SubmitButton onClick={handleSubmit} variant="primary" size="large">
          Submit Quiz
        </SubmitButton>
      </QuizContainer>
    </Container>
  );
}

export default function QuizGeneratePage() {
  return (
    <MainLayout>
      <Suspense
        fallback={
          <LoadingSpinner fullScreen message="Loading quiz generator... 🐻" />
        }
      >
        <QuizGenerateContent />
      </Suspense>
    </MainLayout>
  );
}
