import {
  LayoutDashboard,
  Cloud,
  Sprout,
  LineChart,
  TrendingUp,
  FileText,
} from "lucide-react";
import { cn } from "./ui/utils";

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "weather", label: "Weather Analytics", icon: Cloud },
  { id: "soil", label: "Soil Health", icon: Sprout },
  { id: "crop", label: "Crop Analytics", icon: LineChart },
  { id: "market", label: "Market Trends", icon: TrendingUp },
  { id: "reports", label: "Reports", icon: FileText },
];

export function Sidebar({ activePage, onNavigate }: SidebarProps) {
  return (
    <aside className="w-64 border-r bg-sidebar h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto">
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                isActive
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "hover:bg-sidebar-accent text-sidebar-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
