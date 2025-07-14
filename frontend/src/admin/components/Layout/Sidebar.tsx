import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Users, 
  List, 
  Settings, 
  LogOut,
  Layers
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const navItems = [
    { path: '/admin', icon: Home, label: 'Overview' },
    { path: '/admin/users', icon: Users, label: 'Users' },
    { path: '/admin/categories', icon: List, label: 'Categories' },
    { path: '/admin/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside 
        className={`fixed left-0 top-0 z-50 h-full w-64 bg-deep-teal text-warm-cream transform transition-transform duration-300 ease-in-out lg:transform-none lg:relative lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col p-6">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-10">
            <Layers className="h-8 w-8 text-warm-cream" />
            <h1 className="text-2xl font-bold text-warm-cream">Naafe'</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-3 p-3 rounded-lg transition-all duration-200 hover:bg-soft-teal ${
                        isActive ? 'bg-soft-teal' : ''
                      }`
                    }
                    onClick={onClose}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Logout */}
          <div className="mt-auto">
            <button className="flex w-full items-center gap-3 p-3 rounded-lg transition-all duration-200 hover:bg-soft-teal">
              <LogOut className="h-5 w-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;