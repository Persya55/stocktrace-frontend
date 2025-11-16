import React, { useState } from 'react';
import { X, Check, AlertCircle } from 'lucide-react';

const API_BASE_URL = 'http://localhost:8080';

export const FormModal = ({ type, item, onClose, onSave }) => {
  const getInitialFormData = () => {
    if (item) return item;
    if (type === 'productos') return { tipoProducto: 'COMESTIBLE' };
    if (type === 'contenedores') return { estatus: 'Vacio' };
    return {};
  };
  
  const [formData, setFormData] = useState(getInitialFormData());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      let url = '';
      let method = item ? 'PUT' : 'POST';
      let dataToSend = {...formData};
      
      // Preparar datos según el tipo
      if (type === 'productos') {
        dataToSend = {
          ...formData,
          tipoProducto: formData.tipoProducto || 'COMESTIBLE',
          largo: parseFloat(formData.largo) || 0,
          ancho: parseFloat(formData.ancho) || 0,
          volumen: parseFloat(formData.volumen) || 0,
          tiempoVidaUtilBase: parseInt(formData.tiempoVidaUtilBase) || 0
        };
      } else if (type === 'contenedores') {
        dataToSend = {
          ...formData,
          estatus: formData.estatus || 'Vacio',
          ubicacionId: parseInt(formData.ubicacionId) || null
        };
      }
      
      // Determinar URL
      switch(type) {
        case 'productos':
          url = item ? `${API_BASE_URL}/productos/${item.id}` : `${API_BASE_URL}/productos`;
          break;
        case 'proveedores':
          url = item ? `${API_BASE_URL}/proveedores/${item.id}` : `${API_BASE_URL}/proveedores`;
          break;
        case 'contenedores':
          url = item ? `${API_BASE_URL}/contenedores/${item.id}` : `${API_BASE_URL}/contenedores`;
          break;
        case 'ubicaciones':
          url = item ? `${API_BASE_URL}/ubicaciones/${item.id}` : `${API_BASE_URL}/ubicaciones`;
          break;
      }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend)
      });

      if (!response.ok) throw new Error('Error al guardar');
      
      onSave();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderFields = () => {
    if (type === 'productos') {
      return (
        <>
          <input
            type="text"
            placeholder="SKU del producto"
            value={formData.sku || ''}
            onChange={(e) => setFormData({...formData, sku: e.target.value})}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
          <input
            type="text"
            placeholder="Nombre del producto"
            value={formData.nombre || ''}
            onChange={(e) => setFormData({...formData, nombre: e.target.value})}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
          <select
            value={formData.tipoProducto || 'COMESTIBLE'}
            onChange={(e) => setFormData({...formData, tipoProducto: e.target.value})}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          >
            <option value="COMESTIBLE">Comestible</option>
            <option value="NO_COMESTIBLE">No Comestible</option>
          </select>
          <div className="grid grid-cols-3 gap-3">
            <input
              type="number"
              placeholder="Largo"
              value={formData.largo || ''}
              onChange={(e) => setFormData({...formData, largo: e.target.value})}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
            <input
              type="number"
              placeholder="Ancho"
              value={formData.ancho || ''}
              onChange={(e) => setFormData({...formData, ancho: e.target.value})}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
            <input
              type="number"
              placeholder="Volumen"
              value={formData.volumen || ''}
              onChange={(e) => setFormData({...formData, volumen: e.target.value})}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>
          <input
            type="number"
            placeholder="Tiempo de vida útil (días)"
            value={formData.tiempoVidaUtilBase || ''}
            onChange={(e) => setFormData({...formData, tiempoVidaUtilBase: e.target.value})}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
        </>
      );
    } else if (type === 'proveedores') {
      return (
        <>
          <input
            type="text"
            placeholder="Nombre"
            value={formData.nombre || ''}
            onChange={(e) => setFormData({...formData, nombre: e.target.value})}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
          <input
            type="text"
            placeholder="Contacto"
            value={formData.contacto || ''}
            onChange={(e) => setFormData({...formData, contacto: e.target.value})}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
          <input
            type="tel"
            placeholder="Teléfono"
            value={formData.telefono || ''}
            onChange={(e) => setFormData({...formData, telefono: e.target.value})}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email || ''}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
        </>
      );
    } else if (type === 'contenedores') {
      return (
        <>
          <input
            type="text"
            placeholder="Código QR"
            value={formData.codigoQrId || ''}
            onChange={(e) => setFormData({...formData, codigoQrId: e.target.value})}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
          <input
            type="text"
            placeholder="Nombre (ej: Estante A-1-C4)"
            value={formData.nombre || ''}
            onChange={(e) => setFormData({...formData, nombre: e.target.value})}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
          <select
            value={formData.estatus || 'Vacio'}
            onChange={(e) => setFormData({...formData, estatus: e.target.value})}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          >
            <option value="Vacio">Vacío</option>
            <option value="Ocupado">Ocupado</option>
          </select>
          <input
            type="number"
            placeholder="ID de Ubicación"
            value={formData.ubicacionId || ''}
            onChange={(e) => setFormData({...formData, ubicacionId: e.target.value})}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
        </>
      );
    } else if (type === 'ubicaciones') {
      return (
        <>
          <input
            type="text"
            placeholder="Almacén"
            value={formData.almacen || ''}
            onChange={(e) => setFormData({...formData, almacen: e.target.value})}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
          <input
            type="text"
            placeholder="Pasillo"
            value={formData.pasillo || ''}
            onChange={(e) => setFormData({...formData, pasillo: e.target.value})}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
          <input
            type="text"
            placeholder="Estante"
            value={formData.estante || ''}
            onChange={(e) => setFormData({...formData, estante: e.target.value})}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
          <input
            type="text"
            placeholder="Nivel"
            value={formData.nivel || ''}
            onChange={(e) => setFormData({...formData, nivel: e.target.value})}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
        </>
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900">
              {item ? 'Editar' : 'Agregar'} {type.charAt(0).toUpperCase() + type.slice(1)}
            </h3>
            <button 
              onClick={onClose} 
              className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-all"
            >
              <X size={24} />
            </button>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg p-4 flex items-start space-x-3">
              <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            {renderFields()}
            
            <div className="flex space-x-3 pt-6">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-md hover:shadow-lg"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Check size={20} />
                    <span>Guardar</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormModal;