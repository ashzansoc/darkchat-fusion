
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
  const [isApiAvailable, setIsApiAvailable] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  // Check if API is available on component mount
  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        const response = await fetch('http://localhost:8000/');
        if (response.ok) {
          setIsApiAvailable(true);
          console.log('Backend API is available');
        } else {
          setIsApiAvailable(false);
          toast.error('Backend service is not responding properly');
        }
      } catch (error) {
        console.error('Backend API check failed:', error);
        setIsApiAvailable(false);
        toast.error('Cannot connect to backend service. Make sure it\'s running on http://localhost:8000');
      }
    };
    
    checkApiStatus();
  }, []);
  
  // Auto scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessageToAPI = async (userMessage: string) => {
    if (!isApiAvailable) {
      toast.error('Backend service is not available. Please make sure it\'s running.');
      return {
        text: "I can't process your request because the backend service is not available. Please ensure the FastAPI server is running on http://localhost:8000.",
        citations: []
      };
    }
    
    try {
      console.log('Sending message to API:', userMessage);
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

      console.log('API response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      console.log('API response data:', data);
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
      
      // Add an error message to the chat if something went wrong
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        content: "I'm sorry, there was an error processing your request. Please try again later.",
        isUser: false
      }]);
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
                {isApiAvailable ? (
                  "Ask me anything! I'm powered by a backend FastAPI service."
                ) : (
                  "⚠️ Backend service not available. Please start the FastAPI server."
                )}
              </h1>
              
              <p className="text-sm text-chatbot-secondary mt-4">
                {isApiAvailable ? (
                  "You can start by asking one of the suggested questions below, or type your own question."
                ) : (
                  "To use this chatbot, make sure the FastAPI backend is running on http://localhost:8000"
                )}
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
