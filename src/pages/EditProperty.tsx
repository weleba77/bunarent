import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../lib/api';
import { MapPin, Bed, Bath, Maximize, DollarSign, Calendar, Image as ImageIcon, X, AlertCircle, Sparkles, Upload, Loader2, Save } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const EditProperty = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    address: '',
    city: 'Addis Ababa',
    bedrooms: '1',
    bathrooms: '1',
    sqft: '',
    price: '',
    availabilityDate: '',
    amenities: '',
    description: '',
    status: 'Available',
    propertyType: 'Apartment',
    imageUrls: [] as string[]
  });
  const [newImageUrl, setNewImageUrl] = useState('');

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await api.get(`/properties/${id}`);
        const p = res.data;
        setFormData({
          address: p.address,
          city: p.city,
          bedrooms: p.bedrooms.toString(),
          bathrooms: p.bathrooms.toString(),
          sqft: p.sqft.toString(),
          price: p.price.toString(),
          availabilityDate: p.availabilityDate.split('T')[0],
          amenities: p.amenities,
          description: p.description,
          status: p.status,
          propertyType: p.propertyType,
          imageUrls: p.images.map((img: any) => img.url)
        });
      } catch (err) {
        setError('Failed to fetch property details.');
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  const handleAddImage = () => {
    if (newImageUrl && !formData.imageUrls.includes(newImageUrl)) {
      setFormData({ ...formData, imageUrls: [...formData.imageUrls, newImageUrl] });
      setNewImageUrl('');
    }
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    setUploading(true);
    setError('');
    
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData();
        formData.append('image', file);
        const res = await api.post('/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        return res.data.url;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      setFormData(prev => ({
        ...prev,
        imageUrls: [...prev.imageUrls, ...uploadedUrls]
      }));
    } catch (err: any) {
      setError('Failed to upload images. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const removeImage = (url: string) => {
    setFormData({ ...formData, imageUrls: formData.imageUrls.filter(u => u !== url) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await api.put(`/properties/${id}`, formData);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update property. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center text-slate-400">{t('common.loading')}</div>;

  return (
    <div className="max-w-4xl mx-auto py-10 space-y-12">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-400 px-4 py-2 rounded-full text-sm font-bold border border-blue-500/20">
          <Sparkles size={16} />
          {t('editProperty.badge')}
        </div>
        <h1 className="text-5xl font-black text-white tracking-tight">{t('editProperty.title')}</h1>
        <p className="text-slate-400 text-lg">{t('editProperty.subtitle')}</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-[2rem] flex items-center gap-4">
          <AlertCircle size={24} />
          <p className="font-bold">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-slate-900 border border-slate-800 rounded-[3rem] p-10 space-y-10 shadow-2xl">
          {/* Basic Info */}
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-white flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-600/20 rounded-xl flex items-center justify-center text-emerald-500">
                <MapPin size={20} />
              </div>
              {t('propertyDetails.location')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-400 ml-1">{t('common.address')}</label>
                <input 
                  type="text" required className="input-field" placeholder="e.g. Bole Atlas, House #123"
                  value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-400 ml-1">{t('common.city')}</label>
                <select 
                  className="input-field"
                  value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})}
                >
                  <option>Addis Ababa</option>
                  <option>Bishoftu</option>
                  <option>Adama</option>
                  <option>Bahir Dar</option>
                </select>
              </div>
            </div>
          </div>

          {/* Property Specs */}
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-white flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center text-blue-500">
                <Maximize size={20} />
              </div>
              {t('propertyList.specifications')}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-400 ml-1 flex items-center gap-1"><Bed size={14} /> {t('common.bedrooms')}</label>
                <input type="number" min="0" required className="input-field" value={formData.bedrooms} onChange={(e) => setFormData({...formData, bedrooms: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-400 ml-1 flex items-center gap-1"><Bath size={14} /> {t('common.bathrooms')}</label>
                <input type="number" min="0" required className="input-field" value={formData.bathrooms} onChange={(e) => setFormData({...formData, bathrooms: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-400 ml-1 flex items-center gap-1"><Maximize size={14} /> {t('common.sqft')} (m²)</label>
                <input type="number" min="0" required className="input-field" value={formData.sqft} onChange={(e) => setFormData({...formData, sqft: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-400 ml-1 flex items-center gap-1"><DollarSign size={14} /> {t('common.price')} (ETB)</label>
                <input type="number" min="0" required className="input-field" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} />
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-white flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-600/20 rounded-xl flex items-center justify-center text-purple-500">
                <Calendar size={20} />
              </div>
              {t('propertyDetails.details')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-400 ml-1">{t('common.availableFrom')}</label>
                <input type="date" required className="input-field" value={formData.availabilityDate} onChange={(e) => setFormData({...formData, availabilityDate: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-400 ml-1">{t('common.amenities')}</label>
                <input type="text" className="input-field" placeholder="WiFi, Parking, Security, Water Tank" value={formData.amenities} onChange={(e) => setFormData({...formData, amenities: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-400 ml-1">{t('common.status')}</label>
                <select 
                  className="input-field"
                  value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}
                >
                  <option>Available</option>
                  <option>Rented</option>
                  <option>Under Maintenance</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-400 ml-1">{t('common.type')}</label>
                <select 
                  className="input-field"
                  value={formData.propertyType} onChange={(e) => setFormData({...formData, propertyType: e.target.value})}
                >
                  <option>Apartment</option>
                  <option>House</option>
                  <option>Studio</option>
                  <option>Villa</option>
                  <option>Condo</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-400 ml-1">{t('common.description')}</label>
              <textarea 
                required rows={4} className="input-field resize-none" placeholder="Describe the property's unique features..."
                value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>
          </div>

          {/* Images */}
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-white flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-600/20 rounded-xl flex items-center justify-center text-orange-500">
                <ImageIcon size={20} />
              </div>
              {t('addProperty.images')}
            </h2>

            {/* Drag and Drop Area */}
            <div 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative py-12 border-2 border-dashed rounded-[2rem] transition-all cursor-pointer flex flex-col items-center justify-center gap-4 ${
                isDragging ? 'border-emerald-500 bg-emerald-500/5' : 'border-slate-800 hover:border-slate-700 bg-slate-800/20'
              }`}
            >
              <input 
                type="file" 
                ref={fileInputRef}
                multiple 
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileUpload(e.target.files)}
              />
              {uploading ? (
                <div className="flex flex-col items-center gap-2 text-emerald-500">
                  <Loader2 className="animate-spin" size={40} />
                  <p className="font-bold">{t('common.loading')}</p>
                </div>
              ) : (
                <>
                  <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400">
                    <Upload size={32} />
                  </div>
                  <div className="text-center">
                    <p className="text-white font-bold text-lg">{t('addProperty.dropImages')}</p>
                    <p className="text-slate-500 text-sm">Supports JPG, PNG, WEBP</p>
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center gap-4 py-2">
              <div className="flex-1 h-px bg-slate-800" />
              <span className="text-slate-600 text-xs font-black uppercase tracking-widest">{t('addProperty.orPasteUrl')}</span>
              <div className="flex-1 h-px bg-slate-800" />
            </div>

            <div className="flex gap-4">
              <input 
                type="url" className="input-field" placeholder={t('addProperty.pastePlaceholder')}
                value={newImageUrl} onChange={(e) => setNewImageUrl(e.target.value)}
              />
              <button 
                type="button" onClick={handleAddImage}
                className="bg-slate-800 hover:bg-slate-700 text-white px-6 rounded-xl font-bold transition-all"
              >
                {t('addProperty.add')}
              </button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {formData.imageUrls.map((url, i) => (
                <div key={i} className="relative group h-32 rounded-2xl overflow-hidden border border-slate-800">
                  <img src={url} className="w-full h-full object-cover" />
                  <button 
                    type="button" onClick={() => removeImage(url)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              {formData.imageUrls.length === 0 && (
                <div className="col-span-full py-10 border-2 border-dashed border-slate-800 rounded-[2rem] flex flex-col items-center justify-center text-slate-500">
                  <ImageIcon size={40} className="mb-2 opacity-20" />
                  <p>No images added yet</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button 
            type="button" onClick={() => navigate(-1)}
            className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold py-5 rounded-[2rem] transition-all"
          >
            {t('common.cancel')}
          </button>
          <button 
            type="submit" disabled={saving}
            className="flex-[2] btn-primary py-5 text-xl rounded-[2rem] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 className="animate-spin" size={24} />
                {t('editProperty.saving')}
              </>
            ) : (
              <>
                <Save size={24} />
                {t('editProperty.save')}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProperty;
