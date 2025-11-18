import React from 'react';
import { ClipboardList, AlertTriangle } from 'lucide-react';

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Función para verificar si la fecha está próxima a caducar (ej: 30 días)
const isNearExpiry = (dateString) => {
  if (!dateString) return false;
  const today = new Date();
  const expiryDate = new Date(dateString);
  const diffTime = expiryDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= 30 && diffDays > 0;
};
        export const LoteStockTable = ({ data }) => (
       <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
        {data.length === 0 ? (
       <div className="text-center py-16 px-4">
        <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
       <ClipboardList size={40} className="text-gray-400" />
        </div>
        <p className="text-gray-600 font-medium">No hay inventario registrado</p>
        <p className="text-gray-500 text-sm mt-2">Comienza registrando una recepción</p>
       </div>
        ) : (
       <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
       <thead className="bg-gray-50">
        <tr>
       <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Producto (SKU)</th>
       <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Nro. Lote</th>
       <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Cant. Actual</th>
       <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Caducidad (FIFO)</th>
       <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Ubicación (Estante)</th>
        </tr>
       </thead>
       <tbody className="bg-white divide-y divide-gray-200">
        {data.map((item) => (
       <tr key={item.loteId} className="hover:bg-blue-50 transition-colors">
        <td className="px-6 py-4 whitespace-nowrap">
       <div className="text-sm font-semibold text-gray-900">{item.productoNombre}</div>
                    <div className="text-xs text-gray-500">SKU: {item.sku}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
       <span className="text-sm font-medium text-gray-800">{item.numeroLote}</span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
       <span className="text-lg font-bold text-blue-700">{item.cantidadActual}</span>
                    <span className="text-sm text-gray-500"> / {item.cantidadInicial}</span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
                    {isNearExpiry(item.fechaCaducidad) ? (
                    <span className="flex items-center space-x-2 text-sm font-bold text-red-600">
                        <AlertTriangle size={16} />
                        <span>{formatDate(item.fechaCaducidad)}</span>
                    </span>
                    ) : (
                    <span className="text-sm text-gray-600">{formatDate(item.fechaCaducidad)}</span>
                    )}
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
       {item.contenedorNombre ? (
                    <>
                        <div className="text-sm font-medium text-gray-900">{item.contenedorNombre}</div>
                        <div className="text-xs text-gray-500">En: {item.ubicacionNombre}</div>
                    </>
                    ) : (
                    <span className="text-sm font-medium text-yellow-600 bg-yellow-100 px-3 py-1 rounded-full">
                        En Recepción
                    </span>
                    )}
        </td>
       </tr>
       ))}
       </tbody>
        </table>
        </div>
       )}
        </div>
        );

        export default LoteStockTable;