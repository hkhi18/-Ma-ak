'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { initialMockEvents, defaultUserProfile } from '../../../data/mock-events';
import { calculatePersonalMatch } from '../../../lib/accessibility-engine';
import { 
  ArrowRight, 
  Bookmark, 
  AlertTriangle, 
  MapPin, 
  Calendar, 
  Building, 
  Sparkles, 
  Send, 
  Layers, 
  Check, 
  X, 
  Wheelchair, 
  Ear, 
  Eye, 
  Brain, 
  ShieldCheck, 
  Star 
} from 'lucide-react';

export default function EventDetailsPage({ params }: { params: { id: string } }) {
  const event = initialMockEvents.find(e => e.id === params.id) || initialMockEvents[0];
  const [userProfile] = useState(defaultUserProfile);
  const match = calculatePersonalMatch(userProfile, event.features);
  const [isSaved, setIsSaved] = useState(false);

  const [chatMessages, setChatMessages] = useState([
    { sender: 'assistant', text: `مرحباً بك في صفحة «${event.title}». أنا المساعد الذكي لإمكانية الوصول. كيف يمكنني مساعدتك اليوم بخصوص مرافق المكان وتجهيزاته؟` }
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const userText = inputMsg.trim();
    setChatMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setInputMsg('');
    setIsSending(true);

    setTimeout(() => {
      let reply = `تتوفر في فعالية «${event.title}» تجهيزات متقدمة بدرجة إتاحة إجمالية ${event.overallScore}/100 ونسبة ملاءمة لاحتياجاتك تبلغ ${match.matchPercentage}%.`;
      const lower = userText.toLowerCase();
      if (lower.includes('كرسي') || lower.includes('حركي') || lower.includes('منحدر')) {
        reply = event.features.hasWheelchairAccess ? 'نعم، المكان مهيأ تماماً لمستخدمي الكراسي المتحركة مع منحدرات ومصاعد ومواقف مخصصة.' : 'تتوفر بعض التسهيلات ولكن قد يتطلب الدخول مساعدة إضافية.';
      } else if (lower.includes('إشارة') || lower.includes('سمعي') || lower.includes('ترجمة')) {
        reply = event.features.hasSignLanguageInterpreter ? 'يتوفر مترجم لغة إشارة معتمد وشاشات ترجمة فورية مباشرة.' : 'لا يتوفر مترجم إشارة مخصص ولكن توجد إرشادات بصرية وشاشات.';
      }
      setChatMessages(prev => [...prev, { sender: 'assistant', text: reply }]);
      setIsSending(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <header className="bg-[#0F1E36] text-white py-4 px-6 border-b border-slate-700">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-bold text-xl text-white">مَعَك</Link>
          <Link href="/" className="text-xs text-slate-300 hover:text-white flex items-center gap-1">
            <ArrowRight className="w-4 h-4" />
            <span>العودة للرئيسية</span>
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 flex-grow">
        {/* Banner Card */}
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-5 h-72 lg:h-auto relative bg-slate-100">
            <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
            <div className="absolute top-4 right-4 bg-[#0F1E36]/90 text-white text-xs px-3 py-1 rounded-full font-medium">
              {event.city} • {event.category}
            </div>
          </div>

          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-brand-teal">
                <Building className="w-4 h-4" />
                <span>تنظيم: {event.organizerName}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#0F1E36]">{event.title}</h1>
              <p className="text-sm text-slate-600 leading-relaxed">{event.description}</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-slate-700">
                <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <Calendar className="w-4 h-4 text-brand-teal" />
                  <span>{event.eventDate} ({event.startTime} - {event.endTime})</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <MapPin className="w-4 h-4 text-brand-coral" />
                  <span className="truncate">{event.locationName}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
              <div className="bg-teal-50 p-4 rounded-2xl border border-teal-200">
                <span className="text-xs text-teal-800 font-medium block">نسبة مناسبتها لك:</span>
                <span className="text-3xl font-bold text-teal-900">{match.matchPercentage}%</span>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <span className="text-xs text-slate-600 font-medium block">درجة إمكانية الوصول الكلية:</span>
                <span className="text-3xl font-bold text-[#0F1E36]">{event.overallScore}/100</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Pillars & AI Assistant */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              <h2 className="text-xl font-bold text-[#0F1E36] flex items-center gap-2">
                <Layers className="w-5 h-5 text-brand-teal" />
                <span>توزيع درجات الإتاحة على المحاور الأربعة</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-teal-50/50 border border-teal-200 p-4 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between text-sm font-bold text-teal-950">
                    <div className="flex items-center gap-2">
                      <Wheelchair className="w-4 h-4 text-brand-teal" />
                      <span>المحور الحركي</span>
                    </div>
                    <span>{event.pillarScores.mobility}%</span>
                  </div>
                  <div className="w-full bg-teal-200 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-[#028090] h-full rounded-full" style={{ width: `${event.pillarScores.mobility}%` }}></div>
                  </div>
                </div>

                <div className="bg-rose-50/50 border border-rose-200 p-4 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between text-sm font-bold text-rose-950">
                    <div className="flex items-center gap-2">
                      <Ear className="w-4 h-4 text-[#F26440]" />
                      <span>المحور السمعي</span>
                    </div>
                    <span>{event.pillarScores.hearing}%</span>
                  </div>
                  <div className="w-full bg-rose-200 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-[#F26440] h-full rounded-full" style={{ width: `${event.pillarScores.hearing}%` }}></div>
                  </div>
                </div>

                <div className="bg-purple-50/50 border border-purple-200 p-4 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between text-sm font-bold text-purple-950">
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-[#584B9B]" />
                      <span>المحور البصري</span>
                    </div>
                    <span>{event.pillarScores.vision}%</span>
                  </div>
                  <div className="w-full bg-purple-200 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-[#584B9B] h-full rounded-full" style={{ width: `${event.pillarScores.vision}%` }}></div>
                  </div>
                </div>

                <div className="bg-amber-50/50 border border-amber-200 p-4 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between text-sm font-bold text-amber-950">
                    <div className="flex items-center gap-2">
                      <Brain className="w-4 h-4 text-[#EAA812]" />
                      <span>المحور الحسي</span>
                    </div>
                    <span>{event.pillarScores.sensory}%</span>
                  </div>
                  <div className="w-full bg-amber-200 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-[#EAA812] h-full rounded-full" style={{ width: `${event.pillarScores.sensory}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[500px]">
              <div className="bg-[#0F1E36] p-4 text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-teal" />
                <h3 className="font-bold text-sm">المساعد الذكي للفعالية</h3>
              </div>
              <div className="flex-grow p-4 overflow-y-auto space-y-3 bg-slate-50 text-xs">
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`p-3 rounded-2xl max-w-[85%] ${msg.sender === 'user' ? 'bg-[#0F1E36] text-white' : 'bg-white text-slate-800 border border-slate-200'}`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
              <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-200 flex gap-2">
                <input 
                  type="text" 
                  placeholder="اسأل عن المنحدرات، لغة الإشارة..." 
                  value={inputMsg}
                  onChange={(e) => setInputMsg(e.target.value)}
                  className="flex-grow text-xs px-3 py-2 border rounded-xl"
                />
                <button type="submit" className="p-2 bg-brand-teal text-white rounded-xl">
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
