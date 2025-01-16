import { useState, useEffect, useCallback } from 'react';

interface UseMediaStreamResult {
  stream: MediaStream | null;
  error: string | null;
  startStream: () => Promise<void>;
  stopStream: () => void;
}

export function useMediaStream(): UseMediaStreamResult {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  const stopStream = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [stream]);

  const startStream = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: true,
      });
      setStream(mediaStream);
      setError(null);
    } catch (err) {
      setError('Failed to access camera and microphone');
      console.error('Media Stream Error:', err);
    }
  }, []);

  useEffect(() => {
    return () => {
      stopStream();
    };
  }, [stopStream]);

  return { stream, error, startStream, stopStream };
}