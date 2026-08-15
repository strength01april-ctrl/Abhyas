import type {
  DiagramQuestion,
  EvaluateAnswerRequest,
  GenerateDiagramRequest,
  GenerateMapRequest,
  GenerateQuestionsRequest,
  LongAnswerQuestion,
  MapQuestion,
  McqQuestion,
  Question,
  SessionResult,
  ShortAnswerQuestion,
  Subject,
  AiContentResponse,
  StudyMaterial,
  TrueFalseQuestion,
  FillBlankQuestion,
  QuestionResult,
} from '@/types';
import { DIFFICULTY_DISTRIBUTION } from '@/config/appConfig';

/**
 * AIService — abstraction over a future AI provider (e.g. Gemini).
 *
 * IMPORTANT PRODUCT RULE (source-of-truth):
 * All questions, answers, explanations, map activities, diagram activities
 * and marking criteria must be generated PRIMARILY from the student's supplied
 * study material. The AI must NOT invent content, search the web, or fabricate
 * information when the material is insufficient.
 *
 * These methods are MOCKS. They return clearly marked demo data so the UI can
 * be tested end-to-end. A real implementation will be plugged in behind the
 * same interface, routed through a secure backend — never with API keys in
 * frontend code.
 */

export interface AIService {
  generateQuestions(req: GenerateQuestionsRequest): Promise<AiContentResponse<Question[]>>;
  generateMapActivity(req: GenerateMapRequest): Promise<AiContentResponse<MapQuestion>>;
  generateDiagramActivity(req: GenerateDiagramRequest): Promise<AiContentResponse<DiagramQuestion>>;
  evaluateAnswer(req: EvaluateAnswerRequest): Promise<QuestionResult>;
  evaluateSession(results: QuestionResult[], subject: Subject): SessionResult;
}

// ── Mock data ─────────────────────────────────────────────────────────────────
// Every mock is explicitly tagged so it is never mistaken for real AI output.

const MOCK_TAG = '[MOCK DEMO DATA]';

function mockInsufficient(subject: Subject): AiContentResponse<never> {
  return {
    ok: false,
    reason: 'insufficient-material',
    message: `There is not enough information in this study material to generate reliable ${subject.name} activities. Please upload material that covers the topic you want to practise.`,
  };
}

function difficultySequence(count: number): ('easy' | 'medium' | 'hard')[] {
  const dist = count === 5 ? DIFFICULTY_DISTRIBUTION[5] : DIFFICULTY_DISTRIBUTION[10];
  const seq: ('easy' | 'medium' | 'hard')[] = [];
  for (let i = 0; i < dist.easy; i++) seq.push('easy');
  for (let i = 0; i < dist.medium; i++) seq.push('medium');
  for (let i = 0; i < dist.hard; i++) seq.push('hard');
  return seq;
}

function uid(prefix: string, i: number): string {
  return `${prefix}_mock_${i}_${Math.random().toString(36).slice(2, 6)}`;
}

// ── Mock question bank, keyed loosely by activity ─────────────────────────────

