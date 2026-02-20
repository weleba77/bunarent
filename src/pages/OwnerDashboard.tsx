import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import { useAuth } from '../hooks/useAuth';
import { LayoutDashboard, Plus, Home, Users, TrendingUp, MoreVertical, Trash2, Edit3, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

const OwnerDashboard = () => {
  const { user } = useAuth();
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyProperties = async () => {
      try {
        const res = await api.get('/properties');
        // Filter properties owned by this user
        setProperties(res.data.filter((p: any) => p.ownerId === user?.id));
      } catch (err) {
        console.error('Failed to fetch my properties', err);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchMyProperties();
  }, [user]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        // In a real app, we'd have a DELETE endpoint
        // await api.delete(`/properties/${id}`);
        setProperties(properties.filter(p => p.id !== id));
        alert('Property removed successfully (Demo)');
      } catch (err) {
        alert('Failed to delete property');
      }
    }
  };

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center text-slate-400">Loading dashboard...</div>;

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <h1 className="text-5xl font-black text-white tracking-tight">Owner Dashboard</h1>
          <p className="text-slate-400 mt-2 text-lg">Welcome back, {user?.fullName}. Here's your portfolio overview.</p>
        </div>
        <Link to="/add-property" className="btn-primary py-4 px-8 flex items-center gap-2 text-lg">
          <Plus size={24} /> List New Property
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { icon: <Home className="text-emerald-500" />, label: 'Total Properties', value: properties.length, trend: '+1 this month' },
          { icon: <Users className="text-blue-500" />, label: 'Active Tenants', value: '0', trend: 'Waiting for launch' },
          { icon: <TrendingUp className="text-purple-500" />, label: 'Monthly Revenue', value: `ETB ${properties.reduce((acc, p) => acc + p.price, 0).toLocaleString()}`, trend: 'Potential' }
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] space-y-4"
          >
            <div className="flex justify-between items-start">
              <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center">
                {stat.icon}
              </div>
              <span className="text-emerald-500 text-xs font-black uppercase tracking-widest">{stat.trend}</span>
            </div>
            <div>
              <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">{stat.label}</p>
              <p className="text-4xl font-black text-white mt-1">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Properties Table/List */}
      <div className="bg-slate-900 border border-slate-800 rounded-[3rem] overflow-hidden shadow-2xl">
        <div className="p-8 border-b border-slate-800 flex justify-between items-center">
          <h2 className="text-2xl font-black text-white">My Listings</h2>
          <button className="text-slate-400 hover:text-white transition-colors">
            <MoreVertical size={24} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-500 text-xs font-black uppercase tracking-widest border-b border-slate-800">
                <th className="px-8 py-6">Property</th>
                <th className="px-8 py-6">Status</th>
                <th className="px-8 py-6">Price</th>
                <th className="px-8 py-6">Views</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {properties.map((p) => (
                <tr key={p.id} className="hover:bg-slate-800/30 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <img src={p.images?.[0]?.url || 'https://picsum.photos/seed/p/100/100'} className="w-12 h-12 rounded-xl object-cover" />
                      <div>
                        <p className="text-white font-bold">{p.address}</p>
                        <p className="text-slate-500 text-xs flex items-center gap-1"><MapPin size={12} /> {p.city}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
                      Active
                    </span>
                  </td>
                  <td className="px-8 py-6 text-white font-bold">ETB {p.price.toLocaleString()}</td>
                  <td className="px-8 py-6 text-slate-400">0</td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-slate-400 hover:text-blue-500 transition-colors">
                        <Edit3 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(p.id)}
                        className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {properties.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-slate-500">
                    <div className="flex flex-col items-center gap-4">
                      <Home size={48} className="opacity-20" />
                      <p className="text-lg">You haven't listed any properties yet.</p>
                      <Link to="/add-property" className="text-emerald-500 font-bold hover:underline">Start listing now</Link>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
