import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, ArrowLeft, Download, Send, BadgeIcon } from 'lucide-react';
import { supabase } from '../../services/supabase';
import IDCardTemplate from '../../components/admin/IDCardTemplate';

const MemberDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [member, setMember] = useState<any>(null);
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: memberData } = await supabase
          .from('members')
          .select('*')
          .eq('id', id)
          .single();
        if (memberData) setMember(memberData);

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
    if (id) fetchData();
  }, [id]);

  const handleApprove = async () => {
    setActionLoading(true);
    try {
      const newMembershipId = `OMK-${new Date().getFullYear()}-${Math.floor(Math.random() * 900000) + 100000}`;
      
      const { error } = await supabase
        .from('members')
        .update({ 
          status: 'Approved', 
          membership_id: newMembershipId,
          approved_at: new Date().toISOString()
        })
        .eq('id', id);
        
      if (!error) {
        setMember({ ...member, status: 'Approved', membership_id: newMembershipId });

        // Log the action
        const { data: { session } } = await supabase.auth.getSession();
        const adminEmail = session?.user?.email || 'admin@omktamilnadu.org';
        await supabase.from('audit_logs').insert([{
          admin_email: adminEmail,
          action_type: 'MEMBER_APPROVED',
          description: `Approved member application for ${member.full_name}`,
          target_id: id
        }]);

        alert('Approved Successfully');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    setActionLoading(true);
    try {
      const { error } = await supabase
        .from('members')
        .update({ status: 'Rejected' })
        .eq('id', id);
        
      if (!error) {
        setMember({ ...member, status: 'Rejected' });

        // Log the action
        const { data: { session } } = await supabase.auth.getSession();
        const adminEmail = session?.user?.email || 'admin@omktamilnadu.org';
        await supabase.from('audit_logs').insert([{
          admin_email: adminEmail,
          action_type: 'MEMBER_REJECTED',
          description: `Rejected member application for ${member.full_name}`,
          target_id: id
        }]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const sendWhatsApp = () => {
    if (!member) return;
    const msg = `Hello ${member.full_name},\n\nYour OMK Membership has been approved.\nMembership ID: ${member.membership_id}\n\nDownload Card:\nhttps://omktamilnadu.org/member/${member.membership_id}\n\nThank you.`;
    window.open(`https://wa.me/91${member.mobile}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!member) return <div className="p-8 text-center text-red-500">Member not found</div>;

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <div className="mb-6 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 bg-white rounded-lg border shadow-sm hover:bg-gray-50">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-black text-gray-900">Application Details</h1>
          <p className="text-sm text-gray-500">#{member.application_number}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold mb-4 border-b pb-2">Personal Information</h2>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div><span className="text-gray-500 block">Full Name</span><strong className="text-base">{member.full_name}</strong></div>
              <div><span className="text-gray-500 block">Mobile</span><strong>{member.mobile}</strong></div>
              <div><span className="text-gray-500 block">Email</span><strong>{member.email || 'N/A'}</strong></div>
              <div><span className="text-gray-500 block">Date of Birth</span><strong>{new Date(member.dob).toLocaleDateString()}</strong></div>
              <div><span className="text-gray-500 block">Gender</span><strong>{member.gender}</strong></div>
              <div><span className="text-gray-500 block">EPIC Number</span><strong>{member.epic_number}</strong></div>
            </div>
            
            <h2 className="text-lg font-bold mb-4 border-b pb-2 mt-6">Address</h2>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div><span className="text-gray-500 block">District</span><strong>{member.district}</strong></div>
              <div><span className="text-gray-500 block">Constituency</span><strong>{member.constituency}</strong></div>
              <div><span className="text-gray-500 block">Village</span><strong>{member.village}</strong></div>
              <div className="md:col-span-2"><span className="text-gray-500 block">Full Address</span><strong>{member.address}</strong></div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold mb-4 border-b pb-2">Uploaded Documents</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-semibold mb-2">Photo</p>
                <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden border">
                  {member.photo_url ? <img src={member.photo_url} className="w-full h-full object-cover" /> : <span className="flex items-center justify-center h-full text-gray-400">No Image</span>}
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold mb-2">Voter ID (Front)</p>
                <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden border">
                  {member.voter_front_url ? <img src={member.voter_front_url} className="w-full h-full object-cover" /> : <span className="flex items-center justify-center h-full text-gray-400">No Image</span>}
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold mb-2">Voter ID (Back)</p>
                <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden border">
                  {member.voter_back_url ? <img src={member.voter_back_url} className="w-full h-full object-cover" /> : <span className="flex items-center justify-center h-full text-gray-400">No Image</span>}
                </div>
              </div>
            </div>
          </div>

          {member.status === 'Approved' && settings && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 overflow-hidden">
              <h2 className="text-lg font-bold mb-4 border-b pb-2 flex items-center gap-2">
                <BadgeIcon className="w-5 h-5 text-primary" /> Auto-Generated ID Card
              </h2>
              <div className="flex justify-center bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-gray-50 py-8 rounded-lg overflow-x-auto">
                <IDCardTemplate member={member} settings={settings} />
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold mb-4 border-b pb-2">Action Panel</h2>
            <div className="mb-6">
              <p className="text-sm text-gray-500 mb-1">Current Status</p>
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-bold ${
                member.status === 'Approved' ? 'bg-green-100 text-green-800' :
                member.status === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'
              }`}>
                {member.status === 'Approved' && <CheckCircle className="w-4 h-4" />}
                {member.status === 'Rejected' && <XCircle className="w-4 h-4" />}
                {member.status}
              </div>
            </div>

            {member.status === 'Pending Approval' && (
              <div className="flex flex-col gap-3">
                <button onClick={handleApprove} disabled={actionLoading} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 rounded-lg flex items-center justify-center gap-2">
                  <CheckCircle className="w-5 h-5" /> Approve Application
                </button>
                <button onClick={handleReject} disabled={actionLoading} className="w-full bg-white border border-red-200 text-red-600 hover:bg-red-50 font-bold py-2.5 rounded-lg flex items-center justify-center gap-2">
                  <XCircle className="w-5 h-5" /> Reject Application
                </button>
              </div>
            )}

            {member.status === 'Approved' && (
              <div className="flex flex-col gap-3 pt-4 border-t mt-4">
                <p className="text-sm font-bold text-gray-700 mb-1">Membership ID: <span className="text-primary">{member.membership_id}</span></p>
                <button onClick={sendWhatsApp} className="w-full bg-[#25D366] hover:bg-[#1ebd5a] text-white font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 shadow-sm">
                  <Send className="w-4 h-4" /> Send WhatsApp Link
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberDetails;
