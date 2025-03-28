import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { PaperclipIcon, SendIcon, Send } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

const ChatInput = ({ onSendMessage, disabled }: ChatInputProps) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative flex items-center">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Send a message..."
          disabled={disabled}
          className="w-full rounded-full bg-white/5 px-4 py-3 pr-12 text-white placeholder-gray-400 backdrop-blur-sm focus:outline-none focus:ring-0 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={disabled || !message.trim()}
          className="absolute right-3 p-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:hover:text-gray-400"
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
    </form>
  );
};

export default ChatInput;
