/**
 * Mic Recorder - Function-based Audio Recording Stream
 * 
 * Pure Web Audio API implementation untuk real-time mic recording.
 * Outputs PCM Int16 mono chunks at configurable sample rate (default: 16kHz).
 * Compatible dengan audioStreamPlayer.ts untuk full-duplex audio pipeline.
 * 
 * Architecture:
 *   Mic → MediaStream → AudioContext → ScriptProcessor → PCM Int16 chunks
 * 
 * Features:
 * - Real-time streaming PCM chunks via callback
 * - Configurable sample rate dengan automatic downsampling
 * - Mono channel with noise suppression & echo cancellation
 * - Proper resource cleanup (tracks, context, nodes)
 * - React hook wrapper dengan state management
 */

import { useState, useRef, useCallback, useEffect } from 'react';

// ========================================
// TYPES
// ========================================

export interface MicRecorderConfig {
  /** Target output sample rate (default: 16000) */
  sampleRate?: number;
  /** ScriptProcessor buffer size - must be power of 2 (default: 4096) */
  bufferSize?: number;
  /** Enable echo cancellation (default: true) */
  echoCancellation?: boolean;
  /** Enable noise suppression (default: true) */
  noiseSuppression?: boolean;
  /** Enable auto gain control (default: true) */
  autoGainControl?: boolean;
  /** Callback fired on each PCM chunk */
  onDataAvailable?: (buffer: ArrayBuffer) => void;
  /** Callback fired when recording starts */
  onStart?: () => void;
  /** Callback fired when recording stops */
  onStop?: () => void;
  /** Callback fired on error */
  onError?: (error: Error) => void;
}

export interface MicRecorderInstance {
  /** Start capturing audio from microphone */
  start: () => Promise<void>;
  /** Stop capturing and release all resources */
  stop: () => void;
  /** Check if currently recording */
  isActive: () => boolean;
}

export interface UseRecorderReturn {
  /** Whether the recorder is currently active */
  isRecording: boolean;
  /** Start recording with optional config override */
  startRecording: (config?: MicRecorderConfig) => Promise<void>;
  /** Stop recording and cleanup resources */
  stopRecording: () => void;
  /** Current error message, if any */
  error: string | null;
}

// ========================================
// PCM CONVERSION HELPERS
// ========================================

/**
 * Downsample Float32 audio buffer from input to output sample rate.
 * Uses nearest-neighbor interpolation for speed.
 */
function downsampleBuffer(
  buffer: Float32Array,
  inputRate: number,
  outputRate: number
): Float32Array {
  if (inputRate === outputRate) return buffer;
  if (inputRate < outputRate) {
    console.warn(`[Recorder] Input rate (${inputRate}) < output rate (${outputRate}), skipping downsample`);
    return buffer;
  }

  const ratio = inputRate / outputRate;
  const newLength = Math.round(buffer.length / ratio);
  const result = new Float32Array(newLength);

  for (let i = 0; i < newLength; i++) {
    const srcIndex = Math.min(Math.round(i * ratio), buffer.length - 1);
    result[i] = buffer[srcIndex];
  }

  return result;
}

/**
 * Convert Float32 [-1, 1] samples to Int16 PCM buffer.
 * Matches the format expected by audioStreamPlayer's pcmToAudioBuffer.
 */
function float32ToInt16(samples: Float32Array): Int16Array {
  const pcm = new Int16Array(samples.length);

  for (let i = 0; i < samples.length; i++) {
    const clamped = Math.max(-1, Math.min(1, samples[i]));
    pcm[i] = clamped < 0 ? clamped * 0x8000 : clamped * 0x7FFF;
  }

  return pcm;
}

// ========================================
// CORE: createMicRecorder
// ========================================

/**
 * Create a function-based microphone recorder instance.
 * 
 * Records audio from the user's microphone and streams PCM Int16 chunks
 * via the `onDataAvailable` callback. No React dependency — pure JS.
 * 
 * @param config - Recorder configuration
 * @returns MicRecorderInstance with start/stop/isActive controls
 * 
 * @example
 * ```ts
 * const recorder = createMicRecorder({
 *   sampleRate: 16000,
 *   onDataAvailable: (buffer) => {
 *     // Send PCM chunk to STT service or WebSocket
 *     socket.send(buffer);
 *   },
 *   onStart: () => console.log('Recording...'),
 *   onStop: () => console.log('Stopped'),
 * });
 * 
 * await recorder.start();
 * // ... user speaks ...
 * recorder.stop();
 * ```
 */
