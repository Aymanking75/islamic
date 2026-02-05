
import React, { useState } from 'react';
import { Sparkles, Download, RefreshCw, Wand2, Image as ImageIcon, MapPin, Landmark, History, Loader2, Info, Compass, ChevronLeft, Layers } from 'lucide-react';
import { generateIslamicImage } from '../services/geminiService.ts';

const ImageLab: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('أصيل');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const architecturalStyles = [
    { name: 'أصيل', desc: 'الطراز الجزائري التقليدي لولاية بسكرة' },
    { name: 'أندلسي', desc: 'زخارف هندسية وعقود أندلسية رقيقة' },
    { name: 'مرابطي', desc: 'عمارة قوية وبسيطة بروح تاريخية' },
    { name: 'ليلي', desc: 'إضاءة سحرية وهدوء روحاني' }
  ];

  const presets = [
    { name: 'المسجد في القرن الأول', prompt: 'Cinematic 7th century Sidi Okba mosque architecture, simple desert mud-brick and palm wood design, authentic early Islamic style, bright desert sunlight' },
    { name: 'زخارف الأبواب النادرة', prompt: 'Extremely detailed macro shot of ancient hand-carved Islamic wood patterns on a mosque door, Sidi Okba heritage, Zianid influence, Biskra' },
    { name: 'محراب العز والكرامة', prompt: 'Interior of Sidi Okba mosque showing the mihrab with golden lighting, traditional rugs, and intricate plaster calligraphy work' },
    { name: 'بسكرة من الأعلى', prompt: 'Aerial drone photography of the oasis city of Sidi Okba, Biskra, with the mosque minaret rising above the palm tree canopy' }
  ];

  const handleGenerate = async (customPrompt?: string) => {
    const activePrompt = customPrompt || prompt;
    if (!activePrompt.trim()) return;

    const fullPrompt = `${activePrompt}. Style: ${selectedStyle} architectural style. Cinematic lighting, photorealistic, 8k resolution, historical atmosphere.`;

    setIsGenerating(true);
    setError(null);
    try {
      const imageUrl = await generateIslamicImage(fullPrompt);
      if (imageUrl) {
        setGeneratedImage(imageUrl);
      } else {
        setError("لم نتمكن من توليد الصورة، يرجى المحاولة مرة أخرى.");
      }
    } catch (err) {
      setError("حدث خطأ أثناء الاتصال بمحرك الذكاء الاصطناعي. تأكد من تفعيل مفتاح الـ API.");
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = () => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `Sidi-Okba-Architectural-AI-${Date.now()}.png`;
    link.click();
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 page-fade-in pb-24">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#15803d]/10 border border-[#15803d]/20 text-[#15803d] text-xs font-bold mb-6">
          <Compass size={14} className="animate-spin-slow" /> مختبر الاستكشاف المعماري الرقمي
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">تخيّل <span className="text-[#15803d]">عمارة</span> سيدي عقبة</h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">أعد إحياء التاريخ عبر توليد صور فنية للعمارة الإسلامية العتيقة في بسكرة باستخدام أحدث تقنيات الذكاء الاصطناعي.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Left: Controls */}
        <div className="lg:col-span-5 space-y-10">
          <div className="bg-[#0a1f18] border border-[#102a22] rounded-[3rem] p-10 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#15803d]/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
            
            <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
              <Wand2 className="text-[#d4af37]" size={24} /> محرك التخيل التاريخي
            </h3>
            
            <div className="space-y-8">
              <div className="space-y-3">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mr-2">النمط المعماري</label>
                <div className="grid grid-cols-2 gap-3">
                  {architecturalStyles.map((style) => (
                    <button 
                      key={style.name}
                      onClick={() => setSelectedStyle(style.name)}
                      className={`p-4 rounded-2xl border text-right transition-all ${selectedStyle === style.name ? 'bg-[#15803d]/20 border-[#15803d] text-white shadow-lg shadow-[#15803d]/5' : 'bg-[#04100c] border-[#102a22] text-gray-400 hover:border-gray-700'}`}
                    >
                      <p className="font-bold text-sm mb-1">{style.name}</p>
                      <p className="text-[10px] opacity-60">{style.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mr-2">وصف المشهد</label>
                <textarea 
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="مثال: محراب مسجد سيدي عقبة بالنقوش الأندلسية تحت ضوء القمر..."
                  className="w-full bg-[#04100c] border border-[#102a22] rounded-3xl p-6 text-white text-md focus:outline-none focus:border-[#15803d] transition-all min-h-[140px] resize-none shadow-inner"
                />
              </div>
              
              <div className="space-y-3">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mr-2">أفكار سريعة للاستكشاف</label>
                <div className="flex flex-wrap gap-2">
                  {presets.map((p, i) => (
                    <button 
                      key={i}
                      onClick={() => { setPrompt(p.prompt); handleGenerate(p.prompt); }}
                      className="px-4 py-2 bg-[#15803d]/5 border border-[#15803d]/10 rounded-full text-xs text-gray-400 hover:text-white hover:bg-[#15803d]/20 transition-all flex items-center gap-2"
                    >
                      <Layers size={12} /> {p.name}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => handleGenerate()}
                disabled={isGenerating || (!prompt.trim() && !generatedImage)}
                className="w-full bg-[#15803d] text-white py-5 rounded-[2rem] font-extrabold shadow-2xl shadow-[#15803d]/30 hover:bg-[#166534] transition-all flex items-center justify-center gap-4 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="animate-spin" size={24} />
                    جاري استحضار المشهد...
                  </>
                ) : (
                  <>
                    <Sparkles size={24} className="group-hover:rotate-12 transition-transform" />
                    بدء التوليد البصري
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="bg-[#d4af37]/10 border border-[#d4af37]/20 p-8 rounded-[2.5rem] flex gap-6 items-start">
            <div className="w-12 h-12 bg-[#d4af37] rounded-full flex items-center justify-center shrink-0">
               <Info className="text-black" size={24} />
            </div>
            <div className="space-y-2">
              <h4 className="text-[#d4af37] font-bold">دليل الاستكشاف</h4>
              <p className="text-sm text-gray-400 leading-relaxed">
                هذا المختبر مخصص لمحاكاة العمارة الإسلامية لولاية بسكرة. كلما زاد تفصيل وصفك (الإضاءة، المواد، الزمان)، زادت دقة النتائج وجمالها الفني.
              </p>
            </div>
          </div>
        </div>

        {/* Right: Preview Area */}
        <div className="lg:col-span-7 flex flex-col">
          <div className="relative aspect-[4/5] md:aspect-video bg-[#0a1f18] rounded-[4rem] border border-[#102a22] overflow-hidden flex items-center justify-center shadow-[0_50px_100px_-30px_rgba(0,0,0,0.9)] group">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')] opacity-10"></div>
            
            {isGenerating ? (
              <div className="flex flex-col items-center gap-8 relative z-10">
                <div className="relative">
                  <div className="w-24 h-24 bg-[#15803d]/20 rounded-full animate-ping absolute"></div>
                  <div className="w-24 h-24 bg-[#15803d]/10 rounded-full flex items-center justify-center relative border border-[#15803d]/30">
                    <Compass className="text-[#15803d] animate-spin-slow" size={48} />
                  </div>
                </div>
                <div className="space-y-3 text-center">
                  <p className="text-white text-2xl font-bold">يرسم الذكاء الاصطناعي الآن</p>
                  <p className="text-gray-500 max-w-xs mx-auto">نقوم بمعالجة طبقات العمارة والضوء لنمنحك تجربة بصرية فريدة...</p>
                </div>
              </div>
            ) : generatedImage ? (
              <>
                <img src={generatedImage} className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-105" alt="AI Generated Architecture" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-12">
                  <div className="space-y-1">
                    <p className="text-[#15803d] font-bold text-sm uppercase">تخيل رقمي</p>
                    <h4 className="text-white text-2xl font-bold">تحفة معمارية لسيدي عقبة</h4>
                  </div>
                  <div className="flex gap-4">
                    <button 
                      onClick={downloadImage}
                      className="p-5 bg-white text-black rounded-3xl hover:scale-110 transition-all shadow-2xl active:scale-95"
                      title="حفظ الصورة"
                    >
                      <Download size={28} />
                    </button>
                    <button 
                      onClick={() => handleGenerate()}
                      className="p-5 bg-[#15803d] text-white rounded-3xl hover:scale-110 transition-all shadow-2xl active:scale-95"
                      title="تحديث التوليد"
                    >
                      <RefreshCw size={28} />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center gap-8 text-gray-700 relative z-10">
                <div className="w-32 h-32 bg-white/5 rounded-[3rem] flex items-center justify-center border border-white/5">
                  <ImageIcon size={64} strokeWidth={1} />
                </div>
                <div className="text-center space-y-2">
                  <p className="text-white font-bold text-xl">منصة الاستكشاف البصري</p>
                  <p className="text-sm">ابدأ بوصف مشهد معماري ليقوم الذكاء الاصطناعي بتجسيده</p>
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="mt-8 p-6 bg-red-500/10 border border-red-500/20 text-red-500 rounded-[2rem] flex items-center gap-4 animate-in slide-in-from-bottom-4 duration-500">
               <Info size={24} />
               <p className="font-bold">{error}</p>
            </div>
          )}

          {generatedImage && (
            <div className="mt-12 p-8 bg-[#0a1f18] border border-[#102a22] rounded-[3rem] grid grid-cols-2 md:grid-cols-4 gap-8">
               <div className="space-y-1">
                  <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">المكان</p>
                  <p className="text-white font-bold flex items-center gap-2"><MapPin size={14} className="text-[#15803d]" /> بسكرة، الجزائر</p>
               </div>
               <div className="space-y-1">
                  <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">النمط</p>
                  <p className="text-white font-bold flex items-center gap-2"><Landmark size={14} className="text-[#15803d]" /> {selectedStyle}</p>
               </div>
               <div className="space-y-1">
                  <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">المحرك</p>
                  <p className="text-white font-bold flex items-center gap-2"><Sparkles size={14} className="text-[#15803d]" /> Gemini 2.5</p>
               </div>
               <div className="space-y-1">
                  <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">الحالة</p>
                  <p className="text-[#d4af37] font-bold flex items-center gap-2"><History size={14} /> مؤرشف رقمياً</p>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageLab;
