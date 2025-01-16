import React, { useRef, useState, useEffect } from 'react';
import { Button, Space, Alert } from 'antd';
import { Video, StopCircle, Redo, Send } from 'lucide-react';

interface VideoRecorderProps {
  onSubmit: (videoBlob: Blob) => void;
  disabled: boolean;
  isRecruiter?: boolean;
}

function VideoRecorder({ onSubmit, disabled, isRecruiter }: VideoRecorderProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const [recording, setRecording] = useState(false);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string>('');
  const [countdown, setCountdown] = useState<number | null>(null);

  const startRecording = async () => {
    setRecording(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/mp4',
      });

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        setVideoBlob(blob);
        chunksRef.current = [];

        if (videoRef.current) {
          videoRef.current.srcObject = null;
          videoRef.current.src = URL.createObjectURL(blob);
        }

        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setError('');
    } catch (err) {
      setError(
        'Failed to access camera and microphone. Please ensure you have granted the necessary permissions.'
      );
    }
  };

  const initiateCountdown = () => {
    setCountdown(3);
  };

  useEffect(() => {
    if (countdown === null) return;

    if (countdown === 0) {
      setCountdown(null); 
      startRecording(); 
      return;
    }

    const timer = window.setTimeout(() => {
      setCountdown((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown]);

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  const handleSubmit = () => {
    if (videoBlob) {
      onSubmit(videoBlob);
    }

    setVideoBlob(null);
    setRecording(false);

    if (videoRef.current) {
      videoRef.current.src = '';
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          closable
        />
      )}

      <video
        controls
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="w-full rounded-lg bg-gray-100"
        style={{ maxHeight: '400px' }}
      />

      <div className="flex justify-center">
        <Space className={'w-full flex items-center justify-center'}>
          {!recording && !videoBlob && countdown === null && (
            <Button
              disabled={disabled}
              type="primary"
              icon={<Video className="w-4 h-4" />}
              onClick={initiateCountdown}
            >
              Start Recording
            </Button>
          )}

          {videoBlob && !recording && countdown === null && (
            <Button
              disabled={disabled}
              type="primary"
              className={'bg-green-500'}
              icon={<Redo className="w-4 h-4" />}
              onClick={initiateCountdown}
            >
              Re-record
            </Button>
          )}

          {countdown !== null && (
            <div className="text-center text-red-600 text-lg font-semibold">
              Recording starts in: {countdown}
            </div>
          )}

          {recording && (
            <Button
              disabled={disabled}
              danger
              icon={<StopCircle className="w-4 h-4" />}
              onClick={stopRecording}
            >
              Stop Recording
            </Button>
          )}

          {videoBlob && !recording && countdown === null && (
            <Button
              disabled={disabled}
              type="primary"
              icon={<Send className="w-4 h-4" />}
              onClick={handleSubmit}
            >
              Submit Recording
            </Button>
          )}
        </Space>
      </div>
    </div>
  );
}

export default VideoRecorder;