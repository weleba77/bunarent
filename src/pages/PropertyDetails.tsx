import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../lib/api';
import { useAuth } from '../hooks/useAuth';
import { MapPin, Bed, Bath, Maximize, Calendar, Phone, User, CheckCircle2, ArrowLeft, Share2, Heart, MessageSquare, AlertCircle, Loader2, Copy, Check, X, Facebook, Twitter, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const PropertyDetails = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [savingToWishlist, setSavingToWishlist] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [renderError, setRenderError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await api.get(`/properties/${id}`);
        setProperty(res.data);
        
        // Check if saved to wishlist if user is logged in
        if (user) {
          try {
            const statusRes = await api.get(`/wishlist/${id}/status`);
            setIsSaved(statusRes.data.saved);
          } catch (err) {
            console.error('Failed to fetch wishlist status', err);
          }
        }
      } catch (err) {
        console.error('Failed to fetch property', err);
        navigate('/properties');
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id, navigate, user]);

  const toggleSave = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setSavingToWishlist(true);
    try {
      if (isSaved) {
        await api.delete(`/wishlist/${id}`);
        setIsSaved(false);
      } else {
        await api.post(`/wishlist/${id}`);
        setIsSaved(true);
      }
    } catch (err) {
      console.error('Failed to toggle wishlist', err);
    } finally {
      setSavingToWishlist(false);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: `BunaRent - ${property.address}`,
      text: `Check out this property in ${property.city}: ${property.address}`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Error sharing', err);
        setShowShareModal(true);
      }
    } else {
      setShowShareModal(true);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (renderError) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-red-400 gap-4 p-8 text-center">
      <AlertCircle size={48} />
      <p className="text-xl font-bold">Rendering Error</p>
      <p className="text-sm opacity-70">{renderError}</p>
      <button onClick={() => window.location.reload()} className="btn-primary px-6 py-2 rounded-xl mt-4">Reload Page</button>
    </div>
  );

  if (loading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-slate-400 gap-4">
      <Loader2 className="animate-spin" size={40} />
      <p className="text-lg font-medium">{t('common.loading')}</p>
    </div>
  );

  if (!property) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-slate-400 gap-4">
      <AlertCircle size={48} className="opacity-20" />
      <p className="text-xl font-bold">{t('propertyList.noResults')}</p>
      <Link to="/properties" className="btn-primary px-6 py-2 rounded-xl">{t('propertyDetails.back')}</Link>
    </div>
  );

  try {
    const amenitiesList = typeof property.amenities === 'string' 
      ? property.amenities.split(',').map((a: string) => a.trim()).filter(Boolean)
      : [];

    const shareLinks = [
      { 
        name: 'WhatsApp', 
        icon: <Send size={20} />, 
        color: 'bg-[#25D366]',
        url: `https://wa.me/?text=${encodeURIComponent(`${t('propertyDetails.shareTitle')}: ${property.address || ''} - ${window.location.href}`)}`
      },
      { 
        name: 'Telegram', 
        icon: <Send size={20} />, 
        color: 'bg-[#0088cc]',
        url: `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(property.address || '')}`
      },
      { 
        name: 'Facebook', 
        icon: <Facebook size={20} />, 
        color: 'bg-[#1877F2]',
        url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`
      }
    ];

    return (
      <div className="space-y-8 pb-20">
        {/* Debug Info - Visible for troubleshooting */}
        <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-xs font-mono text-red-400 mb-4">
          <p>Debug: ID={id} | Loaded={property ? 'Yes' : 'No'} | Images={property?.images?.length || 0}</p>
          {!property && !loading && <p>Error: Property data is null after loading finished.</p>}
        </div>

        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors font-bold"
        >
          <ArrowLeft size={20} /> {t('propertyDetails.back')}
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column: Images and Description */}
          <div className="lg:col-span-2 space-y-8">
            <div className="space-y-4">
              <div className="relative h-[500px] rounded-[3rem] overflow-hidden border border-slate-800 shadow-2xl">
                <img 
                  src={property.images?.[activeImage]?.url || 'https://picsum.photos/seed/property/1200/800'} 
                  alt={property.address || 'Property'}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                  {Array.isArray(property.images) && property.images.map((_: any, i: number) => (
                    <button 
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={`w-3 h-3 rounded-full transition-all ${activeImage === i ? 'bg-emerald-500 w-8' : 'bg-white/30'}`}
                    />
                  ))}
                </div>
              </div>
              
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {Array.isArray(property.images) && property.images.map((img: any, i: number) => (
                  <button 
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`shrink-0 w-32 h-24 rounded-2xl overflow-hidden border-2 transition-all ${activeImage === i ? 'border-emerald-500' : 'border-transparent'}`}
                  >
                    {img && img.url && <img src={img.url} className="w-full h-full object-cover" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-[3rem] p-10 space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl font-black text-white">{t('propertyDetails.details')}</h2>
                <p className="text-slate-400 leading-relaxed text-lg">
                  {property.description || 'No description available.'}
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-3xl font-black text-white">{t('common.amenities')}</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {amenitiesList.map((amenity: string, i: number) => (
                    <div key={i} className="flex items-center gap-3 text-slate-300 bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50">
                      <CheckCircle2 className="text-emerald-500" size={20} />
                      <span className="font-medium">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-3xl font-black text-white">{t('propertyDetails.location')}</h2>
                <div className="flex items-center gap-3 text-slate-300 bg-slate-800/50 p-6 rounded-[2rem] border border-slate-800">
                  <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <p className="text-white font-bold text-lg">{property.address || 'Address not available'}</p>
                    <p className="text-slate-400">{property.city || 'City not available'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Sidebar */}
          <div className="space-y-8">
            <div className="bg-slate-900 border border-slate-800 rounded-[3rem] p-8 space-y-8 sticky top-28 shadow-2xl">
              <div className="space-y-2">
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                  property.status === 'Available' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                  property.status === 'Rented' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                  'bg-orange-500/10 text-orange-400 border-orange-500/20'
                }`}>
                  {property.status || 'Unknown'}
                </div>
                <div className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border bg-blue-500/10 text-blue-400 border-blue-500/20 ml-2">
                  {property.propertyType || 'Property'}
                </div>
                <h1 className="text-3xl font-black text-white leading-tight">{property.address || 'Property Details'}</h1>
                <p className="text-slate-400 flex items-center gap-2">
                  <MapPin size={18} /> {property.city || 'Location N/A'}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 py-6 border-y border-slate-800">
                <div className="text-center space-y-1">
                  <Bed className="mx-auto text-emerald-500" size={24} />
                  <p className="text-white font-bold">{property.bedrooms || 0}</p>
                  <p className="text-slate-500 text-xs uppercase font-black">{t('common.bedrooms')}</p>
                </div>
                <div className="text-center space-y-1">
                  <Bath className="mx-auto text-emerald-500" size={24} />
                  <p className="text-white font-bold">{property.bathrooms || 0}</p>
                  <p className="text-slate-500 text-xs uppercase font-black">{t('common.bathrooms')}</p>
                </div>
                <div className="text-center space-y-1">
                  <Maximize className="mx-auto text-emerald-500" size={24} />
                  <p className="text-white font-bold">{property.sqft || 0}</p>
                  <p className="text-slate-500 text-xs uppercase font-black">m²</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <span className="text-slate-400 font-bold">{t('common.price')}</span>
                  <span className="text-3xl font-black text-emerald-500">{t('common.etb')} {(property.price || 0).toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400 text-sm bg-slate-800/50 p-3 rounded-xl">
                  <Calendar size={18} /> {t('common.availableFrom')}: {property.availabilityDate ? new Date(property.availabilityDate).toLocaleDateString() : 'N/A'}
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <button 
                  onClick={() => {
                    if (!user) {
                      navigate('/login');
                    } else {
                      navigate(`/messages/${property.ownerId}?propertyId=${property.id}`);
                    }
                  }}
                  className="w-full btn-primary py-5 text-lg flex items-center justify-center gap-3"
                >
                  <MessageSquare size={20} /> {user ? t('propertyDetails.contactOwner') : t('propertyDetails.loginToMessage')}
                </button>
                <div className="flex gap-4">
                  <button 
                    onClick={toggleSave}
                    disabled={savingToWishlist}
                    className={`flex-1 font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 ${
                      isSaved 
                        ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
                        : 'bg-slate-800 hover:bg-slate-700 text-white'
                    }`}
                  >
                    <Heart size={20} className={isSaved ? 'fill-current' : ''} /> 
                    {savingToWishlist ? t('common.loading') : (isSaved ? t('propertyDetails.saved') : t('wishlist'))}
                  </button>
                  <button 
                    onClick={handleShare}
                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2"
                  >
                    <Share2 size={20} /> {t('propertyDetails.share')}
                  </button>
                </div>
              </div>

              <div className="pt-8 border-t border-slate-800 flex items-center gap-4">
                <div className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center text-emerald-500 font-black text-xl border border-slate-700">
                  {property.owner?.fullName?.[0] || <User />}
                </div>
                <div>
                  <p className="text-slate-500 text-xs font-black uppercase tracking-widest">{t('propertyDetails.listedBy')}</p>
                  <p className="text-white font-bold text-lg">{property.owner?.fullName || 'Unknown Owner'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Share Modal */}
        <AnimatePresence>
          {showShareModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowShareModal(false)}
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl space-y-6"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-black text-white">{t('propertyDetails.shareTitle')}</h3>
                  <button 
                    onClick={() => setShowShareModal(false)}
                    className="p-2 text-slate-500 hover:text-white transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-4">
                  <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">{t('propertyDetails.shareVia')}</p>
                  <div className="grid grid-cols-3 gap-4">
                    {shareLinks.map((link) => (
                      <a 
                        key={link.name}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col items-center gap-2 group"
                      >
                        <div className={`w-14 h-14 ${link.color} rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                          {link.icon}
                        </div>
                        <span className="text-xs font-bold text-slate-400 group-hover:text-white transition-colors">{link.name}</span>
                      </a>
                    ))}
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-800">
                  <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">{t('propertyDetails.copyLink')}</p>
                  <div className="flex gap-2 p-2 bg-slate-800/50 rounded-2xl border border-slate-700">
                    <input 
                      type="text" 
                      readOnly 
                      value={window.location.href}
                      className="flex-1 bg-transparent border-none outline-none text-slate-300 text-sm px-2 truncate"
                    />
                    <button 
                      onClick={copyToClipboard}
                      className={`px-4 py-2 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
                        copied ? 'bg-emerald-500 text-white' : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20'
                      }`}
                    >
                      {copied ? <Check size={16} /> : <Copy size={16} />}
                      {copied ? t('propertyDetails.linkCopied') : t('propertyDetails.copyLink')}
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    );
  } catch (err: any) {
    console.error("Rendering error in PropertyDetails:", err);
    setRenderError(err.message);
    return null;
  }
};

export default PropertyDetails;
