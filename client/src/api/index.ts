const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export async function apiRequest(
  getToken: () => Promise<string | null>,
  url: string,
  options: RequestInit = {}
) {
  const token = await getToken();

  const res = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    throw new Error('API request failed');
  }

  return res.json();
}

//addBookmark

export async function addBookmark(getToken: any, data: { url: string }) {
  return apiRequest(getToken, '/bookmarks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

//chat with bookmark
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

//list bookmark

export async function listBookmarks(getToken: any) {
  return apiRequest(getToken, '/bookmarks');
}

//PDF

export async function uploadPDF(getToken: any, file: File) {
  const token = await getToken();

  const form = new FormData();
  form.append('file', file);

  const res = await fetch(`${BASE_URL}/upload-pdf`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: form,
  });

  if (!res.ok) throw new Error('Failed to upload PDF');
  return res.json();
}
