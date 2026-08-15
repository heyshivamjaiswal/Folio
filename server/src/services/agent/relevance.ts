
const RELEVANCE_THRESHOLD = 0.75; // tune this against your actual embedding model's score distribution

export function isRetrievalSufficient(matches: any[]): boolean {
    if (!matches.length) return false;
    const topScore = matches[0]?.score ?? 0;
    return topScore >= RELEVANCE_THRESHOLD;
}