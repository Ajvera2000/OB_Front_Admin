/**
 * Usuarios Screen - Gestión de Usuarios (CRUD)
 * @author Vera Bravo Angelo Joel
 */

import { useState, useEffect } from 'react';
import { Card, Button, Badge, Toast } from '@shared/components';
import { getUsuarios, createUsuario, updateUsuario, deleteUsuario } from '@services/api';
import './UsuariosScreen.css';

export default function UsuariosScreen() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedUsuario, setSelectedUsuario] = useState(null);
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({ nombre: '', email: '', rol: 'user', estado: 'activo' });

  useEffect(() => {
    loadUsuarios();
  }, []);

  const loadUsuarios = async () => {
    try {
      const response = await getUsuarios();
      if (response.success) {
        setUsuarios(response.data || []);
      } else {
        setToast({ message: 'Error al cargar usuarios del servidor', type: 'error' });
      }
    } catch (error) {
      console.error('Error de conexión al cargar usuarios:', error);
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
        response = await updateUsuario(editingId, formData);
      } else {
        response = await createUsuario(formData);
      }

      if (response.success) {
        setToast({ message: `Usuario ${editingId ? 'actualizado' : 'creado'} correctamente`, type: 'success' });
        await loadUsuarios();
        closeModal();
      } else {
        setToast({ message: 'Error: ' + (response.message || 'No se pudo guardar'), type: 'error' });
      }
    } catch (error) {
      console.error('Error al guardar usuario:', error);
      setToast({ message: 'Error de conexión con el servidor', type: 'error' });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Eliminar este usuario?')) {
      try {
        const response = await deleteUsuario(id);
        if (response.success) {
          setToast({ message: 'Usuario eliminado correctamente', type: 'success' });
          await loadUsuarios();
        } else {
          setToast({ message: 'Error: ' + (response.message || 'No se pudo eliminar'), type: 'error' });
        }
      } catch (error) {
        console.error('Error al eliminar usuario:', error);
        setToast({ message: 'Error de conexión con el servidor', type: 'error' });
      }
    }
  };

  const openModal = (usuario = null) => {
    if (usuario) {
      setEditingId(usuario.id);
      setFormData(usuario);
    } else {
      setEditingId(null);
      setFormData({ nombre: '', email: '', rol: 'user', estado: 'activo' });
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingId(null);
  };

  return (
    <div className="usuarios">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="page-header">
        <div>
          <h1>Gestión de Usuarios</h1>
          <p>Crear, editar y eliminar usuarios del sistema</p>
        </div>
        <Button variant="primary" onClick={() => openModal()}>
          + Nuevo Usuario
        </Button>
      </div>

      <Card>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u.id}>
                  <td>#{u.id}</td>
                  <td>{u.nombre}</td>
                  <td>{u.email}</td>
                  <td><Badge variant="primary" size="sm">{u.rol}</Badge></td>
                  <td><Badge variant={u.estado === 'activo' ? 'success' : 'neutral'} size="sm">{u.estado}</Badge></td>
                  <td className="actions">
                    <button className="btn-icon" onClick={() => setSelectedUsuario(u)} title="Ver detalles">👁️</button>
                    <button className="btn-icon" onClick={() => openModal(u)} title="Editar">✏️</button>
                    <button className="btn-icon" onClick={() => handleDelete(u.id)} title="Eliminar">🗑️</button>
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
              <h2>{editingId ? 'Editar Usuario' : 'Nuevo Usuario'}</h2>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nombre</label>
                <input className="input" value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" className="input" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Rol</label>
                  <select className="input" value={formData.rol} onChange={(e) => setFormData({ ...formData, rol: e.target.value })}>
                    <option value="admin">admin</option>
                    <option value="editor">editor</option>
                    <option value="user">user</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Estado</label>
                  <select className="input" value={formData.estado} onChange={(e) => setFormData({ ...formData, estado: e.target.value })}>
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                  </select>
                </div>
              </div>
              <div className="modal-actions">
                <Button type="button" variant="ghost" onClick={closeModal}>Cancelar</Button>
                <Button type="submit" variant="primary">{editingId ? 'Guardar Cambios' : 'Crear Usuario'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedUsuario && (
        <div className="modal-overlay" onClick={() => setSelectedUsuario(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Detalles de Usuario #{selectedUsuario.id}</h2>
              <button className="modal-close" onClick={() => setSelectedUsuario(null)}>×</button>
            </div>
            <div className="incidencia-details">
              <div className="detail-row">
                <strong>Nombre:</strong>
                <p>{selectedUsuario.nombre}</p>
              </div>
              <div className="detail-row">
                <strong>Email:</strong>
                <p>{selectedUsuario.email}</p>
              </div>
              <div className="detail-row">
                <strong>Rol:</strong>
                <p>{selectedUsuario.rol}</p>
              </div>
              <div className="detail-row">
                <strong>Estado:</strong>
                <p>{selectedUsuario.estado}</p>
              </div>
            </div>
            <div className="modal-actions">
              <Button variant="ghost" onClick={() => setSelectedUsuario(null)}>Cerrar</Button>
              <Button variant="primary" onClick={() => { setSelectedUsuario(null); openModal(selectedUsuario); }}>Editar Usuario</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
