
import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Sparkles, Plus, History, Settings, Info, ChevronRight, Paperclip, Mic, MicOff } from 'lucide-react';
import { sendMessageToScholar } from '../services/geminiService.ts';
import { Message } from '../types.ts';

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'model',
      content: 'السلام عليكم ورحمة الله وبركاته! أنا مساعدك "عقبة"، كيف يمكنني مساعدتك في دراسة علوم الدين اليوم؟',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (textOverride?: string) => {
    const textToSend = textOverride || input;
    if (!textToSend.trim() || isTyping) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const history = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.content }]
    }));

    const responseText = await sendMessageToScholar(textToSend, history);
    
    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      content: responseText || "عذراً، لم أستطع معالجة طلبك.",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, aiMsg]);
    setIsTyping(false);
  };

  const toggleVoiceRecording = () => {
    if (!isRecording) {
      // Simulate starting voice recording
      setIsRecording(true);
      // In a real app, we'd use MediaRecorder and then send to Gemini as audio
      // For this demo, we'll simulate voice-to-text after 2 seconds
      setTimeout(() => {
        setIsRecording(false);
        const voiceText = "هل يمكن أن تعطيني ملخصاً عن كتاب موطأ الإمام مالك؟";
        handleSend(voiceText);
      }, 3000);
    } else {
      setIsRecording(false);
    }
  };

  const suggestedTopics = [
    "تفسير سورة الفاتحة",
    "ما هو فضل الذكر؟",
    "كيفية صلاة الوتر"
  ];

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-[#04100c]">
      {/* Sidebar History */}
      <aside className="hidden lg:flex w-80 border-l border-[#102a22] flex-col p-4 bg-[#061410]">
        <button className="w-full flex items-center justify-center gap-2 py-3 bg-[#15803d] text-white rounded-xl font-bold mb-8 hover:bg-[#166534] transition-all shadow-lg shadow-[#15803d]/10">
          <Plus size={18} /> محادثة جديدة
        </button>

        <div className="mb-8">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 px-2">مواضيع مقترحة</h3>
          <div className="space-y-2">
            {suggestedTopics.map((topic, i) => (
              <button 
                key={i}
                onClick={() => setInput(topic)}
                className="w-full text-right p-3 rounded-xl bg-[#0a1f18] text-gray-400 text-sm hover:text-white hover:bg-[#102a22] transition-all border border-[#102a22]"
              >
                {topic}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 px-2 flex items-center gap-2">
            <History size={14} /> السجل الأخير
          </h3>
          <div className="space-y-1">
            {['أحكام التجويد الأساسية', 'قصص الأنبياء - آدم عليه السلام', 'سنن الرواتب', 'أذكار الصباح'].map((item, i) => (
              <button key={i} className="w-full text-right p-3 rounded-xl text-gray-400 text-sm hover:text-white hover:bg-[#102a22] transition-all truncate">
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-auto pt-4 border-t border-[#102a22]">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#0a1f18] border border-[#102a22]">
            <div className="w-10 h-10 bg-[#15803d] rounded-xl flex items-center justify-center text-white font-bold">JD</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">أحمد محمد</p>
              <p className="text-[10px] text-[#d4af37]">نسخة احترافية</p>
            </div>
            <Settings size={18} className="text-gray-500 cursor-pointer hover:text-white" />
          </div>
        </div>
      </aside>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* Header Notice */}
        <div className="p-4 bg-[#0a1f18]/50 border-b border-[#102a22] flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <Info size={14} className="text-[#15803d]" />
            <span>إخلاء مسؤولية: المساعد الآلي يوفر معلومات عامة ولا يصدر فتاوى شرعية.</span>
          </div>
          <button className="flex items-center gap-1 hover:text-white font-bold">اقرأ المزيد <ChevronRight size={14} className="rotate-180" /></button>
        </div>

        {/* Message List */}
        <div ref={scrollRef} className="flex-1 overflow-auto p-6 space-y-8 scroll-smooth">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border-2 ${msg.role === 'user' ? 'border-gray-700 bg-[#0a1f18]' : 'border-[#15803d] bg-[#061410]'}`}>
                {msg.role === 'model' ? <Sparkles size={20} className="text-[#15803d]" /> : <User size={20} className="text-gray-400" />}
              </div>
              <div className="flex flex-col gap-1 max-w-[85%]">
                <div className={`flex items-center gap-2 mb-1 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <span className="text-xs font-bold text-white">{msg.role === 'model' ? 'مساعد عقبة' : 'أحمد'}</span>
                  <span className="text-[10px] text-gray-500">{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className={`p-5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === 'user' 
                    ? 'bg-[#15803d] text-white rounded-tr-none shadow-lg shadow-[#15803d]/10' 
                    : 'bg-[#0a1f18] text-gray-200 rounded-tl-none border border-[#102a22]'
                }`}>
                  {msg.content}
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#061410] border-2 border-[#15803d] flex items-center justify-center">
                <Sparkles size={20} className="text-[#15803d] animate-pulse" />
              </div>
              <div className="bg-[#0a1f18] p-4 rounded-2xl rounded-tl-none border border-[#102a22] flex gap-1 items-center">
                <div className="w-1.5 h-1.5 bg-[#15803d] rounded-full animate-bounce delay-0"></div>
                <div className="w-1.5 h-1.5 bg-[#15803d] rounded-full animate-bounce delay-150"></div>
                <div className="w-1.5 h-1.5 bg-[#15803d] rounded-full animate-bounce delay-300"></div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-6 bg-gradient-to-t from-[#04100c] via-[#04100c] to-transparent">
          <div className="max-w-4xl mx-auto relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#15803d] to-[#d4af37] rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
            <div className="relative flex items-end bg-[#0a1f18] border border-[#102a22] rounded-2xl p-2 shadow-2xl">
              <button className="p-3 text-gray-500 hover:text-white transition-colors">
                <Paperclip size={20} />
              </button>
              <textarea 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                placeholder="اكتب سؤالك هنا للبحث والتحقيق..."
                className="flex-1 bg-transparent px-4 py-3 text-sm text-white focus:outline-none resize-none min-h-[56px] max-h-40"
                rows={1}
              />
              <div className="flex items-center gap-1 p-1">
                <button 
                  onClick={toggleVoiceRecording}
                  className={`p-3 rounded-xl transition-all ${
                    isRecording 
                      ? 'bg-red-500 text-white animate-pulse' 
                      : 'text-gray-500 hover:text-white'
                  }`}
                >
                  {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
                </button>
                <button 
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isTyping}
                  className={`p-3 rounded-xl transition-all ${
                    input.trim() && !isTyping 
                      ? 'bg-[#15803d] text-white hover:bg-[#166534] shadow-lg shadow-[#15803d]/20' 
                      : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <Send size={20} className="fill-current" />
                </button>
              </div>
            </div>
            {isRecording && (
              <div className="mt-3 flex items-center justify-center gap-2 text-[#15803d] text-xs font-bold animate-pulse">
                <span>جاري الاستماع لطلبك...</span>
              </div>
            )}
            {!isRecording && <p className="mt-3 text-center text-[10px] text-gray-500">قد يخطئ الذكاء الاصطناعي أحياناً. يرجى مراجعة المصادر الموثوقة.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
