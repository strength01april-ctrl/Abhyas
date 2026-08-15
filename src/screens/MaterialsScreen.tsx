import { useCallback, useRef, useState } from 'react';
import {
  Upload,
  Trash2,
  FileText,
  Image as ImageIcon,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Inbox,
  X,
} from 'lucide-react';
import type { FileKind, ProcessingStatus, StudyMaterial, Subject, SubjectId } from '@/types';
import { SUBJECTS, MAX_MATERIALS, ACCEPTED_EXTENSIONS, ACCEPTED_MIME_TYPES, PROCESSING_LIMITS } from '@/config/appConfig';
import { storage, generateId } from '@/services/storage';
import { sound } from '@/services/sound';
import { Modal } from '@/components/ui/Modal';
import { SubjectIllustration } from '@/components/SubjectIllustration';

interface MaterialsScreenProps {
  materials: StudyMaterial[];
  onChange: () => void;
  onBack: () => void;
}

export function MaterialsScreen({ materials, onChange, onBack }: MaterialsScreenProps) {
  const [uploadOpen, setUploadOpen] = useState(false);
  const [limitMessage, setLimitMessage] = useState<string | null>(null);

  const refresh = useCallback(() => {
    onChange();
  }, [onChange]);

  const handleDelete = (id: string) => {
    sound.submit();
    storage.deleteMaterial(id);
    refresh();
  };

  const openUpload = () => {
    if (materials.length >= MAX_MATERIALS) {
      setLimitMessage(
        `You can save up to ${MAX_MATERIALS} study materials. Delete an existing material to add a new one.`,
      );
      return;
    }
    setUploadOpen(true);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-navy-900">My Study Materials</h1>
          <p className="text-bluegrey-600 text-sm mt-1">
            Save up to {MAX_MATERIALS} materials on this device. PDF, JPG or JPEG.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary" onClick={onBack}>Back</button>
          <button className="btn-primary" onClick={openUpload}>
            <Upload size={16} /> Add Material
          </button>
        </div>
      </div>

      {/* Counter */}
      <div className="mb-4 flex items-center gap-3 text-sm">
        <div className="flex-1 h-2 rounded-full bg-cool-100 overflow-hidden">
          <div
            className="h-full bg-brand-500 transition-all duration-300"
            style={{ width: `${(materials.length / MAX_MATERIALS) * 100}%` }}
          />
        </div>
        <span className="text-bluegrey-600 tabular-nums">{materials.length}/{MAX_MATERIALS}</span>
      </div>

      {materials.length === 0 ? (
        <EmptyState onAdd={openUpload} />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {materials.map((m) => (
            <MaterialCard key={m.id} material={m} onDelete={() => handleDelete(m.id)} />
          ))}
        </div>
      )}

      <UploadModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onSaved={() => {
          setUploadOpen(false);
          refresh();
        }}
      />

      <Modal
        open={!!limitMessage}
        onClose={() => setLimitMessage(null)}
        title="Limit reached"
        icon={<AlertTriangle size={20} />}
        maxWidth="max-w-sm"
      >
        <p className="text-sm text-navy-800">{limitMessage}</p>
        <div className="mt-4 flex justify-end">
          <button className="btn-primary" onClick={() => setLimitMessage(null)}>Got it</button>
        </div>
      </Modal>
    </div>
  );
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="card p-10 text-center">
      <div className="mx-auto w-16 h-16 rounded-2xl bg-ivory-100 border border-cool-100 flex items-center justify-center text-bluegrey-500">
        <Inbox size={28} />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-navy-800">No study materials yet</h3>
      <p className="text-sm text-bluegrey-600 mt-1 max-w-md mx-auto">
        Upload a PDF, JPG or JPEG of your notes, textbook pages or chapters. A single material
        can cover one chapter or several — there is no fixed page limit.
      </p>
      <button className="btn-primary mt-5" onClick={onAdd}>
        <Upload size={16} /> Add your first material
      </button>
    </div>
  );
}

function MaterialCard({ material, onDelete }: { material: StudyMaterial; onDelete: () => void }) {
  const subject = SUBJECTS.find((s) => s.id === material.subjectId);
  const Icon = material.fileKind === 'pdf' ? FileText : ImageIcon;
  return (
    <div className="card p-4 flex flex-col gap-3">
      <div className="flex items-start gap-3">
        <div className="shrink-0 w-11 h-11 rounded-lg bg-ivory-100 border border-cool-100 flex items-center justify-center text-brand-600">
          <Icon size={20} />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-navy-800 truncate" title={material.name}>{material.name}</h3>
          <p className="text-xs text-bluegrey-600 mt-0.5">
            {subject?.name} · {material.fileExtension.toUpperCase()} · {formatSize(material.sizeBytes)}
          </p>
        </div>
        <button
          onClick={onDelete}
          className="btn-ghost p-2 rounded-lg text-error-500 hover:bg-error-50"
          aria-label={`Delete ${material.name}`}
          title="Delete"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs text-bluegrey-500">{formatDate(material.uploadedAt)}</span>
        <StatusBadge status={material.status} />
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: ProcessingStatus }) {
  switch (status) {
    case 'ready':
      return (
        <span className="chip bg-success-50 text-success-700 border border-success-100">
          <CheckCircle2 size={12} /> Ready
        </span>
      );
    case 'processing':
      return (
        <span className="chip bg-warning-50 text-warning-600 border border-warning-100">
          <Loader2 size={12} className="animate-spin" /> Processing
        </span>
      );
    case 'too-large':
      return (
        <span className="chip bg-error-50 text-error-600 border border-error-100" title={PROCESSING_LIMITS.tooLargeMessage}>
          <AlertTriangle size={12} /> Too large
        </span>
      );
    case 'error':
      return (
        <span className="chip bg-error-50 text-error-600 border border-error-100">
          <AlertTriangle size={12} /> Error
        </span>
      );
  }
}

