/**
 * AI Assistant Socket.IO Service Handler
 * Manages WebSocket connection for real-time AI assistant interaction
 */

import { io, Socket } from 'socket.io-client';
import type {
  JoinPayload,
  JoinResponse,
  SocketEventListeners,
  SocketConfig,
  AssistantState,
  MessageOutput,
} from './types';

/**
 * AI Assistant Socket Service
 * Handles Socket.IO connection and event management
 */
export class AiAssistantSocketService {
  private socket: Socket | null = null;
  private config: SocketConfig;
  private listeners: SocketEventListeners = {};
  private isConnected = false;

  constructor(config: SocketConfig) {
    this.config = {
      namespace: '',
      path: '/socket.io',
      ...config,
    };
  }

  /**
   * Connect to socket server
   * @param listeners - Event listeners for socket events
   */
  connect(listeners?: SocketEventListeners): void {
    if (this.socket?.connected) {
      return;
    }

    // Only update listeners if provided (don't overwrite with undefined)
    if (listeners) {
      this.listeners = listeners;
    }

    if (!this.socket) {
      this.socket = io(`${this.config.baseUrl}${this.config.namespace}`, {
        path: this.config.path,
        transports: ['websocket', 'polling'],
        auth: {
          token: this.config.token,  // ✅ FIX: Use 'token' not 'apiKey'
        },
      });

      this.setupEventListeners();
    } else {
      this.socket.connect();
    }
  }

  /**
   * Setup event listeners for socket
   */
  private setupEventListeners(): void {
    if (!this.socket) return;

    // Connection successful
    this.socket.on('connect', () => {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('[AiAssistantSocket] ✅ CONNECTED');
      console.log('[AiAssistantSocket] Socket ID:', this.socket?.id);
      console.log('[AiAssistantSocket] Connected:', this.socket?.connected);
      console.log('[AiAssistantSocket] Transport:', this.socket?.io?.engine?.transport?.name);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
      this.isConnected = true; // ✅ Update internal state
      
      if (this.listeners?.onConnect) {
        this.listeners.onConnect();
      }
    });

    // Connection error
    this.socket.on('connect_error', (error) => {
      this.isConnected = false; // ✅ Update internal state
      
      if (this.listeners?.onError) {
        this.listeners.onError(error);
      }
    });

    // Disconnected
    this.socket.on('disconnect', (reason) => {
      this.isConnected = false; // ✅ Update internal state
      
      if (this.listeners?.onDisconnect) {
        this.listeners.onDisconnect(reason);
      }
    });

    // Assistant state changes
    this.socket.on('assistant_state', (state: AssistantState) => {
      this.listeners.onAssistantState?.(state);
    });

    // Message output (text messages)
    this.socket.on('message_output', (message: MessageOutput) => {
      this.listeners.onMessageOutput?.(message);
    });

    // Audio output (binary chunks)
    this.socket.on('audio_output', (audioChunk: ArrayBuffer) => {
      this.listeners.onAudioOutput?.(audioChunk);
    });

    // Audio complete signal
    this.socket.on('audio_complete', () => {
      this.listeners.onAudioComplete?.();
    });
  }

  /**
   * Join session - initialize user session with metadata
   * @param payload - User metadata for session
   * @returns Promise resolving to join response
   */
  async join(payload: JoinPayload): Promise<JoinResponse> {
    return new Promise((resolve, reject) => {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('[AiAssistantSocket] 📤 JOIN REQUEST');
      console.log('[AiAssistantSocket] Socket Connected?', this.socket?.connected);
      console.log('[AiAssistantSocket] Socket ID:', this.socket?.id);
      console.log('[AiAssistantSocket] Payload:', JSON.stringify(payload, null, 2));
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

      if (!this.socket?.connected) {
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('[AiAssistantSocket] ❌ JOIN FAILED');
        console.log('[AiAssistantSocket] Reason: Socket not connected');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        reject(new Error('Socket not connected'));
        return;
      }

      console.log('[AiAssistantSocket] 🚀 Emitting "join" event...');

      this.socket.emit('join', payload, (response: JoinResponse) => {
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        if (response.status_code === 200) {
          console.log('[AiAssistantSocket] ✅ JOIN SUCCESS');
          console.log('[AiAssistantSocket] Status Code:', response.status_code);
          console.log('[AiAssistantSocket] Message:', response.message);
          console.log('[AiAssistantSocket] Response:', JSON.stringify(response, null, 2));
          console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
          resolve(response);
        } else {
          console.log('[AiAssistantSocket] ❌ JOIN FAILED');
          console.log('[AiAssistantSocket] Status Code:', response.status_code);
          console.log('[AiAssistantSocket] Message:', response.message);
          console.log('[AiAssistantSocket] Response:', JSON.stringify(response, null, 2));
          console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
          reject(new Error(response.message));
        }
      });
    });
  }

  /**
   * Send text input to assistant
   * @param text - User text message
   */
  sendTextInput(text: string): void {
    if (!this.socket?.connected) {
      return;
    }

    this.socket.emit('text_input', text);
  }

  /**
   * Send audio input chunk to assistant
   * @param audioChunk - Binary audio data
   */
  sendAudioInput(audioChunk: Blob | ArrayBuffer): void {
    if (!this.socket?.connected) {
      console.error('[AiAssistantSocket] ❌ Cannot send audio - socket not connected');
      return;
    }

    console.log('[AiAssistantSocket] 🎤 Sending audio chunk:', 
      audioChunk instanceof ArrayBuffer 
        ? `${audioChunk.byteLength} bytes (PCM ArrayBuffer)`
        : `${audioChunk.size} bytes (Blob)`
    );

    this.socket.emit('audio_input', audioChunk);
  }

  /**
   * Disconnect socket
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  /**
   * Get connection status
   */
  getConnectionStatus(): boolean {
    return this.isConnected && this.socket?.connected === true;
  }

  /**
   * Get socket ID
   */
  getSocketId(): string | undefined {
    return this.socket?.id;
  }

  /**
   * Update event listeners dynamically
   */
  updateListeners(listeners: Partial<SocketEventListeners>): void {
    this.listeners = { ...this.listeners, ...listeners };
  }
}

// Singleton instance with hardcoded config
let aiAssistantSocketInstance: AiAssistantSocketService | null = null;

/**
 * Get singleton instance of AI Assistant Socket Service
 * Uses hardcoded configuration for Figma Make environment
 */
export function getAiAssistantSocket(): AiAssistantSocketService {
  if (!aiAssistantSocketInstance) {
    aiAssistantSocketInstance = new AiAssistantSocketService({
      baseUrl: 'https://ai-assistant-dashboard-presight.hinisa.ai',
      token: 'ajari_JVm7hSk14LUnwHaDlXrNR90dw1AIjkPcSenGs4YHFbUNR427PE7nxkPBKz',
      namespace: '/nisa/v1/assistant',
      path: '/socket.io',  // Socket.IO default handshake path
    });
  }
  return aiAssistantSocketInstance;
}

/**
 * Reset singleton instance (useful for testing or reconnection)
 */
export function resetAiAssistantSocket(): void {
  if (aiAssistantSocketInstance) {
    aiAssistantSocketInstance.disconnect();
    aiAssistantSocketInstance = null;
  }
}