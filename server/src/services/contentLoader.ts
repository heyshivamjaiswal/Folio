// services/contentLoader.ts
import { detectSource } from './detectSource.js';
import { scrapeArticle } from './scrape.services.js';
import { loadYouTubeTranscript } from './youtube.service.js';

export async function loadContent(input: string) {
  try {
    const type = detectSource(input);

    if (type === 'web') return await scrapeArticle(input);
    if (type === 'youtube') return await loadYouTubeTranscript(input);

    if (type === 'pdf') {
      throw new Error(
        'PDF links are not supported — please upload the PDF file directly.'
      );
    }

    return { title: 'Text', text: input };
  } catch (error) {
    throw new Error(
      `Failed to load content: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}