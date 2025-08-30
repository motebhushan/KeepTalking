import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import SessionSummary from './SessionSummary';
import { useChat } from '@/contexts/ChatContext';

const ChatPage: React.FC = () => {
  const navigate = useNavigate();
  const { addMessage } = useChat();

  useEffect(() => {
    // Add welcome message when chat starts
    addMessage(
      "Hello! I'm your English learning buddy. Let's start practicing! Tell me about your day or ask me anything you'd like to discuss in English.",
      'ai'
    );
  }, []);

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <div className="border-b bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/analyze')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Analyze your Conversation
            </Button>
            <h1 className="text-2xl font-bold">English Talk Buddy</h1>
          </div>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="container mx-auto px-4 py-6 h-[calc(100vh-88px)]">
        <div className="grid lg:grid-cols-3 gap-6 h-full">
          {/* Chat Area */}
          <div className="lg:col-span-2 flex flex-col">
            <div className="flex-1 bg-card rounded-2xl shadow-lg overflow-hidden flex flex-col">
              <div className="p-4 border-b bg-primary/5">
                <h2 className="font-semibold text-lg">Conversation</h2>
                <p className="text-sm text-muted-foreground">Practice your English here</p>
              </div>
              
              <MessageList />
              <MessageInput />
            </div>
          </div>

          {/* Session Summary */}
          <div className="lg:col-span-1">
            <SessionSummary />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;