/**
 * Audio Streaming Service using Web Audio API
 * Handles streaming audio playback from PCM chunks (Int16Array format)
 * Adapted from use-audio-player.ts
 */

const SAMPLE_RATE = 24000; // 24kHz sample rate
const NORMALIZATION_FACTOR = 32768; // Int16 normalization

type PcmChunk = Int16Array | ArrayBuffer;

export class AudioStreamService {
  private audioContext: AudioContext | null = null;
  private audioQueue: Int16Array[] = [];
  private isPlaying = false;
  private currentSource: AudioBufferSourceNode | null = null;
  private onPlayingChange?: (isPlaying: boolean) => void;

  constructor(onPlayingChange?: (isPlaying: boolean) => void) {
    this.onPlayingChange = onPlayingChange;
  }

  /**
   * Initialize AudioContext (lazy initialization)
   */
  private initAudioContext(): void {
    if (!this.audioContext) {
      const AC = window.AudioContext || (window as any).webkitAudioContext;
      this.audioContext = new AC();
      console.log('[AudioStream] ✅ AudioContext initialized');
      console.log('[AudioStream] Sample rate:', SAMPLE_RATE, 'Hz');
    }
  }

  /**
   * Convert Int16Array PCM to Float32Array for Web Audio API
   */
  private convertToFloat32Array(chunk: Int16Array): Float32Array {
    const len = chunk.length;
    const float32 = new Float32Array(len);
    
    for (let i = 0; i < len; i++) {
      // Normalize Int16 [-32768, 32767] to Float32 [-1.0, 1.0]
      float32[i] = chunk[i] / NORMALIZATION_FACTOR;
    }
    
    return float32;
  }

  /**
   * Convert ArrayBuffer to Int16Array
   */
  private arrayBufferToInt16Array(buffer: ArrayBuffer): Int16Array {
    return new Int16Array(buffer);
  }

  /**
   * Add audio chunk to queue and start playback if not playing
   * @param audioChunk - Int16Array or ArrayBuffer from socket
   */
  addChunk(audioChunk: PcmChunk): void {
    try {
      this.initAudioContext();

      if (!this.audioContext) {
        console.error('[AudioStream] ❌ AudioContext not available');
        return;
      }

      // Convert ArrayBuffer to Int16Array if needed
      let pcmData: Int16Array;
      if (audioChunk instanceof ArrayBuffer) {
        pcmData = this.arrayBufferToInt16Array(audioChunk);
        console.log('[AudioStream] 📥 Received ArrayBuffer:', audioChunk.byteLength, 'bytes →', pcmData.length, 'samples');
      } else {
        pcmData = audioChunk;
        console.log('[AudioStream] 📥 Received Int16Array:', pcmData.length, 'samples');
      }

      // Check if chunk is valid
      if (pcmData.length === 0) {
        console.warn('[AudioStream] ⚠️ Empty chunk, skipping');
        return;
      }

      // Add to queue
      this.audioQueue.push(pcmData);
      console.log('[AudioStream] 📋 Queue size:', this.audioQueue.length, 'chunks');

      // Start playback if not already playing
      if (!this.isPlaying) {
        this.processAudioQueue();
      }
    } catch (error) {
      console.error('[AudioStream] ❌ Failed to process audio chunk:', error);
    }
  }

  /**
   * Process audio queue - play next chunk
   */
  private processAudioQueue(): void {
    const ctx = this.audioContext;
    
    if (!ctx || this.audioQueue.length === 0) {
      this.isPlaying = false;
      this.onPlayingChange?.(false);
      console.log('[AudioStream] 🔇 Queue empty, stopped playing');
      return;
    }

    // Set playing state
    this.isPlaying = true;
    this.onPlayingChange?.(true);

    // Get next chunk from queue
    const chunk = this.audioQueue.shift();
    if (!chunk || chunk.length === 0) {
      this.isPlaying = false;
      this.onPlayingChange?.(false);
      return;
    }

    try {
      // Convert PCM Int16 to Float32
      const float32Data = this.convertToFloat32Array(chunk);

      // Create audio buffer (mono channel)
      const buffer = ctx.createBuffer(1, float32Data.length, SAMPLE_RATE);
      
      // Copy data to buffer channel
      const channelData = new Float32Array(float32Data.length);
      channelData.set(float32Data);
      buffer.copyToChannel(channelData, 0);

      // Create and configure source node
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);

      // Calculate duration
      const duration = (chunk.length / SAMPLE_RATE).toFixed(3);
      console.log('[AudioStream] 🔊 Playing chunk:', chunk.length, 'samples ≈', duration, 'seconds');

      // Handle playback end
      source.onended = () => {
        console.log('[AudioStream] ✅ Chunk finished');
        
        // Cleanup current source
        if (this.currentSource) {
          try {
            this.currentSource.disconnect();
          } catch (e) {
            // Ignore disconnect errors
          }
          this.currentSource = null;
        }

        // Process next chunk in queue
        this.isPlaying = false;
        this.processAudioQueue();
      };

      // Start playback
      source.start();
      this.currentSource = source;

    } catch (error) {
      console.error('[AudioStream] ❌ Failed to play chunk:', error);
      this.isPlaying = false;
      this.onPlayingChange?.(false);
    }
  }

  /**
   * Stop playback and clear queue
   */
  stop(): void {
    console.log('[AudioStream] 🛑 Stopping playback');

    // Stop current source
    if (this.currentSource) {
      try {
        this.currentSource.onended = null; // Remove handler to prevent recursion
        this.currentSource.stop(0);
        this.currentSource.disconnect();
      } catch (e) {
        // Ignore if already stopped
      }
      this.currentSource = null;
    }

    // Clear queue
    this.audioQueue = [];
    this.isPlaying = false;
    this.onPlayingChange?.(false);
  }

  /**
   * Clear queue without stopping current playback
   */
  clearQueue(): void {
    console.log('[AudioStream] 🗑️ Clearing queue');
    this.audioQueue = [];
  }

  /**
   * Check if currently playing
   */
  getIsPlaying(): boolean {
    return this.isPlaying;
  }

  /**
   * Get queue length
   */
  getQueueLength(): number {
    return this.audioQueue.length;
  }

  /**
   * Cleanup and close AudioContext
   */
  async destroy(): Promise<void> {
    console.log('[AudioStream] 🧹 Destroying AudioContext');
    
    // Stop playback
    this.stop();

    // Close audio context
    if (this.audioContext) {
      try {
        if (this.audioContext.state !== 'closed') {
          await this.audioContext.close();
          console.log('[AudioStream] ✅ AudioContext closed');
        }
      } catch (error) {
        console.error('[AudioStream] ❌ Error closing AudioContext:', error);
      } finally {
        this.audioContext = null;
      }
    }
  }

  /**
   * Resume AudioContext (required after user interaction in some browsers)
   */
  async resume(): Promise<void> {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
      console.log('[AudioStream] ▶️ AudioContext resumed');
    }
  }
}

// Singleton instance
let audioStreamInstance: AudioStreamService | null = null;

/**
 * Get singleton instance of AudioStreamService
 */
export function getAudioStreamService(onPlayingChange?: (isPlaying: boolean) => void): AudioStreamService {
  if (!audioStreamInstance) {
    audioStreamInstance = new AudioStreamService(onPlayingChange);
  }
  return audioStreamInstance;
}

/**
 * Reset singleton instance
 */
export function resetAudioStreamService(): void {
  if (audioStreamInstance) {
    void audioStreamInstance.destroy();
    audioStreamInstance = null;
  }
}
