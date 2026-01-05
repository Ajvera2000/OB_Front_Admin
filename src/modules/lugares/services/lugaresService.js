/**
 * Lugares Service - Gestión de lugares (favoritos, zonas seguras, puntos críticos)
 * @author Vera Bravo Angelo Joel
 */

import http from '../../../core/services/httpClient';

export const lugaresService = {
  /**
   * Obtiene lugares (backend: /lugares/lista) - acepta params pero el backend puede ignorarlos
   */
  getLugares: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const url = params ? `/lugares/lista?${params}` : '/lugares/lista';
    return http.get(url);
  },

  getLugar: async (id) => http.get(`/lugares/obtener/${id}`),

  createLugar: async (data) => http.post('/lugares/crear', data),

  updateLugar: async (id, data) => http.put(`/lugares/actualizar/${id}`, data),

  deleteLugar: async (id) => http.delete(`/lugares/eliminar/${id}`),
};

export default lugaresService;
