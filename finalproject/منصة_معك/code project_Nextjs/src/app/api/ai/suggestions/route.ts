import { NextResponse } from 'next/server';
import { generateSmartImprovements, calculateOverallScore } from '../../../../lib/accessibility-engine';
import { EventAccessibilityFeatures } from '../../../../types';

export async function POST(req: Request) {
  try {
    const { features } = await req.json() as { features: EventAccessibilityFeatures };

    const { overallScore, pillarScores } = calculateOverallScore(features);
    const suggestions = generateSmartImprovements(features);

    return NextResponse.json({
      success: true,
      overallScore,
      pillarScores,
      suggestions,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'فشل استخراج التوصيات الذكية' },
      { status: 500 }
    );
  }
}
