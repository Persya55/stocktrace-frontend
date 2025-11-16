import React from 'react';
import { MapPin, Edit2, Trash2 } from 'lucide-react';

export const UbicacionesTable = ({ data, onEdit, onDelete }) => (
  <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
    {data.length === 0 ? (
      <div className="text-center py-16 px-4">
        <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
          <MapPin size={40} className="text-gray-400" />
        </div>
        <p className="text-gray-600 font-medium">No hay ubicaciones registradas</p>
        <p className="text-gray-500 text-sm mt-2">Comienza agregando tu primera ubicación</p>
      </div>
    ) : (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">ID</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Nombre</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Tipo de Ubicación</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item) => (
              <tr key={item.id} className="hover:bg-blue-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-semibold text-gray-900">#{item.id}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 rounded-lg p-2">
                      <MapPin size={18} className="text-blue-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-900">{item.nombre}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    item.tipoUbicacion === 'MainAlmacen' 
                      ? 'bg-purple-100 text-purple-800' 
                      : item.tipoUbicacion === 'Recepcion'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {item.tipoUbicacion}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm space-x-3">
                  <button 
                    onClick={() => onEdit(item)} 
                    className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-2 rounded-lg transition-all"
                    title="Editar"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button 
                    onClick={() => onDelete(item.id)} 
                    className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded-lg transition-all"
                    title="Eliminar"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
);

export default UbicacionesTable;