export const createMicRecorder = (
  config: MicRecorderConfig = {}
): MicRecorderInstance => {
  const {
    sampleRate = 16000,
    bufferSize = 4096,
    echoCancellation = true,
    noiseSuppression = true,
    autoGainControl = true,
    onDataAvailable,
    onStart,
    onStop,
    onError,
  } = config;

  // Internal state
  let audioContext: AudioContext | null = null;
  let mediaStream: MediaStream | null = null;
  let sourceNode: MediaStreamAudioSourceNode | null = null;
  let processorNode: ScriptProcessorNode | null = null;
  let active = false;

  /**
   * Release all audio resources
   */
  const cleanup = () => {
    // Disconnect processor
    if (processorNode) {
      processorNode.onaudioprocess = null;
      processorNode.disconnect();
      processorNode = null;
    }

    // Disconnect source
    if (sourceNode) {
      sourceNode.disconnect();
      sourceNode = null;
    }

    // Close AudioContext
    if (audioContext && audioContext.state !== 'closed') {
      audioContext.close().catch(() => {});
      audioContext = null;
    }

    // Stop all media tracks (releases mic LED)
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop());
      mediaStream = null;
    }

    active = false;
  };

  /**
   * Start capturing audio
   */
  const start = async (): Promise<void> => {
    if (active) {
      console.warn('🎤 [Recorder] Already recording');
      return;
    }

    try {
      console.log('🎤 [Recorder] Requesting microphone access...');
      
      // 1. Request microphone access
      mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          echoCancellation,
          noiseSuppression,
          autoGainControl,
        },
      });

      console.log('🎤 [Recorder] ✅ Microphone permission granted');
      console.log('🎤 [Recorder] Media stream active:', mediaStream.active);
      console.log('🎤 [Recorder] Audio tracks:', mediaStream.getAudioTracks().length);

      // 2. Create AudioContext (uses native sample rate from device)
      audioContext = new AudioContext();
      const nativeSampleRate = audioContext.sampleRate;
      
      console.log('🎤 [Recorder] AudioContext created');
      console.log('🎤 [Recorder] AudioContext type:', audioContext.constructor.name);
      console.log('🎤 [Recorder] Available methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(audioContext)).filter(m => m.includes('create')).join(', '));
      console.log('🎤 [Recorder] Native sample rate:', nativeSampleRate);
      console.log('🎤 [Recorder] Target sample rate:', sampleRate);
      console.log('🎤 [Recorder] Buffer size:', bufferSize);

      // 3. Create source node from mic stream
      sourceNode = audioContext.createMediaStreamSource(mediaStream);

      // 4. Create ScriptProcessor for PCM capture
      //    bufferSize must be power of 2: 256, 512, 1024, 2048, 4096, 8192, 16384
      //    ⚠️ ScriptProcessorNode is deprecated but still widely supported
      //    Modern alternative: AudioWorkletNode (requires separate processor file)
      
      // Try modern method first, fallback to deprecated method
      if (typeof audioContext.createScriptProcessor === 'function') {
        console.log('🎤 [Recorder] Using createScriptProcessor (deprecated but compatible)');
        processorNode = audioContext.createScriptProcessor(bufferSize, 1, 1);
      } else if (typeof (audioContext as any).createJavaScriptNode === 'function') {
        console.log('🎤 [Recorder] Using createJavaScriptNode (legacy)');
        processorNode = (audioContext as any).createJavaScriptNode(bufferSize, 1, 1);
      } else {
        throw new Error('Browser does not support audio processing (ScriptProcessor/JavaScriptNode not available)');
      }

      console.log('🎤 [Recorder] Processor node created successfully');

      processorNode.onaudioprocess = (event: AudioProcessingEvent) => {
        if (!active || !onDataAvailable) return;

        // Get raw Float32 mono channel data
        const rawData = event.inputBuffer.getChannelData(0);

        // Downsample from native rate to target rate
        const downsampled = downsampleBuffer(rawData, nativeSampleRate, sampleRate);

        
        // Convert to Int16 PCM
        const pcmInt16 = float32ToInt16(downsampled);

        // Fire callback with ArrayBuffer
        onDataAvailable(pcmInt16.buffer);
      };

      // 5. Connect pipeline: mic → processor → destination
      //    (destination connection required for ScriptProcessor to fire)
      sourceNode.connect(processorNode);
      processorNode.connect(audioContext.destination);

      console.log('🎤 [Recorder] Audio pipeline connected');

      active = true;
      console.log('🎤 [Recorder] Recording started - active =', active);
      onStart?.();

    } catch (err) {
      cleanup();
      const error = err instanceof Error ? err : new Error('Failed to access microphone');
      onError?.(error);
      console.error('❌ [Recorder] Start failed:', error.message);
      throw error;
    }
  };

  /**
   * Stop capturing and release resources
   */
  const stop = () => {
    if (!active) return;

    cleanup();
    onStop?.();
  };

  /**
   * Check if recorder is currently active
   */
  const isActive = () => active;

  return { start, stop, isActive };
};

