import React from 'react';
import { ShoppingCart } from 'lucide-react';

export const OrdenesTable = ({ data }) => (
  <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
    {data.length === 0 ? (
      <div className="text-center py-16 px-4">
        <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
          <ShoppingCart size={40} className="text-gray-400" />
        </div>
        <p className="text-gray-600 font-medium">No hay órdenes de compra</p>
      </div>
    ) : (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">ID</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Fecha</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Proveedor</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Estado</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item) => (
              <tr key={item.id} className="hover:bg-blue-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-semibold text-gray-900">{item.id}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-600">{item.fechaOrden}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-medium text-gray-900">{item.proveedorNombre}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2.5 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                    Activo
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
);

export default OrdenesTable;