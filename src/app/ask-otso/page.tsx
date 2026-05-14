// src/app/ask-otso/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import styled from "styled-components";
import MainLayout from "@/components/layout/MainLayout";
import Container from "@/components/layout/Container";

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

const SearchInput = styled.input`
  width: 100%;
  max-width: 500px;
  padding: 0.75rem 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 50px;
  font-size: 1rem;
  margin: 1.5rem auto;
  display: block;

  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const CategorySection = styled.div`
  margin-bottom: 2rem;
`;

const CategoryTitle = styled.h2`
  font-size: 1.5rem;
  color: #667eea;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #667eea20;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  user-select: none;

  .toggle-icon {
    font-size: 0.875rem;
    color: #999;
  }
`;

const TopicsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
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

const TopicCard = styled(Link)`
  background: white;
  border-radius: 12px;
  padding: 1rem;
  text-decoration: none;
  transition: all 0.2s;
  border: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  gap: 1rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-color: #667eea;
  }

  .icon {
    font-size: 2rem;
  }

  .content {
    flex: 1;
  }

  .title {
    font-weight: 600;
    color: #1a1a2e;
    margin-bottom: 0.25rem;
  }

  .description {
    font-size: 0.75rem;
    color: #666;
  }

  .arrow {
    color: #999;
    font-size: 1.25rem;
  }
`;

const topics = [
  // Pronouns (8)
  {
    id: "mina-vs-minut-vs-minua",
    title: "Minä vs Minut vs Minua",
    description: "Three forms of 'I' - when to use each case",
    icon: "👤",
    category: "Pronouns",
  },
  {
    id: "sinut-vs-sinua",
    title: "Sinut vs Sinua",
    description: "Different forms of 'you' - accusative vs partitive",
    icon: "👤",
    category: "Pronouns",
  },
  {
    id: "han-vs-se",
    title: "Hän vs Se",
    description: "He/she vs it - when to use which",
    icon: "👥",
    category: "Pronouns",
  },
  {
    id: "me-vs-meidat-vs-meita",
    title: "Me vs Meidät vs Meitä",
    description: "We vs us - nominative, accusative, partitive",
    icon: "👥",
    category: "Pronouns",
  },
  {
    id: "tama-vs-tuo-vs-se",
    title: "Tämä vs Tuo vs Se",
    description: "This vs that vs it - proximity distinctions",
    icon: "👉",
    category: "Pronouns",
  },
  {
    id: "nama-vs-nuo-vs-ne",
    title: "Nämä vs Nuo vs Ne",
    description: "These vs those vs they - plural forms",
    icon: "👉",
    category: "Pronouns",
  },
  {
    id: "kuka-vs-ken",
    title: "Kuka vs Ken",
    description: "Who vs whom - formal vs common",
    icon: "❓",
    category: "Pronouns",
  },
  {
    id: "joku-vs-jokin",
    title: "Joku vs Jokin",
    description: "Someone vs something - subtle differences",
    icon: "❓",
    category: "Pronouns",
  },

  // Cases (15)
  {
    id: "partitive-case",
    title: "Partitive Case (UNO Method)",
    description: "When to use -a/-ä or -ta/-tä",
    icon: "🎯",
    category: "Cases",
  },
  {
    id: "genitive-vs-partitive",
    title: "Genitive vs Partitive",
    description: "Possession vs partial object",
    icon: "🔗",
    category: "Cases",
  },
  {
    id: "accusative-vs-nominative",
    title: "Accusative vs Nominative",
    description: "Total object vs subject",
    icon: "📦",
    category: "Cases",
  },
  {
    id: "ssa-vs-lla",
    title: "-ssa vs -lla",
    description: "Inside vs on top of",
    icon: "🏠",
    category: "Cases",
  },
  {
    id: "sta-vs-lta",
    title: "-sta vs -lta",
    description: "From inside vs from surface",
    icon: "🚪",
    category: "Cases",
  },
  {
    id: "Vn-vs-lle",
    title: "-Vn vs -lle",
    description: "Into vs onto",
    icon: "➡️",
    category: "Cases",
  },
  {
    id: "mihin-vs-missa-vs-mista",
    title: "Mihin vs Missä vs Mistä",
    description: "Where to, where at, where from",
    icon: "🗺️",
    category: "Cases",
  },
  {
    id: "milla-vs-missa",
    title: "Millä vs Missä",
    description: "On what vs in what",
    icon: "📍",
    category: "Cases",
  },
  {
    id: "lla-vs-lta",
    title: "-lla vs -lta",
    description: "Static on vs moving from surface",
    icon: "⬇️",
    category: "Cases",
  },
  {
    id: "translative-case",
    title: "Translative Case (-ksi)",
    description: "Becoming something vs being something",
    icon: "🔄",
    category: "Cases",
  },
  {
    id: "essive-case",
    title: "Essive Case (-na/-nä)",
    description: "As a (temporary) vs permanent",
    icon: "⏳",
    category: "Cases",
  },
  {
    id: "abessive-case",
    title: "Abessive Case (-tta/-ttä)",
    description: "Without - how to say 'without'",
    icon: "🚫",
    category: "Cases",
  },
  {
    id: "comitative-case",
    title: "Comitative Case (-ine)",
    description: "With (possession) - rare but important",
    icon: "🤝",
    category: "Cases",
  },
  {
    id: "postpositions-vs-prepositions",
    title: "Postpositions vs Prepositions",
    description: "Words that come AFTER vs BEFORE nouns",
    icon: "📍",
    category: "Cases",
  },
  {
    id: "genitive-vs-partitive-numbers",
    title: "Genitive vs Partitive with Numbers",
    description: "After 1 vs after 2+",
    icon: "🔢",
    category: "Cases",
  },

  // Conjunctions (12)
  {
    id: "tai-vs-vai",
    title: "Tai vs Vai",
    description: "Or in statements vs choice questions",
    icon: "🤔",
    category: "Conjunctions",
  },
  {
    id: "joka-vs-mika",
    title: "Joka vs Mikä",
    description: "Which relative pronoun to use",
    icon: "🔗",
    category: "Conjunctions",
  },
  {
    id: "kun-vs-koska",
    title: "Kun vs Koska",
    description: "When vs because",
    icon: "⏰",
    category: "Conjunctions",
  },
  {
    id: "mutta-vs-vaan",
    title: "Mutta vs Vaan",
    description: "But vs but rather (only with negatives)",
    icon: "🔄",
    category: "Conjunctions",
  },
  {
    id: "etta-conjunction-vs-particle",
    title: "Että (conjunction) vs Että (particle)",
    description: "That vs so that / in order that",
    icon: "📝",
    category: "Conjunctions",
  },
  {
    id: "vaikka-conjunction",
    title: "Vaikka vs Vaikka",
    description: "Although vs even if (same word)",
    icon: "🤔",
    category: "Conjunctions",
  },
  {
    id: "ennen-kuin-vs-ennen",
    title: "Ennen kuin vs Ennen",
    description: "Before (conjunction) vs before (preposition)",
    icon: "⏰",
    category: "Conjunctions",
  },
  {
    id: "jotta-vs-etta",
    title: "Jotta vs Että",
    description: "So that vs that (purpose vs fact)",
    icon: "🎯",
    category: "Conjunctions",
  },
  {
    id: "silla-vs-koska",
    title: "Sillä vs Koska",
    description: "Because (formal) vs because",
    icon: "📖",
    category: "Conjunctions",
  },
  {
    id: "siis-vs-nimittain",
    title: "Siis vs Nimittäin",
    description: "So/thus vs namely/that is",
    icon: "💡",
    category: "Conjunctions",
  },
  {
    id: "eli-vs-toisin-sanoen",
    title: "Eli vs Toisin sanoen",
    description: "In other words vs that is",
    icon: "📝",
    category: "Conjunctions",
  },
  {
    id: "vai-vs-tai-questions",
    title: "Vai vs Tai in Questions",
    description: "When to use which in interrogative sentences",
    icon: "❓",
    category: "Conjunctions",
  },

  // Verbs (15)
  {
    id: "verb-types-1-6",
    title: "Verb Types 1-6",
    description: "How to identify and conjugate each type",
    icon: "🔤",
    category: "Verbs",
  },
  {
    id: "present-vs-imperfect",
    title: "Puhun vs Puhuin",
    description: "Present vs past (imperfect)",
    icon: "⏰",
    category: "Verbs",
  },
  {
    id: "present-perfect-vs-imperfect",
    title: "Olen puhunut vs Puhuin",
    description: "Present perfect vs simple past",
    icon: "📅",
    category: "Verbs",
  },
  {
    id: "present-perfect-vs-past-perfect",
    title: "Olen puhunut vs Olin puhunut",
    description: "Present perfect vs past perfect",
    icon: "📅",
    category: "Verbs",
  },
  {
    id: "pitaa-vs-taytyy-vs-pakko",
    title: "Pitää vs Täytyy vs On pakko",
    description: "Should vs must vs have to",
    icon: "⚡",
    category: "Verbs",
  },
  {
    id: "voi-vs-osaa",
    title: "Voi vs Osaa",
    description: "Can (possibility) vs can (ability/skill)",
    icon: "💪",
    category: "Verbs",
  },
  {
    id: "taytyy-vs-tarvitsee",
    title: "Täytyy vs Tarvitsee",
    description: "Must vs need to",
    icon: "⚠️",
    category: "Verbs",
  },
  {
    id: "saattaa-vs-voida",
    title: "Saattaa vs Voida",
    description: "Might vs can (possibility vs ability)",
    icon: "🤔",
    category: "Verbs",
  },
  {
    id: "tulla-vs-menna",
    title: "Tulla vs Mennä",
    description: "Come vs go - direction confusion",
    icon: "🚶",
    category: "Verbs",
  },
  {
    id: "tuoda-vs-vieda",
    title: "Tuoda vs Viedä",
    description: "Bring vs take (toward vs away)",
    icon: "📦",
    category: "Verbs",
  },
  {
    id: "vieda-vs-vieneet",
    title: "Viedä vs Vieneet",
    description: "Take vs have taken - active vs passive",
    icon: "🔄",
    category: "Verbs",
  },
  {
    id: "momentane-vs-durative",
    title: "Ottaa vs Ottaa (Momentane vs Durative)",
    description: "To take once vs to take repeatedly",
    icon: "🔁",
    category: "Verbs",
  },
  {
    id: "lukea-momentane-vs-durative",
    title: "Lukea vs Lukea",
    description: "To read (momentane) vs to read (durative)",
    icon: "📖",
    category: "Verbs",
  },
  {
    id: "konsa-vs-milloin",
    title: "Konsa vs Milloin",
    description: "When (archaic) vs when (modern)",
    icon: "⏰",
    category: "Verbs",
  },
  {
    id: "conditional-vs-imperfect",
    title: "Konditionaali vs Imperfekti",
    description: "Would have done vs did",
    icon: "🤔",
    category: "Verbs",
  },

  // Question Words (8)
  {
    id: "mika-vs-mita",
    title: "Mikä vs Mitä",
    description: "What (nominative) vs what (partitive)",
    icon: "❓",
    category: "Questions",
  },
  {
    id: "kuka-vs-keta",
    title: "Kuka vs Ketä",
    description: "Who (nominative) vs whom (partitive)",
    icon: "👤",
    category: "Questions",
  },
  {
    id: "kene",
    title: "Kene",
    description: "Whose (genitive of who)",
    icon: "🔗",
    category: "Questions",
  },
  {
    id: "missa-vs-mista-vs-mihin",
    title: "Missä vs Mistä vs Mihin",
    description: "Where at, from, to",
    icon: "🗺️",
    category: "Questions",
  },
  {
    id: "milloin-vs-koska",
    title: "Milloin vs Koska",
    description: "When (time) vs when (cause/reason)",
    icon: "⏰",
    category: "Questions",
  },
  {
    id: "miksi-vs-minka-takia",
    title: "Miksi vs Minkä takia",
    description: "Why vs for what reason",
    icon: "🤔",
    category: "Questions",
  },
  {
    id: "miten-vs-kuinka",
    title: "Miten vs Kuinka",
    description: "How vs how (synonyms with subtle differences)",
    icon: "❓",
    category: "Questions",
  },
  {
    id: "kumpi-vs-mika",
    title: "Kumpi vs Mikä",
    description: "Which (of two) vs which (of many)",
    icon: "🔢",
    category: "Questions",
  },

  // Word Order (8)
  {
    id: "svo-vs-inversion",
    title: "SVO vs Inversion",
    description: "Normal word order vs inverted for questions",
    icon: "📝",
    category: "Syntax",
  },
  {
    id: "verb-second-rule",
    title: "Verb Second Rule",
    description: "Why the verb must be second in main clauses",
    icon: "2️⃣",
    category: "Syntax",
  },
  {
    id: "negative-word-order",
    title: "Kieltolause Word Order",
    description: "Negative sentence structure",
    icon: "🚫",
    category: "Syntax",
  },
  {
    id: "question-word-order",
    title: "Kysymyslause Word Order",
    description: "Question word order",
    icon: "❓",
    category: "Syntax",
  },
  {
    id: "relative-clause-order",
    title: "Relatiivilause Word Order",
    description: "Relative clause structure",
    icon: "🔗",
    category: "Syntax",
  },
  {
    id: "subordinate-clause-order",
    title: "Sivulause Sanajärjestys",
    description: "Subordinate clause word order (V3 rule)",
    icon: "📝",
    category: "Syntax",
  },
  {
    id: "coordination-vs-subordination",
    title: "Rinnastus vs Alistus",
    description: "Coordination vs subordination",
    icon: "🔗",
    category: "Syntax",
  },
  {
    id: "participial-phrases",
    title: "Lauseenvastikkeet",
    description: "Participial phrases vs clauses",
    icon: "📝",
    category: "Syntax",
  },

  // Time Expressions (8)
  {
    id: "time-adessive-vs-inessive",
    title: "-lla vs -ssa for Time",
    description: "At a specific time vs in a period",
    icon: "⏰",
    category: "Time",
  },
  {
    id: "duration-accusative-vs-partitive",
    title: "Tunti vs Tunnin",
    description: "Hour (duration) vs hour's (genitive)",
    icon: "⏱️",
    category: "Time",
  },
  {
    id: "frequency-joka-vs-jokaisena",
    title: "Joka päivä vs Joka päivänä",
    description: "Every day (frequency) vs on every day",
    icon: "📅",
    category: "Time",
  },
  {
    id: "aamulla-vs-aamuna",
    title: "Aamulla vs Aamuna",
    description: "In the morning (adessive) vs as a morning (essive)",
    icon: "🌅",
    category: "Time",
  },
  {
    id: "mennä-tulla-kayda-temporal",
    title: "Mennä vs Tulla vs Käydä",
    description: "Go vs come vs visit (temporal)",
    icon: "🚶",
    category: "Time",
  },
  {
    id: "ensi-vs-viime-vs-tuleva",
    title: "Ensi vs Viime vs Tuleva",
    description: "Next vs last vs coming (confusion)",
    icon: "📅",
    category: "Time",
  },
  {
    id: "sitten-vs-sitte",
    title: "Sitten vs Sitte",
    description: "Then (formal) vs then (spoken)",
    icon: "🗣️",
    category: "Time",
  },
  {
    id: "kohta-vs-pian-vs-piakkoin",
    title: "Kohta vs Pian vs Piakkoin",
    description: "Soon vs soon vs soon (nuances)",
    icon: "⏰",
    category: "Time",
  },

  // Postpositions (8)
  {
    id: "vieressa-vs-vierella",
    title: "Vieressä vs Vierellä",
    description: "Next to vs beside (close proximity)",
    icon: "📍",
    category: "Postpositions",
  },
  {
    id: "alla-vs-alapuolella",
    title: "Alla vs Alapuolella",
    description: "Under vs below (concrete vs abstract)",
    icon: "⬇️",
    category: "Postpositions",
  },
  {
    id: "paalla-vs-paalle",
    title: "Päällä vs Päälle",
    description: "On top (static) vs onto (movement)",
    icon: "⬆️",
    category: "Postpositions",
  },
  {
    id: "edessa-vs-eteen",
    title: "Edessä vs Eteen",
    description: "In front (static) vs to the front (movement)",
    icon: "➡️",
    category: "Postpositions",
  },
  {
    id: "takana-vs-taakse",
    title: "Takana vs Taakse",
    description: "Behind (static) vs to the back (movement)",
    icon: "⬅️",
    category: "Postpositions",
  },
  {
    id: "valissa-vs-valiin",
    title: "Välissä vs Väliin",
    description: "Between (static) vs into between (movement)",
    icon: "🔄",
    category: "Postpositions",
  },
  {
    id: "lahella-vs-lahelle",
    title: "Lähellä vs Lähelle",
    description: "Near (static) vs towards near (movement)",
    icon: "📍",
    category: "Postpositions",
  },
  {
    id: "kautta-vs-kautta",
    title: "Kautta vs Kautta",
    description: "Through/via vs via (same word different uses)",
    icon: "🔄",
    category: "Postpositions",
  },

  // Other Common Confusions (10)
  {
    id: "kin-vs-kaan",
    title: "-kin vs -kaan/-kään",
    description: "Also vs not either (affirmative vs negative)",
    icon: "➕",
    category: "Other",
  },
  {
    id: "ko-placement",
    title: "-ko/-kö Placement",
    description: "Where to put the question particle",
    icon: "❓",
    category: "Other",
  },
  {
    id: "no-niin-vs-niinpa",
    title: "No niin vs Niinpä",
    description: "Various filler words in conversation",
    icon: "💬",
    category: "Other",
  },
  {
    id: "ai-vs-oi-vs-voi",
    title: "Ai vs Oi vs Voi",
    description: "Interjections (surprise, pain, disappointment)",
    icon: "😮",
    category: "Other",
  },
  {
    id: "se-pronoun-vs-article",
    title: "Se (Pronoun) vs Se (Article)",
    description: "It vs the (definite article in spoken)",
    icon: "📝",
    category: "Other",
  },
  {
    id: "existential-vs-property",
    title: "On vs On",
    description: "There is vs is (existential clauses)",
    icon: "🔍",
    category: "Other",
  },
  {
    id: "yksi-forms",
    title: "Yksi vs Yhden vs Yhtä",
    description: "One (nominative, accusative, partitive)",
    icon: "1️⃣",
    category: "Other",
  },
  {
    id: "kaksi-forms",
    title: "Kaksi vs Kahden vs Kahta",
    description: "Two (nominative, genitive, partitive)",
    icon: "2️⃣",
    category: "Other",
  },
  {
    id: "paljon-vs-monta",
    title: "Paljon vs Monta",
    description: "Much vs many (uncountable vs countable)",
    icon: "🔢",
    category: "Other",
  },
  {
    id: "jotain-vs-mitaan",
    title: "Jotain vs Mitään",
    description: "Something vs anything (positive vs negative)",
    icon: "❓",
    category: "Other",
  },
];

export default function AskOtsoPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<
    Record<string, boolean>
  >({});

  const filteredTopics = topics.filter(
    (topic) =>
      topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      topic.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const categories = [
    ...new Set(filteredTopics.map((topic) => topic.category)),
  ];

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  // Initialize all categories as expanded
  if (Object.keys(expandedCategories).length === 0 && categories.length > 0) {
    const initial: Record<string, boolean> = {};
    categories.forEach((cat) => {
      initial[cat] = true;
    });
    setExpandedCategories(initial);
  }

  return (
    <MainLayout>
      <Container>
        <PageHeader>
          <PageTitle>
            <span>🐻</span> Ask Otso
            <span>📚</span>
          </PageTitle>
          <PageDescription>
            Select a topic below, and Otso will explain it with examples and
            memory tricks
          </PageDescription>
        </PageHeader>

        <SearchInput
          type="text"
          placeholder="🔍 Search grammar topics..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {categories.map((category) => (
          <CategorySection key={category}>
            <CategoryTitle onClick={() => toggleCategory(category)}>
              <span>
                {category === "Pronouns"
                  ? "👤"
                  : category === "Cases"
                    ? "📦"
                    : category === "Conjunctions"
                      ? "🔗"
                      : category === "Verbs"
                        ? "🔤"
                        : category === "Questions"
                          ? "❓"
                          : category === "Syntax"
                            ? "📝"
                            : category === "Time"
                              ? "⏰"
                              : category === "Postpositions"
                                ? "📍"
                                : "📚"}
              </span>
              {category}
              <span className="toggle-icon">
                {expandedCategories[category] ? "▼" : "▶"}
              </span>
            </CategoryTitle>
            {expandedCategories[category] && (
              <TopicsGrid>
                {filteredTopics
                  .filter((topic) => topic.category === category)
                  .map((topic) => (
                    <TopicCard key={topic.id} href={`/otso/${topic.id}`}>
                      <div className="icon">{topic.icon}</div>
                      <div className="content">
                        <div className="title">{topic.title}</div>
                        <div className="description">{topic.description}</div>
                      </div>
                      <div className="arrow">→</div>
                    </TopicCard>
                  ))}
              </TopicsGrid>
            )}
          </CategorySection>
        ))}
      </Container>
    </MainLayout>
  );
}
