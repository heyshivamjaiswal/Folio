import type { SourceRef } from "../types/source.js";


export function buildSourceLink(source: SourceRef): { label: string; link: string | null } {
    switch (source.type) {
        case 'youtube': {
            const seconds = source.startSeconds ?? 0;
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;
            const timeLabel = `${mins}:${secs.toString().padStart(2, '0')}`;

            if (!source.url) return { label: `YouTube (${timeLabel})`, link: null };

            // Handle both youtube.com/watch?v=ID and youtu.be/ID formats
            const videoId = extractYoutubeId(source.url);
            const link = videoId
                ? `https://www.youtube.com/watch?v=${videoId}&t=${seconds}s`
                : source.url;

            return { label: `YouTube (${timeLabel})`, link };
        }

        case 'pdf': {
            const label = source.page ? `PDF, page ${source.page}` : 'PDF';
            // No public URL for PDFs (Supabase storage is private) — link is null,
            // frontend can trigger a signed-URL fetch on click instead.
            return { label, link: null };
        }

        case 'web':
        default: {
            return { label: 'Web article', link: source.url ?? null };
        }
    }
}

function extractYoutubeId(url: string): string | null {
    const watchMatch = url.match(/[?&]v=([^&]+)/);
    if (watchMatch) return watchMatch[1];

    const shortMatch = url.match(/youtu\.be\/([^?&]+)/);
    if (shortMatch) return shortMatch[1];

    return null;
}