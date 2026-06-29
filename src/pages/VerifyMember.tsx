import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '../services/supabase';
import IDCardTemplate from '../components/admin/IDCardTemplate';

const VerifyMember = () => {
  const { membershipId } = useParams();
  const [member, setMember] = useState<any>(null);
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: memberData, error } = await supabase
          .rpc('get_member_by_id', { p_id: membershipId })
          .single();
        
        if (!error && memberData) {
          setMember(memberData);
        }

        const { data: settingsData } = await supabase
          .from('settings')
          .select('*')
          .eq('id', 1)
          .single();
        if (settingsData) setSettings(settingsData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (membershipId) {
      fetchData();
    }
  }, [membershipId]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-primary rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 font-semibold">Verifying Membership...</p>
      </div>
    );
  }

  if (!member || member.status !== 'Approved') {
    return (
      <div className="container mx-auto px-4 py-20 min-h-[60vh] flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-custom border border-omk-line p-10 text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-10 h-10 text-red-600" />
          </div>
          <h1 className="text-2xl font-black text-gray-900 mb-2">Invalid Membership ID</h1>
          <p className="text-gray-600 mb-8">The membership ID <strong>{membershipId}</strong> could not be found or is not yet approved.</p>
          <Link to="/" className="inline-block bg-primary text-white font-bold py-3 px-8 rounded-xl shadow-md transition-colors">
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 min-h-[70vh]">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-custom border border-omk-line overflow-hidden">
        <div className="bg-green-50 p-6 text-center border-b border-green-100 flex flex-col items-center">
          <CheckCircle className="w-12 h-12 text-green-600 mb-2" />
          <h1 className="text-xl font-bold text-green-800">Verified OMK Member</h1>
          <p className="text-green-700 mt-2">Your ID Card is ready to download!</p>
        </div>
        
        <div className="p-8 flex flex-col items-center text-center">
          {settings ? (
            <div className="w-full flex justify-center bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-gray-50 py-8 rounded-xl border border-gray-200 overflow-x-auto mb-8">
               <IDCardTemplate member={member} settings={settings} />
            </div>
          ) : (
            <div className="py-20 text-gray-400">Loading Card...</div>
          )}
          
          <div className="w-full max-w-2xl grid grid-cols-2 md:grid-cols-4 gap-4 text-left border-t border-gray-100 pt-8 mt-4">
            <div>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Name</p>
              <p className="font-semibold text-gray-900">{member.full_name}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">District</p>
              <p className="font-semibold text-gray-900">{member.district}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Constituency</p>
              <p className="font-semibold text-gray-900">{member.constituency}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Issue Date</p>
              <p className="font-semibold text-gray-900">
                {new Date(member.approved_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyMember;
