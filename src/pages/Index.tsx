
import React, { useState, useRef, useEffect } from 'react';
import { Triangle, MessageCircle } from 'lucide-react';
import ChatHeader from '@/components/ChatHeader';
import ChatMessage from '@/components/ChatMessage';
import ChatInput from '@/components/ChatInput';
import SuggestionChip from '@/components/SuggestionChip';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
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

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  // Auto scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const simulateResponse = (userMessage: string) => {
    setIsTyping(true);
    setTimeout(() => {
      let response = "I'm a simulated AI assistant. I don't have actual capabilities yet, but I'm designed to look like the UI you requested.";
      
      if (userMessage.toLowerCase().includes("next.js")) {
        response = "Next.js offers several advantages including server-side rendering, static site generation, file-based routing, API routes, and built-in image optimization. It's a React framework that simplifies the development process while providing excellent performance.";
      } else if (userMessage.toLowerCase().includes("algorithm") || userMessage.toLowerCase().includes("dijkstra")) {
        response = "Dijkstra's algorithm is used to find the shortest path between nodes in a graph. Here's a simplified implementation in JavaScript:\n\n```javascript\nfunction dijkstra(graph, start, end) {\n  // Set up distance object and visited array\n  const distances = {};\n  const previous = {};\n  const nodes = new PriorityQueue();\n  \n  // Initialize distances and queue\n  for (let vertex in graph) {\n    if (vertex === start) {\n      distances[vertex] = 0;\n      nodes.enqueue(vertex, 0);\n    } else {\n      distances[vertex] = Infinity;\n      nodes.enqueue(vertex, Infinity);\n    }\n    previous[vertex] = null;\n  }\n  \n  // Process queue\n  while (!nodes.isEmpty()) {\n    let current = nodes.dequeue().element;\n    \n    if (current === end) break;\n    \n    for (let neighbor in graph[current]) {\n      let distance = distances[current] + graph[current][neighbor];\n      \n      if (distance < distances[neighbor]) {\n        distances[neighbor] = distance;\n        previous[neighbor] = current;\n        nodes.updatePriority(neighbor, distance);\n      }\n    }\n  }\n  \n  return { distances, previous };\n}\n```";
      } else if (userMessage.toLowerCase().includes("essay") || userMessage.toLowerCase().includes("silicon valley")) {
        response = "Silicon Valley, located in the southern part of the San Francisco Bay Area, has become synonymous with technological innovation and entrepreneurship. From its humble beginnings as an area focused on semiconductor innovation (hence 'silicon'), it has evolved into the global epicenter of technology startups and venture capital.\n\nThe region's success can be attributed to several factors: the presence of Stanford University and other research institutions, significant military funding during the Cold War era, a culture that embraces risk-taking and failure, and a network effect that continuously attracts top talent from around the world.\n\nToday, Silicon Valley hosts the headquarters of many of the world's largest technology companies, including Apple, Google, and Meta, as well as thousands of startups hoping to disrupt established industries.";
      } else if (userMessage.toLowerCase().includes("weather") || userMessage.toLowerCase().includes("san francisco")) {
        response = "I don't have real-time weather data access, but San Francisco generally has a cool Mediterranean climate characterized by mild, wet winters and dry summers. The city experiences little temperature variation throughout the year due to marine influences. Fog is common, especially during summer mornings.";
      }
      
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        content: response,
        isUser: false
      }]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSendMessage = (message: string) => {
    const newMessage = {
      id: Date.now().toString(),
      content: message,
      isUser: true
    };
    
    setMessages(prev => [...prev, newMessage]);
    simulateResponse(message);
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
