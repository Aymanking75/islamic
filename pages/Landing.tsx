
import React from 'react';
import { Search, Sparkles, Book, ScrollText, Library, Headphones, ChevronLeft, MapPin, History, Landmark, Image as ImageIcon, Wand2, Compass } from 'lucide-react';
import { AppView } from '../types.ts';

interface LandingProps {
  setView: (view: AppView) => void;
}

const Landing: React.FC<LandingProps> = ({ setView }) => {
  const mosqueImages = [
    {
      url: "https://images.unsplash.com/photo-1542667261-0b3d881b0d0f?auto=format&fit=crop&q=80&w=1200",
      title: "نقوش العمارة الإسلامية"
    },
    {
      url: "https://images.unsplash.com/photo-1590076215667-875d4ef2d97e?auto=format&fit=crop&q=80&w=1200",
      title: "منارة مسجد سيدي عقبة الشامخة"
    },
    {
      url: "https://images.unsplash.com/photo-1566112905876-0691761664c3?auto=format&fit=crop&q=80&w=1200",
      title: "واحات بسكرة التاريخية"
    }
  ];

  return (
    <div className="flex flex-col page-fade-in pb-20">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(21,128,61,0.3)_0%,transparent_70%)] pointer-events-none"></div>
        
        <div className="relative z-10 text-center max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#15803d]/10 border border-[#15803d]/20 text-[#15803d] text-xs font-bold mb-10 animate-pulse">
            <Sparkles size={14} /> بوابة الذكاء الاصطناعي للتراث الإسلامي الجزائري
          </div>
          <h1 className="text-6xl md:text-9xl font-bold mb-8 text-white leading-tight drop-shadow-2xl">
            مكتبة <span className="text-[#15803d]">عقبة</span> الرقمية
          </h1>
          <p className="text-xl md:text-3xl text-gray-300 mb-14 font-medium leading-relaxed max-w-3xl mx-auto">
            انطلق في رحلة عبر الزمن لاستكشاف إرث الفاتح <span className="text-[#d4af37]">عقبة بن نافع</span> وعمارة مسجده العتيق في قلب بسكرة.
          </p>

          <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
             <button 
                onClick={() => setView(AppView.IMAGE_GEN)}
                className="w-full md:w-auto px-10 py-6 bg-[#15803d] text-white rounded-[2rem] font-bold flex items-center justify-center gap-3 hover:bg-[#166534] transition-all shadow-[0_20px_50px_rgba(21,128,61,0.3)] hover:-translate-y-1 active:scale-95"
             >
                <Compass size={24} /> استكشاف العمارة بالذكاء الاصطناعي
             </button>
             <button 
                onClick={() => setView(AppView.LIBRARY)}
                className="w-full md:w-auto px-10 py-6 bg-[#0a1f18] border border-[#102a22] text-white rounded-[2rem] font-bold flex items-center justify-center gap-3 hover:bg-[#102a22] transition-all hover:-translate-y-1 active:scale-95"
             >
                <Library size={24} /> دخول المكتبة الرقمية
             </button>
          </div>
        </div>
      </section>

      {/* Featured Architecture Section */}
      <section className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <div className="flex-1 space-y-10 order-2 lg:order-1 text-right">
              <div className="inline-flex items-center gap-2 text-[#d4af37] font-extrabold text-sm tracking-[0.2em] uppercase">
                <Landmark size={20} /> العمارة الإسلامية العتيقة
              </div>
              <h2 className="text-5xl md:text-6xl font-bold text-white leading-[1.2]">مسجد <span className="text-[#15803d]">سيدي عقبة</span>: تحفة التاريخ</h2>
              <p className="text-gray-400 text-xl leading-loose">
                ليس مجرد مسجد، بل هو سجل حي للفن الإسلامي في شمال إفريقيا. تميز بأبوابه الخشبية النادرة التي نُقشت بأيدي أمهر الصناع، ومحرابه الذي شهد قروناً من العلم والعبادة في مدينة سيدي عقبة بولاية بسكرة.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { title: "الزخارف الخشبية", desc: "نقوش سدرية أصيلة تعود لعهود الخلافة الأولى." },
                  { title: "التصميم الأندلسي", desc: "تأثيرات مرابطية وزيانية تتجلى في العقود والأقواس." }
                ].map((item, i) => (
                  <div key={i} className="p-6 bg-[#0a1f18] border border-[#102a22] rounded-3xl hover:border-[#15803d]/50 transition-colors group">
                    <h4 className="text-[#15803d] font-bold mb-2 group-hover:text-[#d4af37] transition-colors">{item.title}</h4>
                    <p className="text-sm text-gray-500">{item.desc}</p>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => setView(AppView.IMAGE_GEN)}
                className="flex items-center gap-3 text-white font-bold text-lg hover:text-[#15803d] transition-colors"
              >
                توليد صور تفصيلية لهذه العمارة <ChevronLeft size={24} className="mt-1" />
              </button>
            </div>

            <div className="flex-1 relative order-1 lg:order-2">
               <div className="absolute -inset-10 bg-[#15803d]/10 rounded-full blur-[100px] opacity-50"></div>
               <div className="relative rounded-[4rem] overflow-hidden border border-[#102a22] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)]">
                  <img 
                    src="https://images.unsplash.com/photo-1590076215667-875d4ef2d97e?auto=format&fit=crop&q=80&w=1200" 
                    className="w-full h-[650px] object-cover hover:scale-105 transition-transform duration-[2s]" 
                    alt="Sidi Okba Mosque Architecture" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-12">
                     <p className="text-[#d4af37] font-bold mb-2">ولاية بسكرة، الجزائر</p>
                     <h3 className="text-3xl font-bold text-white">منارة الفاتح عقبة بن نافع</h3>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Explorer Grid */}
      <section className="py-24 px-6 bg-[#0a1f18]/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">استكشف المدينة والمسجد</h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">بوابة بصرية تمزج بين الحقيقة التاريخية والخيال الرقمي</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {mosqueImages.map((img, i) => (
              <div 
                key={i} 
                onClick={() => setView(AppView.IMAGE_GEN)}
                className="group relative h-[500px] rounded-[3rem] overflow-hidden border border-[#102a22] hover:border-[#15803d] transition-all cursor-pointer shadow-2xl"
              >
                <img src={img.url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s]" alt={img.title} />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                   <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20">
                      <Search className="text-white" size={28} />
                   </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent flex flex-col justify-end p-10">
                  <h4 className="text-white font-bold text-2xl mb-2">{img.title}</h4>
                  <p className="text-[#15803d] font-medium">سيدي عقبة، بسكرة</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Biography Quick Access */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between bg-gradient-to-r from-[#0a1f18] to-transparent border border-[#102a22] rounded-[4rem] p-12 md:p-20 gap-12">
           <div className="space-y-6 flex-1 text-right">
              <h2 className="text-4xl font-bold text-white">هل تود معرفة المزيد عن القائد عقبة؟</h2>
              <p className="text-gray-400 text-lg">اقرأ سيرته المحققة، وادرس خططه العسكرية التي غيرت وجه تاريخ شمال إفريقيا.</p>
              <button 
                onClick={() => setView(AppView.LIBRARY)}
                className="bg-[#d4af37] text-black px-10 py-4 rounded-2xl font-bold hover:bg-[#b8962c] transition-all"
              >
                تصفح الكتب التاريخية
              </button>
           </div>
           <div className="flex-1 flex justify-center">
              <div className="w-64 h-64 bg-[#15803d]/10 rounded-full flex items-center justify-center border-4 border-[#15803d]/20 relative">
                 <History size={100} className="text-[#15803d]" />
                 <div className="absolute -top-4 -right-4 w-12 h-12 bg-[#d4af37] rounded-full flex items-center justify-center text-black font-bold">63هـ</div>
              </div>
           </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
