import { BookOpen, Library } from "lucide-react";
import { NavLink } from "react-router-dom";

import { cn } from "@/lib/utils";

const items = [
  { to: "/shelves", label: "Shelves", icon: Library },
  { to: "/books", label: "Books", icon: BookOpen },
];

export function Sidebar() {
  return (
    <aside className="w-56 border-r bg-muted/20 p-4">
      <div className="mb-6 text-sm font-semibold">flower-io admin</div>
      <nav className="flex flex-col gap-1">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                isActive ? "bg-accent text-accent-foreground" : "hover:bg-accent/50",
              )
            }
          >
            <Icon className="size-4" />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
