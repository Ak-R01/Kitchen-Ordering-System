const API_URL = import.meta.env.VITE_API_URL;

async function request(path, { method = 'GET', body } = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.message || `Request failed with status ${res.status}`);
  }

  return res.json();
}

export const api = {
  getTableInfo: (token) => request(`/api/tables/by-token/${token}`),
  getMenu: () => request('/api/menu'),
  placeOrder: (tableToken, items) =>
    request('/api/orders', { method: 'POST', body: { tableToken, items } }),
};
