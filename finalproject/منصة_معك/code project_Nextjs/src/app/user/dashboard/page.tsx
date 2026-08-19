'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { defaultUserProfile } from '../../../data/mock-events';
import { Wheelchair, Ear, Eye, Brain, Check, ArrowRight } from 'lucide-react';

export default function UserDashboardPage() {
  const [profile, setProfile] = useState(defaultUserProfile);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 flex-grow">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#0F1E36]">{profile.fullName}</h1>
            <p className="text-xs text-slate-500 mt-1">{profile.email} • زائر مفعل</p>
          </div>
          <button onClick={handleSave} className="bg-brand-teal text-white text-xs font-semibold px-5 py-2.5 rounded-xl">
            حفظ التفضيلات
          </button>
        </div>

        {saved && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl text-xs flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>تم حفظ احتياجات الوصول بنجاح!</span>
          </div>
        )}

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-[#0F1E36]">تخصيص احتياجات الوصول (المحاور الأربعة)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-teal-200 bg-teal-50/30 p-5 rounded-2xl space-y-2 text-xs">
              <div className="font-bold text-teal-950 flex items-center gap-2 mb-2">
                <Wheelchair className="w-4 h-4 text-brand-teal" />
                <span>المحور الحركي</span>
              </div>
              <label className="flex items-center gap-2"><input type="checkbox" checked={profile.mobilityNeeds.wheelchair} onChange={(e) => setProfile({...profile, mobilityNeeds: {...profile.mobilityNeeds, wheelchair: e.target.checked}})} /> <span>استخدام الكرسي المتحرك</span></label>
              <label className="flex items-center gap-2"><input type="checkbox" checked={profile.mobilityNeeds.ramps} onChange={(e) => setProfile({...profile, mobilityNeeds: {...profile.mobilityNeeds, ramps: e.target.checked}})} /> <span>منحدرات ممهدة</span></label>
              <label className="flex items-center gap-2"><input type="checkbox" checked={profile.mobilityNeeds.elevators} onChange={(e) => setProfile({...profile, mobilityNeeds: {...profile.mobilityNeeds, elevators: e.target.checked}})} /> <span>مصاعد مهيأة</span></label>
            </div>

            <div className="border border-rose-200 bg-rose-50/30 p-5 rounded-2xl space-y-2 text-xs">
              <div className="font-bold text-rose-950 flex items-center gap-2 mb-2">
                <Ear className="w-4 h-4 text-brand-coral" />
                <span>المحور السمعي</span>
              </div>
              <label className="flex items-center gap-2"><input type="checkbox" checked={profile.hearingNeeds.signLanguage} onChange={(e) => setProfile({...profile, hearingNeeds: {...profile.hearingNeeds, signLanguage: e.target.checked}})} /> <span>مترجم لغة إشارة</span></label>
              <label className="flex items-center gap-2"><input type="checkbox" checked={profile.hearingNeeds.liveCaptions} onChange={(e) => setProfile({...profile, hearingNeeds: {...profile.hearingNeeds, liveCaptions: e.target.checked}})} /> <span>ترجمة نصية فورية</span></label>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

cat << 'EOF' > /working_dir/c_0265900e4d7893b4/maak-platform/src/app/organizer/dashboard/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { initialMockEvents } from '../../../data/mock-events';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function OrganizerDashboardPage() {
  const [events] = useState(initialMockEvents);

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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 flex-grow">
        <div className="bg-[#0F1E36] text-white rounded-3xl p-6 sm:p-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">لوحة تحكم المنظم</h1>
            <p className="text-xs text-slate-300 mt-1">إدارة الفعاليات وفحص جاهزية الوصول بالذكاء الاصطناعي</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-[#0F1E36]">الفعاليات المسجلة تحت إدارتك</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {events.map(e => (
              <div key={e.id} className="p-4 border rounded-2xl flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-[#0F1E36]">{e.title}</h3>
                  <span className="text-xs text-brand-teal font-semibold">درجة الوصول: {e.overallScore}/100</span>
                </div>
                <Link href={`/events/${e.id}`} className="text-xs bg-slate-900 text-white px-3 py-1.5 rounded-lg">
                  عرض
                </Link>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
