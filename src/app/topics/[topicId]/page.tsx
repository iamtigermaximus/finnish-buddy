// // src/app/topics/[topicId]/page.tsx
// "use client";

// import { useState, useEffect } from "react";
// import { useParams, useRouter } from "next/navigation";
// import { useSession } from "next-auth/react";
// import styled from "styled-components";
// import MainLayout from "@/components/layout/MainLayout";
// import Container from "@/components/layout/Container";
// import LoadingSpinner from "@/components/ui/LoadingSpinner";
// import GrammarSection from "@/components/grammar/GrammarSection";
// import ExamplesSection from "@/components/grammar/ExamplesSection";
// import PracticeSection from "@/components/practice/PracticeSection";
// import QuizSection from "@/components/quiz/QuizSection";

// const TopicHeader = styled.div`
//   background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//   color: white;
//   padding: 2rem;
//   border-radius: 16px;
//   margin-bottom: 2rem;

//   @media (max-width: 768px) {
//     padding: 1.5rem;
//   }
// `;

// const TopicTitle = styled.h1`
//   font-size: 2rem;
//   margin-bottom: 0.5rem;

//   @media (max-width: 768px) {
//     font-size: 1.5rem;
//   }
// `;

// const TopicDescription = styled.p`
//   opacity: 0.95;
//   font-size: 1rem;
//   line-height: 1.5;
// `;

// const LevelBadge = styled.div<{ $color: string }>`
//   display: inline-block;
//   background: ${(props) => props.$color}40;
//   padding: 0.25rem 1rem;
//   border-radius: 9999px;
//   font-size: 0.75rem;
//   margin-top: 0.5rem;
//   color: ${(props) => props.$color};
// `;

// const StepsContainer = styled.div`
//   background: white;
//   border-radius: 16px;
//   padding: 1.5rem;
//   margin-bottom: 2rem;
//   box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);

//   @media (max-width: 768px) {
//     padding: 1rem;
//   }
// `;

// const StepsGrid = styled.div`
//   display: grid;
//   grid-template-columns: repeat(4, 1fr);
//   gap: 1rem;

//   @media (max-width: 768px) {
//     grid-template-columns: repeat(2, 1fr);
//     gap: 0.5rem;
//   }

//   @media (max-width: 480px) {
//     grid-template-columns: 1fr;
//   }
// `;

// const StepCard = styled.button<{ $active: boolean; $completed: boolean }>`
//   padding: 1rem;
//   border: 2px solid
//     ${(props) =>
//       props.$active ? "#667eea" : props.$completed ? "#48bb78" : "#e0e0e0"};
//   background: ${(props) => (props.$active ? "#667eea10" : "white")};
//   border-radius: 8px;
//   cursor: ${(props) =>
//     props.$active || props.$completed ? "pointer" : "not-allowed"};
//   transition: all 0.2s;
//   text-align: left;
//   opacity: ${(props) => (!props.$active && !props.$completed ? 0.6 : 1)};

//   &:hover {
//     transform: ${(props) =>
//       props.$active || props.$completed ? "translateY(-2px)" : "none"};
//     box-shadow: ${(props) =>
//       props.$active || props.$completed
//         ? "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
//         : "none"};
//   }
// `;

// const StepIcon = styled.div<{ $completed: boolean }>`
//   width: 40px;
//   height: 40px;
//   border-radius: 9999px;
//   background: ${(props) => (props.$completed ? "#48bb78" : "#667eea")};
//   color: white;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   font-size: 1.25rem;
//   margin-bottom: 0.5rem;
// `;

// const StepTitle = styled.h3`
//   font-size: 1rem;
//   margin-bottom: 0.25rem;
//   color: #1a1a2e;
// `;

// const StepDescription = styled.p`
//   font-size: 0.75rem;
//   color: #666;
// `;

// const ContentArea = styled.div`
//   background: white;
//   border-radius: 16px;
//   padding: 2rem;
//   box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
//   min-height: 500px;

//   @media (max-width: 768px) {
//     padding: 1.5rem;
//   }
// `;

// const NavigationButtons = styled.div`
//   display: flex;
//   justify-content: space-between;
//   margin-top: 2rem;
//   gap: 1rem;

//   button {
//     padding: 0.75rem 2rem;
//     border: none;
//     border-radius: 8px;
//     font-weight: 600;
//     cursor: pointer;
//     transition: all 0.2s;

//     &:hover {
//       transform: translateY(-2px);
//     }

