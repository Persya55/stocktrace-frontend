import React, { useState } from 'react';
import { ShoppingCart, Eye, Package, Calendar, User, TrendingUp, ChevronDown, ChevronUp } from 'lucide-react';

export const OrdenesTable = ({ data }) => {
  const [expandedOrder, setExpandedOrder] = useState(null);

  const getStatusBadgeColor = (estatus) => {
    const status = estatus?.toLowerCase() || '';
    if (status.includes('pendiente')) return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    if (status.includes('proceso') || status.includes('preparando')) return 'bg-blue-100 text-blue-800 border-blue-300';
    if (status.includes('completada') || status.includes('entregada')) return 'bg-green-100 text-green-800 border-green-300';
    if (status.includes('cancelada')) return 'bg-red-100 text-red-800 border-red-300';
    return 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const toggleExpand = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
      {data.length === 0 ? (
        <div className="text-center py-16 px-4">
          <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
            <ShoppingCart size={40} className="text-gray-400" />
          </div>
          <p className="text-gray-600 font-medium">No hay órdenes de compra registradas</p>
          <p className="text-gray-500 text-sm mt-2">Las órdenes aparecerán aquí cuando se creen</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">ID</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Fecha y Hora</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Proveedor</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Estado</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Productos</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Detalles</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((orden) => (
                <React.Fragment key={orden.id}>
                  <tr className="hover:bg-blue-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <div className="bg-blue-100 rounded-lg p-2">
                          <ShoppingCart size={16} className="text-blue-600" />
                        </div>
                        <span className="text-sm font-semibold text-gray-900">OC-{orden.id}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <Calendar size={16} className="text-gray-400" />
                        <span className="text-sm text-gray-600">{formatDate(orden.fechaHoraSolicitudTs)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <User size={16} className="text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{orden.nombreProveedor || 'N/A'}</p>
                          <p className="text-xs text-gray-500">ID: {orden.proveedorId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadgeColor(orden.estatus)}`}>
                        {orden.estatus || 'Pendiente'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <Package size={16} className="text-gray-400" />
                        <span className="text-sm font-medium text-gray-700">
                          {orden.detalles?.length || 0} producto{orden.detalles?.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleExpand(orden.id)}
                        className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-all text-sm font-medium"
                      >
                        <Eye size={16} />
                        <span>{expandedOrder === orden.id ? 'Ocultar' : 'Ver'}</span>
                        {expandedOrder === orden.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                    </td>
                  </tr>
                  
                  {/* Fila expandible con detalles */}
                  {expandedOrder === orden.id && orden.detalles && orden.detalles.length > 0 && (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 bg-gray-50">
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2 mb-3">
                            <TrendingUp size={18} className="text-blue-600" />
                            <h4 className="text-sm font-bold text-gray-900">Detalles de la Orden</h4>
                          </div>
                          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                            <table className="min-w-full">
                              <thead className="bg-gray-100">
                                <tr>
                                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Producto</th>
                                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">SKU</th>
                                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Cantidad</th>
                                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Precio Unit.</th>
                                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Subtotal</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-200">
                                {orden.detalles.map((detalle, index) => (
                                  <tr key={index} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 text-sm text-gray-900">{detalle.nombreProducto || 'N/A'}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600">{detalle.skuProducto || 'N/A'}</td>
                                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{detalle.cantidad || 0}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600">
                                      {detalle.precioUnitario ? `$${detalle.precioUnitario.toFixed(2)}` : 'N/A'}
                                    </td>
                                    <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                                      {detalle.precioUnitario && detalle.cantidad 
                                        ? `$${(detalle.precioUnitario * detalle.cantidad).toFixed(2)}` 
                                        : 'N/A'}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                              <tfoot className="bg-gray-50">
                                <tr>
                                  <td colSpan="4" className="px-4 py-3 text-right text-sm font-bold text-gray-900">
                                    Total:
                                  </td>
                                  <td className="px-4 py-3 text-sm font-bold text-blue-600">
                                    ${orden.detalles.reduce((sum, d) => 
                                      sum + (d.precioUnitario || 0) * (d.cantidad || 0), 0
                                    ).toFixed(2)}
                                  </td>
                                </tr>
                              </tfoot>
                            </table>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrdenesTable;