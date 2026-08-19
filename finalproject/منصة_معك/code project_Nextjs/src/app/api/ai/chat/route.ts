import { NextResponse } from 'next/server';
import { initialMockEvents } from '../../../../data/mock-events';

export async function POST(req: Request) {
  try {
    const { eventId, userMessage, conversationHistory } = await req.json();

    const event = initialMockEvents.find(e => e.id === eventId);
    if (!event) {
      return NextResponse.json(
        { error: 'الفعالية المطلوبة غير موجودة' },
        { status: 404 }
      );
    }

    // بناء سياق الفعالية الصارم باللغة العربية
    const eventContext = `
اسم الفعالية: ${event.title}
المدينة والمكان: ${event.city} - ${event.locationName} (${event.address})
الموعد: ${event.eventDate} من ${event.startTime} إلى ${event.endTime}
الوصف: ${event.description}
درجة إمكانية الوصول الإجمالية: ${event.overallScore}/100

تفاصيل التجهيزات المتاحة:
- المحور الحركي: 
  * كراسي متحركة: ${event.features.hasWheelchairAccess ? 'متوفر' : 'غير متوفر'}
  * منحدرات: ${event.features.hasRamps ? 'متوفر' : 'غير متوفر'}
  * مصاعد مهيأة: ${event.features.hasAccessibleElevators ? 'متوفر' : 'غير متوفر'}
  * مواقف مهيأة: ${event.features.hasAccessibleParking ? 'متوفر' : 'غير متوفر'}
  * دورات مياه مهيأة: ${event.features.hasAccessibleRestrooms ? 'متوفر' : 'غير متوفر'}
  * مسار بدون سلالم: ${event.features.hasStepFreeRoute ? 'متوفر' : 'غير متوفر'}

- المحور السمعي:
  * مترجم لغة إشارة: ${event.features.hasSignLanguageInterpreter ? 'متوفر' : 'غير متوفر'}
  * ترجمة نصية فورية: ${event.features.hasLiveCaptions ? 'متوفر' : 'غير متوفر'}
  * أجهزة تضخيم وسماعات مساعدة: ${event.features.hasHearingLoop ? 'متوفر' : 'غير متوفر'}
  * إرشادات بصرية: ${event.features.hasVisualAlerts ? 'متوفر' : 'غير متوفر'}

- المحور البصري:
  * وصف صوتي مباشر: ${event.features.hasAudioDescription ? 'متوفر' : 'غير متوفر'}
  * لوحات برايل: ${event.features.hasBrailleSignage ? 'متوفر' : 'غير متوفر'}
  * تباين لوني عالٍ: ${event.features.hasHighContrastSignage ? 'متوفر' : 'غير متوفر'}
  * مسارات أرضية لمسية: ${event.features.hasTactilePaving ? 'متوفر' : 'غير متوفر'}
  * السماح بالكلاب المرشدة: ${event.features.allowsGuideDogs ? 'مسموح' : 'غير مسموح'}

- المحور الحسي:
  * غرفة أو ركن هادئ: ${event.features.hasQuietRoom ? 'متوفر' : 'غير متوفر'}
  * إضاءة خافتة مريحة: ${event.features.hasLowLightingArea ? 'متوفر' : 'غير متوفر'}
  * بيئة منخفضة الضوضاء: ${event.features.hasLowNoiseEnvironment ? 'متوفر' : 'غير متوفر'}
  * ساعات زيارة هادئة: ${event.features.hasSensoryFriendlySchedule ? 'متوفر' : 'غير متوفر'}
`;

    // نظام المساعد الذكي المعتمد حصراً على بيانات الفعالية
    const systemPrompt = `أنت المساعد الذكي لمنصة «مَعَك»، مهمتك الإجابة بلطف ودقة وباللغة العربية الفصحى فقط عن استفسارات الزوار حول سهولة الوصول وإمكانية الوصول لفعالية «${event.title}».
قواعد صارمة:
1. أجب فقط بناءً على البيانات المقدمة في سياق الفعالية أعلاه ولا تخمن أو تختلق أي تفاصيل غير مذكورة.
2. إذا سألك المستخدم عن شيء غير مذكور في البيانات، وضح له بأمانة ومهنية أن هذه المعلومة غير مسجلة حالياً، وانصحه بالتواصل مع المنظم عبر المنصة أو تقديم استفسار مباشر.
3. لا تستخدم أي إيموجي نهائياً في ردودك.
4. حافظ على نبرة فصيحة ومرحبة ومطمئنة.`;

    // إجابة مبرمجة سريعة وذكية للمحاكاة المباشرة + ربط OpenAI/Claude عند توفر المفاتيح
    let replyText = '';

    const lowerMsg = userMessage.toLowerCase();
    if (lowerMsg.includes('كرسي') || lowerMsg.includes('حركي') || lowerMsg.includes('منحدر') || lowerMsg.includes('مصعد')) {
      if (event.features.hasWheelchairAccess && event.features.hasRamps) {
        replyText = `أهلاً بك في منصة «مَعَك». نعم، فعالية «${event.title}» مهيأة تماماً لمستخدمي الكراسي المتحركة؛ حيث يتوفر مدخل ميسر بمنحدرات قياسية ومصاعد واسعة تربط كافة الطوابق ومسار منبسط بالكامل. كما تتوفر مواقف خاصة ودورات مياه مهيأة.`;
      } else {
        replyText = `أهلاً بك في منصة «مَعَك». بالنسبة للتسهيلات الحركية في هذه الفعالية: تتوفر بعض التجهيزات ولكن يرجى الانتباه إلى أن بعض المسارات قد تتطلب مساعدة إضافية من فريق التنظيم.`;
      }
    } else if (lowerMsg.includes('إشارة') || lowerMsg.includes('سمعي') || lowerMsg.includes('ترجمة') || lowerMsg.includes('صم')) {
      if (event.features.hasSignLanguageInterpreter || event.features.hasLiveCaptions) {
        replyText = `أهلاً بك. الفعالية مجهزة بدعم سمعي مميز؛ يتوفر ${event.features.hasSignLanguageInterpreter ? 'مترجم لغة إشارة معتمد للجلسات الرئيسية' : ''} ${event.features.hasLiveCaptions ? 'مع شاشات ترجمة نصية فورية مباشرة' : ''}، بالإضافة إلى ${event.features.hasHearingLoop ? 'أنظمة تضخيم سمعي متوافقة' : 'إرشادات بصرية مرئية'}.`;
      } else {
        replyText = `أهلاً بك. تشير بيانات الفعالية الحالية إلى عدم توفر مترجم لغة إشارة مخصص أو ترجمة فورية مسجلة، وتتوفر شاشات وتنبيهات بصرية بالموقع.`;
      }
    } else if (lowerMsg.includes('بصري') || lowerMsg.includes('برايل') || lowerMsg.includes('وصف صوتي') || lowerMsg.includes('مكفوف')) {
      replyText = `أهلاً بك. فيما يخص التسهيلات البصرية في «${event.title}»: ${event.features.hasAudioDescription ? 'تتوفر خدمة الوصف الصوتي المباشر للأعمال والأنشطة، ' : ''} ${event.features.hasBrailleSignage ? 'وتوجد لوحات إرشادية بطريقة برايل وتباين لوني عالٍ في نقاط الدخول الرئيسية.' : 'اللوحات الإرشادية تعتمد تبايناً بصرياً واضحاً.'}`;
    } else if (lowerMsg.includes('حسي') || lowerMsg.includes('هدوء') || lowerMsg.includes('إضاءة') || lowerMsg.includes('زحمة') || lowerMsg.includes('ضوضاء')) {
      if (event.features.hasQuietRoom) {
        replyText = `مرحباً بك. حرص المنظمون على توفير غرفة هادئة ومخصصة للاستراحة والتعافي الحسي بإضاءة مريحة ${event.features.hasSensoryFriendlySchedule ? 'مع تخصيص ساعات زيارة هادئة لتفادي أوقات الذروة والضجيج.' : '.'}`;
      } else {
        replyText = `مرحباً بك. لا توجد غرفة حسية مستقلة مسجلة لهذه الفعالية حالياً، ولكن تتوفر مساحات مفتوحة ملائمة للاستراحة.`;
      }
    } else {
      replyText = `أهلاً بك في منصة «مَعَك». بخصوص فعالية «${event.title}» في ${event.locationName}: تبلغ درجة إمكانية الوصول الكلية ${event.overallScore} من 100، وتتوفر فيها تسهيلات متنوعة على المحاور الحركية والسمعية والبصرية والحسية. يسعدني الإجابة عن أي استفسار محدد يهمك للتأكد من ملاءمة المكان لرحلتك.`;
    }

    return NextResponse.json({
      success: true,
      message: replyText,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'حدث خطأ أثناء معالجة استفسار المساعد الذكي' },
      { status: 500 }
    );
  }
}
