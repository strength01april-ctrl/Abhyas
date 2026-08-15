import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Loader2,
  AlertTriangle,
  Send,
} from 'lucide-react';
import type {
  ActivityType,
  DiagramQuestion,
  MapQuestion,
  Question,
  QuestionResult,
  StudyMaterial,
  Subject,
} from '@/types';
import { getActivity, DIFFICULTY_DISTRIBUTION } from '@/config/appConfig';
import { aiService } from '@/services/aiService';
import { sound } from '@/services/sound';
import { SubjectHeader } from './ActivitySelectScreen';
import { MapWorkPanel } from '@/components/activities/MapWorkPanel';
import { DiagramWorkPanel } from '@/components/activities/DiagramWorkPanel';

interface SessionScreenProps {
  subject: Subject;
  material: StudyMaterial;
  activity: ActivityType;
  count: 5 | 10;
  onComplete: (results: QuestionResult[]) => void;
  onBack: () => void;
}

type AnswerMap = Record<string, string | number | boolean | Record<string, string> | null>;

export function SessionScreen({ subject, material, activity, count, onComplete, onBack }: SessionScreenProps) {
  const def = getActivity(activity);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      setLoadError(null);
      try {
        if (def.id === 'map-work') {
          const res = await aiService.generateMapActivity({ subject, material, count });
          if (!active) return;
          if (!res.ok) { setLoadError(res.message); setLoading(false); return; }
          setQuestions([res.content]);
        } else if (def.id === 'diagram-work') {
          const res = await aiService.generateDiagramActivity({ subject, material, count });
          if (!active) return;
          if (!res.ok) { setLoadError(res.message); setLoading(false); return; }
          setQuestions([res.content]);
        } else {
          const res = await aiService.generateQuestions({ subject, material, activity: def, count, distribution: DIFFICULTY_DISTRIBUTION[count] });
          if (!active) return;
          if (!res.ok) { setLoadError(res.message); setLoading(false); return; }
          setQuestions(res.content);
        }
      } catch {
        if (active) setLoadError('Something went wrong while preparing your activity. Please try again.');
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [def, subject, material, count]);

  const total = def.perQuestion ? questions.length : 1;
  const q = questions[current];
  const isLast = current === total - 1;

  const setAnswer = (val: AnswerMap[string]) => {
    setAnswers((prev) => ({ ...prev, [q?.id ?? '']: val }));
  };

  const handleNext = () => {
    if (current < total - 1) {
      sound.submit();
      setCurrent((c) => c + 1);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    sound.submit();
    const results: QuestionResult[] = [];
    for (const question of questions) {
      const ans = answers[question.id] ?? null;
      const r = await aiService.evaluateAnswer({ question, userAnswer: ans, subject });
      results.push(r);
    }
    sound.complete();
    setSubmitting(false);
    onComplete(results);
  };

  const canProceed = useMemo(() => {
    if (!q) return false;
    const a = answers[q.id];
    if (def.id === 'mcq') return typeof a === 'number';
    if (def.id === 'true-false') return a === true || a === false;
    if (def.id === 'fill-blanks') return typeof a === 'string' && a.trim().length > 0;
    if (def.id === 'short-answer' || def.id === 'long-answer') return typeof a === 'string' && a.trim().length > 0;
    if (def.id === 'map-work') {
      const map = (a as Record<string, string> | null) ?? {};
      const items = (q as MapQuestion).locations;
      return items.every((it) => (map[it.id] ?? '').trim().length > 0);
    }
    if (def.id === 'diagram-work') {
      const map = (a as Record<string, string> | null) ?? {};
      const items = (q as DiagramQuestion).labels;
      return items.every((it) => (map[it.id] ?? '').trim().length > 0);
    }
    return false;
  }, [q, answers, def]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
        <SubjectHeader subject={subject} material={material} />
        <div className="mt-10 card p-10 text-center">
          <Loader2 size={28} className="mx-auto animate-spin text-brand-600" />
          <p className="mt-3 text-sm text-bluegrey-600">Preparing your {def.name} activity from your material…</p>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
        <SubjectHeader subject={subject} material={material} />
        <div className="mt-10 card p-8 text-center">
          <AlertTriangle size={28} className="mx-auto text-warning-500" />
          <p className="mt-3 text-sm text-navy-800 max-w-md mx-auto">{loadError}</p>
          <div className="mt-5 flex justify-center gap-2">
            <button className="btn-secondary" onClick={onBack}><ArrowLeft size={16} /> Back</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      <button onClick={onBack} className="btn-ghost mb-4"><ArrowLeft size={16} /> Exit session</button>

      <SubjectHeader subject={subject} material={material} />

      {/* Progress */}
      <div className="mt-6 mb-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="font-semibold text-navy-800">
            {def.perQuestion ? `Question ${current + 1} of ${total}` : def.name}
          </span>
          <span className="text-bluegrey-600">{def.name} · {def.marksPerQuestion} mark{def.marksPerQuestion > 1 ? 's' : ''} each</span>
        </div>
        <div className="h-2 rounded-full bg-cool-100 overflow-hidden">
          <div
            className="h-full bg-brand-500 transition-all duration-300"
            style={{ width: `${((current + 1) / total) * 100}%` }}
          />
        </div>
      </div>

      {/* Question card */}
      <div key={q?.id} className="card p-5 sm:p-6 animate-slide-up">
        {def.perQuestion && (
          <span className="chip bg-ivory-100 text-bluegrey-600 mb-3">
            {(q as Extract<Question, { difficulty: string }>).difficulty ?? 'medium'}
          </span>
        )}
        <h3 className="text-lg font-semibold text-navy-900 leading-relaxed">{q?.prompt}</h3>

        <div className="mt-5">
          <AnswerInput
            question={q}
            activity={def.id}
            value={answers[q?.id ?? '']}
            onChange={setAnswer}
          />
        </div>
      </div>

      {/* Nav */}
      <div className="mt-5 flex items-center justify-between gap-3">
        <button onClick={onBack} className="btn-ghost"><ArrowLeft size={16} /> Exit</button>
        {isLast ? (
          <button className="btn-primary" onClick={handleSubmit} disabled={!canProceed || submitting}>
            {submitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            Submit &amp; see results
          </button>
        ) : (
          <button className="btn-primary" onClick={handleNext} disabled={!canProceed}>
            Next <ArrowRight size={16} />
          </button>
        )}
      </div>

      <p className="mt-3 text-xs text-bluegrey-500 text-center">
        Marks are revealed only after you submit the complete set.
      </p>
    </div>
  );
}

function AnswerInput({
  question,
  activity,
  value,
  onChange,
}: {
  question: Question | undefined;
  activity: ActivityType;
  value: AnswerMap[string];
  onChange: (v: AnswerMap[string]) => void;
}) {
  if (!question) return null;

  if (activity === 'mcq') {
    const q = question as Extract<Question, { activityType: 'mcq' }>;
    const selected = value as number | undefined;
    return (
      <div className="grid gap-2.5">
        {q.options.map((opt, i) => {
          const isSel = selected === i;
          return (
            <button
              key={i}
              onClick={() => onChange(i)}
              className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all ${
                isSel
                  ? 'border-brand-500 bg-brand-50 text-navy-900 ring-1 ring-brand-300'
                  : 'border-cool-200 bg-white hover:border-brand-200 text-navy-800'
              }`}
              aria-pressed={isSel}
            >
              <span className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
                isSel ? 'border-brand-500 bg-brand-500 text-white' : 'border-cool-300 text-bluegrey-500'
              }`}>
                {String.fromCharCode(65 + i)}
              </span>
              <span className="text-sm">{opt}</span>
            </button>
          );
        })}
      </div>
    );
  }

  if (activity === 'true-false') {
    const selected = value as boolean | undefined;
    return (
      <div className="grid grid-cols-2 gap-3">
        {[true, false].map((v) => {
          const isSel = selected === v;
          return (
            <button
              key={String(v)}
              onClick={() => onChange(v)}
              className={`rounded-xl border px-4 py-5 font-semibold transition-all ${
                isSel
                  ? 'border-brand-500 bg-brand-50 text-navy-900 ring-1 ring-brand-300'
                  : 'border-cool-200 bg-white hover:border-brand-200 text-navy-800'
              }`}
              aria-pressed={isSel}
            >
              {v ? 'True' : 'False'}
            </button>
          );
        })}
      </div>
    );
  }

  if (activity === 'fill-blanks') {
    return (
      <input
        type="text"
        className="input-field text-base"
        placeholder="Type your answer…"
        value={(value as string) ?? ''}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }

  if (activity === 'short-answer') {
    return (
      <textarea
        className="input-field min-h-[120px] resize-y"
        placeholder="Write your short answer (2–3 sentences)…"
        value={(value as string) ?? ''}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }

  if (activity === 'long-answer') {
    return (
      <textarea
        className="input-field min-h-[220px] resize-y"
        placeholder="Write your detailed answer. Include key points and examples from your material…"
        value={(value as string) ?? ''}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }

  if (activity === 'map-work') {
    const q = question as MapQuestion;
    return <MapWorkPanel question={q} value={(value as Record<string, string>) ?? {}} onChange={(m) => onChange(m)} />;
  }

  if (activity === 'diagram-work') {
    const q = question as DiagramQuestion;
    return <DiagramWorkPanel question={q} value={(value as Record<string, string>) ?? {}} onChange={(m) => onChange(m)} />;
  }

  return null;
}

