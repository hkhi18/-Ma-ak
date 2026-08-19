'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { initialMockEvents, defaultUserProfile } from '../data/mock-events';
import { calculatePersonalMatch } from '../lib/accessibility-engine';
import { 
  Search, 
  MapPin, 
  Calendar, 
  Sparkles, 
  Sliders, 
  Bookmark, 
  ArrowLeft, 
  ShieldCheck, 
  Wheelchair, 
  Ear, 
  Eye, 
  Brain,
  HandMetal
} from 'lucide-react';

export default function HomePage() {
  const [eventsList] = useState(initialMockEvents);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('الكل');
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [userProfile, setUserProfile] = useState(defaultUserProfile);
  const [savedEventIds, setSavedEventIds] = useState<string[]>(['evt-001', 'evt-004']);

  const toggleSave = (id: string) => {
    if (savedEventIds.includes(id)) {
      setSavedEventIds(savedEventIds.filter(e => e !== id));
    } else {
      setSavedEventIds([...savedEventIds, id]);
    }
  };

  const filteredEvents = useMemo(() => {
    return eventsList.filter(e => {
      const matchQuery = e.title.includes(searchQuery) || e.locationName.includes(searchQuery) || e.description.includes(searchQuery);
      const matchCity = selectedCity === 'الكل' || e.city === selectedCity;
      const matchCat = selectedCategory === 'الكل' || e.category === selectedCategory;
      return matchQuery && matchCity && matchCat;
    });
  }, [eventsList, searchQuery, selectedCity, selectedCategory]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Navbar */}
      <header className="bg-[#0F1E36] text-white sticky top-0 z-50 shadow-md border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-teal to-teal-400 flex items-center justify-center font-bold text-white shadow-sm">
                م
              </div>
              <div className="text-right">
                <span className="font-bold text-2xl tracking-tight block">مَعَك</span>
                <span className="text-[11px] text-slate-400 block font-medium">فعاليات للجميع بلا عوائق</span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-2 font-medium text-sm">
              <Link href="/" className="px-4 py-2 rounded-lg bg-brand-teal text-white font-semibold">
                الرئيسية
              </Link>
              <Link href="/user/dashboard" className="px-4 py-2 rounded-lg text-slate-200 hover:bg-slate-800 transition">
                لوحة الزائر
              </Link>
              <Link href="/organizer/dashboard" className="px-4 py-2 rounded-lg text-slate-200 hover:bg-slate-800 transition">
                لوحة المنظم
              </Link>
            </nav>

            <div className="flex items-center gap-3">
              <Link href="/user/dashboard" className="relative p-2.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 transition">
                <Bookmark className="w-5 h-5" />
                {savedEventIds.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-[#F26440] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {savedEventIds.length}
                  </span>
                )}
              </Link>
              <Link href="/organizer/dashboard" className="bg-brand-teal hover:bg-teal-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-sm transition">
                إضافة فعالية
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow space-y-12 pb-16">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-[#0F1E36] via-slate-900 to-slate-900 text-white pt-16 pb-24 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
            <div className="inline-flex items-center gap-2 bg-slate-800/80 border border-slate-700/80 px-4 py-1.5 rounded-full text-xs font-semibold text-teal-300">
              <Sparkles className="w-3.5 h-3.5 text-[#EAA812]" />
              <span>المنصة الوطنية لسهولة الوصول والإتاحة الشاملة</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white max-w-4xl mx-auto leading-tight">
              الفعالية للجميع
            </h1>
            
            <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
              اكتشف فعاليات تناسب احتياجاتك قبل أن تذهب.
            </p>

            <div className="flex items-center justify-center gap-3 text-xs sm:text-sm font-semibold text-slate-400">
              <span className="text-[#028090]">اكتشف</span>
              <span>•</span>
              <span className="text-[#F26440]">شارك</span>
              <span>•</span>
              <span className="text-[#EAA812]">استمتع</span>
            </div>

            {/* Search Bar */}
            <div className="max-w-4xl mx-auto bg-white rounded-2xl p-3 sm:p-4 shadow-xl border border-slate-200 text-slate-900 mt-8">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                <div className="md:col-span-5 relative">
                  <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                    <Search className="w-5 h-5" />
                  </div>
                  <input 
                    type="text" 
                    placeholder="ابحث باسم الفعالية، المكان، أو الموضوع..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-3 pr-11 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-sm font-medium transition"
                  />
                </div>

                <div className="md:col-span-3">
                  <select 
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full px-3 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium transition"
                  >
                    <option value="الكل">جميع المدن</option>
                    <option value="الرياض">الرياض</option>
                    <option value="جدة">جدة</option>
                    <option value="الدمام">الدمام</option>
                    <option value="الخبر">الخبر</option>
                  </select>
                </div>

                <div className="md:col-span-4">
                  <select 
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium transition"
                  >
                    <option value="الكل">جميع أنواع الفعاليات</option>
                    <option value="مؤتمر تقني">مؤتمرات ومعارض</option>
                    <option value="معرض فني">فنون وثقافة</option>
                    <option value="حفل موسيقي">حفلات موسيقية</option>
                    <option value="ورشة عمل">ورش عمل وتدريب</option>
                    <option value="فعالية رياضية">فعاليات رياضية</option>
                    <option value="ندوة علمية">ندوات طبية وعلمية</option>
                    <option value="سوق خيري">أسواق مجتمعية</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Live Personal Match Engine Quick Bar */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-14 relative z-20">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-brand-teal" />
                  <h2 className="text-lg font-bold text-[#0F1E36]">
                    محرك المطابقة الفورية (Personal Match Engine)
                  </h2>
                </div>
                <p className="text-xs text-slate-500">
                  حدد متطلباتك وسيعيد النظام احتساب «نسبة مناسبة لك» لكل فعالية مباشرة وفقاً لمعايير الإتاحة.
                </p>
              </div>

              <Link 
                href="/user/dashboard"
                className="text-xs font-semibold text-brand-teal hover:text-teal-800 bg-teal-50 px-3.5 py-2 rounded-lg border border-teal-100 transition"
              >
                تعديل الملف الشخصي والاحتياجات المتقدمة
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5">
              <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition select-none ${userProfile.mobilityNeeds.wheelchair ? 'bg-teal-50/80 border-brand-teal text-brand-teal font-semibold' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                <input 
                  type="checkbox" 
                  checked={userProfile.mobilityNeeds.wheelchair}
                  onChange={(e) => setUserProfile({
                    ...userProfile,
                    mobilityNeeds: {
                      ...userProfile.mobilityNeeds,
                      wheelchair: e.target.checked,
                      ramps: e.target.checked,
                      elevators: e.target.checked
                    }
                  })}
                  className="sr-only"
                />
                <div className={`p-2 rounded-lg ${userProfile.mobilityNeeds.wheelchair ? 'bg-[#028090] text-white' : 'bg-white text-slate-400 border border-slate-200'}`}>
                  <Wheelchair className="w-4 h-4" />
                </div>
                <div className="text-right">
                  <span className="block text-xs">احتياج حركي</span>
                  <span className="block text-[10px] text-slate-500 font-normal">كراسي ومصاعد ومنحدرات</span>
                </div>
              </label>

              <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition select-none ${userProfile.hearingNeeds.signLanguage ? 'bg-rose-50/80 border-[#F26440] text-[#F26440] font-semibold' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                <input 
                  type="checkbox" 
                  checked={userProfile.hearingNeeds.signLanguage}
                  onChange={(e) => setUserProfile({
                    ...userProfile,
                    hearingNeeds: {
                      ...userProfile.hearingNeeds,
                      signLanguage: e.target.checked,
                      liveCaptions: e.target.checked
                    }
                  })}
                  className="sr-only"
                />
                <div className={`p-2 rounded-lg ${userProfile.hearingNeeds.signLanguage ? 'bg-[#F26440] text-white' : 'bg-white text-slate-400 border border-slate-200'}`}>
                  <Ear className="w-4 h-4" />
                </div>
                <div className="text-right">
                  <span className="block text-xs">احتياج سمعي</span>
                  <span className="block text-[10px] text-slate-500 font-normal">لغة إشارة وترجمة فورية</span>
                </div>
              </label>

              <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition select-none ${userProfile.visionNeeds.highContrast ? 'bg-purple-50/80 border-[#584B9B] text-[#584B9B] font-semibold' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                <input 
                  type="checkbox" 
                  checked={userProfile.visionNeeds.highContrast}
                  onChange={(e) => setUserProfile({
                    ...userProfile,
                    visionNeeds: {
                      ...userProfile.visionNeeds,
                      highContrast: e.target.checked,
                      audioDescription: e.target.checked
                    }
                  })}
                  className="sr-only"
                />
                <div className={`p-2 rounded-lg ${userProfile.visionNeeds.highContrast ? 'bg-[#584B9B] text-white' : 'bg-white text-slate-400 border border-slate-200'}`}>
                  <Eye className="w-4 h-4" />
                </div>
                <div className="text-right">
                  <span className="block text-xs">احتياج بصري</span>
                  <span className="block text-[10px] text-slate-500 font-normal">وصف صوتي وبرايل وتباين</span>
                </div>
              </label>

              <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition select-none ${userProfile.sensoryNeeds.quietRoom ? 'bg-amber-50/80 border-[#EAA812] text-[#EAA812] font-semibold' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                <input 
                  type="checkbox" 
                  checked={userProfile.sensoryNeeds.quietRoom}
                  onChange={(e) => setUserProfile({
                    ...userProfile,
                    sensoryNeeds: {
                      ...userProfile.sensoryNeeds,
                      quietRoom: e.target.checked,
                      lowNoise: e.target.checked
                    }
                  })}
                  className="sr-only"
                />
                <div className={`p-2 rounded-lg ${userProfile.sensoryNeeds.quietRoom ? 'bg-[#EAA812] text-white' : 'bg-white text-slate-400 border border-slate-200'}`}>
                  <Brain className="w-4 h-4" />
                </div>
                <div className="text-right">
                  <span className="block text-xs">احتياج حسي</span>
                  <span className="block text-[10px] text-slate-500 font-normal">غرفة هادئة وبيئة مريحة</span>
                </div>
              </label>
            </div>
          </div>
        </section>

        {/* Events Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-[#0F1E36] flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-[#EAA812]" />
                <span>فعاليات مقترحة لك</span>
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                مرتبة حسب أعلى نسبة ملاءمة لاحتياجاتك الشخصية المحددة
              </p>
            </div>
            <span className="text-xs font-semibold bg-slate-200 text-slate-700 px-3 py-1 rounded-full">
              {filteredEvents.length} فعالية متاحة
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map(event => {
              const match = calculatePersonalMatch(userProfile, event.features);
              const isSaved = savedEventIds.includes(event.id);

              return (
                <div key={event.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col group">
                  <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                    <img 
                      src={event.imageUrl} 
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                    <div className="absolute top-3 right-3 flex items-center gap-2">
                      <span className="bg-[#0F1E36]/90 text-white text-xs px-2.5 py-1 rounded-full font-medium">
                        {event.city}
                      </span>
                      <span className="bg-white/90 text-slate-800 text-xs px-2.5 py-1 rounded-full font-medium">
                        {event.category}
                      </span>
                    </div>

                    <button 
                      onClick={() => toggleSave(event.id)}
                      className="absolute top-3 left-3 p-2 rounded-full bg-white/90 hover:bg-white text-slate-700 hover:text-brand-coral transition"
                    >
                      <Bookmark className={`w-4 h-4 ${isSaved ? 'text-[#F26440] fill-[#F26440]' : ''}`} />
                    </button>

                    <div className="absolute bottom-3 right-3 left-3 flex items-center justify-between text-white">
                      <div className="bg-slate-900/90 backdrop-blur-sm px-3 py-1 rounded-lg border border-slate-700 flex items-center gap-1.5">
                        <span className="text-[11px] text-slate-300">مناسبة لك:</span>
                        <span className="text-xs font-bold text-emerald-400">{match.matchPercentage}%</span>
                      </div>
                      <div className="bg-[#0F1E36]/90 backdrop-blur-sm px-3 py-1 rounded-lg border border-slate-700 flex items-center gap-1">
                        <span className="text-[11px] text-slate-300">درجة الوصول:</span>
                        <span className="text-xs font-bold text-teal-300">{event.overallScore}/100</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 flex flex-col flex-grow justify-between space-y-4">
                    <div className="space-y-2">
                      <Link href={`/events/${event.id}`}>
                        <h3 className="font-bold text-base text-[#0F1E36] hover:text-brand-teal transition line-clamp-1">
                          {event.title}
                        </h3>
                      </Link>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {event.description}
                      </p>
                      <div className="space-y-1 pt-1 text-xs text-slate-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{event.eventDate} • {event.startTime}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span className="truncate">{event.locationName}</span>
                        </div>
                      </div>
                    </div>

                    <Link 
                      href={`/events/${event.id}`}
                      className="w-full bg-slate-900 hover:bg-brand-teal text-white text-xs font-semibold py-2.5 px-4 rounded-xl transition flex items-center justify-center gap-2"
                    >
                      <span>عرض التفاصيل والمسار الميسر</span>
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#0F1E36] text-slate-300 border-t border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-right space-y-4">
          <span className="font-bold text-xl text-white block">مَعَك — فعاليات للجميع بلا عوائق</span>
          <p className="text-xs text-slate-400 max-w-xl">
            منصة وطنية متوافقة مع معايير الوصول العالمية WCAG AA لتمكين الجميع من الاستمتاع بكافة الفعاليات.
          </p>
          <div className="text-xs text-slate-500 pt-4 border-t border-slate-800">
            جميع الحقوق محفوظة لمنصة «مَعَك» © 2026
          </div>
        </div>
      </footer>
    </div>
  );
}
