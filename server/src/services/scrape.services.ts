import axios from 'axios';
import { Readability } from '@mozilla/readability';
import { JSDOM } from 'jsdom';
import * as cheerio from 'cheerio';

// Helper for retry backoff to prevent immediate spamming
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchWithRetry(url: string, retries = 3, backoffTime = 1000) {
  try {
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });
    return response.data;
  } catch (error) {
    if (retries > 0) {
      console.warn(
        `[scrape] Retrying ${url}... (${retries} left). Waiting ${backoffTime}ms`
      );
      await delay(backoffTime);
      // Exponential backoff: double the wait time for the next retry
      return fetchWithRetry(url, retries - 1, backoffTime * 2);
    }
    throw error;
  }
}

export async function scrapeArticle(url: string) {
  const html = await fetchWithRetry(url);
  const dom = new JSDOM(html, { url });
  const reader = new Readability(dom.window.document);
  const article = reader.parse();

  // CRITICAL: Prevent memory leaks by destroying the JSDOM instance immediately after parsing
  dom.window.close();

  if (article?.textContent?.trim()) {
    console.log(`[scrape] axios+Readability succeeded for ${url}`);
    return {
      title: article.title || 'Article',
      text: article.textContent,
    };
  }

  const $ = cheerio.load(html);
  const paragraphs = $('p')
    .map((_, el) => $(el).text().trim())
    .get()
    .filter((t) => t.length > 40)
    .join('\n\n');

  console.warn(
    `[scrape] Readability failed for ${url}, cheerio got ${paragraphs.length} chars`
  );

  if (paragraphs.length < 400) {
    throw new Error(
      `Insufficient content scraped from ${url} (${paragraphs.length} chars)`
    );
  }

  return {
    title: $('title').text() || 'Article',
    text: paragraphs,
  };
}
