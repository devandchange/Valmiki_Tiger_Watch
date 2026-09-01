import React, { useState } from 'react';
import { AUTHENTIC_LOCAL_CUISINE } from '../../data/tigerWorldwideData';
import { useLanguage } from '../../context/LanguageContext';
import { Utensils, Award, Info, Sparkles, MapPin, CheckCircle2, Flame, Heart } from 'lucide-react';

export const LocalCuisineSection: React.FC = () => {
  const { language } = useLanguage();
  const [activeFilter, setActiveFilter] = useState<'all' | 'traditional_heritage' | 'staple_dish' | 'beverage' | 'festive_delicacy'>('all');

  const filteredCuisine = AUTHENTIC_LOCAL_CUISINE.filter(item => {
    if (activeFilter === 'all') return true;
    return item.type === activeFilter;
  });

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Editorial Header */}
      <section className="bg-[#0B3D2E] text-white rounded-3xl p-6 sm:p-10 border border-[#145A43] shadow-lg space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-1.5 bg-[#07271D] border border-amber-500/40 rounded-full px-3.5 py-1 text-xs text-amber-300 font-mono font-bold">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>
              {language === 'hi' ? 'चंपारण एवं वाल्मीकि पारंपरिक पाक कला धरोहर' : language === 'ur' ? 'روایتی چمپارن پکوان' : 'Champaran & Valmiki Culinary Heritage'}
            </span>
          </div>
          <span className="text-emerald-300/60 text-xs font-mono hidden sm:inline">•</span>
          <span className="text-emerald-200/80 text-xs font-mono">
            {language === 'hi' ? 'प्रामाणिक पारंपरिक व्यंजन • मिट्टी के बर्तन (अहुना)' : language === 'ur' ? 'مستند روایتی کھانے' : 'Authentic Traditional Delicacies • Slow Clay Cooking'}
          </span>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
          🍲 {language === 'hi' ? 'स्थानीय चंपारण व्यंजन एवं खान-पान' : language === 'ur' ? 'مقامی چمپارن اور تھارو پکوان' : 'Authentic Local Cuisine & Traditional Foods'}
        </h1>

        <p className="text-sm sm:text-base text-emerald-100/90 max-w-3xl leading-relaxed">
          {language === 'hi'
            ? 'पश्चिम चंपारण के प्राचीन गांवों, गंडक नदी तटों और थारू जनजातीय बस्तियों की समृद्ध पाक परंपराएं। विश्व प्रसिद्ध चंपारण हांडी मटन (अहुना), पारंपरिक लिट्टी चोखा, सत्तू, ठेकुआ और गंडक की ताजी नदी मछली।'
            : language === 'ur'
            ? 'مغربی چمپارن اور گنڈک کے روایتی کھانے، مشہور ہانڈی مٹن، لٹی چوکھا، ستو اور ٹھیکوا۔'
            : 'Explore the authentic culinary traditions of West Champaran and the Tharu forest hamlets. From slow-cooked earthen-pot Ahuna Mutton to wood-fired Litti Chokha, natural Sattu coolers, and sacred festive delicacies.'}
        </p>

        {/* Disclaimer separating culinary heritage from commercial restaurants */}
        <div className="bg-[#07271D]/90 border border-amber-500/30 rounded-2xl p-4 text-xs text-amber-200/90 flex items-start gap-3">
          <Info className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed text-[11px] sm:text-xs">
            <strong>Authentic Heritage Notice:</strong> This section documents the cultural culinary traditions and time-tested recipes native to West Champaran and Valmikinagar. We do not endorse individual private restaurants or commercial vendors.
          </p>
        </div>
      </section>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'all', label: 'All Delicacies' },
          { id: 'traditional_heritage', label: 'Heritage Clay Specialties' },
          { id: 'staple_dish', label: 'Staple Dishes' },
          { id: 'beverage', label: 'Traditional Superfoods / Beverages' },
          { id: 'festive_delicacy', label: 'Sacred Festive Sweets' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all ${
              activeFilter === tab.id
                ? 'bg-[#0B3D2E] text-amber-300 shadow'
                : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Cuisine Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCuisine.map((dish) => (
          <div
            key={dish.id}
            className="bg-white rounded-3xl overflow-hidden border border-[#0B3D2E]/15 shadow-sm flex flex-col justify-between hover:border-[#0B3D2E] transition-all"
          >
            <div>
              <div className="relative aspect-[16/10] bg-stone-100 overflow-hidden">
                <img
                  src={dish.photoUrl}
                  alt={dish.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-3 left-3 bg-[#0B3D2E] text-amber-300 text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg uppercase">
                  {dish.origin}
                </div>
              </div>

              <div className="p-6 space-y-3">
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#0B3D2E]">
                    {dish.name}
                  </h3>
                  <div className="text-xs text-stone-500 font-mono mt-0.5">
                    {language === 'hi' ? dish.localNameHindi : language === 'ur' ? dish.localNameUrdu : dish.localNameHindi}
                  </div>
                </div>

                <p className="text-xs text-stone-700 leading-relaxed">
                  {dish.description}
                </p>

                <div className="p-3 bg-[#F5F1E6] rounded-xl text-[11px] text-stone-800 space-y-1">
                  <span className="font-bold text-[#0B3D2E] block">Authenticity & Preparation:</span>
                  <p>{dish.authenticityDetails}</p>
                </div>
              </div>
            </div>

            <div className="p-6 pt-0">
              <div className="pt-3 border-t border-stone-100 text-[11px] font-mono text-stone-500 flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-[#F27D26]" />
                <span>{dish.culturalNote}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
