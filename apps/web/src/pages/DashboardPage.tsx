import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

import { LayoutDashboard, Settings, Trophy, User, LogOut, PlayCircle, Activity } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#0e1116] text-[#e8e9ea] flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[#14181F] border-r border-[#2C313C] hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="h-16 flex items-center px-6 border-b border-[#2C313C]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-gradient-to-tr from-emerald-400 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <span className="font-bold text-black font-mono tracking-tighter text-lg leading-none">DPC</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">DevPlaysChess</h1>
          </div>
        </div>

        <div className="px-3 py-4 flex flex-col gap-1 flex-1">
          <div className="text-xs font-semibold text-[#8B949E] uppercase tracking-wider mb-2 px-3">Navigation</div>
          
          <NavItem to="/dashboard/game" icon={<PlayCircle className="w-4 h-4" />} label="Host Match" />
          <NavItem to="/dashboard/stats" icon={<Activity className="w-4 h-4" />} label="Metrics" />
          <NavItem to="/dashboard/leaderboard" icon={<Trophy className="w-4 h-4" />} label="Global Rankings" />
          
          <div className="mt-8 text-xs font-semibold text-[#8B949E] uppercase tracking-wider mb-2 px-3">Identity</div>
          <NavItem to="/dashboard/profile" icon={<User className="w-4 h-4" />} label="My Profile" />
          <NavItem to="/dashboard/settings" icon={<Settings className="w-4 h-4" />} label="Configuration" />
        </div>

        <div className="p-4 border-t border-[#2C313C] flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-black font-bold text-xs">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="flex flex-col flex-1 truncate">
            <span className="text-sm font-semibold text-white truncate">{user?.name}</span>
            <span className="text-xs text-[#8B949E]">Elo: {user?.elo || 1200}</span>
          </div>
          <button onClick={handleLogout} className="p-1.5 text-[#8B949E] hover:text-rose-400 transition-colors">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-[#0e1116] border-b border-[#2C313C] flex items-center justify-between px-6 sticky top-0 z-20">
          <div className="flex items-center gap-2 text-sm font-medium text-[#8B949E]">
            <span className="hover:text-white cursor-pointer transition-colors">Dashboard</span>
            <span className="text-[#30363D]">/</span>
            <span className="text-white capitalize">
              {window.location.pathname.split('/').pop()?.replace('Page', '') || 'Overview'}
            </span>
          </div>
          <div className="flex items-center gap-4">
             <div className="text-right hidden md:block">
               <p className="text-xs text-[#8B949E] uppercase font-bold">Current Rank</p>
               <p className="text-sm font-mono text-emerald-400">Novice Strategist</p>
             </div>
          </div>
        </header>
        
        <div className="flex-1 p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

const NavItem = ({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) => (
  <NavLink 
    to={to} 
    className={({ isActive }) => `
      w-full flex items-center gap-3 px-3 py-2 rounded-md font-medium text-sm transition-all
      ${isActive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-[#8B949E] hover:bg-[#21262d] hover:text-[#C9D1D9]'}
    `}
  >
    {icon} {label}
  </NavLink>
);

// Fix for Link's className functioning as a function (react-router-dom v6)
// I need to wrap it in NavLink for this to work.
export default DashboardPage;