function mockMcqs(req: GenerateQuestionsRequest): McqQuestion[] {
  const { count, subject } = req;
  const diffs = difficultySequence(count);
  const variants: McqQuestion['variant'][] = ['standard', 'application', 'reasoning', 'critical-thinking'];
  const pool: Omit<McqQuestion, 'id' | 'difficulty'>[] = [
    {
      activityType: 'mcq',
      marks: 1,
      prompt: `${MOCK_TAG} Which of the following best describes a key concept from your ${subject.name} material?`,
      options: ['A foundational definition', 'An unrelated fact', 'A personal opinion', 'A random value'],
      correctIndex: 0,
      explanation: 'This option matches the core definition typically found in the supplied material.',
      variant: 'standard',
    },
    {
      activityType: 'mcq',
      marks: 1,
      prompt: `${MOCK_TAG} Applying the concept from your notes, which scenario is correct?`,
      options: ['Scenario that uses the concept correctly', 'Scenario that ignores conditions', 'Scenario with wrong units', 'Scenario from a different topic'],
      correctIndex: 0,
      explanation: 'The correct scenario applies the concept under the conditions described in the material.',
      variant: 'application',
    },
    {
      activityType: 'mcq',
      marks: 1,
      prompt: `${MOCK_TAG} Reasoning: given the relationship described, what follows?`,
      options: ['A logically follows', 'B contradicts the premise', 'C is unrelated', 'D inverts the relationship'],
      correctIndex: 0,
      explanation: 'Only option A follows from the relationship described in the material.',
      variant: 'reasoning',
    },
    {
      activityType: 'mcq',
      marks: 1,
      prompt: `${MOCK_TAG} Critical thinking: which evaluation is most justified by the material?`,
      options: ['A balanced evaluation supported by evidence', 'An extreme claim', 'An unsupported assertion', 'An opinion from outside the material'],
      correctIndex: 0,
      explanation: 'A balanced evaluation grounded in the supplied evidence is the strongest answer.',
      variant: 'critical-thinking',
    },
    {
      activityType: 'mcq',
      marks: 1,
      prompt: `${MOCK_TAG} Which statement is accurate according to the material?`,
      options: ['The precise statement from the material', 'A common misconception', 'A half-truth', 'An inverted statement'],
      correctIndex: 0,
      explanation: 'The precise statement aligns with the supplied material.',
      variant: 'standard',
    },
    {
      activityType: 'mcq',
      marks: 1,
      prompt: `${MOCK_TAG} Which option correctly applies the principle to a new case?`,
      options: ['Correct application', 'Misapplied principle', 'Ignores a constraint', 'Uses a different principle'],
      correctIndex: 0,
      explanation: 'The correct option applies the principle while respecting all constraints.',
      variant: 'application',
    },
    {
      activityType: 'mcq',
      marks: 1,
      prompt: `${MOCK_TAG} Which inference is best supported?`,
      options: ['Well-supported inference', 'Overstated inference', 'Understated inference', 'Unsupported inference'],
      correctIndex: 0,
      explanation: 'The well-supported inference stays within what the material justifies.',
      variant: 'reasoning',
    },
    {
      activityType: 'mcq',
      marks: 1,
      prompt: `${MOCK_TAG} Which critique is most balanced?`,
      options: ['Evidence-based critique', 'Dismissive critique', 'Uncritical praise', 'Off-topic critique'],
      correctIndex: 0,
      explanation: 'An evidence-based critique weighs the points in the material.',
      variant: 'critical-thinking',
    },
    {
      activityType: 'mcq',
      marks: 1,
      prompt: `${MOCK_TAG} Identify the correct definition.`,
      options: ['Correct definition', 'Close but wrong', 'Reversed definition', 'Unrelated term'],
      correctIndex: 0,
      explanation: 'The correct definition matches the material.',
      variant: 'standard',
    },
    {
      activityType: 'mcq',
      marks: 1,
      prompt: `${MOCK_TAG} Choose the option that best extends the idea.`,
      options: ['Reasonable extension', 'Speculative leap', 'Contradiction', 'Tangent'],
      correctIndex: 0,
      explanation: 'A reasonable extension stays grounded in the material.',
      variant: 'application',
    },
  ];
  return diffs.map((d, i) => ({
    ...pool[i % pool.length],
    id: uid('mcq', i),
    difficulty: d,
    variant: variants[i % variants.length],
  }));
}

function mockShortAnswers(req: GenerateQuestionsRequest): ShortAnswerQuestion[] {
  const { count, subject } = req;
  const diffs = difficultySequence(count);
  return diffs.map((d, i) => ({
    id: uid('sa', i),
    activityType: 'short-answer',
    difficulty: d,
    marks: 2,
    prompt: `${MOCK_TAG} In 2–3 sentences, explain a key ${subject.name} idea from your material.`,
    modelAnswer: 'A concise answer covering the definition and one supporting point from the material.',
    keyPoints: ['Core definition', 'One supporting detail from the material'],
    sourceContext: 'Drawn from the supplied study material.',
  }));
}

function mockLongAnswers(req: GenerateQuestionsRequest): LongAnswerQuestion[] {
  const { count, subject } = req;
  const diffs = difficultySequence(count);
  return diffs.map((d, i) => ({
    id: uid('la', i),
    activityType: 'long-answer',
    difficulty: d,
    marks: 5,
    prompt: `${MOCK_TAG} Discuss a major ${subject.name} topic from your material in detail, with examples.`,
    modelAnswer: 'A structured answer: introduction, 3–4 key points with examples, and a conclusion — all grounded in the material.',
    keyPoints: ['Definition of the topic', 'First key point with example', 'Second key point with example', 'Third key point', 'Concluding statement'],
    importantPoints: ['Definition of the topic', 'First key point with example', 'Second key point with example', 'Third key point', 'Concluding statement'],
    sourceContext: 'Drawn from the supplied study material.',
  }));
}

