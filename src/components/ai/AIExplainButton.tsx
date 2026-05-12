// src/components/ai/AIExplainButton.tsx
"use client";

import { useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  margin-top: 1rem;
`;

const AskButton = styled.button`
  background: linear-gradient(135deg, #8b6914 0%, #a0822a 100%);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  cursor: pointer;
  font-size: 0.875rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;

  &:hover {
    transform: scale(1.02);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const InputContainer = styled.div`
  margin-top: 0.5rem;
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const QuestionInput = styled.input`
  flex: 1;
  min-width: 200px;
  padding: 0.5rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 0.875rem;

  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const SendButton = styled.button`
  background: #667eea;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background: #5a67d8;
  }
`;

const CancelButton = styled.button`
  background: #e0e0e0;
  color: #1a1a2e;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background: #d0d0d0;
  }
`;

const ExplanationBox = styled.div`
  background: linear-gradient(135deg, #fff9e6 0%, #fff3d4 100%);
  border-left: 4px solid #8b6914;
  padding: 1rem;
  margin-top: 1rem;
  border-radius: 8px;
  font-size: 0.95rem;
  line-height: 1.6;
  animation: fadeIn 0.3s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid white;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

interface AIExplainButtonProps {
  grammarRuleId: string;
  grammarTitle: string;
  grammarContent: string;
}

export default function AIExplainButton({
  grammarRuleId,
  grammarTitle,
  grammarContent,
}: AIExplainButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [userQuestion, setUserQuestion] = useState("");
  const [showInput, setShowInput] = useState(false);

  const handleAskQuestion = async () => {
    if (!userQuestion.trim()) return;

    setIsLoading(true);
    setExplanation(null);

    try {
      const response = await fetch("/api/ai/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          grammarRuleId,
          question: userQuestion,
        }),
      });

      const data = await response.json();
      setExplanation(data.explanation);
      setUserQuestion("");
    } catch (error) {
      setExplanation(
        "🐻 Sorry, I could not generate an explanation. Please try again or ask a different question!",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      {!showInput ? (
        <AskButton onClick={() => setShowInput(true)}>
          🐻 Ask Otso for Help
        </AskButton>
      ) : (
        <>
          <InputContainer>
            <QuestionInput
              type="text"
              value={userQuestion}
              onChange={(e) => setUserQuestion(e.target.value)}
              placeholder={`Ask about "${grammarTitle}"...`}
              onKeyDown={(e) => e.key === "Enter" && handleAskQuestion()}
              autoFocus
            />
            <SendButton onClick={handleAskQuestion} disabled={isLoading}>
              {isLoading ? <LoadingSpinner /> : "Ask 🐻"}
            </SendButton>
            <CancelButton
              onClick={() => {
                setShowInput(false);
                setUserQuestion("");
                setExplanation(null);
              }}
            >
              Cancel
            </CancelButton>
          </InputContainer>

          {explanation && (
            <ExplanationBox>
              <strong>🐻 Otso says:</strong>
              <div style={{ marginTop: "0.5rem", whiteSpace: "pre-wrap" }}>
                {explanation}
              </div>
            </ExplanationBox>
          )}
        </>
      )}
    </Container>
  );
}
