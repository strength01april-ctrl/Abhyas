import { useMemo } from 'react';
import type { MapQuestion } from '@/types';

interface MapWorkPanelProps {
  question: MapQuestion;
  value: Record<string, string>;
  onChange: (v: Record<string, string>) => void;
}

export function MapWorkPanel({ question, value, onChange }: MapWorkPanelProps) {
  const svgMarkup = useMemo(
    () => ({ __html: question.mapSvg }),
    [question.mapSvg],
  );

  return (
    <div className="grid md:grid-cols-2 gap-5">
      {/* Map */}
      <div className="card p-3">
        <div
          className="w-full rounded-lg overflow-hidden bg-cool-50"
          dangerouslySetInnerHTML={svgMarkup}
          role="img"
          aria-label="Blank map with marked locations"
        />
      </div>

      {/* Inputs */}
      <div className="space-y-3">
        <p className="text-sm text-bluegrey-600">
          Type the name of each marked location (A–{String.fromCharCode(64 + question.locations.length)}).
        </p>
        {question.locations.map((loc) => (
          <div key={loc.id} className="flex items-center gap-3">
            <span className="shrink-0 w-8 h-8 rounded-full bg-navy-900 text-white text-sm font-bold flex items-center justify-center">
              {loc.label}
            </span>
            <input
              type="text"
              className="input-field"
              placeholder={`Location ${loc.label}`}
              value={value[loc.id] ?? ''}
              onChange={(e) => onChange({ ...value, [loc.id]: e.target.value })}
              aria-label={`Name for location ${loc.label}`}
            />
          </div>
        ))}
        <div className="text-xs text-bluegrey-500 pt-1">
          1 mark per correctly identified location.
        </div>
      </div>
    </div>
  );
}
