import React, { useState, useEffect } from 'react';
import { Search, BadgeIcon } from 'lucide-react';
import { supabase } from '../../services/supabase';
import IDCardTemplate from '../../components/admin/IDCardTemplate';

const IDCards = () => {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedMember, setSelectedMember] = useState<any | null>(null);
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch settings
        const { data: settingsData } = await supabase.from('settings').select('*').eq('id', 1).single();
        if (settingsData) setSettings(settingsData);
        // Fetch members
        const { data, error } = await supabase
          .from('members')
          .select('*')
          .eq('status', 'Approved')
          .order('full_name', { ascending: true });
          
        if (data) {
          setMembers(data);
          if (data.length > 0) {
            setSelectedMember(data[0]); // Auto-select first member
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const filteredMembers = members.filter(m => 
    m.full_name?.toLowerCase().includes(search.toLowerCase()) || 
    m.mobile?.includes(search) || 
    m.application_number?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
          <BadgeIcon className="w-6 h-6 text-primary" />
          ID Card Generator
        </h1>
        <p className="text-gray-500">Generate and download official ID cards for approved members</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column: Member List */}
        <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-[700px]">
          <div className="p-4 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search Name or ID..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none text-sm"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center text-gray-400 text-sm">Loading approved members...</div>
            ) : filteredMembers.length === 0 ? (
              <div className="p-8 text-center text-gray-400 text-sm">No approved members found.</div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {filteredMembers.map(member => (
                  <li key={member.id}>
                    <button
                      onClick={() => setSelectedMember(member)}
                      className={`w-full text-left p-4 hover:bg-gray-50 transition-colors flex items-center gap-3 ${
                        selectedMember?.id === member.id ? 'bg-primary/5 border-l-4 border-primary' : 'border-l-4 border-transparent'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden shrink-0">
                        {member.photo_url ? (
                          <img src={member.photo_url} alt="Photo" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No Pic</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">{member.full_name}</p>
                        <p className="text-xs text-gray-500 truncate">{member.application_number}</p>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Right Column: Card Preview */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-8 flex flex-col items-center justify-center min-h-[700px] overflow-x-auto bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-gray-50">
          {selectedMember && settings ? (
            <IDCardTemplate member={selectedMember} settings={settings} />
          ) : (
            <div className="text-center text-gray-400">
              <BadgeIcon className="w-16 h-16 mx-auto mb-4 opacity-20" />
              <p>Select a member from the list to preview their ID card.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IDCards;
