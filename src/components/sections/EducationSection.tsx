import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { 
  BookOpen, 
  Footprints, 
  HelpCircle, 
  CheckCircle, 
  XCircle, 
  Sparkles, 
  ShieldCheck, 
  Award,
  RefreshCw,
  Eye
} from 'lucide-react';

export const EducationSection: React.FC = () => {
  const { education } = useData();

  const [activeQuizIndex, setActiveQuizIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({});
  const [showResults, setShowResults] = useState(false);

  // Pugmark interactive viewer state
  const [pugmarkGender, setPugmarkGender] = useState<'male' | 'female'>('male');

  const quizzes = education.filter(e => e.interactiveQuiz).map(e => e.interactiveQuiz!);

  const handleSelectOption = (quizIdx: number, optionIdx: number) => {
    setSelectedAnswers(prev => ({ ...prev, [quizIdx]: optionIdx }));
  };

  const calculateScore = () => {
    let score = 0;
    quizzes.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        score++;
      }
    });
    return score;
  };

  const resetQuiz = () => {
    setSelectedAnswers({});
    setShowResults(false);
    setActiveQuizIndex(0);
  };

  return (
    <div className="space-y-10 animate-fade-in pb-8">
      {/* Header Banner */}
      <div className="bg-[#0B3D2E] text-white rounded-3xl p-6 sm:p-10 border border-[#145A43] shadow-lg space-y-4">
        <div className="inline-flex items-center space-x-2 bg-[#07271D] border border-amber-500/40 rounded-full px-3 py-1 text-xs text-amber-300 font-mono">
          <BookOpen className="w-3.5 h-3.5 text-amber-400" />
          <span>Conservation Literacy & Field Knowledge</span>
        </div>

        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white">
          Conservation Education & Field Tracker Guide
        </h1>

        <p className="text-sm sm:text-base text-emerald-100/90 max-w-3xl leading-relaxed">
          Explore the science of pugmark interpretation, understand tiger biology, and test your knowledge of Terai ecology with interactive educational toolkits.
        </p>
      </div>

      {/* Interactive Pugmark Identification Tool */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-sm space-y-6">
        <div className="flex flex-wrap justify-between items-start gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 text-emerald-800 text-xs font-mono font-bold mb-1">
              <Footprints className="w-4 h-4 text-emerald-600" />
              <span>Interactive Tracker Tool</span>
            </div>
            <h2 className="font-display text-2xl font-bold text-stone-900">
              Pugmark Morphology: Male vs. Female Analysis
            </h2>
            <p className="text-xs text-stone-500 max-w-xl mt-1">
              Field rangers distinguish sex by measuring the ratio between Pugmark Length (PML) and Pugmark Breadth (PMB).
            </p>
          </div>

          <div className="flex bg-stone-100 p-1 rounded-xl border border-stone-200">
            <button
              onClick={() => setPugmarkGender('male')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                pugmarkGender === 'male'
                  ? 'bg-[#0B3D2E] text-amber-300 shadow'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Male Pugmark (Square Box)
            </button>
            <button
              onClick={() => setPugmarkGender('female')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                pugmarkGender === 'female'
                  ? 'bg-[#0B3D2E] text-amber-300 shadow'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Female Pugmark (Rectangular Box)
            </button>
          </div>
        </div>

        {/* Visual Comparison Box */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-stone-50 p-6 sm:p-8 rounded-3xl border border-stone-200">
          {/* Pugmark Graphic */}
          <div className="flex flex-col items-center justify-center p-6 bg-[#07271D] rounded-2xl text-white relative">
            <div className="w-56 h-56 relative flex items-center justify-center border-2 border-dashed border-amber-400/60 rounded-xl p-2">
              {/* Outer Bounding Box Guide */}
              <div className={`absolute border-2 ${
                pugmarkGender === 'male' ? 'w-48 h-48 border-amber-400' : 'w-36 h-48 border-emerald-400'
              } rounded-lg flex items-center justify-center`}>
                <span className="absolute -top-3 bg-amber-500 text-black font-mono text-[10px] font-bold px-2 rounded">
                  {pugmarkGender === 'male' ? '1:1 Square Ratio' : 'Narrow Rectangle Ratio'}
                </span>
              </div>

              {/* Pugmark Pad SVG Silhouette */}
              <div className="space-y-2 text-center z-10">
                <Footprints className={`w-32 h-32 mx-auto ${
                  pugmarkGender === 'male' ? 'text-amber-400' : 'text-emerald-400'
                } filter drop-shadow-md`} />
                <span className="font-mono text-xs font-bold block text-emerald-200">
                  {pugmarkGender === 'male' ? 'Male (Broad Pad, Round Toes)' : 'Female (Narrow Pad, Oval Toes)'}
                </span>
              </div>
            </div>
          </div>

          {/* Details & Diagnostic Rules */}
          <div className="space-y-4 text-xs sm:text-sm text-stone-700">
            <h3 className="font-display font-bold text-xl text-stone-900">
              {pugmarkGender === 'male' ? 'Male Tiger Track Diagnostics' : 'Female Tiger Track Diagnostics'}
            </h3>

            {pugmarkGender === 'male' ? (
              <ul className="space-y-2.5 list-disc list-inside bg-white p-4 rounded-2xl border border-stone-200">
                <li><strong>Geometric Contour:</strong> Fits nearly perfectly inside an equilateral <strong>square box</strong>.</li>
                <li><strong>Main Heel Pad:</strong> Wide, broad base with prominent lobes; bears heavier upper body mass.</li>
                <li><strong>Toe Alignment:</strong> Compact, rounded toe impressions arranged along a gentle circular arc.</li>
                <li><strong>Stride Distance:</strong> Normal walking stride ~85–95 cm; broad straddle.</li>
              </ul>
            ) : (
              <ul className="space-y-2.5 list-disc list-inside bg-white p-4 rounded-2xl border border-stone-200">
                <li><strong>Geometric Contour:</strong> Fits neatly inside a vertical <strong>rectangular box</strong>.</li>
                <li><strong>Main Heel Pad:</strong> Slender, elongated pad with tapered lobes.</li>
                <li><strong>Toe Alignment:</strong> More elongated, oval-shaped toes with slightly higher apex.</li>
                <li><strong>Stride Distance:</strong> Normal walking stride ~70–80 cm; narrower walking line.</li>
              </ul>
            )}

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 font-mono">
              💡 <strong>Biologist Tip:</strong> Claws are strictly retractile in felids; if claw punctures are visible, the track belongs to a Canid (wild dog / jackal) or sloth bear!
            </div>
          </div>
        </div>
      </div>

      {/* Educational Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {education.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <span className="bg-emerald-100 text-emerald-900 font-mono text-[11px] font-bold px-2.5 py-0.5 rounded-md">
                {item.category}
              </span>
              <h3 className="font-display font-bold text-lg text-stone-900 leading-snug">
                {item.title}
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                {item.summary}
              </p>
            </div>

            <div className="pt-3 border-t border-stone-100 space-y-2">
              <span className="text-[11px] font-bold text-stone-800 uppercase tracking-wider block">
                Key Takeaways:
              </span>
              <ul className="space-y-1 text-xs text-stone-600 list-disc list-inside">
                {item.keyTakeaways.map((takeaway, idx) => (
                  <li key={idx} className="line-clamp-2">{takeaway}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Conservation Quiz */}
      <div className="bg-[#07271D] text-white rounded-3xl p-6 sm:p-10 border border-emerald-800 shadow-xl space-y-6">
        <div className="flex flex-wrap justify-between items-center gap-4 border-b border-emerald-800/80 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-amber-500 rounded-xl text-black">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold text-white">
                VTR Conservation Knowledge Challenge
              </h2>
              <p className="text-xs text-amber-300 font-mono">
                Test your understanding of tiger ecology and reserve rules
              </p>
            </div>
          </div>

          <div className="text-xs font-mono text-emerald-300">
            {Object.keys(selectedAnswers).length} of {quizzes.length} Questions Answered
          </div>
        </div>

        {/* Quiz Items */}
        <div className="space-y-8">
          {quizzes.map((quiz, qIdx) => (
            <div key={qIdx} className="bg-[#0B3D2E] p-6 rounded-2xl border border-emerald-700/50 space-y-4">
              <div className="flex items-start space-x-3">
                <span className="font-mono text-sm font-bold text-amber-400 bg-[#07271D] w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0">
                  {qIdx + 1}
                </span>
                <h3 className="font-display font-semibold text-base sm:text-lg text-white">
                  {quiz.question}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {quiz.options.map((opt, optIdx) => {
                  const isSelected = selectedAnswers[qIdx] === optIdx;
                  const isCorrect = optIdx === quiz.correctIndex;

                  let btnStyle = 'bg-[#07271D] border-emerald-800/60 text-emerald-100 hover:border-amber-400';
                  if (showResults) {
                    if (isCorrect) {
                      btnStyle = 'bg-emerald-800 border-emerald-400 text-white font-bold';
                    } else if (isSelected && !isCorrect) {
                      btnStyle = 'bg-red-950 border-red-500 text-red-200';
                    }
                  } else if (isSelected) {
                    btnStyle = 'bg-[#145A43] border-amber-400 text-amber-300 font-bold';
                  }

                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(qIdx, optIdx)}
                      disabled={showResults}
                      className={`p-3.5 rounded-xl border text-xs text-left transition-all ${btnStyle}`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {showResults && (
                <div className="p-3.5 bg-[#07271D] rounded-xl border border-emerald-800 text-xs text-emerald-200 font-mono space-y-1">
                  <span className="font-bold text-amber-300 block">Explanation:</span>
                  <p>{quiz.explanation}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Quiz Actions */}
        <div className="pt-4 border-t border-emerald-800 flex flex-wrap justify-between items-center gap-4">
          {!showResults ? (
            <button
              onClick={() => setShowResults(true)}
              disabled={Object.keys(selectedAnswers).length === 0}
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold rounded-xl text-xs sm:text-sm shadow-lg transition-all disabled:opacity-50"
            >
              Submit & Check Answers
            </button>
          ) : (
            <div className="flex items-center space-x-4">
              <div className="bg-[#0B3D2E] px-4 py-2 rounded-xl border border-amber-500/40 text-amber-300 font-bold text-sm">
                Score: {calculateScore()} / {quizzes.length}
              </div>
              <button
                onClick={resetQuiz}
                className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Try Again</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
