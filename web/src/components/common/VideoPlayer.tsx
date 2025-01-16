import React from 'react';

interface VideoPlayerProps {
  url: string;
}

function VideoPlayer({ url }: VideoPlayerProps) {
  return (
    <video
      controls
      className="w-full rounded-lg"
      style={{ maxHeight: '400px', maxWidth: '600px' }}
    >
      <source src={url} type="video/webm" />
      Your browser does not support the video tag.
    </video>
  );
}

export default VideoPlayer;