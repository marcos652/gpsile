import { NavLink } from 'react-router-dom';
import { Package, CheckCircle, Users, Activity, ClipboardList } from 'lucide-react';

const BottomNav = () => {
  return (
    <nav className="bottom-nav">
      <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <Package size={24} />
        <span>Pendentes</span>
      </NavLink>
      <NavLink to="/realizadas" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <CheckCircle size={24} />
        <span>Realizadas</span>
      </NavLink>
      <NavLink to="/usuarios" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <Users size={24} />
        <span>Usuários</span>
      </NavLink>
      <NavLink to="/atribuir" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <ClipboardList size={24} />
        <span>Atribuir</span>
      </NavLink>
      <NavLink to="/admin" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <Activity size={24} />
        <span>Visão Geral</span>
      </NavLink>
    </nav>
  );
};

export default BottomNav;
