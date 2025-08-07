import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

interface MenuItem {
  id: string;
  label: string;
  path: string;
  icon: string;
}

const menuItems: MenuItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/",
    icon: "📊"
  },
  {
    id: "products",
    label: "Productos",
    path: "/products",
    icon: "📦"
  },
  {
    id: "categories",
    label: "Categorías",
    path: "/categories",
    icon: "🏷️"
  },
  {
    id: "suppliers",
    label: "Proveedores",
    path: "/suppliers",
    icon: "🏢"
  },
  {
    id: "reports",
    label: "Reportes",
    path: "/reports",
    icon: "📈"
  },
  {
    id: "settings",
    label: "Configuración",
    path: "/settings",
    icon: "⚙️"
  }
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleMenuClick = (path: string) => {
    navigate(path);
  };

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}
      
      <div className={`
        fixed top-0 left-0 h-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:relative lg:translate-x-0
        w-64
      `}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">M</span>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">MIDDAS</h2>
                  <p className="text-xs text-gray-500">Gestión Empresarial</p>
                </div>
              </div>
              <button
                onClick={onToggle}
                className="lg:hidden p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          
          <nav className="flex-1 px-4 py-6 space-y-2">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path || 
                             (item.path === '/products' && location.pathname.startsWith('/products')) ||
                             (item.path === '/categories' && location.pathname.startsWith('/categories')) ||
                             (item.path === '/suppliers' && location.pathname.startsWith('/suppliers'));
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleMenuClick(item.path)}
                  className={`
                    w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors duration-200
                    ${isActive 
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>
          
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3 px-4 py-3">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-gray-600 text-sm">👤</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">Usuario</p>
                <p className="text-xs text-gray-500 truncate">admin@middas.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};