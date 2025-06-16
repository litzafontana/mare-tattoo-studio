
import { DollarSign, MessageCircle, Package, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

const menuItems = [
  {
    name: "Financeiro",
    icon: DollarSign,
    description: "Controle financeiro",
  },
  {
    name: "Conversas",
    icon: MessageCircle,
    description: "Chat com clientes",
  },
  {
    name: "Estoque",
    icon: Package,
    description: "Gestão de produtos",
  },
  {
    name: "Vendas",
    icon: ShoppingCart,
    description: "PDV",
  },
];

export const Sidebar = ({ currentPage, onPageChange }: SidebarProps) => {
  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-slate-800 border-r border-slate-700 p-4">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">M</span>
          </div>
          <div>
            <h2 className="font-bold text-lg text-white">Maré</h2>
            <p className="text-xs text-slate-400">Estúdio de Tatuagem</p>
          </div>
        </div>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.name;
          
          return (
            <button
              key={item.name}
              onClick={() => onPageChange(item.name)}
              className={cn(
                "w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200",
                isActive
                  ? "bg-cyan-600 text-white shadow-lg"
                  : "text-slate-400 hover:text-white hover:bg-slate-700"
              )}
            >
              <Icon size={20} />
              <div className="text-left">
                <div className="font-medium">{item.name}</div>
                <div className="text-xs opacity-75">{item.description}</div>
              </div>
            </button>
          );
        })}
      </nav>

      <div className="absolute bottom-4 left-4 right-4">
        <div className="bg-slate-700 rounded-lg p-3">
          <p className="text-xs text-slate-400 mb-1">Sistema ativo</p>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-white">Online</span>
          </div>
        </div>
      </div>
    </div>
  );
};
