import React, { useState, useRef, useEffect } from 'react';
import ChatHeader from '@/components/ChatHeader';
import ChatMessage from '@/components/ChatMessage';
import ChatInput from '@/components/ChatInput';
import SuggestionChip from '@/components/SuggestionChip';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  citations?: Array<{title: string, uri: string}>;
}

const suggestedQuestions = [
  {
    title: "What is Cloud Orbiter",
    subtitle: "help me understand in details"
  },
  {
    title: "How many leaves do I get",
    subtitle: "whom to reach out to learn more"
  },
  {
    title: "Who is the CEO of Coredge?",
    subtitle: "how can i reach out to him?"
  },
  {
    title: "How many blogs has Zeya written",
    subtitle: "in the month of January 2025?"
  }
];

// API configuration
// Determine API URL based on environment
// In development, use absolute URL, in production (Docker/deployment) use relative URL
const isProduction = window.location.hostname !== 'localhost';
const API_URL = isProduction 
  ? "/api/chat"  // In production with nginx: relative path
  : "http://localhost:8000/api/chat";  // In development: absolute path with port

const HEALTH_URL = isProduction
  ? "/health"  // In production with nginx: relative path
  : "http://localhost:8000/";  // In development: absolute path with port

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isApiAvailable, setIsApiAvailable] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Check if API is available on component mount
  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        console.log('Checking API health at:', HEALTH_URL);
        const response = await fetch(HEALTH_URL);
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
        toast.error('Cannot connect to backend service');
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
        text: "I can't process your request because the backend service is not available. Please ensure the server is running.",
        citations: []
      };
    }
    
    try {
      console.log('Sending message to API:', userMessage);
      
      // Format the messages as required by our FastAPI endpoint
      const formattedMessages = messages.map(msg => ({
        role: msg.isUser ? 'user' : 'assistant',
        content: msg.content
      }));
      
      // Add the current message to the conversation
      formattedMessages.push({
        role: 'user',
        content: userMessage
      });
      
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: formattedMessages
        }),
      });

      console.log('API response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      console.log('API response data:', data);
      
      // Return the response with citations if available
      return {
        text: data.response,
        citations: data.citations || []
      };
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
    if (showWelcomeScreen) {
      setIsTransitioning(true);
      // Wait for animation to complete before showing the message
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
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
    <div className="flex min-h-screen bg-gradient-to-b from-[#0a0f1c] to-[#1a1b26]">
      <div className="flex-1 bg-transparent" />
      
      <div className="max-w-3xl w-full px-4">
        {/* Logo container - always visible */}
        <div className={cn(
          "transition-all duration-500 ease-in-out",
          showWelcomeScreen 
            ? "mt-32" // Initial position
            : "mt-4"  // Final position after transition
        )}>
          <img 
            src="/AnSwers-2.png" 
            alt="AnSwers Logo" 
            className={cn(
              "h-16 w-auto mx-auto transition-all duration-500",
              showWelcomeScreen ? "scale-100" : "scale-75"
            )}
          />
        </div>

        <div className="space-y-4 py-6">
          {showWelcomeScreen ? (
            <div className={cn(
              "flex flex-col items-center justify-center px-4",
              isTransitioning ? "opacity-0" : "opacity-100",
              "transition-opacity duration-500"
            )}>
              <div className="text-center max-w-md mb-8">
                {/* Welcome text content */}
                <h1 className="text-xl font-medium text-primary mb-3">
                  {isApiAvailable ? (
                    "I am Answers by Coredge.I can help you with your questions."
                  ) : (
                    "⚠️ Backend service not available. Please make sure the server is running."
                  )}
                </h1>
                
                <p className="text-sm text-chatbot-secondary mt-4">
                  {isApiAvailable ? (
                    "I have been developed by a team of experts at Coredge. You have questions, I have answers."
                  ) : (
                    "To use this chatbot, make sure the backend service is running"
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

        {/* Move input box up */}
        <div className="fixed bottom-6 left-0 right-0 bg-gradient-to-b from-transparent to-[#1a1b26]">
          <div className="max-w-3xl mx-auto px-4 pb-2">
            <ChatInput 
              onSendMessage={handleSendMessage}
              disabled={isTyping}
            />
          </div>
        </div>
      </div>
      
      <div className="flex-1 bg-transparent" />
    </div>
  );
};

export default Index;
