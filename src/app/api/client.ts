const API_BASE = 'http://192.168.3.52:3000/api';

export async function apiGet(path: string) {
  const res = await fetch(`${API_BASE}${path}`);
  const data = await res.json();
  if (data.code !== 0) throw new Error(data.message);
  return data.data;
}

export async function apiPost(path: string, body?: any) {
  const res = await fetch(`${API_BASE}${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: body ? JSON.stringify(body) : undefined });
  const data = await res.json();
  if (data.code !== 0) throw new Error(data.message);
  return data.data;
}

// Posts
export const postsApi = {
  list: (page = 1) => apiGet(`/posts?page=${page}&pageSize=10`),
};

// Places
export const placesApi = {
  list: () => apiGet('/places'),
  notes: (id: number) => apiGet(`/places/${id}/notes`),
  discoverFeed: (limit?: number) => apiGet(`/places/feed/discover${limit ? `?limit=${limit}` : ''}`),
};
