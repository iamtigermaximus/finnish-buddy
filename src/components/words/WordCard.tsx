// src/components/words/WordCard.tsx
"use client";

import styled from "styled-components";
// src/types/word.ts
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
  border-radius: 16px;
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

const FinnishWord = styled.div`
  font-size: 1.75rem;
  font-weight: bold;
  color: #667eea;
  margin-bottom: 0.25rem;
`;

const EnglishMeaning = styled.div`
  color: #1a1a2e;
  font-size: 1rem;
  margin-bottom: 0.75rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #e0e0e0;
`;

const PartOfSpeech = styled.span`
  display: inline-block;
  background: #f0f0f0;
  padding: 0.2rem 0.5rem;
  border-radius: 12px;
  font-size: 0.7rem;
  color: #666;
  margin-bottom: 0.75rem;
`;

const SectionTitle = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0.75rem 0 0.5rem;

  &:first-of-type {
    margin-top: 0;
  }
`;

const ConjugationGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
  background: #f5f7fa;
  padding: 0.75rem;
  border-radius: 12px;
`;

const ConjugationItem = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;

  .pronoun {
    color: #667eea;
    font-weight: 500;
  }

  .form {
    color: #1a1a2e;
  }
`;

const CasesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
  background: #f5f7fa;
  padding: 0.75rem;
  border-radius: 12px;
`;

const CaseItem = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;

  .case {
    color: #667eea;
    font-weight: 500;
  }

  .form {
    color: #1a1a2e;
  }
`;

const ComparisonRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f5f7fa;
  padding: 0.5rem 0.75rem;
  border-radius: 12px;
  margin-bottom: 0.5rem;

  .label {
    color: #667eea;
    font-weight: 500;
    font-size: 0.75rem;
  }

  .value {
    color: #1a1a2e;
    font-size: 0.875rem;
  }
`;

const ExampleBox = styled.div`
  background: #f0f7ff;
  padding: 0.75rem;
  border-radius: 12px;
  margin-top: 0.5rem;
`;

const ExampleFinnish = styled.div`
  font-size: 0.875rem;
  font-weight: 500;
  color: #667eea;
  margin-bottom: 0.25rem;
`;

const ExampleEnglish = styled.div`
  font-size: 0.75rem;
  color: #666;
`;

const CommonPhrase = styled.div`
  background: #fff9e6;
  padding: 0.5rem 0.75rem;
  border-radius: 12px;
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: #8b6914;
`;

interface WordCardProps {
  word: Word;
}

export default function WordCard({ word }: WordCardProps) {
  const renderContent = () => {
    // For verbs - show conjugation
    if (word.partOfSpeech === "verb" && word.conjugation) {
      return (
        <>
          <SectionTitle>🔤 Conjugation</SectionTitle>
          <ConjugationGrid>
            <ConjugationItem>
              <span className="pronoun">minä</span>
              <span className="form">{word.conjugation.minä}</span>
            </ConjugationItem>
            <ConjugationItem>
              <span className="pronoun">me</span>
              <span className="form">{word.conjugation.me}</span>
            </ConjugationItem>
            <ConjugationItem>
              <span className="pronoun">sinä</span>
              <span className="form">{word.conjugation.sinä}</span>
            </ConjugationItem>
            <ConjugationItem>
              <span className="pronoun">te</span>
              <span className="form">{word.conjugation.te}</span>
            </ConjugationItem>
            <ConjugationItem>
              <span className="pronoun">hän</span>
              <span className="form">{word.conjugation.hän}</span>
            </ConjugationItem>
            <ConjugationItem>
              <span className="pronoun">he</span>
              <span className="form">{word.conjugation.he}</span>
            </ConjugationItem>
          </ConjugationGrid>
        </>
      );
    }

    // For nouns - show cases
    if (word.partOfSpeech === "noun" && word.cases) {
      return (
        <>
          <SectionTitle>📦 Case Forms</SectionTitle>
          <CasesGrid>
            <CaseItem>
              <span className="case">Nominative</span>
              <span className="form">{word.cases.nominative}</span>
            </CaseItem>
            <CaseItem>
              <span className="case">Genitive</span>
              <span className="form">{word.cases.genitive}</span>
            </CaseItem>
            <CaseItem>
              <span className="case">Partitive</span>
              <span className="form">{word.cases.partitive}</span>
            </CaseItem>
            <CaseItem>
              <span className="case">Inessive</span>
              <span className="form">{word.cases.inessive}</span>
            </CaseItem>
            <CaseItem>
              <span className="case">Elative</span>
              <span className="form">{word.cases.elative}</span>
            </CaseItem>
            <CaseItem>
              <span className="case">Illative</span>
              <span className="form">{word.cases.illative}</span>
            </CaseItem>
          </CasesGrid>
        </>
      );
    }

    // For adjectives - show comparisons
    if (word.partOfSpeech === "adjective") {
      return (
        <>
          <SectionTitle>📊 Forms</SectionTitle>
          <ComparisonRow>
            <span className="label">Positive</span>
            <span className="value">{word.finnish}</span>
          </ComparisonRow>
          {word.comparative && (
            <ComparisonRow>
              <span className="label">Comparative</span>
              <span className="value">{word.comparative}</span>
            </ComparisonRow>
          )}
          {word.superlative && (
            <ComparisonRow>
              <span className="label">Superlative</span>
              <span className="value">{word.superlative}</span>
            </ComparisonRow>
          )}
          {word.opposite && (
            <ComparisonRow>
              <span className="label">Opposite</span>
              <span className="value">{word.opposite}</span>
            </ComparisonRow>
          )}
        </>
      );
    }

    // For others - show examples
    return (
      <>
        {word.exampleSentence && (
          <ExampleBox>
            <ExampleFinnish>📖 {word.exampleSentence}</ExampleFinnish>
            <ExampleEnglish>{word.exampleTranslation}</ExampleEnglish>
          </ExampleBox>
        )}
        {word.commonPhrase && (
          <CommonPhrase>💬 {word.commonPhrase}</CommonPhrase>
        )}
      </>
    );
  };

  return (
    <Card>
      <FinnishWord>{word.finnish}</FinnishWord>
      <EnglishMeaning>{word.english}</EnglishMeaning>
      <PartOfSpeech>{word.partOfSpeech}</PartOfSpeech>
      {renderContent()}
    </Card>
  );
}
