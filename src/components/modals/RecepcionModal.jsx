import React, { useState, useEffect } from 'react';
import { X, Check, AlertCircle, Plus, Trash2 } from 'lucide-react';
import { api } from '/src/services/api';

export const RecepcionModal = ({ orden, onClose, onSave }) => {
  // --- Estados del Formulario ---
  const getInitialLotes = () => {
    // Sugerimos los lotes basados en lo que se pidió en la OC
    return orden.detalles.map(detalle => ({
      productoId: detalle.productoId,
      nombreProducto: detalle.nombreProducto, // Para mostrar en el label
      cantidadRecibida: detalle.cantidadSolicitada,
      numeroLote: '',
      fechaCaducidad: '',
    }));
  };

  const [formData, setFormData] = useState({
    usuarioId: '',
    lotes: getInitialLotes(),
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- Estados para Cargar Datos ---
  const [usuarios, setUsuarios] = useState([]);
  // (Los productos ya los tenemos dentro de 'orden.detalles')

  // --- Cargar Usuarios al Abrir ---
  useEffect(() => {
    const cargarDatos = async () => {
      setLoading(true);
      try {
        const dataUsuarios = await api.fetchData('usuarios');
        setUsuarios(dataUsuarios);
      } catch (err) {
        setError("Error al cargar lista de usuarios: " + err.message);
      }
      setLoading(false);
    };
    cargarDatos();
  }, []); // Se ejecuta solo una vez al montar

  // --- Handlers para el Formulario Dinámico de Lotes ---
  const handleLoteChange = (index, field, value) => {
    const nuevosLotes = [...formData.lotes];
    nuevosLotes[index][field] = value;
    setFormData({ ...formData, lotes: nuevosLotes });
  };

  const addLoteRow = () => {
    // Permite añadir un lote extra (ej: si un producto llega en 2 lotes)
    setFormData({
      ...formData,
      lotes: [...formData.lotes, { 
        productoId: '', 
        nombreProducto: 'Seleccione producto',
        cantidadRecibida: 1, 
        numeroLote: '', 
        fechaCaducidad: '' 
      }]
    });
  };

  const removeLoteRow = (index) => {
    const nuevosLotes = formData.lotes.filter((_, i) => i !== index);
    setFormData({ ...formData, lotes: nuevosLotes });
  };

  // --- Handler para Guardar ---
  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      // 1. Validar
      if (!formData.usuarioId) {
        throw new Error("Debe seleccionar un usuario que recibe.");
      }
      
      // 2. Preparar el DTO para el backend
      const dataToSend = {
        ordenDeCompraId: orden.id,
        usuarioId: parseInt(formData.usuarioId),
        lotes: formData.lotes.map(lote => ({
          productoId: parseInt(lote.productoId),
          numeroLote: lote.numeroLote,
          fechaCaducidad: lote.fechaCaducidad,
          cantidadRecibida: parseInt(lote.cantidadRecibida)
        }))
      };

      // 3. Enviar a la API
      await api.create('recepciones', dataToSend);
      
      onSave(); // Llama a onSave (que refresca toda la data)
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  // --- Renderizado del Modal ---
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      
      {/* Contenedor principal del Modal */}
   <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col">

        {/* Header */}
    <div className="p-6 pb-4 flex-shrink-0 border-b border-gray-200">
     <div className="flex justify-between items-center">
      <h3 className="text-2xl font-bold text-gray-900">
       Registrar Recepción (OC-{orden.id})
      </h3>
      <button 
       onClick={onClose} 
       className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-all"
      >
       <X size={24} />
      </button>
     </div>
          <p className="text-sm text-gray-500 mt-1">
            Proveedor: <span className="font-medium text-gray-700">{orden.nombreProveedor}</span>
          </p>
    </div>

        {/* Contenido del Formulario (con scroll) */}
        <div className="overflow-y-auto flex-grow p-6 space-y-4">
     {error && (
      <div className="mb-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg p-4 flex items-start space-x-3">
       <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
       <p className="text-sm text-red-700">{error}</p>
      </div>
     )}

          {/* --- Selector de Usuario --- */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Recibido por:</label>
            <select
              value={formData.usuarioId}
              onChange={(e) => setFormData({ ...formData, usuarioId: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="" disabled>-- Seleccione un Usuario --</option>
              {usuarios.map(u => (
                <option key={u.id} value={u.id}>{u.nombreCompleto}</option>
              ))}
            </select>
          </div>

          {/* --- Lista Dinámica de Lotes --- */}
          <label className="block text-sm font-medium text-gray-700 pt-2">Lotes Recibidos:</label>
          <div className="space-y-3">
            {formData.lotes.map((lote, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg border grid grid-cols-2 gap-x-4 gap-y-3 relative">
                
                {/* Producto (basado en la OC) */}
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-500">Producto</label>
                  <p className="text-sm font-semibold text-blue-700">{lote.nombreProducto}</p>
                </div>

                {/* Nro Lote */}
                <div>
                  <label className="block text-xs font-medium text-gray-500">Nro. Lote (Proveedor)</label>
                  <input
                    type="text"
                    placeholder="LOTE-ABC-123"
                    value={lote.numeroLote}
                    onChange={(e) => handleLoteChange(index, 'numeroLote', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                {/* Cantidad */}
                <div>
                  <label className="block text-xs font-medium text-gray-500">Cantidad Recibida</label>
                  <input
                    type="number"
                    min="0"
                    value={lote.cantidadRecibida}
                    onChange={(e) => handleLoteChange(index, 'cantidadRecibida', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                {/* Fecha Caducidad */}
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-500">Fecha de Caducidad</label>
                  <input
                    type="date"
                    value={lote.fechaCaducidad}
                    onChange={(e) => handleLoteChange(index, 'fechaCaducidad', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                {/* Botón Eliminar Fila */}
                <button
                  type="button"
                  onClick={() => removeLoteRow(index)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100"
                  disabled={formData.lotes.length <= 1} // No dejar borrar la última fila
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
          
          <button
            type="button"
            onClick={addLoteRow}
            className="mt-3 text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center space-x-1"
          >
            <Plus size={16} />
            <span>Agregar lote (si el producto vino separado)</span>
          </button>

        </div>

        {/* Pie de página del Modal (Botones) */}
        <div className="p-6 pt-4 flex-shrink-0 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
     <div className="flex space-x-3">
      <button
       onClick={onClose}
       className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-all"
      >
       Cancelar
      </button>
      <button
       onClick={handleSubmit}
       disabled={loading}
       className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-md hover:shadow-lg"
      >
       {loading ? (
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
       ) : (
        <>
         <Check size={20} />
          <span>Confirmar Recepción</span>
         </>
        )}
       </button>
      </div>
    </div>

   </div>
  </div>
 );
};