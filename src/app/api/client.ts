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
  featured: () => apiGet('/posts?featured=1'),
  detail: (id: number) => apiGet(`/posts/${id}`),
  create: (data: any) => apiPost('/posts', data),
  delete: (id: number) =>
    fetch(`${API_BASE}/posts/${id}`, { method: 'DELETE' }),
  comments: (id: number, page = 1, pageSize = 10) => apiGet(`/posts/${id}/comments?page=${page}&pageSize=${pageSize}&lang=${localStorage.getItem("i18nextLng")?.startsWith("en") ? "en" : "zh"}`),
  addComment: (postId: number, content: string, parentId?: number) =>
    apiPost(`/posts/${postId}/comments`, { content, parent_id: parentId || null }),
  like: (id: number) => apiPost(`/posts/${id}/like`),
  unlike: (id: number) => apiPost(`/posts/${id}/unlike`),
  likeComment: (postId: number, commentId: number) =>
    apiPost(`/posts/${postId}/comments/${commentId}/like`, { userId: 1 }),
  pawShake: (id: number) => apiPost(`/posts/${id}/pawshake`),
  favorite: (id: number) => apiPost(`/posts/${id}/favorite`),
  favorites: (userId = 1) => apiGet(`/posts?favorites=1&userId=${userId}`),
  report: (id: number, reason: string) => apiPost(`/posts/${id}/report`, { reason }),
};

async function apiPut(path: string, body?: any) {
  const res = await fetch(`${API_BASE}${path}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: body ? JSON.stringify(body) : undefined });
  const data = await res.json();
  if (data.code !== 0) throw new Error(data.message);
  return data.data;
}

// Users
export const usersApi = {
  get: (id: number) => apiGet(`/users/${id}`),
  follow: (id: number) => apiPost(`/users/${id}/follow`),
  unfollow: (id: number) => apiPost(`/users/${id}/unfollow`),
  block: (id: number) => apiPost(`/users/${id}/block`),
  unblock: (id: number) => apiPost(`/users/${id}/unblock`),
  blockedList: (userId = 1) => apiGet(`/users/blocked/list?userId=${userId}`),
  update: (id: number, data: any) => apiPut(`/users/${id}`, data),
  privacy: (id: number, data: { hide_favorites?: number; hide_likes?: number }) => apiPut(`/users/${id}/privacy`, data),
};

// Places
export const placesApi = {
  list: (lat?: number, lon?: number) =>
    apiGet(`/places${lat !== undefined && lon !== undefined ? `?lat=${lat}&lon=${lon}` : ''}`),
  notes: (id: number) => apiGet(`/places/${id}/notes`),
  create: (data: any) => apiPost('/places', data),
  discoverFeed: (limit?: number) => apiGet(`/places/feed/discover${limit ? `?limit=${limit}` : ''}`),
};

// Notifications
export const notificationsApi = {
  list: (userId = 1) => apiGet(`/notifications?userId=${userId}`),
  unreadCount: (userId = 1) => apiGet(`/notifications/unread-count?userId=${userId}`),
  markRead: (id: number) => fetch(`${API_BASE}/notifications/${id}/read`, { method: 'PUT' }),
  markAllRead: (userId = 1) => apiPost('/notifications/read-all', { userId }),
};

// Pets
export const petsApi = {
  create: (data: any) => apiPost('/pets', data),
};

// Discover (LBS)
export const discoverApi = {
  nearby: (lat: number, lon: number, limit?: number) =>
    apiGet(`/discover/nearby?lat=${lat}&lon=${lon}${limit ? `&limit=${limit}` : ''}`),
};

// Search
export const searchApi = {
  search: (q: string) => apiGet(`/posts/search?q=${encodeURIComponent(q)}`),
};
