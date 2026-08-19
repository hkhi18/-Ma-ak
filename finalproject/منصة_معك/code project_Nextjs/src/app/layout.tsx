import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'مَعَك | فعاليات للجميع بلا عوائق',
  description: 'منصة وطنية متقدمة تتيح للأشخاص ذوي الإعاقة استكشاف الفعاليات المناسبة لاحتياجاتهم قبل الحضور، وتساعد المنظمين على تقييم وتحسين مستوى سهولة الوصول.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-['IBM_Plex_Sans_Arabic',sans-serif] bg-slate-50 text-slate-900 antialiased min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