//     &:disabled {
//       opacity: 0.5;
//       cursor: not-allowed;
//       transform: none;
//     }
//   }
// `;

// const PrevButton = styled.button`
//   background: #e0e0e0;
//   color: #1a1a2e;

//   &:hover {
//     background: #d0d0d0;
//   }
// `;

// const NextButton = styled.button`
//   background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//   color: white;
// `;

// const ButtonGroup = styled.div`
//   display: flex;
//   gap: 1rem;
//   justify-content: flex-end;
// `;

// const SuccessButton = styled(NextButton)`
//   background: #48bb78;
// `;

// enum LearningStep {
//   GRAMMAR = 0,
//   EXAMPLES = 1,
//   PRACTICE = 2,
//   QUIZ = 3,
// }

// const steps = [
//   { title: "Grammar & Rules", description: "Learn the theory", icon: "📖" },
//   { title: "Examples", description: "See it in action", icon: "💡" },
//   { title: "Practice", description: "Interactive exercises", icon: "✏️" },
//   { title: "Quiz", description: "Test your knowledge", icon: "📝" },
// ];

// interface GrammarExample {
//   finnish: string;
//   english: string;
//   explanation?: string;
// }

// interface GrammarRule {
//   id: string;
//   title: string;
//   explanation: string;
//   rules: string;
//   examples: GrammarExample[];
// }

// interface VocabularyWord {
//   finnish: string;
//   english: string;
//   memoryTip: string | null;
//   exampleSentence: string | null;
// }

// interface QuizQuestion {
//   id: string;
//   text: string;
//   type: string;
//   options: string | null;
//   correctAnswer: string;
//   explanation: string | null;
// }

// interface Quiz {
//   id: string;
//   title: string;
//   description: string;
//   passingScore: number;
//   questions: QuizQuestion[];
// }

// interface LevelInfo {
//   name: string;
//   title: string;
//   color: string;
// }

// interface TopicProgress {
//   grammarViewed: boolean;
//   examplesViewed: boolean;
//   practiceCompleted: boolean;
//   quizCompleted: boolean;
//   completed: boolean;
// }

// interface TopicData {
//   id: string;
//   title: string;
//   description: string;
//   level: LevelInfo;
//   grammarRules: GrammarRule[];
//   examples: GrammarExample[];
//   memoryAid: {
//     mnemonic: string;
//     explanation: string;
//     quickTips: string;
//     colorCode: string;
//     icon: string;
//   } | null;
//   vocabulary: VocabularyWord[];
//   quizzes: Quiz[];
//   progress: TopicProgress[] | null;
// }

// interface LevelTopic {
//   id: string;
//   title: string;
//   order: number;
// }

// interface LevelData {
//   id: string;
//   name: string;
//   topics: LevelTopic[];
// }

// export default function TopicPage() {
//   const params = useParams();
//   const router = useRouter();
//   const { data: session } = useSession();
//   const [topic, setTopic] = useState<TopicData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [currentStep, setCurrentStep] = useState<LearningStep>(
//     LearningStep.GRAMMAR,
//   );
//   const [completedSteps, setCompletedSteps] = useState<Set<LearningStep>>(
//     new Set(),
//   );
//   const [quizCompleted, setQuizCompleted] = useState(false);
//   const [nextTopicId, setNextTopicId] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchTopic = async () => {
//       try {
//         const topicId = params.topicId as string;
//         const response = await fetch(`/api/topics/${topicId}`);
//         const data = await response.json();
//         setTopic(data);

//         if (data.progress && data.progress[0]) {
//           const progress = data.progress[0];
//           const completed = new Set<LearningStep>();
//           if (progress.grammarViewed) completed.add(LearningStep.GRAMMAR);
//           if (progress.examplesViewed) completed.add(LearningStep.EXAMPLES);
//           if (progress.practiceCompleted) completed.add(LearningStep.PRACTICE);
//           if (progress.quizCompleted) completed.add(LearningStep.QUIZ);
//           setCompletedSteps(completed);

//           if (!progress.grammarViewed) setCurrentStep(LearningStep.GRAMMAR);
//           else if (!progress.examplesViewed)
//             setCurrentStep(LearningStep.EXAMPLES);
//           else if (!progress.practiceCompleted)
//             setCurrentStep(LearningStep.PRACTICE);
//           else if (!progress.quizCompleted) setCurrentStep(LearningStep.QUIZ);
//           else setCurrentStep(LearningStep.QUIZ);
//         }
//       } catch (error) {
//         console.error("Failed to fetch topic:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (session) {
//       fetchTopic();
//     }
//   }, [params.topicId, session]);

