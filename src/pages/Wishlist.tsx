import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import { useAuth } from '../hooks/useAuth';
import { Heart, MapPin, Bed, Bath, Maximize, ArrowRight, Home } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const Wishlist = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await api.get('/wishlist');
        setProperties(res.data);
      } catch (err) {
        console.error('Failed to fetch wishlist', err);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchWishlist();
  }, [user]);

  const handleRemove = async (id: string) => {
    try {
      await api.delete(`/wishlist/${id}`);
      setProperties(properties.filter(p => p.id !== id));
    } catch (err) {
      console.error('Failed to remove from wishlist', err);
    }
  };

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center text-slate-400">{t('common.loading')}</div>;

  return (
    <div className="space-y-12 pb-20">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-black text-white tracking-tight flex items-center justify-center gap-4">
          <Heart className="text-emerald-500 fill-current" size={48} />
          {t('propertyDetails.saved')}
        </h1>
        <p className="text-slate-400 text-lg">Your curated collection of dream homes.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {properties.map((property, i) => (
          <motion.div
            key={property.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden hover:border-emerald-500/50 transition-all shadow-xl"
          >
            <div className="relative h-64 overflow-hidden">
              <img 
                src={property.images?.[0]?.url || 'https://picsum.photos/seed/prop/800/600'} 
                alt={property.address}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <button 
                onClick={() => handleRemove(property.id)}
                className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-md p-3 rounded-2xl text-emerald-500 hover:text-red-500 transition-colors"
              >
                <Heart size={20} className="fill-current" />
              </button>
              <div className="absolute bottom-4 left-4">
                <div className="bg-emerald-500 text-white px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">
                  {property.status}
                </div>
              </div>
            </div>

            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-white group-hover:text-emerald-400 transition-colors line-clamp-1">
                  {property.address}
                </h3>
                <p className="text-slate-400 flex items-center gap-2 text-sm font-bold">
                  <MapPin size={16} className="text-emerald-500" /> {property.city}
                </p>
              </div>

              <div className="flex justify-between items-center py-4 border-y border-slate-800">
                <div className="flex items-center gap-1 text-slate-300">
                  <Bed size={16} className="text-emerald-500" />
                  <span className="font-bold">{property.bedrooms}</span>
                </div>
                <div className="flex items-center gap-1 text-slate-300">
                  <Bath size={16} className="text-emerald-500" />
                  <span className="font-bold">{property.bathrooms}</span>
                </div>
                <div className="flex items-center gap-1 text-slate-300">
                  <Maximize size={16} className="text-emerald-500" />
                  <span className="font-bold">{property.sqft}</span>
                  <span className="text-[10px] font-black uppercase">m²</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{t('common.price')}</p>
                  <p className="text-2xl font-black text-emerald-500">
                    {t('common.etb')} {property.price.toLocaleString()}
                  </p>
                </div>
                <Link 
                  to={`/properties/${property.id}`}
                  className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center text-white group-hover:bg-emerald-500 group-hover:text-white transition-all"
                >
                  <ArrowRight size={20} />
                </Link>
              </div>
            </div>
          </motion.div>
        ))}

        {properties.length === 0 && (
          <div className="col-span-full py-20 text-center space-y-6 bg-slate-900/50 border border-slate-800 border-dashed rounded-[3rem]">
            <div className="w-20 h-20 bg-slate-800 rounded-[2rem] flex items-center justify-center mx-auto text-slate-600">
              <Home size={40} />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-white">Your wishlist is empty</h3>
              <p className="text-slate-400">Start exploring properties and save the ones you love!</p>
            </div>
            <Link to="/properties" className="btn-primary inline-flex py-4 px-8 rounded-2xl">
              Browse Properties
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
