import React, { useState, useEffect } from 'react';
import { api } from '/src/services/api.js';
import { ShoppingCart, AlertTriangle, Check, LogOut, Search, Package } from 'lucide-react';

export const SalidaView = () => {
  // --- Estados para el Formulario de Sugerencia ---
  const [productos, setProductos] = useState([]);
  const [selectedProducto, setSelectedProducto] = useState('');
  const [cantidad, setCantidad] = useState(1);
  
  // --- Estados para el Proceso ---
  const [sugerencia, setSugerencia] = useState(null); // Guarda la sugerencia de la API
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- Cargar productos para el <select> ---
  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const data = await api.fetchData('productos');
        setProductos(data);
      } catch (err) {
        console.error("Error cargando productos", err);
      }
    };
    cargarProductos();
  }, []);

  // --- Fase 4.1: Obtener Sugerencia FIFO ---
  const handleGetSugerencia = async () => {
    if (!selectedProducto || cantidad <= 0) {
      setError("Debe seleccionar un producto y una cantidad válida.");
      return;
    }
    setLoading(true);
    setError(null);
    setSugerencia(null);
    try {
      // Llamamos al endpoint GET /salidas/sugerencia-fifo?productoId=...&cantidad=...
      const data = await api.fetchData(`salidas/sugerencia-fifo?productoId=${selectedProducto}&cantidad=${cantidad}`);
      
      // Verificamos si la sugerencia cubre el pedido
      const totalSugerido = data.reduce((sum, lote) => sum + lote.cantidadARetirar, 0);
      if (totalSugerido < cantidad) {
        setError(`Stock insuficiente. Solo se encontraron ${totalSugerido} unidades.`);
      }

      setSugerencia(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- Fase 4.2: Confirmar la Salida ---
  const handleConfirmarSalida = async () => {
    if (!sugerencia || sugerencia.length === 0) {
      setError("No hay una sugerencia válida para confirmar.");
      return;
    }
    setLoading(true);
    setError(null);

    // Preparamos el DTO para el POST /salidas/confirmar
    const dataToSend = {
      motivo: "Venta", // (Podemos añadir un <select> para esto luego)
      detalles: sugerencia.map(lote => ({
        loteId: lote.loteId,
        cantidadRetirada: lote.cantidadARetirar
      }))
    };

    try {
      await api.create('salidas/confirmar', dataToSend);
      // ¡Éxito! Limpiamos todo.
      alert('¡Salida confirmada y stock descontado!');
      setSugerencia(null);
      setSelectedProducto('');
      setCantidad(1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* --- 1. Formulario de Solicitud (Sugerencia) --- */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <LogOut size={24} className="text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Salida de Mercancía (FIFO)</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Select de Producto */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Producto</label>
            <select
              value={selectedProducto}
              onChange={(e) => setSelectedProducto(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>-- Seleccione un Producto --</option>
              {productos.map(p => (
                <option key={p.id} value={p.id}>{p.nombre} (SKU: {p.sku})</option>
              ))}
            </select>
          </div>
          
          {/* Input de Cantidad */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad</label>
            <input
              type="number"
              min="1"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <button
          onClick={handleGetSugerencia}
          disabled={loading}
          className="mt-5 w-full flex items-center justify-center space-x-2 bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700 transition-all shadow-md font-medium disabled:opacity-50"
        >
          <Search size={20} />
          <span>Buscar Lotes (Sugerencia FIFO)</span>
        </button>
      </div>

      {/* --- 2. Área de Errores --- */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 rounded-r-lg p-4 flex items-start space-x-3">
          <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* --- 3. Vista de Sugerencia y Confirmación --- */}
      {sugerencia && (
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Sugerencia de Retiro (FIFO)</h3>
          
          <div className="space-y-3 mb-5">
            {sugerencia.length > 0 ? (
              sugerencia.map(lote => (
                <div key={lote.loteId} className="p-4 bg-gray-50 rounded-lg border grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500">Lote</label>
                    <p className="text-sm font-semibold text-gray-800">{lote.numeroLote}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500">Caducidad</label>
                    <p className={`text-sm font-semibold ${isNearExpiry(lote.fechaCaducidad) ? 'text-red-600' : 'text-gray-800'}`}>
                      {lote.fechaCaducidad}
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500">Retirar de este Lote</label>
                    <p className="text-lg font-bold text-blue-700">{lote.cantidadARetirar} <span className="text-sm font-normal text-gray-500">/ disp: {lote.cantidadDisponibleEnLote}</span></p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-600">No se encontró stock para este producto.</p>
            )}
          </div>

          <button
            onClick={handleConfirmarSalida}
            disabled={loading || sugerencia.length === 0}
            className="w-full flex items-center justify-center space-x-2 bg-green-600 text-white px-5 py-3 rounded-lg hover:bg-green-700 transition-all shadow-md font-medium disabled:opacity-50"
          >
            <Check size={20} />
            <span>Confirmar Salida y Descontar Stock</span>
          </button>
        </div>
      )}

    </div>
  );
};

// Pequeñas funciones helper (puedes moverlas a un archivo utils)
const isNearExpiry = (dateString) => {
  if (!dateString) return false;
  const today = new Date();
  const expiryDate = new Date(dateString);
  const diffTime = expiryDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= 30 && diffDays > 0;
};