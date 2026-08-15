import { useMemo, useState } from 'react';
import {
  Trophy,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Home,
  ChevronDown,
  Sparkles,
  Target,
  TrendingUp,
} from 'lucide-react';
import type { ActivityType, QuestionResult, SessionResult, StudyMaterial, Subject } from '@/types';
import { aiService } from '@/services/aiService';
import { Celebration } from '@/components/ui/Celebration';
import { SubjectIllustration } from '@/components/SubjectIllustration';

interface ResultsScreenProps {
  subject: Subject;
  material: StudyMaterial | undefined;
  activity: ActivityType;
  results: QuestionResult[];
  onRetry: () => void;
  onHome: () => void;
}

export function ResultsScreen({ subject, activity, results, onRetry, onHome }: ResultsScreenProps) {
  const session: SessionResult = useMemo(
    () => aiService.evaluateSession(results, subject),
    [results, subject],
  );

  const tier = getTier(session.percentage);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      <Celebration percentage={session.percentage} />

      {/* Summary card */}
      <div className="card p-6 sm:p-8 text-center relative overflow-hidden">
        <div className={`absolute inset-x-0 top-0 h-1.5 ${tier.bar}`} />
        <div className="mx-auto w-16 h-16 rounded-2xl bg-brand-50 border border-brand-100 p-2">
          <SubjectIllustration subjectId={subject.id} className="w-full h-full" />
        </div>
        <h1 className="mt-4 text-2xl font-semibold text-navy-900">{subject.name} — Results</h1>
        <p className="text-sm text-bluegrey-600 mt-1">{activityLabel(activity)}</p>

        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Stat label="Marks" value={`${session.totalAwarded}/${session.totalMarks}`} />
          <Stat label="Percentage" value={`${session.percentage}%`} highlight={tier.color} />
          <Stat label="Correct" value={`${session.correctCount}/${session.totalCount}`} />
          <Stat label="Result" value={tier.label} highlight={tier.color} />
        </div>

        {/* Progress ring-ish bar */}
        <div className="mt-6">
          <div className="h-3 rounded-full bg-cool-100 overflow-hidden max-w-md mx-auto">
            <div className={`h-full ${tier.bar} transition-all duration-700`} style={{ width: `${session.percentage}%` }} />
          </div>
        </div>

        {session.percentage >= 80 && (
          <div className="mt-5 inline-flex items-center gap-2 chip bg-success-50 text-success-700 border border-success-100">
            <Trophy size={14} /> {session.percentage >= 100 ? 'Perfect score! Outstanding work.' : 'Great work — well above target.'}
          </div>
        )}

        <p className="mt-4 text-sm text-navy-800 max-w-xl mx-auto leading-relaxed">{session.feedback}</p>

        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button className="btn-primary" onClick={onRetry}><RotateCcw size={16} /> Practise again</button>
          <button className="btn-secondary" onClick={onHome}><Home size={16} /> Back to Home</button>
        </div>
      </div>

      {/* Areas needing improvement */}
      <div className="mt-5 card p-5">
        <div className="flex items-center gap-2 mb-3">
          <Target size={18} className="text-brand-600" />
          <h2 className="font-semibold text-navy-800">Areas needing improvement</h2>
        </div>
        <ul className="space-y-2">
          {session.areasNeedingImprovement.map((a, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-bluegrey-700">
              <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-brand-500 mt-2" />
              {a}
            </li>
          ))}
        </ul>
      </div>

      {/* Per-question review */}
      <div className="mt-5 card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={18} className="text-brand-600" />
          <h2 className="font-semibold text-navy-800">Review answers</h2>
        </div>
        <div className="space-y-3">
          {session.perQuestion.map((r, i) => (
            <QuestionReview key={r.questionId} index={i} result={r} />
          ))}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-2 text-xs text-bluegrey-500">
        <TrendingUp size={14} /> No negative marking was applied to this set.
      </div>
    </div>
  );
}

