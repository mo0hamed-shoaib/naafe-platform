import React from 'react';
import { Lightbulb, Shield, CreditCard, Sun } from 'lucide-react';

interface SidebarProps {
  activeItem?: string;
  onItemClick?: (item: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeItem = 'Verification', onItemClick }) => {
  const navigationItems = [
    { name: 'Getting Started', icon: Lightbulb, href: '#' },
    { name: 'Verification', icon: Shield, href: '#' },
    { name: 'Payments', icon: CreditCard, href: '#' },
    { name: 'Platform Rules', icon: Sun, href: '#' },
  ];

  const handleItemClick = (itemName: string) => {
    if (onItemClick) {
      onItemClick(itemName);
    }
  };
  return (
    <aside className="sidebar bg-deep-teal w-64 text-white p-6 hidden lg:flex flex-col flex-shrink-0 fixed h-full">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-8 h-8 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-white rounded"></div>
        </div>
        <h1 className="text-2xl font-bold">Help Center</h1>
      </div>
      
      <nav className="space-y-4">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.name === activeItem;
          
          return (
            <button
              key={item.name}
              onClick={() => handleItemClick(item.name)}
              className={`w-full flex items-center gap-3 p-2 rounded-lg transition-colors duration-300 ${
                isActive 
                  ? 'bg-white/20' 
                  : 'hover:bg-white/10'
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="font-medium">{item.name}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;