function mockFillBlanks(req: GenerateQuestionsRequest): FillBlankQuestion[] {
  const { count, subject } = req;
  const diffs = difficultySequence(count);
  return diffs.map((d, i) => ({
    id: uid('fb', i),
    activityType: 'fill-blanks',
    difficulty: d,
    marks: 1,
    prompt: `${MOCK_TAG} In ${subject.name}, the process described in your material is called _____.`,
    acceptableAnswers: ['photosynthesis', 'respiration', 'the named process'],
    explanation: 'The blank refers to the named process described in the material.',
  }));
}

function mockTrueFalse(req: GenerateQuestionsRequest): TrueFalseQuestion[] {
  const { count, subject } = req;
  const diffs = difficultySequence(count);
  const pool: Omit<TrueFalseQuestion, 'id' | 'difficulty'>[] = [
    {
      activityType: 'true-false',
      marks: 1,
      correctAnswer: true,
      explanation: 'The statement agrees with the supplied material.',
      prompt: `${MOCK_TAG} ${subject.name} statements in your material are reliable for revision.`,
    },
    {
      activityType: 'true-false',
      marks: 1,
      correctAnswer: false,
      explanation: 'The statement contradicts the supplied material.',
      prompt: `${MOCK_TAG} A concept from your material is unrelated to its topic.`,
    },
    {
      activityType: 'true-false',
      marks: 1,
      correctAnswer: true,
      explanation: 'Supported by the definition in the material.',
      prompt: `${MOCK_TAG} The definition described in your material is accurate.`,
    },
    {
      activityType: 'true-false',
      marks: 1,
      correctAnswer: false,
      explanation: 'The inverse is true according to the material.',
      prompt: `${MOCK_TAG} The inverse of a statement in your material is correct.`,
    },
    {
      activityType: 'true-false',
      marks: 1,
      correctAnswer: true,
      explanation: 'The relationship is stated in the material.',
      prompt: `${MOCK_TAG} A relationship described in your material holds under the given conditions.`,
    },
    {
      activityType: 'true-false',
      marks: 1,
      correctAnswer: false,
      explanation: 'The material specifies a different value.',
      prompt: `${MOCK_TAG} A quantity in your material equals an unrelated value.`,
    },
    {
      activityType: 'true-false',
      marks: 1,
      correctAnswer: true,
      explanation: 'Consistent with the examples in the material.',
      prompt: `${MOCK_TAG} The example in your material illustrates the concept correctly.`,
    },
    {
      activityType: 'true-false',
      marks: 1,
      correctAnswer: false,
      explanation: 'The material states the opposite.',
      prompt: `${MOCK_TAG} A claim in your material is unsupported by its own evidence.`,
    },
    {
      activityType: 'true-false',
      marks: 1,
      correctAnswer: true,
      explanation: 'Stated explicitly in the material.',
      prompt: `${MOCK_TAG} Your material explicitly supports this statement.`,
    },
    {
      activityType: 'true-false',
      marks: 1,
      correctAnswer: false,
      explanation: 'The material gives a different classification.',
      prompt: `${MOCK_TAG} A classification in your material is wrong.`,
    },
  ];
  return diffs.map((d, i) => ({
    ...pool[i % pool.length],
    id: uid('tf', i),
    difficulty: d,
  }));
}

// ── Map & Diagram mock SVGs ───────────────────────────────────────────────────

const BLANK_INDIA_MAP_SVG = `
<svg viewBox="0 0 400 460" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Blank map">
  <rect x="0" y="0" width="400" height="460" fill="#E8ECF1"/>
  <path d="M120 70 C160 50 230 55 270 80 C310 105 330 150 325 200 C320 250 300 300 280 340 C260 380 220 410 180 400 C140 390 110 350 100 300 C90 250 95 200 100 150 C105 120 110 90 120 70 Z" fill="#F4F6F8" stroke="#5B6B82" stroke-width="2"/>
  <path d="M150 200 C180 190 220 195 240 220 C260 245 255 285 230 300 C205 315 170 305 155 280 C140 255 145 225 150 200 Z" fill="#FFFFFF" stroke="#AEB8C6" stroke-width="1.2" stroke-dasharray="4 3"/>
  <text x="200" y="440" text-anchor="middle" font-family="serif" font-size="13" fill="#5B6B82">Blank Map</text>
</svg>`;

