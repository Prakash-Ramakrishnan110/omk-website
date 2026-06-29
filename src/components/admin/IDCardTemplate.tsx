import React, { useRef, useState, useEffect } from 'react';
import * as htmlToImage from 'html-to-image';
import { Download, MapPin, Globe, Mail } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import { locationToTamilMap } from '../../utils/tamilTranslations';

interface IDCardTemplateProps {
  member: any;
  settings: any;
}

const getTamilStr = (val: string, type: 'district' | 'constituency') => {
  if (!val) return '';
  return locationToTamilMap[val] || val;
};

const getBase64Image = async (url: string): Promise<string> => {
  try {
    const response = await fetch(url, { mode: 'cors' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error fetching image for base64 conversion:', error);
    // Fallback to a transparent 1x1 pixel so we don't taint the canvas!
    return "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
  }
};

const IDCardTemplate: React.FC<IDCardTemplateProps> = ({ member, settings }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [base64Photo, setBase64Photo] = useState<string | null>(null);

  useEffect(() => {
    const loadPhoto = async () => {
      if (member?.photo_url) {
        const url = member.photo_url.includes('?') 
          ? `${member.photo_url}&t=${new Date().getTime()}` 
          : `${member.photo_url}?t=${new Date().getTime()}`;
        const b64 = await getBase64Image(url);
        setBase64Photo(b64);
      }
    };
    loadPhoto();
  }, [member?.photo_url]);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    
    setTimeout(async () => {
      try {
        const dataUrl = await htmlToImage.toPng(cardRef.current as HTMLDivElement, {
          pixelRatio: 3,
          style: {
            transform: 'scale(1)',
            transformOrigin: 'top left'
          }
        });
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `OMK_ID_${member.application_number}.png`;
        link.click();
      } catch (err: any) {
        console.error("Error generating ID card image:", err);
        alert(`Download Error: ${err.message || err.toString()}`);
      }
    }, 200);
  };

  const verifyUrl = `https://omktamilnadu.org/member/${member.membership_id}`;

  return (
    <div className="flex flex-col items-center w-full">
      <style>{`
        .tamil { font-family: 'Noto Sans Tamil', sans-serif; }
      `}</style>
      
      <div className="flex justify-center w-full overflow-hidden pb-4" style={{ zoom: 0.85, fontFamily: "'Inter', 'Noto Sans Tamil', sans-serif" }}>
        <div ref={cardRef} className="w-[800px] h-[450px] bg-[#fcc917] rounded-xl border-[6px] border-white shadow-[0_10px_40px_rgba(0,0,0,0.2)] relative overflow-hidden box-border">
          
          <div className="absolute inset-0 z-0 opacity-[0.08]" style={{ backgroundImage: "url('/omk_crowd_bg.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
          
          <img src="/tn_map.png" alt="TN Map" crossOrigin="anonymous" className="absolute bottom-0 right-1 w-auto h-[380px] object-contain opacity-100 z-[1]" />
          <img src="/leader.png" alt="Leader" crossOrigin="anonymous" className="absolute bottom-0 right-4 w-auto h-[400px] object-contain drop-shadow-[0_10px_15px_rgba(0,0,0,0.3)] z-[5] pointer-events-none" />
          
          <div className="absolute bottom-[50px] right-[320px] flex flex-col items-center z-[10]">
            <span className="font-bold italic text-[24px] text-[#8B0000] -rotate-[5deg] -mb-1 tamil">ஒ.மு.க</span>
            <span className="text-[12px] font-bold text-[#8B0000] tamil">தலைவர்</span>
          </div>

          <div className="absolute top-0 left-0 w-[65%] h-[410px] flex flex-col z-[10] pl-6 pt-4 pb-3">
            
            <div className="flex items-start gap-4 shrink-0">
              <div className="w-[80px] h-[80px] rounded-full bg-white border-[3px] border-[#8B0000] shadow-md flex items-center justify-center p-1 shrink-0 overflow-hidden">
                <img src="/omk-logo.webp" alt="OMK Logo" crossOrigin="anonymous" className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col items-center pt-1 flex-1 pr-6">
                <h1 className="text-[24px] font-black text-[#8B0000] leading-tight text-center drop-shadow-[1px_1px_0_rgba(255,255,255,0.4)] whitespace-nowrap tamil">ஒற்றுமை முன்னேற்றக் கழகம்</h1>
                <p className="text-[15px] font-bold text-[#8B0000] mb-2 tamil">ஒற்றுமையால் முன்னேற்றம்!</p>
                <span className="bg-[#8B0000] text-white text-[13px] font-bold px-6 py-1 rounded-full shadow-md tamil">உறுப்பினர் அட்டை</span>
              </div>
            </div>

            <div className="mt-2 pl-4 shrink-0">
              <table className="w-full text-[#8B0000] text-[14px] leading-snug border-separate [border-spacing:0_5px]">
                <tbody>
                  <tr><td className="w-[130px] font-bold tamil">பெயர்</td><td className="w-[20px] font-black text-center">:</td><td className="font-bold text-gray-900 tamil">{member.full_name}</td></tr>
                  {member.application_number && <tr><td className="font-bold tamil whitespace-nowrap">விண்ணப்ப எண்</td><td className="font-black text-center">:</td><td className="font-bold text-gray-900">{member.application_number}</td></tr>}
                  {member.membership_id && <tr><td className="font-bold tamil whitespace-nowrap">உறுப்பினர் எண்</td><td className="font-black text-center">:</td><td className="font-bold text-gray-900">{member.membership_id}</td></tr>}
                  <tr><td className="font-bold tamil">சட்டமன்றம்</td><td className="font-black text-center">:</td><td className="font-bold text-gray-900 tamil">{getTamilStr(member.constituency, 'constituency')}</td></tr>
                  <tr><td className="font-bold tamil">மாவட்டம்</td><td className="font-black text-center">:</td><td className="font-bold text-gray-900 tamil">{getTamilStr(member.district, 'district')}</td></tr>
                  <tr><td className="font-bold tamil">மாநிலம்</td><td className="font-black text-center">:</td><td className="font-bold text-gray-900 tamil">தமிழ்நாடு</td></tr>
                  {member.mobile && <tr><td className="font-bold tamil">செல்</td><td className="font-black text-center">:</td><td className="font-bold text-gray-900">{member.mobile}</td></tr>}
                </tbody>
              </table>
            </div>

            <div className="flex gap-4 items-end pl-4 mt-auto mb-1">
              <div className="w-[85px] h-[105px] rounded bg-white border-[3px] border-white shadow-[0_4px_10px_rgba(0,0,0,0.15)] overflow-hidden shrink-0 relative">
                {base64Photo ? (
                  <img src={base64Photo} alt="Member Photo" crossOrigin="anonymous" className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-200 animate-pulse"></div>
                )}
              </div>
              <div className="w-[85px] h-[105px] rounded bg-white border-[3px] border-white shadow-[0_4px_10px_rgba(0,0,0,0.15)] flex flex-col items-center justify-center shrink-0">
                <QRCodeCanvas value={verifyUrl} size={60} marginSize={0} fgColor="#8B0000" />
                <div className="text-[#8B0000] text-[9.5px] font-black mt-1 text-center leading-[1.1] tracking-tight w-full px-0.5 tamil">
                  ஒ.மு.க எண்<br/><span className="text-[10px] mt-[1px] block truncate w-full">{member.membership_id ? member.membership_id.replace('OMK-APP-', '').replace('OMK-', '') : member.application_number?.replace('APP-', '') || ''}</span>
                </div>
              </div>
            </div>

          </div>

          <div className="absolute bottom-0 left-0 w-full h-[40px] bg-[#8B0000] flex items-center justify-center text-white text-[12px] z-[20]">
            <div className="flex items-center tamil gap-3">
              <div className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" />
                <span>{settings?.website ? settings.website.replace(/^https?:\/\//, '').replace(/\/$/, '') : 'omktamilnadu.org'}</span>
              </div>
              <div className="w-[1px] h-[12px] bg-white/40"></div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                <span className="truncate max-w-[500px]">{settings?.address || '25/4, இராயக்கோட்டை, தேன்கனிக்கோட்டை, கிருஷ்ணகிரி, தமிழ்நாடு - 635116'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button 
        onClick={handleDownload}
        disabled={!base64Photo}
        className="mt-4 bg-[#8B0000] text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:bg-red-950 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Download className="w-5 h-5" />
        {base64Photo ? 'உறுப்பினர் அட்டையை பதிவிறக்கம் செய்' : 'Loading Photo...'}
      </button>
    </div>
  );
};

export default IDCardTemplate;
