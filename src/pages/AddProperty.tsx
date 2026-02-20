import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { Plus, MapPin, Bed, Bath, Maximize, DollarSign, Calendar, Image as ImageIcon, X, AlertCircle, Sparkles } from 'lucide-react';

const AddProperty = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
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
    imageUrls: [] as string[]
  });
  const [newImageUrl, setNewImageUrl] = useState('');

  const handleAddImage = () => {
    if (newImageUrl && !formData.imageUrls.includes(newImageUrl)) {
      setFormData({ ...formData, imageUrls: [...formData.imageUrls, newImageUrl] });
      setNewImageUrl('');
    }
  };

  const removeImage = (url: string) => {
    setFormData({ ...formData, imageUrls: formData.imageUrls.filter(u => u !== url) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/properties', formData);
      navigate('/properties');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to list property. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 space-y-12">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-full text-sm font-bold border border-emerald-500/20">
          <Sparkles size={16} />
          List Your Property Today
        </div>
        <h1 className="text-5xl font-black text-white tracking-tight">Property Details</h1>
        <p className="text-slate-400 text-lg">Provide accurate information to attract the best tenants.</p>
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
              Location & Address
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-400 ml-1">Full Address</label>
                <input 
                  type="text" required className="input-field" placeholder="e.g. Bole Atlas, House #123"
                  value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-400 ml-1">City</label>
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
              Specifications
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-400 ml-1 flex items-center gap-1"><Bed size={14} /> Bedrooms</label>
                <input type="number" min="0" required className="input-field" value={formData.bedrooms} onChange={(e) => setFormData({...formData, bedrooms: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-400 ml-1 flex items-center gap-1"><Bath size={14} /> Bathrooms</label>
                <input type="number" min="0" required className="input-field" value={formData.bathrooms} onChange={(e) => setFormData({...formData, bathrooms: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-400 ml-1 flex items-center gap-1"><Maximize size={14} /> Sq. Footage (m²)</label>
                <input type="number" min="0" required className="input-field" value={formData.sqft} onChange={(e) => setFormData({...formData, sqft: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-400 ml-1 flex items-center gap-1"><DollarSign size={14} /> Monthly Rent (ETB)</label>
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
              Availability & Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-400 ml-1">Available From</label>
                <input type="date" required className="input-field" value={formData.availabilityDate} onChange={(e) => setFormData({...formData, availabilityDate: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-400 ml-1">Amenities (comma separated)</label>
                <input type="text" className="input-field" placeholder="WiFi, Parking, Security, Water Tank" value={formData.amenities} onChange={(e) => setFormData({...formData, amenities: e.target.value})} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-400 ml-1">Description</label>
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
              Property Images
            </h2>
            <div className="flex gap-4">
              <input 
                type="url" className="input-field" placeholder="Paste image URL here..."
                value={newImageUrl} onChange={(e) => setNewImageUrl(e.target.value)}
              />
              <button 
                type="button" onClick={handleAddImage}
                className="bg-slate-800 hover:bg-slate-700 text-white px-6 rounded-xl font-bold transition-all"
              >
                Add
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
            Cancel
          </button>
          <button 
            type="submit" disabled={loading}
            className="flex-[2] btn-primary py-5 text-xl rounded-[2rem] disabled:opacity-50"
          >
            {loading ? 'Listing Property...' : 'Publish Listing'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProperty;
