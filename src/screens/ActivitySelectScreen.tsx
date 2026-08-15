import {
  ListChecks,
  PenLine,
  AlignLeft,
  TextCursorInput,
  ToggleLeft,
  Map as MapIcon,
  Shapes,
  ChevronRight,
  ArrowLeft,
  FileStack,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { ActivityType, StudyMaterial, Subject } from '@/types';
import { getActivitiesForSubject } from '@/config/appConfig';
import { sound } from '@/services/sound';
import { SubjectIllustration } from '@/components/SubjectIllustration';

const ICONS: Record<string, LucideIcon> = {
  ListChecks,
  PenLine,
  AlignLeft,
  TextCursorInput,
  ToggleLeft,
  Map: MapIcon,
  Shapes,
};

interface ActivitySelectProps {
  subject: Subject;
  material: StudyMaterial;
  onSelect: (activity: ActivityType) => void;
  onBack: () => void;
  onChangeMaterial: () => void;
}

export function ActivitySelectScreen({ subject, material, onSelect, onBack, onChangeMaterial }: ActivitySelectProps) {
  const activities = getActivitiesForSubject(subject.id);

  const handle = (id: ActivityType) => {
    sound.activitySelect();
    onSelect(id);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      <button onClick={onBack} className="btn-ghost mb-4"><ArrowLeft size={16} /> Back</button>

      <SubjectHeader subject={subject} material={material} onChangeMaterial={onChangeMaterial} />

      <h2 className="mt-8 text-2xl font-semibold text-navy-800">What would you like to practise?</h2>
      <p className="text-sm text-bluegrey-600 mt-1">Pick one activity type. There is no mixed-question mode.</p>

      <div className="mt-5 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {activities.map((a) => {
          const Icon = ICONS[a.icon] ?? ListChecks;
          return (
            <button
              key={a.id}
              onClick={() => handle(a.id)}
              className="card p-5 text-left transition-all hover:shadow-card-hover hover:-translate-y-0.5"
            >
              <div className="flex items-start gap-3">
                <span className="shrink-0 w-10 h-10 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center">
                  <Icon size={20} />
                </span>
                <div className="min-w-0">
                  <h3 className="font-semibold text-navy-800">{a.name}</h3>
                  <p className="text-sm text-bluegrey-600 mt-1 leading-snug">{a.description}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="chip bg-ivory-100 text-bluegrey-600">{a.marksPerQuestion} mark{a.marksPerQuestion > 1 ? 's' : ''} each</span>
                <ChevronRight size={16} className="text-cool-300" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function SubjectHeader({
  subject,
  material,
  onChangeMaterial,
}: {
  subject: Subject;
  material?: StudyMaterial;
  onChangeMaterial?: () => void;
}) {
  return (
    <div className="card p-4 sm:p-5 flex flex-wrap items-center gap-4">
      <div className="shrink-0 w-14 h-14 rounded-xl bg-brand-50 border border-brand-100 p-2">
        <SubjectIllustration subjectId={subject.id} className="w-full h-full" />
      </div>
      <div className="min-w-0 flex-1">
        <h1 className="text-xl font-semibold text-navy-900">{subject.name}</h1>
        <p className="text-sm text-bluegrey-600 truncate">{subject.shortDescription}</p>
      </div>
      {material && onChangeMaterial && (
        <button onClick={onChangeMaterial} className="btn-secondary text-sm">
          <FileStack size={15} /> {material.name}
        </button>
      )}
    </div>
  );
}
