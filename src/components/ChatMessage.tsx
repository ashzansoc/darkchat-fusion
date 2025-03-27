
import React from 'react';
import { cn } from '@/lib/utils';
import { MessageCircle, Triangle, ExternalLink } from 'lucide-react';

type Citation = {
  title: string;
  uri: string;
};

type ChatMessageProps = {
  content: string;
  isUser?: boolean;
  isLoading?: boolean;
  showIcon?: boolean;
  citations?: Citation[];
};

const ChatMessage: React.FC<ChatMessageProps> = ({
  content,
  isUser = false,
  isLoading = false,
  showIcon = true,
  citations = []
}) => {
  return (
    <div
      className={cn(
        "flex items-start gap-4 px-4 py-6 animate-fade-in",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && showIcon && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
          <Triangle className="h-4 w-4 text-white" />
        </div>
      )}
      
      <div
        className={cn(
          "max-w-3xl text-sm rounded-lg px-4 py-3",
          isUser 
            ? "bg-secondary text-secondary-foreground" 
            : "bg-chatbot-accent/20 text-primary"
        )}
      >
        {isLoading ? (
          <div className="flex gap-1 items-center py-1">
            <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"></div>
            <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse delay-75"></div>
            <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse delay-150"></div>
          </div>
        ) : (
          <div className="flex flex-col">
            <div className="whitespace-pre-wrap">{content}</div>
            
            {citations && citations.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-700">
                <p className="text-xs text-gray-400 mb-2">Sources:</p>
                <ul className="list-disc list-inside text-xs space-y-1">
                  {citations.map((citation, index) => (
                    <li key={index} className="flex items-center text-blue-400 hover:underline">
                      <a 
                        href={citation.uri} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center"
                      >
                        {citation.title}
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {isUser && showIcon && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
          <MessageCircle className="h-4 w-4 text-secondary-foreground" />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
