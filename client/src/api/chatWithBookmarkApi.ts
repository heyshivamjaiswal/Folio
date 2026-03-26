import { apiRequest } from '.';

export async function chatWithBookmark(
  getToken: any,
  data: { bookmarkId: number; question: string }
) {
  return apiRequest(getToken, '/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}
