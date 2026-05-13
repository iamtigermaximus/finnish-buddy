// src/app/page.tsx
"use client";

import styled from "styled-components";
import MainLayout from "@/components/layout/MainLayout";
import Container from "@/components/layout/Container";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { useSession } from "next-auth/react";

const HeroSection = styled.section`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4rem 0;
  text-align: center;
`;

const HeroTitle = styled.h1`
  font-size: 3.5rem;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }

  @media (max-width: 480px) {
    font-size: 2rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.25rem;
  margin-bottom: 2rem;
  opacity: 0.95;

  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

const BearCharacter = styled.div`
  font-size: 5rem;
  margin-bottom: 1rem;
  animation: bounce 2s ease infinite;

  @keyframes bounce {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }

  @media (max-width: 480px) {
    font-size: 3.5rem;
  }
`;

const FeaturesSection = styled.section`
  padding: 4rem 0;
  background: #f5f7fa;
`;

const SectionTitle = styled.h2`
  text-align: center;
  font-size: 2rem;
  margin-bottom: 2rem;
  color: #1a1a2e;

  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
`;

const FeatureCard = styled(Card)`
  text-align: center;

  .icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  h3 {
    margin-bottom: 0.5rem;
  }

  p {
    color: #666;
    line-height: 1.6;
  }
`;

const LevelsSection = styled.section`
  padding: 4rem 0;
`;

const LevelsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const LevelCardWrapper = styled(Card)<{ $color: string }>`
  border-left: 4px solid ${(props) => props.$color};

  .level-name {
    font-size: 1.5rem;
    font-weight: bold;
    color: ${(props) => props.$color};
    margin-bottom: 0.25rem;
  }

  .level-desc {
    color: #666;
    margin-bottom: 1rem;
    font-size: 0.875rem;
  }
`;

const CTASection = styled.section`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4rem 0;
  text-align: center;
`;

const CTATitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 1rem;
`;

const CTASubtitle = styled.p`
  margin-bottom: 2rem;
  opacity: 0.95;
`;

export default function HomePage() {
  const { data: session } = useSession();

  const levels = [
    {
      name: "A1",
      title: "Beginner",
      description: "Survive simple daily situations",
      color: "#48bb78",
    },
    {
      name: "A2",
      title: "Elementary",
      description: "Simple descriptions and routines",
      color: "#4299e1",
    },
    {
      name: "B1",
      title: "Intermediate",
      description: "Handle everyday situations",
      color: "#ed8936",
    },
    {
      name: "B2",
      title: "Upper Intermediate",
      description: "Nuance and fluency",
      color: "#9f7aea",
    },
    {
      name: "C1",
      title: "Advanced",
      description: "Precise expression",
      color: "#f56565",
    },
    {
      name: "C2",
      title: "Proficient",
      description: "Mastery of the language",
      color: "#ed64a6",
    },
  ];

  const features = [
    {
      icon: "📚",
      title: "6 CEFR Levels",
      description: "From complete beginner to mastery",
    },
    {
      icon: "🤖",
      title: "AI-Powered Learning",
      description: "Personalized explanations and help",
    },
    {
      icon: "🎯",
      title: "Interactive Quizzes",
      description: "Test your knowledge instantly",
    },
    {
      icon: "💡",
      title: "Memory Tricks",
      description: "Learn with UNO and other mnemonics",
    },
    {
      icon: "🐻",
      title: "Friendly Mascot",
      description: "Learn with Otso the bear",
    },
    {
      icon: "📱",
      title: "Responsive Design",
      description: "Learn anywhere, any device",
    },
  ];

  return (
    <MainLayout>
      <HeroSection>
        <Container>
          <BearCharacter>🐻</BearCharacter>
          <HeroTitle>Learn Finnish with a Friend</HeroTitle>
          <HeroSubtitle>
            Master Finnish from A1 to C2 with AI-powered lessons, interactive
            quizzes,
            <br />
            and your friendly bear buddy, Otso!
          </HeroSubtitle>
          {/* Hero button changes based on login status */}
          <Button href={session ? "/levels" : "/register"} size="large">
            {session ? "Continue Learning 🐻" : "Start Learning Free 🐻"}
          </Button>
        </Container>
      </HeroSection>

      <FeaturesSection>
        <Container>
          <SectionTitle>Why Learn with Finnish Buddy?</SectionTitle>
          <FeaturesGrid>
            {features.map((feature, index) => (
              <FeatureCard key={index} variant="bear">
                <div className="icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </FeatureCard>
            ))}
          </FeaturesGrid>
        </Container>
      </FeaturesSection>

      <LevelsSection>
        <Container>
          <SectionTitle>Choose Your Level</SectionTitle>
          <LevelsGrid>
            {levels.map((level) => (
              <LevelCardWrapper key={level.name} $color={level.color}>
                <div className="level-name">{level.name}</div>
                <div className="level-desc">{level.description}</div>
                {/* Level buttons change based on login status */}
                <Button
                  href={session ? `/levels?level=${level.name}` : "/register"}
                  variant="secondary"
                  size="small"
                >
                  {session
                    ? `Continue ${level.name} →`
                    : `Start ${level.name} →`}
                </Button>
              </LevelCardWrapper>
            ))}
          </LevelsGrid>
        </Container>
      </LevelsSection>

      <CTASection>
        <Container>
          <CTATitle>Ready to Start Your Finnish Journey?</CTATitle>
          <CTASubtitle>
            Join thousands of happy learners mastering Finnish with Otso the
            bear!
          </CTASubtitle>
          {/* CTA button changes based on login status */}
          <Button
            href={session ? "/levels" : "/register"}
            variant="secondary"
            size="large"
          >
            {session ? "Go to Dashboard 🐻" : "Create Free Account 🐻"}
          </Button>
        </Container>
      </CTASection>
    </MainLayout>
  );
}
