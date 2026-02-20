import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { MapPin, Bed, Bath, Maximize, Calendar, Phone, User, CheckCircle2, ArrowLeft, Share2, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await api.get(`/properties/${id}`);
        setProperty(res.data);
      } catch (err) {
        console.error('Failed to fetch property', err);
        navigate('/properties');
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id, navigate]);

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center text-slate-400">Loading details...</div>;
  if (!property) return null;

  const amenitiesList = property.amenities.split(',').map((a: string) => a.trim());

  return (
    <div className="space-y-8 pb-20">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors font-bold"
      >
        <ArrowLeft size={20} /> Back to Listings
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Images and Description */}
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-4">
            <div className="relative h-[500px] rounded-[3rem] overflow-hidden border border-slate-800 shadow-2xl">
              <img 
                src={property.images?.[activeImage]?.url || 'https://picsum.photos/seed/property/1200/800'} 
                alt={property.address}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                {property.images?.map((_: any, i: number) => (
                  <button 
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`w-3 h-3 rounded-full transition-all ${activeImage === i ? 'bg-emerald-500 w-8' : 'bg-white/30'}`}
                  />
                ))}
              </div>
            </div>
            
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {property.images?.map((img: any, i: number) => (
                <button 
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`shrink-0 w-32 h-24 rounded-2xl overflow-hidden border-2 transition-all ${activeImage === i ? 'border-emerald-500' : 'border-transparent'}`}
                >
                  <img src={img.url} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-[3rem] p-10 space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl font-black text-white">Description</h2>
              <p className="text-slate-400 leading-relaxed text-lg">
                {property.description}
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-3xl font-black text-white">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {amenitiesList.map((amenity: string, i: number) => (
                  <div key={i} className="flex items-center gap-3 text-slate-300 bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50">
                    <CheckCircle2 className="text-emerald-500" size={20} />
                    <span className="font-medium">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Sidebar */}
        <div className="space-y-8">
          <div className="bg-slate-900 border border-slate-800 rounded-[3rem] p-8 space-y-8 sticky top-28 shadow-2xl">
            <div className="space-y-2">
              <h1 className="text-3xl font-black text-white leading-tight">{property.address}</h1>
              <p className="text-slate-400 flex items-center gap-2">
                <MapPin size={18} /> {property.city}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 py-6 border-y border-slate-800">
              <div className="text-center space-y-1">
                <Bed className="mx-auto text-emerald-500" size={24} />
                <p className="text-white font-bold">{property.bedrooms}</p>
                <p className="text-slate-500 text-xs uppercase font-black">Beds</p>
              </div>
              <div className="text-center space-y-1">
                <Bath className="mx-auto text-emerald-500" size={24} />
                <p className="text-white font-bold">{property.bathrooms}</p>
                <p className="text-slate-500 text-xs uppercase font-black">Baths</p>
              </div>
              <div className="text-center space-y-1">
                <Maximize className="mx-auto text-emerald-500" size={24} />
                <p className="text-white font-bold">{property.sqft}</p>
                <p className="text-slate-500 text-xs uppercase font-black">m²</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-slate-400 font-bold">Monthly Rent</span>
                <span className="text-3xl font-black text-emerald-500">ETB {property.price.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400 text-sm bg-slate-800/50 p-3 rounded-xl">
                <Calendar size={18} /> Available from: {new Date(property.availabilityDate).toLocaleDateString()}
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <button className="w-full btn-primary py-5 text-lg flex items-center justify-center gap-3">
                <Phone size={20} /> Contact Owner
              </button>
              <div className="flex gap-4">
                <button className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2">
                  <Heart size={20} /> Save
                </button>
                <button className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2">
                  <Share2 size={20} /> Share
                </button>
              </div>
            </div>

            <div className="pt-8 border-t border-slate-800 flex items-center gap-4">
              <div className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center text-emerald-500 font-black text-xl border border-slate-700">
                {property.owner?.fullName?.[0] || <User />}
              </div>
              <div>
                <p className="text-slate-500 text-xs font-black uppercase tracking-widest">Listed by</p>
                <p className="text-white font-bold text-lg">{property.owner?.fullName}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
