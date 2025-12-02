import { Package, Users, Box, MapPin, ShoppingCart } from 'lucide-react';

export const TABS = [
  { id: 'productos', label: 'Productos', icon: Package },
  { id: 'proveedores', label: 'Proveedores', icon: Users },
  { id: 'contenedores', label: 'Contenedores', icon: Box },
  { id: 'ubicaciones', label: 'Ubicaciones', icon: MapPin },
  { id: 'ordenes', label: 'Órdenes de Compra', icon: ShoppingCart },
  { id: 'usuarios', label: 'Usuarios', icon: Users },
];

export default TABS;