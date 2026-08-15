// ── Core domain types for ABHYAS ──────────────────────────────────────────────

export type SubjectId =
  | 'english'
  | 'science'
  | 'social-science'
  | 'computer-tech'
  | 'other';

export interface Subject {
  id: SubjectId;
  name: string;
  shortDescription: string;
  /** Accent colour token used for subject identity across the app. */
  accent: 'brand' | 'teal' | 'indigo' | 'wine' | 'strawberry';
  /** Lucide icon name used for the subject. */
  icon: string;
  illustrationTag: string;
}

export type ActivityType =
  | 'mcq'
  | 'short-answer'
  | 'long-answer'
  | 'fill-blanks'
  | 'true-false'
  | 'map-work'
  | 'diagram-work';

export interface ActivityDefinition {
  id: ActivityType;
  name: string;
  description: string;
  marksPerQuestion: number;
  supportsPartialMarks: boolean;
  /** Whether this activity is answered one-question-at-a-time. */
  perQuestion: boolean;
  icon: string;
}

export type Difficulty = 'easy' | 'medium' | 'hard';

export type QuestionCount = 5 | 10;

/** Difficulty distribution for a given question count. */
export interface DifficultyDistribution {
  easy: number;
  medium: number;
  hard: number;
}

// ── Study materials ───────────────────────────────────────────────────────────

export type FileKind = 'pdf' | 'image';
export type ProcessingStatus = 'ready' | 'processing' | 'too-large' | 'error';

export interface StudyMaterial {
  id: string;
  name: string;
  subjectId: SubjectId;
  fileName: string;
  fileKind: FileKind;
  fileExtension: string;
  /** Approximate byte size of the source file. */
  sizeBytes: number;
  uploadedAt: number;
  status: ProcessingStatus;
  /** Optional textual note the student added. */
  note?: string;
  /** Stored text extracted from the file (future: AI extraction). */
  extractedText?: string;
}

// ── Questions & evaluation ────────────────────────────────────────────────────

export interface BaseQuestion {
  id: string;
  activityType: ActivityType;
  difficulty: Difficulty;
  marks: number;
  prompt: string;
  /** Optional context/excerpt drawn from the study material. */
  sourceContext?: string;
}

export interface McqQuestion extends BaseQuestion {
  activityType: 'mcq';
  options: string[];
  /** Index of the correct option. Mock-only; real value comes from AI. */
  correctIndex: number;
  explanation: string;
  /** Critical-thinking / application-based variant tag. */
  variant?: 'standard' | 'application' | 'reasoning' | 'critical-thinking';
}

export interface TrueFalseQuestion extends BaseQuestion {
  activityType: 'true-false';
  correctAnswer: boolean;
  explanation: string;
}

export interface FillBlankQuestion extends BaseQuestion {
  activityType: 'fill-blanks';
  /** Acceptable answers (case-insensitive match by mock checker). */
  acceptableAnswers: string[];
  explanation: string;
}

export interface ShortAnswerQuestion extends BaseQuestion {
  activityType: 'short-answer';
  modelAnswer: string;
  keyPoints: string[];
}

export interface LongAnswerQuestion extends BaseQuestion {
  activityType: 'long-answer';
  modelAnswer: string;
  keyPoints: string[];
  /** Points whose inclusion earns partial credit. */
  importantPoints: string[];
}

export type Question =
  | McqQuestion
  | TrueFalseQuestion
  | FillBlankQuestion
  | ShortAnswerQuestion
  | LongAnswerQuestion
  | MapQuestion
  | DiagramQuestion;

// ── Map & Diagram work ────────────────────────────────────────────────────────

export interface MapLocation {
  id: string;
  label: string; // A, B, C, D
  /** x/y in percentages relative to map image dimensions. */
  x: number;
  y: number;
  acceptableAnswers: string[];
}

export interface MapQuestion extends BaseQuestion {
  activityType: 'map-work';
  mapImageName: string;
  /** SVG path data for the blank map. */
  mapSvg: string;
  locations: MapLocation[];
}

export interface DiagramLabel {
  id: string;
  label: string; // A, B, C, D
  /** x/y in percentages relative to diagram dimensions. */
  x: number;
  y: number;
  acceptableAnswers: string[];
}

export interface DiagramQuestion extends BaseQuestion {
  activityType: 'diagram-work';
  diagramName: string;
  /** SVG markup for the diagram (with labels replaced by letters). */
  diagramSvg: string;
  labels: DiagramLabel[];
}

// ── Evaluation results ────────────────────────────────────────────────────────

export interface QuestionResult {
  questionId: string;
  awarded: number;
  maxMarks: number;
  isCorrect: boolean;
  correctAnswer?: string;
  userAnswer?: string;
  explanation?: string;
  keyPointsIncluded?: string[];
  keyPointsMissed?: string[];
  spellingCorrections?: string[];
  grammarCorrections?: string[];
  terminologyCorrections?: string[];
}

export interface SessionResult {
  totalAwarded: number;
  totalMarks: number;
  percentage: number;
  correctCount: number;
  totalCount: number;
  perQuestion: QuestionResult[];
  areasNeedingImprovement: string[];
  feedback: string;
}

// ── AI service contracts (placeholder) ────────────────────────────────────────

export interface GenerateQuestionsRequest {
  subject: Subject;
  material: StudyMaterial;
  activity: ActivityDefinition;
  count: QuestionCount;
  distribution: DifficultyDistribution;
}

export interface GenerateMapRequest {
  subject: Subject;
  material: StudyMaterial;
  count: QuestionCount;
}

export interface GenerateDiagramRequest {
  subject: Subject;
  material: StudyMaterial;
  count: QuestionCount;
}

export interface EvaluateAnswerRequest {
  question: Question;
  userAnswer: string | number | boolean | Record<string, string> | null;
  subject: Subject;
}

/** Source-of-truth response envelope: either content or a grounded refusal. */
export type AiContentResponse<T> =
  | { ok: true; content: T }
  | { ok: false; reason: 'insufficient-material' | 'too-large' | 'unavailable'; message: string };