const FLOWER_DIAGRAM_SVG = `
<svg viewBox="0 0 400 320" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Flower diagram">
  <rect x="0" y="0" width="400" height="320" fill="#FBFAF7"/>
  <line x1="200" y1="160" x2="200" y2="300" stroke="#44526A" stroke-width="3"/>
  <path d="M200 300 Q230 280 240 250" fill="none" stroke="#44526A" stroke-width="2"/>
  <ellipse cx="240" cy="250" rx="30" ry="12" fill="#AECBED" stroke="#4F84C9" stroke-width="1.5" transform="rotate(30 240 250)"/>
  <ellipse cx="160" cy="110" rx="45" ry="70" fill="#D6E4F5" stroke="#4F84C9" stroke-width="1.5"/>
  <ellipse cx="240" cy="110" rx="45" ry="70" fill="#D6E4F5" stroke="#4F84C9" stroke-width="1.5"/>
  <ellipse cx="120" cy="170" rx="45" ry="70" fill="#D6E4F5" stroke="#4F84C9" stroke-width="1.5" transform="rotate(-30 120 170)"/>
  <ellipse cx="280" cy="170" rx="45" ry="70" fill="#D6E4F5" stroke="#4F84C9" stroke-width="1.5" transform="rotate(30 280 170)"/>
  <circle cx="200" cy="150" r="22" fill="#2B9D94" stroke="#1F7C74" stroke-width="1.5"/>
  <text x="200" y="20" text-anchor="middle" font-family="serif" font-size="13" fill="#44526A">Flower (labels replaced)</text>
</svg>`;

function mockMap(req: GenerateMapRequest): MapQuestion {
  void req;
  return {
    id: uid('map', 0),
    activityType: 'map-work',
    difficulty: 'medium',
    marks: 4,
    prompt: `${MOCK_TAG} Identify the four marked locations on the blank map.`,
    mapImageName: 'Blank outline map',
    mapSvg: BLANK_INDIA_MAP_SVG,
    locations: [
      { id: 'locA', label: 'A', x: 52, y: 28, acceptableAnswers: ['Northern region', 'North'] },
      { id: 'locB', label: 'B', x: 72, y: 55, acceptableAnswers: ['Eastern region', 'East'] },
      { id: 'locC', label: 'C', x: 30, y: 60, acceptableAnswers: ['Western region', 'West'] },
      { id: 'locD', label: 'D', x: 50, y: 82, acceptableAnswers: ['Southern region', 'South'] },
    ],
  };
}

function mockDiagram(req: GenerateDiagramRequest): DiagramQuestion {
  void req;
  return {
    id: uid('diag', 0),
    activityType: 'diagram-work',
    difficulty: 'medium',
    marks: 4,
    prompt: `${MOCK_TAG} Identify the four labelled parts of the flower.`,
    diagramName: 'Flower',
    diagramSvg: FLOWER_DIAGRAM_SVG,
    labels: [
      { id: 'lblA', label: 'A', x: 40, y: 35, acceptableAnswers: ['Petal', 'Petals'] },
      { id: 'lblB', label: 'B', x: 50, y: 47, acceptableAnswers: ['Stamen', 'Anther'] },
      { id: 'lblC', label: 'C', x: 60, y: 70, acceptableAnswers: ['Stem', 'Stalk'] },
      { id: 'lblD', label: 'C', x: 70, y: 78, acceptableAnswers: ['Leaf', 'Leaves'] },
    ],
  };
}

// ── Mock evaluation ───────────────────────────────────────────────────────────

function normalize(s: string): string {
  return s.trim().toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '').replace(/\s+/g, ' ');
}

