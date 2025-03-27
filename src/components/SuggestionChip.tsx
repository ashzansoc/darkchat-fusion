
import React from 'react';
import { cn } from '@/lib/utils';

type SuggestionChipProps = {
  title: string;
  subtitle?: string;
  onClick: () => void;
  className?: string;
};

const SuggestionChip: React.FC<SuggestionChipProps> = ({
  title,
  subtitle,
  onClick,
  className
}) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col text-left w-full p-4 rounded-lg border border-chatbot-border",
        "bg-chatbot-accent/10 hover:bg-chatbot-accent/20 transition-colors duration-200",
        "focus:outline-none focus:ring-2 focus:ring-white/10",
        "animate-fade-in",
        className
      )}
    >
      <span className="font-medium text-sm text-primary mb-1">{title}</span>
      {subtitle && (
        <span className="text-xs text-muted-foreground">{subtitle}</span>
      )}
    </button>
  );
};

export default SuggestionChip;
