import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
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
              remarkPlugins={[remarkGfm]}
              components={{
                table: ({ children }) => (
                  <div className="overflow-x-auto my-4">
                    <table className="min-w-full border border-gray-700 bg-transparent">
                      {children}
                    </table>
                  </div>
                ),
                thead: ({ children }) => (
                  <thead className="bg-gray-800/50">
                    {children}
                  </thead>
                ),
                th: ({ children }) => (
                  <th className="px-4 py-2 border border-gray-700 text-left text-sm font-semibold">
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td className="px-4 py-2 border border-gray-700 text-sm">
                    {children}
                  </td>
                ),
                tr: ({ children }) => (
                  <tr className="border-b border-gray-700 last:border-0">
                    {children}
                  </tr>
                ),
                p: ({ children }) => (
                  <p className="mb-4 leading-7">{children}</p>
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
