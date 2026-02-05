
import React, { useState, useRef, useMemo } from 'react';
import { 
  Book as BookIcon, 
  Filter, 
  Search, 
  Download, 
  BookOpen, 
  ChevronRight, 
  MessageSquare, 
  Plus, 
  X, 
  Upload, 
  FileText, 
  Image as ImageIcon,
  CheckCircle2,
  Trash2,
  Calendar,
  ArrowUpDown
} from 'lucide-react';
import { Book, AppView } from '../types.ts';

// Added some initial sample books to demonstrate filtering
const INITIAL_BOOKS: Book[] = [
  {
    id: '1',
    title: 'تفسير الجلالين',
    author: 'الجلالين',
    category: 'علوم القرآن والتفسير',
    coverImage: 'https://images.unsplash.com/photo-1589923158776-cb4485d99fd6?auto=format&fit=crop&q=80&w=400',
    year: '١٤٤٠ هـ'
  },
  {
    id: '2',
    title: 'زاد المعاد',
    author: 'ابن القيم',
    category: 'السيرة والشمائل',
    coverImage: 'https://images.unsplash.com/photo-1544640808-32ca72ac7f37?auto=format&fit=crop&q=80&w=400',
    year: '١٤٤٢ هـ'
  }
];

interface LibraryProps {
  setView: (view: AppView) => void;
}

