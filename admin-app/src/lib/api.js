const API_URL = import.meta.env.VITE_API_URL;
 
async function request(path, { method = 'GET', body, token, params } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
 
  const query = params ? `?${new URLSearchParams(params).toString()}` : '';
 
  const res = await fetch(`${API_URL}${path}${query}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
 
  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
 
    // A 401 on a request that carried a token means the session is no longer
    // valid (expired/invalid) - not a login failure, since login calls don't
    // pass a token. Broadcast it so AuthContext can log out automatically
    // instead of the user seeing a confusing error on an otherwise normal action.
    if (res.status === 401 && token) {
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));
    }
 
    throw new Error(errorBody.message || `Request failed with status ${res.status}`);
  }
 
  if (res.status === 204) return null;
  return res.json();
}
 
export const api = {
  login: (username, password) =>
    request('/api/admin/login', { method: 'POST', body: { username, password } }),
 
  // Tables
  getTables: (token) => request('/api/admin/tables', { token }),
  createTable: (tableNumber, token) =>
    request('/api/admin/tables', { method: 'POST', body: { tableNumber }, token }),
  rotateTableToken: (id, token) =>
    request(`/api/admin/tables/${id}/rotate-token`, { method: 'POST', token }),
  deleteTable: (id, token) =>
    request(`/api/admin/tables/${id}`, { method: 'DELETE', token }),
 
  // Categories
  getCategories: (token) => request('/api/admin/categories', { token }),
  createCategory: (name, token) =>
    request('/api/admin/categories', { method: 'POST', body: { name }, token }),
 
  // Menu items
  getMenuItems: (token) => request('/api/admin/menu-items', { token }),
  createMenuItem: (categoryId, item, token) =>
    request(`/api/admin/categories/${categoryId}/menu-items`, { method: 'POST', body: item, token }),
  updateMenuItem: (id, item, token) =>
    request(`/api/admin/menu-items/${id}`, { method: 'PUT', body: item, token }),
  setMenuItemAvailability: (id, available, token) =>
    request(`/api/admin/menu-items/${id}/availability`, { method: 'PATCH', params: { available }, token }),
  deleteMenuItem: (id, token) =>
    request(`/api/admin/menu-items/${id}`, { method: 'DELETE', token }),
 
  // Staff
  getStaff: (token) => request('/api/admin/staff', { token }),
  createStaff: (staff, token) =>
    request('/api/admin/staff', { method: 'POST', body: staff, token }),
  deleteStaff: (id, token) =>
    request(`/api/admin/staff/${id}`, { method: 'DELETE', token }),
 
  // Account (self-service, any logged-in role)
  changePassword: (currentPassword, newPassword, token) =>
    request('/api/account/password', { method: 'PATCH', body: { currentPassword, newPassword }, token }),
 
  // Order history
  getOrderHistory: (status, page, size, token) =>
    request('/api/admin/orders', {
      params: status ? { status, page, size } : { page, size },
      token,
    }),
};
