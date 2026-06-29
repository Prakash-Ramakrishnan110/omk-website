import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-[#8B0000] to-[#5a0000] text-white mt-10 py-12 pb-[95px] relative z-[1] overflow-hidden">
      <div className="container mx-auto w-[min(1480px,96%)]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Column 1: Brand & Desc */}
          <div className="col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-[62px] h-[62px] min-w-[62px] min-h-[62px] shrink-0 rounded-full bg-white flex items-center justify-center overflow-hidden border-2 border-[#fcc917]">
                <img src="/omk-logo.webp" alt="OMK Logo" className="w-full h-full object-cover" />
              </div>
              <h3 className="text-[24px] font-black m-0 leading-tight tracking-tight">OMK</h3>
            </div>
            <p className="text-[15px] opacity-90 leading-relaxed">
              Rise through unity, change through progress. Public service is our goal.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-[18px] font-bold mb-4 border-b-2 border-[#fcc917]/50 pb-2 inline-block">Quick Links</h3>
            <ul className="grid gap-2.5 text-[15px] opacity-90">
              <li><Link to="/" className="hover:text-[#fcc917] transition-colors">Home</Link></li>
              <li><a href="#" className="hover:text-[#fcc917] transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-[#fcc917] transition-colors">Leadership</a></li>
              <li><a href="#" className="hover:text-[#fcc917] transition-colors">Updates</a></li>
              <li><a href="#" className="hover:text-[#fcc917] transition-colors tamil">படக்காட்சிகள்</a></li>
              <li><a href="#" className="hover:text-[#fcc917] transition-colors tamil">நிகழ்வுகள்</a></li>
            </ul>
          </div>

          {/* Column 3: Our Programs */}
          <div>
            <h3 className="text-[18px] font-bold mb-4 border-b-2 border-[#fcc917]/50 pb-2 inline-block">Our Programs</h3>
            <ul className="grid gap-2.5 text-[15px] opacity-90">
              <li><a href="#" className="hover:text-[#fcc917] transition-colors">Education</a></li>
              <li><a href="#" className="hover:text-[#fcc917] transition-colors">Healthcare</a></li>
              <li><a href="#" className="hover:text-[#fcc917] transition-colors">Youth Development</a></li>
              <li><a href="#" className="hover:text-[#fcc917] transition-colors">Women Development</a></li>
            </ul>
          </div>

          {/* Column 4: Contact Us */}
          <div>
            <h3 className="text-[18px] font-bold mb-4 border-b-2 border-[#fcc917]/50 pb-2 inline-block">Contact Us</h3>
            <ul className="grid gap-3 text-[14px] opacity-90">
              <li className="flex items-start gap-2">
                <span className="mt-1">📍</span>
                <span>25/4, Rayakottai, Denkanikottai Taluk,<br/>Koppakarai Post, Pillari Agraharam,<br/>Krishnagiri, Tamil Nadu - 635116.</span>
              </li>
              <li className="flex items-center gap-2">
                <span>☎</span>
                <a href="tel:+918012810958" className="hover:text-[#fcc917] transition-colors">+91 80128 10958</a>
              </li>
              <li className="flex items-center gap-2">
                <span>✉</span>
                <a href="mailto:info@omktamilnadu.org" className="hover:text-[#fcc917] transition-colors">info@omktamilnadu.org</a>
              </li>
              <li className="flex items-center gap-2">
                <span>🌐</span>
                <a href="https://omktamilnadu.org" target="_blank" rel="noopener noreferrer" className="hover:text-[#fcc917] transition-colors">omktamilnadu.org</a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-[13px] opacity-80">
          <p>
            © Ottrumai Munnetra Kazhagam (OMK). All rights reserved. <br className="md:hidden" />
            <span className="md:ml-2">Developed by <a href="https://fusionengine.vercel.app" target="_blank" rel="noopener noreferrer" className="font-bold text-[#fcc917] hover:underline">Fusion Engine Technology</a></span>
          </p>
          
          <div className="flex gap-2 font-bold text-[14px]">
             <a href="#" className="hover:text-[#fcc917] transition-colors">Facebook</a> · 
             <a href="#" className="hover:text-[#fcc917] transition-colors">X</a> · 
             <a href="#" className="hover:text-[#fcc917] transition-colors">Instagram</a> · 
             <a href="#" className="hover:text-[#fcc917] transition-colors">YouTube</a>
          </div>

          <div className="flex gap-2 font-medium">
             <a href="#" className="hover:text-[#fcc917] transition-colors">Privacy Policy</a> | 
             <a href="#" className="hover:text-[#fcc917] transition-colors">Terms</a> | 
             <Link to="/admin/login" className="hover:text-[#fcc917] transition-colors font-bold">Admin Login</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
