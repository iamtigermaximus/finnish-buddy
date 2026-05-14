// src/components/word-of-the-day/WordOfTheDay.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { useSession } from "next-auth/react";

interface WordData {
  word: string;
  meaning: string;
  explanation: string;
  exampleFinnish: string;
  exampleEnglish: string;
  memoryTip: string;
  funFact: string;
  timeOfDay: string;
  timeSlot: string;
  timeSlotEmoji: string;
  greeting: string;
}

const Container = styled.div<{ $isDismissed: boolean }>`
  background: linear-gradient(135deg, #8b6914 0%, #a0822a 100%);
  border-radius: 20px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  color: white;
  position: relative;
  overflow: hidden;
  display: ${(props) => (props.$isDismissed ? "none" : "block")};

  &::before {
    content: "🐻";
    position: absolute;
    bottom: -20px;
    right: -20px;
    font-size: 100px;
    opacity: 0.1;
    pointer-events: none;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  font-size: 1.25rem;
  cursor: pointer;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  z-index: 10;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.05);
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  padding-right: 2rem;
`;

const BearIcon = styled.div`
  font-size: 2.5rem;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Title = styled.div`
  font-size: 0.9rem;
  opacity: 0.9;
  letter-spacing: 1px;
`;

const TimeSlotBadge = styled.span`
  background: rgba(255, 255, 255, 0.2);
  padding: 0.25rem 0.75rem;
  border-radius: 50px;
  font-size: 0.7rem;
  margin-left: 0.5rem;
`;

const Greeting = styled.div`
  font-size: 1rem;
  margin-bottom: 0.5rem;
  opacity: 0.9;
`;

const WordCard = styled.div`
  background: rgba(255, 255, 255, 0.15);
  border-radius: 16px;
  padding: 1.25rem;
  backdrop-filter: blur(10px);
`;

const FinnishWord = styled.div`
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 0.25rem;

  @media (max-width: 640px) {
    font-size: 2rem;
  }
`;

const Meaning = styled.div`
  font-size: 1.1rem;
  opacity: 0.9;
  margin-bottom: 1rem;
`;

const Explanation = styled.p`
  font-size: 0.95rem;
  line-height: 1.5;
  margin-bottom: 1rem;
  opacity: 0.95;
`;

const ExampleBox = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1rem;
  margin: 1rem 0;
`;

const ExampleFinnish = styled.div`
  font-weight: bold;
  margin-bottom: 0.25rem;
  font-size: 1rem;
`;

const ExampleEnglish = styled.div`
  font-size: 0.85rem;
  opacity: 0.8;
`;

const MemoryTip = styled.div`
  background: rgba(255, 215, 0, 0.2);
  border-left: 3px solid #ffd700;
  padding: 0.75rem;
  margin: 1rem 0 0.5rem;
  border-radius: 8px;
  font-size: 0.85rem;
`;

const FunFact = styled.div`
  font-size: 0.8rem;
  opacity: 0.7;
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
`;

const LoadingContainer = styled.div`
  background: linear-gradient(135deg, #8b6914 0%, #a0822a 100%);
  border-radius: 20px;
  padding: 1.5rem;
  text-align: center;
  color: white;
  min-height: 280px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LoadingSpinner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;

  .bear {
    font-size: 2.5rem;
    animation: bounce 1s ease infinite;
  }

  @keyframes bounce {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-5px);
    }
  }
`;

export default function WordOfTheDay() {
  const { data: session } = useSession();
  const [word, setWord] = useState<WordData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isDismissed, setIsDismissed] = useState<boolean>(false);
  const [currentTimeSlot, setCurrentTimeSlot] = useState<string>("morning");

  // Get current time slot - run once on mount
  useEffect(() => {
    const hour = new Date().getHours();
    let slot = "morning";
    if (hour >= 12 && hour < 18) slot = "afternoon";
    else if (hour >= 18) slot = "evening";
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentTimeSlot(slot);
  }, []);

  // Check localStorage for dismissal - run when time slot changes
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const dismissed = localStorage.getItem(
      `wotd_dismissed_${today}_${currentTimeSlot}`,
    );
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsDismissed(dismissed === "true");
  }, [currentTimeSlot]);

  const fetchWordOfTheDay = useCallback(async () => {
    if (!session) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/ai/word-of-the-day");
      const data = await response.json();
      setWord(data);
    } catch (error) {
      console.error("Failed to fetch word of the day:", error);
      // Fallback word
      const fallbackWord: WordData = {
        word:
          currentTimeSlot === "morning"
            ? "aamiainen"
            : currentTimeSlot === "afternoon"
              ? "lounas"
              : "telkkari",
        meaning:
          currentTimeSlot === "morning"
            ? "breakfast"
            : currentTimeSlot === "afternoon"
              ? "lunch"
              : "television / TV",
        explanation: "A useful Finnish word for daily conversation.",
        exampleFinnish:
          currentTimeSlot === "morning"
            ? "Mitä söit aamiaiseksi?"
            : currentTimeSlot === "afternoon"
              ? "Lähdetäänkö lounaalle?"
              : "Mitä telkkarista tulee illalla?",
        exampleEnglish:
          currentTimeSlot === "morning"
            ? "What did you have for breakfast?"
            : currentTimeSlot === "afternoon"
              ? "Shall we go for lunch?"
              : "What's on TV tonight?",
        memoryTip: "Practice this word today! 🐻",
        funFact: "Learning one word a day helps you build vocabulary quickly!",
        timeOfDay: currentTimeSlot,
        timeSlot: currentTimeSlot,
        timeSlotEmoji:
          currentTimeSlot === "morning"
            ? "🌅"
            : currentTimeSlot === "afternoon"
              ? "☀️"
              : "🌙",
        greeting:
          currentTimeSlot === "morning"
            ? "Good morning!"
            : currentTimeSlot === "afternoon"
              ? "Good afternoon!"
              : "Good evening!",
      };
      setWord(fallbackWord);
    } finally {
      setLoading(false);
    }
  }, [session, currentTimeSlot]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchWordOfTheDay();
  }, [fetchWordOfTheDay]);

  const handleDismiss = () => {
    const today = new Date().toISOString().split("T")[0];
    localStorage.setItem(`wotd_dismissed_${today}_${currentTimeSlot}`, "true");
    setIsDismissed(true);
  };

  if (!session) {
    return null;
  }

  if (loading) {
    return (
      <LoadingContainer>
        <LoadingSpinner>
          <div className="bear">🐻</div>
          <div>Otso is finding today&apos;s word...</div>
        </LoadingSpinner>
      </LoadingContainer>
    );
  }

  if (!word || isDismissed) {
    return null;
  }

  return (
    <Container $isDismissed={isDismissed}>
      <CloseButton onClick={handleDismiss}>✕</CloseButton>

      <Header>
        <BearIcon>🐻</BearIcon>
        <Title>
          WORD OF THE DAY
          <TimeSlotBadge>
            {word.timeSlotEmoji} {word.timeSlot}
          </TimeSlotBadge>
        </Title>
      </Header>

      <Greeting>{word.greeting}</Greeting>

      <WordCard>
        <FinnishWord>{word.word}</FinnishWord>
        <Meaning>{word.meaning}</Meaning>

        <Explanation>{word.explanation}</Explanation>

        <ExampleBox>
          <ExampleFinnish>📖 {word.exampleFinnish}</ExampleFinnish>
          <ExampleEnglish>{word.exampleEnglish}</ExampleEnglish>
        </ExampleBox>

        <MemoryTip>💡 {word.memoryTip}</MemoryTip>

        <FunFact>🌟 {word.funFact}</FunFact>
      </WordCard>
    </Container>
  );
}
