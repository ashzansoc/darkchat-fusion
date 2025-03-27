
import React from 'react';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Menu, PlusCircle } from 'lucide-react';

const ChatHeader: React.FC = () => {
  return (
    <header className="border-b border-chatbot-border bg-chatbot-dark py-2 px-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button className="p-1 text-chatbot-secondary hover:text-primary transition-colors">
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center ml-2">
            <button className="p-1 text-chatbot-secondary hover:text-primary transition-colors">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button className="p-1 text-chatbot-secondary hover:text-primary transition-colors">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        <div className="flex items-center">
          <span className="text-sm font-medium text-primary">chat.vercel.ai</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="flex items-center space-x-1 py-1 px-3 rounded-full border border-chatbot-border text-xs text-primary hover:bg-chatbot-accent/10 transition-colors">
            <PlusCircle className="h-3 w-3" />
            <span>Deploy with Vercel</span>
          </button>
        </div>
      </div>
      
      <div className="flex items-center mt-2 px-2">
        <div className="flex items-center space-x-2 text-xs">
          <span className="flex items-center bg-chatbot-accent/20 text-primary px-3 py-1 rounded-md">
            Chat model
          </span>
          <span className="text-chatbot-secondary">•</span>
          <span className="flex items-center text-chatbot-secondary px-2 py-1">
            Private
          </span>
        </div>
      </div>
    </header>
  );
};

export default ChatHeader;
