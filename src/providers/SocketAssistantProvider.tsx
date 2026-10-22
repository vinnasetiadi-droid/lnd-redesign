/**
 * Socket Assistant Provider
 * Global provider untuk Socket AI Assistant (Nisa)
 * Auto-connect saat user login, auto-disconnect saat logout
 */

import React, { createContext, useContext, useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { getAiAssistantSocket, resetAiAssistantSocket } from '../services/ai-assistant';
import { getAudioStreamService, resetAudioStreamService } from '../services/audio-stream.service';
import { getSuggestionsWithCache } from '../services/ai-assistant/suggestion.service';
import type { 
  AssistantState, 
  MessageOutput,
  UserRole 
} from '../services/ai-assistant/types';
import { v4 as uuidv4 } from 'uuid';

// Mockup suggestions per role sebagai fallback
const MOCK_SUGGESTIONS: Record<UserRole, Record<string, string[]>> = {
  lnd: {
    'en-US': [
      'How do I create a new training program for leadership development?',
      'Show me the completion rates for our recent compliance training',
      'What are the best practices for evaluating instructor performance?',
    ],
    'id-ID': [
      'Bagaimana cara membuat program pelatihan baru untuk pengembangan kepemimpinan?',
      'Tunjukkan tingkat penyelesaian untuk pelatihan kepatuhan kami yang terbaru',
      'Apa saja praktik terbaik untuk mengevaluasi kinerja instruktur?',
    ],
  },
  trainee: {
    'en-US': [
      'What courses are available for me to enroll in?',
      'How can I track my learning progress and achievements?',
      'When will my course certificate be available for download?',
    ],
    'id-ID': [
      'Kursus apa saja yang tersedia untuk saya ikuti?',
      'Bagaimana cara melacak kemajuan dan pencapaian belajar saya?',
      'Kapan sertifikat kursus saya tersedia untuk diunduh?',
    ],
  },
  hr: {
    'en-US': [
      'Show me the employee training participation report for this quarter',
      'How do I schedule performance review sessions for my team?',
      'What are the current skill gaps in our engineering department?',
    ],
    'id-ID': [
      'Tampilkan laporan partisipasi pelatihan karyawan untuk kuartal ini',
      'Bagaimana cara menjadwalkan sesi tinjauan kinerja untuk tim saya?',
      'Apa saja kesenjangan keterampilan saat ini di departemen teknik kami?',
    ],
  },
  instructor: {
    'en-US': [
      'What is my teaching schedule for this week?',
      'How can I view my trainees progress in the current course?',
      'Where can I upload new learning materials for my class?',
    ],
    'id-ID': [
      'Apa jadwal mengajar saya minggu ini?',
      'Bagaimana cara melihat kemajuan peserta didik saya di kursus saat ini?',
      'Di mana saya bisa mengunggah materi pembelajaran baru untuk kelas saya?',
    ],
  },
};

// Retry utility function
async function retryAsync<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000,
): Promise<T> {
  let lastError: Error | undefined;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`[Retry] Attempt ${attempt}/${maxRetries}`);
      return await fn();
    } catch (error) {
      lastError = error as Error;
      console.warn(`[Retry] Attempt ${attempt} failed:`, error);
      
      if (attempt < maxRetries) {
        console.log(`[Retry] Waiting ${delayMs}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
  }
  
  throw lastError || new Error('Max retries exceeded');
}

// AI state for UI
type AiState = "waiting" | "listening" | "thinking" | "speaking";

// Export Message type for use in components
export interface Message {
  id: string;
  text: string;
  sender: "user" | "nisa";
  timestamp: Date;
  suggestions?: string[];
  is_final?: boolean;
}

interface SocketAssistantContextValue {
  // Connection state
  isConnected: boolean;
  conversationId: string;
  
  // Messages
  messages: Message[];
  streamingMessage: Message | null;
  
  // AI State
  aiState: AiState;
  
  // Suggestions
  suggestions: string[];
  
  // Language
  selectedLanguage: { key: string; value: string };
  setSelectedLanguage: (lang: { key: string; value: string }) => void;
  rejoinWithLanguage: (lang: { key: string; value: string }) => void;
  
  // Methods
  sendTextInput: (text: string) => void;
  sendAudioInput: (audioData: Blob | ArrayBuffer) => void;
  clearMessages: () => void;
  resetConversation: () => void;
}

const SocketAssistantContext = createContext<SocketAssistantContextValue | null>(null);

export const useSocketAssistant = () => {
  const context = useContext(SocketAssistantContext);
  if (!context) {
    throw new Error('useSocketAssistant must be used within SocketAssistantProvider');
  }
  return context;
};

export const SocketAssistantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuthStore();
  
  // Refs
  const conversationIdRef = useRef<string>(uuidv4());
  
  // State
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [streamingMessage, setStreamingMessage] = useState<Message | null>(null);
  const [aiState, setAiState] = useState<AiState>("waiting");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState({ 
    key: "English (United States)", 
    value: "en-US" 
  });

  // Services (memoized)
  const socketService = useMemo(() => getAiAssistantSocket(), []);
  
  const audioStreamService = useMemo(() => 
    getAudioStreamService((isPlaying) => {
      if (isPlaying && aiState !== "speaking") {
        setAiState("speaking");
      } else if (!isPlaying && aiState === "speaking") {
        setAiState("waiting");
      }
    }), 
    [aiState]
  );

  // Map user role to API role
  const getApiRole = useCallback((userRole?: string): UserRole => {
    if (!userRole) return "trainee";
    
    const roleMap: Record<string, UserRole> = {
      ld_team: "lnd",
      trainee: "trainee",
      hr: "hr",
      trainer: "instructor",
    };
    
    return roleMap[userRole] || "trainee";
  }, []);

  // Get job title based on role
  const getJobTitle = useCallback((userRole?: string): string => {
    if (!userRole) return "Trainee";
    
    const titleMap: Record<string, string> = {
      ld_team: "Admin",
      trainee: "Trainee",
      hr: "HR",
      trainer: "Instructor",
    };
    
    return titleMap[userRole] || "Trainee";
  }, []);

  // Load suggestions with retry and fallback to mock
  const loadSuggestionsWithRetry = useCallback(async (
    role: UserRole,
    language: string,
  ): Promise<string[]> => {
    try {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('[Suggestions] 📥 LOADING SUGGESTIONS');
      console.log('[Suggestions] Role:', role);
      console.log('[Suggestions] Language:', language);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

      // Try to fetch from API with 3 retries
      const data = await retryAsync(
        () => getSuggestionsWithCache(role, language as any),
        3, // max 3 retries
        1000, // 1 second delay between retries
      );

      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('[Suggestions] ✅ API SUCCESS');
      console.log('[Suggestions] Questions:', data.questions.length);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

      return data.questions;
    } catch (error) {
      // Fallback to mock suggestions
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('[Suggestions] ⚠️ API FAILED AFTER 3 RETRIES');
      console.log('[Suggestions] Using mock suggestions as fallback');
      console.log('[Suggestions] Error:', error);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

      // Get mock suggestions for this role and language
      const mockForRole = MOCK_SUGGESTIONS[role];
      if (!mockForRole) {
        console.warn('[Suggestions] No mock data for role:', role);
        return [];
      }

      const mockForLanguage = mockForRole[language];
      if (!mockForLanguage) {
        // Fallback to en-US if language not found
        console.warn('[Suggestions] No mock data for language:', language, '- using en-US');
        return mockForRole['en-US'] || [];
      }

      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('[Suggestions] ✅ MOCK FALLBACK SUCCESS');
      console.log('[Suggestions] Questions:', mockForLanguage.length);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

      return mockForLanguage;
    }
  }, []);

  // Methods
  const sendTextInput = useCallback((text: string) => {
    socketService.sendTextInput(text);
  }, [socketService]);

  const sendAudioInput = useCallback((audioData: Blob | ArrayBuffer) => {
    socketService.sendAudioInput(audioData);
  }, [socketService]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setStreamingMessage(null);
  }, []);

  const resetConversation = useCallback(() => {
    conversationIdRef.current = uuidv4();
    clearMessages();
    
    // Rejoin with new conversation ID
    if (isConnected && user) {
      const joinPayload = {
        username: user.name || user.email || 'Guest User',
        conversation_id: conversationIdRef.current,
        language: selectedLanguage.value,
        role: getApiRole(user.role),
        job_title: getJobTitle(user.role),
      };

      socketService.join(joinPayload).catch((error) => {
        console.error('[SocketAssistant] Failed to rejoin after reset:', error);
      });
    }
  }, [isConnected, user, selectedLanguage.value, getApiRole, getJobTitle, socketService, clearMessages]);

  const rejoinWithLanguage = useCallback((lang: { key: string; value: string }) => {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('[SocketAssistant] 🌐 LANGUAGE CHANGE DETECTED');
    console.log('[SocketAssistant] Old Language:', selectedLanguage.value);
    console.log('[SocketAssistant] New Language:', lang.value);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    setSelectedLanguage(lang);
    
    if (!user) return;
    
    // Reload suggestions for new language
    loadSuggestionsWithRetry(getApiRole(user.role), lang.value as any)
      .then((data) => {
        setSuggestions(data);
        console.log('[SocketAssistant] ✅ Suggestions reloaded for new language');
      })
      .catch((error) => {
        console.error('[SocketAssistant] Failed to reload suggestions:', error);
      });
    
    // Rejoin with new language
    if (isConnected) {
      const joinPayload = {
        username: user.name || user.email || 'Guest User',
        conversation_id: conversationIdRef.current,
        language: lang.value,
        role: getApiRole(user.role),
        job_title: getJobTitle(user.role),
      };

      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('[SocketAssistant] 📤 RE-JOINING WITH NEW LANGUAGE');
      console.log('[SocketAssistant] Payload:', joinPayload);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

      socketService.join(joinPayload)
        .then((response) => {
          console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
          console.log('[SocketAssistant] ✅ RE-JOIN SUCCESS');
          console.log('[SocketAssistant] Response:', response);
          console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        })
        .catch((error) => {
          console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
          console.log('[SocketAssistant] ❌ RE-JOIN FAILED');
          console.log('[SocketAssistant] Error:', error);
          console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        });
    } else {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('[SocketAssistant] ⚠️ CANNOT RE-JOIN');
      console.log('[SocketAssistant] isConnected:', isConnected);
      console.log('[SocketAssistant] user:', user ? 'exists' : 'null');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    }
  }, [isConnected, user, getApiRole, getJobTitle, socketService, selectedLanguage.value, loadSuggestionsWithRetry]);

  // Auto-connect socket when user logs in
  useEffect(() => {
    if (!user) {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('[SocketAssistant] ⚠️ NO USER - SKIPPING CONNECTION');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      return;
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('[SocketAssistant] 🚀 AUTO-CONNECTING AT LOGIN');
    console.log('[SocketAssistant] User:', user.name);
    console.log('[SocketAssistant] Role:', user.role, '→', getApiRole(user.role));
    console.log('[SocketAssistant] Language:', selectedLanguage.value);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    // Event handlers
    const handleConnect = () => {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('[SocketAssistant] ✅ CONNECTED');
      console.log('[SocketAssistant] Socket ID:', socketService.getSocketId());
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      setIsConnected(true);

      // Auto-join session
      const joinPayload = {
        username: user.name || user.email || 'Guest User',
        conversation_id: conversationIdRef.current,
        language: selectedLanguage.value,
        role: getApiRole(user.role),
        job_title: getJobTitle(user.role),
      };

      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('[SocketAssistant] 📤 AUTO-JOINING SESSION');
      console.log('[SocketAssistant] Payload:', joinPayload);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

      socketService.join(joinPayload)
        .then((response) => {
          console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
          console.log('[SocketAssistant] ✅ JOIN SUCCESS');
          console.log('[SocketAssistant] Response:', response);
          console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        })
        .catch((error) => {
          console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
          console.log('[SocketAssistant] ❌ JOIN FAILED');
          console.log('[SocketAssistant] Error:', error);
          console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        });
    };

    const handleDisconnect = (reason: string) => {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('[SocketAssistant] ⚠️ DISCONNECTED');
      console.log('[SocketAssistant] Reason:', reason);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      setIsConnected(false);
    };

    const handleError = (error: Error) => {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('[SocketAssistant] ❌ ERROR');
      console.log('[SocketAssistant] Error:', error.message);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    };

    const handleAssistantState = (state: AssistantState) => {
      const stateMap: Record<AssistantState, AiState> = {
        waiting: "waiting",
        listening: "listening",
        thinking: "thinking",
        writing: "thinking",
        speaking: "speaking",
      };
      
      setAiState(stateMap[state] || "waiting");
    };

    const handleMessageOutput = (msgOutput: MessageOutput) => {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('[SocketAssistant] 📨 MESSAGE OUTPUT');
      console.log('[SocketAssistant] Type:', msgOutput.type);
      console.log('[SocketAssistant] Final:', msgOutput.is_final);
      console.log('[SocketAssistant] Content:', msgOutput.content.substring(0, 100) + '...');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

      if (msgOutput.is_final) {
        // Final message - update last message if streaming, or add new if not found
        console.log('[SocketAssistant] ✅ Final message - updating or adding to list');
        
        setMessages((prev) => {
          // Find if there's already a streaming message with same sender
          const streamingIndex = prev.findIndex(
            msg => msg.sender === (msgOutput.type === 'assistant' ? 'nisa' : 'user') && !msg.is_final
          );
          
          if (streamingIndex >= 0) {
            // Update existing streaming message to final
            const updated = [...prev];
            updated[streamingIndex] = {
              ...updated[streamingIndex],
              text: msgOutput.content,
              is_final: true,
            };
            return updated;
          } else {
            // Add new final message
            return [...prev, {
              id: uuidv4(),
              text: msgOutput.content,
              sender: msgOutput.type === 'assistant' ? 'nisa' : 'user',
              timestamp: new Date(),
              is_final: true,
            }];
          }
        });
        setStreamingMessage(null);
      } else {
        // Partial message - add to list if not exists, or update if exists
        console.log('[SocketAssistant] 🔄 Partial message - adding/updating in list');
        
        setMessages((prev) => {
          const sender = msgOutput.type === 'assistant' ? 'nisa' : 'user';
          
          // Find existing streaming message from same sender
          const streamingIndex = prev.findIndex(
            msg => msg.sender === sender && !msg.is_final
          );
          
          if (streamingIndex >= 0) {
            // Update existing streaming message
            const updated = [...prev];
            updated[streamingIndex] = {
              ...updated[streamingIndex],
              text: msgOutput.content,
            };
            return updated;
          } else {
            // Add new streaming message
            return [...prev, {
              id: uuidv4(),
              text: msgOutput.content,
              sender,
              timestamp: new Date(),
              is_final: false,
            }];
          }
        });
      }
    };

    const handleAudioOutput = (audioChunk: ArrayBuffer) => {
      audioStreamService.addChunk(audioChunk);
    };

    const handleAudioComplete = () => {
      audioStreamService.playAll();
    };

    // Register event listeners
    socketService.updateListeners({
      onConnect: handleConnect,
      onDisconnect: handleDisconnect,
      onError: handleError,
      onAssistantState: handleAssistantState,
      onMessageOutput: handleMessageOutput,
      onAudioOutput: handleAudioOutput,
      onAudioComplete: handleAudioComplete,
    });

    // Connect socket
    socketService.connect();

    // Load initial suggestions
    loadSuggestionsWithRetry(getApiRole(user.role), selectedLanguage.value as any)
      .then((data) => {
        setSuggestions(data);
      })
      .catch((error) => {
        console.error('[SocketAssistant] Failed to load suggestions:', error);
      });

    // Cleanup on unmount or user logout
    return () => {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('[SocketAssistant] 🔌 DISCONNECTING');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
      socketService.disconnect();
      resetAiAssistantSocket();
      resetAudioStreamService();
    };
  }, [user, selectedLanguage.value, getApiRole, getJobTitle, socketService, audioStreamService, loadSuggestionsWithRetry]);

  // Provide context value
  const value: SocketAssistantContextValue = {
    isConnected,
    conversationId: conversationIdRef.current,
    messages,
    streamingMessage,
    aiState,
    suggestions,
    selectedLanguage,
    setSelectedLanguage,
    rejoinWithLanguage,
    sendTextInput,
    sendAudioInput,
    clearMessages,
    resetConversation,
  };

  return (
    <SocketAssistantContext.Provider value={value}>
      {children}
    </SocketAssistantContext.Provider>
  );
};