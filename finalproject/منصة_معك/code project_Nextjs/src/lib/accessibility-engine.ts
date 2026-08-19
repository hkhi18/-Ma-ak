import { 
  EventAccessibilityFeatures, 
  PillarBreakdown, 
  UserNeedsProfile, 
  MatchResult, 
  AccessibilityPillar 
} from '../types';

export function calculatePillarScores(features: EventAccessibilityFeatures): PillarBreakdown {
  // المحور الحركي (الوزن الكلي: 100)
  let mobility = 0;
  if (features.hasWheelchairAccess) mobility += 25;
  if (features.hasRamps) mobility += 20;
  if (features.hasAccessibleElevators) mobility += 15;
  if (features.hasAccessibleParking) mobility += 15;
  if (features.hasAccessibleRestrooms) mobility += 15;
  if (features.hasStepFreeRoute) mobility += 10;

  // المحور السمعي (الوزن الكلي: 100)
  let hearing = 0;
  if (features.hasSignLanguageInterpreter) hearing += 35;
  if (features.hasLiveCaptions) hearing += 30;
  if (features.hasHearingLoop) hearing += 20;
  if (features.hasVisualAlerts) hearing += 15;

  // المحور البصري (الوزن الكلي: 100)
  let vision = 0;
  if (features.hasAudioDescription) vision += 30;
  if (features.hasBrailleSignage) vision += 25;
  if (features.hasHighContrastSignage) vision += 20;
  if (features.hasTactilePaving) vision += 15;
  if (features.allowsGuideDogs) vision += 10;

  // المحور الحسي (الوزن الكلي: 100)
  let sensory = 0;
  if (features.hasQuietRoom) sensory += 35;
  if (features.hasLowLightingArea) sensory += 20;
  if (features.hasLowNoiseEnvironment) sensory += 25;
  if (features.hasSensoryFriendlySchedule) sensory += 20;

  return {
    mobility: Math.min(100, mobility),
    hearing: Math.min(100, hearing),
    vision: Math.min(100, vision),
    sensory: Math.min(100, sensory),
  };
}

export function calculateOverallScore(features: EventAccessibilityFeatures): {
  overallScore: number;
  pillarScores: PillarBreakdown;
} {
  const pillarScores = calculatePillarScores(features);
  const overallScore = Math.round(
    (pillarScores.mobility + pillarScores.hearing + pillarScores.vision + pillarScores.sensory) / 4
  );

  return {
    overallScore,
    pillarScores,
  };
}

