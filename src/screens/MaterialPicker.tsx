import { ArrowLeft, FileStack, Upload, FileText, Image as ImageIcon, Inbox } from 'lucide-react';
import type { StudyMaterial, Subject } from '@/types';
import { MAX_MATERIALS } from '@/config/appConfig';
import { sound } from '@/services/sound';
import { SubjectIllustration } from '@/components/SubjectIllustration';

interface MaterialPickerProps {
  subject: Subject;
  materials: StudyMaterial[];
  onPick: (m: StudyMaterial) => void;
  onUpload: () => void;
  onBack: () => void;
}

export function MaterialPicker({ subject, materials, onPick, onUpload, onBack }: MaterialPickerProps) {
  const subjectMaterials = materials.filter((m) => m.subjectId === subject.id);

  const handlePick = (m: StudyMaterial) => {
    sound.subjectSelect();
    onPick(m);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      <button onClick={onBack} className="btn-ghost mb-4"><ArrowLeft size={16} /> Back</button>

      <div className="card p-4 sm:p-5 flex flex-wrap items-center gap-4">
        <div className="shrink-0 w-14 h-14 rounded-xl bg-brand-50 border border-brand-100 p-2">
          <SubjectIllustration subjectId={subject.id} className="w-full h-full" />
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="text-xl font-semibold text-navy-900">{subject.name}</h1>
          <p className="text-sm text-bluegrey-600">{subject.shortDescription}</p>
        </div>
        <button className="btn-primary" onClick={onUpload}>
          <Upload size={16} /> Upload material
        </button>
      </div>

      <h2 className="mt-8 text-xl font-semibold text-navy-800">Pick study material for this session</h2>
      <p className="text-sm text-bluegrey-600 mt-1">
        Showing materials saved for {subject.name}. You can save up to {MAX_MATERIALS} in total.
      </p>

      {subjectMaterials.length === 0 ? (
        <div className="mt-5 card p-10 text-center">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-ivory-100 border border-cool-100 flex items-center justify-center text-bluegrey-500">
            <Inbox size={28} />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-navy-800">No materials for {subject.name} yet</h3>
          <p className="text-sm text-bluegrey-600 mt-1 max-w-md mx-auto">
            Upload a PDF, JPG or JPEG to start practising. Questions, maps and diagrams are generated from your own material.
          </p>
          <button className="btn-primary mt-5" onClick={onUpload}>
            <Upload size={16} /> Upload material
          </button>
        </div>
      ) : (
        <div className="mt-5 grid sm:grid-cols-2 gap-4">
          {subjectMaterials.map((m) => (
            <button
              key={m.id}
              onClick={() => handlePick(m)}
              className="card p-4 text-left transition-all hover:shadow-card-hover hover:-translate-y-0.5"
            >
              <div className="flex items-start gap-3">
                <span className="shrink-0 w-11 h-11 rounded-lg bg-ivory-100 border border-cool-100 flex items-center justify-center text-brand-600">
                  {m.fileKind === 'pdf' ? <FileText size={20} /> : <ImageIcon size={20} />}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-navy-800 truncate">{m.name}</h3>
                  <p className="text-xs text-bluegrey-600 mt-0.5">
                    {m.fileExtension.toUpperCase()} · {new Date(m.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2 text-sm text-brand-600 font-semibold">
                <FileStack size={15} /> Use this material
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
