export function getEmbedUrl(videoLink: string): string {
  const watchPattern = /youtube\.com\/watch\?v=([^&]+)/; // Matches YouTube watch URLs
  const shortPattern = /youtu\.be\/([^?]+)/;            // Matches YouTube short URLs

  let videoId = "";

  if (watchPattern.test(videoLink)) {
    videoId = videoLink.match(watchPattern)![1]; // Extracts VIDEO_ID from watch URL
  } else if (shortPattern.test(videoLink)) {
    videoId = videoLink.match(shortPattern)![1]; // Extracts VIDEO_ID from short URL
  }

  return videoId ? `https://www.youtube.com/embed/${videoId}` : ""; // Return embed URL or empty string
}

export function isAxiosError(error: any): boolean {
  return (
      error?.response !== undefined || false
  )
}