// ── Upload modal ──────────────────────────────────────────────────────────────

function UploadModal({
  open,
  onClose,
  onSaved,
}: {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [name, setName] = useState('');
  const [subjectId, setSubjectId] = useState<SubjectId>('english');
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    setName('');
    setSubjectId('english');
    setFile(null);
    setError(null);
    setSaving(false);
  };

  const close = () => {
    reset();
    onClose();
  };

  const pickFile = (f: File | null | undefined) => {
    if (!f) return;
    const ext = f.name.split('.').pop()?.toLowerCase() ?? '';
    const okMime = ACCEPTED_MIME_TYPES.includes(f.type);
    const okExt = ACCEPTED_EXTENSIONS.includes(ext);
    if (!okMime && !okExt) {
      setError('Only PDF, JPG or JPEG files are supported.');
      return;
    }
    setError(null);
    setFile(f);
    if (!name) setName(f.name.replace(/\.[^.]+$/, ''));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    pickFile(e.dataTransfer.files?.[0]);
  };

  const handleSave = async () => {
    if (!file) {
      setError('Please choose a file to upload.');
      return;
    }
    if (!name.trim()) {
      setError('Please give this material a name.');
      return;
    }
    setSaving(true);
    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'pdf';
    const fileKind: FileKind = ext === 'pdf' ? 'pdf' : 'image';

    // Configurable processing-limit check.
    const tooLarge = file.size >= PROCESSING_LIMITS.mockTooLargeBytes;
    const warn = file.size >= PROCESSING_LIMITS.warnBytes && !tooLarge;

    const status: ProcessingStatus = tooLarge ? 'too-large' : 'ready';

    const material: StudyMaterial = {
      id: generateId(),
      name: name.trim(),
      subjectId,
      fileName: file.name,
      fileKind,
      fileExtension: ext,
      sizeBytes: file.size,
      uploadedAt: Date.now(),
      status,
      extractedText: tooLarge ? undefined : `[Mock extracted text from ${file.name}]`,
    };

    // Simulate brief processing for non-too-large files.
    if (!tooLarge) {
      storage.addMaterial({ ...material, status: 'processing' });
      setTimeout(() => {
        storage.updateMaterial(material.id, { status: 'ready' });
        sound.complete();
        setSaving(false);
        reset();
        onSaved();
      }, 700);
    } else {
      const res = storage.addMaterial(material);
      setSaving(false);
      if (!res.ok) {
        setError(res.message);
        return;
      }
      sound.incorrect();
      reset();
      onSaved();
    }

    if (warn) {
      // No blocking; just informational.
      setError(null);
    }
  };

  return (
    <Modal open={open} onClose={close} title="Add Study Material" icon={<Upload size={20} />} maxWidth="max-w-lg">
      <div className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-navy-800 mb-1.5" htmlFor="mat-name">
            Material name
          </label>
          <input
            id="mat-name"
            className="input-field"
            placeholder="e.g. Chapter 5 — Photosynthesis"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Subject */}
        <div>
          <label className="block text-sm font-medium text-navy-800 mb-1.5" htmlFor="mat-subject">
            Subject
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {SUBJECTS.map((s) => (
              <SubjectPicker
                key={s.id}
                subject={s}
                selected={subjectId === s.id}
                onSelect={() => setSubjectId(s.id)}
              />
            ))}
          </div>
        </div>

        {/* File dropzone */}
        <div>
          <label className="block text-sm font-medium text-navy-800 mb-1.5">File (PDF, JPG or JPEG)</label>
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={`cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition-colors ${
              dragging ? 'border-brand-400 bg-brand-50' : 'border-cool-200 bg-ivory-50 hover:border-brand-300'
            }`}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,application/pdf,image/jpeg"
              className="hidden"
              onChange={(e) => pickFile(e.target.files?.[0])}
            />
            {file ? (
              <div className="flex items-center justify-center gap-2 text-sm text-navy-800">
                {file.name.endsWith('.pdf') ? <FileText size={18} className="text-brand-600" /> : <ImageIcon size={18} className="text-brand-600" />}
                <span className="truncate max-w-[220px]">{file.name}</span>
                <span className="text-bluegrey-500">({formatSize(file.size)})</span>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setFile(null); }}
                  className="btn-ghost p-1 rounded"
                  aria-label="Remove file"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div className="text-sm text-bluegrey-600">
                <Upload size={22} className="mx-auto mb-2 text-bluegrey-500" />
                Drag &amp; drop or <span className="text-brand-600 font-semibold">browse</span>
              </div>
            )}
          </div>
          <p className="text-xs text-bluegrey-500 mt-1.5">
            A material can be one chapter, several chapters, notes, or textbook pages.
          </p>
        </div>

        {error && (
          <div className="rounded-lg bg-error-50 border border-error-100 p-3 text-sm text-error-600 flex items-start gap-2">
            <AlertTriangle size={16} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-1">
          <button className="btn-secondary" onClick={close}>Cancel</button>
          <button className="btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
            Save Material
          </button>
        </div>
      </div>
    </Modal>
  );
}

function SubjectPicker({ subject, selected, onSelect }: { subject: Subject; selected: boolean; onSelect: () => void }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition-all ${
        selected
          ? 'border-brand-400 bg-brand-50 text-brand-700 ring-1 ring-brand-300'
          : 'border-cool-200 bg-white text-bluegrey-600 hover:border-brand-200'
      }`}
      aria-pressed={selected}
    >
      <span className="w-6 h-6">
        <SubjectIllustration subjectId={subject.id} className="w-full h-full" />
      </span>
      <span className="truncate">{subject.name}</span>
    </button>
  );
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
}