function evaluateMock(req: EvaluateAnswerRequest): QuestionResult {
  const { question, userAnswer } = req;
  const base = {
    questionId: question.id,
    maxMarks: question.marks,
    userAnswer: typeof userAnswer === 'string' ? userAnswer : String(userAnswer ?? ''),
  };

  switch (question.activityType) {
    case 'mcq': {
      const idx = typeof userAnswer === 'number' ? userAnswer : -1;
      const isCorrect = idx === question.correctIndex;
      return {
        ...base,
        awarded: isCorrect ? 1 : 0,
        isCorrect,
        correctAnswer: question.options[question.correctIndex],
        userAnswer: idx >= 0 ? question.options[idx] : '—',
        explanation: question.explanation,
      };
    }
    case 'true-false': {
      const ans = userAnswer === true || userAnswer === 'true';
      const isCorrect = ans === question.correctAnswer;
      return {
        ...base,
        awarded: isCorrect ? 1 : 0,
        isCorrect,
        correctAnswer: question.correctAnswer ? 'True' : 'False',
        userAnswer: ans ? 'True' : 'False',
        explanation: question.explanation,
      };
    }
    case 'fill-blanks': {
      const ans = normalize(String(userAnswer ?? ''));
      const isCorrect = question.acceptableAnswers.some((a) => normalize(a) === ans);
      return {
        ...base,
        awarded: isCorrect ? 1 : 0,
        isCorrect,
        correctAnswer: question.acceptableAnswers[0],
        explanation: question.explanation,
      };
    }
    case 'short-answer': {
      // Mock partial marking out of 2: 0, 0.5, 1, 1.5, 2
      const text = normalize(String(userAnswer ?? ''));
      const hits = question.keyPoints.filter((kp) => text.includes(normalize(kp).split(' ')[0])).length;
      const ratio = Math.min(hits / question.keyPoints.length, 1);
      const awarded = Math.round(ratio * 4) / 2; // 0..2 in 0.5 steps
      return {
        ...base,
        awarded,
        isCorrect: awarded >= 1.5,
        correctAnswer: question.modelAnswer,
        keyPointsIncluded: question.keyPoints.slice(0, hits),
        keyPointsMissed: question.keyPoints.slice(hits),
      };
    }
    case 'long-answer': {
      const text = normalize(String(userAnswer ?? ''));
      const hits = question.importantPoints.filter((kp) => text.includes(normalize(kp).split(' ')[0])).length;
      const ratio = Math.min(hits / question.importantPoints.length, 1);
      const awarded = Math.round(ratio * 5 * 2) / 2; // 0..5 in 0.5 steps
      return {
        ...base,
        awarded,
        isCorrect: awarded >= 4,
        correctAnswer: question.modelAnswer,
        keyPointsIncluded: question.importantPoints.slice(0, hits),
        keyPointsMissed: question.importantPoints.slice(hits),
      };
    }
    case 'map-work': {
      const ans = (userAnswer as Record<string, string> | null) ?? {};
      let correct = 0;
      const included: string[] = [];
      const missed: string[] = [];
      for (const loc of question.locations) {
        const got = normalize(ans[loc.id] ?? '');
        if (loc.acceptableAnswers.some((a) => normalize(a) === got)) {
          correct += 1;
          included.push(`${loc.label}: ${loc.acceptableAnswers[0]}`);
        } else {
          missed.push(`${loc.label}: ${loc.acceptableAnswers[0]}`);
        }
      }
      return {
        ...base,
        awarded: correct,
        isCorrect: correct === question.locations.length,
        correctAnswer: question.locations.map((l) => `${l.label} = ${l.acceptableAnswers[0]}`).join(', '),
        keyPointsIncluded: included,
        keyPointsMissed: missed,
      };
    }
    case 'diagram-work': {
      const ans = (userAnswer as Record<string, string> | null) ?? {};
      let correct = 0;
      const included: string[] = [];
      const missed: string[] = [];
      for (const lbl of question.labels) {
        const got = normalize(ans[lbl.id] ?? '');
        if (lbl.acceptableAnswers.some((a) => normalize(a) === got)) {
          correct += 1;
          included.push(`${lbl.label}: ${lbl.acceptableAnswers[0]}`);
        } else {
          missed.push(`${lbl.label}: ${lbl.acceptableAnswers[0]}`);
        }
      }
      return {
        ...base,
        awarded: correct,
        isCorrect: correct === question.labels.length,
        correctAnswer: question.labels.map((l) => `${l.label} = ${l.acceptableAnswers[0]}`).join(', '),
        keyPointsIncluded: included,
        keyPointsMissed: missed,
      };
    }
    default:
      return { ...base, awarded: 0, isCorrect: false };
  }
}

