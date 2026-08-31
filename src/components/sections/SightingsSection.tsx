import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { SightingReport } from '../../types';
import { 
  Eye, 
  ShieldAlert, 
  Send, 
  CheckCircle2, 
  Calendar, 
  MapPin, 
  Camera, 
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';

export const SightingsSection: React.FC = () => {
  const { sightings, addSighting } = useData();

  const [species, setSpecies] = useState('Royal Bengal Tiger');
  const [generalLocation, setGeneralLocation] = useState('Valmikinagar Safari Zone');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [timeOfDay, setTimeOfDay] = useState('Morning Safari (06:30 - 09:30)');
  const [numberOfAnimals, setNumberOfAnimals] = useState(1);
  const [behavior, setBehavior] = useState('');
  const [reporterName, setReporterName] = useState('');
  const [reporterRole, setReporterRole] = useState('Visitor / Tourist');
  const [photoUrl, setPhotoUrl] = useState('');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!species || !generalLocation || !behavior || !reporterName) {
      alert('Please fill in all required fields.');
      return;
    }

    addSighting({
      species,
      generalLocation,
      date,
      timeOfDay,
      numberOfAnimals: Number(numberOfAnimals),
      behavior,
      observer: `${reporterName} (${reporterRole})`,
      photoUrl: photoUrl.trim() || undefined,
      verificationStatus: 'under_review'
    });

    setSubmittedSuccess(true);
    setBehavior('');
    setPhotoUrl('');
    setTimeout(() => setSubmittedSuccess(false), 6000);
  };

  const getVerificationBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return (
          <span className="inline-flex items-center text-[10px] font-mono font-bold bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded border border-emerald-300">
            <CheckCircle className="w-3 h-3 mr-1 text-emerald-700" />
            Verified Record
          </span>
        );
      case 'under_review':
        return (
          <span className="inline-flex items-center text-[10px] font-mono font-bold bg-stone-100 text-stone-700 px-2 py-0.5 rounded border border-stone-300">
            <Clock className="w-3 h-3 mr-1" />
            Under Field Review
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center text-[10px] font-mono font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded border border-amber-300">
            <AlertCircle className="w-3 h-3 mr-1 text-amber-700" />
            Reported Observation
          </span>
        );
    }
  };

  return (
    <div className="space-y-10 animate-fade-in pb-8">
      {/* Header Banner */}
      <div className="bg-[#0B3D2E] text-white rounded-3xl p-6 sm:p-10 border border-[#145A43] shadow-lg space-y-4">
        <div className="inline-flex items-center space-x-2 bg-[#07271D] border border-amber-500/40 rounded-full px-3 py-1 text-xs text-amber-300 font-mono">
          <Eye className="w-3.5 h-3.5 text-amber-400" />
          <span>Citizen Science & Observation Registry</span>
        </div>

        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white">
          Wildlife Sightings & Citizen Records
        </h1>

        <p className="text-sm sm:text-base text-emerald-100/90 max-w-3xl leading-relaxed">
          Record your non-invasive wildlife encounters from designated ecotourism routes. Your observations contribute to ongoing phenological and species-distribution records across Valmiki’s ranges.
        </p>

        {/* Safety Disclaimer */}
        <div className="bg-[#07271D] border border-amber-500/30 rounded-2xl p-4 text-xs text-amber-200/90 flex items-start space-x-3">
          <ShieldAlert className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-amber-300 uppercase tracking-wide block">
              Wildlife Privacy & Security Mandate
            </span>
            <p className="leading-relaxed text-[11px] sm:text-xs">
              Never share live or high-precision GPS coordinates of predators, breeding dens, or vulnerable offspring. All public records are automatically generalized to broad tourism sectors.
            </p>
          </div>
        </div>
      </div>

      {/* Submission Form & Recent Feed Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Column */}
        <div className="lg:col-span-1 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-5">
          <div className="space-y-1">
            <h2 className="font-display font-bold text-xl text-stone-900">
              Submit an Observation
            </h2>
            <p className="text-xs text-stone-500">
              Help maintain VTR's verified biodiversity log.
            </p>
          </div>

          {submittedSuccess && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-900 flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Observation Submitted Successfully!</span>
                <span>Your report has been queued for verification by our moderation cell.</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-stone-700 block mb-1">Species Observed *</label>
              <select
                value={species}
                onChange={(e) => setSpecies(e.target.value)}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0B3D2E]"
              >
                <option value="Royal Bengal Tiger">Royal Bengal Tiger</option>
                <option value="Indian Leopard">Indian Leopard</option>
                <option value="Sloth Bear">Sloth Bear</option>
                <option value="Indian Gaur (Bison)">Indian Gaur (Bison)</option>
                <option value="Spotted Deer (Chital)">Spotted Deer (Chital)</option>
                <option value="Sambar Deer">Sambar Deer</option>
                <option value="Gharial">Gharial</option>
                <option value="Great Indian Hornbill">Great Indian Hornbill</option>
                <option value="Other Species">Other Rare Flora / Fauna</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-stone-700 block mb-1">General Range / Sector *</label>
              <select
                value={generalLocation}
                onChange={(e) => setGeneralLocation(e.target.value)}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0B3D2E]"
              >
                <option value="Valmikinagar Safari Zone">Valmikinagar Safari Zone</option>
                <option value="Manguraha Range Route">Manguraha Range Route</option>
                <option value="Gobardhana Sector">Gobardhana Sector</option>
                <option value="Raghia Forest Route">Raghia Forest Route</option>
                <option value="Madanpur Wetland / River Corridor">Madanpur Wetland / River Corridor</option>
                <option value="Gandak River Eco-Route">Gandak River Eco-Route</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-stone-700 block mb-1">Date *</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="font-semibold text-stone-700 block mb-1">Count *</label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={numberOfAnimals}
                  onChange={(e) => setNumberOfAnimals(Number(e.target.value))}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-stone-700 block mb-1">Time of Day</label>
              <input
                type="text"
                value={timeOfDay}
                onChange={(e) => setTimeOfDay(e.target.value)}
                placeholder="e.g. 07:15 AM during morning drive"
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-stone-700 block mb-1">Behavior & Habitat Context *</label>
              <textarea
                rows={3}
                value={behavior}
                onChange={(e) => setBehavior(e.target.value)}
                placeholder="Describe animal activity: basking, stalking, drinking at waterhole, calling..."
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0B3D2E]"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-stone-700 block mb-1">Observer Name *</label>
                <input
                  type="text"
                  value={reporterName}
                  onChange={(e) => setReporterName(e.target.value)}
                  placeholder="Your Full Name"
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="font-semibold text-stone-700 block mb-1">Observer Role</label>
                <select
                  value={reporterRole}
                  onChange={(e) => setReporterRole(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none"
                >
                  <option value="Visitor / Tourist">Visitor / Tourist</option>
                  <option value="Certified Naturalist">Certified Naturalist</option>
                  <option value="Local Resident">Local Resident</option>
                  <option value="Research Scholar">Research Scholar</option>
                </select>
              </div>
            </div>

            <div>
              <label className="font-semibold text-stone-700 block mb-1">Photo URL (Optional)</label>
              <input
                type="url"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                placeholder="https://..."
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#0B3D2E] hover:bg-emerald-900 text-white font-bold rounded-xl shadow flex items-center justify-center space-x-2 text-xs transition-colors"
            >
              <Send className="w-4 h-4 text-amber-400" />
              <span>Record Observation</span>
            </button>
          </form>
        </div>

        {/* Sightings Feed Column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="font-display font-bold text-xl text-stone-900">
              Recent Field Sightings & Observations ({sightings.length})
            </h2>
          </div>

          <div className="space-y-4">
            {sightings.map((s) => (
              <div
                key={s.id}
                className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-display font-bold text-base text-stone-900">
                      {s.species}
                    </span>
                    <span className="bg-stone-100 text-stone-700 text-xs px-2 py-0.5 rounded font-mono">
                      Qty: {s.numberOfAnimals}
                    </span>
                  </div>
                  {getVerificationBadge(s.verificationStatus)}
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-500 font-mono">
                  <span className="flex items-center text-emerald-800 font-medium">
                    <MapPin className="w-3.5 h-3.5 mr-1" />
                    {s.generalLocation}
                  </span>
                  <span className="flex items-center">
                    <Calendar className="w-3.5 h-3.5 mr-1" />
                    {s.date} {s.timeOfDay ? `(${s.timeOfDay})` : ''}
                  </span>
                </div>

                <p className="text-xs text-stone-700 leading-relaxed bg-stone-50 p-3 rounded-xl border border-stone-100">
                  {s.behavior}
                </p>

                {s.photoUrl && (
                  <div className="h-44 rounded-xl overflow-hidden bg-stone-100 mt-2">
                    <img src={s.photoUrl} alt={s.species} className="w-full h-full object-cover" />
                  </div>
                )}

                <div className="pt-2 border-t border-stone-100 text-[11px] text-stone-400 flex justify-between">
                  <span>Reported by: <strong>{s.observer}</strong></span>
                  <span className="font-mono">ID: {s.id}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
