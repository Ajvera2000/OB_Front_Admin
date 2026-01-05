/**
 * Usuarios Service - Gestión de usuarios (CRUD)
 * @author Vera Bravo Angelo Joel
 */

import http from '../../../core/services/httpClient';

export const usuariosService = {
  getUsuarios: async (filters = {}) => {
    // Si hay query 'q' usar el endpoint de búsqueda del backend
    if (filters && filters.q) {
      const params = new URLSearchParams({ q: filters.q }).toString();
      return http.get(`/usuarios/buscar?${params}`);
    }

    const params = new URLSearchParams(filters).toString();
    const url = params ? `/usuarios/lista?${params}` : '/usuarios/lista';
    return http.get(url);
  },

  getUsuario: async (id) => http.get(`/usuarios/obtener/${id}`),

  createUsuario: async (data) => http.post('/usuarios/crear', data),

  updateUsuario: async (id, data) => http.put(`/usuarios/actualizar/${id}`, data),

  deleteUsuario: async (id) => http.delete(`/usuarios/eliminar/${id}`),
};

export default usuariosService;
