import React, { useState, useCallback } from 'react';
import { Link, Loader2 } from 'lucide-react';

interface ImportHeaderProps {
  importing: boolean;
  onImport: (url: string) => void;
}

const ImportHeader = React.memo(function ImportHeader({ importing, onImport }: ImportHeaderProps) {
  const [url, setUrl] = useState('');

  const handleImport = useCallback(() => {
    onImport(url);
  }, [url, onImport]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleImport();
      }
    },
    [handleImport]
  );

  return (
    <header className="flex items-center gap-3 px-6 py-4 border-b border-border bg-card">
      <div className="flex items-center gap-2 mr-4">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <span className="text-primary-foreground font-display font-bold text-sm">FS</span>
        </div>
        <h1 className="font-display font-semibold text-lg text-foreground hidden sm:block">
          Founder Studio
        </h1>
      </div>

      <div className="flex-1 flex items-center gap-2 max-w-2xl">
        <div className="relative flex-1">
          <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Colar URL do Instagram/Twitter"
            aria-label="URL para importar conteúdo"
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-primary transition-all"
            disabled={importing}
          />
        </div>
        <button
          onClick={handleImport}
          disabled={importing}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-ring/20 studio-shadow"
        >
          {importing ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : null}
          Importar
        </button>
      </div>
    </header>
  );
});

export default ImportHeader;
