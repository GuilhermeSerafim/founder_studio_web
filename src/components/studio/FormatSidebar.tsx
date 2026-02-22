import React from 'react';
import { Layers, Quote, FileText } from 'lucide-react';
import { FormatType } from '@/types/studio';

interface FormatSidebarProps {
  selected: FormatType;
  onSelect: (format: FormatType) => void;
}

const formats: { type: FormatType; icon: typeof Layers; label: string }[] = [
  { type: 'carousel', icon: Layers, label: 'Carrossel Twitter' },
  { type: 'phrase', icon: Quote, label: 'Frase de Efeito' },
  { type: 'postgpt', icon: FileText, label: 'Post GPT' },
];

const FormatSidebar = React.memo(function FormatSidebar({ selected, onSelect }: FormatSidebarProps) {
  return (
    <aside className="flex flex-col gap-1 p-3" role="navigation" aria-label="Formatos de conteúdo">
      {formats.map(({ type, icon: Icon, label }) => {
        const isActive = selected === type;
        return (
          <button
            key={type}
            onClick={() => onSelect(type)}
            aria-pressed={isActive}
            title={label}
            className={`
              group flex items-center gap-3 w-full px-3 py-3 rounded-lg text-sm font-medium transition-all
              focus:outline-none focus:ring-2 focus:ring-ring/20
              ${isActive
                ? 'bg-card border-2 border-primary text-primary studio-shadow-md'
                : 'border-2 border-transparent text-muted-foreground hover:bg-secondary hover:text-foreground'}
            `}
          >
            <Icon className="w-5 h-5 flex-shrink-0" />
            <span className="hidden lg:inline">{label}</span>
          </button>
        );
      })}
    </aside>
  );
});

export default FormatSidebar;
