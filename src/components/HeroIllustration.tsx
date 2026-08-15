/**
 * Hero illustration: two students (one boy, one girl) studying at a shared
 * study desk with books, notebooks, pens/pencils and study material.
 * No laptops or tablets. Subtle, sophisticated educational style.
 * Pure SVG so it scales crisply and never blocks text.
 */
export function HeroIllustration({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 600 420"
      className={className}
      fill="none"
      role="img"
      aria-label="Two students studying together at a desk with books and notebooks"
    >
      {/* soft backdrop */}
      <ellipse cx="300" cy="380" rx="240" ry="28" fill="#E8ECF1" opacity="0.7" />

      {/* ── Desk ── */}
      <rect x="90" y="300" width="420" height="14" rx="4" fill="#D1D9E2" />
      <rect x="110" y="314" width="10" height="70" fill="#AEB8C6" />
      <rect x="480" y="314" width="10" height="70" fill="#AEB8C6" />

      {/* Books stack on desk */}
      <g>
        <rect x="120" y="284" width="90" height="16" rx="3" fill="#4F84C9" />
        <rect x="122" y="270" width="86" height="14" rx="3" fill="#2B9D94" />
        <rect x="126" y="258" width="78" height="12" rx="3" fill="#B23A55" opacity="0.8" />
        <line x1="128" y1="265" x2="202" y2="265" stroke="#F6F4EF" strokeWidth="1" />
      </g>

      {/* Open notebook center desk */}
      <g>
        <rect x="250" y="282" width="100" height="18" rx="2" fill="#FBFAF7" stroke="#AEB8C6" strokeWidth="1.2" />
        <line x1="300" y1="282" x2="300" y2="300" stroke="#AEB8C6" strokeWidth="1" />
        <line x1="260" y1="290" x2="292" y2="290" stroke="#D1D9E2" strokeWidth="0.8" />
        <line x1="260" y1="295" x2="288" y2="295" stroke="#D1D9E2" strokeWidth="0.8" />
        <line x1="308" y1="290" x2="340" y2="290" stroke="#D1D9E2" strokeWidth="0.8" />
        <line x1="308" y1="295" x2="336" y2="295" stroke="#D1D9E2" strokeWidth="0.8" />
      </g>

      {/* Pencils */}
      <g transform="rotate(-12 370 290)">
        <rect x="362" y="286" width="44" height="4" rx="2" fill="#C99A2E" />
        <polygon points="406,286 412,288 406,290" fill="#1A1D22" />
        <rect x="362" y="286" width="6" height="4" fill="#B23A55" />
      </g>
      <g transform="rotate(10 420 292)">
        <rect x="414" y="290" width="40" height="3.5" rx="1.75" fill="#4F84C9" />
        <polygon points="454,290 459,291.75 454,293.5" fill="#1A1D22" />
      </g>

      {/* ── Boy (left) ── */}
      <g>
        {/* chair back */}
        <rect x="150" y="250" width="40" height="60" rx="6" fill="#EDEAE2" />
        {/* body */}
        <path d="M150 250 Q170 200 195 205 L205 250 Z" fill="#234E8C" />
        {/* arm reaching to desk */}
        <path d="M190 230 Q230 250 250 288" stroke="#234E8C" strokeWidth="10" strokeLinecap="round" fill="none" />
        <circle cx="250" cy="288" r="5" fill="#E8C9A8" />
        {/* neck + head */}
        <rect x="180" y="180" width="10" height="18" fill="#E8C9A8" />
        <circle cx="185" cy="168" r="20" fill="#E8C9A8" />
        {/* hair */}
        <path d="M167 160 Q170 145 185 145 Q200 145 203 160 Q200 150 185 150 Q172 152 167 160 Z" fill="#25292F" />
        <path d="M167 160 Q172 156 180 158" stroke="#25292F" strokeWidth="3" fill="none" strokeLinecap="round" />
        {/* glasses */}
        <circle cx="178" cy="170" r="5" fill="none" stroke="#25292F" strokeWidth="1.4" />
        <circle cx="192" cy="170" r="5" fill="none" stroke="#25292F" strokeWidth="1.4" />
        <line x1="183" y1="170" x2="187" y2="170" stroke="#25292F" strokeWidth="1.4" />
        {/* focused eyes */}
        <circle cx="178" cy="170" r="1.4" fill="#25292F" />
        <circle cx="192" cy="170" r="1.4" fill="#25292F" />
        {/* slight smile */}
        <path d="M180 178 Q185 181 190 178" stroke="#5A2233" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      </g>

      {/* ── Girl (right) ── */}
      <g>
        {/* chair back */}
        <rect x="410" y="250" width="40" height="60" rx="6" fill="#EDEAE2" />
        {/* body */}
        <path d="M450 250 Q430 200 405 205 L395 250 Z" fill="#6E2A3E" />
        {/* arm */}
        <path d="M410 230 Q380 250 356 286" stroke="#6E2A3E" strokeWidth="10" strokeLinecap="round" fill="none" />
        <circle cx="356" cy="286" r="5" fill="#E8C9A8" />
        {/* neck + head */}
        <rect x="410" y="180" width="10" height="18" fill="#E8C9A8" />
        <circle cx="415" cy="168" r="20" fill="#E8C9A8" />
        {/* hair (longer) */}
        <path d="M396 158 Q398 140 415 140 Q432 140 434 160 Q438 180 430 200 L432 196 Q436 175 430 160 Q428 148 415 148 Q402 150 398 162 Z" fill="#33373F" />
        <path d="M396 158 Q394 178 400 196" stroke="#33373F" strokeWidth="6" fill="none" strokeLinecap="round" />
        {/* eyes focused down */}
        <path d="M407 170 q3 2 6 0" stroke="#25292F" strokeWidth="1.4" fill="none" strokeLinecap="round" />
        <path d="M419 170 q3 2 6 0" stroke="#25292F" strokeWidth="1.4" fill="none" strokeLinecap="round" />
        {/* smile */}
        <path d="M410 178 Q415 181 420 178" stroke="#5A2233" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      </g>

      {/* ── Floating study motifs (subtle) ── */}
      <g opacity="0.55">
        {/* small book top-left */}
        <rect x="60" y="80" width="34" height="26" rx="3" fill="#D6E4F5" stroke="#4F84C9" strokeWidth="1" />
        <line x1="77" y1="80" x2="77" y2="106" stroke="#4F84C9" strokeWidth="0.8" />
        {/* atom top-right */}
        <circle cx="520" cy="90" r="3" fill="#2B9D94" />
        <ellipse cx="520" cy="90" rx="18" ry="7" fill="none" stroke="#2B9D94" strokeWidth="1" />
        <ellipse cx="520" cy="90" rx="18" ry="7" fill="none" stroke="#2B9D94" strokeWidth="1" transform="rotate(60 520 90)" />
        <ellipse cx="520" cy="90" rx="18" ry="7" fill="none" stroke="#2B9D94" strokeWidth="1" transform="rotate(120 520 90)" />
        {/* pencil mid */}
        <g transform="rotate(20 540 220)">
          <rect x="530" y="218" width="30" height="3" rx="1.5" fill="#C99A2E" />
          <polygon points="560,218 564,219.5 560,221" fill="#1A1D22" />
        </g>
        {/* small globe far left */}
        <circle cx="50" cy="230" r="14" fill="#EEF4FB" stroke="#4F5E9E" strokeWidth="1" />
        <ellipse cx="50" cy="230" rx="6" ry="14" fill="none" stroke="#4F5E9E" strokeWidth="0.8" />
        <line x1="36" y1="230" x2="64" y2="230" stroke="#4F5E9E" strokeWidth="0.8" />
      </g>
    </svg>
  );
}
