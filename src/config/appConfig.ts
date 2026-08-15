import type {
  ActivityDefinition,
  ActivityType,
  DifficultyDistribution,
  QuestionCount,
  Subject,
  SubjectId,
} from '@/types';

// ── Subjects ──────────────────────────────────────────────────────────────────

export const SUBJECTS: Subject[] = [
  {
    id: 'english',
    name: 'English',
    shortDescription: 'Literature, comprehension, grammar and writing skills.',
    accent: 'strawberry',
    icon: 'BookOpen',
    illustrationTag: 'dictionary-novel',
  },
  {
    id: 'science',
    name: 'Science',
    shortDescription: 'Physics, Chemistry and Biology — concepts, diagrams and experiments.',
    accent: 'teal',
    icon: 'Microscope',
    illustrationTag: 'microscope-cell',
  },
  {
    id: 'social-science',
    name: 'Social Science',
    shortDescription: 'History, Geography and Civics explored together through maps and sources.',
    accent: 'indigo',
    icon: 'Globe',
    illustrationTag: 'globe-map',
  },
  {
    id: 'computer-tech',
    name: 'Computer & Technology',
    shortDescription: 'Computing, networks, AI and digital concepts.',
    accent: 'brand',
    icon: 'Cpu',
    illustrationTag: 'circuit-network',
  },
  {
    id: 'other',
    name: 'Other Subject',
    shortDescription: 'GK, Environmental Studies, or any specialised subject of your choice.',
    accent: 'wine',
    icon: 'Library',
    illustrationTag: 'open-book-neutral',
  },
];

export const SUBJECT_MAP: Record<SubjectId, Subject> = SUBJECTS.reduce(
  (acc, s) => {
    acc[s.id] = s;
    return acc;
  },
  {} as Record<SubjectId, Subject>,
);

export function getSubject(id: SubjectId): Subject {
  return SUBJECT_MAP[id];
}

// ── Activities ────────────────────────────────────────────────────────────────

export const ACTIVITIES: ActivityDefinition[] = [
  {
    id: 'mcq',
    name: 'MCQs',
    description: 'Multiple-choice questions, including critical-thinking and application-based items.',
    marksPerQuestion: 1,
    supportsPartialMarks: false,
    perQuestion: true,
    icon: 'ListChecks',
  },
  {
    id: 'short-answer',
    name: 'Short Answer',
    description: 'Brief written answers, marked out of 2 with partial credit.',
    marksPerQuestion: 2,
    supportsPartialMarks: true,
    perQuestion: true,
    icon: 'PenLine',
  },
  {
    id: 'long-answer',
    name: 'Long Answer',
    description: 'Detailed written answers, marked out of 5 with partial credit.',
    marksPerQuestion: 5,
    supportsPartialMarks: true,
    perQuestion: true,
    icon: 'AlignLeft',
  },
  {
    id: 'fill-blanks',
    name: 'Fill in the Blanks',
    description: 'Type the missing word or phrase. Reasonable equivalents accepted.',
    marksPerQuestion: 1,
    supportsPartialMarks: false,
    perQuestion: true,
    icon: 'TextCursorInput',
  },
  {
    id: 'true-false',
    name: 'True / False',
    description: 'Decide whether each statement is true or false.',
    marksPerQuestion: 1,
    supportsPartialMarks: false,
    perQuestion: true,
    icon: 'ToggleLeft',
  },
  {
    id: 'map-work',
    name: 'Map Work',
    description: 'Identify marked locations (A, B, C, D) on a blank map.',
    marksPerQuestion: 1,
    supportsPartialMarks: false,
    perQuestion: false,
    icon: 'Map',
  },
  {
    id: 'diagram-work',
    name: 'Diagram Work',
    description: 'Identify labelled parts (A, B, C, D) on a diagram.',
    marksPerQuestion: 1,
    supportsPartialMarks: false,
    perQuestion: false,
    icon: 'Shapes',
  },
];

export const ACTIVITY_MAP: Record<ActivityType, ActivityDefinition> = ACTIVITIES.reduce(
  (acc, a) => {
    acc[a.id] = a;
    return acc;
  },
  {} as Record<ActivityType, ActivityDefinition>,
);

export function getActivity(id: ActivityType): ActivityDefinition {
  return ACTIVITY_MAP[id];
}

// ── Subject-specific activities ───────────────────────────────────────────────
// Not every activity makes sense for every subject. Map Work is only shown for
// Social Science and Other; Diagram Work is hidden for English. Cards that are
// not relevant are omitted entirely (not disabled).

export const SUBJECT_ACTIVITIES: Record<SubjectId, ActivityType[]> = {
  english: ['mcq', 'short-answer', 'long-answer', 'fill-blanks', 'true-false'],
  science: ['mcq', 'short-answer', 'long-answer', 'fill-blanks', 'true-false', 'diagram-work'],
  'social-science': ['mcq', 'short-answer', 'long-answer', 'fill-blanks', 'true-false', 'map-work', 'diagram-work'],
  'computer-tech': ['mcq', 'short-answer', 'long-answer', 'fill-blanks', 'true-false', 'diagram-work'],
  other: ['mcq', 'short-answer', 'long-answer', 'fill-blanks', 'true-false', 'map-work', 'diagram-work'],
};

export function getActivitiesForSubject(id: SubjectId): ActivityDefinition[] {
  return SUBJECT_ACTIVITIES[id].map((aId) => ACTIVITY_MAP[aId]);
}

// ── Question counts ───────────────────────────────────────────────────────────

export const QUESTION_COUNTS: QuestionCount[] = [5, 10];

// ── Difficulty distribution ───────────────────────────────────────────────────
// Per spec: 5 questions → 2 Easy, 2 Medium, 1 Hard.
//           10 questions → 3 Easy, 5 Medium, 2 Hard.

export const DIFFICULTY_DISTRIBUTION: Record<QuestionCount, DifficultyDistribution> = {
  5: { easy: 2, medium: 2, hard: 1 },
  10: { easy: 3, medium: 5, hard: 2 },
};

// ── Study material limits ─────────────────────────────────────────────────────

export const MAX_MATERIALS = 10;

export const ACCEPTED_MIME_TYPES = ['application/pdf', 'image/jpeg', 'image/jpg'];

export const ACCEPTED_EXTENSIONS = ['pdf', 'jpg', 'jpeg'];

/**
 * Configurable processing-limit architecture.
 * A future AI service can inspect these hints to decide whether a file is
 * too large to process in one go. Nothing here is a hard product limit.
 */
export const PROCESSING_LIMITS = {
  /** Soft byte limit above which we warn the student. */
  warnBytes: 8 * 1024 * 1024, // 8 MB
  /** Bytes above which mock status becomes "too-large" for demonstration. */
  mockTooLargeBytes: 15 * 1024 * 1024, // 15 MB
  /** Human-readable message shown when a file is too large. */
  tooLargeMessage:
    'This study material is too large to process in one go. Please divide it into smaller parts.',
} as const;
