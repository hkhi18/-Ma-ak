-- ==============================================================================
-- مخطط قاعدة بيانات منصة «مَعَك» (Ma'ak Accessibility Platform Schema)
-- متوافق مع Supabase PostgreSQL 15+ و Auth و Storage و RLS
-- ==============================================================================

-- 1. تفعيل الامتدادات اللازمة
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. إنشاء الأنواع المخصصة (Custom ENUMs)
CREATE TYPE user_role AS ENUM ('visitor', 'organizer', 'admin');
CREATE TYPE report_status AS ENUM ('قيد المراجعة', 'تم التحقق', 'تمت المعالجة', 'مرفوض');
CREATE TYPE event_city AS ENUM ('الرياض', 'جدة', 'الدمام', 'الخبر', 'مكة المكرمة', 'المدينة المنورة');

-- 3. جدول الملفات الشخصية للمستخدمين (Profiles)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    role user_role DEFAULT 'visitor' NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 4. جدول احتياجات سهولة الوصول للمستخدم (User Accessibility Needs)
CREATE TABLE IF NOT EXISTS public.user_accessibility_needs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
    mobility_needs JSONB DEFAULT '{"wheelchair": false, "ramps": false, "elevators": false, "accessibleParking": false, "accessibleRestrooms": false, "stepFreeRoute": false}'::jsonb NOT NULL,
    hearing_needs JSONB DEFAULT '{"signLanguage": false, "liveCaptions": false, "hearingLoop": false, "visualAlerts": false}'::jsonb NOT NULL,
    vision_needs JSONB DEFAULT '{"audioDescription": false, "brailleSignage": false, "highContrast": false, "tactilePaving": false, "guideDogPermitted": false}'::jsonb NOT NULL,
    sensory_needs JSONB DEFAULT '{"quietRoom": false, "lowLighting": false, "lowNoise": false, "sensoryMap": false}'::jsonb NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 5. جدول الفعاليات (Events)
CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organizer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    city event_city NOT NULL,
    location_name TEXT NOT NULL,
    address TEXT NOT NULL,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    event_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    price TEXT DEFAULT 'مجاني' NOT NULL,
    image_url TEXT NOT NULL,
    facility_images TEXT[] DEFAULT '{}'::TEXT[],
    overall_accessibility_score INT DEFAULT 0 NOT NULL,
    pillar_scores JSONB DEFAULT '{"mobility": 0, "hearing": 0, "vision": 0, "sensory": 0}'::jsonb NOT NULL,
    is_published BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 6. جدول تجهيزات سهولة الوصول للفعالية (Event Accessibility Details)
CREATE TABLE IF NOT EXISTS public.event_accessibility (
    event_id UUID PRIMARY KEY REFERENCES public.events(id) ON DELETE CASCADE,
    -- المحور الحركي
    has_wheelchair_access BOOLEAN DEFAULT false NOT NULL,
    has_ramps BOOLEAN DEFAULT false NOT NULL,
    has_accessible_elevators BOOLEAN DEFAULT false NOT NULL,
    has_accessible_parking BOOLEAN DEFAULT false NOT NULL,
    has_accessible_restrooms BOOLEAN DEFAULT false NOT NULL,
    has_step_free_route BOOLEAN DEFAULT false NOT NULL,
    -- المحور السمعي
    has_sign_language_interpreter BOOLEAN DEFAULT false NOT NULL,
    has_live_captions BOOLEAN DEFAULT false NOT NULL,
    has_hearing_loop BOOLEAN DEFAULT false NOT NULL,
    has_visual_alerts BOOLEAN DEFAULT false NOT NULL,
    -- المحور البصري
    has_audio_description BOOLEAN DEFAULT false NOT NULL,
    has_braille_signage BOOLEAN DEFAULT false NOT NULL,
    has_high_contrast_signage BOOLEAN DEFAULT false NOT NULL,
    has_tactile_paving BOOLEAN DEFAULT false NOT NULL,
    allows_guide_dogs BOOLEAN DEFAULT false NOT NULL,
    -- المحور الحسي
    has_quiet_room BOOLEAN DEFAULT false NOT NULL,
    has_low_lighting_area BOOLEAN DEFAULT false NOT NULL,
    has_low_noise_environment BOOLEAN DEFAULT false NOT NULL,
    has_sensory_friendly_schedule BOOLEAN DEFAULT false NOT NULL,
    custom_notes TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 7. جدول الفعاليات المحفوظة / المفضلة (Saved Events)
CREATE TABLE IF NOT EXISTS public.saved_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    UNIQUE(user_id, event_id)
);

-- 8. جدول تقييمات إمكانية الوصول بعد الحضور (Event Accessibility Reviews)
CREATE TABLE IF NOT EXISTS public.event_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    mobility_rating INT CHECK (mobility_rating BETWEEN 1 AND 5) NOT NULL,
    hearing_rating INT CHECK (hearing_rating BETWEEN 1 AND 5) NOT NULL,
    vision_rating INT CHECK (vision_rating BETWEEN 1 AND 5) NOT NULL,
    sensory_rating INT CHECK (sensory_rating BETWEEN 1 AND 5) NOT NULL,
    overall_rating INT CHECK (overall_rating BETWEEN 1 AND 5) NOT NULL,
    comment TEXT,
    is_verified_attendee BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 9. جدول بلاغات العوائق والمعلومات غير الدقيقة (Accessibility Issue Reports)
CREATE TABLE IF NOT EXISTS public.accessibility_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    status report_status DEFAULT 'قيد المراجعة' NOT NULL,
    evidence_image_url TEXT,
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 10. جدول تقارير تحليل الصور بالذكاء الاصطناعي (AI Image Analyses)
CREATE TABLE IF NOT EXISTS public.ai_image_analyses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    organizer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    detected_features JSONB NOT NULL,
    accessibility_score_estimate INT NOT NULL,
    verdict TEXT NOT NULL,
    recommendations TEXT[] DEFAULT '{}'::TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- ==============================================================================
-- دوال وحسابات درجات إمكانية الوصول التلقائية (Triggers & Stored Procedures)
-- ==============================================================================

CREATE OR REPLACE FUNCTION update_event_accessibility_score()
RETURNS TRIGGER AS $$
DECLARE
    m_score INT := 0;
    h_score INT := 0;
    v_score INT := 0;
    s_score INT := 0;
    tot_score INT := 0;
BEGIN
    -- حساب المحور الحركي
    IF NEW.has_wheelchair_access THEN m_score := m_score + 25; END IF;
    IF NEW.has_ramps THEN m_score := m_score + 20; END IF;
    IF NEW.has_accessible_elevators THEN m_score := m_score + 15; END IF;
    IF NEW.has_accessible_parking THEN m_score := m_score + 15; END IF;
    IF NEW.has_accessible_restrooms THEN m_score := m_score + 15; END IF;
    IF NEW.has_step_free_route THEN m_score := m_score + 10; END IF;
    IF m_score > 100 THEN m_score := 100; END IF;

    -- حساب المحور السمعي
    IF NEW.has_sign_language_interpreter THEN h_score := h_score + 35; END IF;
    IF NEW.has_live_captions THEN h_score := h_score + 30; END IF;
    IF NEW.has_hearing_loop THEN h_score := h_score + 20; END IF;
    IF NEW.has_visual_alerts THEN h_score := h_score + 15; END IF;
    IF h_score > 100 THEN h_score := 100; END IF;

    -- حساب المحور البصري
    IF NEW.has_audio_description THEN v_score := v_score + 30; END IF;
    IF NEW.has_braille_signage THEN v_score := v_score + 25; END IF;
    IF NEW.has_high_contrast_signage THEN v_score := v_score + 20; END IF;
    IF NEW.has_tactile_paving THEN v_score := v_score + 15; END IF;
    IF NEW.allows_guide_dogs THEN v_score := v_score + 10; END IF;
    IF v_score > 100 THEN v_score := 100; END IF;

    -- حساب المحور الحسي
    IF NEW.has_quiet_room THEN s_score := s_score + 35; END IF;
    IF NEW.has_low_lighting_area THEN s_score := s_score + 20; END IF;
    IF NEW.has_low_noise_environment THEN s_score := s_score + 25; END IF;
    IF NEW.has_sensory_friendly_schedule THEN s_score := s_score + 20; END IF;
    IF s_score > 100 THEN s_score := 100; END IF;

    tot_score := ROUND((m_score + h_score + v_score + s_score) / 4.0);

    -- تحديث جدول الفعاليات
    UPDATE public.events
    SET 
        overall_accessibility_score = tot_score,
        pillar_scores = json_build_object(
            'mobility', m_score,
            'hearing', h_score,
            'vision', v_score,
            'sensory', s_score
        )::jsonb,
        updated_at = NOW()
    WHERE id = NEW.event_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_recalculate_accessibility_score
AFTER INSERT OR UPDATE ON public.event_accessibility
FOR EACH ROW EXECUTE FUNCTION update_event_accessibility_score();

-- ==============================================================================
-- سياسات الأمان (Row Level Security - RLS)
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_accessibility_needs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_accessibility ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accessibility_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_image_analyses ENABLE ROW LEVEL SECURITY;

-- سياسات الفعاليات: القراءة متاحة للجميع، الإنشاء والتعديل للمنظم فقط
CREATE POLICY "الفعاليات متاحة للقراءة العامة" ON public.events FOR SELECT USING (true);
CREATE POLICY "المنظم يمكنه إنشاء فعاليات" ON public.events FOR INSERT WITH CHECK (auth.uid() = organizer_id);
CREATE POLICY "المنظم يمكنه تعديل فعالياته" ON public.events FOR UPDATE USING (auth.uid() = organizer_id);
CREATE POLICY "المنظم يمكنه حذف فعالياته" ON public.events FOR DELETE USING (auth.uid() = organizer_id);

-- سياسات تجهيزات الفعاليات
CREATE POLICY "تجهيزات الوصول متاحة للقراءة العامة" ON public.event_accessibility FOR SELECT USING (true);
CREATE POLICY "المنظم يدير تجهيزات الوصول" ON public.event_accessibility FOR ALL USING (
    EXISTS (SELECT 1 FROM public.events WHERE events.id = event_accessibility.event_id AND events.organizer_id = auth.uid())
);

-- سياسات الملف الشخصي والاحتياجات
CREATE POLICY "المستخدم يقرأ ملفه الشخصي" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "المستخدم يعدل ملفه الشخصي" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "المستخدم يدير احتياجاته الخاصة" ON public.user_accessibility_needs FOR ALL USING (auth.uid() = user_id);

-- سياسات التقييمات والحفظ والبلاغات
CREATE POLICY "التقييمات مرئية للجميع" ON public.event_reviews FOR SELECT USING (true);
CREATE POLICY "المستخدم يضيف تقييم" ON public.event_reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "المستخدم يدير فعالياته المفضلة" ON public.saved_events FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "المستخدم يرسل بلاغ" ON public.accessibility_reports FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "المستخدم يرى بلاغاته الخاصة" ON public.accessibility_reports FOR SELECT USING (auth.uid() = user_id);
