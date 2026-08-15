import { useMemo } from 'react';
import type { DiagramQuestion } from '@/types';

interface DiagramWorkPanelProps {
  question: DiagramQuestion;
  value: Record<string, string>;
  onChange: (v: Record<string, string>) => void;
}

export function DiagramWorkPanel({ question, value, onChange }: DiagramWorkPanelProps) {
  const svgMarkup = useMemo(
    () => ({ __html: question.diagramSvg }),
    [question.diagramSvg],
  );

  return (
    <div className="grid md:grid-cols-2 gap-5">
      {/* Diagram */}
      <div className="card p-3">
        <div
          className="w-full rounded-lg overflow-hidden bg-ivory-50"
          dangerouslySetInnerHTML={svgMarkup}
          role="img"
          aria-label="Diagram with labelled parts replaced by letters"
        />
      </div>

      {/* Inputs */}
      <div className="space-y-3">
        <p className="text-sm text-bluegrey-600">
          Identify the part marked by each letter.
        </p>
        {question.labels.map((lbl) => (
          <div key={lbl.id} className="flex items-center gap-3">
            <span className="shrink-0 w-8 h-8 rounded-full bg-navy-900 text-white text-sm font-bold flex items-center justify-center">
              {lbl.label}
            </span>
            <input
              type="text"
              className="input-field"
              placeholder={`Part ${lbl.label}`}
              value={value[lbl.id] ?? ''}
              onChange={(e) => onChange({ ...value, [lbl.id]: e.target.value })}
              aria-label={`Name for part ${lbl.label}`}
            />
          </div>
        ))}
        <div className="text-xs text-bluegrey-500 pt-1">
          1 mark per correct identification.
        </div>
      </div>
    </div>
  );
}