function Stat({ label, value, highlight }: { label: string; value: string; highlight?: string }) {
  return (
    <div className="rounded-xl bg-ivory-50 border border-cool-100 p-3">
      <div className={`text-lg font-semibold ${highlight ?? 'text-navy-900'}`}>{value}</div>
      <div className="text-xs text-bluegrey-600 mt-0.5">{label}</div>
    </div>
  );
}

function QuestionReview({ index, result }: { index: number; result: QuestionResult }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-cool-100 overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 p-3 text-left hover:bg-ivory-50 transition-colors"
        aria-expanded={open}
      >
        <span className={`shrink-0 ${result.isCorrect ? 'text-success-600' : 'text-error-500'}`}>
          {result.isCorrect ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
        </span>
        <span className="text-sm font-medium text-navy-800 flex-1 truncate">
          Question {index + 1}
        </span>
        <span className="text-sm tabular-nums text-bluegrey-600">
          {formatMarks(result.awarded)}/{result.maxMarks}
        </span>
        <ChevronDown size={16} className={`text-cool-300 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="p-4 border-t border-cool-100 bg-ivory-50 space-y-3 text-sm">
          {result.userAnswer !== undefined && (
            <Row label="Your answer" value={String(result.userAnswer) || '—'} />
          )}
          {result.correctAnswer && (
            <Row label="Correct answer" value={result.correctAnswer} accent="text-success-700" />
          )}
          {result.explanation && (
            <Row label="Explanation" value={result.explanation} />
          )}
          {result.keyPointsIncluded && result.keyPointsIncluded.length > 0 && (
            <List label="Important points included" items={result.keyPointsIncluded} tone="success" />
          )}
          {result.keyPointsMissed && result.keyPointsMissed.length > 0 && (
            <List label="Important points missed" items={result.keyPointsMissed} tone="error" />
          )}
          {result.spellingCorrections && result.spellingCorrections.length > 0 && (
            <List label="Spelling corrections" items={result.spellingCorrections} tone="warning" />
          )}
          {result.grammarCorrections && result.grammarCorrections.length > 0 && (
            <List label="Grammar corrections" items={result.grammarCorrections} tone="warning" />
          )}
          {result.terminologyCorrections && result.terminologyCorrections.length > 0 && (
            <List label="Terminology corrections" items={result.terminologyCorrections} tone="warning" />
          )}
        </div>
      )}
    </div>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wide text-bluegrey-500 mb-0.5">{label}</div>
      <div className={`text-navy-800 ${accent ?? ''}`}>{value}</div>
    </div>
  );
}

function List({ label, items, tone }: { label: string; items: string[]; tone: 'success' | 'error' | 'warning' }) {
  const dot = tone === 'success' ? 'bg-success-500' : tone === 'error' ? 'bg-error-500' : 'bg-warning-500';
  return (
    <div>
      <div className="text-xs uppercase tracking-wide text-bluegrey-500 mb-1">{label}</div>
      <ul className="space-y-1">
        {items.map((it, i) => (
          <li key={i} className="flex items-start gap-2 text-navy-800">
            <span className={`shrink-0 w-1.5 h-1.5 rounded-full ${dot} mt-2`} />
            {it}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ── helpers ───────────────────────────────────────────────────────────────────

function getTier(p: number): { label: string; color: string; bar: string } {
  if (p >= 90) return { label: 'Excellent', color: 'text-success-700', bar: 'bg-success-500' };
  if (p >= 75) return { label: 'Good', color: 'text-brand-600', bar: 'bg-brand-500' };
  if (p >= 50) return { label: 'Fair', color: 'text-warning-600', bar: 'bg-warning-500' };
  return { label: 'Needs work', color: 'text-error-600', bar: 'bg-error-500' };
}

function activityLabel(a: ActivityType): string {
  switch (a) {
    case 'mcq': return 'Multiple Choice Questions';
    case 'short-answer': return 'Short Answer Questions';
    case 'long-answer': return 'Long Answer Questions';
    case 'fill-blanks': return 'Fill in the Blanks';
    case 'true-false': return 'True / False';
    case 'map-work': return 'Map Work';
    case 'diagram-work': return 'Diagram Work';
  }
}

function formatMarks(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(1);
}
