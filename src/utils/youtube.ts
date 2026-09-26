/**
 * Helper to extract YouTube video ID from various YouTube URL formats or plain video ID
 */
export function extractYouTubeId(urlOrId: string): string {
  if (!urlOrId) return '';
  const trimmed = urlOrId.trim();

  // If already an 11-character video ID without slashes or question marks
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  try {
    // Check for youtu.be/VIDEO_ID
    const shortMatch = trimmed.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
    if (shortMatch && shortMatch[1]) {
      return shortMatch[1];
    }

    // Check for youtube.com/watch?v=VIDEO_ID
    const watchMatch = trimmed.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
    if (watchMatch && watchMatch[1]) {
      return watchMatch[1];
    }

    // Check for youtube.com/embed/VIDEO_ID
    const embedMatch = trimmed.match(/embed\/([a-zA-Z0-9_-]{11})/);
    if (embedMatch && embedMatch[1]) {
      return embedMatch[1];
    }

    // Check for youtube.com/shorts/VIDEO_ID
    const shortsMatch = trimmed.match(/shorts\/([a-zA-Z0-9_-]{11})/);
    if (shortsMatch && shortsMatch[1]) {
      return shortsMatch[1];
    }

    // General fallback regex
    const generalMatch = trimmed.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    if (generalMatch && generalMatch[1]) {
      return generalMatch[1];
    }
  } catch (err) {
    console.error('Error parsing YouTube URL:', err);
  }

  return trimmed;
}

/**
 * Returns a high-res or standard YouTube thumbnail URL for a given video ID
 */
export function getYouTubeThumbnailUrl(videoId: string, quality: 'maxres' | 'hq' | 'mq' = 'maxres'): string {
  const cleanId = extractYouTubeId(videoId);
  if (!cleanId) return '';
  
  if (quality === 'maxres') {
    return `https://img.youtube.com/vi/${cleanId}/maxresdefault.jpg`;
  }
  if (quality === 'hq') {
    return `https://img.youtube.com/vi/${cleanId}/hqdefault.jpg`;
  }
  return `https://img.youtube.com/vi/${cleanId}/mqdefault.jpg`;
}

/**
 * Returns standard embed URL
 */
export function getYouTubeEmbedUrl(videoId: string, autoplay: boolean = false): string {
  const cleanId = extractYouTubeId(videoId);
  const params = new URLSearchParams({
    rel: '0',
    modestbranding: '1',
    enablejsapi: '1'
  });
  if (autoplay) {
    params.set('autoplay', '1');
  }
  return `https://www.youtube.com/embed/${cleanId}?${params.toString()}`;
}
