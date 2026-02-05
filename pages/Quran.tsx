
import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Volume2, 
  Bookmark, 
  Share2, 
  Download, 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Repeat, 
  Shuffle, 
  Sparkles, 
  Headphones,
  Settings2,
  AlertCircle,
  ChevronDown,
  Keyboard,
  BookOpen,
  Music,
  User,
  X,
  Check
} from 'lucide-react';
import { getAyahInsight } from '../services/geminiService.ts';
import { Surah } from '../types.ts';

const RECITERS = [
  { id: 'alafasy', name: 'مشاري العفاسي', slug: 'Alafasy_128kbps', desc: 'تلاوة عطرة برواية حفص' },
  { id: 'sudais', name: 'عبد الرحمن السديس', slug: 'Abdurrahmaan_As-Sudais_192kbps', desc: 'إمام الحرم المكي الشريف' },
  { id: 'shuraim', name: 'سعود الشريم', slug: 'Saood_ash-Shuraym_128kbps', desc: 'تلاوة خاشعة مميزة' },
  { id: 'hussary', name: 'محمود خليل الحصري', slug: 'Hussary_128kbps', desc: 'شيخ المقارئ المصرية' },
  { id: 'muaiqly', name: 'ماهر المعيقلي', slug: 'Maher_AlMuaiqly_64kbps', desc: 'تلاوة هادئة ومؤثرة' },
  { id: 'minshawi', name: 'محمد صديق المنشاوي', slug: 'Minshawi_Murattal_128kbps', desc: 'عملاق التلاوة المرتلة' },
  { id: 'abdulbasit', name: 'عبد الباسط (مرتل)', slug: 'Abdul_Basit_Murattal_64kbps', desc: 'صوت مكة الخالد' },
  { id: 'dussary', name: 'ياسر الدوسري', slug: 'Yasser_Ad-Dussary_128kbps', desc: 'تلاوة نجدية رائعة' },
  { id: 'ajmy', name: 'أحمد العجمي', slug: 'Ahmed_ibn_Ali_al-Ajamy_128kbps', desc: 'تلاوة قوية ومتميزة' },
  { id: 'abkar', name: 'إدريس أبكر', slug: 'Idrees_Abkar_128kbps', desc: 'تلاوة روحانية عميقة' },
  { id: 'ghamadi', name: 'سعد الغامدي', slug: 'Ghamadi_64kbps', desc: 'تلاوة متقنة ومنتشرة' }
];

interface AyahData {
  number: number;
  text: string;
  numberInSurah: number;
}

