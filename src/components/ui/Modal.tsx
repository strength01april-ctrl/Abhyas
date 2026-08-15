import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
  icon?: React.ReactNode;
}

export function Modal({ open, onClose, title, children, maxWidth = 'max-w-lg', icon }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="absolute inset-0 bg-navy-900/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={`relative card w-full ${maxWidth} max-h-[90vh] overflow-y-auto scrollbar-thin animate-scale-in`}
      >
        <div className="flex items-center justify-between gap-4 p-5 border-b border-cool-100">
          <div className="flex items-center gap-3">
            {icon && <span className="text-brand-600">{icon}</span>}
            <h2 id="modal-title" className="text-xl font-semibold text-navy-800">
              {title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="btn-ghost p-2 rounded-lg"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>,
    document.body,
  );
}
