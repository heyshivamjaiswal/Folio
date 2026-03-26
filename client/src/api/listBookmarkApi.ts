import { apiRequest } from '.';

export async function listBookmarks(getToken: any) {
  return apiRequest(getToken, '/bookmarks');
}