const Quran: React.FC = () => {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [activeSurah, setActiveSurah] = useState<Surah | null>(null);
  const [ayahs, setAyahs] = useState<AyahData[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedAyah, setSelectedAyah] = useState<number>(1);
  const [activeTafseer, setActiveTafseer] = useState<'asSadi' | 'ibnKathir'>('asSadi');
  const [aiInsight, setAiInsight] = useState<string>('');
  const [isLoadingInsight, setIsLoadingInsight] = useState(false);
  const [currentReciter, setCurrentReciter] = useState(RECITERS[0]);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [audioError, setAudioError] = useState<string | null>(null);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [isLoadingSurah, setIsLoadingSurah] = useState(false);
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);
  const [showReciterModal, setShowReciterModal] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ayahRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  // Fetch initial list of Surahs
  useEffect(() => {
    const fetchSurahs = async () => {
      try {
        const response = await fetch('https://api.alquran.cloud/v1/surah');
        const data = await response.json();
        if (data.code === 200) {
          setSurahs(data.data);
          selectSurah(data.data[0]); // Start with Al-Fatihah
        }
      } catch (error) {
        console.error("Failed to fetch surahs", error);
        setAudioError("تعذر تحميل قائمة السور. تحقق من اتصالك.");
      }
    };
    fetchSurahs();
  }, []);

  // Fetch Ayahs when active Surah changes
  const selectSurah = async (surah: Surah) => {
    setIsLoadingSurah(true);
    setActiveSurah(surah);
    setSelectedAyah(1);
    setAudioError(null);
    try {
      const response = await fetch(`https://api.alquran.cloud/v1/surah/${surah.number}`);
      const data = await response.json();
      if (data.code === 200) {
        setAyahs(data.data.ayahs);
      }
    } catch (error) {
      console.error("Failed to fetch ayahs", error);
      setAudioError("خطأ في تحميل نص السورة.");
    } finally {
      setIsLoadingSurah(false);
    }
  };

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        nextAyah();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        prevAyah();
      } else if (e.code === 'ArrowDown') {
        e.preventDefault();
        const nextS = surahs.find(s => s.number === (activeSurah?.number || 0) + 1);
        if (nextS) selectSurah(nextS);
      } else if (e.code === 'ArrowUp') {
        e.preventDefault();
        const prevS = surahs.find(s => s.number === (activeSurah?.number || 0) - 1);
        if (prevS) selectSurah(prevS);
      } else if (e.code === 'KeyK') {
        setShowShortcutsHelp(prev => !prev);
      } else if (e.code === 'KeyR') {
        setShowReciterModal(prev => !prev);
      } else if (e.key >= '1' && e.key <= '9') {
        const index = parseInt(e.key) - 1;
        if (RECITERS[index]) {
          setCurrentReciter(RECITERS[index]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeSurah, selectedAyah, isPlaying, surahs]);

  // Audio Source Logic
  useEffect(() => {
    if (activeSurah) {
      handleLoadInsight();
      setAudioError(null);
      
      const surahNum = activeSurah.number.toString().padStart(3, '0');
      const ayahNum = selectedAyah.toString().padStart(3, '0');
      const newSrc = `https://everyayah.com/data/${currentReciter.slug}/${surahNum}${ayahNum}.mp3`;
      
      if (audioRef.current) {
        setIsAudioLoading(true);
        audioRef.current.src = newSrc;
        audioRef.current.load();
        
        if (isPlaying) {
          audioRef.current.play().catch(() => setIsPlaying(false));
        }
      }

      // Scroll selected ayah into view
      const activeEl = ayahRefs.current[selectedAyah];
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [activeSurah?.number, selectedAyah, currentReciter.id]);

  const handleLoadInsight = async () => {
    if (!activeSurah || ayahs.length === 0) return;
    setIsLoadingInsight(true);
    const currentText = ayahs.find(a => a.numberInSurah === selectedAyah)?.text || "";
    const context = `سورة ${activeSurah.name} آية ${selectedAyah}`;
    const insight = await getAyahInsight(currentText, context);
    setAiInsight(insight);
    setIsLoadingInsight(false);
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          setAudioError("خطأ في التشغيل. جرب قارئاً آخر.");
          setIsPlaying(false);
        });
    }
  };

  const nextAyah = () => {
    if (activeSurah) {
      if (selectedAyah < activeSurah.numberOfAyahs) {
        setSelectedAyah(prev => prev + 1);
      } else if (activeSurah.number < 114) {
        const nextS = surahs.find(s => s.number === activeSurah.number + 1);
        if (nextS) selectSurah(nextS);
      } else {
        setIsPlaying(false); // End of Quran
      }
    }
  };

  const prevAyah = () => {
    if (selectedAyah > 1) {
      setSelectedAyah(prev => prev - 1);
    } else if (activeSurah && activeSurah.number > 1) {
      const prevS = surahs.find(s => s.number === activeSurah.number - 1);
      if (prevS) {
        setActiveSurah(prevS);
        setSelectedAyah(prevS.numberOfAyahs);
      }
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  const filteredSurahs = surahs.filter(s => 
    s.name.includes(searchQuery) || 
    s.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.number.toString() === searchQuery
  );

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden bg-[#04100c] relative">
      <audio 
        ref={audioRef} 
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => {
          setDuration(e.currentTarget.duration);
          setIsAudioLoading(false);
        }}
        onEnded={nextAyah}
        onError={() => {
          setAudioError("الملف الصوتي غير متوفر لهذه الآية حالياً.");
          setIsPlaying(false);
          setIsAudioLoading(false);
        }}
      />

      {/* Reciter Selector Modal */}
      {showReciterModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[110] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-[#061410] border border-[#102a22] rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl relative">
            <div className="p-8 border-b border-[#102a22] flex items-center justify-between bg-[#0a1f18]">
              <div>
                <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                  <Headphones className="text-[#15803d]" size={28} /> قائمة أصوات القراء
                </h3>
                <p className="text-sm text-gray-500 mt-1">اختر صوتك المفضل للاستماع للتلاوة العطرة</p>
              </div>
              <button 
                onClick={() => setShowReciterModal(false)} 
                className="w-12 h-12 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-all"
              >
                <X size={28} />
              </button>
            </div>

            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-4 overflow-auto max-h-[60vh] custom-scrollbar">
              {RECITERS.map((r) => (
                <button 
                  key={r.id}
                  onClick={() => {
                    setCurrentReciter(r);
                    setShowReciterModal(false);
                  }}
                  className={`flex items-center gap-4 p-4 rounded-2xl border transition-all text-right group ${
                    currentReciter.id === r.id 
                    ? 'bg-[#15803d]/20 border-[#15803d] shadow-lg shadow-[#15803d]/5' 
                    : 'bg-[#0a1f18] border-transparent hover:border-[#102a22] hover:bg-[#102a22]'
                  }`}
                >
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 border transition-colors ${
                    currentReciter.id === r.id ? 'bg-[#15803d] border-white/20' : 'bg-gray-800 border-transparent group-hover:bg-gray-700'
                  }`}>
                    <User size={24} className="text-white opacity-80" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className={`font-bold transition-colors ${currentReciter.id === r.id ? 'text-white' : 'text-gray-300'}`}>{r.name}</h4>
                      {currentReciter.id === r.id && <Check size={18} className="text-[#15803d]" />}
                    </div>
                    <p className="text-[10px] text-gray-500 mt-1">{r.desc}</p>
                  </div>
                </button>
              ))}
            </div>

            <div className="p-6 bg-[#0a1f18] border-t border-[#102a22] flex justify-center">
              <p className="text-xs text-gray-600 flex items-center gap-2">
                <Music size={12} /> يمكنك أيضاً استخدام الأرقام 1-9 للتبديل السريع
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Shortcuts Help Modal */}
      {showShortcutsHelp && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-6" onClick={() => setShowShortcutsHelp(false)}>
          <div className="bg-[#061410] border border-[#102a22] rounded-[2rem] p-8 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Keyboard className="text-[#15803d]" /> اختصارات لوحة المفاتيح
            </h3>
            <div className="space-y-4 text-gray-300">
              <div className="flex justify-between items-center bg-[#0a1f18] p-3 rounded-xl border border-[#102a22]">
                <span>تشغيل / إيقاف مؤقت</span>
                <kbd className="bg-gray-800 px-2 py-1 rounded text-xs text-white">Space</kbd>
              </div>
              <div className="flex justify-between items-center bg-[#0a1f18] p-3 rounded-xl border border-[#102a22]">
                <span>الآية التالية</span>
                <kbd className="bg-gray-800 px-2 py-1 rounded text-xs text-white">←</kbd>
              </div>
              <div className="flex justify-between items-center bg-[#0a1f18] p-3 rounded-xl border border-[#102a22]">
                <span>الآية السابقة</span>
                <kbd className="bg-gray-800 px-2 py-1 rounded text-xs text-white">→</kbd>
              </div>
              <div className="flex justify-between items-center bg-[#0a1f18] p-3 rounded-xl border border-[#102a22]">
                <span>فتح قائمة القراء</span>
                <kbd className="bg-gray-800 px-2 py-1 rounded text-xs text-white">R</kbd>
              </div>
              <div className="flex justify-between items-center bg-[#0a1f18] p-3 rounded-xl border border-[#102a22]">
                <span>تغيير القارئ سريعاً</span>
                <kbd className="bg-gray-800 px-2 py-1 rounded text-xs text-white">1 - 9</kbd>
              </div>
            </div>
            <button onClick={() => setShowShortcutsHelp(false)} className="w-full mt-8 bg-[#15803d] text-white py-3 rounded-xl font-bold transition-transform hover:scale-105 active:scale-95">إغلاق</button>
          </div>
        </div>
      )}
      
      <div className="flex flex-1 overflow-hidden">
        {/* Tafseer Panel */}
        <aside className="w-96 border-l border-[#102a22] flex flex-col bg-[#061410] overflow-hidden hidden xl:flex">
          <div className="p-6 border-b border-[#102a22] flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <BookOpen size={20} className="text-[#15803d]" /> التفسير والتدبر
            </h2>
            <button onClick={() => setShowShortcutsHelp(true)} className="p-2 text-gray-500 hover:text-white transition-colors" title="اختصارات لوحة المفاتيح">
              <Keyboard size={20} />
            </button>
          </div>

          <div className="p-4 flex gap-2">
            {['asSadi', 'ibnKathir'].map((t) => (
              <button 
                key={t}
                onClick={() => setActiveTafseer(t as any)}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeTafseer === t ? 'bg-[#15803d] text-white' : 'bg-[#0a1f18] text-gray-400'}`}
              >
                {t === 'asSadi' ? 'السعدي' : 'ابن كثير'}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-auto p-6 space-y-6">
            <div className="bg-[#0a1f18] p-4 rounded-xl border border-[#102a22]">
              <span className="text-[#15803d] text-xs font-bold block mb-2">تفسير الآية {selectedAyah}</span>
              <p className="text-gray-300 text-sm leading-relaxed text-right">
                {activeTafseer === 'asSadi' 
                  ? "يُعد تفسير السعدي من أيسر التفاسير وأكثرها تركيزاً على الجوانب التربوية والإيمانية في النص القرآني..." 
                  : "تفسير ابن كثير هو عمدة التفاسير بالمأثور، حيث يفسر القرآن بالقرآن ثم بالسنة ثم بأقوال الصحابة..."}
              </p>
            </div>

            <div className="bg-gradient-to-br from-[#102a22] to-[#0a1f18] p-6 rounded-2xl border border-[#15803d]/30 relative group overflow-hidden">
              <div className="absolute top-0 left-0 w-16 h-16 bg-[#15803d]/5 rounded-full -ml-8 -mt-8 blur-xl"></div>
              <span className="text-white text-xs font-bold mb-4 flex items-center gap-2 relative z-10">
                إشراقة ذكية <Sparkles size={14} className="text-[#d4af37]" />
              </span>
              <p className="text-gray-300 text-sm italic leading-relaxed text-right relative z-10">
                {isLoadingInsight ? "جاري استحضار الفوائد..." : aiInsight}
              </p>
            </div>
          </div>
        </aside>

        {/* Main Reading Area (The Mushaf) */}
        <main className="flex-1 bg-[#04100c] p-4 md:p-12 overflow-auto flex flex-col items-center custom-scrollbar">
          <div className="max-w-4xl w-full bg-[#fdfdfd] rounded-[2rem] shadow-2xl p-8 md:p-16 border-[10px] border-[#102a22] relative min-h-full">
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')]"></div>
            
            {/* Surah Header */}
            <div className="flex flex-col items-center mb-12 text-[#064e3b]">
              <h1 className="font-quran text-6xl md:text-8xl mb-4 transition-transform hover:scale-105 duration-700">سورة {activeSurah?.name}</h1>
              <div className="flex items-center gap-4 text-xs font-bold opacity-60">
                <span>{activeSurah?.revelationType === 'Meccan' ? 'مكية' : 'مدنية'}</span>
                <span className="w-1 h-1 bg-current rounded-full"></span>
                <span>{activeSurah?.numberOfAyahs} آية</span>
              </div>
              <div className="mt-8 h-px w-full max-w-xs bg-gradient-to-r from-transparent via-[#15803d]/30 to-transparent"></div>
            </div>

            {/* Bismillah */}
            {activeSurah?.number !== 1 && activeSurah?.number !== 9 && (
              <div className="text-center font-quran text-4xl text-[#15803d] mb-12 opacity-90">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>
            )}

            {/* Ayah Rendering */}
            {isLoadingSurah ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="w-12 h-12 border-4 border-[#15803d] border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-400 font-bold">جاري تحميل السورة...</p>
              </div>
            ) : (
              <div className="flex flex-wrap justify-center gap-y-10 gap-x-3 leading-[2.8] text-right">
                {ayahs.map((ayah) => (
                  <div 
                    key={ayah.number}
                    ref={el => ayahRefs.current[ayah.numberInSurah] = el}
                    onClick={() => {
                      setSelectedAyah(ayah.numberInSurah);
                      if (!isPlaying) togglePlay();
                    }}
                    className={`inline-block p-2 rounded-2xl cursor-pointer transition-all duration-500 relative group ${
                      selectedAyah === ayah.numberInSurah 
                        ? 'bg-[#15803d]/10 ring-2 ring-[#15803d]/20 scale-[1.05] shadow-lg' 
                        : 'hover:bg-gray-100 hover:scale-[1.02]'
                    }`}
                  >
                    <span className="font-quran text-3xl md:text-5xl text-gray-800 tracking-wide">
                      {ayah.text}
                    </span>
                    <span className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-[#15803d]/30 text-[#15803d] text-sm font-bold mx-3 align-middle bg-white shadow-sm ring-4 ring-transparent group-hover:ring-[#15803d]/5 transition-all">
                      {ayah.numberInSurah}
                    </span>
                    {selectedAyah === ayah.numberInSurah && isPlaying && (
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#15803d] text-white text-[9px] px-3 py-1 rounded-full animate-bounce shadow-lg flex items-center gap-1">
                        <Music size={10} /> تلاوة
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>

        {/* Reciters & Surah Sidebar */}
        <aside className="w-80 border-r border-[#102a22] flex flex-col bg-[#061410] hidden lg:flex">
          <div className="p-6 space-y-6 h-full flex flex-col overflow-hidden">
            {/* Search */}
            <div className="relative">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث برقم السورة أو اسمها..."
                className="w-full bg-[#0a1f18] border border-[#102a22] rounded-xl py-3 pr-10 pl-4 text-sm focus:outline-none focus:border-[#15803d] text-white transition-all shadow-inner"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            </div>

            {/* Reciter Mini Switcher */}
            <div className="space-y-3 shrink-0">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-[#15803d] uppercase tracking-widest flex items-center gap-2">
                  <Headphones size={14} /> القراء
                </h3>
                <button 
                  onClick={() => setShowReciterModal(true)}
                  className="text-[10px] text-gray-500 hover:text-white transition-colors"
                >
                  عرض الكل
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2 overflow-auto max-h-48 scrollbar-thin">
                {RECITERS.slice(0, 6).map((r, idx) => (
                  <button 
                    key={r.id}
                    onClick={() => setCurrentReciter(r)}
                    title={`اختصار: ${idx + 1}`}
                    className={`px-2 py-2.5 rounded-xl text-[9px] font-bold transition-all border text-center ${currentReciter.id === r.id ? 'bg-[#15803d] text-white border-[#15803d] shadow-lg shadow-[#15803d]/20' : 'bg-[#0a1f18] text-gray-500 border-transparent hover:border-gray-700 hover:text-gray-300'}`}
                  >
                    {r.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Surah List */}
            <div className="flex-1 overflow-auto space-y-1 scrollbar-thin">
              <h3 className="text-[10px] font-bold text-gray-600 mb-2 sticky top-0 bg-[#061410] py-1 z-10">فهرس السور</h3>
              {filteredSurahs.map((s) => (
                <div 
                  key={s.number}
                  onClick={() => selectSurah(s)}
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${activeSurah?.number === s.number ? 'bg-[#15803d]/20 ring-1 ring-[#15803d]/50' : 'hover:bg-[#102a22]'}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-[#0a1f18] flex items-center justify-center text-[10px] font-bold text-[#15803d] border border-[#102a22]">
                      {s.number}
                    </span>
                    <div className="text-right">
                      <p className="text-sm font-bold text-white leading-none mb-1">{s.name}</p>
                      <p className="text-[9px] text-gray-500">{s.englishName}</p>
                    </div>
                  </div>
                  <BookOpen size={14} className={activeSurah?.number === s.number ? 'text-[#15803d]' : 'text-gray-700'} />
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* Audio Player Control Bar */}
      <div className="h-28 bg-[#061410] border-t border-[#102a22] flex items-center px-8 z-50 shadow-2xl relative">
        <div className="flex items-center gap-4 w-1/4">
          <div className="w-14 h-14 bg-[#15803d]/10 rounded-2xl flex items-center justify-center relative border border-[#15803d]/20 group overflow-hidden cursor-pointer" onClick={() => setShowReciterModal(true)}>
             <Volume2 size={24} className="text-[#15803d] group-hover:scale-110 transition-transform" />
             {isAudioLoading && (
               <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center backdrop-blur-[1px]">
                 <div className="w-7 h-7 border-2 border-[#15803d] border-t-transparent rounded-full animate-spin"></div>
               </div>
             )}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-white truncate group-hover:text-[#15803d] transition-colors cursor-pointer" onClick={() => setShowReciterModal(true)}>
              {currentReciter.name}
            </p>
            <p className="text-[10px] text-gray-500 truncate flex items-center gap-1">سورة {activeSurah?.name} <span className="opacity-30">•</span> الآية {selectedAyah}</p>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center gap-2">
          {audioError && <div className="text-red-500 text-[10px] font-bold flex items-center gap-1 animate-pulse mb-1"><AlertCircle size={12} /> {audioError}</div>}
          <div className="flex items-center gap-10">
            <SkipBack 
              size={24} 
              className="text-gray-400 hover:text-[#15803d] cursor-pointer transition-all hover:scale-110 active:scale-90" 
              onClick={prevAyah} 
              title="الآية السابقة" 
            />
            <button 
              onClick={togglePlay}
              disabled={isAudioLoading}
              className={`w-16 h-16 bg-[#15803d] text-white rounded-2xl flex items-center justify-center hover:scale-105 transition-all shadow-2xl shadow-[#15803d]/30 active:scale-95 ${isAudioLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isPlaying ? <Pause size={32} className="fill-current" /> : <Play size={32} className="fill-current ml-1" />}
            </button>
            <SkipForward 
              size={24} 
              className="text-gray-400 hover:text-[#15803d] cursor-pointer transition-all hover:scale-110 active:scale-90" 
              onClick={nextAyah} 
              title="الآية التالية" 
            />
          </div>
          <div className="w-full max-w-xl flex items-center gap-4">
            <span className="text-[10px] font-bold text-gray-500 w-10 text-right">{formatTime(currentTime)}</span>
            <div 
              className="flex-1 h-2 bg-[#0a1f18] rounded-full overflow-hidden cursor-pointer relative group"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                if (audioRef.current) audioRef.current.currentTime = (x / rect.width) * duration;
              }}
            >
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="h-full bg-gradient-to-r from-[#15803d] to-[#22c55e] transition-all relative" style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg border-2 border-[#15803d] opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            </div>
            <span className="text-[10px] font-bold text-gray-500 w-10">{formatTime(duration)}</span>
          </div>
        </div>

        <div className="w-1/4 flex justify-end gap-5">
          <button 
            onClick={() => setShowReciterModal(true)}
            className="p-3 bg-[#15803d]/10 text-[#15803d] rounded-xl flex items-center gap-2 text-xs font-bold hover:bg-[#15803d] hover:text-white transition-all group"
          >
            <Headphones size={18} className="group-hover:rotate-12 transition-transform" />
            تغيير القارئ
          </button>
          <button className="p-2 text-gray-500 hover:text-white transition-colors hover:scale-110" title="مشاركة الآية"><Share2 size={22} /></button>
          <button className="p-2 text-gray-500 hover:text-white transition-colors hover:scale-110" title="تحميل التلاوة"><Download size={22} /></button>
        </div>
      </div>
    </div>
  );
};

export default Quran;
