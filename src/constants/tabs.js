import { Package, Users, Box, MapPin, ShoppingCart, ClipboardList } from 'lucide-react';

export const TABS = [
  { id: 'productos', label: 'Productos', icon: Package },
  { id: 'proveedores', label: 'Proveedores', icon: Users },
  { id: 'contenedores', label: 'Contenedores', icon: Box },
  { id: 'ubicaciones', label: 'Ubicaciones', icon: MapPin },
  { id: 'ordenes', label: 'Órdenes de Compra', icon: ShoppingCart },
  { id: 'lotes-stock', label: 'Inventario', icon: ClipboardList },

];

export default TABS;