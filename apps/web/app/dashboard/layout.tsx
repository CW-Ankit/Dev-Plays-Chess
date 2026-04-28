"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Gamepad2, 
  Settings, 
  BarChart3, 
  Trophy, 
  LogOut, 
  Terminal, 
  User,
  Layout
} from "lucide-react";
import { authClient } from "@/lib/authClient";
import { Button } from "@/components/ui/Button";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    { name: "Console", href: "/dashboard", icon: Layout },
    { name: "Runtime", href: "/dashboard/play", icon: Gamepad2 },
    { name: "Version History", href: "/dashboard/matches", icon: BarChart3 },
    { name: "Peer Network", href: "/dashboard/friends", icon: User },
    { name: "Production Stack", href: "/dashboard/leaderboard", icon: Trophy },
    { name: "System Identity", href: "/dashboard/profile", icon: User },
    { name: "Config", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background text-text-primary flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-secondary hidden md:flex flex-col">
        <div className="p-6 flex items-center gap-2">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
            <Terminal className="w-5 h-5 text-background" />
          </div>
          <span className="text-lg font-bold tracking-tight">DevPlays <span className="text-accent">Chess</span></span>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive 
                    ? "bg-accent text-background font-semibold" 
                    : "text-text-secondary hover:text-text-primary hover:bg-background/50"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border space-y-4">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-background/50 border border-border">
            <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent">
              <User className="w-4 h-4" />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate">Developer</p>
              <p className="text-xs text-text-secondary truncate">id_0x4f2a</p>
            </div>
          </div>
          <Button 
            onClick={() => authClient.signOut()}
            variant="ghost" 
            className="w-full justify-start gap-3 px-4 py-3 text-text-secondary hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
          >
            <LogOut className="w-5 h-5" />
            Terminate Session
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <header className="h-16 border-b border-border bg-background/80 backdrop-blur-md px-8 flex items-center justify-between">
          <h2 className="text-sm font-medium text-text-secondary uppercase tracking-widest">
            System / {pathname.split("/").pop() || "Dashboard"}
          </h2>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-medium">
               <span className="relative flex h-2 w-2">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
               </span>
               Environment: Online
             </div>
          </div>
        </header>
        <div className="p-8 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
