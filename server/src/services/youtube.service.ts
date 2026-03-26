import { YoutubeTranscript } from 'youtube-transcript';

export async function loadYouTubeTranscript(url: string) {
  const transcript = await YoutubeTranscript.fetchTranscript(url);

  const text = transcript.map((t) => t.text).join('');

  return {
    title: 'YouTube Video',
    text,
  };
}
