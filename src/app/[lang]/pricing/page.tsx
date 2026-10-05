import type { Metadata } from "next";
import Link from "next/link";
import { permanentRedirect } from "next/navigation";
import {
  SUPPORTED_LOCALES,
  LOCALES,
  isValidLocale,
  type SupportedLocale,
} from "@/lib/i18n/config";
import { getTranslations, getHreflangAlternates } from "@/lib/i18n/utils";
import { Breadcrumbs } from "@/components/breadcrumbs";

export function generateStaticParams() {
  return SUPPORTED_LOCALES.filter((locale) => locale !== "en").map((lang) => ({
    lang,
  }));
}

interface LocalizedPricingContent {
  badge: string;
  title: string;
  subtitle: string;
  freeTitle: string;
  freeSub: string;
  freePrice: string;
  freePeriod: string;
  freeCta: string;
  proTitle: string;
  proSub: string;
  proPrice: string;
  proPeriod: string;
  proCta: string;
  popularBadge: string;
  employerTitle: string;
  employerSub: string;
  employerPrice: string;
  employerPeriod: string;
  employerCta: string;
  freeFeatures: string[];
  proFeatures: string[];
  employerFeatures: string[];
  faqsTitle: string;
  faqs: { q: string; a: string }[];
}

const PRICING_LOCALIZATIONS: Record<string, LocalizedPricingContent> = {
  hi: {
    badge: "सरल और पारदर्शी मूल्य निर्धारण",
    title: "7 दिनों का निःशुल्क परीक्षण। कोई क्रेडिट कार्ड आवश्यक नहीं।",
    subtitle: "प्रतिदिन सुबह 10 उच्च-सटीक नौकरियों की डिलीवरी। जब आप तैयार हों, तब प्रो में अपग्रेड करें।",
    freeTitle: "निःशुल्क परीक्षण (Free Trial)",
    freeSub: "7 दिनों के लिए सभी सुविधाओं तक पूर्ण पहुंच",
    freePrice: "₹0",
    freePeriod: "/ 7 दिन",
    freeCta: "निःशुल्क परीक्षण शुरू करें",
    proTitle: "डेकाजॉब्स प्रो (DecaJobs Pro)",
    proSub: "दैनिक 10 मैच और सभी 12+ AI करियर टूल्स",
    proPrice: "₹299",
    proPeriod: "/ माह",
    proCta: "प्रो में अपग्रेड करें",
    popularBadge: "सबसे लोकप्रिय",
    employerTitle: "नियोक्ता (Employers)",
    employerSub: "सत्यापित उम्मीदवारों के लिए नौकरियां पोस्ट करें",
    employerPrice: "₹0",
    employerPeriod: "/ हमेशा मुफ़्त",
    employerCta: "नौकरी पोस्ट करें (मुफ़्त)",
    freeFeatures: [
      "7 दिनों तक सभी सुविधाओं का पूर्ण उपयोग",
      "प्रतिदिन सुबह 7 बजे 10 AI-मैच नौकरियां",
      "सभी 12+ AI करियर टूल्स तक पहुंच",
      "रिज्यूमे चेकर और कवर लेटर जनरेटर",
      "शुरू करने के लिए क्रेडिट कार्ड की आवश्यकता नहीं",
    ],
    proFeatures: [
      "निःशुल्क परीक्षण की सभी सुविधाएं हमेशा के लिए",
      "प्रतिदिन सुबह 7 बजे 10 AI-मैच नौकरियां",
      "प्राथमिकता जॉब मैचिंग और ट्रस्ट स्कोर विश्लेषण",
      "कस्टम एटीएस रिज्यूमे ऑप्टिमाइज़र",
      "स्किल गैप एनालिसिस और सिफारिशें",
      "कभी भी रद्द करें — कोई लॉक-इन अनुबंध नहीं",
    ],
    employerFeatures: [
      "असीमित नौकरियां मुफ़्त में पोस्ट करें",
      "सीधे योग्य उम्मीदवारों तक पहुंच",
      "कोई प्रति-लिस्टिंग शुल्क या छिपा हुआ खर्च नहीं",
      "कंपनी प्रोफाइल और ब्रांडिंग पेज",
    ],
    faqsTitle: "अक्सर पूछे जाने वाले प्रश्न (FAQ)",
    faqs: [
      {
        q: "7-दिवसीय निःशुल्क परीक्षण के बाद क्या होता है?",
        a: "परीक्षण समाप्त होने के बाद, आप प्रतिदिन नौकरियां प्राप्त करने के लिए ₹299/माह पर प्रो में अपग्रेड कर सकते हैं। यदि आप अपग्रेड नहीं करते हैं, तो कोई शुल्क नहीं काटा जाएगा।",
      },
      {
        q: "क्या परीक्षण शुरू करने के लिए क्रेडिट कार्ड आवश्यक है?",
        a: "नहीं, परीक्षण शुरू करने के लिए किसी क्रेडिट कार्ड की आवश्यकता नहीं है। बस अपने ईमेल या गूगल से साइन अप करें।",
      },
      {
        q: "क्या मैं कभी भी रद्द कर सकता हूँ?",
        a: "हाँ, आप अपने डैशबोर्ड से कभी भी एक क्लिक में सदस्यता रद्द कर सकते हैं। कोई छिपी हुई फीस नहीं है।",
      },
    ],
  },
  es: {
    badge: "Precios Simples y Transparentes",
    title: "Prueba gratuita de 7 días. Sin tarjeta de crédito.",
    subtitle: "10 empleos seleccionados por IA en tu bandeja de entrada cada mañana. Pasa a Pro cuando estés listo.",
    freeTitle: "Prueba Gratuita",
    freeSub: "Acceso completo durante 7 días",
    freePrice: "$0",
    freePeriod: "/ 7 días",
    freeCta: "Comenzar Prueba Gratis",
    proTitle: "DecaJobs Pro",
    proSub: "10 empleos diarios y 12+ herramientas IA",
    proPrice: "$4.99",
    proPeriod: "/ mes",
    proCta: "Mejorar a Pro",
    popularBadge: "Más Popular",
    employerTitle: "Empleadores",
    employerSub: "Publica vacantes verificadas gratis",
    employerPrice: "$0",
    employerPeriod: "/ siempre gratis",
    employerCta: "Publicar Empleo Gratis",
    freeFeatures: [
      "Acceso total de 7 días a todas las funciones",
      "10 empleos emparejados por IA cada mañana a las 7 AM",
      "Acceso a todas las herramientas de carrera con IA",
      "Verificador de currículum y carta de presentación",
      "Sin tarjeta de crédito requerida",
    ],
    proFeatures: [
      "Todo lo de la prueba gratuita, para siempre",
      "10 empleos diarios con puntuación de confianza",
      "Optimizador de CV para sistemas ATS",
      "Análisis de brechas de habilidades y cursos recomendados",
      "Cancela en cualquier momento sin compromiso",
    ],
    employerFeatures: [
      "Publica empleos ilimitados gratis",
      "Candidatos calificados sin intermediarios",
      "Sin tarifas ocultas ni comisiones",
      "Página de perfil de empresa verificada",
    ],
    faqsTitle: "Preguntas Frecuentes",
    faqs: [
      {
        q: "¿Qué sucede después de la prueba de 7 días?",
        a: "Puedes actualizar a Pro por solo $4.99/mes para seguir recibiendo tus 10 empleos diarios. Si no actualizas, tu cuenta no genera ningún cobro.",
      },
      {
        q: "¿Puedo cancelar en cualquier momento?",
        a: "Sí, puedes cancelar tu suscripción con un solo clic desde tu panel de control sin ningún tipo de penalización.",
      },
    ],
  },
  ja: {
    badge: "シンプルで明確な料金プラン",
    title: "7日間無料トライアル。クレジットカード不要。",
    subtitle: "毎朝7時にAIが厳選した10件の求人をお届けします。準備ができたらProへ。",
    freeTitle: "無料トライアル",
    freeSub: "7日間の全機能フルアクセス",
    freePrice: "¥0",
    freePeriod: "/ 7日間",
    freeCta: "無料で始める",
    proTitle: "DecaJobs Pro",
    proSub: "毎朝10件のマッチングと全AIツール",
    proPrice: "¥750",
    proPeriod: "/ 月",
    proCta: "Proにアップグレード",
    popularBadge: "一番人気",
    employerTitle: "採用企業様",
    employerSub: "厳選求職者向けに無料で求人掲載",
    employerPrice: "¥0",
    employerPeriod: "/ 完全無料",
    employerCta: "求人を無料掲載",
    freeFeatures: [
      "7日間のすべてのプレミアム機能へのアクセス",
      "毎朝7時のAIパーソナライズ求人10件",
      "職務経歴書スキャナーとカバーレター生成ツール",
      "クレジットカード登録不要",
    ],
    proFeatures: [
      "無料トライアルの全機能を永続利用",
      "毎朝の優先マッチングとトラストスコア分析",
      "ATSキーワード最適化",
      "いつでもワンクリックで解約可能",
    ],
    employerFeatures: [
      "求人掲載無料・手数料ゼロ",
      "直接応募者へのリーチ",
      "企業プロフィールとブランディング",
    ],
    faqsTitle: "よくある質問 (FAQ)",
    faqs: [
      {
        q: "7日間の無料期間が終わるとどうなりますか？",
        a: "月額750円のProプランに移行するか選択できます。自動で勝手に課金されることはありません。",
      },
      {
        q: "いつでも解約できますか？",
        a: "はい、マイページの契約管理からいつでもワンクリックで解約可能です。",
      },
    ],
  },
  fr: {
    badge: "Tarification Simple et Transparente",
    title: "Essai gratuit de 7 jours. Sans carte bancaire.",
    subtitle: "10 offres personnalisées par IA chaque matin à 7h. Passez à Pro quand vous le souhaitez.",
    freeTitle: "Essai Gratuit",
    freeSub: "Accès complet pendant 7 jours",
    freePrice: "0 €",
    freePeriod: "/ 7 jours",
    freeCta: "Démarrer l'essai gratuit",
    proTitle: "DecaJobs Pro",
    proSub: "10 offres quotidiennes et outils IA",
    proPrice: "4,99 €",
    proPeriod: "/ mois",
    proCta: "Passer à Pro",
    popularBadge: "Le Plus Populaire",
    employerTitle: "Recruteurs",
    employerSub: "Publiez vos offres gratuitement",
    employerPrice: "0 €",
    employerPeriod: "/ toujours gratuit",
    employerCta: "Publier une offre",
    freeFeatures: [
      "Accès complet de 7 jours à toutes les fonctionnalités",
      "10 offres ciblées par IA chaque matin",
      "Outils d'optimisation de CV et lettre de motivation",
      "Aucune carte bancaire requise",
    ],
    proFeatures: [
      "Toutes les fonctionnalités de l'essai, en illimité",
      "Score de confiance et offres prioritaires",
      "Analyse des écarts de compétences et formations",
      "Résiliation en un clic sans engagement",
    ],
    employerFeatures: [
      "Publication gratuite et illimitée d'offres",
      "Accès direct aux candidats qualifiés",
      "Aucun frais caché",
    ],
    faqsTitle: "Questions Fréquentes",
    faqs: [
      {
        q: "Que se passe-t-il après les 7 jours d'essai ?",
        a: "Vous pouvez choisir de passer à Pro pour 4,99 €/mois. Si vous ne passez pas à Pro, aucun montant ne vous est prélevé.",
      },
    ],
  },
  de: {
    badge: "Einfache und transparente Preise",
    title: "7 Tage kostenlos testen. Keine Kreditkarte erforderlich.",
    subtitle: "Täglich um 7:00 Uhr 10 KI-geprüfte Jobs in Ihrem Postfach. Jederzeit zu Pro upgraden.",
    freeTitle: "Kostenlose Testphase",
    freeSub: "7 Tage voller Zugriff",
    freePrice: "0 €",
    freePeriod: "/ 7 Tage",
    freeCta: "Kostenlos starten",
    proTitle: "DecaJobs Pro",
    proSub: "Täglich 10 Jobs & alle 12+ KI-Karriere-Tools",
    proPrice: "4,99 €",
    proPeriod: "/ Monat",
    proCta: "Auf Pro upgraden",
    popularBadge: "Beliebteste Wahl",
    employerTitle: "Arbeitgeber",
    employerSub: "Jobs kostenlos veröffentlichen",
    employerPrice: "0 €",
    employerPeriod: "/ dauerhaft kostenlos",
    employerCta: "Job kostenlos inserieren",
    freeFeatures: [
      "7 Tage voller Zugriff auf alle Funktionen",
      "Täglich 10 KI-abgestimmte Jobs um 7:00 Uhr",
      "Lebenslauf-Checker & Anschreiben-Generator",
      "Keine Kreditkarte erforderlich",
    ],
    proFeatures: [
      "Alle Testphasen-Funktionen unbegrenzt",
      "Priorisierte Jobs mit Trust Score",
      "ATS-Lebenslauf-Optimierung",
      "Jederzeit kündbar ohne Vertragslaufzeit",
    ],
    employerFeatures: [
      "Unbegrenzt kostenlose Stellenanzeigen",
      "Direkter Zugang zu geprüften Talenten",
      "Keine versteckten Gebühren",
    ],
    faqsTitle: "Häufig gestellte Fragen (FAQ)",
    faqs: [
      {
        q: "Was passiert nach den 7 Tagen?",
        a: "Sie können für 4,99 €/Monat auf Pro upgraden. Ohne Upgrade entstehen keinerlei Kosten.",
      },
    ],
  },
  pt: {
    badge: "Preços Simples e Transparentes",
    title: "Teste grátis por 7 dias. Sem cartão de crédito.",
    subtitle: "10 vagas selecionadas por IA na sua caixa de entrada toda manhã às 7h.",
    freeTitle: "Teste Grátis",
    freeSub: "Acesso total por 7 dias",
    freePrice: "R$0",
    freePeriod: "/ 7 dias",
    freeCta: "Começar Teste Grátis",
    proTitle: "DecaJobs Pro",
    proSub: "10 vagas diárias e todas as ferramentas de IA",
    proPrice: "R$24,90",
    proPeriod: "/ mês",
    proCta: "Assinar o Pro",
    popularBadge: "Mais Popular",
    employerTitle: "Empresas",
    employerSub: "Publique vagas verificadas gratuitamente",
    employerPrice: "R$0",
    employerPeriod: "/ grátis para sempre",
    employerCta: "Publicar Vaga Grátis",
    freeFeatures: [
      "Acesso completo por 7 dias a todos os recursos",
      "10 vagas selecionadas por IA todas as manhãs",
      "Analisador de currículo e gerador de carta",
      "Sem necessidade de cartão de crédito",
    ],
    proFeatures: [
      "Tudo do plano gratuito para sempre",
      "Vagas prioritárias com Trust Score",
      "Otimizador de currículo para sistemas ATS",
      "Cancele quando quiser sem multas",
    ],
    employerFeatures: [
      "Publique vagas ilimitadas sem custo",
      "Conexão direta com candidatos qualificados",
      "Sem taxas ocultas",
    ],
    faqsTitle: "Perguntas Frequentes",
    faqs: [
      {
        q: "O que acontece após os 7 dias de teste?",
        a: "Você pode assinar o Pro por R$24,90/mês para continuar recebendo suas 10 vagas diárias. Se não assinar, nenhuma cobrança é realizada.",
      },
    ],
  },
  ko: {
    badge: "간편하고 투명한 요금제",
    title: "7일 무료 체험. 신용카드 불필요.",
    subtitle: "매일 아침 7시, AI가 엄선한 10개의 맞춤 채용 정보를 받아보세요.",
    freeTitle: "무료 체험",
    freeSub: "7일간 모든 기능 무료 이용",
    freePrice: "₩0",
    freePeriod: "/ 7일",
    freeCta: "무료 체험 시작",
    proTitle: "DecaJobs Pro",
    proSub: "매일 10개 맞춤 공고 및 12개 AI 커리어 도구",
    proPrice: "₩6,500",
    proPeriod: "/ 월",
    proCta: "Pro 플랜 업그레이드",
    popularBadge: "가장 인기 있는 플랜",
    employerTitle: "채용 담당자",
    employerSub: "검증된 인재를 위한 무료 채용 공고 등록",
    employerPrice: "₩0",
    employerPeriod: "/ 평생 무료",
    employerCta: "무료 공고 등록",
    freeFeatures: [
      "7일간 모든 프리미엄 기능 무료 이용",
      "매일 아침 7시 AI 맞춤 채용 공고 10개",
      "이력서 분석기 및 자기소개서 생성기",
      "신용카드 등록 없이 즉시 시작",
    ],
    proFeatures: [
      "무료 체험의 모든 혜택 평생 유지",
      "신뢰도 점수 기반 우선 채용 매칭",
      "ATS 맞춤형 이력서 최적화",
      "언제든 원클릭으로 해지 가능 (위약금 없음)",
    ],
    employerFeatures: [
      "공고 무제한 무료 등록",
      "수수료 없는 직접 채용 연결",
      "기업 브랜딩 페이지 제공",
    ],
    faqsTitle: "자주 묻는 질문 (FAQ)",
    faqs: [
      {
        q: "7일 무료 체험 후 어떻게 되나요?",
        a: "월 6,500원에 Pro 플랜으로 업그레이드하여 매일 채용 정보를 계속 받아보실 수 있습니다. 업그레이드하지 않아도 자동 결제되지 않습니다.",
      },
    ],
  },
  it: {
    badge: "Prezzi Semplici e Trasparenti",
    title: "Prova gratuita di 7 giorni. Senza carta di credito.",
    subtitle: "10 offerte di lavoro selezionate dall'IA ogni mattina alle 7:00. Passa a Pro quando sei pronto.",
    freeTitle: "Prova Gratuita",
    freeSub: "Accesso completo per 7 giorni",
    freePrice: "0 €",
    freePeriod: "/ 7 giorni",
    freeCta: "Inizia la prova gratuita",
    proTitle: "DecaJobs Pro",
    proSub: "10 offerte al giorno e tutti gli strumenti IA",
    proPrice: "4,99 €",
    proPeriod: "/ mese",
    proCta: "Passa a Pro",
    popularBadge: "Più Popolare",
    employerTitle: "Datori di Lavoro",
    employerSub: "Pubblica annunci di lavoro gratis",
    employerPrice: "0 €",
    employerPeriod: "/ sempre gratuito",
    employerCta: "Pubblica Annuncio Gratis",
    freeFeatures: [
      "7 giorni di accesso completo a tutte le funzioni",
      "10 offerte di lavoro selezionate ogni mattina",
      "Verificatore CV e generatore lettera di presentazione",
      "Nessuna carta di credito richiesta",
    ],
    proFeatures: [
      "Tutto ciò che è compreso nella prova, per sempre",
      "Punteggio di affidabilità Trust Score",
      "Ottimizzazione CV per sistemi ATS",
      "Disdici quando vuoi senza vincoli",
    ],
    employerFeatures: [
      "Pubblicazione annunci illimitata e gratuita",
      "Accesso diretto a candidati qualificati",
      "Nessun costo nascosto",
    ],
    faqsTitle: "Domande Frequenti (FAQ)",
    faqs: [
      {
        q: "Cosa succede dopo i 7 giorni di prova?",
        a: "Puoi passare a Pro a soli 4,99 €/mese per continuare a ricevere i tuoi 10 annunci quotidiani. Se non effettui l'upgrade, non ti verrà addebitato nulla.",
      },
    ],
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (lang === "en") {
    permanentRedirect("/pricing");
  }
  if (!isValidLocale(lang)) {
    permanentRedirect("/pricing");
  }

  const content = PRICING_LOCALIZATIONS[lang] || PRICING_LOCALIZATIONS.es;
  const info = LOCALES[lang as SupportedLocale];
  const url = `https://decajob.com/${lang}/pricing`;

  return {
    title: `${content.freeTitle} & Pro - DecaJobs`,
    description: content.subtitle,
    alternates: {
      canonical: url,
      languages: getHreflangAlternates("/pricing"),
    },
    openGraph: {
      title: `${content.title} | DecaJobs`,
      description: content.subtitle,
      url,
      siteName: "DecaJobs",
      locale: info?.hreflang || lang,
      type: "website",
    },
  };
}

export default async function LocalizedPricingPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (lang === "en") {
    permanentRedirect("/pricing");
  }
  if (!isValidLocale(lang)) {
    permanentRedirect("/pricing");
  }

  const content = PRICING_LOCALIZATIONS[lang] || PRICING_LOCALIZATIONS.es;
  const t = getTranslations(lang);

  return (
    <div className="py-10 sm:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <Breadcrumbs items={[{ label: t.nav.pricing || "Pricing" }]} />

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-3.5 py-1 text-xs font-semibold text-primary-800 shadow-2xs mb-4">
            <span>✨</span> {content.badge}
          </div>
          <h1 className="text-3xl font-extrabold text-neutral-900 sm:text-4xl lg:text-5xl tracking-tight">
            {content.title}
          </h1>
          <p className="mt-4 text-base sm:text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed">
            {content.subtitle}
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 mb-16 items-stretch">
          {/* 1. Free Trial */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-7 shadow-sm flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-bold text-neutral-900">{content.freeTitle}</h2>
              <p className="mt-1 text-xs text-neutral-500">{content.freeSub}</p>
              <p className="mt-5">
                <span className="text-4xl font-extrabold text-neutral-900">{content.freePrice}</span>
                <span className="text-neutral-500 text-xs ml-1 font-medium">{content.freePeriod}</span>
              </p>
              <Link
                href="/login"
                className="mt-6 block w-full rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-center text-sm font-semibold text-neutral-700 hover:bg-neutral-50 shadow-2xs transition-colors"
              >
                {content.freeCta}
              </Link>
              <ul className="mt-6 space-y-2.5 border-t border-neutral-100 pt-6 text-xs text-neutral-600">
                {content.freeFeatures.map((f, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            <p className="mt-6 text-[11px] text-neutral-400 text-center">
              No credit card required
            </p>
          </div>

          {/* 2. Pro Plan (Highlighted) */}
          <div className="relative rounded-2xl border-2 border-primary-600 bg-white p-7 shadow-lg flex flex-col justify-between">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
              <span className="rounded-full bg-primary-600 px-3.5 py-1 text-xs font-bold text-white shadow-sm">
                {content.popularBadge}
              </span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-neutral-900">{content.proTitle}</h2>
              <p className="mt-1 text-xs text-neutral-500">{content.proSub}</p>
              <p className="mt-5">
                <span className="text-4xl font-extrabold text-neutral-900">{content.proPrice}</span>
                <span className="text-neutral-500 text-xs ml-1 font-medium">{content.proPeriod}</span>
              </p>
              <Link
                href="/subscribe"
                className="mt-6 block w-full rounded-xl bg-primary-600 px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-primary-700 shadow-sm hover:shadow transition-all"
              >
                {content.proCta}
              </Link>
              <ul className="mt-6 space-y-2.5 border-t border-neutral-100 pt-6 text-xs text-neutral-600">
                {content.proFeatures.map((f, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-primary-600 font-bold">✓</span>
                    <span className="font-medium text-neutral-800">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            <p className="mt-6 text-[11px] text-neutral-400 text-center">
              7-day free trial included • Cancel anytime
            </p>
          </div>

          {/* 3. Employer (Free Forever) */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-7 shadow-sm flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-bold text-neutral-900">{content.employerTitle}</h2>
              <p className="mt-1 text-xs text-neutral-500">{content.employerSub}</p>
              <p className="mt-5">
                <span className="text-4xl font-extrabold text-neutral-900">{content.employerPrice}</span>
                <span className="text-neutral-500 text-xs ml-1 font-medium">{content.employerPeriod}</span>
              </p>
              <Link
                href="/employer/register"
                className="mt-6 block w-full rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-center text-sm font-semibold text-neutral-700 hover:bg-neutral-50 shadow-2xs transition-colors"
              >
                {content.employerCta}
              </Link>
              <ul className="mt-6 space-y-2.5 border-t border-neutral-100 pt-6 text-xs text-neutral-600">
                {content.employerFeatures.map((f, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            <p className="mt-6 text-[11px] text-neutral-400 text-center">
              Direct applicant connections
            </p>
          </div>
        </div>

        {/* FAQs */}
        <div className="border-t border-neutral-200 pt-12 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-neutral-900 mb-8">
            {content.faqsTitle}
          </h2>
          <div className="space-y-4">
            {content.faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-neutral-200 bg-white p-5 shadow-2xs"
              >
                <h3 className="text-sm sm:text-base font-bold text-neutral-900">
                  {faq.q}
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-neutral-600 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