//   useEffect(() => {
//     const findNextTopic = async () => {
//       if (!topic?.level?.name) return;

//       try {
//         const levelResponse = await fetch(
//           `/api/levels?level=${topic.level.name}`,
//         );
//         const levelData = await levelResponse.json();
//         const currentLevel = Array.isArray(levelData)
//           ? levelData[0]
//           : levelData;

//         if (currentLevel?.topics && Array.isArray(currentLevel.topics)) {
//           const currentIndex = currentLevel.topics.findIndex(
//             (t: LevelTopic) => t.id === topic.id,
//           );
//           if (
//             currentIndex !== -1 &&
//             currentIndex < currentLevel.topics.length - 1
//           ) {
//             setNextTopicId(currentLevel.topics[currentIndex + 1].id);
//           }
//         }
//       } catch (error) {
//         console.error("Failed to find next topic:", error);
//       }
//     };

//     if (topic) {
//       findNextTopic();
//     }
//   }, [topic]);

//   const markStepCompleted = async (step: LearningStep) => {
//     const stepName = LearningStep[step].toLowerCase();
//     const newCompleted = new Set(completedSteps);
//     newCompleted.add(step);
//     setCompletedSteps(newCompleted);

//     try {
//       await fetch("/api/progress", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           topicId: params.topicId,
//           step: stepName,
//           completed: true,
//         }),
//       });
//     } catch (error) {
//       console.error("Failed to save progress:", error);
//     }
//   };

//   const handleNext = () => {
//     markStepCompleted(currentStep);
//     if (currentStep < LearningStep.QUIZ) {
//       setCurrentStep(currentStep + 1);
//       window.scrollTo({ top: 0, behavior: "smooth" });
//     }
//   };

//   const handlePrevious = () => {
//     if (currentStep > LearningStep.GRAMMAR) {
//       setCurrentStep(currentStep - 1);
//       window.scrollTo({ top: 0, behavior: "smooth" });
//     }
//   };

//   const handleQuizComplete = async (score: number) => {
//     setQuizCompleted(true);

//     try {
//       await fetch("/api/progress", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           topicId: params.topicId,
//           step: "quiz",
//           completed: true,
//           score: score,
//         }),
//       });

//       markStepCompleted(LearningStep.QUIZ);
//     } catch (error) {
//       console.error("Failed to save quiz progress:", error);
//     }
//   };

//   const isStepUnlocked = (step: LearningStep) => {
//     if (step === LearningStep.GRAMMAR) return true;
//     if (step === LearningStep.EXAMPLES)
//       return completedSteps.has(LearningStep.GRAMMAR);
//     if (step === LearningStep.PRACTICE)
//       return completedSteps.has(LearningStep.EXAMPLES);
//     if (step === LearningStep.QUIZ)
//       return completedSteps.has(LearningStep.PRACTICE);
//     return false;
//   };

//   if (loading || !topic) {
//     return (
//       <MainLayout>
//         <LoadingSpinner fullScreen message="Loading lesson... 🐻" />
//       </MainLayout>
//     );
//   }

//   const levelColor = topic.level?.color || "#667eea";

//   return (
//     <MainLayout>
//       <Container>
//         <TopicHeader>
//           <TopicTitle>{topic.title}</TopicTitle>
//           <TopicDescription>{topic.description}</TopicDescription>
//           <LevelBadge $color={levelColor}>
//             {topic.level?.name} - {topic.level?.title}
//           </LevelBadge>
//         </TopicHeader>

//         <StepsContainer>
//           <StepsGrid>
//             {steps.map((step, index) => {
//               const isActive = currentStep === index;
//               const isCompleted = completedSteps.has(index);
//               const isUnlocked = isStepUnlocked(index);

//               return (
//                 <StepCard
//                   key={index}
//                   $active={isActive}
//                   $completed={isCompleted}
//                   onClick={() => isUnlocked && setCurrentStep(index)}
//                 >
//                   <StepIcon $completed={isCompleted}>
//                     {isCompleted ? "✓" : step.icon}
//                   </StepIcon>
//                   <StepTitle>{step.title}</StepTitle>
//                   <StepDescription>{step.description}</StepDescription>
//                 </StepCard>
//               );
//             })}
//           </StepsGrid>
//         </StepsContainer>

