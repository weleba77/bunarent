import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Home as HomeIcon, Search, Plus, User, LogOut, LayoutDashboard, MessageSquare, Languages, Heart } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from 'react-i18next';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) => 
    `flex items-center gap-2 font-medium transition-colors ${isActive ? 'text-emerald-400' : 'text-slate-400 hover:text-emerald-400'}`;

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
          <div className="relative group">
            <button className="text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-1 font-medium">
              <Languages size={20} />
              <span className="hidden sm:block uppercase text-xs">{i18n.language.split('-')[0]}</span>
            </button>
            <div className="absolute right-0 mt-2 w-32 bg-slate-900 border border-slate-800 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden">
              <button onClick={() => changeLanguage('en')} className="w-full text-left px-4 py-2 text-sm text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">English</button>
              <button onClick={() => changeLanguage('am')} className="w-full text-left px-4 py-2 text-sm text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">አማርኛ</button>
              <button onClick={() => changeLanguage('om')} className="w-full text-left px-4 py-2 text-sm text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">Afaan Oromoo</button>
            </div>
          </div>

          <NavLink to="/properties" className={navLinkClass}>
            <Search size={20} />
            <span className="hidden md:block">{t('nav.properties')}</span>
          </NavLink>

          {user && (
            <>
              <NavLink to="/wishlist" className={navLinkClass}>
                <Heart size={20} />
                <span className="hidden md:block">{t('wishlist')}</span>
              </NavLink>
              <NavLink to="/messages" className={navLinkClass}>
                <MessageSquare size={20} />
                <span className="hidden md:block">{t('nav.messages')}</span>
              </NavLink>
            </>
          )}

          {user ? (
            <>
              {(user.role === 'OWNER' || user.role === 'ADMIN') && (
                <>
                  <NavLink to="/add-property" className={navLinkClass}>
                    <Plus size={20} />
                    <span className="hidden md:block">{t('nav.addProperty')}</span>
                  </NavLink>
                  <NavLink to="/dashboard" className={navLinkClass}>
                    <LayoutDashboard size={20} />
                    <span className="hidden md:block">{t('nav.dashboard')}</span>
                  </NavLink>
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
              <Link to="/login" className="text-slate-400 hover:text-white font-bold text-sm">{t('nav.login')}</Link>
              <Link to="/register" className="btn-primary text-sm">{t('nav.register')}</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
