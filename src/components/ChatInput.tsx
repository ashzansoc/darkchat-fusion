
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { PaperclipIcon, SendIcon } from 'lucide-react';

type ChatInputProps = {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
};

const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  disabled = false
}) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className="border-t border-chatbot-border bg-chatbot-dark p-2 animate-fade-in"
    >
      <div className="relative flex items-center rounded-full border border-chatbot-border bg-chatbot-darker p-1">
        <button 
          type="button"
          className="p-2 text-chatbot-secondary hover:text-primary transition-colors"
          aria-label="Attach file"
        >
          <PaperclipIcon className="h-5 w-5" />
        </button>
        
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Send a message..."
          className={cn(
            "flex-1 bg-transparent px-3 py-2 text-sm focus:outline-none",
            "text-primary placeholder:text-muted-foreground"
          )}
          disabled={disabled}
        />
        
        <button 
          type="submit"
          className={cn(
            "p-2 rounded-full transition-colors",
            message.trim() && !disabled
              ? "text-white bg-secondary hover:bg-secondary/80"
              : "text-chatbot-secondary bg-transparent cursor-not-allowed"
          )}
          disabled={!message.trim() || disabled}
          aria-label="Send message"
        >
          <SendIcon className="h-5 w-5" />
        </button>
      </div>
    </form>
  );
};

export default ChatInput;
