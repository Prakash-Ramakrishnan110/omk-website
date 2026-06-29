import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { language, setLanguage } = useLanguage();
  const isAdmin = location.pathname.startsWith('/admin');

  if (isAdmin) {
    return (
      <header className="sticky top-0 z-50 bg-gradient-to-b from-primary to-primary-dark text-white shadow-lg">
        <div className="container mx-auto px-4 h-[66px] flex items-center justify-between">
          <Link to="/admin/dashboard" className="flex items-center gap-3">
            <div className="w-[46px] h-[46px] rounded-full bg-white border-2 border-white/45 flex items-center justify-center shadow-inner overflow-hidden">
              <img src="/omk-logo.webp" alt="OMK Admin" className="w-full h-full object-cover" />
            </div>
            <span className="flex flex-col font-black">
              <strong className="text-[19px] leading-tight tracking-tight">OMK Admin</strong>
              <small className="text-[11px] tracking-[2.5px] opacity-90 text-center">PANEL</small>
            </span>
          </Link>
          <div className="flex gap-4">
            <Link to="/admin/dashboard" className="hover:text-primary-light">Dashboard</Link>
            <Link to="/admin/members" className="hover:text-primary-light">Members</Link>
            <Link to="/admin/settings" className="hover:text-primary-light">Settings</Link>
            <button className="text-white opacity-80 hover:opacity-100">Logout</button>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-b from-primary to-primary-dark text-white shadow-[0_4px_18px_rgba(0,0,0,0.14)]">
      <div className="container mx-auto w-[min(1480px,96%)] h-[66px] flex items-center gap-1 md:gap-[18px]">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2 md:gap-3 shrink min-w-0">
          <div className="w-[32px] h-[32px] md:w-[46px] md:h-[46px] shrink-0 rounded-full bg-white border-[2px] md:border-[3px] border-white/45 flex items-center justify-center shadow-[inset_0_0_0_2px_#b40000] overflow-hidden">
            <img src="/omk-logo.webp" alt="OMK logo" className="w-full h-full object-cover" />
          </div>
          <span className="flex flex-col shrink min-w-0">
            <strong className="text-[11px] sm:text-[14px] md:text-[19px] leading-tight font-black tracking-[-0.2px] whitespace-normal md:whitespace-nowrap break-words">ஒற்றுமை முன்னேற்றக் கழகம்</strong>
            <small className="font-black tracking-[1px] md:tracking-[2.5px] opacity-98 text-center mt-0.5 md:mt-1 text-[8px] md:text-[11px] w-full block">— OMK —</small>
          </span>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden lg:flex items-center gap-[18px] ml-auto font-[850] text-[14px]">
          <Link to="/" className={`opacity-95 py-1.5 relative leading-[1.15] border-b-2 ${location.pathname === '/' ? 'border-white' : 'border-transparent hover:border-white'}`}>Home</Link>
          <a href="#" className="opacity-95 py-1.5 relative leading-[1.15] border-b-2 border-transparent hover:border-white">About</a>
          <a href="#" className="opacity-95 py-1.5 relative leading-[1.15] border-b-2 border-transparent hover:border-white">Vision</a>
          <a href="#" className="opacity-95 py-1.5 relative leading-[1.15] border-b-2 border-transparent hover:border-white">Updates</a>
          <a href="#" className="opacity-95 py-1.5 relative leading-[1.15] border-b-2 border-transparent hover:border-white">Contact</a>
        </nav>

        {/* Language Switch */}
        <div className="flex gap-1 bg-white/10 border border-white/30 rounded-full p-1 shrink-0 ml-auto lg:ml-0">
          <button 
            onClick={() => setLanguage('EN')}
            className={`rounded-full py-1 px-2 md:py-1.5 md:px-3 font-black text-xs md:text-sm transition-colors ${language === 'EN' ? 'bg-white text-primary' : 'bg-transparent text-white'}`}
          >
            English
          </button>
          <button 
            onClick={() => setLanguage('TA')}
            className={`rounded-full py-1 px-2 md:py-1.5 md:px-3 font-black text-xs md:text-sm transition-colors tamil ${language === 'TA' ? 'bg-white text-primary' : 'bg-transparent text-white'}`}
          >
            தமிழ்
          </button>
        </div>

        {/* Join Button */}
        <Link to="/register" className="hidden md:inline-flex border border-white/55 rounded-[9px] py-2 px-3 font-black whitespace-nowrap bg-white/10 shrink-0 text-[14px] hover:bg-white/20 transition-colors">
          👥 Register Now
        </Link>

        {/* Mobile Toggle */}
        <button className="lg:hidden p-2 shrink-0 ml-2" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="lg:hidden absolute top-[66px] left-0 right-0 bg-primary-dark p-4 flex flex-col font-bold shadow-xl border-t border-white/20">
          <Link to="/" className="py-3 border-b border-white/10" onClick={() => setIsOpen(false)}>Home</Link>
          <a href="#" className="py-3 border-b border-white/10">About</a>
          <a href="#" className="py-3 border-b border-white/10">Vision</a>
          <Link to="/register" className="py-3 text-white" onClick={() => setIsOpen(false)}>👥 Join Now</Link>
        </div>
      )}
    </header>
  );
};

export default Navbar;
