import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Upload, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import locationData from '../data/tnLocations.json';
import villageData from '../data/tnVillages.json';
import translationsData from '../data/tnTranslations.json';
import { useLanguage } from '../context/LanguageContext';

const districts = Object.keys(locationData);

const translations = {
  EN: {
    title: "Membership Registration",
    subtitle: "Join OMK Tamil Nadu. Please fill out the form below with accurate details.",
    personalInfo: "Personal Information",
    fullName: "Full Name *",
    mobile: "Mobile Number *",
    email: "Email",
    dob: "Date of Birth *",
    gender: "Gender *",
    selectGender: "Select Gender",
    male: "Male",
    female: "Female",
    other: "Other",
    voterDetails: "Voter Details",
    epicNumber: "EPIC Number (Voter ID) *",
    epicPlaceholder: "ABC1234567",
    addressDetails: "Address Details",
    district: "District *",
    selectDistrict: "-- Select District --",
    constituency: "Constituency *",
    selectConstituency: "-- Select Constituency --",
    taluk: "Taluk *",
    selectTaluk: "-- Select Taluk --",
    village: "Village/Town *",
    selectVillage: "-- Select Village/Town --",
    fullAddress: "Full Address *",
    addressPlaceholder: "Door No, Street Name...",
    profilePhoto: "Profile Photo",
    passportPhoto: "Passport Size Photo *",
    uploadPhoto: "Click to upload photo for membership card",
    uploadFormat: "Square ratio preferred. JPG, PNG",
    submit: "Submit Registration Application",
    submitting: "Submitting...",
    errAge: "You must be at least 18 years old to register.",
    errMissingImages: "Please upload your Profile Photo.",
    errMissingFields: "Please select District, Constituency, Taluk, and Village.",
    errSubmit: "Failed to submit registration. Please try again."
  },
  TA: {
    title: "உறுப்பினர் பதிவு",
    subtitle: "ஓ.எம்.கே-யில் இணையுங்கள். தயவுசெய்து சரியான விவரங்களுடன் படிவத்தை நிரப்பவும்.",
    personalInfo: "தனிப்பட்ட விவரங்கள்",
    fullName: "முழு பெயர் *",
    mobile: "மொபைல் எண் *",
    email: "மின்னஞ்சல்",
    dob: "பிறந்த தேதி *",
    gender: "பாலினம் *",
    selectGender: "பாலினத்தைத் தேர்ந்தெடுக்கவும்",
    male: "ஆண்",
    female: "பெண்",
    other: "மற்றவை",
    voterDetails: "வாக்காளர் விவரங்கள்",
    epicNumber: "வாக்காளர் அடையாள அட்டை எண் *",
    epicPlaceholder: "ABC1234567",
    addressDetails: "முகவரி விவரங்கள்",
    district: "மாவட்டம் *",
    selectDistrict: "-- மாவட்டத்தைத் தேர்ந்தெடுக்கவும் --",
    constituency: "சட்டமன்றத் தொகுதி *",
    selectConstituency: "-- தொகுதியைத் தேர்ந்தெடுக்கவும் --",
    taluk: "தாலுகா *",
    selectTaluk: "-- தாலுகாவைத் தேர்ந்தெடுக்கவும் --",
    village: "கிராமம்/நகரம் *",
    selectVillage: "-- கிராமம்/நகரத்தைத் தேர்ந்தெடுக்கவும் --",
    fullAddress: "முழு முகவரி *",
    addressPlaceholder: "கதவு எண், தெரு பெயர்...",
    profilePhoto: "புகைப்படம்",
    passportPhoto: "பாஸ்போர்ட் அளவு புகைப்படம் *",
    uploadPhoto: "உறுப்பினர் அட்டைக்கான புகைப்படத்தை பதிவேற்ற கிளிக் செய்யவும்",
    uploadFormat: "சதுர வடிவம் சிறந்தது. JPG, PNG",
    submit: "பதிவு படிவத்தை சமர்ப்பிக்கவும்",
    submitting: "சமர்ப்பிக்கப்படுகிறது...",
    errAge: "பதிவு செய்ய உங்களுக்கு குறைந்தது 18 வயது இருக்க வேண்டும்.",
    errMissingImages: "தயவுசெய்து உங்கள் புகைப்படத்தை பதிவேற்றவும்.",
    errMissingFields: "மாவட்டம், தொகுதி, தாலுகா மற்றும் கிராமத்தை தேர்ந்தெடுக்கவும்.",
    errSubmit: "பதிவு செய்ய முடியவில்லை. தயவுசெய்து மீண்டும் முயற்சிக்கவும்."
  }
};

