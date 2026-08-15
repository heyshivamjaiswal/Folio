import { YoutubeLoader } from '@langchain/community/document_loaders/web/youtube';

export type YoutubeSegment = {
  text: string;
  startSeconds: number;
};

export async function loadYouTubeTranscript(url: string) {
  try {
    const loader = YoutubeLoader.createFromUrl(url, {
      language: 'en',
      addVideoInfo: true,
    });

    const docs = await loader.load();

    if (!docs.length || !docs[0].pageContent?.trim()) {
      throw new Error('No transcript available for this video (captions may be disabled)');
    }

    // LangChain's loader returns one Document with full concatenated text + metadata,
    // not per-segment timestamps — so we re-fetch raw segments for timestamp granularity.
    const { YoutubeTranscript } = await import('youtube-transcript');
    let segments: YoutubeSegment[] = [];

    try {
      const raw = await YoutubeTranscript.fetchTranscript(url);
      segments = raw.map((s) => ({
        text: s.text,
        startSeconds: Math.floor(s.offset / 1000),
      }));
    } catch {
      // Timestamp granularity is a nice-to-have; fall back to whole-doc if this fails
      segments = [{ text: docs[0].pageContent, startSeconds: 0 }];
    }

    return {
      title: docs[0].metadata?.title || 'YouTube Video',
      segments,
    };
  } catch (error) {
    throw new Error(
      `Failed to load YouTube transcript: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}