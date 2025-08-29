import React, { useEffect, useRef } from 'react';
import { useChat } from '@/contexts/ChatContext';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Bot, User, Volume2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const MessageList: React.FC = () => {
  const { state, speakMessage } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [state.messages]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleSpeakMessage = (text: string) => {
    speakMessage(text);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {state.messages.map((message, index) => (
        <div
          key={message.id}
          className={cn(
            "flex gap-3 animate-fade-in",
            message.sender === 'user' ? 'justify-end' : 'justify-start'
          )}
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          {message.sender === 'ai' && (
            <Avatar className="h-8 w-8 mt-1">
              <AvatarFallback className="bg-primary text-primary-foreground">
                <Bot className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
          )}
          
          <div
            className={cn(
              "max-w-[80%] p-3 rounded-2xl shadow-sm relative group",
              message.sender === 'user'
                ? "bg-chat-user-bg text-chat-user-bg-foreground rounded-br-md"
                : "bg-chat-ai-bg text-chat-ai-bg-foreground rounded-bl-md"
            )}
          >
            <div className="flex items-start gap-2">
              <div className="flex-1">
                <p className="text-sm leading-relaxed">{message.text}</p>
                <p className="text-xs opacity-60 mt-1">
                  {formatTime(message.timestamp)}
                </p>
              </div>
              {message.sender === 'ai' && 'speechSynthesis' in window && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSpeakMessage(message.text)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0 hover:bg-transparent"
                  aria-label="Play AI message"
                >
                  <Volume2 className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>

          {message.sender === 'user' && (
            <Avatar className="h-8 w-8 mt-1">
              <AvatarFallback className="bg-accent text-accent-foreground">
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
          )}
        </div>
      ))}

      {state.isLoading && (
        <div className="flex gap-3 justify-start animate-fade-in">
          <Avatar className="h-8 w-8 mt-1">
            <AvatarFallback className="bg-primary text-primary-foreground">
              <Bot className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <div className="bg-chat-ai-bg p-3 rounded-2xl rounded-bl-md">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;