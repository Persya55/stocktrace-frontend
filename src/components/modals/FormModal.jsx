import React, { useState, useEffect } from 'react';
import { X, Check, AlertCircle, Trash2 } from 'lucide-react';

import { api } from '/src/services/api.js';


export const FormModal = ({ type, item, onClose, onSave }) => {
  const getInitialFormData = () => {
    if (item) return item;
    if (type === 'productos') return { tipoProducto: 'COMESTIBLE' };
    if (type === 'contenedores') return { estatus: 'Vacio' };
    if (type === 'ubicaciones') return { tipoUbicacion: 'MainAlmacen' };
    if (type === 'ordenes-compra') return { proveedorId: '', detalles: [{ productoId: '', cantidadSolicitada: 1 }] };
    return {};
  };
  
  const [formData, setFormData] = useState(getInitialFormData());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  //Factorizando
  const [ubicaciones, setUbicaciones] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [productos, setProductos] = useState([]);


useEffect(() => {
  const cargarDatos = async () => {
   try {
    if (type === 'contenedores') {
     const data = await api.fetchData('ubicaciones');
     setUbicaciones(data);
    }
    if (type === 'ordenes-compra') {
          setLoading(true); 
     const [provData, prodData] = await Promise.all([
      api.fetchData('proveedores'),
      api.fetchData('productos')
     ]);
     setProveedores(provData);
     setProductos(prodData);
          setLoading(false);
    }
   } catch (err) {
    setLoading(false);
    setError("Error al cargar datos necesarios: " + err.message);
   }
  };
  cargarDatos();
 }, [type]);

 //Código para Ordendes de Compra
 const handleDetalleChange = (index, field, value) => {
  const nuevosDetalles = [...formData.detalles];
  nuevosDetalles[index][field] = value;
  setFormData({ ...formData, detalles: nuevosDetalles });
};

const addDetalleRow = () => {
  setFormData({
    ...formData,
    detalles: [...formData.detalles, { productoId: '', cantidadSolicitada: 1 }]
  });
};

const removeDetalleRow = (index) => {
  const nuevosDetalles = formData.detalles.filter((_, i) => i !== index);
  setFormData({ ...formData, detalles: nuevosDetalles });
};

    const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      let dataToSend = {...formData};
      
      // Preparar datos según el tipo (Esta lógica sigue igual por ahora)
      if (type === 'productos') {
        dataToSend = {
          ...formData,
          tipoProducto: formData.tipoProducto || 'COMESTIBLE',
          largo: parseFloat(formData.largo) || 0,
          ancho: parseFloat(formData.ancho) || 0,
          volumen: parseFloat(formData.volumen) || 0,
          tiempoVidaUtilBase: parseInt(formData.tiempoVidaUtilBase) || 0,
          // (Añadiremos periodoGarantia en la Fase 0.2)
        };
      } else if (type === 'contenedores') {
        dataToSend = {
          ...formData,
          estatus: formData.estatus || 'Vacio',
          ubicacionId: parseInt(formData.ubicacionId) || null
        };
      } else if (type === 'ubicaciones') {
        dataToSend = {
          ...formData,
          tipoUbicacion: formData.tipoUbicacion || 'MainAlmacen'
        };
      } else if (type === 'proveedores') {
        // (Añadiremos la lógica de 'ruc' en la Fase 0.2)
      }
      else if (type === 'ordenes-compra') {
      dataToSend = {
        proveedorId: parseInt(formData.proveedorId),
        detalles: formData.detalles.map(d => ({
          productoId: parseInt(d.productoId),
          cantidadSolicitada: parseInt(d.cantidadSolicitada)
         }))
        };
      }
      if (item) {
        // Si 'item' existe, es una ACTUALIZACIÓN (PUT)
        // Usamos el 'type' (ej: "productos") como el endpoint
        await api.update(type, item.id, dataToSend);
      } else {
        // Si no, es CREACIÓN (POST)
        await api.create(type, dataToSend);
      }
      
      onSave(); // Llama a onSave (que refresca la data)
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
             <option value="DURADERO">Duradero</option> 
           </select>

          <div className="grid grid-cols-3 gap-3">
            <input
              type="number"
              placeholder="Largo cm"
              value={formData.largo || ''}
              onChange={(e) => setFormData({...formData, largo: e.target.value})}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
            <input
              type="number"
              placeholder="Ancho cm"
              value={formData.ancho || ''}
              onChange={(e) => setFormData({...formData, ancho: e.target.value})}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
            <input
              type="number"
              placeholder="Volumen cm "
              value={formData.volumen || ''}
              onChange={(e) => setFormData({...formData, volumen: e.target.value})}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>

          
          {formData.tipoProducto === 'DURADERO' ? (
            <input
              type="number"
              placeholder="Período de Garantía (meses)"
              value={formData.periodoGarantia || ''}
              onChange={(e) => setFormData({...formData, periodoGarantia: e.target.value})}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          ) : (
            <input
              type="number"
              placeholder="Tiempo de vida útil (días)"
              value={formData.tiempoVidaUtilBase || ''}
              onChange={(e) => setFormData({...formData, tiempoVidaUtilBase: e.target.value})}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          )}
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
          placeholder="RUC"
          value={formData.ruc || ''}
          onChange={(e) => setFormData({...formData, ruc: e.target.value})}
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
          <select
            value={formData.ubicacionId || ''}
            onChange={(e) => setFormData({...formData, ubicacionId: e.target.value})}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            >
            <option value="" disabled>-- Seleccione una ubicación --</option>
            {ubicaciones.map(u => (
              <option key={u.id} value={u.id}>
                {u.nombre} (ID: {u.id})
              </option>
            ))}
          </select>
        </>
      );
    } else if (type === 'ubicaciones') {
      return (
        <>
          <input
            type="text"
            placeholder="Nombre de la ubicación (ej: Almacén Principal)"
            value={formData.nombre || ''}
            onChange={(e) => setFormData({...formData, nombre: e.target.value})}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
          <select
            value={formData.tipoUbicacion || 'MainAlmacen'}
            onChange={(e) => setFormData({...formData, tipoUbicacion: e.target.value})}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          >
            <option value="MainAlmacen">Almacén Principal</option>
            <option value="Recepcion">Recepción</option>
            <option value="Despacho">Despacho</option>
            <option value="Cuarentena">Cuarentena</option>
            <option value="Devolucion">Devolución</option>
          </select>
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
            <p className="text-sm text-blue-700">
              <strong>Tipos de ubicación:</strong>
            </p>
            <ul className="text-xs text-blue-600 mt-2 space-y-1 ml-4">
              <li>• <strong>MainAlmacen:</strong> Ubicación principal de almacenamiento</li>
              <li>• <strong>Recepcion:</strong> Área de recepción de productos</li>
              <li>• <strong>Despacho:</strong> Área de preparación de envíos</li>
              <li>• <strong>Cuarentena:</strong> Área de productos en revisión</li>
              <li>• <strong>Devolucion:</strong> Área de productos devueltos</li>
            </ul>
          </div>
        </>
      );
    }
    else if (type === 'ordenes-compra') {
      return (
        <>
          <label className="block text-sm font-medium text-gray-700">Proveedor</label>
          <select
            value={formData.proveedorId || ''}
            onChange={(e) => setFormData({ ...formData, proveedorId: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="" disabled>-- Seleccione un Proveedor --</option>
            {proveedores.map(p => (
              <option key={p.id} value={p.id}>{p.nombre}</option>
            ))}
          </select>

          {/* --- Lista Dinámica de Detalles --- */}
          <label className="block text-sm font-medium text-gray-700 mt-4">Productos</label>
          <div className="space-y-3">
            {formData.detalles.map((detalle, index) => (
              <div key={index} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg border">
                <div className="flex-1">
                  <select
                    value={detalle.productoId}
                    onChange={(e) => handleDetalleChange(index, 'productoId', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="" disabled>-- Producto --</option>
                    {productos.map(p => (
                      <option key={p.id} value={p.id}>{p.nombre} (SKU: {p.sku})</option>
                    ))}
                  </select>
                </div>
                <div className="w-24">
                  <input
                    type="number"
                    placeholder="Cant."
                    min="1"
                    value={detalle.cantidadSolicitada}
                    onChange={(e) => handleDetalleChange(index, 'cantidadSolicitada', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeDetalleRow(index)}
                  className="text-red-500 hover:text-red-700 p-2"
                  disabled={formData.detalles.length <= 1} // No dejar borrar la última fila
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addDetalleRow}
            className="mt-3 text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            + Agregar otro producto
          </button>
        </>
      );
    }
  };

  return (
  <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
   <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] flex flex-col">
    <div className="p-6 pb-4 flex-shrink-0 border-b border-gray-200">
     <div className="flex justify-between items-center">
      <h3 className="text-2xl font-bold text-gray-900">
       {item ? 'Editar' : 'Agregar'} {type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
      </h3>
      <button 
       onClick={onClose} 
       className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-all"
      >
       <X size={24} />
      </button>
     </div>
    </div>
      <div className="overflow-y-auto flex-grow p-6">
     {error && (
      <div className="mb-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg p-4 flex items-start space-x-3">
       <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
       <p className="text-sm text-red-700">{error}</p>
      </div>
     )}

     <div className="space-y-4">
      {renderFields()}
     </div>
        </div>
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
  );
};

export default FormModal;