// src/app/learn-words/page.tsx
"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import MainLayout from "@/components/layout/MainLayout";
import Container from "@/components/layout/Container";
import Button from "@/components/ui/Button";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import WordCard from "@/components/words/WordCard";
import SituationCard from "@/components/words/SituationCard";

const PageHeader = styled.div`
  text-align: center;
  padding: 2rem 0 1rem;
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  color: #1a1a2e;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const PageDescription = styled.p`
  color: #666;
  font-size: 1rem;
  max-width: 600px;
  margin: 0 auto;
`;

const TabContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin: 2rem 0;
`;

const Tab = styled.button<{ $active: boolean }>`
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  background: ${(props) => (props.$active ? "#667eea" : "#f0f0f0")};
  color: ${(props) => (props.$active ? "white" : "#666")};

  &:hover {
    background: ${(props) => (props.$active ? "#5a67d8" : "#e0e0e0")};
  }
`;

const ControlsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  align-items: center;
  margin: 1rem 0 2rem;
`;

const LevelSelect = styled.select`
  padding: 0.5rem 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  background: white;
  cursor: pointer;
`;

const CountSelect = styled.select`
  padding: 0.5rem 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  background: white;
  cursor: pointer;
`;

const GenerateButton = styled(Button)`
  min-width: 200px;
`;

const WordsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
`;

const SituationsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(450px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
`;

const OtsoMessage = styled.div`
  background: linear-gradient(135deg, #8b6914 0%, #a0822a 100%);
  border-radius: 20px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  color: white;
  display: flex;
  align-items: center;
  gap: 1rem;

  .bear-icon {
    font-size: 3rem;
  }

  p {
    flex: 1;
    line-height: 1.5;
  }

  @media (max-width: 640px) {
    flex-direction: column;
    text-align: center;
  }
`;

const LoadingContainer = styled.div`
  text-align: center;
  padding: 3rem;
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #666;

  .icon {
    font-size: 4rem;
    margin-bottom: 1rem;
  }
`;
export interface Conjugation {
  minä: string;
  sinä: string;
  hän: string;
  me: string;
  te: string;
  he: string;
}

export interface Cases {
  nominative: string;
  genitive: string;
  partitive: string;
  inessive: string;
  elative: string;
  illative: string;
}

export interface ConversationLine {
  speaker: string;
  finnish: string;
  english: string;
}

export interface Situation {
  title: string;
  description: string;
  icon: string;
  conversation: ConversationLine[];
  keyPhrases: string[];
  tips: string;
}

export interface Word {
  finnish: string;
  english: string;
  level: string;
  partOfSpeech: string;

  // For verbs
  conjugation?: Conjugation;

  // For nouns
  cases?: Cases;

  // For adjectives
  comparative?: string;
  superlative?: string;
  opposite?: string;

  // For others
  exampleSentence?: string;
  exampleTranslation?: string;
  commonPhrase?: string;

  // For situations
  situation?: Situation;
}
export default function LearnWordsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"words" | "situations">("words");
  const [words, setWords] = useState<Word[]>([]);
  const [situations, setSituations] = useState<Situation[]>([]);
  const [loading, setLoading] = useState(false);
  const [level, setLevel] = useState("A1");
  const [count, setCount] = useState(8);

  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  const generateContent = async () => {
    setLoading(true);
    try {
      if (activeTab === "words") {
        const response = await fetch("/api/ai/learn-words", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ level, count }),
        });
        const data = await response.json();
        setWords(data.words || []);
      } else {
        const response = await fetch("/api/ai/generate-situations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ level, count: 4 }),
        });
        const data = await response.json();
        setSituations(data.situations || []);
      }
    } catch (error) {
      console.error("Failed to generate content:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <Container>
        <PageHeader>
          <PageTitle>Learn Words</PageTitle>
          <PageDescription>
            Discover Finnish vocabulary and practice real-life conversations
          </PageDescription>
        </PageHeader>

        <OtsoMessage>
          <div className="bear-icon">🐻</div>
          <p>
            Hei ystävä! Choose what you want to practice today: 📖 Vocabulary
            words with grammar info, or 💬 real-life situations. Click the
            button to get started! 🎯
          </p>
        </OtsoMessage>

        <TabContainer>
          <Tab
            $active={activeTab === "words"}
            onClick={() => setActiveTab("words")}
          >
            Vocabulary
          </Tab>
          <Tab
            $active={activeTab === "situations"}
            onClick={() => setActiveTab("situations")}
          >
            Situations
          </Tab>
        </TabContainer>

        <ControlsContainer>
          <LevelSelect value={level} onChange={(e) => setLevel(e.target.value)}>
            <option value="A1">A1 - Beginner</option>
            <option value="A2">A2 - Elementary</option>
            <option value="B1">B1 - Intermediate</option>
            <option value="B2">B2 - Upper Intermediate</option>
            <option value="C1">C1 - Advanced</option>
            <option value="C2">C2 - Proficient</option>
          </LevelSelect>

          {activeTab === "words" && (
            <CountSelect
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
            >
              <option value={5}>5 words</option>
              <option value={8}>8 words</option>
              <option value={10}>10 words</option>
              <option value={15}>15 words</option>
            </CountSelect>
          )}

          <GenerateButton
            onClick={generateContent}
            disabled={loading}
            variant="primary"
          >
            {loading
              ? " Loading..."
              : `Get ${activeTab === "words" ? "Words" : "Situations"}`}
          </GenerateButton>
        </ControlsContainer>

        {loading ? (
          <LoadingContainer>
            <LoadingSpinner
              message={`🐻 Otso is finding ${activeTab === "words" ? "words" : "situations"} for you...`}
            />
          </LoadingContainer>
        ) : activeTab === "words" && words.length > 0 ? (
          <>
            <WordsGrid>
              {words.map((word, idx) => (
                <WordCard key={idx} word={word} />
              ))}
            </WordsGrid>
            <div style={{ textAlign: "center", marginTop: "1rem" }}>
              <Button onClick={generateContent} variant="secondary">
                Get More Words
              </Button>
            </div>
          </>
        ) : activeTab === "situations" && situations.length > 0 ? (
          <>
            <SituationsGrid>
              {situations.map((situation, idx) => (
                <SituationCard key={idx} situation={situation} />
              ))}
            </SituationsGrid>
            <div style={{ textAlign: "center", marginTop: "1rem" }}>
              <Button onClick={generateContent} variant="secondary">
                Get More Situations
              </Button>
            </div>
          </>
        ) : (
          <EmptyState>
            <div className="icon">🐻</div>
            <p>Click the button above to start learning!</p>
          </EmptyState>
        )}
      </Container>
    </MainLayout>
  );
}
