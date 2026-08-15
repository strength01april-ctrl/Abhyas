import { useState } from 'react';
import { ArrowLeft, Check, Layers, Play } from 'lucide-react';
import type { ActivityType, QuestionCount, StudyMaterial, Subject } from '@/types';
import { ACTIVITY_MAP, DIFFICULTY_DISTRIBUTION } from '@/config/appConfig';
import { sound } from '@/services/sound';
import { SubjectHeader } from './ActivitySelectScreen';

interface CountSelectProps {
  subject: Subject;
  material: StudyMaterial;
  activity: ActivityType;
  onSelect: (count: QuestionCount) => void;
  onBack: () => void;
}

export function CountSelectScreen({ subject, material, activity, onSelect, onBack }: CountSelectProps) {
  const [selected, setSelected] = useState<QuestionCount | null>(null);
  const def = ACTIVITY_MAP[activity];

  const handleStart = () => {
    if (selected === null) return;
    sound.startSession();
    onSelect(selected);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      <button onClick={onBack} className="btn-ghost mb-4"><ArrowLeft size={16} /> Back</button>

      <SubjectHeader subject={subject} material={material} />

      <h2 className="mt-8 text-2xl font-semibold text-navy-800">How many questions?</h2>
      <p className="text-sm text-bluegrey-600 mt-1">
        Difficulty is set automatically — you don&apos;t choose it.
      </p>

      <div className="mt-6 grid sm:grid-cols-2 gap-4">
        {[5, 10].map((c) => {
          const count = c as QuestionCount;
          const d = DIFFICULTY_DISTRIBUTION[count];
          const isSel = selected === count;
          return (
            <button
              key={c}
              onClick={() => { sound.activitySelect(); setSelected(count); }}
              className={`card p-6 text-left transition-all hover:shadow-card-hover hover:-translate-y-0.5 ${
                isSel ? 'ring-2 ring-brand-500 border-brand-300' : 'ring-1 ring-transparent'
              }`}
              aria-pressed={isSel}
            >
              <div className="flex items-center gap-3">
                <span className={`w-12 h-12 rounded-xl flex items-center justify-center font-serif text-xl font-semibold transition-colors ${
                  isSel ? 'bg-brand-600 text-white' : 'bg-brand-50 text-brand-600 border border-brand-100'
                }`}>
                  {c}
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-navy-800">{c} Questions</h3>
                  <p className="text-xs text-bluegrey-600">Automatic difficulty mix</p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2 text-xs">
                <span className="chip bg-success-50 text-success-700">{d.easy} Easy</span>
                <span className="chip bg-warning-50 text-warning-600">{d.medium} Medium</span>
                <span className="chip bg-error-50 text-error-600">{d.hard} Hard</span>
              </div>
              {isSel && (
                <div className="mt-4 flex items-center gap-2 text-sm text-brand-600 font-semibold">
                  <Check size={16} /> Selected
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-6 surface-section p-4 text-sm text-bluegrey-600 flex items-start gap-3">
        <Layers size={18} className="text-brand-500 shrink-0 mt-0.5" />
        <p>
          You will answer the full set before seeing any marks. There is no negative marking.
          {activity === 'short-answer' || activity === 'long-answer'
            ? ' Descriptive answers are marked with partial credit.'
            : null}
        </p>
      </div>

      {/* Start Revision */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-bluegrey-600">
          {selected !== null ? (
            <span className="flex items-center gap-2">
              <Check size={16} className="text-success-600" />
              {selected} {def.name} questions ready to start.
            </span>
          ) : (
            'Select 5 or 10 questions to continue.'
          )}
        </div>
        <button
          className="btn-primary text-base px-8 py-3 w-full sm:w-auto justify-center"
          onClick={handleStart}
          disabled={selected === null}
        >
          <Play size={18} /> Start Revision
        </button>
      </div>
    </div>
  );
}
