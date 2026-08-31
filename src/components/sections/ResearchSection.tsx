import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { ResearchReport } from '../../types';
import { 
  BookOpen, 
  FileText, 
  Download, 
  CheckCircle, 
  Search, 
  Filter, 
  ExternalLink,
  Award,
  Calendar
} from 'lucide-react';

export const ResearchSection: React.FC = () => {
  const { research } = useData();

  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReport, setSelectedReport] = useState<ResearchReport | null>(null);

  const categories = ['all', 'Tiger Population', 'Biodiversity & Flora', 'Transboundary Ecology'];

  const filteredReports = research.filter(r => {
    const matchesSearch = 
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.authors.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.abstract.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCat = selectedCat === 'all' || r.category === selectedCat;

    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-8 animate-fade-in pb-8">
      {/* Header Banner */}
      <div className="bg-[#0B3D2E] text-white rounded-3xl p-6 sm:p-10 border border-[#145A43] shadow-lg space-y-4">
        <div className="inline-flex items-center space-x-2 bg-[#07271D] border border-amber-500/40 rounded-full px-3 py-1 text-xs text-amber-300 font-mono">
          <BookOpen className="w-3.5 h-3.5 text-amber-400" />
          <span>Peer-Reviewed Science & Census Documentation</span>
        </div>

        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white">
          Scientific Research & NTCA Technical Reports
        </h1>

        <p className="text-sm sm:text-base text-emerald-100/90 max-w-3xl leading-relaxed">
          Conservation must be rooted in rigorous empirical science. Explore key ecological assessments, DNA lineage studies, camera-trap protocols, and habitat suitability papers on Valmiki Tiger Reserve.
        </p>
      </div>

      {/* Filter & Search */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search papers, authors, or topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0B3D2E]"
          />
        </div>

        <div className="flex items-center space-x-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCat === cat
                  ? 'bg-[#0B3D2E] text-white shadow-sm'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {cat === 'all' ? 'All Publications' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Reports List */}
      <div className="space-y-6">
        {filteredReports.map((report) => (
          <div
            key={report.id}
            className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-4 hover:border-[#0B3D2E] transition-colors"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                <span className="bg-emerald-100 text-emerald-900 font-mono text-[11px] font-bold px-2.5 py-0.5 rounded-md border border-emerald-300">
                  {report.category}
                </span>
                <span className="font-mono text-xs text-stone-500 flex items-center">
                  <Calendar className="w-3.5 h-3.5 mr-1" />
                  {report.year}
                </span>
              </div>
              <span className="text-emerald-700 font-semibold text-xs flex items-center">
                <CheckCircle className="w-3.5 h-3.5 mr-1" />
                Verified Technical Study
              </span>
            </div>

            <h2 className="font-display font-bold text-xl sm:text-2xl text-stone-900 leading-snug">
              {report.title}
            </h2>

            <p className="text-xs sm:text-sm text-stone-500 font-mono">
              <strong>Authors / Institution:</strong> {report.authors} — <em>{report.organization}</em>
            </p>

            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-xs sm:text-sm text-stone-700 leading-relaxed">
              <strong className="text-stone-900 block mb-1">Scientific Abstract:</strong>
              {report.abstract}
            </div>

            <div className="space-y-2">
              <span className="font-bold text-stone-900 text-xs uppercase tracking-wider block">
                Key Ecological Findings:
              </span>
              <ul className="space-y-1 text-xs text-stone-700 list-disc list-inside bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100">
                {report.keyFindings.map((finding, idx) => (
                  <li key={idx} className="leading-relaxed">{finding}</li>
                ))}
              </ul>
            </div>

            <div className="pt-3 border-t border-stone-100 flex flex-wrap justify-between items-center text-xs text-stone-500 gap-2">
              <span className="italic font-serif">
                Citation: {report.citation}
              </span>
              <button
                onClick={() => alert(`Citation Copied:\n\n${report.citation}`)}
                className="px-3.5 py-1.5 bg-[#0B3D2E] hover:bg-emerald-900 text-white rounded-lg font-medium text-xs flex items-center space-x-1.5 transition-colors"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Cite Paper</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
