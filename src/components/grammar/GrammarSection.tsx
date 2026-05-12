// src/components/grammar/GrammarSection.tsx
"use client";

import { useState } from "react";
import styled from "styled-components";
import Button from "@/components/ui/Button";
import AIExplainButton from "../ai/AIExplainButton";

const Container = styled.div`
  animation: fadeIn 0.3s ease;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  color: ${(props) => props.theme.colors.text};
  margin-bottom: ${(props) => props.theme.spacing.lg};
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.sm};
`;

const GrammarCard = styled.div`
  margin-bottom: ${(props) => props.theme.spacing.xl};
`;

const GrammarTitle = styled.h3`
  font-size: 1.25rem;
  color: ${(props) => props.theme.colors.primary};
  margin-bottom: ${(props) => props.theme.spacing.md};
`;

const GrammarExplanation = styled.div`
  background: ${(props) => props.theme.colors.background};
  padding: ${(props) => props.theme.spacing.lg};
  border-radius: ${(props) => props.theme.borderRadius.md};
  margin-bottom: ${(props) => props.theme.spacing.lg};
  line-height: 1.6;

  p {
    margin-bottom: ${(props) => props.theme.spacing.md};
  }
`;

const RulesList = styled.ul`
  margin-left: ${(props) => props.theme.spacing.lg};
  margin-top: ${(props) => props.theme.spacing.md};

  li {
    margin-bottom: ${(props) => props.theme.spacing.sm};
    line-height: 1.5;
  }
`;

const MemoryAidCard = styled.div<{ $color: string }>`
  background: linear-gradient(
    135deg,
    ${(props) => props.$color}15 0%,
    ${(props) => props.$color}05 100%
  );
  border-left: 4px solid ${(props) => props.$color};
  padding: ${(props) => props.theme.spacing.lg};
  border-radius: ${(props) => props.theme.borderRadius.md};
  margin: ${(props) => props.theme.spacing.xl} 0;
`;

const MemoryTitle = styled.div`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.sm};
  font-weight: bold;
  margin-bottom: ${(props) => props.theme.spacing.md};
  font-size: 1.1rem;
`;

const MnemonicText = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  margin: ${(props) => props.theme.spacing.md} 0;
  padding: ${(props) => props.theme.spacing.md};
  background: white;
  border-radius: ${(props) => props.theme.borderRadius.md};
  text-align: center;
`;

const TipsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${(props) => props.theme.spacing.md};
  margin-top: ${(props) => props.theme.spacing.md};
`;

const TipItem = styled.div`
  background: white;
  padding: ${(props) => props.theme.spacing.sm};
  border-radius: ${(props) => props.theme.borderRadius.md};
  font-size: 0.875rem;
`;

const CompleteButton = styled(Button)`
  margin-top: ${(props) => props.theme.spacing.xl};
`;

interface GrammarSectionProps {
  grammarRules: Array<{
    id: string;
    title: string;
    explanation: string;
    rules: string;
    examples: Array<{ finnish: string; english: string; explanation?: string }>;
  }>;
  memoryAid: {
    mnemonic: string;
    explanation: string;
    quickTips: string;
    colorCode: string;
    icon: string;
  } | null;
  onComplete: () => void;
}

export default function GrammarSection({
  grammarRules,
  memoryAid,
  onComplete,
}: GrammarSectionProps) {
  const [completed, setCompleted] = useState(false);

  if (!grammarRules || grammarRules.length === 0) {
    return (
      <Container>
        <p>No grammar rules available for this topic yet.</p>
        <CompleteButton onClick={onComplete} variant="primary">
          Mark as Read & Continue
        </CompleteButton>
      </Container>
    );
  }

  const handleComplete = () => {
    setCompleted(true);
    onComplete();
  };

  return (
    <Container>
      <SectionTitle>
        <span>📖</span> Grammar Explanation
      </SectionTitle>

      {grammarRules.map((grammar) => {
        let rulesArray: string[] = [];
        try {
          rulesArray = JSON.parse(grammar.rules);
        } catch {
          rulesArray = [grammar.rules];
        }

        return (
          <GrammarCard key={grammar.id}>
            <GrammarTitle>{grammar.title}</GrammarTitle>
            <GrammarExplanation>
              <p>{grammar.explanation}</p>
              <RulesList>
                {rulesArray.map((rule: string, idx: number) => (
                  <li key={idx}>{rule}</li>
                ))}
              </RulesList>
            </GrammarExplanation>
            <AIExplainButton
              grammarRuleId={grammar.id}
              grammarTitle={grammar.title}
              grammarContent={grammar.explanation}
            />
          </GrammarCard>
        );
      })}

      {memoryAid && (
        <MemoryAidCard $color={memoryAid.colorCode || "#667eea"}>
          <MemoryTitle>
            <span>{memoryAid.icon || "🧠"}</span>
            <span>Quick Memory Aid</span>
          </MemoryTitle>
          <MnemonicText>📌 Remember: {memoryAid.mnemonic}</MnemonicText>
          <p>{memoryAid.explanation}</p>
          <TipsGrid>
            {(() => {
              try {
                const tips = JSON.parse(memoryAid.quickTips);
                return tips.map((tip: string, idx: number) => (
                  <TipItem key={idx}>💡 {tip}</TipItem>
                ));
              } catch {
                return <TipItem>💡 {memoryAid.quickTips}</TipItem>;
              }
            })()}
          </TipsGrid>
        </MemoryAidCard>
      )}

      {!completed && (
        <CompleteButton onClick={handleComplete} variant="primary" size="large">
          ✓ I&apos;ve understood the grammar
        </CompleteButton>
      )}
    </Container>
  );
}
