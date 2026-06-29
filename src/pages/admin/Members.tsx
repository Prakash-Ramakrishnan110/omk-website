import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Eye, Edit, Trash2, CheckCircle } from 'lucide-react';
import { supabase } from '../../services/supabase';
import locationData from '../../data/tnLocations.json';
import villageData from '../../data/tnVillages.json';

const districts = Object.keys(locationData);

const Members = () => {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterDistrict, setFilterDistrict] = useState('');
  const [filterTaluk, setFilterTaluk] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const taluks = filterDistrict 
    ? Object.keys((villageData as Record<string, Record<string, string[]>>)[filterDistrict] || {}) 
    : [];

  useEffect(() => {
    const fetchMembers = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('members')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(50);
          
        if (data) {
          setMembers(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMembers();
  }, []);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-orange-100 text-orange-800';
    }
  };

  const handleQuickApprove = async (id: string, name: string) => {
    if (!window.confirm("Approve this member?")) return;
    try {
      const { error } = await supabase
        .from('members')
        .update({ status: 'Approved', approved_at: new Date().toISOString() })
        .eq('id', id);
      if (error) throw error;
      setMembers(members.map(m => m.id === id ? { ...m, status: 'Approved', approved_at: new Date().toISOString() } : m));

      // Log the action
      const { data: { session } } = await supabase.auth.getSession();
      const adminEmail = session?.user?.email || 'admin@omktamilnadu.org';
      await supabase.from('audit_logs').insert([{
        admin_email: adminEmail,
        action_type: 'MEMBER_APPROVED',
        description: `Approved member application for ${name}`,
        target_id: id
      }]);
    } catch (err) {
      console.error(err);
      alert("Failed to approve member");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm("Are you sure you want to delete this member? This action cannot be undone.")) return;
    try {
      const { error } = await supabase
        .from('members')
        .delete()
        .eq('id', id);
      if (error) throw error;
      setMembers(members.filter(m => m.id !== id));

      // Log the action
      const { data: { session } } = await supabase.auth.getSession();
      const adminEmail = session?.user?.email || 'admin@omktamilnadu.org';
      await supabase.from('audit_logs').insert([{
        admin_email: adminEmail,
        action_type: 'MEMBER_DELETED',
        description: `Deleted member: ${name}`,
        target_id: id
      }]);
    } catch (err) {
      console.error(err);
      alert("Failed to delete member");
    }
  };

  const filteredMembers = members.filter(m => {
    const matchesSearch = m.full_name?.toLowerCase().includes(search.toLowerCase()) || 
                          m.mobile?.includes(search) || 
                          m.epic_number?.toLowerCase().includes(search.toLowerCase());
    const matchesDistrict = filterDistrict ? m.district === filterDistrict : true;
    const matchesTaluk = filterTaluk ? m.taluk === filterTaluk : true;
    const matchesStatus = filterStatus ? m.status === filterStatus : true;
    return matchesSearch && matchesDistrict && matchesTaluk && matchesStatus;
  });

  const exportToCSV = () => {
    const headers = ['Application Number', 'Name', 'Mobile', 'EPIC Number', 'District', 'Constituency', 'Taluk', 'Village', 'Status', 'Date'];
    const csvContent = [
      headers.join(','),
      ...filteredMembers.map(m => [
        m.application_number,
        `"${m.full_name}"`,
        m.mobile,
        m.epic_number,
        `"${m.district}"`,
        `"${m.constituency}"`,
        `"${m.taluk}"`,
        `"${m.village}"`,
        m.status,
        new Date(m.created_at).toLocaleDateString()
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `omk_members_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Member Applications</h1>
          <p className="text-gray-500">Manage all membership requests</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto flex-wrap">
          <button onClick={exportToCSV} className="bg-primary text-white p-2.5 rounded-lg flex items-center justify-center hover:bg-primary-dark text-sm font-semibold">
            Export CSV
          </button>
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search Name, EPIC, Mobile..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 p-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none text-sm"
            />
          </div>
          
          <select 
            value={filterDistrict} 
            onChange={(e) => { setFilterDistrict(e.target.value); setFilterTaluk(''); }}
            className="p-2.5 bg-white border border-gray-200 rounded-lg outline-none text-sm"
          >
            <option value="">All Districts</option>
            {districts.map(d => <option key={d} value={d}>{d}</option>)}
          </select>

          <select 
            value={filterTaluk} 
            onChange={(e) => setFilterTaluk(e.target.value)}
            disabled={!filterDistrict}
            className="p-2.5 bg-white border border-gray-200 rounded-lg outline-none text-sm disabled:opacity-50"
          >
            <option value="">All Taluks</option>
            {taluks.map(t => <option key={t} value={t}>{t}</option>)}
          </select>

          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
            className="p-2.5 bg-white border border-gray-200 rounded-lg outline-none text-sm"
          >
            <option value="">All Statuses</option>
            <option value="Pending Approval">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 font-semibold">
              <tr>
                <th className="p-4 w-12">Photo</th>
                <th className="p-4">Name & EPIC</th>
                <th className="p-4">Mobile</th>
                <th className="p-4">District</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-400">Loading members...</td>
                </tr>
              ) : filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-400">No members found.</td>
                </tr>
              ) : (
                filteredMembers.map(member => (
                  <tr key={member.id} className="hover:bg-gray-50/50">
                    <td className="p-4">
                      <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                        {member.photo_url ? (
                          <img src={member.photo_url} alt="Photo" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No Pic</div>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-gray-900">{member.full_name}</div>
                      <div className="text-xs text-gray-500">{member.epic_number}</div>
                    </td>
                    <td className="p-4 text-gray-600">{member.mobile}</td>
                    <td className="p-4">
                      <div className="text-gray-900">{member.district}</div>
                      <div className="text-xs text-gray-500">{member.constituency}</div>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(member.status)}`}>
                        {member.status}
                      </span>
                    </td>
                    <td className="p-4 text-gray-500 text-xs">
                      {new Date(member.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right flex items-center justify-end gap-2">
                      {member.status === 'Pending Approval' && (
                        <button onClick={() => handleQuickApprove(member.id, member.full_name)} title="Quick Approve" className="p-1.5 text-green-600 hover:bg-green-50 rounded">
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                      <Link to={`/admin/members/${member.id}`} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded">
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button onClick={() => handleDelete(member.id, member.full_name)} className="p-1.5 text-red-600 hover:bg-red-50 rounded">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Members;
