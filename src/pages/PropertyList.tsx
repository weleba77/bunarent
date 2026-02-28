import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import { Bed, Bath, Maximize, Search, Filter, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const PropertyList = () => {
  const { t } = useTranslation();
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    bathrooms: '',
    propertyType: '',
    amenities: [] as string[]
  });

  const allAmenities = ['WiFi', 'Parking', 'Security', 'Water Tank', 'Generator', 'Gym', 'Pool', 'Balcony'];
  const propertyTypes = ['Apartment', 'House', 'Studio', 'Villa'];

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

  const filteredProperties = properties.filter(p => {
    const matchesSearch = p.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesMinPrice = !filters.minPrice || p.price >= parseFloat(filters.minPrice);
    const matchesMaxPrice = !filters.maxPrice || p.price <= parseFloat(filters.maxPrice);
    const matchesBedrooms = !filters.bedrooms || p.bedrooms >= parseInt(filters.bedrooms);
    const matchesBathrooms = !filters.bathrooms || p.bathrooms >= parseInt(filters.bathrooms);
    const matchesType = !filters.propertyType || p.propertyType === filters.propertyType;
    
    const propertyAmenities = p.amenities.split(',').map((a: string) => a.trim().toLowerCase());
    const matchesAmenities = filters.amenities.length === 0 || 
      filters.amenities.every(a => propertyAmenities.includes(a.toLowerCase()));

    return matchesSearch && matchesMinPrice && matchesMaxPrice && matchesBedrooms && matchesBathrooms && matchesType && matchesAmenities;
  });

  const toggleAmenity = (amenity: string) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const resetFilters = () => {
    setFilters({
      minPrice: '',
      maxPrice: '',
      bedrooms: '',
      bathrooms: '',
      propertyType: '',
      amenities: []
    });
    setSearchTerm('');
  };

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center text-slate-400">{t('common.loading')}</div>;

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight">{t('propertyList.title')}</h1>
          <p className="text-slate-400 mt-2">{t('propertyList.subtitle')}</p>
        </div>
        
        <div className="flex w-full md:w-auto gap-4">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
            <input 
              type="text" 
              placeholder={t('propertyList.searchPlaceholder')}
              className="input-field pl-12"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`p-3 rounded-xl transition-all flex items-center gap-2 font-bold ${
              showFilters || Object.values(filters).some(v => v !== '' && (Array.isArray(v) ? v.length > 0 : true)) 
                ? 'bg-emerald-500 text-white' 
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Filter size={24} />
            <span className="hidden md:block">{t('common.filters')}</span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 space-y-8 shadow-xl">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-black text-white">{t('propertyList.advancedFilters')}</h2>
                <button 
                  onClick={resetFilters}
                  className="text-slate-500 hover:text-white text-sm font-bold flex items-center gap-1"
                >
                  <X size={14} /> {t('propertyList.resetAll')}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {/* Price Range */}
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest">{t('propertyList.priceRange')}</label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="number" placeholder="Min" className="input-field py-2 text-sm"
                      value={filters.minPrice} onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
                    />
                    <span className="text-slate-700">-</span>
                    <input 
                      type="number" placeholder="Max" className="input-field py-2 text-sm"
                      value={filters.maxPrice} onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                    />
                  </div>
                </div>

                {/* Specs */}
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest">{t('propertyList.specifications')}</label>
                  <div className="flex items-center gap-2">
                    <select 
                      className="input-field py-2 text-sm"
                      value={filters.bedrooms} onChange={(e) => setFilters({...filters, bedrooms: e.target.value})}
                    >
                      <option value="">{t('propertyList.anyBeds')}</option>
                      <option value="1">1+ Beds</option>
                      <option value="2">2+ Beds</option>
                      <option value="3">3+ Beds</option>
                      <option value="4">4+ Beds</option>
                    </select>
                    <select 
                      className="input-field py-2 text-sm"
                      value={filters.bathrooms} onChange={(e) => setFilters({...filters, bathrooms: e.target.value})}
                    >
                      <option value="">{t('propertyList.anyBaths')}</option>
                      <option value="1">1+ Baths</option>
                      <option value="2">2+ Baths</option>
                      <option value="3">3+ Baths</option>
                    </select>
                  </div>
                </div>

                {/* Property Type */}
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest">{t('common.type')}</label>
                  <select 
                    className="input-field py-2 text-sm"
                    value={filters.propertyType} onChange={(e) => setFilters({...filters, propertyType: e.target.value})}
                  >
                    <option value="">{t('propertyList.allTypes')}</option>
                    {propertyTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                {/* Amenities Summary */}
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest">{t('common.amenities')}</label>
                  <div className="flex flex-wrap gap-2">
                    {filters.amenities.length === 0 ? (
                      <span className="text-slate-600 text-sm italic">No amenities selected</span>
                    ) : (
                      filters.amenities.map(a => (
                        <span key={a} className="bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1">
                          {a} <X size={10} className="cursor-pointer" onClick={() => toggleAmenity(a)} />
                        </span>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Amenities Grid */}
              <div className="pt-6 border-t border-slate-800">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
                  {allAmenities.map(amenity => (
                    <button
                      key={amenity}
                      onClick={() => toggleAmenity(amenity)}
                      className={`flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                        filters.amenities.includes(amenity)
                          ? 'bg-emerald-500 border-emerald-400 text-white shadow-lg shadow-emerald-500/20'
                          : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                      }`}
                    >
                      {filters.amenities.includes(amenity) && <Check size={12} />}
                      {amenity}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {filteredProperties.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/50 rounded-[3rem] border border-slate-800">
          <p className="text-slate-500 text-lg">{t('propertyList.noResults')}</p>
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
                  <div className={`absolute top-4 left-4 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                    p.status === 'Available' ? 'bg-emerald-600 text-white border-emerald-500' :
                    p.status === 'Rented' ? 'bg-red-600 text-white border-red-500' :
                    'bg-orange-600 text-white border-orange-500'
                  }`}>
                    {p.status}
                  </div>
                  <div className="absolute bottom-4 right-4 bg-slate-900/80 backdrop-blur-md text-white px-4 py-2 rounded-xl font-bold">
                    {t('common.etb')} {p.price.toLocaleString()} <span className="text-slate-400 text-xs font-normal">{t('common.perMonth')}</span>
                  </div>
                </div>
                
                <div className="p-6 space-y-4">
                 
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