function buildSessionResult(results: QuestionResult[], subject: Subject): SessionResult {
  const totalAwarded = results.reduce((s, r) => s + r.awarded, 0);
  const totalMarks = results.reduce((s, r) => s + r.maxMarks, 0);
  const percentage = totalMarks > 0 ? Math.round((totalAwarded / totalMarks) * 1000) / 10 : 0;
  const correctCount = results.filter((r) => r.isCorrect).length;

  const missed = results.flatMap((r) => r.keyPointsMissed ?? []);
  const areas = missed.length
    ? Array.from(new Set(missed)).slice(0, 4)
    : ['Keep revising the topics covered in this set.'];

  let feedback: string;
  if (percentage >= 90) feedback = `Outstanding work in ${subject.name}. Your grasp of the material is strong.`;
  else if (percentage >= 75) feedback = `Good performance in ${subject.name}. Solid understanding with a few gaps to tighten.`;
  else if (percentage >= 50) feedback = `Fair effort in ${subject.name}. Review the missed points and try again.`;
  else feedback = `Keep going. Revisit the material and attempt another set to build confidence.`;

  return {
    totalAwarded,
    totalMarks,
    percentage,
    correctCount,
    totalCount: results.length,
    perQuestion: results,
    areasNeedingImprovement: areas,
    feedback,
  };
}

// ── Concrete mock service ─────────────────────────────────────────────────────

export const mockAIService: AIService = {
  async generateQuestions(req: GenerateQuestionsRequest): Promise<AiContentResponse<Question[]>> {
    // Simulate async + occasional insufficient-material refusal for 'other' with empty text.
    await delay(450);
    const hasContent = (req.material.extractedText ?? '').trim().length > 0 || req.material.status === 'ready';
    if (!hasContent && req.material.status === 'error') {
      return mockInsufficient(req.subject) as AiContentResponse<Question[]>;
    }
    let questions: Question[];
    switch (req.activity.id) {
      case 'mcq': questions = mockMcqs(req); break;
      case 'short-answer': questions = mockShortAnswers(req); break;
      case 'long-answer': questions = mockLongAnswers(req); break;
      case 'fill-blanks': questions = mockFillBlanks(req); break;
      case 'true-false': questions = mockTrueFalse(req); break;
      default: questions = mockMcqs(req);
    }
    return { ok: true, content: questions };
  },

  async generateMapActivity(req: GenerateMapRequest): Promise<AiContentResponse<MapQuestion>> {
    await delay(500);
    if (req.subject.id !== 'social-science' && req.subject.id === 'other') {
      return {
        ok: false,
        reason: 'insufficient-material',
        message: 'Map Work needs map-relevant information in your material. Please upload material that contains locations to identify.',
      };
    }
    return { ok: true, content: mockMap(req) };
  },

  async generateDiagramActivity(req: GenerateDiagramRequest): Promise<AiContentResponse<DiagramQuestion>> {
    await delay(500);
    if (req.subject.id === 'english') {
      return {
        ok: false,
        reason: 'insufficient-material',
        message: 'Diagram Work needs a diagram in your material. Please upload material that contains labelled diagrams.',
      };
    }
    return { ok: true, content: mockDiagram(req) };
  },

  async evaluateAnswer(req: EvaluateAnswerRequest): Promise<QuestionResult> {
    await delay(150);
    return evaluateMock(req);
  },

  evaluateSession(results: QuestionResult[], subject: Subject): SessionResult {
    return buildSessionResult(results, results.length ? subject : { id: 'other', name: 'this subject' } as Subject);
  },
};

function delay(ms: number): Promise<void> {
  return new Promise((res) => setTimeout(res, ms));
}

/**
 * The active service used across the app. Today it is the mock; a future
 * real provider can be swapped in here (or injected) without touching the UI.
 */
export const aiService: AIService = mockAIService;

/**
 * Future factory hook — when a real backend exists, replace this with the
 * provider-backed implementation (e.g. Gemini via a secure API route).
 */
export function createAIService(): AIService {
  return mockAIService;
}

// Re-export for convenience so callers can import from the service barrel.
export type { StudyMaterial };
