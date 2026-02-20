import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import { MapPin, Bed, Bath, Maximize, Search, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

const PropertyList = () => {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await api.get('/properties');
        setProperties(res.data);
      } catch (err) {
        console.error('Failed to fetch properties', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  const filteredProperties = properties.filter(p => 
    p.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center text-slate-400">Loading properties...</div>;

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight">Explore Properties</h1>
          <p className="text-slate-400 mt-2">Find the perfect home in Addis Ababa</p>
        </div>
        
        <div className="flex w-full md:w-auto gap-4">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
            <input 
              type="text" 
              placeholder="Search by location..."
              className="input-field pl-12"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="bg-slate-800 p-3 rounded-xl text-slate-400 hover:text-white transition-colors">
            <Filter size={24} />
          </button>
        </div>
      </div>

      {filteredProperties.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/50 rounded-[3rem] border border-slate-800">
          <p className="text-slate-500 text-lg">No properties found matching your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProperties.map((p, i) => (
            <motion.div 
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden hover:border-emerald-500/50 transition-all hover:shadow-2xl hover:shadow-emerald-500/10"
            >
              <Link to={`/properties/${p.id}`}>
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={p.images?.[0]?.url || 'https://picsum.photos/seed/property/800/600'} 
                    alt={p.address}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-emerald-600 text-white px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">
                    Available
                  </div>
                  <div className="absolute bottom-4 right-4 bg-slate-900/80 backdrop-blur-md text-white px-4 py-2 rounded-xl font-bold">
                    ETB {p.price.toLocaleString()} <span className="text-slate-400 text-xs font-normal">/mo</span>
                  </div>
                </div>
                
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-white truncate">{p.address}</h3>
                    <p className="text-slate-500 flex items-center gap-1 text-sm mt-1">
                      <MapPin size={14} /> {p.city}
                    </p>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-slate-800">
                    <div className="flex items-center gap-4 text-slate-400 text-sm">
                      <span className="flex items-center gap-1"><Bed size={16} /> {p.bedrooms}</span>
                      <span className="flex items-center gap-1"><Bath size={16} /> {p.bathrooms}</span>
                      <span className="flex items-center gap-1"><Maximize size={16} /> {p.sqft}m²</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PropertyList;
