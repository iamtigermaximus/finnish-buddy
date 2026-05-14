// src/app/otso/[topic]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import styled from "styled-components";
import MainLayout from "@/components/layout/MainLayout";
import Container from "@/components/layout/Container";
import Button from "@/components/ui/Button";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #667eea;
  text-decoration: none;
  margin-bottom: 1rem;
  font-size: 0.9rem;

  &:hover {
    text-decoration: underline;
  }
`;

const OtsoHeader = styled.div`
  background: linear-gradient(135deg, #8b6914 0%, #a0822a 100%);
  border-radius: 20px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;

  .bear-icon {
    font-size: 4rem;
  }

  .bear-message {
    flex: 1;

    h1 {
      font-size: 1.5rem;
      margin-bottom: 0.25rem;
      color: white;
    }

    p {
      color: rgba(255, 255, 255, 0.9);
      font-size: 0.9rem;
    }
  }

  @media (max-width: 640px) {
    .bear-icon {
      font-size: 3rem;
    }

    .bear-message h1 {
      font-size: 1.25rem;
    }
  }
`;

const Content = styled.div`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  line-height: 1.6;
  min-height: 400px;

  h2 {
    color: #667eea;
    font-size: 1.3rem;
    margin: 1.5rem 0 1rem;

    &:first-child {
      margin-top: 0;
    }
  }

  h3 {
    color: #1a1a2e;
    font-size: 1.1rem;
    margin: 1rem 0 0.5rem;
  }

  p {
    margin-bottom: 1rem;
  }

  ul,
  ol {
    margin: 0.5rem 0 1rem 1.5rem;
  }

  li {
    margin-bottom: 0.25rem;
  }

  .example {
    background: #f5f7fa;
    border-left: 4px solid #667eea;
    padding: 1rem;
    margin: 1rem 0;
    border-radius: 8px;

    .finnish {
      font-weight: bold;
      color: #667eea;
      margin-bottom: 0.25rem;
    }

    .english {
      color: #666;
      font-size: 0.9rem;
    }
  }

  .memory-tip {
    background: #fff9e6;
    border-left: 4px solid #ffd700;
    padding: 1rem;
    margin: 1rem 0;
    border-radius: 8px;
  }

  .thinking {
    text-align: center;
    padding: 2rem;
    color: #666;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
  flex-wrap: wrap;
`;

// Format topic ID to a readable question
function formatQuestion(topicId: string): string {
  const questions: Record<string, string> = {
    "mina-vs-minut-vs-minua":
      "What is the difference between minä, minut, and minua? When do I use each form?",
    "sinut-vs-sinua": "What is the difference between sinut and sinua?",
    "han-vs-se":
      "What is the difference between hän and se? When should I use which?",
    "me-vs-meidat-vs-meita":
      "What is the difference between me, meidät, and meitä?",
    "tama-vs-tuo-vs-se": "What is the difference between tämä, tuo, and se?",
    "nama-vs-nuo-vs-ne": "What is the difference between nämä, nuo, and ne?",
    "kuka-vs-ken": "What is the difference between kuka and ken?",
    "joku-vs-jokin": "What is the difference between joku and jokin?",
    "partitive-case":
      "When do I use the partitive case? Can you explain the UNO method with examples?",
    "genitive-vs-partitive":
      "What is the difference between genitive and partitive case?",
    "accusative-vs-nominative":
      "What is the difference between accusative and nominative?",
    "ssa-vs-lla":
      "What is the difference between -ssa and -lla? When do I use each?",
    "sta-vs-lta": "What is the difference between -sta and -lta?",
    "Vn-vs-lle": "What is the difference between -Vn and -lle?",
    "mihin-vs-missa-vs-mista":
      "What is the difference between mihin, missä, and mistä?",
    "milla-vs-missa": "What is the difference between millä and missä?",
    "lla-vs-lta": "What is the difference between -lla and -lta?",
    "translative-case": "When do I use the translative case (-ksi)?",
    "essive-case": "When do I use the essive case (-na/-nä)?",
    "abessive-case":
      "How do I say 'without' in Finnish using the abessive case?",
    "comitative-case":
      "What is the comitative case (-ine) and when do I use it?",
    "postpositions-vs-prepositions":
      "What is the difference between postpositions and prepositions in Finnish?",
    "genitive-vs-partitive-numbers":
      "After numbers, when do I use genitive vs partitive?",
    "tai-vs-vai":
      "What is the difference between tai and vai? When do I use each?",
    "joka-vs-mika":
      "What is the difference between joka and mikä as relative pronouns?",
    "kun-vs-koska": "What is the difference between kun and koska?",
    "mutta-vs-vaan": "What is the difference between mutta and vaan?",
    "etta-conjunction-vs-particle":
      "What is the difference between 'että' as a conjunction and 'että' as a particle?",
    "vaikka-conjunction": "What are the different meanings of 'vaikka'?",
    "ennen-kuin-vs-ennen":
      "What is the difference between 'ennen kuin' and 'ennen'?",
    "jotta-vs-etta": "What is the difference between jotta and että?",
    "silla-vs-koska": "What is the difference between sillä and koska?",
    "siis-vs-nimittain": "What is the difference between siis and nimittäin?",
    "eli-vs-toisin-sanoen":
      "What is the difference between eli and toisin sanoen?",
    "vai-vs-tai-questions": "In questions, when do I use vai vs tai?",
    "verb-types-1-6":
      "Can you explain the 6 Finnish verb types and how to conjugate each?",
    "present-vs-imperfect":
      "What is the difference between present tense (puhun) and imperfect (puhuin)?",
    "present-perfect-vs-imperfect":
      "What is the difference between present perfect (olen puhunut) and imperfect (puhuin)?",
    "present-perfect-vs-past-perfect":
      "What is the difference between present perfect (olen puhunut) and past perfect (olin puhunut)?",
    "pitaa-vs-taytyy-vs-pakko":
      "What is the difference between pitää, täytyy, and on pakko?",
    "voi-vs-osaa": "What is the difference between voi and osaa?",
    "taytyy-vs-tarvitsee":
      "What is the difference between täytyy and tarvitsee?",
    "saattaa-vs-voida": "What is the difference between saattaa and voida?",
    "tulla-vs-menna": "What is the difference between tulla and mennä?",
    "tuoda-vs-vieda": "What is the difference between tuoda and viedä?",
    "vieda-vs-vieneet": "What is the difference between viedä and vieneet?",
    "momentane-vs-durative":
      "What is the difference between momentane and durative verbs?",
    "lukea-momentane-vs-durative":
      "What is the difference between different meanings of 'lukea'?",
    "konsa-vs-milloin": "What is the difference between konsa and milloin?",
    "conditional-vs-imperfect":
      "What is the difference between conditional (puhuisin) and imperfect (puhuin)?",
    "mika-vs-mita": "What is the difference between mikä and mitä?",
    "kuka-vs-keta": "What is the difference between kuka and ketä?",
    kene: "What does 'kene' mean and when do I use it?",
    "missa-vs-mista-vs-mihin":
      "What is the difference between missä, mistä, and mihin?",
    "milloin-vs-koska": "What is the difference between milloin and koska?",
    "miksi-vs-minka-takia":
      "What is the difference between miksi and minkä takia?",
    "miten-vs-kuinka": "What is the difference between miten and kuinka?",
    "kumpi-vs-mika": "What is the difference between kumpi and mikä?",
    "svo-vs-inversion": "What is inversion in Finnish and when do I use it?",
    "verb-second-rule": "What is the verb second rule in Finnish?",
    "negative-word-order": "How does word order work in negative sentences?",
    "question-word-order": "How does word order work in questions?",
    "relative-clause-order": "How does word order work in relative clauses?",
    "subordinate-clause-order":
      "How does word order work in subordinate clauses?",
    "coordination-vs-subordination":
      "What is the difference between coordination and subordination?",
    "participial-phrases":
      "What are participial phrases (lauseenvastikkeet) in Finnish?",
    "time-adessive-vs-inessive":
      "What is the difference between using -lla and -ssa for time expressions?",
    "duration-accusative-vs-partitive":
      "For duration, when do I use accusative vs partitive?",
    "frequency-joka-vs-jokaisena":
      "What is the difference between 'joka päivä' and 'joka päivänä'?",
    "aamulla-vs-aamuna": "What is the difference between aamulla and aamuna?",
    "mennä-tulla-kayda-temporal":
      "What is the difference between mennä, tulla, and käydä for time expressions?",
    "ensi-vs-viime-vs-tuleva":
      "What is the difference between ensi, viime, and tuleva?",
    "sitten-vs-sitte": "What is the difference between sitten and sitte?",
    "kohta-vs-pian-vs-piakkoin":
      "What is the difference between kohta, pian, and piakkoin?",
    "vieressa-vs-vierella":
      "What is the difference between vieressä and vierellä?",
    "alla-vs-alapuolella":
      "What is the difference between alla and alapuolella?",
    "paalla-vs-paalle": "What is the difference between päällä and päälle?",
    "edessa-vs-eteen": "What is the difference between edessä and eteen?",
    "takana-vs-taakse": "What is the difference between takana and taakse?",
    "valissa-vs-valiin": "What is the difference between välissä and väliin?",
    "lahella-vs-lahelle": "What is the difference between lähellä and lähelle?",
    "kautta-vs-kautta": "What are the different meanings of 'kautta'?",
    "kin-vs-kaan": "What is the difference between -kin and -kaan/-kään?",
    "ko-placement": "Where do I put -ko/-kö in questions?",
    "no-niin-vs-niinpa":
      "What is the difference between 'no niin' and 'niinpä'?",
    "ai-vs-oi-vs-voi": "What is the difference between ai, oi, and voi?",
    "se-pronoun-vs-article":
      "What is the difference between 'se' as a pronoun and 'se' as an article?",
    "existential-vs-property":
      "What is the difference between existential 'on' and property 'on'?",
    "yksi-forms":
      "What are the different forms of 'yksi' (one) and when do I use each?",
    "kaksi-forms":
      "What are the different forms of 'kaksi' (two) and when do I use each?",
    "paljon-vs-monta": "What is the difference between paljon and monta?",
    "jotain-vs-mitaan": "What is the difference between jotain and mitään?",
  };
  return (
    questions[topicId] ||
    `Can you explain "${topicId.replace(/-/g, " ")}" in Finnish grammar with examples?`
  );
}

// Format topic ID to display title
function formatTitle(topicId: string): string {
  const titles: Record<string, string> = {
    "mina-vs-minut-vs-minua": "Minä vs Minut vs Minua",
    "sinut-vs-sinua": "Sinut vs Sinua",
    "han-vs-se": "Hän vs Se",
    "me-vs-meidat-vs-meita": "Me vs Meidät vs Meitä",
    "tama-vs-tuo-vs-se": "Tämä vs Tuo vs Se",
    "nama-vs-nuo-vs-ne": "Nämä vs Nuo vs Ne",
    "kuka-vs-ken": "Kuka vs Ken",
    "joku-vs-jokin": "Joku vs Jokin",
    "partitive-case": "Partitive Case (Partitiivi) - UNO Method",
    "genitive-vs-partitive": "Genitive vs Partitive",
    "accusative-vs-nominative": "Accusative vs Nominative",
    "ssa-vs-lla": "-ssa vs -lla",
    "sta-vs-lta": "-sta vs -lta",
    "Vn-vs-lle": "-Vn vs -lle",
    "mihin-vs-missa-vs-mista": "Mihin vs Missä vs Mistä",
    "milla-vs-missa": "Millä vs Missä",
    "lla-vs-lta": "-lla vs -lta",
    "translative-case": "Translative Case (-ksi)",
    "essive-case": "Essive Case (-na/-nä)",
    "abessive-case": "Abessive Case (-tta/-ttä)",
    "comitative-case": "Comitative Case (-ine)",
    "postpositions-vs-prepositions": "Postpositions vs Prepositions",
    "genitive-vs-partitive-numbers": "Genitive vs Partitive with Numbers",
    "tai-vs-vai": "Tai vs Vai",
    "joka-vs-mika": "Joka vs Mikä",
    "kun-vs-koska": "Kun vs Koska",
    "mutta-vs-vaan": "Mutta vs Vaan",
    "etta-conjunction-vs-particle": "Että (conjunction) vs Että (particle)",
    "vaikka-conjunction": "Vaikka - Although vs Even If",
    "ennen-kuin-vs-ennen": "Ennen kuin vs Ennen",
    "jotta-vs-etta": "Jotta vs Että",
    "silla-vs-koska": "Sillä vs Koska",
    "siis-vs-nimittain": "Siis vs Nimittäin",
    "eli-vs-toisin-sanoen": "Eli vs Toisin sanoen",
    "vai-vs-tai-questions": "Vai vs Tai in Questions",
    "verb-types-1-6": "Finnish Verb Types 1-6",
    "present-vs-imperfect": "Puhun vs Puhuin (Present vs Imperfect)",
    "present-perfect-vs-imperfect": "Olen puhunut vs Puhuin",
    "present-perfect-vs-past-perfect": "Olen puhunut vs Olin puhunut",
    "pitaa-vs-taytyy-vs-pakko": "Pitää vs Täytyy vs On pakko",
    "voi-vs-osaa": "Voi vs Osaa",
    "taytyy-vs-tarvitsee": "Täytyy vs Tarvitsee",
    "saattaa-vs-voida": "Saattaa vs Voida",
    "tulla-vs-menna": "Tulla vs Mennä",
    "tuoda-vs-vieda": "Tuoda vs Viedä",
    "vieda-vs-vieneet": "Viedä vs Vieneet",
    "momentane-vs-durative": "Momentane vs Durative Verbs",
    "lukea-momentane-vs-durative": "Lukea (Momentane vs Durative)",
    "konsa-vs-milloin": "Konsa vs Milloin",
    "conditional-vs-imperfect": "Konditionaali vs Imperfekti",
    "mika-vs-mita": "Mikä vs Mitä",
    "kuka-vs-keta": "Kuka vs Ketä",
    kene: "Kene (Whose)",
    "missa-vs-mista-vs-mihin": "Missä vs Mistä vs Mihin",
    "milloin-vs-koska": "Milloin vs Koska",
    "miksi-vs-minka-takia": "Miksi vs Minkä takia",
    "miten-vs-kuinka": "Miten vs Kuinka",
    "kumpi-vs-mika": "Kumpi vs Mikä",
    "svo-vs-inversion": "SVO vs Inversion",
    "verb-second-rule": "Verb Second Rule",
    "negative-word-order": "Negative Sentence Word Order",
    "question-word-order": "Question Word Order",
    "relative-clause-order": "Relative Clause Word Order",
    "subordinate-clause-order": "Subordinate Clause Word Order",
    "coordination-vs-subordination": "Coordination vs Subordination",
    "participial-phrases": "Participial Phrases (Lauseenvastikkeet)",
    "time-adessive-vs-inessive": "-lla vs -ssa for Time",
    "duration-accusative-vs-partitive": "Duration: Accusative vs Partitive",
    "frequency-joka-vs-jokaisena": "Joka päivä vs Joka päivänä",
    "aamulla-vs-aamuna": "Aamulla vs Aamuna",
    "mennä-tulla-kayda-temporal": "Mennä vs Tulla vs Käydä (Temporal)",
    "ensi-vs-viime-vs-tuleva": "Ensi vs Viime vs Tuleva",
    "sitten-vs-sitte": "Sitten vs Sitte",
    "kohta-vs-pian-vs-piakkoin": "Kohta vs Pian vs Piakkoin",
    "vieressa-vs-vierella": "Vieressä vs Vierellä",
    "alla-vs-alapuolella": "Alla vs Alapuolella",
    "paalla-vs-paalle": "Päällä vs Päälle",
    "edessa-vs-eteen": "Edessä vs Eteen",
    "takana-vs-taakse": "Takana vs Taakse",
    "valissa-vs-valiin": "Välissä vs Väliin",
    "lahella-vs-lahelle": "Lähellä vs Lähelle",
    "kautta-vs-kautta": "Kautta (Different Meanings)",
    "kin-vs-kaan": "-kin vs -kaan/-kään",
    "ko-placement": "-ko/-kö Placement",
    "no-niin-vs-niinpa": "No niin vs Niinpä",
    "ai-vs-oi-vs-voi": "Ai vs Oi vs Voi",
    "se-pronoun-vs-article": "Se (Pronoun) vs Se (Article)",
    "existential-vs-property": "Existential 'on' vs Property 'on'",
    "yksi-forms": "Yksi vs Yhden vs Yhtä",
    "kaksi-forms": "Kaksi vs Kahden vs Kahta",
    "paljon-vs-monta": "Paljon vs Monta",
    "jotain-vs-mitaan": "Jotain vs Mitään",
  };
  return titles[topicId] || topicId.replace(/-/g, " ").toUpperCase();
}

export default function OtsoExplainPage() {
  const params = useParams();
  const router = useRouter();
  const topicId = params.topic as string;
  const [explanation, setExplanation] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExplanation = async () => {
      setLoading(true);
      setError(null);

      const question = formatQuestion(topicId);
      const title = formatTitle(topicId);

      try {
        const response = await fetch("/api/ai/ask-otso", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to get explanation");
        }

        // Format the response with proper HTML
        let formattedAnswer = data.answer;
        formattedAnswer = formattedAnswer.replace(/\n/g, "<br/>");
        formattedAnswer = formattedAnswer.replace(
          /\*\*(.*?)\*\*/g,
          "<strong>$1</strong>",
        );
        formattedAnswer = formattedAnswer.replace(/•/g, "&bull;");

        setExplanation(formattedAnswer);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchExplanation();
  }, [topicId]);

  const title = formatTitle(topicId);

  return (
    <MainLayout>
      <Container>
        <BackLink href="/ask-otso">← Back to Ask Otso</BackLink>

        <OtsoHeader>
          <div className="bear-icon">🐻</div>
          <div className="bear-message">
            <h1>{title}</h1>
            <p>Otso is explaining this topic to you...</p>
          </div>
        </OtsoHeader>

        <Content>
          {loading ? (
            <div className="thinking">
              <LoadingSpinner message="🐻 Otso is thinking... Generating explanation with examples!" />
            </div>
          ) : error ? (
            <div className="thinking">
              <p>❌ {error}</p>
              <div style={{ marginTop: "1rem" }}>
                <Button
                  onClick={() => window.location.reload()}
                  variant="primary"
                >
                  Try Again
                </Button>
              </div>
            </div>
          ) : (
            <div dangerouslySetInnerHTML={{ __html: explanation }} />
          )}
        </Content>

        <ButtonGroup>
          <Button href="/ask-otso" variant="secondary">
            Ask About Another Topic
          </Button>
          <Button href="/levels" variant="primary">
            Practice in Levels
          </Button>
        </ButtonGroup>
      </Container>
    </MainLayout>
  );
}
