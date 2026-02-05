
import React from 'react';
import { 
  Library, 
  BookOpen, 
  MessageSquare, 
  Search, 
  User, 
  Globe, 
  Menu,
  Bell,
  Moon,
  Sparkles,
  ImageIcon
} from 'lucide-react';
import { AppView } from '../types.ts';

interface LayoutProps {
  children: React.ReactNode;
  currentView: AppView;
  setView: (view: AppView) => void;
}

const NavTooltip: React.FC<{ text: string }> = ({ text }) => (
  <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-[60] shadow-xl border border-gray-700">
    {text}
  </div>
);

const Layout: React.FC<LayoutProps> = ({ children, currentView, setView }) => {
  const navItems = [
    { id: AppView.LANDING, label: 'الرئيسية', icon: Library },
    { id: AppView.LIBRARY, label: 'المكتبة', icon: Library },
    { id: AppView.QURAN, label: 'القرآن الكريم', icon: BookOpen },
    { id: AppView.CHAT, label: 'الدردشة الذكية', icon: MessageSquare },
    { id: AppView.IMAGE_GEN, label: 'المختبر البصري', icon: ImageIcon },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#04100c]">
      {/* Top Navbar */}
      <nav className="h-16 border-b border-[#102a22] flex items-center justify-between px-6 sticky top-0 bg-[#04100c]/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-4">
          <div 
            className="flex items-center gap-2 cursor-pointer group relative"
            onClick={() => setView(AppView.LANDING)}
          >
            <div className="w-10 h-10 bg-[#15803d] rounded-lg flex items-center justify-center">
              <BookOpen className="text-white" size={24} />
            </div>
            <h1 className="text-xl font-bold text-white hidden md:block">مكتبة عقبة</h1>
            <NavTooltip text="العودة للرئيسية" />
          </div>
          
          <div className="hidden md:flex items-center gap-6 mr-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={`text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  currentView === item.id ? 'text-[#15803d]' : 'text-gray-400 hover:text-white'
                }`}
              >
                {item.id === AppView.IMAGE_GEN && <Sparkles size={14} className="animate-pulse" />}
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex relative ml-4 group">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
              type="text" 
              placeholder="بحث في الكتب والقرآن..."
              className="bg-[#0a1f18] border border-[#102a22] rounded-full py-2 pr-10 pl-4 text-sm focus:outline-none focus:border-[#15803d] w-64 transition-all"
            />
          </div>
          
          <div className="relative group">
            <button className="p-2 text-gray-400 hover:text-white hover:bg-[#102a22] rounded-full transition-colors">
              <Bell size={20} />
            </button>
            <NavTooltip text="التنبيهات" />
          </div>

          <div className="flex items-center gap-2 pr-2 border-r border-[#102a22] relative group cursor-pointer">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#15803d] group-hover:border-[#d4af37] transition-colors">
              <img src="https://picsum.photos/seed/user123/100/100" alt="User Profile" />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>

      {/* Footer */}
      {currentView !== AppView.CHAT && currentView !== AppView.QURAN && currentView !== AppView.IMAGE_GEN && (
        <footer className="bg-[#0a1f18] border-t border-[#102a22] py-12 px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="text-[#15803d]" size={28} />
                <h2 className="text-xl font-bold text-white">مكتبة عقبة بن نافع الفهري</h2>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                نجمع بين كنوز المعرفة الإسلامية عبر القرون وبين أحدث تقنيات الذكاء الاصطناعي.
              </p>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4">أقسام الموقع</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li onClick={() => setView(AppView.QURAN)} className="hover:text-[#15803d] cursor-pointer">القرآن الكريم</li>
                <li onClick={() => setView(AppView.IMAGE_GEN)} className="hover:text-[#15803d] cursor-pointer">المختبر البصري AI</li>
                <li onClick={() => setView(AppView.CHAT)} className="hover:text-[#15803d] cursor-pointer">المحاور الذكي</li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-[#102a22] text-center text-gray-500 text-sm">
            © ٢٠٢٥ مكتبة عقبة بن نافع. جميع الحقوق محفوظة.
          </div>
        </footer>
      )}
    </div>
  );
};

export default Layout;
