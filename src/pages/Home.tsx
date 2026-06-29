import React from 'react';
import { Link } from 'react-router-dom';
import { Flag, Target, Shield, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const translations = {
  EN: {
    heroMain: "Unity for Progress.",
    heroSub: "ஒற்றுமை முன்னேற்றக் கழகம்",
    heroDesc: "A people-centric political movement for the welfare of Tamil Nadu and its people.",
    heroDescSub: "ஒற்றுமையால் முன்னேற்றம்!",
    joinBtnHero: "Join the Movement",
    goalTitle: "Our Goal",
    goalDesc: "Guidance for equality and fair development.",
    ideology: "Ideology",
    ideologySub: "கொள்கைகள்",
    actionPlan: "Action Plan",
    actionPlanSub: "செயல்திட்டம்",
    resolutions: "Resolutions",
    resolutionsSub: "தீர்மானங்கள்",
    viewMore: "View More",
    joinTitle: "Join the Movement.",
    joinDesc: "Driven by the core vision that everyone deserves everything, OMK works to advance people-centric politics.",
    joinBtnFooter: "Become a Member",
  },
  TA: {
    heroMain: "ஒற்றுமை முன்னேற்றக் கழகம்",
    heroSub: "Unity for Progress.",
    heroDesc: "தமிழ்நாடு மற்றும் அதன் மக்களின் நலனுக்கான மக்கள் மைய அரசியல் இயக்கம்.",
    heroDescSub: "ஒற்றுமையால் முன்னேற்றம்!",
    joinBtnHero: "இயக்கத்தில் இணையுங்கள்",
    goalTitle: "நமது இலக்கு",
    goalDesc: "சமத்துவம் மற்றும் நியாயமான வளர்ச்சிக்கான வழிகாட்டுதல்.",
    ideology: "கொள்கைகள்",
    ideologySub: "Ideology",
    actionPlan: "செயல்திட்டம்",
    actionPlanSub: "Action Plan",
    resolutions: "தீர்மானங்கள்",
    resolutionsSub: "Resolutions",
    viewMore: "மேலும் காண்க",
    joinTitle: "இயக்கத்தில் இணையுங்கள்.",
    joinDesc: "அனைவருக்கும் அனைத்தும் கிடைக்க வேண்டும் என்ற முக்கிய தொலைநோக்கு பார்வையால் இயக்கப்படும் ஓ.எம்.கே, மக்கள் மைய அரசியலை முன்னெடுக்க செயல்படுகிறது.",
    joinBtnFooter: "உறுப்பினர் ஆகுங்கள்",
  }
};

const Home = () => {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <div className="w-full font-sans bg-gray-50 overflow-x-hidden">
      
      {/* SECTION 1: MAP & LEADER HERO */}
      <section className="relative min-h-[85vh] flex items-center bg-gradient-to-br from-[#8B0000] via-[#a30000] to-[#8B0000] overflow-hidden pt-12 md:pt-20">
        {/* Subtle Watermark Pattern */}
        <div 
          className="absolute inset-0 z-0 opacity-10" 
          style={{ 
            backgroundImage: "url('/omk_crowd_bg.png')", 
            backgroundSize: 'cover', 
            backgroundPosition: 'center',
            mixBlendMode: 'screen'
          }}
        ></div>

        {/* Background Map */}
        <div className="absolute inset-0 w-full h-full opacity-30 md:opacity-50 z-0 pointer-events-none overflow-hidden">
          <img 
            src="/tn_map.png" 
            alt="Tamil Nadu Map" 
            className="absolute top-1/2 -translate-y-1/2 right-[-10%] md:right-10 w-[120%] md:w-[60%] lg:w-[50%] h-auto object-contain"
            style={{ filter: 'drop-shadow(0 0 40px rgba(252, 201, 23, 0.8)) drop-shadow(0 0 80px rgba(252, 201, 23, 0.4)) brightness(1.5) sepia(1) hue-rotate(10deg) saturate(3)' }}
          />
        </div>

        <div className="container mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-center h-full relative z-10">
          
          {/* Left Content */}
          <div className="flex-1 text-left pt-10 md:pt-0 pb-16 md:pb-0 relative z-20">
            {/* Logo Fix */}
            <div className="w-24 md:w-32 bg-white rounded-2xl p-2 mb-6 border-2 border-[#fcc917] shadow-[0_0_30px_rgba(252,201,23,0.3)] inline-block">
               <img src="/omk-logo.webp" alt="OMK Logo" className="w-full h-auto object-contain rounded-xl" style={{ display: 'block', maxWidth: '100%' }} />
            </div>

            <h1 className="text-[32px] sm:text-[48px] md:text-[64px] lg:text-[76px] leading-[1.1] font-black text-white mb-4 drop-shadow-lg">
              <span className={`block mb-2 text-[24px] sm:text-[36px] md:text-[48px] text-[#fcc917] ${language === 'EN' ? 'tamil' : ''}`}>
                {t.heroSub}
              </span>
              <span className={language === 'TA' ? 'tamil' : ''}>{t.heroMain}</span>
            </h1>
            
            <p className="text-[16px] sm:text-[20px] md:text-[24px] mb-8 md:mb-10 text-white/90 max-w-[600px] leading-relaxed font-medium">
              <span className={language === 'TA' ? 'tamil' : ''}>{t.heroDesc}</span>
              <span className={`block mt-3 md:mt-4 text-[#fcc917] font-bold text-[20px] sm:text-[28px] ${language === 'EN' ? 'tamil' : ''}`}>
                {t.heroDescSub}
              </span>
            </p>
          </div>

          {/* Right Content (Leader Image) */}
          <div className="flex-1 relative h-full flex justify-end items-end mt-10 md:mt-0 pointer-events-none">
            <img 
              src="/leader.png" 
              alt="Leader" 
              className="w-auto max-w-[100%] h-[60vh] md:h-[75vh] object-contain relative bottom-0 right-0 md:-mr-10 z-20" 
              style={{ filter: 'drop-shadow(0 25px 40px rgba(0, 0, 0, 0.5)) contrast(1.15) brightness(1.05)' }}
            />
          </div>
        </div>
      </section>

      {/* SECTION 2: THE 3 CORE LINKS */}
      <section className="py-16 md:py-24 bg-white relative z-20 -mt-8 rounded-t-[40px] shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
        <div className="container mx-auto px-6 lg:px-12">
          
          <div className="text-center mb-12">
            <h2 className={`text-[#8B0000] text-[32px] md:text-[40px] font-black leading-tight ${language === 'TA' ? 'tamil' : ''}`}>
              {t.goalTitle}
            </h2>
            <p className={`text-gray-500 mt-2 text-lg ${language === 'TA' ? 'tamil' : ''}`}>{t.goalDesc}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            
            {/* Card 1 */}
            <a href="#" className="group block bg-[#FAFAFA] rounded-3xl p-8 border border-gray-200 hover:border-[#8B0000] hover:bg-white hover:shadow-[0_15px_40px_rgba(139,0,0,0.1)] transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 bg-white border border-gray-200 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#8B0000] group-hover:border-[#8B0000] transition-colors duration-300 shadow-sm">
                <Flag size={32} className="text-[#8B0000] group-hover:text-white" strokeWidth={1.5} />
              </div>
              <h3 className={`text-2xl font-black text-gray-900 mb-2 group-hover:text-[#8B0000] transition-colors ${language === 'TA' ? 'tamil' : ''}`}>{t.ideology}</h3>
              <p className={`text-gray-500 font-bold mb-4 uppercase tracking-wider text-sm ${language === 'EN' ? 'tamil' : ''}`}>{t.ideologySub}</p>
              <span className={`text-[#8B0000] font-bold flex items-center gap-1 group-hover:gap-2 transition-all ${language === 'TA' ? 'tamil' : ''}`}>
                {t.viewMore} <ArrowRight size={18} />
              </span>
            </a>

            {/* Card 2 */}
            <a href="#" className="group block bg-[#FAFAFA] rounded-3xl p-8 border border-gray-200 hover:border-[#8B0000] hover:bg-white hover:shadow-[0_15px_40px_rgba(139,0,0,0.1)] transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 bg-white border border-gray-200 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#8B0000] group-hover:border-[#8B0000] transition-colors duration-300 shadow-sm">
                <Target size={32} className="text-[#8B0000] group-hover:text-white" strokeWidth={1.5} />
              </div>
              <h3 className={`text-2xl font-black text-gray-900 mb-2 group-hover:text-[#8B0000] transition-colors ${language === 'TA' ? 'tamil' : ''}`}>{t.actionPlan}</h3>
              <p className={`text-gray-500 font-bold mb-4 uppercase tracking-wider text-sm ${language === 'EN' ? 'tamil' : ''}`}>{t.actionPlanSub}</p>
              <span className={`text-[#8B0000] font-bold flex items-center gap-1 group-hover:gap-2 transition-all ${language === 'TA' ? 'tamil' : ''}`}>
                {t.viewMore} <ArrowRight size={18} />
              </span>
            </a>

            {/* Card 3 */}
            <a href="#" className="group block bg-[#FAFAFA] rounded-3xl p-8 border border-gray-200 hover:border-[#8B0000] hover:bg-white hover:shadow-[0_15px_40px_rgba(139,0,0,0.1)] transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 bg-white border border-gray-200 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#8B0000] group-hover:border-[#8B0000] transition-colors duration-300 shadow-sm">
                <Shield size={32} className="text-[#8B0000] group-hover:text-white" strokeWidth={1.5} />
              </div>
              <h3 className={`text-2xl font-black text-gray-900 mb-2 group-hover:text-[#8B0000] transition-colors ${language === 'TA' ? 'tamil' : ''}`}>{t.resolutions}</h3>
              <p className={`text-gray-500 font-bold mb-4 uppercase tracking-wider text-sm ${language === 'EN' ? 'tamil' : ''}`}>{t.resolutionsSub}</p>
              <span className={`text-[#8B0000] font-bold flex items-center gap-1 group-hover:gap-2 transition-all ${language === 'TA' ? 'tamil' : ''}`}>
                {t.viewMore} <ArrowRight size={18} />
              </span>
            </a>

          </div>
        </div>
      </section>

      {/* SECTION 3: THE JOIN BANNER */}
      <section className="py-24 bg-gray-900 text-white text-center">
        <div className="container mx-auto px-6">
          <div className="w-20 h-20 mx-auto bg-white rounded-full p-2 mb-8 border-4 border-[#fcc917] shadow-xl">
            <img src="/omk-logo.webp" alt="OMK Logo" className="w-full h-full object-contain" />
          </div>
          <h2 className={`text-[32px] md:text-[48px] font-black tracking-tight mb-4 ${language === 'TA' ? 'tamil' : ''}`}>
            {t.joinTitle}
          </h2>
          <p className={`text-xl text-gray-400 max-w-2xl mx-auto mb-10 ${language === 'TA' ? 'tamil' : ''}`}>
            {t.joinDesc}
          </p>
          <Link to="/register" className="inline-flex items-center justify-center gap-2 rounded-full py-4 px-12 font-black text-lg transition-transform hover:scale-105 bg-[#fcc917] text-[#8B0000] shadow-[0_10px_30px_rgba(252,201,23,0.2)]">
            <span className={language === 'TA' ? 'tamil' : ''}>{t.joinBtnFooter}</span> <ArrowRight size={20} />
          </Link>
        </div>
      </section>

    </div>
  );
};

export default Home;
