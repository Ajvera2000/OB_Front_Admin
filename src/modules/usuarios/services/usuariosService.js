/**
 * Usuarios Service - Gestión de usuarios (CRUD)
 *
 * @description Servicio para gestionar usuarios en el sistema
 */

import http from '../../../core/services/httpClient';

export const usuariosService = {
  getUsuarios: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    return http.get(`/api/admin/usuarios?${params}`);
  },

  getUsuario: async (id) => {
    return http.get(`/api/admin/usuarios/${id}`);
  },

  createUsuario: async (data) => {
    return http.post('/api/admin/usuarios', data);
  },

  updateUsuario: async (id, data) => {
    return http.put(`/api/admin/usuarios/${id}`, data);
  },

  deleteUsuario: async (id) => {
    return http.delete(`/api/admin/usuarios/${id}`);
  },
};

export default usuariosService;
