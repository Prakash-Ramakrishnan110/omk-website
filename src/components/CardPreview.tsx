import React from 'react';
import QRCode from 'react-qr-code';

interface CardPreviewProps {
  member: any;
  cardRef?: React.RefObject<HTMLDivElement>;
}

const CardPreview: React.FC<CardPreviewProps> = ({ member, cardRef }) => {
  if (!member) return null;

  return (
    <div 
      ref={cardRef} 
      className="relative w-[600px] h-[375px] bg-white rounded-xl overflow-hidden shadow-2xl flex flex-col font-sans"
      style={{
        backgroundImage: "linear-gradient(135deg, #ffffff 0%, #fff4f4 100%)",
        border: '1px solid #eadada'
      }}
    >
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-primary to-primary-dark text-white p-4 flex items-center gap-4">
        <div className="w-14 h-14 bg-white rounded-full p-1 overflow-hidden shrink-0">
          <img src="/omk-logo.webp" alt="OMK Logo" className="w-full h-full object-cover rounded-full" />
        </div>
        <div>
          <h2 className="text-xl font-black m-0 leading-tight tracking-tight">ஒற்றுமை முன்னேற்றக் கழகம்</h2>
          <h3 className="text-sm font-bold tracking-widest uppercase opacity-90 mt-0.5">Ottrumai Munnetra Kazhagam</h3>
        </div>
      </div>

      <div className="flex-grow p-5 flex gap-6">
        {/* Photo Section */}
        <div className="w-[120px] shrink-0 flex flex-col items-center">
          <div className="w-[120px] h-[150px] bg-gray-200 border-[3px] border-primary-light shadow-md mb-2 overflow-hidden rounded">
            {member.photo_url ? (
              <img src={member.photo_url} alt="Member" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">Photo</div>
            )}
          </div>
          <div className="bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full w-full text-center">
            MEMBER
          </div>
        </div>

        {/* Details Section */}
        <div className="flex-grow flex flex-col justify-between">
          <div className="space-y-3">
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-0.5">Name</p>
              <p className="font-black text-xl text-gray-900 leading-none">{member.full_name}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-0.5">Membership ID</p>
                <p className="font-bold text-primary">{member.membership_id}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-0.5">District</p>
                <p className="font-bold text-gray-800">{member.district}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-0.5">Constituency</p>
                <p className="font-bold text-gray-800">{member.constituency}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-0.5">Blood Group</p>
                <p className="font-bold text-gray-800">{member.blood_group || 'O+ve'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* QR Section */}
        <div className="w-[100px] shrink-0 flex flex-col items-center justify-between py-1">
          <div className="p-1.5 bg-white border border-gray-200 rounded-lg shadow-sm">
            <QRCode 
              value={`https://omktamilnadu.org/member/${member.membership_id}`}
              size={85}
              level="H"
            />
          </div>
          
          <div className="text-center w-full mt-4">
            <div className="h-8 border-b border-gray-400 mb-1">
              {/* Signature Image would go here */}
            </div>
            <p className="text-[8px] font-bold text-gray-600 uppercase">President Signature</p>
          </div>
        </div>
      </div>

      {/* Footer Banner */}
      <div className="bg-primary-dark text-white py-1.5 px-4 flex justify-between items-center text-[10px] font-bold">
        <span>https://omktamilnadu.org</span>
        <span>Valid for lifetime | Report lost card immediately</span>
      </div>
    </div>
  );
};

export default CardPreview;
