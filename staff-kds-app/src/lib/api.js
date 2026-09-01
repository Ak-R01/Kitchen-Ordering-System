const API_URL = import.meta.env.VITE_API_URL;
 
async function request(path, { method = 'GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
 
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
 
  if (!res.ok) {
    // Backend's GlobalExceptionHandler always returns { message: "..." } on errors
    const errorBody = await res.json().catch(() => ({}));
 
    // A 401 on a request that carried a token means the session expired/is invalid -
    // not a login failure (login calls don't pass a token). Broadcast it so
    // AuthContext can log out automatically instead of the KDS silently failing
    // to load orders with no explanation to the person standing at the screen.
    if (res.status === 401 && token) {
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));
    }
 
    throw new Error(errorBody.message || `Request failed with status ${res.status}`);
  }
 
  // 204 No Content responses have no body to parse
  if (res.status === 204) return null;
  return res.json();
}
 
export const api = {
  login: (username, password) =>
    request('/api/admin/login', { method: 'POST', body: { username, password } }),
 
  getOrdersByStatus: (status, token) =>
    request(`/api/orders?status=${status}`, { token }),
 
  updateOrderStatus: (orderId, status, token) =>
    request(`/api/orders/${orderId}/status`, { method: 'PATCH', body: { status }, token }),
 
  changePassword: (currentPassword, newPassword, token) =>
    request('/api/account/password', { method: 'PATCH', body: { currentPassword, newPassword }, token }),
};