// ========================================
// REACT HOOK: useRecorder
// ========================================

/**
 * React hook wrapper for createMicRecorder.
 * 
 * Provides reactive state (isRecording, error) and auto-cleanup on unmount.
 * 
 * @param defaultConfig - Default recorder config (can be overridden per-call)
 * @returns UseRecorderReturn
 * 
 * @example
 * ```tsx
 * function VoiceInput() {
 *   const { isRecording, startRecording, stopRecording, error } = useRecorder({
 *     sampleRate: 16000,
 *     onDataAvailable: (buffer) => sendToSTT(buffer),
 *   });
 * 
 *   return (
 *     <button onClick={isRecording ? stopRecording : () => startRecording()}>
 *       {isRecording ? 'Stop' : 'Record'}
 *     </button>
 *   );
 * }
 * ```
 */
export const useRecorder = (defaultConfig?: MicRecorderConfig): UseRecorderReturn => {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const recorderRef = useRef<MicRecorderInstance | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recorderRef.current?.isActive()) {
        recorderRef.current.stop();
      }
    };
  }, []);

  /**
   * Start recording with optional config override
   */
  const startRecording = useCallback(
    async (overrideConfig?: MicRecorderConfig) => {
      console.log("[useRecorder] ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("[useRecorder] startRecording() called");
      console.log("[useRecorder] Current isRecording:", isRecording);
      console.log("[useRecorder] ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

      // Stop existing recorder if active
      if (recorderRef.current?.isActive()) {
        console.log("[useRecorder] ⚠️ Stopping existing recorder first...");
        recorderRef.current.stop();
      }

      setError(null);

      // Merge configs: default → override → internal hooks
      const mergedConfig: MicRecorderConfig = {
        ...defaultConfig,
        ...overrideConfig,
        onStart: () => {
          console.log("[useRecorder] ✅ onStart callback fired - setIsRecording(true)");
          setIsRecording(true);
          defaultConfig?.onStart?.();
          overrideConfig?.onStart?.();
        },
        onStop: () => {
          console.log("[useRecorder] ✅ onStop callback fired - setIsRecording(false)");
          setIsRecording(false);
          defaultConfig?.onStop?.();
          overrideConfig?.onStop?.();
        },
        onError: (err) => {
          console.log("[useRecorder] ❌ onError callback fired:", err.message);
          setError(err.message);
          setIsRecording(false);
          defaultConfig?.onError?.(err);
          overrideConfig?.onError?.(err);
        },
        onDataAvailable: (buffer) => {
          // Chain both callbacks if provided
          defaultConfig?.onDataAvailable?.(buffer);
          overrideConfig?.onDataAvailable?.(buffer);
        },
      };

      // Create new recorder instance
      console.log("[useRecorder] Creating new recorder instance...");
      const recorder = createMicRecorder(mergedConfig);
      recorderRef.current = recorder;

      try {
        console.log("[useRecorder] Calling recorder.start()...");
        await recorder.start();
        console.log("[useRecorder] ✅ recorder.start() completed successfully");
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Recording failed';
        console.error("[useRecorder] ❌ recorder.start() failed:", msg);
        setError(msg);
        setIsRecording(false);
      }
    },
    [defaultConfig]
  );

  /**
   * Stop recording and release resources
   */
  const stopRecording = useCallback(() => {
    if (recorderRef.current?.isActive()) {
      recorderRef.current.stop();
      recorderRef.current = null;
    }
  }, []);

  return { isRecording, startRecording, stopRecording, error };
};

// ========================================
// UTILITY
// ========================================

/**
 * Check if microphone recording is supported in current environment
 */
export const isMicRecordingSupported = (): boolean => {
  return !!(
    navigator?.mediaDevices?.getUserMedia &&
    (typeof AudioContext !== 'undefined' || typeof (window as any).webkitAudioContext !== 'undefined')
  );
};