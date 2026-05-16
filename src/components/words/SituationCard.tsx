// src/components/words/SituationCard.tsx
"use client";

import { useState } from "react";
import styled from "styled-components";
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

const Card = styled.div`
  background: linear-gradient(135deg, #fff 0%, #f8f9fa 100%);
  border-radius: 20px;
  padding: 1.25rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.2s;
  border: 1px solid #e0e0e0;
  height: 100%;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
    border-color: #667eea;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #667eea20;
`;

const Icon = styled.div`
  font-size: 2rem;
`;

const TitleArea = styled.div`
  flex: 1;
`;

const Title = styled.div`
  font-size: 1.25rem;
  font-weight: bold;
  color: #1a1a2e;
`;

const Description = styled.div`
  font-size: 0.75rem;
  color: #666;
`;

const ConversationContainer = styled.div`
  background: #f5f7fa;
  border-radius: 16px;
  padding: 0.75rem;
  margin: 0.75rem 0;
`;

const ConversationLine = styled.div<{ $isUser: boolean }>`
  padding: 0.5rem;
  margin: 0.25rem 0;
  background: ${(props) => (props.$isUser ? "#667eea10" : "transparent")};
  border-radius: 8px;
`;

const Speaker = styled.span`
  font-weight: bold;
  color: #667eea;
  font-size: 0.75rem;
  display: inline-block;
  width: 70px;
`;

const Finnish = styled.span`
  font-size: 0.875rem;
  color: #1a1a2e;
  margin-left: 0.5rem;
`;

const English = styled.div`
  font-size: 0.7rem;
  color: #666;
  margin-top: 0.2rem;
  margin-left: 70px;
`;

const KeyPhrases = styled.div`
  margin: 0.75rem 0;
  padding: 0.5rem;
  background: #fff9e6;
  border-radius: 12px;
`;

const KeyPhraseTitle = styled.div`
  font-size: 0.7rem;
  font-weight: bold;
  color: #8b6914;
  margin-bottom: 0.5rem;
`;

const KeyPhrase = styled.span`
  display: inline-block;
  background: white;
  padding: 0.25rem 0.5rem;
  border-radius: 16px;
  font-size: 0.7rem;
  margin: 0.2rem;
  color: #8b6914;
`;

const Tips = styled.div`
  font-size: 0.75rem;
  color: #48bb78;
  margin-top: 0.75rem;
  padding-top: 0.5rem;
  border-top: 1px solid #e0e0e0;
`;

const ToggleButton = styled.button`
  background: none;
  border: none;
  color: #667eea;
  cursor: pointer;
  font-size: 0.75rem;
  margin-top: 0.5rem;
  text-decoration: underline;
`;

interface SituationCardProps {
  situation: Situation;
}

export default function SituationCard({ situation }: SituationCardProps) {
  const [expanded, setExpanded] = useState(false);
  const visibleLines = expanded
    ? situation.conversation
    : situation.conversation.slice(0, 3);

  return (
    <Card>
      <Header>
        <Icon>{situation.icon}</Icon>
        <TitleArea>
          <Title>{situation.title}</Title>
          <Description>{situation.description}</Description>
        </TitleArea>
      </Header>

      <ConversationContainer>
        {visibleLines.map((line, idx) => (
          <ConversationLine
            key={idx}
            $isUser={line.speaker === "You" || line.speaker === "Customer"}
          >
            <Speaker>{line.speaker}:</Speaker>
            <Finnish>{line.finnish}</Finnish>
            <English>{line.english}</English>
          </ConversationLine>
        ))}
      </ConversationContainer>

      {situation.conversation.length > 3 && (
        <ToggleButton onClick={() => setExpanded(!expanded)}>
          {expanded
            ? "Show less ↑"
            : `Show ${situation.conversation.length - 3} more lines ↓`}
        </ToggleButton>
      )}

      <KeyPhrases>
        <KeyPhraseTitle>🔑 Key Phrases</KeyPhraseTitle>
        {situation.keyPhrases.map((phrase, idx) => (
          <KeyPhrase key={idx}>{phrase}</KeyPhrase>
        ))}
      </KeyPhrases>

      <Tips>💡 {situation.tips}</Tips>
    </Card>
  );
}
