import type { SubjectId } from '@/types';

interface SubjectIllustrationProps {
  subjectId: SubjectId;
  className?: string;
}

/**
 * Subject-themed SVG illustrations.
 * Subtle, sophisticated educational imagery — not cartoonish.
 */
export function SubjectIllustration({ subjectId, className = '' }: SubjectIllustrationProps) {
  return (
    <div className={className} aria-hidden="true">
      <svg viewBox="0 0 120 120" className="w-full h-full" fill="none">
        {renderSubject(subjectId)}
      </svg>
    </div>
  );
}

function renderSubject(id: SubjectId): React.ReactNode {
  switch (id) {
    case 'english':
      return (
        <g>
          <rect x="20" y="26" width="80" height="68" rx="6" fill="#FBECEE" stroke="#B23A55" strokeWidth="1.5" />
          <line x1="60" y1="26" x2="60" y2="94" stroke="#B23A55" strokeWidth="1.5" />
          <line x1="30" y1="42" x2="52" y2="42" stroke="#962F47" strokeWidth="1" />
          <line x1="30" y1="50" x2="52" y2="50" stroke="#962F47" strokeWidth="1" />
          <line x1="30" y1="58" x2="48" y2="58" stroke="#962F47" strokeWidth="1" />
          <line x1="68" y1="42" x2="90" y2="42" stroke="#962F47" strokeWidth="1" />
          <line x1="68" y1="50" x2="90" y2="50" stroke="#962F47" strokeWidth="1" />
          <line x1="68" y1="58" x2="86" y2="58" stroke="#962F47" strokeWidth="1" />
          <path d="M40 78 q8 -8 18 0 q8 8 16 0" stroke="#B23A55" strokeWidth="1.4" fill="none" />
        </g>
      );
    case 'science':
      return (
        <g>
          <rect x="50" y="20" width="20" height="14" rx="3" fill="#ECF7EE" stroke="#2B9D94" strokeWidth="1.5" />
          <line x1="60" y1="34" x2="60" y2="48" stroke="#2B9D94" strokeWidth="2" />
          <circle cx="60" cy="62" r="20" fill="#ECF7EE" stroke="#2B9D94" strokeWidth="1.5" />
          <circle cx="54" cy="58" r="3" fill="#2B9D94" />
          <circle cx="66" cy="66" r="2.5" fill="#1F7C74" />
          <circle cx="58" cy="68" r="2" fill="#2B9D94" opacity="0.7" />
          <line x1="40" y1="86" x2="80" y2="86" stroke="#1F7C74" strokeWidth="2" />
          <line x1="60" y1="82" x2="60" y2="92" stroke="#1F7C74" strokeWidth="2" />
        </g>
      );
    case 'social-science':
      return (
        <g>
          <circle cx="60" cy="60" r="34" fill="#EEF4FB" stroke="#4F5E9E" strokeWidth="1.5" />
          <ellipse cx="60" cy="60" rx="14" ry="34" fill="none" stroke="#4F5E9E" strokeWidth="1" />
          <line x1="26" y1="60" x2="94" y2="60" stroke="#4F5E9E" strokeWidth="1" />
          <path d="M40 40 Q60 30 80 40" fill="none" stroke="#4F5E9E" strokeWidth="1" />
          <path d="M40 80 Q60 90 80 80" fill="none" stroke="#4F5E9E" strokeWidth="1" />
          <line x1="60" y1="26" x2="60" y2="94" stroke="#4F5E9E" strokeWidth="1" />
          <circle cx="60" cy="60" r="2.5" fill="#3D4A7C" />
        </g>
      );
    case 'computer-tech':
      return (
        <g>
          <rect x="24" y="30" width="72" height="50" rx="4" fill="#EEF4FB" stroke="#234E8C" strokeWidth="1.5" />
          <rect x="32" y="38" width="56" height="34" rx="2" fill="#0F1626" />
          <path d="M40 46 L52 52 L40 58 Z" fill="#4F84C9" />
          <line x1="58" y1="46" x2="78" y2="46" stroke="#3FB8AF" strokeWidth="1.4" />
          <line x1="58" y1="52" x2="74" y2="52" stroke="#4F84C9" strokeWidth="1.4" />
          <line x1="58" y1="58" x2="78" y2="58" stroke="#3FB8AF" strokeWidth="1.4" />
          <line x1="58" y1="64" x2="70" y2="64" stroke="#4F84C9" strokeWidth="1.4" />
          <rect x="48" y="80" width="24" height="6" fill="#234E8C" />
          <rect x="40" y="86" width="40" height="4" rx="2" fill="#234E8C" />
        </g>
      );
    case 'other':
    default:
      return (
        <g>
          <rect x="24" y="28" width="72" height="64" rx="6" fill="#F6F4EF" stroke="#6E2A3E" strokeWidth="1.5" />
          <path d="M60 28 v64" stroke="#6E2A3E" strokeWidth="1.2" />
          <path d="M30 40 q10 -6 22 0 v8 q-10 -6 -22 0 Z" fill="#B23A55" opacity="0.18" stroke="#6E2A3E" strokeWidth="1" />
          <path d="M68 40 q10 -6 22 0 v8 q-10 -6 -22 0 Z" fill="#B23A55" opacity="0.18" stroke="#6E2A3E" strokeWidth="1" />
          <line x1="32" y1="60" x2="52" y2="60" stroke="#5A2233" strokeWidth="1" />
          <line x1="32" y1="68" x2="50" y2="68" stroke="#5A2233" strokeWidth="1" />
          <line x1="68" y1="60" x2="88" y2="60" stroke="#5A2233" strokeWidth="1" />
          <line x1="68" y1="68" x2="86" y2="68" stroke="#5A2233" strokeWidth="1" />
        </g>
      );
  }
}
