
import React, { useState, useRef, useEffect } from 'react';
import { Triangle, MessageCircle } from 'lucide-react';
import ChatHeader from '@/components/ChatHeader';
import ChatMessage from '@/components/ChatMessage';
import ChatInput from '@/components/ChatInput';
import SuggestionChip from '@/components/SuggestionChip';
import { toast } from 'sonner';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  citations?: Array<{title: string, uri: string}>;
}

const suggestedQuestions = [
  {
    title: "What are the advantages",
    subtitle: "of using Next.js?"
  },
  {
    title: "Write code to",
    subtitle: "demonstrate dijkstra's algorithm"
  },
  {
    title: "Help me write an essay",
    subtitle: "about silicon valley"
  },
  {
    title: "What is the weather",
    subtitle: "in San Francisco?"
  }
];

// API configuration
const API_URL = "http://localhost:8000/api/chat";

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  // Auto scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessageToAPI = async (userMessage: string) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          history: messages.map(msg => ({
            role: msg.isUser ? 'user' : 'assistant',
            content: msg.content
          }))
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error sending message to API:', error);
      toast.error('Failed to get a response from the AI. Please try again.');
      return {
        text: "I'm sorry, I encountered an error processing your request. The backend service might be unavailable.",
        citations: []
      };
    }
  };

  const handleSendMessage = async (message: string) => {
    const newMessage = {
      id: Date.now().toString(),
      content: message,
      isUser: true
    };
    
    setMessages(prev => [...prev, newMessage]);
    setIsTyping(true);

    try {
      // Send to API and get response
      const apiResponse = await sendMessageToAPI(message);
      
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        content: apiResponse.text,
        isUser: false,
        citations: apiResponse.citations
      }]);
    } catch (error) {
      console.error('Error in handling message:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  const showWelcomeScreen = messages.length === 0 && !isTyping;

  return (
    <div className="flex flex-col h-screen bg-chatbot-dark overflow-hidden">
      <ChatHeader />
      
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto scrollbar-thin chat-pattern"
      >
        {showWelcomeScreen ? (
          <div className="flex flex-col items-center justify-center h-full px-4 py-12 animate-fade-in-slow">
            <div className="flex items-center justify-center mb-6">
              <div className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center">
                <Triangle className="h-6 w-6 text-white" />
              </div>
              <span className="mx-2 text-xl text-white">+</span>
              <div className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center">
                <MessageCircle className="h-6 w-6 text-white" />
              </div>
            </div>
            
            <div className="text-center max-w-md mb-8">
              <h1 className="text-xl font-medium text-primary mb-3">
                This is an <span className="underline">open source</span> chatbot template built with Next.js and the AI SDK by Vercel. It uses the <code className="bg-white/10 px-1 py-0.5 rounded text-xs">streamText</code> function in the server and the <code className="bg-white/10 px-1 py-0.5 rounded text-xs">useChat</code> hook on the client to create a seamless chat experience.
              </h1>
              
              <p className="text-sm text-chatbot-secondary mt-4">
                You can learn more about the AI SDK by visiting the <span className="text-primary underline">docs</span>.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-3 w-full max-w-xl">
              {suggestedQuestions.map((question, index) => (
                <SuggestionChip
                  key={index}
                  title={question.title}
                  subtitle={question.subtitle}
                  onClick={() => handleSuggestionClick(`${question.title} ${question.subtitle}`)}
                  className={`animate-fade-in delay-${index * 100}`}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="py-4">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                content={message.content}
                isUser={message.isUser}
                citations={message.citations}
              />
            ))}
            
            {isTyping && (
              <ChatMessage
                content=""
                isLoading={true}
              />
            )}
            
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      
      <ChatInput 
        onSendMessage={handleSendMessage}
        disabled={isTyping}
      />
    </div>
  );
};

export default Index;