export function calculatePersonalMatch(
  userProfile: UserNeedsProfile,
  eventFeatures: EventAccessibilityFeatures
): MatchResult {
  const requirements: {
    key: string;
    label: string;
    pillar: AccessibilityPillar;
    userNeedsIt: boolean;
    eventHasIt: boolean;
  }[] = [
    // حركي
    { key: 'wheelchair', label: 'مسارات كراسي متحركة', pillar: 'mobility', userNeedsIt: userProfile.mobilityNeeds.wheelchair, eventHasIt: eventFeatures.hasWheelchairAccess },
    { key: 'ramps', label: 'منحدرات مجهزة', pillar: 'mobility', userNeedsIt: userProfile.mobilityNeeds.ramps, eventHasIt: eventFeatures.hasRamps },
    { key: 'elevators', label: 'مصاعد ميسرة', pillar: 'mobility', userNeedsIt: userProfile.mobilityNeeds.elevators, eventHasIt: eventFeatures.hasAccessibleElevators },
    { key: 'parking', label: 'مواقف سيارات مهيأة', pillar: 'mobility', userNeedsIt: userProfile.mobilityNeeds.accessibleParking, eventHasIt: eventFeatures.hasAccessibleParking },
    { key: 'restrooms', label: 'دورات مياه مهيأة', pillar: 'mobility', userNeedsIt: userProfile.mobilityNeeds.accessibleRestrooms, eventHasIt: eventFeatures.hasAccessibleRestrooms },
    { key: 'stepFree', label: 'مسار خالٍ من العوائق والسلالم', pillar: 'mobility', userNeedsIt: userProfile.mobilityNeeds.stepFreeRoute, eventHasIt: eventFeatures.hasStepFreeRoute },

    // سمعي
    { key: 'signLang', label: 'لغة الإشارة', pillar: 'hearing', userNeedsIt: userProfile.hearingNeeds.signLanguage, eventHasIt: eventFeatures.hasSignLanguageInterpreter },
    { key: 'captions', label: 'ترجمة نصية فورية', pillar: 'hearing', userNeedsIt: userProfile.hearingNeeds.liveCaptions, eventHasIt: eventFeatures.hasLiveCaptions },
    { key: 'hearingLoop', label: 'أنظمة مساعدة سمعية', pillar: 'hearing', userNeedsIt: userProfile.hearingNeeds.hearingLoop, eventHasIt: eventFeatures.hasHearingLoop },
    { key: 'visualAlerts', label: 'تنبيهات وإرشادات بصرية', pillar: 'hearing', userNeedsIt: userProfile.hearingNeeds.visualAlerts, eventHasIt: eventFeatures.hasVisualAlerts },

    // بصري
    { key: 'audioDesc', label: 'وصف صوتي مباشر', pillar: 'vision', userNeedsIt: userProfile.visionNeeds.audioDescription, eventHasIt: eventFeatures.hasAudioDescription },
    { key: 'braille', label: 'لوحات برايل الإرشادية', pillar: 'vision', userNeedsIt: userProfile.visionNeeds.brailleSignage, eventHasIt: eventFeatures.hasBrailleSignage },
    { key: 'contrast', label: 'لوحات تباين بصري عالٍ', pillar: 'vision', userNeedsIt: userProfile.visionNeeds.highContrast, eventHasIt: eventFeatures.hasHighContrastSignage },
    { key: 'tactile', label: 'مسارات أرضية لمسية', pillar: 'vision', userNeedsIt: userProfile.visionNeeds.tactilePaving, eventHasIt: eventFeatures.hasTactilePaving },
    { key: 'guideDog', label: 'السماح بالكلاب المرشدة', pillar: 'vision', userNeedsIt: userProfile.visionNeeds.guideDogPermitted, eventHasIt: eventFeatures.allowsGuideDogs },

    // حسي
    { key: 'quietRoom', label: 'غرفة أو ركن استراحة هادئ', pillar: 'sensory', userNeedsIt: userProfile.sensoryNeeds.quietRoom, eventHasIt: eventFeatures.hasQuietRoom },
    { key: 'lowLighting', label: 'إضاءة خافتة غير متوهجة', pillar: 'sensory', userNeedsIt: userProfile.sensoryNeeds.lowLighting, eventHasIt: eventFeatures.hasLowLightingArea },
    { key: 'lowNoise', label: 'بيئة منخفضة الضوضاء', pillar: 'sensory', userNeedsIt: userProfile.sensoryNeeds.lowNoise, eventHasIt: eventFeatures.hasLowNoiseEnvironment },
    { key: 'sensorySchedule', label: 'جدول مواعيد لتجنب أوقات الذروة', pillar: 'sensory', userNeedsIt: userProfile.sensoryNeeds.sensoryMap, eventHasIt: eventFeatures.hasSensoryFriendlySchedule },
  ];

  const activeUserRequirements = requirements.filter(r => r.userNeedsIt);

  if (activeUserRequirements.length === 0) {
    const { overallScore } = calculateOverallScore(eventFeatures);
    return {
      eventId: '',
      matchPercentage: overallScore,
      matchedRequirementsCount: 0,
      totalUserRequirementsCount: 0,
      breakdown: [
        { pillar: 'mobility', matched: 0, total: 0, percentage: 100 },
        { pillar: 'hearing', matched: 0, total: 0, percentage: 100 },
        { pillar: 'vision', matched: 0, total: 0, percentage: 100 },
        { pillar: 'sensory', matched: 0, total: 0, percentage: 100 },
      ],
      unmetNeeds: [],
    };
  }

  let matchedCount = 0;
  const unmetNeeds: string[] = [];

  const pillars: AccessibilityPillar[] = ['mobility', 'hearing', 'vision', 'sensory'];
  const breakdown = pillars.map(pillar => {
    const pillarReqs = activeUserRequirements.filter(r => r.pillar === pillar);
    const pillarMatched = pillarReqs.filter(r => r.eventHasIt).length;
    return {
      pillar,
      matched: pillarMatched,
      total: pillarReqs.length,
      percentage: pillarReqs.length > 0 ? Math.round((pillarMatched / pillarReqs.length) * 100) : 100,
    };
  });

  activeUserRequirements.forEach(req => {
    if (req.eventHasIt) {
      matchedCount++;
    } else {
      unmetNeeds.push(req.label);
    }
  });

  const matchPercentage = Math.round((matchedCount / activeUserRequirements.length) * 100);

  return {
    eventId: '',
    matchPercentage,
    matchedRequirementsCount: matchedCount,
    totalUserRequirementsCount: activeUserRequirements.length,
    breakdown,
    unmetNeeds,
  };
}

