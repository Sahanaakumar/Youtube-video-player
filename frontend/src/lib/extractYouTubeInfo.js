export default function extractYouTubeInfo(url) {
    // Extract video ID - supports youtu.be/ID, ?v=ID, /embed/ID
    const videoIdMatch = url.match(/(?:youtu\.be\/|[?&]v=|\/embed\/)([^?&\s]+)/);
    const videoId = videoIdMatch ? videoIdMatch[1] : null;

    // Extract time parameter (in seconds)
    const timeMatch = url.match(/[?&]t=(\d+)/);
    const time = timeMatch ? parseInt(timeMatch[1]) : 0;

    return {
      videoId,
      time
    };
  }