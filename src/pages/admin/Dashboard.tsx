import React, { useEffect, useState } from 'react';
import { Users, UserCheck, UserX, UserPlus, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { supabase } from '../../services/supabase';

const Dashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0
  });
  const [loading, setLoading] = useState(true);

  const [mostActiveDistrict, setMostActiveDistrict] = useState<string>('N/A');
  const [districtChartData, setDistrictChartData] = useState<{name: string, count: number}[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const { count: totalCount } = await supabase.from('members').select('*', { count: 'exact', head: true });
        const { count: approvedCount } = await supabase.from('members').select('*', { count: 'exact', head: true }).eq('status', 'Approved');
        const { count: pendingCount } = await supabase.from('members').select('*', { count: 'exact', head: true }).eq('status', 'Pending Approval');
        const { count: rejectedCount } = await supabase.from('members').select('*', { count: 'exact', head: true }).eq('status', 'Rejected');
        
        setStats({
          total: totalCount || 0,
          approved: approvedCount || 0,
          pending: pendingCount || 0,
          rejected: rejectedCount || 0
        });

        // Most active district & Chart Data
        const { data: districtData } = await supabase.from('members').select('district');
        if (districtData && districtData.length > 0) {
          const districtCounts = districtData.reduce((acc: any, curr) => {
            acc[curr.district] = (acc[curr.district] || 0) + 1;
            return acc;
          }, {});
          
          // Set Most Active
          const topDistrict = Object.keys(districtCounts).reduce((a, b) => districtCounts[a] > districtCounts[b] ? a : b);
          setMostActiveDistrict(topDistrict);

          // Prepare Chart Data (Top 7 districts)
          const chartData = Object.keys(districtCounts)
            .map(key => ({ name: key, count: districtCounts[key] }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 7);
          
          setDistrictChartData(chartData);
        }

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Overview of OMK Membership statistics</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-500 mb-1">Total Members</p>
            <h3 className="text-3xl font-black text-gray-900">{stats.total}</h3>
          </div>
          <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-500 mb-1">Pending Approval</p>
            <h3 className="text-3xl font-black text-orange-500">{stats.pending}</h3>
          </div>
          <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
            <UserPlus className="w-6 h-6 text-orange-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-500 mb-1">Approved</p>
            <h3 className="text-3xl font-black text-green-500">{stats.approved}</h3>
          </div>
          <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
            <UserCheck className="w-6 h-6 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-500 mb-1">Rejected</p>
            <h3 className="text-3xl font-black text-red-500">{stats.rejected}</h3>
          </div>
          <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
            <UserX className="w-6 h-6 text-red-600" />
          </div>
        </div>
      </div>

      {/* Charts Section Placeholder */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-h-[300px]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800">District Wise Registration (Top 7)</h3>
            <TrendingUp className="w-5 h-5 text-gray-400" />
          </div>
          <div className="h-[300px] w-full mt-4">
            {districtChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={districtChartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: '#6B7280', fontSize: 12 }} 
                    axisLine={false} 
                    tickLine={false} 
                    angle={-45}
                    textAnchor="end"
                  />
                  <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip 
                    cursor={{ fill: '#F3F4F6' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="count" fill="#E4002B" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400 text-sm border-2 border-dashed rounded-lg bg-gray-50">
                No data available yet
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-h-[300px] flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <TrendingUp className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Most Active District</h3>
          <p className="text-4xl font-black text-primary">{mostActiveDistrict}</p>
          <p className="text-gray-500 mt-2">Leading in new member registrations</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
