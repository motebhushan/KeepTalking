import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { useChat } from '@/contexts/ChatContext';
import { useToast } from '@/hooks/use-toast';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';

const MessageInput: React.FC = () => {
  const [message, setMessage] = useState('');
  const { sendMessage, state, toggleVoice } = useChat();
  const { toast } = useToast();
  const { 
    transcript, 
    isListening, 
    isSupported: speechSupported, 
    startListening, 
    stopListening, 
    resetTranscript 
  } = useSpeechRecognition();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || state.isLoading) return;

    const messageToSend = message.trim();
    setMessage('');
    
    try {
      await sendMessage(messageToSend);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Update message when speech recognition provides transcript
  useEffect(() => {
    if (transcript) {
      setMessage(transcript);
    }
  }, [transcript]);

  const handleVoiceInput = () => {
    if (!speechSupported) {
      toast({
        title: "Voice Input Not Supported",
        description: "Your browser doesn't support voice input.",
        variant: "destructive",
      });
      return;
    }

    if (isListening) {
      stopListening();
      resetTranscript();
    } else {
      startListening();
    }
  };

  const handleVoiceToggle = () => {
    toggleVoice(!state.voiceEnabled);
    toast({
      title: state.voiceEnabled ? "Voice Output Disabled" : "Voice Output Enabled",
      description: state.voiceEnabled 
        ? "AI messages will no longer be spoken aloud." 
        : "AI messages will now be spoken aloud.",
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  return (
    <div className="p-4 border-t bg-muted/20">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="flex-1 relative">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={isListening ? "Listening... Speak now!" : "Type your message here... (Press Enter to send)"}
            disabled={state.isLoading}
            className="pr-12 rounded-full border-2 focus:border-primary/50"
          />
          {isListening && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="w-2 h-2 bg-destructive rounded-full animate-pulse"></div>
            </div>
          )}
        </div>
        
        {speechSupported && (
          <Button
            type="button"
            variant={isListening ? "destructive" : "secondary"}
            size="icon"
            onClick={handleVoiceInput}
            className="rounded-full shrink-0"
            aria-label={isListening ? "Stop voice input" : "Start voice input"}
          >
            {isListening ? (
              <MicOff className="h-4 w-4" />
            ) : (
              <Mic className="h-4 w-4" />
            )}
          </Button>
        )}
        
        {'speechSynthesis' in window && (
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleVoiceToggle}
            className="rounded-full shrink-0"
            aria-label={state.voiceEnabled ? "Disable AI voice" : "Enable AI voice"}
          >
            {state.voiceEnabled ? (
              <Volume2 className="h-4 w-4" />
            ) : (
              <VolumeX className="h-4 w-4" />
            )}
          </Button>
        )}
        
        <Button
          type="submit"
          disabled={!message.trim() || state.isLoading}
          className="rounded-full shrink-0"
          aria-label="Send message"
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
      
      <div className="mt-2 text-xs text-muted-foreground text-center flex items-center justify-center gap-2">
        {isListening && <span className="text-destructive">● Recording</span>}
        {state.isLoading ? "AI is typing..." : "Practice your English naturally"}
      </div>
    </div>
  );
};

export default MessageInput;