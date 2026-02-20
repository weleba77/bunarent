import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home as HomeIcon, Search, Plus, User, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-600/20">
            <HomeIcon size={24} className="text-white" />
          </div>
          <span className="text-2xl font-black text-white tracking-tight hidden sm:block">BunaRent</span>
        </Link>

        <div className="flex items-center gap-6">
          <Link to="/properties" className="text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-2 font-medium">
            <Search size={20} />
            <span className="hidden md:block">Explore</span>
          </Link>

          {user ? (
            <>
              {(user.role === 'OWNER' || user.role === 'ADMIN') && (
                <>
                  <Link to="/add-property" className="text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-2 font-medium">
                    <Plus size={20} />
                    <span className="hidden md:block">List Property</span>
                  </Link>
                  <Link to="/dashboard" className="text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-2 font-medium">
                    <LayoutDashboard size={20} />
                    <span className="hidden md:block">Dashboard</span>
                  </Link>
                </>
              )}
              <div className="flex items-center gap-4 pl-4 border-l border-slate-800">
                <div className="flex flex-col items-end hidden sm:flex">
                  <span className="text-sm font-bold text-white">{user.fullName}</span>
                  <span className="text-[10px] text-slate-500 uppercase font-black">{user.role}</span>
                </div>
                <button 
                  onClick={() => { logout(); navigate('/'); }}
                  className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                >
                  <LogOut size={20} />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-slate-400 hover:text-white font-bold text-sm">Login</Link>
              <Link to="/register" className="btn-primary text-sm">Join BunaRent</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
