import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
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
          <div className="flex space-x-2">
            <div className="w-2 h-2 bg-white/30 rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-white/30 rounded-full animate-bounce delay-100" />
            <div className="w-2 h-2 bg-white/30 rounded-full animate-bounce delay-200" />
          </div>
        ) : (
          <div className="prose prose-invert max-w-none">
            <ReactMarkdown
              components={{
                // Custom components for markdown elements
                p: ({ children }) => <p className="mb-4 leading-7">{children}</p>,
                ul: ({ children }) => <ul className="mb-4 space-y-2">{children}</ul>,
                ol: ({ children }) => <ol className="mb-4 space-y-2">{children}</ol>,
                li: ({ children }) => <li className="ml-4">{children}</li>,
                table: ({ children }) => (
                  <div className="overflow-x-auto mb-4">
                    <table className="min-w-full divide-y divide-gray-700">
                      {children}
                    </table>
                  </div>
                ),
                th: ({ children }) => (
                  <th className="px-4 py-2 bg-gray-800/50 text-left">{children}</th>
                ),
                td: ({ children }) => (
                  <td className="px-4 py-2 border-t border-gray-700">{children}</td>
                ),
                code: ({ children }) => (
                  <code className="bg-gray-800/50 rounded px-1 py-0.5">{children}</code>
                ),
                pre: ({ children }) => (
                  <pre className="bg-gray-800/50 p-4 rounded-lg overflow-x-auto mb-4">
                    {children}
                  </pre>
                ),
              }}
            >
              {content}
            </ReactMarkdown>
            
            {citations && citations.length > 0 && (
              <div className="mt-4 pt-4 border-t border-white/10">
                <p className="text-sm text-gray-400">Sources:</p>
                <div className="mt-2 space-y-1">
                  {citations.map((citation, index) => (
                    <a
                      key={index}
                      href={citation.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-sm text-blue-400 hover:text-blue-300"
                    >
                      {citation.title}
                    </a>
                  ))}
                </div>
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
