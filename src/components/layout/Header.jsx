import React from 'react';

const Header = ({ user, onLogout }) => (
  <header className="bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg">
    <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold text-white">StockTrace</h1>
        <p className="text-sm text-blue-100 mt-1">Sistema de Gestión de Inventario</p>
      </div>

      {user && (
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-white font-medium">{user.nombreCompleto}</p>
            <p className="text-blue-200 text-xs">{user.rol}</p>
          </div>
          <button
            onClick={onLogout}
            className="bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded text-sm transition-colors"
          >
            Cerrar Sesión
          </button>
        </div>
      )}
    </div>
  </header>
);

export default Header;