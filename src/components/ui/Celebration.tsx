import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { sound } from '@/services/sound';

interface CelebrationProps {
  /** 0–100 percentage score. */
  percentage: number;
}

interface Particle {
  id: number;
  left: number;
  delay: number;
  duration: number;
  color: string;
  rotate: number;
  size: number;
  type: 'confetti' | 'petal';
}

/**
 * Tasteful celebration overlay:
 * 80%+ → applause sound.
 * 100% → applause sound + short confetti/petal shower.
 * No coins, stars, or cartoon prizes.
 */
export function Celebration({ percentage }: CelebrationProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (percentage >= 80) sound.applause();
    if (percentage >= 100) {
      const colors = ['#4F84C9', '#2B9D94', '#6B7AB8', '#B23A55', '#C99A2E', '#247148'];
      const next: Particle[] = Array.from({ length: 60 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.6,
        duration: 2.5 + Math.random() * 2,
        color: colors[i % colors.length],
        rotate: Math.random() * 360,
        size: 6 + Math.random() * 8,
        type: i % 3 === 0 ? 'petal' : 'confetti',
      }));
      setParticles(next);
      const t = setTimeout(() => setParticles([]), 5000);
      return () => clearTimeout(t);
    }
  }, [percentage]);

  if (particles.length === 0) return null;

  return createPortal(
    <div className="fixed inset-0 z-[60] pointer-events-none overflow-hidden" aria-hidden="true">
      {particles.map((p) => (
        <span
          key={p.id}
          className={
            p.type === 'petal'
              ? 'absolute top-0 block rounded-full animate-petal-fall'
              : 'absolute top-0 block animate-confetti-fall'
          }
          style={{
            left: `${p.left}%`,
            width: p.type === 'petal' ? `${p.size}px` : `${p.size}px`,
            height: p.type === 'petal' ? `${p.size * 1.3}px` : `${p.size * 0.5}px`,
            background: p.color,
            transform: `rotate(${p.rotate}deg)`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            borderRadius: p.type === 'petal' ? '50% 0 50% 0' : '1px',
            opacity: 0.9,
          }}
        />
      ))}
    </div>,
    document.body,
  );
}
