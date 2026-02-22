import React, { useCallback } from 'react';
import { Download } from 'lucide-react';
import type { StudioState } from '@/types/studio';

interface ExportFabProps {
  state: StudioState;
  onToast: (message: string) => void;
}

const ExportFab = React.memo(function ExportFab({ state, onToast }: ExportFabProps) {
  const handleExport = useCallback(() => {
    const data = {
      format: state.format,
      profile: { name: state.profile.name, handle: state.profile.handle },
      content:
        state.format === 'carousel'
          ? state.carousel
          : state.format === 'phrase'
          ? state.phrase
          : state.postgpt,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'founder-studio-export.zip';
    a.click();
    URL.revokeObjectURL(url);
    onToast('Export baixado com sucesso!');
  }, [state, onToast]);

  return (
    <button
      onClick={handleExport}
      className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-primary text-primary-foreground font-medium text-sm studio-shadow-lg hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-ring/20"
      aria-label="Baixar tudo em .zip"
    >
      <Download className="w-4 h-4" />
      Baixar tudo (.zip)
    </button>
  );
});

export default ExportFab;
