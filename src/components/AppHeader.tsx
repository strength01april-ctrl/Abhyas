import { useEffect, useState } from 'react';
import { Volume2, VolumeX, BookOpenText } from 'lucide-react';
import { isSoundEnabled, setSoundEnabled, sound } from '@/services/sound';

interface AppHeaderProps {
  onHome: () => void;
  onHowToUse: () => void;
  onMaterials: () => void;
  rightSlot?: React.ReactNode;
}

export function AppHeader({ onHome, onHowToUse, onMaterials, rightSlot }: AppHeaderProps) {
  const [soundOn, setSoundOn] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setSoundOn(isSoundEnabled());
  }, []);

  const toggleSound = () => {
    const next = !soundOn;
    setSoundEnabled(next);
    setSoundOn(next);
    sound.toggle(next);
  };

  const go = (fn: () => void) => () => {
    setMobileOpen(false);
    fn();
  };

  return (
    <header className="sticky top-0 z-40 bg-ivory-50/85 backdrop-blur-md border-b border-cool-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="h-16 flex items-center justify-between gap-4">
          {/* Brand */}
          <button
            type="button"
            onClick={onHome}
            className="flex items-center gap-2.5 group"
            aria-label="ABHYAS home"
          >
            <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-navy-900 text-brand-300 shadow-soft transition-transform group-hover:scale-105">
              <BookOpenText size={18} />
            </span>
            <span className="flex flex-col leading-none text-left">
              <span className="font-serif text-lg font-semibold tracking-wide text-navy-900">
                ABHYAS
              </span>
              <span className="text-[10px] uppercase tracking-[0.18em] text-bluegrey-500">
                Study Companion
              </span>
            </span>
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            <button onClick={onHome} className="btn-ghost">Home</button>
            <button onClick={onMaterials} className="btn-ghost">My Study Materials</button>
            <button onClick={onHowToUse} className="btn-ghost">How to Use</button>
          </nav>

          <div className="flex items-center gap-2">
            {rightSlot}
            <button
              type="button"
              onClick={toggleSound}
              className="btn-ghost p-2 rounded-lg"
              aria-label={soundOn ? 'Turn sound off' : 'Turn sound on'}
              aria-pressed={soundOn}
              title={soundOn ? 'Sound on' : 'Sound off'}
            >
              {soundOn ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </button>
            {/* Mobile menu toggle */}
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              className="btn-ghost p-2 rounded-lg md:hidden"
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                {mobileOpen ? (
                  <>
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </>
                ) : (
                  <>
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <nav className="md:hidden pb-3 flex flex-col gap-1 animate-slide-up">
            <button onClick={go(onHome)} className="btn-ghost justify-start">Home</button>
            <button onClick={go(onMaterials)} className="btn-ghost justify-start">My Study Materials</button>
            <button onClick={go(onHowToUse)} className="btn-ghost justify-start">How to Use Abhyas</button>
          </nav>
        )}
      </div>
    </header>
  );
}
