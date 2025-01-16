import { useState, useCallback } from 'react';

interface UseVideoCompressionResult {
  compressVideo: (blob: Blob) => Promise<Blob>;
  isCompressing: boolean;
  error: string | null;
}

export function useVideoCompression(): UseVideoCompressionResult {
  const [isCompressing, setIsCompressing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const compressVideo = useCallback(async (blob: Blob): Promise<Blob> => {
    setIsCompressing(true);
    setError(null);

    try {
      // Create a video element to get the duration
      const video = document.createElement('video');
      const url = URL.createObjectURL(blob);
      
      await new Promise((resolve, reject) => {
        video.onloadedmetadata = resolve;
        video.onerror = reject;
        video.src = url;
      });

      // Create a MediaRecorder with lower bitrate
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const stream = canvas.captureStream();

      // Set canvas dimensions
      canvas.width = Math.min(video.videoWidth, 1280); // Max width 1280px
      canvas.height = (canvas.width * video.videoHeight) / video.videoWidth;

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm',
        videoBitsPerSecond: 1000000, // 1 Mbps
      });

      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);

      const compressed = await new Promise<Blob>((resolve) => {
        mediaRecorder.onstop = () => {
          const compressedBlob = new Blob(chunks, { type: 'video/webm' });
          resolve(compressedBlob);
        };

        video.onplay = () => {
          const drawFrame = () => {
            if (video.paused || video.ended) return;
            ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
            requestAnimationFrame(drawFrame);
          };
          drawFrame();
        };

        mediaRecorder.start();
        video.play();

        setTimeout(() => {
          mediaRecorder.stop();
          video.pause();
        }, video.duration * 1000);
      });

      URL.revokeObjectURL(url);
      return compressed;
    } catch (err) {
      setError('Failed to compress video');
      return blob; // Return original blob if compression fails
    } finally {
      setIsCompressing(false);
    }
  }, []);

  return { compressVideo, isCompressing, error };
}