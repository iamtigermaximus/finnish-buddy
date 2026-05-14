// src/app/about/page.tsx
"use client";

import styled from "styled-components";
import MainLayout from "@/components/layout/MainLayout";
import Container from "@/components/layout/Container";
import Button from "@/components/ui/Button";

const PageHeader = styled.div`
  text-align: center;
  padding: 3rem 0 2rem;
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  color: #1a1a2e;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  @media (max-width: 768px) {
    font-size: 1.75rem;
  }
`;

const PageDescription = styled.p`
  color: #666;
  font-size: 1rem;
  max-width: 600px;
  margin: 0 auto;
`;

const AboutSection = styled.div`
  background: white;
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  color: #667eea;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SectionText = styled.p`
  color: #444;
  line-height: 1.6;
  margin-bottom: 1rem;
`;

const OtsoCard = styled.div`
  background: linear-gradient(135deg, #8b6914 0%, #a0822a 100%);
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
  color: white;
  display: flex;
  align-items: center;
  gap: 2rem;
  flex-wrap: wrap;

  .bear-icon {
    font-size: 5rem;
  }

  .content {
    flex: 1;
  }

  h3 {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }

  p {
    opacity: 0.9;
    line-height: 1.6;
  }

  @media (max-width: 640px) {
    text-align: center;
    justify-content: center;

    .bear-icon {
      font-size: 4rem;
    }
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
`;

const StatCard = styled.div`
  text-align: center;
  padding: 1.5rem;
  background: #f5f7fa;
  border-radius: 16px;

  .number {
    font-size: 2.5rem;
    font-weight: bold;
    color: #667eea;
  }

  .label {
    color: #666;
    margin-top: 0.5rem;
  }
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;

  li {
    padding: 0.5rem 0;
    display: flex;
    align-items: center;
    gap: 0.75rem;

    .check {
      color: #48bb78;
      font-weight: bold;
    }
  }
`;

const TeamGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
`;

const TeamCard = styled.div`
  text-align: center;
  padding: 1.5rem;
  background: #f5f7fa;
  border-radius: 16px;

  .avatar {
    font-size: 3rem;
    margin-bottom: 0.5rem;
  }

  .name {
    font-weight: bold;
    font-size: 1.1rem;
    margin-bottom: 0.25rem;
  }

  .role {
    color: #667eea;
    font-size: 0.875rem;
    margin-bottom: 0.5rem;
  }

  .bio {
    color: #666;
    font-size: 0.875rem;
    line-height: 1.5;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
  flex-wrap: wrap;
`;

export default function AboutPage() {
  return (
    <MainLayout>
      <Container>
        <PageHeader>
          <PageTitle>About Finnish Buddy</PageTitle>
          <PageDescription>
            Learn Finnish with a friend - meet Otso the bear and our mission
          </PageDescription>
        </PageHeader>

        <OtsoCard>
          <div className="bear-icon">🐻</div>
          <div className="content">
            <h3>Meet Otso, Your Finnish Buddy!</h3>
            <p>
              Hei! I&apos;m Otso, a friendly brown bear from the forests of
              Finland. In Finnish mythology, Otso is the spirit of the bear, the
              king of the forest. I&apos;m here to guide you through your
              Finnish language journey with patience, encouragement, and a
              little bit of fun! 🐻
            </p>
          </div>
        </OtsoCard>

        <AboutSection>
          <SectionTitle>Our Mission</SectionTitle>
          <SectionText>
            Finnish Buddy was created to make learning Finnish accessible,
            enjoyable, and effective for everyone. We believe that language
            learning should feel like a conversation with a friend, not a
            textbook drill. Our AI-powered platform adapts to your level,
            providing personalized lessons that help you progress from complete
            beginner to confident speaker.
          </SectionText>
        </AboutSection>

        <StatsGrid>
          <StatCard>
            <div className="number">6</div>
            <div className="label">CEFR Levels</div>
            <div
              style={{
                fontSize: "0.75rem",
                color: "#999",
                marginTop: "0.25rem",
              }}
            >
              A1 to C2
            </div>
          </StatCard>
          <StatCard>
            <div className="number">65+</div>
            <div className="label">Topics</div>
            <div
              style={{
                fontSize: "0.75rem",
                color: "#999",
                marginTop: "0.25rem",
              }}
            >
              Structured lessons
            </div>
          </StatCard>
          <StatCard>
            <div className="number">AI</div>
            <div className="label">Powered Learning</div>
            <div
              style={{
                fontSize: "0.75rem",
                color: "#999",
                marginTop: "0.25rem",
              }}
            >
              Personalized content
            </div>
          </StatCard>
          <StatCard>
            <div className="number">100%</div>
            <div className="label">Free to Start</div>
            <div
              style={{
                fontSize: "0.75rem",
                color: "#999",
                marginTop: "0.25rem",
              }}
            >
              No credit card needed
            </div>
          </StatCard>
        </StatsGrid>

        <AboutSection>
          <SectionTitle>What Makes Us Different</SectionTitle>
          <FeatureList>
            <li>
              <span className="check">✓</span> AI-generated lessons tailored to
              your level
            </li>
            <li>
              <span className="check">✓</span> Memory tricks and mnemonics (like
              the UNO method)
            </li>
            <li>
              <span className="check">✓</span> Interactive quizzes with instant
              feedback
            </li>
            <li>
              <span className="check">✓</span> Practice exercises with hints and
              explanations
            </li>
            <li>
              <span className="check">✓</span> Word of the Day to build
              vocabulary daily
            </li>
            <li>
              <span className="check">✓</span> Ask Otso - AI grammar assistant
              for your questions
            </li>
            <li>
              <span className="check">✓</span> Progress tracking across all
              levels
            </li>
            <li>
              <span className="check">✓</span> Completely free to start learning
            </li>
          </FeatureList>
        </AboutSection>

        <AboutSection>
          <SectionTitle>Our Curriculum</SectionTitle>
          <SectionText>
            Our curriculum follows the Common European Framework of Reference
            for Languages (CEFR), ensuring you learn Finnish in a structured,
            progressive way. From basic greetings at A1 to mastering complex
            literary structures at C2, every topic builds on what you&apos;ve
            learned before.
          </SectionText>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.5rem",
              marginTop: "1rem",
            }}
          >
            <span
              style={{
                background: "#48bb7820",
                color: "#48bb78",
                padding: "0.25rem 0.75rem",
                borderRadius: "20px",
                fontSize: "0.875rem",
              }}
            >
              A1: 18 topics
            </span>
            <span
              style={{
                background: "#4299e120",
                color: "#4299e1",
                padding: "0.25rem 0.75rem",
                borderRadius: "20px",
                fontSize: "0.875rem",
              }}
            >
              A2: 15 topics
            </span>
            <span
              style={{
                background: "#ed893620",
                color: "#ed8936",
                padding: "0.25rem 0.75rem",
                borderRadius: "20px",
                fontSize: "0.875rem",
              }}
            >
              B1: 8 topics
            </span>
            <span
              style={{
                background: "#9f7aea20",
                color: "#9f7aea",
                padding: "0.25rem 0.75rem",
                borderRadius: "20px",
                fontSize: "0.875rem",
              }}
            >
              B2: 8 topics
            </span>
            <span
              style={{
                background: "#f5656520",
                color: "#f56565",
                padding: "0.25rem 0.75rem",
                borderRadius: "20px",
                fontSize: "0.875rem",
              }}
            >
              C1: 8 topics
            </span>
            <span
              style={{
                background: "#ed64a620",
                color: "#ed64a6",
                padding: "0.25rem 0.75rem",
                borderRadius: "20px",
                fontSize: "0.875rem",
              }}
            >
              C2: 8 topics
            </span>
          </div>
        </AboutSection>

        <AboutSection>
          <SectionTitle>Powered by AI</SectionTitle>
          <SectionText>
            Finnish Buddy uses cutting-edge AI technology to generate
            personalized lessons, quizzes, and explanations. This means every
            lesson is tailored to the specific topic and level, providing you
            with fresh, relevant content every time.
          </SectionText>
          <SectionText>
            The AI also powers &quot;Ask Otso&quot; - your personal grammar
            assistant. Ask any question about Finnish grammar, word usage, or
            language rules, and Otso will explain it with examples and memory
            tricks!
          </SectionText>
        </AboutSection>

        <AboutSection>
          <SectionTitle>The Story Behind Otso</SectionTitle>
          <SectionText>
            In Finnish mythology and the national epic Kalevala, the bear was a
            sacred and revered animal. The bear was called by many names,
            including &quot;Otso&quot; - the king of the forest. The bear was
            seen as a wise, powerful, and noble creature.
          </SectionText>
          <SectionText>
            We chose Otso as our mascot because he embodies the qualities we
            want our learners to have: patience, wisdom, and strength. Just as
            the bear roams the Finnish forests, we want you to explore the
            Finnish language with confidence and curiosity.
          </SectionText>
        </AboutSection>

        <AboutSection>
          <SectionTitle>Our Values</SectionTitle>
          <FeatureList>
            <li>
              <span className="check">✓</span> <strong>Accessibility:</strong>{" "}
              Learning should be free and available to everyone
            </li>
            <li>
              <span className="check">✓</span> <strong>Quality:</strong>{" "}
              AI-generated content that&apos;s accurate and helpful
            </li>
            <li>
              <span className="check">✓</span> <strong>Community:</strong>{" "}
              Learning together is more fun
            </li>
            <li>
              <span className="check">✓</span> <strong>Progress:</strong> Every
              small step counts toward fluency
            </li>
            <li>
              <span className="check">✓</span> <strong>Joy:</strong> Learning
              Finnish should be enjoyable, not stressful
            </li>
          </FeatureList>
        </AboutSection>

        <ButtonGroup>
          <Button href="/register" variant="primary">
            Start Learning Free 🐻
          </Button>
          <Button href="/levels" variant="secondary">
            Explore Levels
          </Button>
          <Button href="/ask-otso" variant="secondary">
            Ask Otso a Question
          </Button>
        </ButtonGroup>
      </Container>
    </MainLayout>
  );
}
