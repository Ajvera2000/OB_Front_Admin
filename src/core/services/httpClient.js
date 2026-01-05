/**
 * HTTP Client Base - Configuración centralizada de fetch
 * Incluye envío de cookies (credentials: 'include') y normalización de respuestas
 * @author OpenBlind Team
 */

const API_URL = import.meta.env.VITE_API_BASE || 'http://localhost:8888';

/**
 * Realiza una petición HTTP con manejo de errores y normalización
 */
export async function httpClient(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`;

  const method = (options.method || 'GET').toUpperCase();

  const defaultOptions = {
    method,
    credentials: options.credentials || 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Evitar enviar body en GET
  if (method === 'GET' && defaultOptions.body) delete defaultOptions.body;

  try {
    const response = await fetch(url, defaultOptions);
    const data = await (async () => {
      try { return await response.json(); } catch { return null; }
    })();

    if (!response.ok) {
      const message = (data && (data.message || data.errors)) || response.statusText || 'Error en la petición';
      const err = { message, status: response.status, data };
      throw err;
    }

    // Normalizar formato: soporte res.apiResponse ({ success, message, data }) y respuestas directas
    if (data && (data.hasOwnProperty('success') || data.hasOwnProperty('data'))) {
      return data;
    }

    return { success: true, data };
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
}

/**
 * Métodos HTTP de conveniencia
 */
export const http = {
  get: (endpoint, options = {}) => httpClient(endpoint, { ...options, method: 'GET' }),

  post: (endpoint, data, options = {}) => httpClient(endpoint, {
    ...options,
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) }
  }),

  put: (endpoint, data, options = {}) => httpClient(endpoint, {
    ...options,
    method: 'PUT',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) }
  }),

  patch: (endpoint, data, options = {}) => httpClient(endpoint, {
    ...options,
    method: 'PATCH',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) }
  }),

  delete: (endpoint, options = {}) => httpClient(endpoint, {
    ...options,
    method: 'DELETE',
  }),
};

export default http;
