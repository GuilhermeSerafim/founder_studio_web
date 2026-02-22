import React, { useEffect } from 'react';
import { CheckCircle2, X } from 'lucide-react';

interface StudioToastProps {
  message: string | null;
  type?: 'success' | 'error';
  onClose: () => void;
}

const StudioToast = React.memo(function StudioToast({ message, type = 'success', onClose }: StudioToastProps) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div
      role="alert"
      className={`fixed bottom-20 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium studio-shadow-lg animate-in slide-in-from-bottom-2 ${
        type === 'success' ? 'bg-card text-foreground border border-border' : 'bg-destructive text-destructive-foreground'
      }`}
    >
      {type === 'success' && <CheckCircle2 className="w-4 h-4 text-primary" />}
      {message}
      <button onClick={onClose} aria-label="Fechar" className="ml-1 text-muted-foreground hover:text-foreground transition-colors">
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
});

export default StudioToast;
