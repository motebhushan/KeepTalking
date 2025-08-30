import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { getOrCreateSessionId } from '@/utils/session';

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export interface SessionData {
  grammarScore: number;
  vocabularyTips: string[];
  improvements: string[];
  totalMessages: number;
  sessionDuration: number;
}

interface ChatState {
  messages: Message[];
  sessionData: SessionData;
  isLoading: boolean;
  voiceEnabled: boolean;
}

type ChatAction =
  | { type: 'ADD_MESSAGE'; payload: Message }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'UPDATE_SESSION_DATA'; payload: Partial<SessionData> }
  | { type: 'RESET_CHAT' }
  | { type: 'TOGGLE_VOICE'; payload: boolean };

const initialState: ChatState = {
  messages: [],
  sessionData: {
    grammarScore: 0,
    vocabularyTips: [],
    improvements: [],
    totalMessages: 0,
    sessionDuration: 0,
  },
  isLoading: false,
  voiceEnabled: true,
};

const chatReducer = (state: ChatState, action: ChatAction): ChatState => {
  switch (action.type) {
    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.payload],
        sessionData: {
          ...state.sessionData,
          totalMessages: state.sessionData.totalMessages + 1,
        },
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'UPDATE_SESSION_DATA':
      return {
        ...state,
        sessionData: {
          ...state.sessionData,
          ...action.payload,
        },
      };
    case 'RESET_CHAT':
      return initialState;
    case 'TOGGLE_VOICE':
      return {
        ...state,
        voiceEnabled: action.payload,
      };
    default:
      return state;
  }
};

interface ChatContextType {
  state: ChatState;
  addMessage: (text: string, sender: 'user' | 'ai') => void;
  setLoading: (loading: boolean) => void;
  updateSessionData: (data: Partial<SessionData>) => void;
  resetChat: () => void;
  sendMessage: (message: string) => Promise<void>;
  toggleVoice: (enabled: boolean) => void;
  speakMessage: (text: string) => void;
  startConversation: (topic: string) => Promise<void>; // new
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  const addMessage = (text: string, sender: 'user' | 'ai') => {
    const message: Message = {
      id: Date.now().toString(),
      text,
      sender,
      timestamp: new Date(),
    };
    dispatch({ type: 'ADD_MESSAGE', payload: message });
  };

  const setLoading = (loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };

  const updateSessionData = (data: Partial<SessionData>) => {
    dispatch({ type: 'UPDATE_SESSION_DATA', payload: data });
  };

  const resetChat = () => {
    dispatch({ type: 'RESET_CHAT' });
  };

  const toggleVoice = (enabled: boolean) => {
    dispatch({ type: 'TOGGLE_VOICE', payload: enabled });
  };

  const speakMessage = (text: string) => {
    if ('speechSynthesis' in window && state.voiceEnabled) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;
      speechSynthesis.speak(utterance);
    }
  };

  const startConversation = async () => {

    setLoading(true);
    let message="Give me short, natural replies (like a human, not like an AI).Do not use emojis or overly formal language.Actively take part in the conversation by asking me simple follow-up questions related to what I said."
    try {
      const sessionId = getOrCreateSessionId();

      const response = await fetch('http://localhost:8080/api/chat/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-Id': sessionId,
        },
        body: JSON.stringify({ message, sessionId }),
      });

      if (!response.ok) {
        throw new Error("Failed to start conversation");
      }

      const data = await response.json();
      console.log("Start Conversation Response:", data);

      // Add AI's first reply
      if (data.firstReply) {
        addMessage(data.firstReply, "ai");
        speakMessage(data.firstReply);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error starting conversation:", error);
      setLoading(false);
    }
  };

  
  useEffect(() => {
    startConversation();
  }, []);

  const sendMessage = async (message: string) => {
    addMessage(message, 'user');
    setLoading(true);
    try {
      const sessionId = getOrCreateSessionId();

      const response = await fetch('http://localhost:8080/api/chat/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-Id': sessionId,
        },
        body: JSON.stringify({ message, sessionId }),
      });
     
      
      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      console.log(data);

      setTimeout(() => {
        const aiResponse =
          data.reply ||
          "That's great! Keep practicing your English. Can you tell me more about that?";
        addMessage(aiResponse, 'ai');
        speakMessage(aiResponse);

        updateSessionData({
          grammarScore: Math.min(
            100,
            state.sessionData.grammarScore + Math.floor(Math.random() * 5)
          ),
          vocabularyTips: [
            ...state.sessionData.vocabularyTips,
            'Great use of vocabulary!',
          ],
          improvements: [
            ...state.sessionData.improvements,
            'Your sentence structure is improving!',
          ],
        });

        setLoading(false);
      }, 1000 + Math.random() * 1000);
    } catch (error) {
      console.error('Error sending message:', error);
      setTimeout(() => {
        const fallbackResponse =
          "I'm sorry, I'm having trouble connecting right now. Can you try again?";
        addMessage(fallbackResponse, 'ai');
        speakMessage(fallbackResponse);
        setLoading(false);
      }, 1000);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        state,
        addMessage,
        setLoading,
        updateSessionData,
        resetChat,
        sendMessage,
        toggleVoice,
        speakMessage,
        startConversation,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
