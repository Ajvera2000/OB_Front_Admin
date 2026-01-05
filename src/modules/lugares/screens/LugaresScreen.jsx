/**
 * Lugares Screen - Gestión de Lugares (Favoritos, Zonas Seguras, Puntos Críticos)
 */

import { useState, useEffect } from 'react';
import { Card, Button, Badge, Toast } from '@shared/components';
import { getLugares, createLugar, updateLugar, deleteLugar } from '@services/api';
import './LugaresScreen.css';

export default function LugaresScreen() {
  const [lugares, setLugares] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('favorito');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedLugar, setSelectedLugar] = useState(null);
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({ nombre: '', descripcion: '', tipo: 'favorito', ubicacion: '' });

  useEffect(() => {
    loadLugares();
  }, [filter]);

  const loadLugares = async () => {
    setLoading(true);
    try {
      const response = await getLugares({ tipo: filter });
      if (response.success) {
        setLugares(response.data || []);
      } else {
        setToast({ message: 'Error al cargar lugares del servidor', type: 'error' });
      }
    } catch (error) {
      console.error('Error de conexión al cargar lugares:', error);
      setToast({ message: 'Error de conexión con el servidor', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (editingId) {
        response = await updateLugar(editingId, formData);
      } else {
        response = await createLugar(formData);
      }

      if (response.success) {
        setToast({ message: `Lugar ${editingId ? 'actualizado' : 'creado'} correctamente`, type: 'success' });
        await loadLugares();
        closeModal();
      } else {
        setToast({ message: 'Error: ' + (response.message || 'No se pudo guardar'), type: 'error' });
      }
    } catch (error) {
      console.error('Error al guardar lugar:', error);
      setToast({ message: 'Error de conexión con el servidor', type: 'error' });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Eliminar este lugar?')) {
      try {
        const response = await deleteLugar(id);
        if (response.success) {
          setToast({ message: 'Lugar eliminado correctamente', type: 'success' });
          await loadLugares();
        } else {
          setToast({ message: 'Error: ' + (response.message || 'No se pudo eliminar'), type: 'error' });
        }
      } catch (error) {
        console.error('Error al eliminar lugar:', error);
        setToast({ message: 'Error de conexión con el servidor', type: 'error' });
      }
    }
  };

  const openModal = (lugar = null) => {
    if (lugar) {
      setEditingId(lugar.id);
      setFormData(lugar);
    } else {
      setEditingId(null);
      setFormData({ nombre: '', descripcion: '', tipo: filter, ubicacion: '' });
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingId(null);
  };

  return (
    <div className="lugares">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="page-header">
        <div>
          <h1>Gestión de Lugares</h1>
          <p>Administrar favoritos, zonas seguras y puntos críticos</p>
        </div>
        <div className="actions-right">
          <div className="filter-tabs">
            <button className={filter === 'favorito' ? 'tab active' : 'tab'} onClick={() => setFilter('favorito')}>Favoritos</button>
            <button className={filter === 'zona_segura' ? 'tab active' : 'tab'} onClick={() => setFilter('zona_segura')}>Zonas Seguras</button>
            <button className={filter === 'punto_critico' ? 'tab active' : 'tab'} onClick={() => setFilter('punto_critico')}>Puntos Críticos</button>
          </div>
          <Button variant="primary" onClick={() => openModal()}>
            + Nuevo Lugar
          </Button>
        </div>
      </div>

      <Card>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Tipo</th>
                <th>Ubicación</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {lugares.map((l) => (
                <tr key={l.id}>
                  <td>#{l.id}</td>
                  <td>{l.nombre}</td>
                  <td><Badge variant="primary" size="sm">{l.tipo}</Badge></td>
                  <td>{l.ubicacion || 'N/D'}</td>
                  <td className="actions">
                    <button className="btn-icon" onClick={() => setSelectedLugar(l)} title="Ver detalles">👁️</button>
                    <button className="btn-icon" onClick={() => openModal(l)} title="Editar">✏️</button>
                    <button className="btn-icon" onClick={() => handleDelete(l.id)} title="Eliminar">🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {modalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingId ? 'Editar Lugar' : 'Nuevo Lugar'}</h2>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nombre</label>
                <input className="input" value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Descripción</label>
                <textarea className="input" value={formData.descripcion} onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })} rows="3" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Tipo</label>
                  <select className="input" value={formData.tipo} onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}>
                    <option value="favorito">Favorito</option>
                    <option value="zona_segura">Zona Segura</option>
                    <option value="punto_critico">Punto Crítico</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Ubicación</label>
                  <input className="input" value={formData.ubicacion} onChange={(e) => setFormData({ ...formData, ubicacion: e.target.value })} />
                </div>
              </div>
              <div className="modal-actions">
                <Button type="button" variant="ghost" onClick={closeModal}>Cancelar</Button>
                <Button type="submit" variant="primary">{editingId ? 'Guardar Cambios' : 'Crear Lugar'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedLugar && (
        <div className="modal-overlay" onClick={() => setSelectedLugar(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Detalles de Lugar #{selectedLugar.id}</h2>
              <button className="modal-close" onClick={() => setSelectedLugar(null)}>×</button>
            </div>
            <div className="incidencia-details">
              <div className="detail-row">
                <strong>Nombre:</strong>
                <p>{selectedLugar.nombre}</p>
              </div>
              <div className="detail-row">
                <strong>Descripción:</strong>
                <p>{selectedLugar.descripcion || 'Sin descripción'}</p>
              </div>
              <div className="detail-row">
                <strong>Tipo:</strong>
                <p>{selectedLugar.tipo}</p>
              </div>
              <div className="detail-row">
                <strong>Ubicación:</strong>
                <p>{selectedLugar.ubicacion || 'N/D'}</p>
              </div>
            </div>
            <div className="modal-actions">
              <Button variant="ghost" onClick={() => setSelectedLugar(null)}>Cerrar</Button>
              <Button variant="primary" onClick={() => { setSelectedLugar(null); openModal(selectedLugar); }}>Editar Lugar</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
