/**
 * Lugares Service - Gestión de lugares (favoritos, zonas seguras, puntos críticos)
 * @author Vera Bravo Angelo Joel
 */

import http from '../../../core/services/httpClient';

export const lugaresService = {
  /**
   * Obtiene lugares, opcionalmente filtrados por tipo
   * @param {object} filters - { tipo: 'favorito'|'zona_segura'|'punto_critico', ... }
   */
  getLugares: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    return http.get(`/api/admin/lugares?${params}`);
  },

  getLugar: async (id) => {
    return http.get(`/api/admin/lugares/${id}`);
  },

  createLugar: async (data) => {
    return http.post('/api/admin/lugares', data);
  },

  updateLugar: async (id, data) => {
    return http.put(`/api/admin/lugares/${id}`, data);
  },

  deleteLugar: async (id) => {
    return http.delete(`/api/admin/lugares/${id}`);
  },
};

export default lugaresService;