const calculateAge = (dobString: string) => {
  const today = new Date();
  const birthDate = new Date(dobString);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

const Register = () => {
  const { language } = useLanguage();
  const t = translations[language as keyof typeof translations];

  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm();
  
  // File State
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);

  // Cascading Dropdown State
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedConstituency, setSelectedConstituency] = useState("");
  const [selectedTaluk, setSelectedTaluk] = useState("");
  const [selectedVillage, setSelectedVillage] = useState("");

  const constituencies = selectedDistrict ? (locationData as Record<string, string[]>)[selectedDistrict] : [];
  
  // Extract real Taluks and Villages directly from the downloaded postal dataset
  const taluks = selectedDistrict 
    ? Object.keys((villageData as Record<string, Record<string, string[]>>)[selectedDistrict] || {}) 
    : [];
    
  const villages = (selectedDistrict && selectedTaluk) 
    ? ((villageData as Record<string, Record<string, string[]>>)[selectedDistrict]?.[selectedTaluk] || [])
    : [];

  const uploadImage = async (file: File, path: string) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${path}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('member_documents')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('member_documents')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const onSubmit = async (data: any) => {
    // 1. Age Validation
    const age = calculateAge(data.dob);
    if (age < 18) {
      setError(t.errAge);
      return;
    }

    if (!profilePhoto) {
      setError(t.errMissingImages);
      return;
    }
    
    if (!selectedDistrict || !selectedConstituency || !selectedTaluk || !selectedVillage) {
      setError(t.errMissingFields);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // 1. Upload Images
      const photoUrl = await uploadImage(profilePhoto, 'profiles');

      // 2. Generate Application & Membership Number
      const applicationNumber = `OMK-APP-${Math.floor(100000 + Math.random() * 900000)}`;
      const newMembershipId = `OMK-${new Date().getFullYear()}-${Math.floor(Math.random() * 900000) + 100000}`;

      // 3. Save to Database
      const { error: dbError } = await supabase
        .from('members')
        .insert([{
          application_number: applicationNumber,
          membership_id: newMembershipId,
          full_name: data.fullName,
          mobile: data.mobile,
          email: data.email || null,
          dob: data.dob,
          gender: data.gender,
          epic_number: data.epicNumber.toUpperCase(),
          district: selectedDistrict,
          constituency: selectedConstituency,
          taluk: selectedTaluk,
          village: selectedVillage,
          address: data.address,
          photo_url: photoUrl,
          voter_front_url: null,
          voter_back_url: null,
          status: 'Approved',
          approved_at: new Date().toISOString()
        }]);

      if (dbError) throw dbError;

      // 4. Redirect to Success Page
      navigate('/success', { state: { applicationNumber, membershipId: newMembershipId, mobile: data.mobile } });

    } catch (err: any) {
      console.error("Registration Error:", err);
      setError(err.message || t.errSubmit);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-custom border border-omk-line p-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-black text-primary mb-2">{t.title}</h1>
          <p className="text-gray-600">{t.subtitle}</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-primary text-primary flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Personal Info */}
          <div>
            <h2 className="text-xl font-bold border-b pb-2 mb-4">{t.personalInfo}</h2>
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold mb-1">{t.fullName}</label>
                <input type="text" {...register('fullName', { required: true })} className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" required />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">{t.mobile}</label>
                <input type="tel" {...register('mobile', { required: true })} className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" required />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">{t.email}</label>
                <input type="email" {...register('email')} className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">{t.dob}</label>
                <input type="date" {...register('dob', { required: true })} className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" required />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">{t.gender}</label>
                <select {...register('gender', { required: true })} className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white" required>
                  <option value="">{t.selectGender}</option>
                  <option value="Male">{t.male}</option>
                  <option value="Female">{t.female}</option>
                  <option value="Other">{t.other}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Voter Details */}
          <div>
            <h2 className="text-xl font-bold border-b pb-2 mb-4">{t.voterDetails}</h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold mb-1">{t.epicNumber}</label>
                <input type="text" {...register('epicNumber', { required: true })} className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none uppercase" required placeholder={t.epicPlaceholder} />
              </div>
            </div>
          </div>

          {/* Address with Cascading Dropdowns */}
          <div>
            <h2 className="text-xl font-bold border-b pb-2 mb-4">{t.addressDetails}</h2>
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold mb-1">{t.district}</label>
                <select 
                  className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white" 
                  required
                  value={selectedDistrict}
                  onChange={(e) => {
                    setSelectedDistrict(e.target.value);
                    setSelectedConstituency(""); 
                    setSelectedTaluk(""); 
                    setSelectedVillage(""); 
                  }}
                >
                  <option value="">{t.selectDistrict}</option>
                  {districts.map(district => (
                    <option key={district} value={district}>
                      {district} {translationsData[district as keyof typeof translationsData] ? `/ ${translationsData[district as keyof typeof translationsData]}` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">{t.constituency}</label>
                <select 
                  className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white" 
                  required
                  disabled={!selectedDistrict}
                  value={selectedConstituency}
                  onChange={(e) => setSelectedConstituency(e.target.value)}
                >
                  <option value="">{t.selectConstituency}</option>
                  {constituencies.map(constituency => (
                    <option key={constituency} value={constituency}>
                      {constituency} {translationsData[constituency as keyof typeof translationsData] ? `/ ${translationsData[constituency as keyof typeof translationsData]}` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2 grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold mb-1">{t.taluk}</label>
                  <select 
                    className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white" 
                    required
                    disabled={!selectedDistrict}
                    value={selectedTaluk}
                    onChange={(e) => {
                      setSelectedTaluk(e.target.value);
                      setSelectedVillage(""); 
                    }}
                  >
                    <option value="">{t.selectTaluk}</option>
                    {taluks.map(taluk => (
                      <option key={taluk} value={taluk}>
                        {taluk} {translationsData[taluk as keyof typeof translationsData] ? `/ ${translationsData[taluk as keyof typeof translationsData]}` : ''}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">{t.village}</label>
                  <select 
                    className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white" 
                    required
                    disabled={!selectedTaluk}
                    value={selectedVillage}
                    onChange={(e) => setSelectedVillage(e.target.value)}
                  >
                    <option value="">{t.selectVillage}</option>
                    {villages.map(village => (
                      <option key={village} value={village}>
                        {village} {translationsData[village as keyof typeof translationsData] ? `/ ${translationsData[village as keyof typeof translationsData]}` : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-1">{t.fullAddress}</label>
                <textarea {...register('address', { required: true })} rows={3} className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" placeholder={t.addressPlaceholder} required></textarea>
              </div>
            </div>
          </div>

          {/* Photo */}
          <div>
            <h2 className="text-xl font-bold border-b pb-2 mb-4">{t.profilePhoto}</h2>
            <div>
              <label className="block text-sm font-semibold mb-1">{t.passportPhoto}</label>
              <label className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 max-w-sm mx-auto block">
                <input type="file" accept="image/png, image/jpeg" className="hidden" onChange={(e) => setProfilePhoto(e.target.files?.[0] || null)} />
                {profilePhoto ? (
                  <span className="text-sm font-semibold text-green-600 block">{profilePhoto.name}</span>
                ) : (
                  <>
                    <Upload className="mx-auto w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500 block">{t.uploadPhoto}</span>
                    <span className="text-xs text-gray-400 mt-1 block">{t.uploadFormat}</span>
                  </>
                )}
              </label>
            </div>
          </div>

          <div className="pt-4">
            <button type="submit" disabled={isSubmitting} className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-xl shadow-lg transition-colors text-lg flex justify-center items-center gap-2">
              {isSubmitting ? t.submitting : t.submit}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
