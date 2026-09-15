import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { 
  Camera, 
  Upload, 
  Trash2, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  ShieldAlert, 
  User, 
  FileText 
} from 'lucide-react';

export const CreatorAdminTab: React.FC = () => {
  const { 
    creatorProfile, 
    refreshCreatorProfile, 
    updateCreatorProfileData, 
    uploadCreatorPhotograph, 
    removeCreatorPhotograph 
  } = useData();

  const [fullName, setFullName] = useState(creatorProfile.fullName || 'Nazish Asad');
  const [title, setTitle] = useState(creatorProfile.title || 'Creator & Lead Systems Architect');
  const [bioEn, setBioEn] = useState(creatorProfile.bio?.en || '');
  const [bioHi, setBioHi] = useState(creatorProfile.bio?.hi || '');
  const [bioUr, setBioUr] = useState(creatorProfile.bio?.ur || '');

  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isSavingText, setIsSavingText] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setStatusMessage({ type: 'error', text: 'Please select a valid image file (PNG, JPEG, WebP).' });
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setStatusMessage({ type: 'error', text: 'Image size must be less than 8MB.' });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPreviewPhoto(reader.result as string);
      setStatusMessage(null);
    };
    reader.readAsDataURL(file);
  };

  const handleSavePhoto = async () => {
    if (!previewPhoto) return;
    setIsUploadingPhoto(true);
    setStatusMessage(null);

    const res = await uploadCreatorPhotograph(previewPhoto);
    setIsUploadingPhoto(false);

    if (res.success) {
      setPreviewPhoto(null);
      setStatusMessage({ type: 'success', text: 'Creator photograph uploaded and deployed successfully!' });
      setTimeout(() => setStatusMessage(null), 4000);
    } else {
      setStatusMessage({ type: 'error', text: res.error || 'Failed to upload photo.' });
    }
  };

  const handleRemovePhoto = async () => {
    if (!window.confirm('Are you sure you want to remove the current photograph and revert to the dignified placeholder?')) return;
    const ok = await removeCreatorPhotograph();
    if (ok) {
      setPreviewPhoto(null);
      setStatusMessage({ type: 'success', text: 'Photograph removed. Dignified placeholder is now active.' });
      setTimeout(() => setStatusMessage(null), 4000);
    } else {
      setStatusMessage({ type: 'error', text: 'Failed to remove photograph.' });
    }
  };

  const handleSaveDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingText(true);
    setStatusMessage(null);

    const ok = await updateCreatorProfileData({
      fullName,
      title,
      bio: {
        en: bioEn,
        hi: bioHi,
        ur: bioUr
      }
    });

    setIsSavingText(false);
    if (ok) {
      setStatusMessage({ type: 'success', text: 'Creator profile text details updated successfully!' });
      setTimeout(() => setStatusMessage(null), 4000);
    } else {
      setStatusMessage({ type: 'error', text: 'Failed to save creator profile details.' });
    }
  };

  const currentDisplayPhoto = previewPhoto || creatorProfile.photoUrl;

  return (
    <div className="space-y-6 text-stone-900 font-sans">
      {/* Top Banner */}
      <div className="bg-[#07271D] text-white p-5 rounded-2xl border border-emerald-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-amber-400 bg-emerald-950/80 px-2.5 py-1 rounded-full border border-amber-500/30 mb-2">
            <User className="w-3.5 h-3.5" />
            <span>Authoritative Profile Governance</span>
          </div>
          <h3 className="font-display text-xl font-bold text-white">
            Creator Profile & Photograph Management
          </h3>
          <p className="text-xs text-emerald-200/80 mt-1 max-w-xl font-mono">
            Manage the official creator photograph and multi-lingual bio for Nazish Asad.
          </p>
        </div>

        <button
          type="button"
          onClick={() => refreshCreatorProfile()}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-emerald-200 text-xs font-mono border border-emerald-700 transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Profile</span>
        </button>
      </div>

      {statusMessage && (
        <div className={`p-4 rounded-xl text-xs font-mono flex items-center gap-2.5 ${
          statusMessage.type === 'success' 
            ? 'bg-emerald-50 text-emerald-800 border border-emerald-300' 
            : 'bg-rose-50 text-rose-800 border border-rose-300'
        }`}>
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Safety Compliance Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold block text-sm">Asset Boundary Compliance</span>
          <p className="leading-relaxed">
            The blue handwritten signature asset is strictly protected and isolated for legal certification & seal attestation only. It is programmatically banned from ever being served as the creator photograph.
          </p>
        </div>
      </div>

      {/* Grid: Photo Upload on Left, Text Form on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Photograph Uploader */}
        <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <h4 className="font-display font-bold text-stone-900 text-base mb-1 flex items-center gap-2">
              <Camera className="w-4 h-4 text-[#0B3D2E]" />
              <span>Official Photograph</span>
            </h4>
            <p className="text-xs text-stone-500 font-mono mb-4">
              Upload a clear, high-resolution portrait photograph (JPG, PNG, or WebP).
            </p>

            {/* Photo Box */}
            <div className="w-full aspect-square rounded-2xl overflow-hidden border-2 border-dashed border-stone-300 bg-stone-50 flex items-center justify-center relative group">
              {currentDisplayPhoto ? (
                <img
                  src={currentDisplayPhoto}
                  alt="Creator Photograph Preview"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top"
                />
              ) : (
                <div className="flex flex-col items-center justify-center p-6 text-center text-stone-400">
                  <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xl mb-2 font-mono">
                    NA
                  </div>
                  <span className="text-xs font-semibold text-stone-600">No Photograph Uploaded</span>
                  <span className="text-[10px] text-stone-400 mt-1">Dignified placeholder is active</span>
                </div>
              )}

              {previewPhoto && (
                <div className="absolute top-2 left-2 px-2 py-1 rounded bg-amber-400 text-black text-[10px] font-mono font-bold shadow">
                  Unsaved Preview
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-stone-100">
            <label className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-mono font-bold cursor-pointer transition">
              <Upload className="w-4 h-4 text-emerald-800" />
              <span>Select Photograph File</span>
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>

            {previewPhoto && (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleSavePhoto}
                  disabled={isUploadingPhoto}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0B3D2E] hover:bg-[#145A43] text-white text-xs font-mono font-bold shadow transition disabled:opacity-50"
                >
                  <Save className="w-4 h-4 text-amber-400" />
                  <span>{isUploadingPhoto ? 'Uploading...' : 'Save & Publish Photo'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewPhoto(null)}
                  className="px-3 py-2.5 rounded-xl border border-stone-300 text-stone-600 hover:bg-stone-100 text-xs font-mono"
                >
                  Cancel
                </button>
              </div>
            )}

            {creatorProfile.photoUrl && !previewPhoto && (
              <button
                type="button"
                onClick={handleRemovePhoto}
                className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-rose-700 hover:bg-rose-50 border border-rose-200 text-xs font-mono transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove Photo (Use Placeholder)</span>
              </button>
            )}
          </div>
        </div>

        {/* Right Columns: Profile Text & Multilingual Bio */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 shadow-xs">
          <form onSubmit={handleSaveDetails} className="space-y-4">
            <h4 className="font-display font-bold text-stone-900 text-base mb-1 flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#0B3D2E]" />
              <span>Attribution & Biography Details</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:border-emerald-600 outline-hidden font-sans text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Title / Designation</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:border-emerald-600 outline-hidden font-sans text-sm"
                />
              </div>
            </div>

            <div className="space-y-3 text-xs font-mono pt-2">
              <div>
                <label className="block font-bold text-stone-700 mb-1">English Bio Narrative</label>
                <textarea
                  rows={4}
                  value={bioEn}
                  onChange={e => setBioEn(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:border-emerald-600 outline-hidden font-sans text-xs leading-relaxed"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Hindi (हिंदी) Bio Narrative</label>
                <textarea
                  rows={3}
                  value={bioHi}
                  onChange={e => setBioHi(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:border-emerald-600 outline-hidden font-sans text-xs leading-relaxed"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Urdu (اردو) Bio Narrative</label>
                <textarea
                  rows={3}
                  dir="rtl"
                  value={bioUr}
                  onChange={e => setBioUr(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:border-emerald-600 outline-hidden font-sans text-xs leading-relaxed text-right"
                />
              </div>
            </div>

            <div className="pt-3 flex justify-end">
              <button
                type="submit"
                disabled={isSavingText}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0B3D2E] hover:bg-[#145A43] text-white font-mono font-bold text-xs shadow-md transition disabled:opacity-50"
              >
                <Save className="w-4 h-4 text-amber-400" />
                <span>{isSavingText ? 'Saving...' : 'Save Profile Details'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