//         <ContentArea>
//           {currentStep === LearningStep.GRAMMAR && (
//             <GrammarSection
//               grammarRules={topic.grammarRules}
//               memoryAid={topic.memoryAid}
//               onComplete={() => markStepCompleted(LearningStep.GRAMMAR)}
//             />
//           )}

//           {currentStep === LearningStep.EXAMPLES && (
//             <ExamplesSection
//               examples={topic.examples}
//               grammarRules={topic.grammarRules}
//               vocabulary={topic.vocabulary}
//               onComplete={() => markStepCompleted(LearningStep.EXAMPLES)}
//             />
//           )}

//           {currentStep === LearningStep.PRACTICE && (
//             <PracticeSection
//               topicId={topic.id}
//               topicTitle={topic.title}
//               grammarRules={topic.grammarRules}
//               onComplete={() => markStepCompleted(LearningStep.PRACTICE)}
//             />
//           )}

//           {currentStep === LearningStep.QUIZ && (
//             <QuizSection
//               quiz={topic.quizzes?.[0]}
//               topicId={topic.id}
//               topicTitle={topic.title}
//               onComplete={handleQuizComplete}
//               isCompleted={completedSteps.has(LearningStep.QUIZ)}
//             />
//           )}

//           <NavigationButtons>
//             <div>
//               {currentStep > LearningStep.GRAMMAR && (
//                 <PrevButton onClick={handlePrevious}>← Previous</PrevButton>
//               )}
//             </div>
//             <ButtonGroup>
//               {currentStep < LearningStep.QUIZ && (
//                 <NextButton onClick={handleNext}>
//                   Next: {steps[currentStep + 1].title} →
//                 </NextButton>
//               )}
//               {currentStep === LearningStep.QUIZ && quizCompleted && (
//                 <>
//                   <NextButton onClick={() => router.push("/levels")}>
//                     Back to Levels
//                   </NextButton>
//                   {nextTopicId && (
//                     <SuccessButton
//                       onClick={() => {
//                         router.push(`/topics/${nextTopicId}`);
//                         router.refresh();
//                       }}
//                     >
//                       Next Topic →
//                     </SuccessButton>
//                   )}
//                 </>
//               )}
//             </ButtonGroup>
//           </NavigationButtons>
//         </ContentArea>
//       </Container>
//     </MainLayout>
//   );
// }
// src/app/topics/[topicId]/page.tsx
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

export default function TopicPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [topicTitle, setTopicTitle] = useState("");
  const [level, setLevel] = useState("A1");
  const [lesson, setLesson] = useState<GeneratedLesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  // Practice state
  const [practiceAnswers, setPracticeAnswers] = useState<
    Record<string, string>
  >({});
  const [practiceResults, setPracticeResults] = useState<
    Record<string, boolean>
  >({});

  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  useEffect(() => {
    const fetchTopicAndGenerateLesson = async () => {
      try {
        const topicId = params.topicId as string;
        const topicRes = await fetch(`/api/topics/${topicId}`);
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
        setLesson(lessonData);
      } catch (error) {
        console.error("Failed to generate lesson:", error);
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchTopicAndGenerateLesson();
    }
  }, [params.topicId, session]);

  const markStepCompleted = (step: number) => {
    if (!completedSteps.includes(step)) {
      setCompletedSteps([...completedSteps, step]);
    }
  };

  const handleNext = () => {
    markStepCompleted(currentStep);
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

  const submitQuiz = () => {
    if (!lesson) return;
    let correct = 0;
    lesson.quizQuestions.forEach((q, idx) => {
      const userAnswer = quizAnswers[`q${idx}`] || "";
      if (userAnswer.toLowerCase().trim() === q.correctAnswer.toLowerCase()) {
        correct++;
      }
    });
    const score = Math.round((correct / lesson.quizQuestions.length) * 100);
    setQuizScore(score);
    setQuizSubmitted(true);
    if (score >= 70) {
      markStepCompleted(3);
    }
  };

  const allPracticeCompleted =
    lesson &&
    Object.keys(practiceResults).length === lesson.practiceExercises.length &&
    Object.values(practiceResults).every((v) => v === true);

  if (loading || !lesson) {
    return (
      <MainLayout>
        <LoadingSpinner
          fullScreen
          message="✨ Generating your personalized lesson with AI... 🐻"
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
              <Button onClick={() => router.push("/levels")} variant="primary">
                Back to Levels
              </Button>
            </ResultsContainer>
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