export function generateSmartImprovements(features: EventAccessibilityFeatures): {
  pillar: string;
  suggestion: string;
  impactScoreIncrease: number;
  priority: 'عالية' | 'متوسطة' | 'منخفضة';
}[] {
  const suggestions: {
    pillar: string;
    suggestion: string;
    impactScoreIncrease: number;
    priority: 'عالية' | 'متوسطة' | 'منخفضة';
  }[] = [];

  if (!features.hasWheelchairAccess || !features.hasRamps) {
    suggestions.push({
      pillar: 'المحور الحركي',
      suggestion: 'توفير منحدرات قياسية عند المدخل الرئيسي بميل لا يتجاوز 1:12 مع حواف جانبية آمنة.',
      impactScoreIncrease: 12,
      priority: 'عالية',
    });
  }

  if (!features.hasAccessibleRestrooms) {
    suggestions.push({
      pillar: 'المحور الحركي',
      suggestion: 'تجهيز دورة مياه ميسرة بأبواب واسعة وقضبان مساندة ومساحة دوران كافية.',
      impactScoreIncrease: 10,
      priority: 'عالية',
    });
  }

  if (!features.hasSignLanguageInterpreter) {
    suggestions.push({
      pillar: 'المحور السمعي',
      suggestion: 'التعاقد مع مترجم لغة إشارة معتمد للجلسات الرئيسية والعروض المسرحية.',
      impactScoreIncrease: 15,
      priority: 'عالية',
    });
  }

  if (!features.hasLiveCaptions) {
    suggestions.push({
      pillar: 'المحور السمعي',
      suggestion: 'تفعيل الترجمة النصية الفورية (Live Captions) على الشاشات الرئيسية وعبر رابط هاتف للزوار.',
      impactScoreIncrease: 12,
      priority: 'عالية',
    });
  }

  if (!features.hasAudioDescription) {
    suggestions.push({
      pillar: 'المحور البصري',
      suggestion: 'إضافة خدمة الوصف الصوتي المباشر للأعمال الفنية أو الأنشطة البصرية عبر سماعات خاصة.',
      impactScoreIncrease: 12,
      priority: 'متوسطة',
    });
  }

  if (!features.hasBrailleSignage || !features.hasHighContrastSignage) {
    suggestions.push({
      pillar: 'المحور البصري',
      suggestion: 'تركيب لوحات إرشادية بخط كبير وتباين لوني واضح وبرايل عند نقاط الاستقبال والمصاعد.',
      impactScoreIncrease: 8,
      priority: 'متوسطة',
    });
  }

  if (!features.hasQuietRoom) {
    suggestions.push({
      pillar: 'المحور الحسي',
      suggestion: 'تخصيص ركن أو غرفة هادئة بإضاءة مريحة وعوازل صوتية لمرتادي الفعالية من ذوي الحساسية الحسية.',
      impactScoreIncrease: 14,
      priority: 'عالية',
    });
  }

  if (!features.hasLowNoiseEnvironment && !features.hasSensoryFriendlySchedule) {
    suggestions.push({
      pillar: 'المحور الحسي',
      suggestion: 'تخصيص ساعة استكشاف هادئة قبل الافتتاح العام مع تخفيض مكبرات الصوت والمؤثرات الضوئية.',
      impactScoreIncrease: 8,
      priority: 'منخفضة',
    });
  }

  return suggestions;
}
