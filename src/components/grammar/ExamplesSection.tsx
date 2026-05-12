// src/components/grammar/ExamplesSection.tsx
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

const ExamplesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const ExampleCard = styled.div`
  background: #f5f7fa;
  border-radius: 8px;
  padding: 1.5rem;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }
`;

const FinnishText = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  color: #667eea;
  margin-bottom: 0.5rem;
`;

const EnglishText = styled.div`
  color: #666;
  margin-bottom: 0.5rem;
`;

const ExplanationText = styled.div`
  font-size: 0.875rem;
  color: #48bb78;
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid #e0e0e0;
`;

const VocabularySection = styled.div`
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 2px solid #e0e0e0;
`;

const VocabularyTitle = styled.h3`
  font-size: 1.25rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const VocabularyGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
`;

const VocabularyCard = styled.div`
  background: #667eea10;
  border-radius: 8px;
  padding: 1rem;
`;

const WordFinnish = styled.div`
  font-size: 1.1rem;
  font-weight: bold;
  color: #667eea;
`;

const WordEnglish = styled.div`
  color: #666;
  font-size: 0.875rem;
`;

const MemoryTip = styled.div`
  font-size: 0.75rem;
  color: #ed8936;
  margin-top: 0.25rem;
  font-style: italic;
`;

const CompleteButton = styled(Button)`
  margin-top: 2rem;
`;

// Define types for examples
interface Example {
  finnish: string;
  english: string;
  explanation?: string;
}

interface GrammarRule {
  examples: Example[];
}

interface VocabularyWord {
  finnish: string;
  english: string;
  memoryTip: string | null;
  exampleSentence: string | null;
}

interface ExamplesSectionProps {
  examples: Example[];
  grammarRules: GrammarRule[];
  vocabulary: VocabularyWord[];
  onComplete: () => void;
}

export default function ExamplesSection({
  examples,
  grammarRules,
  vocabulary,
  onComplete,
}: ExamplesSectionProps) {
  const [completed, setCompleted] = useState(false);

  // Combine examples from props and grammar rules
  const grammarExamples = grammarRules.flatMap((g) => g.examples || []);
  const allExamples = [...examples, ...grammarExamples].filter(
    (v, i, a) => a.findIndex((t) => t.finnish === v.finnish) === i,
  );

  const handleComplete = () => {
    setCompleted(true);
    onComplete();
  };

  return (
    <Container>
      <SectionTitle>
        <span>💡</span> Examples in Context
      </SectionTitle>

      <ExamplesGrid>
        {allExamples.map((example, idx) => (
          <ExampleCard key={idx}>
            <FinnishText>🇫🇮 {example.finnish}</FinnishText>
            <EnglishText>🇬🇧 {example.english}</EnglishText>
            {example.explanation && (
              <ExplanationText>📝 {example.explanation}</ExplanationText>
            )}
          </ExampleCard>
        ))}
      </ExamplesGrid>

      {vocabulary && vocabulary.length > 0 && (
        <VocabularySection>
          <VocabularyTitle>
            <span>📚</span> Vocabulary from this Lesson
          </VocabularyTitle>
          <VocabularyGrid>
            {vocabulary.map((word, idx) => (
              <VocabularyCard key={idx}>
                <WordFinnish>{word.finnish}</WordFinnish>
                <WordEnglish>{word.english}</WordEnglish>
                {word.memoryTip && <MemoryTip>💡 {word.memoryTip}</MemoryTip>}
              </VocabularyCard>
            ))}
          </VocabularyGrid>
        </VocabularySection>
      )}

      {!completed && (
        <CompleteButton onClick={handleComplete} variant="primary" size="large">
          ✓ I&apos;ve reviewed the examples
        </CompleteButton>
      )}
    </Container>
  );
}
