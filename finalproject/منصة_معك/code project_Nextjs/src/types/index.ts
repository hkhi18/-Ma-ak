export type AccessibilityPillar = 'mobility' | 'hearing' | 'vision' | 'sensory';

export interface AccessibilityFeatureDef {
  id: string;
  name: string;
  pillar: AccessibilityPillar;
  description: string;
  iconName: string;
  weight: number;
}

export interface UserNeedsProfile {
  id?: string;
  userId?: string;
  fullName: string;
  email: string;
  phone?: string;
  mobilityNeeds: {
    wheelchair: boolean;
    ramps: boolean;
    elevators: boolean;
    accessibleParking: boolean;
    accessibleRestrooms: boolean;
    stepFreeRoute: boolean;
  };
  hearingNeeds: {
    signLanguage: boolean;
    liveCaptions: boolean;
    hearingLoop: boolean;
    visualAlerts: boolean;
  };
  visionNeeds: {
    audioDescription: boolean;
    brailleSignage: boolean;
    highContrast: boolean;
    tactilePaving: boolean;
    guideDogPermitted: boolean;
  };
  sensoryNeeds: {
    quietRoom: boolean;
    lowLighting: boolean;
    lowNoise: boolean;
    sensoryMap: boolean;
  };
}

export interface EventAccessibilityFeatures {
  // الحركي
  hasWheelchairAccess: boolean;
  hasRamps: boolean;
  hasAccessibleElevators: boolean;
  hasAccessibleParking: boolean;
  hasAccessibleRestrooms: boolean;
  hasStepFreeRoute: boolean;
  
  // السمعي
  hasSignLanguageInterpreter: boolean;
  hasLiveCaptions: boolean;
  hasHearingLoop: boolean;
  hasVisualAlerts: boolean;
  
  // البصري
  hasAudioDescription: boolean;
  hasBrailleSignage: boolean;
  hasHighContrastSignage: boolean;
  hasTactilePaving: boolean;
  allowsGuideDogs: boolean;
  
  // الحسي
  hasQuietRoom: boolean;
  hasLowLightingArea: boolean;
  hasLowNoiseEnvironment: boolean;
  hasSensoryFriendlySchedule: boolean;
}

export interface PillarBreakdown {
  mobility: number;  // 0 - 100
  hearing: number;   // 0 - 100
  vision: number;    // 0 - 100
  sensory: number;   // 0 - 100
}

export interface EventItem {
  id: string;
  title: string;
  description: string;
  category: string;
  city: 'الرياض' | 'جدة' | 'الدمام' | 'الخبر' | 'مكة المكرمة' | 'المدينة المنورة';
  locationName: string;
  address: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  price: string;
  imageUrl: string;
  facilityImages: string[];
  organizerId: string;
  organizerName: string;
  features: EventAccessibilityFeatures;
  overallScore: number;
  pillarScores: PillarBreakdown;
  reviewsCount: number;
  averageRating: number;
  featured?: boolean;
}

export interface MatchResult {
  eventId: string;
  matchPercentage: number;
  matchedRequirementsCount: number;
  totalUserRequirementsCount: number;
  breakdown: {
    pillar: AccessibilityPillar;
    matched: number;
    total: number;
    percentage: number;
  }[];
  unmetNeeds: string[];
}

export interface EventReview {
  id: string;
  eventId: string;
  userId: string;
  userName: string;
  mobilityRating: number;
  hearingRating: number;
  visionRating: number;
  sensoryRating: number;
  overallRating: number;
  comment: string;
  createdAt: string;
  verifiedAttendee: boolean;
}

export interface IssueReport {
  id: string;
  eventId: string;
  userId: string;
  category: 'حركي' | 'سمعي' | 'بصري' | 'حسي' | 'معلومات غير دقيقة' | 'أخرى';
  description: string;
  status: 'قيد المراجعة' | 'تم التحقق' | 'تمت المعالجة';
  createdAt: string;
}

export interface ImageAnalysisReport {
  status: 'success' | 'error';
  detectedFeatures: {
    feature: string;
    status: 'متوفر' | 'غير متوفر' | 'يحتاج تحسين';
    confidence: number;
    note: string;
  }[];
  accessibilityVerdict: string;
  estimatedAccessibilityScore: number;
  recommendations: string[];
}
