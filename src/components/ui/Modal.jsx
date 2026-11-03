import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = 'max-w-lg',
  showCloseButton = true,
  preventClose = false,
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !preventClose) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, preventClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={() => !preventClose && onClose()}
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div
        className={`relative w-full ${maxWidth} rounded-xl bg-surface-card border border-hairline-strong shadow-xl z-10 my-auto animate-in zoom-in-95 duration-200 overflow-hidden flex flex-col max-h-[90vh]`}
      >
        {(title || showCloseButton) && (
          <div className="flex items-start justify-between px-6 py-5 border-b border-hairline bg-canvas">
            <div className="pr-6">
              {title && (
                <h2 className="text-lg font-semibold text-ink tracking-tight">
                  {title}
                </h2>
              )}
              {description && (
                <p className="text-sm text-body mt-0.5">{description}</p>
              )}
            </div>
            {showCloseButton && !preventClose && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Close dialog"
                className="rounded-md p-1.5 text-muted hover:text-ink hover:bg-surface-strong transition-colors -mr-1 -mt-1"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
