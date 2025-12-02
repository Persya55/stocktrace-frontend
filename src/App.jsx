import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import Header from './components/layout/Header';
import Tabs from './components/layout/Tabs';
import ErrorAlert from './components/common/ErrorAlert';
import Loading from './components/common/Loading';
import ProductosTable from './components/tables/ProductosTable';
import ProveedoresTable from './components/tables/ProveedoresTable';
import ContenedoresTable from './components/tables/ContenedoresTable';
import UbicacionesTable from './components/tables/UbicacionesTable';
import OrdenesTable from './components/tables/OrdenesTable';
import UsuariosTable from './components/tables/UsuariosTable'; // Importar nueva tabla
import FormModal from './components/modals/FormModal';
import Login from './components/Login'; // Importar Login
import { TABS } from './constants/tabs';
import { api } from './services/api';

function App() {
  const [user, setUser] = useState({ name: 'Admin Temp', email: 'admin@temp.com', rol: 'Admin' }); // Bypass login: Estado de usuario inicializado
  const [activeTab, setActiveTab] = useState('productos');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    if (user) { // Solo cargar datos si hay usuario
      fetchData();
    }
  }, [activeTab, user]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.fetchData(activeTab);
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este elemento?')) return;

    try {
      await api.delete(activeTab, id);
      fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingItem(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingItem(null);
  };

  const handleSave = () => {
    setShowModal(false);
    setEditingItem(null);
    fetchData();
  };

  const renderTable = () => {
    switch (activeTab) {
      case 'productos':
        return <ProductosTable data={data} onEdit={handleEdit} onDelete={handleDelete} />;
      case 'proveedores':
        return <ProveedoresTable data={data} onEdit={handleEdit} onDelete={handleDelete} />;
      case 'contenedores':
        return <ContenedoresTable data={data} onEdit={handleEdit} onDelete={handleDelete} />;
      case 'ubicaciones':
        return <UbicacionesTable data={data} onEdit={handleEdit} onDelete={handleDelete} />;
      case 'ordenes':
        return <OrdenesTable data={data} />;
      case 'usuarios': // Nuevo caso
        return <UsuariosTable data={data} onEdit={handleEdit} onDelete={handleDelete} />;
      default:
        return null;
    }
  };

  // Renderizar Login si no hay usuario
  if (!user) {
    return <Login onLogin={setUser} />;
  }

  // Filtrar pestañas según el rol
  const visibleTabs = user?.rol === 'Admin'
    ? TABS
    : TABS.filter(tab => tab.id !== 'usuarios');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header user={user} onLogout={() => setUser(null)} />

      <Tabs tabs={visibleTabs} activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="max-w-7xl mx-auto px-4 py-6">
        {error && <ErrorAlert error={error} />}

        {activeTab !== 'ordenes' && (
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {TABS.find(t => t.id === activeTab)?.label}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Gestiona tus {TABS.find(t => t.id === activeTab)?.label.toLowerCase()}
              </p>
            </div>
            <button
              onClick={handleAdd}
              className="flex items-center space-x-2 bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg font-medium"
            >
              <Plus size={20} />
              <span>Agregar Nuevo</span>
            </button>
          </div>
        )}

        {loading ? <Loading /> : renderTable()}
      </main>

      {showModal && (
        <FormModal
          type={activeTab}
          item={editingItem}
          onClose={handleCloseModal}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

export default App;