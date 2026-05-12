import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🐻 Starting Finnish Buddy database seeding...\n')

  // Clean existing data
  console.log('🧹 Cleaning existing data...')
  await prisma.quizAttempt.deleteMany()
  await prisma.progress.deleteMany()
  await prisma.question.deleteMany()
  await prisma.quiz.deleteMany()
  await prisma.vocabularyWord.deleteMany()
  await prisma.memoryAid.deleteMany()
  await prisma.example.deleteMany()
  await prisma.grammarRule.deleteMany()
  await prisma.topic.deleteMany()
  await prisma.level.deleteMany()
  console.log('✓ Cleaned existing data\n')

  // ==================== CREATE LEVELS ====================
  console.log('📚 Creating levels...')
  
  await prisma.level.createMany({
    data: [
      { name: 'A1', title: 'Beginner', description: 'Survive simple daily situations', order: 1, color: '#48bb78' },
      { name: 'A2', title: 'Elementary', description: 'Simple descriptions and routines', order: 2, color: '#4299e1' },
      { name: 'B1', title: 'Intermediate', description: 'Handle everyday situations & express opinions', order: 3, color: '#ed8936' },
      { name: 'B2', title: 'Upper Intermediate', description: 'Nuance, fluency, and complex structures', order: 4, color: '#9f7aea' },
      { name: 'C1', title: 'Advanced', description: 'Precise expression & stylistic variation', order: 5, color: '#f56565' },
      { name: 'C2', title: 'Proficient', description: 'Mastery, archaic forms, and creative language use', order: 6, color: '#ed64a6' },
    ],
  })
  console.log('✓ Levels created\n')

  // Get level IDs
  const a1 = await prisma.level.findUnique({ where: { name: 'A1' } })
  const a2 = await prisma.level.findUnique({ where: { name: 'A2' } })
  const b1 = await prisma.level.findUnique({ where: { name: 'B1' } })
  const b2 = await prisma.level.findUnique({ where: { name: 'B2' } })
  const c1 = await prisma.level.findUnique({ where: { name: 'C1' } })
  const c2 = await prisma.level.findUnique({ where: { name: 'C2' } })

  if (!a1) throw new Error('A1 level not found')

  // ==================== A1 TOPICS (12 topics) ====================
  console.log('📖 Creating A1 topics...')

  // A1 Topic 1: Personal Pronouns
  const topic1 = await prisma.topic.create({
    data: {
      title: 'Personal Pronouns',
      description: 'Learn minä, sinä, hän, me, te, he - all Finnish personal pronouns',
      levelId: a1.id,
      order: 1,
      grammarRules: {
        create: {
          title: 'Finnish Personal Pronouns',
          explanation: 'Finnish has six personal pronouns. Unlike English, Finnish has no grammatical gender - "hän" means both he and she.',
          rules: JSON.stringify([
            'minä = I (first person singular)',
            'sinä = you (second person singular, informal)',
            'hän = he/she (third person singular, gender-neutral)',
            'me = we (first person plural)',
            'te = you (second person plural or formal singular)',
            'he = they (third person plural)',
          ]),
          examples: {
            create: [
              { finnish: 'Minä olen opiskelija.', english: 'I am a student.' },
              { finnish: 'Sinä puhut suomea.', english: 'You speak Finnish.' },
              { finnish: 'Hän on kotona.', english: 'He/she is at home.' },
              { finnish: 'Me tulemme Suomesta.', english: 'We come from Finland.' },
            ],
          },
        },
      },
      memoryAid: {
        create: {
          mnemonic: 'M-S-H-M-T-H (My Sister Has My Two Hands)',
          explanation: 'The first letters of Finnish personal pronouns form a sentence: My (minä), Sister (sinä), Has (hän), My (me), Two (te), Hands (he).',
          quickTips: JSON.stringify([
            'minä = I (sounds like "me" but means I!)',
            'sinä = you (sounds like "see na")',
            'hän = he/she (no gender!)',
            'me = we (same as English "me" but means we!)',
            'te = you all (formal you)',
            'he = they (sounds like "hay")',
          ]),
          colorCode: '#48bb78',
          icon: '👤',
        },
      },
    },
  })

  // A1 Topic 2: Verb Type 1
  const topic2 = await prisma.topic.create({
    data: {
      title: 'Verb Type 1 Conjugation',
      description: 'Basic conjugation: puhua → minä puhun',
      levelId: a1.id,
      order: 2,
      grammarRules: {
        create: {
          title: 'Verb Type 1 - Basic Conjugation',
          explanation: 'Most Finnish verbs ending in -a/-ä belong to Type 1.',
          rules: JSON.stringify([
            'Remove the -a/-ä from the infinitive: puhua → puhu-',
            'Add personal endings: -n, -t, -, -mme, -tte, -vat/-vät',
            'Example: puhua: minä puhun, sinä puhut, hän puhuu, me puhumme, te puhutte, he puhuvat',
          ]),
          examples: {
            create: [
              { finnish: 'Minä asun Suomessa.', english: 'I live in Finland.' },
              { finnish: 'Sinä opiskelet suomea.', english: 'You study Finnish.' },
              { finnish: 'Hän laulaa kauniisti.', english: 'He/she sings beautifully.' },
            ],
          },
        },
      },
      memoryAid: {
        create: {
          mnemonic: 'Take the A, Add the ending! -n, -t, -, -mme, -tte, -vat',
          explanation: 'Remove the final -a/-ä and add the personal ending.',
          quickTips: JSON.stringify([
            'minä → add -n (I: puhuN)',
            'sinä → add -t (You: puhuT)',
            'hän → add nothing (He/She: puhu)',
            'me → add -mme (We: puhuMME)',
            'te → add -tte (You all: puhuTTE)',
            'he → add -vat/-vät (They: puhuVAT)',
          ]),
          colorCode: '#4299e1',
          icon: '🔤',
        },
      },
    },
  })

  // A1 Topic 3: Present Tense
  const topic3 = await prisma.topic.create({
    data: {
      title: 'Present Tense',
      description: 'Positive and negative forms in present tense',
      levelId: a1.id,
      order: 3,
      grammarRules: {
        create: {
          title: 'Present Tense Formation',
          explanation: 'Present tense describes actions happening now or general truths.',
          rules: JSON.stringify([
            'Positive: verb stem + personal ending',
            'Negative: en/et/ei/emme/ette/eivät + stem (no personal ending)',
            'Example positive: puhun, puhut, puhuu',
            'Example negative: en puhu, et puhu, ei puhu',
          ]),
          examples: {
            create: [
              { finnish: 'Minä puhun suomea.', english: 'I speak Finnish.' },
              { finnish: 'Minä en puhu venäjää.', english: 'I don\'t speak Russian.' },
              { finnish: 'Hän ei asu Helsingissä.', english: 'He/she doesn\'t live in Helsinki.' },
            ],
          },
        },
      },
    },
  })

  // A1 Topic 4: Question Formation
  const topic4 = await prisma.topic.create({
    data: {
      title: 'Question Formation',
      description: 'Ask questions with -ko/-kö suffix and question words',
      levelId: a1.id,
      order: 4,
      grammarRules: {
        create: {
          title: 'Asking Questions',
          explanation: 'Finnish forms questions either with -ko/-kö suffix or question words.',
          rules: JSON.stringify([
            'Yes/No questions: add -ko/-kö to the verb',
            'Question words: mikä (what), kuka (who), missä (where)',
            'Word order stays the same as statements',
          ]),
          examples: {
            create: [
              { finnish: 'Puhutko englantia?', english: 'Do you speak English?' },
              { finnish: 'Mikä sinun nimesi on?', english: 'What is your name?' },
              { finnish: 'Missä asut?', english: 'Where do you live?' },
            ],
          },
        },
      },
    },
  })

  // A1 Topic 5: Consonant Gradation
  const topic5 = await prisma.topic.create({
    data: {
      title: 'Consonant Gradation',
      description: 'kk→k, pp→p, tt→t changes when adding endings',
      levelId: a1.id,
      order: 5,
      grammarRules: {
        create: {
          title: 'Consonant Gradation',
          explanation: 'Consonants often weaken when adding endings (astevaihtelu).',
          rules: JSON.stringify([
            'kk → k: kauppa → kaupassa',
            'pp → p: kuppi → kupissa',
            'tt → t: katto → katolla',
            'Strong grade in basic form, weak grade in inflected forms',
          ]),
          examples: {
            create: [
              { finnish: 'kauppa → kaupassa', english: 'shop → in the shop' },
              { finnish: 'kuppi → kupissa', english: 'cup → in the cup' },
              { finnish: 'katto → katolla', english: 'roof → on the roof' },
            ],
          },
        },
      },
      memoryAid: {
        create: {
          mnemonic: 'Double to Single when the door closes!',
          explanation: 'When you add an ending that CLOSES the syllable, double consonants become single.',
          quickTips: JSON.stringify([
            'kk → k: kauppa (shop) → kaupassa',
            'pp → p: kuppi (cup) → kupissa',
            'tt → t: katto (roof) → katolla',
          ]),
          colorCode: '#9f7aea',
          icon: '🔄',
        },
      },
    },
  })

  // A1 Topic 6: Partitive Case
  const topic6 = await prisma.topic.create({
    data: {
      title: 'Partitive Case',
      description: 'UNcountable, Negative, Ongoing (UNO method)',
      levelId: a1.id,
      order: 6,
      grammarRules: {
        create: {
          title: 'The Partitive Case (Partitiivi)',
          explanation: 'One of the most important cases in Finnish.',
          rules: JSON.stringify([
            'Uncountable quantity: Juon kahvia (I drink coffee)',
            'After numbers >1: kaksi koiraa (two dogs)',
            'With certain verbs: Rakastan sinua (I love you)',
            'Negative sentences: Minulla ei ole autoa',
          ]),
          examples: {
            create: [
              { finnish: 'Juon kahvia aamulla.', english: 'I drink coffee in the morning.' },
              { finnish: 'Minulla on kaksi koiraa.', english: 'I have two dogs.' },
              { finnish: 'Odotan bussia.', english: 'I am waiting for the bus.' },
            ],
          },
        },
      },
      memoryAid: {
        create: {
          mnemonic: 'U.N.O. - Uncountable, Negative, Ongoing',
          explanation: 'Use partitive for Uncountable items, Negative sentences, and Ongoing actions.',
          quickTips: JSON.stringify([
            '🔵 UNcountable: "some water" → vettä',
            '🔴 Negative: "don\'t have" → ei ole',
            '🟡 Ongoing: "reading a book" → lukemassa',
          ]),
          colorCode: '#ed8936',
          icon: '🎯',
        },
      },
    },
  })

  // A1 Topic 7: Genitive Case
  const topic7 = await prisma.topic.create({
    data: {
      title: 'Genitive Case',
      description: 'Show possession with -n ending',
      levelId: a1.id,
      order: 7,
      grammarRules: {
        create: {
          title: 'Genitive Case (Genetiivi)',
          explanation: 'The genitive case shows possession or belonging.',
          rules: JSON.stringify([
            'Add -n to the word: talo → talon (house\'s)',
            'Personal pronoun genitives: minun (my), sinun (your)',
            'Word order: Possessor + possessed',
          ]),
          examples: {
            create: [
              { finnish: 'Tämä on minun kirjani.', english: 'This is my book.' },
              { finnish: 'Mikaelin auto on punainen.', english: 'Mikael\'s car is red.' },
            ],
          },
        },
      },
    },
  })

  // A1 Topic 8: Location Cases Part 1
  const topic8 = await prisma.topic.create({
    data: {
      title: 'Location Cases: Inessive & Elative',
      description: 'Say where something is (inside) and where from (out of)',
      levelId: a1.id,
      order: 8,
      grammarRules: {
        create: {
          title: 'Inessive and Elative',
          explanation: 'Internal location cases for inside movement.',
          rules: JSON.stringify([
            'Inessive (-ssa/-ssä): where inside? → talossa (in the house)',
            'Elative (-sta/-stä): where from inside? → talosta (from the house)',
          ]),
          examples: {
            create: [
              { finnish: 'Asun Helsingissä.', english: 'I live in Helsinki.' },
              { finnish: 'Tulen Suomesta.', english: 'I come from Finland.' },
            ],
          },
        },
      },
      memoryAid: {
        create: {
          mnemonic: 'SALE - Internal cases: -ssA, -stA, -Vn',
          explanation: 'Internal location cases describe inside movement.',
          quickTips: JSON.stringify([
            '-ssA (in): taloSSA',
            '-stA (from inside): taloSTA',
            '-Vn (into): taloON',
          ]),
          colorCode: '#f56565',
          icon: '🏠',
        },
      },
    },
  })

  // A1 Topic 9: Location Cases Part 2
  const topic9 = await prisma.topic.create({
    data: {
      title: 'Location Cases: Illative & Adessive',
      description: 'Say where to (into) and where on',
      levelId: a1.id,
      order: 9,
      grammarRules: {
        create: {
          title: 'Illative and Adessive',
          explanation: 'Cases for movement into and being on surfaces.',
          rules: JSON.stringify([
            'Illative (-Vn): where into? → taloon (into the house)',
            'Adessive (-lla/-llä): where on? → pöydällä (on the table)',
          ]),
          examples: {
            create: [
              { finnish: 'Menen kauppaan.', english: 'I\'m going to the shop.' },
              { finnish: 'Kirja on pöydällä.', english: 'The book is on the table.' },
            ],
          },
        },
      },
    },
  })

  // A1 Topic 10: Location Cases Part 3
  const topic10 = await prisma.topic.create({
    data: {
      title: 'Location Cases: Ablative & Allative',
      description: 'Say where off and where onto',
      levelId: a1.id,
      order: 10,
      grammarRules: {
        create: {
          title: 'Ablative and Allative',
          explanation: 'Cases for movement off and onto surfaces.',
          rules: JSON.stringify([
            'Ablative (-lta/-ltä): where off/from? → pöydältä',
            'Allative (-lle): where onto? → pöydälle',
          ]),
          examples: {
            create: [
              { finnish: 'Otin kirjan pöydältä.', english: 'I took the book from the table.' },
              { finnish: 'Laitoin kirjan pöydälle.', english: 'I put the book on the table.' },
            ],
          },
        },
      },
    },
  })

  // A1 Topic 11: Essive Case & Postpositions
  const topic11 = await prisma.topic.create({
    data: {
      title: 'Essive Case & Postpositions',
      description: 'Temporary state and location words',
      levelId: a1.id,
      order: 11,
      grammarRules: {
        create: {
          title: 'Essive and Postpositions',
          explanation: 'Essive expresses temporary state. Postpositions indicate location.',
          rules: JSON.stringify([
            'Essive (-na/-nä): as a teacher → opettajana',
            'Postpositions come after noun in genitive: pöydän vieressä',
          ]),
          examples: {
            create: [
              { finnish: 'Työskentelen opettajana.', english: 'I work as a teacher.' },
              { finnish: 'Kissa on pöydän alla.', english: 'The cat is under the table.' },
            ],
          },
        },
      },
    },
  })

  // A1 Topic 12: Numbers & Word Order
  const topic12 = await prisma.topic.create({
    data: {
      title: 'Numbers & Word Order',
      description: 'Count 1-100 and basic sentence structure',
      levelId: a1.id,
      order: 12,
      grammarRules: {
        create: {
          title: 'Numbers and Word Order',
          explanation: 'Learn to count and form basic Finnish sentences.',
          rules: JSON.stringify([
            'Numbers 1-10: yksi, kaksi, kolme, neljä, viisi',
            'Numbers 11-19: yksi-toista (11), kaksi-toista (12)',
            'Tens: kaksikymmentä (20), kolmekymmentä (30)',
            'Word order: Subject - Verb - Object (SVO)',
          ]),
          examples: {
            create: [
              { finnish: 'Minulla on kolme kissaa.', english: 'I have three cats.' },
              { finnish: 'Tänään minä menen kauppaan.', english: 'Today I\'m going to the store.' },
            ],
          },
        },
      },
      vocabulary: {
        create: [
          { finnish: 'yksi', english: 'one', partOfSpeech: 'number', level: 'A1', memoryTip: 'Sounds like "ucky" - lucky number one!' },
          { finnish: 'kaksi', english: 'two', partOfSpeech: 'number', level: 'A1', memoryTip: 'Sounds like "cat see" - two cats see you' },
          { finnish: 'kolme', english: 'three', partOfSpeech: 'number', level: 'A1', memoryTip: 'Sounds like "colme" - three columns' },
        ],
      },
    },
  })

  console.log('✓ 12 A1 topics created\n')

  // ==================== A2 TOPICS (10 topics) ====================
  if (a2) {
    console.log('📖 Creating A2 topics...')

    // A2 Topic 1: Imperfect Tense
    await prisma.topic.create({
      data: {
        title: 'Imperfect Tense (Past)',
        description: 'Learn to talk about past actions',
        levelId: a2.id,
        order: 1,
        grammarRules: {
          create: {
            title: 'Imperfect Tense',
            explanation: 'Use the imperfect tense to talk about completed past actions.',
            rules: JSON.stringify([
              'Add -i- between stem and personal ending',
              'puhua → minä puhuin (I spoke)',
              'Negative: en puhunut (I did not speak)',
            ]),
            examples: {
              create: [
                { finnish: 'Minä puhuin suomea eilen.', english: 'I spoke Finnish yesterday.' },
                { finnish: 'Hän asui Helsingissä.', english: 'He/she lived in Helsinki.' },
              ],
            },
          },
        },
        memoryAid: {
          create: {
            mnemonic: 'Add -i- for Past Tense!',
            explanation: 'The imperfect tense marker is -i- inserted between the stem and personal ending.',
            quickTips: JSON.stringify([
              'puhua → puhu-i-n (I spoke)',
              'juosta → juoksi-n (I ran)',
            ]),
            colorCode: '#4299e1',
            icon: '⏰',
          },
        },
      },
    })

    // A2 Topic 2: Verb Types 2-6
    await prisma.topic.create({
      data: {
        title: 'Verb Types 2-6',
        description: 'Master all verb conjugation patterns',
        levelId: a2.id,
        order: 2,
        grammarRules: {
          create: {
            title: 'All Verb Types',
            explanation: 'Finnish has 6 verb types. Type 1 is most common.',
            rules: JSON.stringify([
              'Type 2: -da/-dä (syödä → syön)',
              'Type 3: -lla/-llä (tulla → tulen)',
              'Type 4: -ata/-ätä (tavata → tapaan)',
              'Type 5: -ita/-itä (tarvita → tarvitsen)',
              'Type 6: -eta/-etä (vanheta → vanhenen)',
            ]),
            examples: {
              create: [
                { finnish: 'Syön aamupalaa.', english: 'I eat breakfast.' },
                { finnish: 'Tulen kotiin.', english: 'I come home.' },
              ],
            },
          },
        },
      },
    })

    // A2 Topic 3: Object Cases
    await prisma.topic.create({
      data: {
        title: 'Object Cases',
        description: 'Nominative, Genitive, and Partitive objects',
        levelId: a2.id,
        order: 3,
        grammarRules: {
          create: {
            title: 'Object Cases',
            explanation: 'Finnish objects can be in nominative, genitive, or partitive case.',
            rules: JSON.stringify([
              'Nominative object: total object (commands)',
              'Genitive object: completed action',
              'Partitive object: incomplete action',
            ]),
            examples: {
              create: [
                { finnish: 'Osta auto!', english: 'Buy a car!' },
                { finnish: 'Ostin auton.', english: 'I bought a car (completely).' },
                { finnish: 'Ostin autoa.', english: 'I was buying a car (incomplete).' },
              ],
            },
          },
        },
      },
    })

    // A2 Topic 4: Plural Forms
    await prisma.topic.create({
      data: {
        title: 'Plural Forms',
        description: 'How to make words plural',
        levelId: a2.id,
        order: 4,
        grammarRules: {
          create: {
            title: 'Plural Forms',
            explanation: 'Finnish has multiple ways to form plurals.',
            rules: JSON.stringify([
              'Plural nominative: add -t (talo → talot)',
              'Plural partitive: add -ja/-jä (talo → taloja)',
              'Plural in location cases: add -i- then case ending',
            ]),
            examples: {
              create: [
                { finnish: 'Talot ovat isoja.', english: 'The houses are big.' },
                { finnish: 'Ostan taloja.', english: 'I buy houses.' },
              ],
            },
          },
        },
      },
    })

    // A2 Topic 5: Temporal Cases
    await prisma.topic.create({
      data: {
        title: 'Temporal Cases',
        description: 'Expressing time in Finnish',
        levelId: a2.id,
        order: 5,
        grammarRules: {
          create: {
            title: 'Temporal Cases',
            explanation: 'Use cases to express time concepts.',
            rules: JSON.stringify([
              'Adessive (-lla): at a specific time (aamulla - in the morning)',
              'Ablative (-lta): from a time (aamulta - from the morning)',
              'Genitive: duration (tunnin - for an hour)',
            ]),
            examples: {
              create: [
                { finnish: 'Herään aamulla.', english: 'I wake up in the morning.' },
                { finnish: 'Nukuin tunnin.', english: 'I slept for an hour.' },
              ],
            },
          },
        },
      },
    })

    // A2 Topic 6-10 (additional topics)
    const a2Topics = [
      { title: 'Abessive Case', description: 'Saying "without" (-tta/-ttä)', order: 6 },
      { title: 'Imperative Mood', description: 'Giving commands and requests', order: 7 },
      { title: 'Comparative Adjectives', description: 'Comparing things (isompi, suurempi)', order: 8 },
      { title: 'Present Perfect', description: 'Past actions with present relevance (olen puhunut)', order: 9 },
      { title: 'Conjunctions', description: 'Connecting sentences (ja, mutta, koska)', order: 10 },
    ]

    for (const topic of a2Topics) {
      await prisma.topic.create({
        data: {
          title: topic.title,
          description: topic.description,
          levelId: a2.id,
          order: topic.order,
        },
      })
    }

    console.log('✓ 10 A2 topics created\n')
  }

  // ==================== B1 TOPICS (8 topics) ====================
  if (b1) {
    console.log('📖 Creating B1 topics...')

    const b1Topics = [
      { title: 'Passive Voice', description: 'Impersonal expressions (puhutaan)', order: 1 },
      { title: 'Conditional Mood', description: 'Would, could, should (puhuisin)', order: 2 },
      { title: 'Comparative & Superlative', description: 'Better, best (parempi, paras)', order: 3 },
      { title: 'Relative Clauses', description: 'Who, which, that (joka)', order: 4 },
      { title: 'Advanced Object Rules', description: 'Complex object cases', order: 5 },
      { title: 'Temporal Clauses', description: 'Before, after, when (ennen kuin)', order: 6 },
      { title: 'Necessive Structure', description: 'Must, have to (minun on tehtävä)', order: 7 },
      { title: 'Reported Speech', description: 'Saying what someone said (että)', order: 8 },
    ]

    for (const topic of b1Topics) {
      await prisma.topic.create({
        data: {
          title: topic.title,
          description: topic.description,
          levelId: b1.id,
          order: topic.order,
        },
      })
    }

    console.log('✓ 8 B1 topics created\n')
  }

  // ==================== B2 TOPICS (8 topics) ====================
  if (b2) {
    console.log('📖 Creating B2 topics...')

    const b2Topics = [
      { title: 'Passive Past Perfect', description: 'Had been spoken (oli puhuttu)', order: 1 },
      { title: 'Passive Conditional', description: 'Would be spoken (puhuttaisiin)', order: 2 },
      { title: 'Four Participles', description: 'Active & passive, present & past', order: 3 },
      { title: 'Participle Constructions', description: 'Using participles as modifiers', order: 4 },
      { title: 'Agent Participle', description: 'The language spoken by (miehen puhuma)', order: 5 },
      { title: 'Temporal Participle', description: 'While speaking (puhuessaan)', order: 6 },
      { title: 'Causative Verbs', description: 'To make someone do (juottaa)', order: 7 },
      { title: 'Derivational Suffixes', description: 'Forming new words', order: 8 },
    ]

    for (const topic of b2Topics) {
      await prisma.topic.create({
        data: {
          title: topic.title,
          description: topic.description,
          levelId: b2.id,
          order: topic.order,
        },
      })
    }

    console.log('✓ 8 B2 topics created\n')
  }

  // ==================== C1 TOPICS (8 topics) ====================
  if (c1) {
    console.log('📖 Creating C1 topics...')

    const c1Topics = [
      { title: 'Prolative Case', description: 'By mail, by sea (postitse, meritse)', order: 1 },
      { title: 'Distributive', description: 'Daily, per child (päivittäin, lapsittain)', order: 2 },
      { title: '5 Infinitives', description: 'All infinitive structures', order: 3 },
      { title: 'Advanced Passive', description: 'Impersonal expressions mastery', order: 4 },
      { title: 'Modal Nuances', description: 'Case differences with modals', order: 5 },
      { title: 'Idiomatic Case Usage', description: 'Get married, break (naimisiin, rikki)', order: 6 },
      { title: 'Reported Speech All Tenses', description: 'Advanced reported speech', order: 7 },
      { title: 'Extended Participles', description: 'Advanced participle constructions', order: 8 },
    ]

    for (const topic of c1Topics) {
      await prisma.topic.create({
        data: {
          title: topic.title,
          description: topic.description,
          levelId: c1.id,
          order: topic.order,
        },
      })
    }

    console.log('✓ 8 C1 topics created\n')
  }

  // ==================== C2 TOPICS (8 topics) ====================
  if (c2) {
    console.log('📖 Creating C2 topics...')

    const c2Topics = [
      { title: 'Long Imperative', description: '3rd person & passive commands', order: 1 },
      { title: 'Archaic Case Uses', description: 'Accusative distinction', order: 2 },
      { title: 'Poetic Paradigms', description: 'Essive plural in -in', order: 3 },
      { title: 'Mood Combinations', description: 'Conditional perfect passive', order: 4 },
      { title: 'Double Passive', description: 'It is said to be (sanotaan olevan)', order: 5 },
      { title: 'Extensive Derived Verbs', description: 'Frequentative, momentane', order: 6 },
      { title: 'Nominalization Chains', description: 'Complex -minen constructions', order: 7 },
      { title: 'Subtle Case Alternation', description: 'Fine semantic distinctions', order: 8 },
    ]

    for (const topic of c2Topics) {
      await prisma.topic.create({
        data: {
          title: topic.title,
          description: topic.description,
          levelId: c2.id,
          order: topic.order,
        },
      })
    }

    console.log('✓ 8 C2 topics created\n')
  }

  // ==================== ADD STATIC QUIZZES ====================
  console.log('📝 Creating sample quizzes...')

  // Get the first A1 topic to add a quiz
  const sampleTopic = await prisma.topic.findFirst({
    where: { levelId: a1.id },
    orderBy: { order: 'asc' },
  })

  if (sampleTopic) {
    await prisma.quiz.create({
      data: {
        title: `${sampleTopic.title} - Quiz`,
        description: `Test your knowledge of ${sampleTopic.title.toLowerCase()}.`,
        topicId: sampleTopic.id,
        passingScore: 70,
        isDynamic: false,
        questions: {
          create: [
            {
              text: 'What does "minä" mean in Finnish?',
              type: 'MULTIPLE_CHOICE',
              options: JSON.stringify(['You', 'I', 'He/She', 'We']),
              correctAnswer: 'I',
              explanation: 'Minä means "I" in Finnish.',
              points: 1,
              order: 1,
            },
            {
              text: 'What does "sinä" mean?',
              type: 'MULTIPLE_CHOICE',
              options: JSON.stringify(['I', 'We', 'You', 'They']),
              correctAnswer: 'You',
              explanation: 'Sinä means "you" (singular informal).',
              points: 1,
              order: 2,
            },
            {
              text: 'What is "hän" in English?',
              type: 'MULTIPLE_CHOICE',
              options: JSON.stringify(['He', 'She', 'It', 'He/She']),
              correctAnswer: 'He/She',
              explanation: 'Hän means both he and she - no gender distinction!',
              points: 1,
              order: 3,
            },
          ],
        },
      },
    })
    console.log('✓ Sample quiz created')
  }

  // ==================== SUMMARY ====================
  console.log('\n🎉 Seeding complete! Summary:')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('📚 Levels: 6 (A1, A2, B1, B2, C1, C2)')
  console.log('📖 A1 Topics: 12 (with grammar, examples, memory aids)')
  console.log('📖 A2 Topics: 10')
  console.log('📖 B1 Topics: 8')
  console.log('📖 B2 Topics: 8')
  console.log('📖 C1 Topics: 8')
  console.log('📖 C2 Topics: 8')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('📝 Total topics created: 54')
  console.log('🔤 Vocabulary words created: 3+')
  console.log('🧠 Memory aids created: 6+')
  console.log('📝 Quizzes created: 1+')
  console.log('\n🐻 Finnish Buddy database is ready!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