const Library: React.FC<LibraryProps> = ({ setView }) => {
  const [books, setBooks] = useState<Book[]>(INITIAL_BOOKS);
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'title' | 'author' | 'newest'>('newest');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  
  // Upload Form State
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    category: 'عام',
    year: '',
    coverImage: '',
    pdfFile: null as File | null
  });
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const categories = useMemo(() => {
    const counts: Record<string, number> = { 'الكل': books.length };
    const list = [
      'الفقه الإسلامي',
      'السيرة والشمائل',
      'علوم القرآن والتفسير',
      'الحديث الشريف',
      'العقيدة والتوحيد',
      'عام'
    ];
    
    list.forEach(cat => {
      counts[cat] = books.filter(b => b.category === cat).length;
    });

    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  }, [books]);

  const filteredBooks = useMemo(() => {
    return books
      .filter(book => {
        const matchesCategory = selectedCategory === 'الكل' || book.category === selectedCategory;
        const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              book.author.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'title') return a.title.localeCompare(b.title);
        if (sortBy === 'author') return a.author.localeCompare(b.author);
        return 0; // Default: Order of addition (for newest)
      });
  }, [books, selectedCategory, searchQuery, sortBy]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewBook({ ...newBook, pdfFile: e.target.files[0] });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setNewBook({ ...newBook, coverImage: event.target?.result as string });
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSubmitUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBook.title || !newBook.author) return;

    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        const bookToAdd: Book = {
          id: Date.now().toString(),
          title: newBook.title,
          author: newBook.author,
          category: newBook.category,
          year: newBook.year,
          coverImage: newBook.coverImage || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=400',
          isCustom: true,
          pdfUrl: newBook.pdfFile ? URL.createObjectURL(newBook.pdfFile) : undefined
        };
        setBooks([bookToAdd, ...books]);
        setTimeout(() => {
          setIsUploadModalOpen(false);
          setUploadProgress(0);
          setNewBook({ title: '', author: '', category: 'عام', year: '', coverImage: '', pdfFile: null });
        }, 1000);
      }
    }, 100);
  };

  const removeBook = (id: string) => {
    setBooks(books.filter(b => b.id !== id));
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row gap-8 min-h-[80vh]">
      {/* Sidebar Filters */}
      <aside className="w-full md:w-72 shrink-0 space-y-8">
        <button 
          onClick={() => setIsUploadModalOpen(true)}
          className="w-full flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-[#15803d] to-[#166534] text-white rounded-2xl font-bold shadow-xl shadow-[#15803d]/20 hover:scale-[1.02] transition-all group"
        >
          <div className="bg-white/20 p-1.5 rounded-lg group-hover:rotate-90 transition-transform">
            <Plus size={20} />
          </div>
          رفع كتاب جديد (PDF)
        </button>

        <div className="bg-[#0a1f18] p-6 rounded-2xl border border-[#102a22] shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#15803d]/10 rounded-full -mr-12 -mt-12 blur-2xl"></div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-[#15803d] rounded-lg flex items-center justify-center">
              <MessageSquare size={16} className="text-white" />
            </div>
            <h3 className="text-sm font-bold text-white">الذكاء الاصطناعي</h3>
          </div>
          <h4 className="text-lg font-bold text-white mb-2 leading-snug">اسأل رفيقك الرقمي</h4>
          <p className="text-xs text-gray-400 mb-6">ابحث عن الفتاوى والأحكام من خلال الدردشة الذكية مع قاعدة بياناتنا الموثقة.</p>
          <button 
            onClick={() => setView(AppView.CHAT)}
            className="w-full bg-[#d4af37] text-black font-bold py-3 rounded-xl hover:bg-[#b8962c] transition-colors"
          >
            ابدأ المحادثة
          </button>
        </div>

        <div>
          <h3 className="text-xl font-bold text-white mb-6">التصنيفات</h3>
          <div className="space-y-1">
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-all ${
                  selectedCategory === cat.name 
                    ? 'bg-[#15803d] text-white shadow-lg shadow-[#15803d]/10' 
                    : 'text-gray-400 hover:bg-[#102a22] hover:text-white'
                }`}
              >
                <span className="flex items-center gap-2">
                  <BookIcon size={16} />
                  {cat.name}
                </span>
                <span className="text-xs opacity-60">{cat.count}</span>
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <nav className="flex items-center gap-2 text-xs text-gray-500 mb-2">
              <span>الرئيسية</span>
              <ChevronRight size={12} className="rotate-180" />
              <span className="text-gray-300">الفهرس الرقمي</span>
            </nav>
            <h2 className="text-3xl font-bold text-white">مكتبتك الخاصة</h2>
            <p className="text-gray-400 text-sm">ارفع كتبك ووثائقك العلمية لتنظيمها والبحث فيها.</p>
          </div>
        </div>

        {/* Search and Sort Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1 group">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#15803d] transition-colors" size={18} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث بالعنوان أو اسم المؤلف..."
              className="w-full bg-[#0a1f18] border border-[#102a22] rounded-2xl py-3 pr-12 pl-4 text-sm text-white focus:outline-none focus:border-[#15803d] transition-all shadow-inner"
            />
          </div>
          <div className="relative group">
            <ArrowUpDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="appearance-none bg-[#0a1f18] border border-[#102a22] rounded-2xl py-3 pr-12 pl-10 text-sm text-white focus:outline-none focus:border-[#15803d] transition-all cursor-pointer shadow-inner min-w-[160px]"
            >
              <option value="newest">الأحدث أولاً</option>
              <option value="title">حسب العنوان</option>
              <option value="author">حسب المؤلف</option>
            </select>
          </div>
        </div>

        {filteredBooks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-[#0a1f18] rounded-[2rem] border-2 border-dashed border-[#102a22]">
            <div className="w-20 h-20 bg-[#15803d]/10 rounded-full flex items-center justify-center mb-6">
              <Search size={40} className="text-[#15803d]" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">لا توجد نتائج</h3>
            <p className="text-gray-400 mb-8">لم نجد أي كتب تطابق بحثك الحالي.</p>
            <button 
              onClick={() => {setSearchQuery(''); setSelectedCategory('الكل');}}
              className="px-8 py-3 bg-[#15803d]/20 text-[#15803d] rounded-xl font-bold hover:bg-[#15803d] hover:text-white transition-all"
            >
              إعادة تعيين الفلاتر
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBooks.map((book) => (
              <div key={book.id} className="bg-[#0a1f18] rounded-2xl overflow-hidden border border-[#102a22] group hover:border-[#15803d] transition-all flex flex-col relative">
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img 
                    src={book.coverImage} 
                    alt={book.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all flex flex-col justify-end p-6">
                    <div className="flex gap-2 w-full">
                      <button 
                        className="flex-1 bg-[#15803d] text-white py-2.5 rounded-xl text-sm font-bold hover:bg-[#166534] flex items-center justify-center gap-2"
                        onClick={() => book.pdfUrl && window.open(book.pdfUrl, '_blank')}
                      >
                        <BookOpen size={16} /> قراءة
                      </button>
                      <button 
                        onClick={() => removeBook(book.id)}
                        className="p-2.5 bg-red-600/20 text-red-500 rounded-xl hover:bg-red-600 hover:text-white transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  {book.isCustom && (
                    <div className="absolute top-4 left-4 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-lg flex items-center gap-1">
                      <CheckCircle2 size={10} /> مرفوع
                    </div>
                  )}
                  {book.year && (
                    <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md text-[#d4af37] text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1 border border-[#d4af37]/30">
                      <Calendar size={10} /> {book.year}
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <span className="text-xs text-[#15803d] font-bold uppercase tracking-wider mb-2 block">{book.category}</span>
                  <h3 className="text-lg font-bold text-white mb-1 group-hover:text-[#15803d] transition-colors line-clamp-1">{book.title}</h3>
                  <p className="text-xs text-gray-500">{book.author}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#061410] border border-[#102a22] rounded-[2rem] w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="px-8 py-6 border-b border-[#102a22] flex items-center justify-between bg-[#0a1f18]">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Upload size={22} className="text-[#15803d]" /> إضافة كتاب جديد
              </h3>
              <button onClick={() => setIsUploadModalOpen(false)} className="p-2 text-gray-500 hover:text-white rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmitUpload} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-400 mr-1">عنوان الكتاب</label>
                  <input 
                    type="text" 
                    required
                    value={newBook.title}
                    onChange={(e) => setNewBook({...newBook, title: e.target.value})}
                    placeholder="مثال: العقيدة الطحاوية"
                    className="w-full bg-[#0a1f18] border border-[#102a22] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#15803d] transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-400 mr-1">اسم المؤلف</label>
                  <input 
                    type="text" 
                    required
                    value={newBook.author}
                    onChange={(e) => setNewBook({...newBook, author: e.target.value})}
                    placeholder="مثال: الإمام الطحاوي"
                    className="w-full bg-[#0a1f18] border border-[#102a22] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#15803d] transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-400 mr-1">التصنيف</label>
                  <select 
                    value={newBook.category}
                    onChange={(e) => setNewBook({...newBook, category: e.target.value})}
                    className="w-full bg-[#0a1f18] border border-[#102a22] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#15803d] transition-colors appearance-none"
                  >
                    {categories.filter(c => c.name !== 'الكل').map(cat => (
                      <option key={cat.name} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-400 mr-1">سنة الطبع / الإصدار</label>
                  <input 
                    type="text" 
                    value={newBook.year}
                    onChange={(e) => setNewBook({...newBook, year: e.target.value})}
                    placeholder="مثال: ١٤٤٥ هـ"
                    className="w-full bg-[#0a1f18] border border-[#102a22] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#15803d] transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all ${newBook.pdfFile ? 'border-[#15803d] bg-[#15803d]/5' : 'border-[#102a22] hover:border-[#15803d] hover:bg-[#102a22]'}`}
                >
                  <input type="file" ref={fileInputRef} hidden accept=".pdf" onChange={handleFileUpload} />
                  <FileText className={newBook.pdfFile ? 'text-[#15803d]' : 'text-gray-500'} size={32} />
                  <div className="text-center">
                    <p className="text-xs font-bold text-white mb-1">{newBook.pdfFile ? 'تم اختيار الملف' : 'رفع ملف PDF'}</p>
                    <p className="text-[10px] text-gray-500 truncate max-w-[120px]">{newBook.pdfFile ? newBook.pdfFile.name : 'أقصى حجم ٥٠ ميجا'}</p>
                  </div>
                </div>

                <div 
                  onClick={() => imageInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all ${newBook.coverImage ? 'border-[#d4af37] bg-[#d4af37]/5' : 'border-[#102a22] hover:border-[#d4af37] hover:bg-[#102a22]'}`}
                >
                  <input type="file" ref={imageInputRef} hidden accept="image/*" onChange={handleImageUpload} />
                  {newBook.coverImage ? (
                    <img src={newBook.coverImage} className="w-12 h-16 object-cover rounded shadow-lg" alt="Preview" />
                  ) : (
                    <ImageIcon className="text-gray-500" size={32} />
                  )}
                  <div className="text-center">
                    <p className="text-xs font-bold text-white mb-1">صورة الغلاف</p>
                    <p className="text-[10px] text-gray-500">JPG, PNG</p>
                  </div>
                </div>
              </div>

              {uploadProgress > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-gray-400">جاري الرفع...</span>
                    <span className="text-[#15803d]">{uploadProgress}%</span>
                  </div>
                  <div className="h-2 bg-[#0a1f18] rounded-full overflow-hidden">
                    <div className="h-full bg-[#15803d] transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                  </div>
                </div>
              )}

              <div className="pt-4">
                <button 
                  type="submit"
                  disabled={uploadProgress > 0}
                  className="w-full bg-[#15803d] text-white py-4 rounded-2xl font-bold shadow-xl shadow-[#15803d]/20 hover:bg-[#166534] transition-all flex items-center justify-center gap-2"
                >
                  {uploadProgress > 0 ? 'يرجى الانتظار...' : 'إتمام الرفع والحفظ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Library;
