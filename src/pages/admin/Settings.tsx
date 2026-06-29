import React, { useState, useEffect, useRef } from 'react';
import { Save, Upload, Image as ImageIcon, Link as LinkIcon, Building, ShieldCheck, Camera, Loader2 } from 'lucide-react';
import { supabase } from '../../services/supabase';

const Settings = () => {
  const [settings, setSettings] = useState<any>({
    organization_name: 'OMK Tamil Nadu',
    president_name: '',
    website: 'https://omktamilnadu.org',
    phone: '',
    address: '',
    facebook_url: '',
    twitter_url: '',
    instagram_url: '',
    youtube_url: '',
    footer_text: '© OMK Tamil Nadu. All rights reserved.',
    registrations_enabled: true,
    logo_url: '',
    card_background: '',
    president_signature: ''
  });
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState<string | null>(null);

  // File input refs
  const logoRef = useRef<HTMLInputElement>(null);
  const bgRef = useRef<HTMLInputElement>(null);
  const sigRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data, error } = await supabase.from('settings').select('*').eq('id', 1).single();
        if (data) setSettings((prev: any) => ({ ...prev, ...data }));
      } catch (err) {
        console.error(err);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setSettings((prev: any) => ({ ...prev, [name]: checked }));
    } else {
      setSettings((prev: any) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(fieldName);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${fieldName}_${Date.now()}.${fileExt}`;
      const filePath = `settings/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('member_documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('member_documents')
        .getPublicUrl(filePath);

      setSettings((prev: any) => ({ ...prev, [fieldName]: publicUrl }));
      
    } catch (err) {
      console.error('Error uploading image:', err);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploadingImage(null);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.from('settings').upsert({ id: 1, ...settings });
      if (!error) {
        alert('Settings saved successfully!');
      } else {
        throw error;
      }
    } catch (err) {
      console.error(err);
      alert('Failed to save settings. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-primary" />
              Platform Settings
            </h1>
            <p className="text-gray-500 mt-1">Configure your organization details, branding, and registration rules.</p>
          </div>
          <button 
            onClick={handleSave}
            disabled={loading}
            className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-xl flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {loading ? 'Saving...' : 'Save All Changes'}
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Left Column: Branding & Assets */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-5 border-b border-gray-100 bg-gray-50/50">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-gray-400" />
                  Branding & Assets
                </h2>
              </div>
              
              <div className="p-5 space-y-6">
                {/* Logo Upload */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Organization Logo</label>
                  <div 
                    className="border-2 border-dashed border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors cursor-pointer group relative overflow-hidden"
                    onClick={() => logoRef.current?.click()}
                  >
                    {uploadingImage === 'logo_url' ? (
                      <Loader2 className="w-8 h-8 text-primary animate-spin my-4" />
                    ) : settings.logo_url ? (
                      <img src={settings.logo_url} alt="Logo" className="h-16 object-contain mb-2" />
                    ) : (
                      <Camera className="w-8 h-8 text-gray-300 mb-2 group-hover:text-primary transition-colors" />
                    )}
                    <span className="text-sm font-semibold text-primary">Upload Logo (PNG)</span>
                    <input type="file" accept="image/png,image/jpeg" className="hidden" ref={logoRef} onChange={(e) => handleImageUpload(e, 'logo_url')} />
                  </div>
                </div>

                {/* Background Upload */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">ID Card Background</label>
                  <div 
                    className="border-2 border-dashed border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors cursor-pointer group relative overflow-hidden h-32"
                    onClick={() => bgRef.current?.click()}
                  >
                    {uploadingImage === 'card_background' ? (
                      <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    ) : settings.card_background ? (
                      <img src={settings.card_background} alt="Background" className="absolute inset-0 w-full h-full object-cover opacity-50" />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-gray-300 mb-2 group-hover:text-primary transition-colors" />
                    )}
                    <span className="text-sm font-semibold text-primary relative z-10 bg-white/80 px-3 py-1 rounded-full">Upload Background</span>
                    <input type="file" accept="image/png,image/jpeg" className="hidden" ref={bgRef} onChange={(e) => handleImageUpload(e, 'card_background')} />
                  </div>
                </div>

                {/* Signature Upload */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">President Signature</label>
                  <div 
                    className="border-2 border-dashed border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors cursor-pointer group relative overflow-hidden h-20"
                    onClick={() => sigRef.current?.click()}
                  >
                    {uploadingImage === 'president_signature' ? (
                      <Loader2 className="w-6 h-6 text-primary animate-spin" />
                    ) : settings.president_signature ? (
                      <img src={settings.president_signature} alt="Signature" className="h-12 object-contain" />
                    ) : (
                      <span className="text-sm font-semibold text-primary">Upload Signature (PNG)</span>
                    )}
                    <input type="file" accept="image/png" className="hidden" ref={sigRef} onChange={(e) => handleImageUpload(e, 'president_signature')} />
                  </div>
                </div>
              </div>
            </div>

            {/* Platform Controls */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
               <div className="p-5 border-b border-gray-100 bg-gray-50/50">
                <h2 className="text-lg font-bold text-gray-900">Platform Controls</h2>
              </div>
              <div className="p-5">
                <label className="flex items-center gap-3 cursor-pointer">
                  <div className="relative">
                    <input 
                      type="checkbox" 
                      name="registrations_enabled"
                      checked={settings.registrations_enabled}
                      onChange={handleChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">Accept New Registrations</p>
                    <p className="text-xs text-gray-500">Turn off to pause new signups</p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Text Details */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* General Info */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Building className="w-5 h-5 text-gray-400" />
                  Organization Details
                </h2>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Organization Name</label>
                  <input type="text" name="organization_name" value={settings.organization_name} onChange={handleChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">President Name</label>
                  <input type="text" name="president_name" value={settings.president_name} onChange={handleChange} placeholder="e.g. John Doe" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Headquarters Address</label>
                  <textarea name="address" value={settings.address} onChange={handleChange} rows={2} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none" placeholder="Full official address..."></textarea>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Official Website</label>
                  <input type="url" name="website" value={settings.website} onChange={handleChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Contact Phone</label>
                  <input type="text" name="phone" value={settings.phone} onChange={handleChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
