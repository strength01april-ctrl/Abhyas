import { useState } from 'react';
import {
  BookOpen,
  Microscope,
  Globe,
  Cpu,
  Library,
  ChevronRight,
  FileStack,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import { SUBJECTS } from '@/config/appConfig';
import type { LucideIcon } from 'lucide-react';
import type { Subject, SubjectId } from '@/types';
import { sound } from '@/services/sound';
import { HeroIllustration } from '@/components/HeroIllustration';
import { SubjectIllustration } from '@/components/SubjectIllustration';
import { Modal } from '@/components/ui/Modal';

interface HomeScreenProps {
  onSelectSubject: (subject: Subject) => void;
  onOpenMaterials: () => void;
}

const ICONS: Record<string, LucideIcon> = {
  BookOpen,
  Microscope,
  Globe,
  Cpu,
  Library,
};

const ACCENT_CLASSES: Record<Subject['accent'], { ring: string; text: string; bg: string; border: string }> = {
  brand: { ring: 'hover:ring-brand-300', text: 'text-brand-600', bg: 'bg-brand-50', border: 'border-brand-100' },
  teal: { ring: 'hover:ring-teal-400', text: 'text-teal-600', bg: 'bg-success-50', border: 'border-success-100' },
  indigo: { ring: 'hover:ring-indigo-400', text: 'text-indigo-600', bg: 'bg-brand-50', border: 'border-brand-100' },
  wine: { ring: 'hover:ring-wine-500', text: 'text-wine-600', bg: 'bg-error-50', border: 'border-error-100' },
  strawberry: { ring: 'hover:ring-strawberry-500', text: 'text-strawberry-600', bg: 'bg-error-50', border: 'border-error-100' },
};

export function HomeScreen({ onSelectSubject, onOpenMaterials }: HomeScreenProps) {
  const [howToOpen, setHowToOpen] = useState(false);

  const handleSelect = (s: Subject) => {
    sound.subjectSelect();
    onSelectSubject(s);
  };

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-ivory-100 via-ivory-50 to-ivory-50" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-6 sm:pt-16 sm:pb-10">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="animate-slide-up">
              <span className="chip bg-brand-50 text-brand-600 border border-brand-100">
                <Sparkles size={13} /> Smart revision, grounded in your material
              </span>
              <h1 className="mt-4 text-4xl sm:text-5xl font-semibold text-navy-900 text-balance">
                ABHYAS
              </h1>
              <p className="mt-2 text-lg sm:text-xl text-bluegrey-600 font-serif">
                Smart Study &amp; Revision Companion
              </p>
              <p className="mt-4 text-base text-bluegrey-600 max-w-xl">
                Welcome back. Choose a subject, upload your own study material, and practise
                with questions, maps and diagrams created from what you already have.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <button className="btn-primary" onClick={() => document.getElementById('subjects')?.scrollIntoView({ behavior: 'smooth' })}>
                  Choose Subject <ChevronRight size={16} />
                </button>
                <button className="btn-secondary" onClick={onOpenMaterials}>
                  <FileStack size={16} /> My Study Materials
                </button>
                <button className="btn-ghost" onClick={() => setHowToOpen(true)}>
                  <HelpCircle size={16} /> How to Use Abhyas
                </button>
              </div>
            </div>

            <div className="relative animate-fade-in">
              <div className="absolute -inset-4 bg-gradient-to-br from-brand-50 to-success-50 rounded-3xl blur-2xl opacity-60" />
              <div className="relative card p-4 sm:p-6">
                <HeroIllustration className="w-full h-auto" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Subjects */}
      <section id="subjects" className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-16 scroll-mt-20">
        <div className="flex items-end justify-between gap-4 mb-5">
          <div>
            <h2 className="text-2xl font-semibold text-navy-800">Choose a subject</h2>
            <p className="text-bluegrey-600 text-sm mt-1">Five subject areas — pick one to start a revision session.</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {SUBJECTS.map((s) => (
            <SubjectCard key={s.id} subject={s} onSelect={() => handleSelect(s)} />
          ))}
        </div>
      </section>

      <HowToUseModal open={howToOpen} onClose={() => setHowToOpen(false)} />
    </div>
  );
}

function SubjectCard({ subject, onSelect }: { subject: Subject; onSelect: () => void }) {
  const Icon = ICONS[subject.icon] ?? BookOpen;
  const accent = ACCENT_CLASSES[subject.accent];
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`card p-5 text-left transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5 ring-1 ring-transparent ${accent.ring} focus-visible:ring-2`}
      aria-label={`Select ${subject.name}`}
    >
      <div className="flex items-start gap-4">
        <div className={`shrink-0 w-16 h-16 rounded-xl ${accent.bg} border ${accent.border} p-2`}>
          <SubjectIllustration subjectId={subject.id} className="w-full h-full" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <Icon size={16} className={accent.text} />
            <h3 className="text-lg font-semibold text-navy-800">{subject.name}</h3>
          </div>
          <p className="text-sm text-bluegrey-600 mt-1.5 leading-snug">{subject.shortDescription}</p>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <span className={`chip ${accent.bg} ${accent.text}`}>Start revision</span>
        <ChevronRight size={18} className="text-cool-300" />
      </div>
    </button>
  );
}

const HOW_TO_STEPS: { n: number; text: string }[] = [
  { n: 1, text: 'Choose your subject.' },
  { n: 2, text: 'Upload your study material — PDF, JPG or JPEG.' },
  { n: 3, text: 'Choose what you want to practise.' },
  { n: 4, text: 'Choose 5 or 10 questions.' },
  { n: 5, text: 'Answer the complete set.' },
  { n: 6, text: 'View your score and feedback after completing the set.' },
  { n: 7, text: 'There is no negative marking.' },
  { n: 8, text: 'You can save up to 10 study materials at a time.' },
];

export function HowToUseModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal open={open} onClose={onClose} title="How to Use Abhyas" icon={<HelpCircle size={20} />} maxWidth="max-w-md">
      <ol className="space-y-3">
        {HOW_TO_STEPS.map((s) => (
          <li key={s.n} className="flex items-start gap-3">
            <span className="shrink-0 w-6 h-6 rounded-full bg-brand-600 text-white text-xs font-semibold flex items-center justify-center">
              {s.n}
            </span>
            <span className="text-sm text-navy-800 leading-relaxed">{s.text}</span>
          </li>
        ))}
      </ol>
      <div className="mt-5 rounded-xl bg-ivory-100 border border-cool-100 p-3 text-xs text-bluegrey-600">
        Tip: your materials are saved on this device only. No account needed.
      </div>
    </Modal>
  );
}

export function getSubjectIcon(id: SubjectId): LucideIcon {
  return ICONS[SUBJECTS.find((s) => s.id === id)?.icon ?? 'BookOpen'] ?? BookOpen;
}
