import type { SupportedLocale } from "./config";

export interface TranslationDictionary {
  meta: {
    title: string;
    description: string;
    keywords: string;
  };
  nav: {
    jobs: string;
    resumeAi: string;
    tools: string;
    howItWorks: string;
    pricing: string;
    about: string;
    blog: string;
    login: string;
    getStarted: string;
    postJob: string;
    daily10: string;
  };
  hero: {
    badge: string;
    titleLine1: string;
    titleHighlight: string;
    titleLine2: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    guarantee: string;
    ratingText: string;
  };
  globalBanner: {
    badge: string;
    title: string;
    description: string;
    stat1Label: string;
    stat1Value: string;
    stat2Label: string;
    stat2Value: string;
    stat3Label: string;
    stat3Value: string;
  };
  daily10: {
    eyebrow: string;
    title: string;
    subtitle: string;
    badge1: string;
    badge2: string;
    badge3: string;
    cardTag: string;
    matchScore: string;
    viewMatches: string;
  };
  howItWorks: {
    title: string;
    subtitle: string;
    step1Title: string;
    step1Desc: string;
    step2Title: string;
    step2Desc: string;
    step3Title: string;
    step3Desc: string;
  };
  features: {
    title: string;
    subtitle: string;
    f1Title: string;
    f1Desc: string;
    f2Title: string;
    f2Desc: string;
    f3Title: string;
    f3Desc: string;
    f4Title: string;
    f4Desc: string;
  };
  faq: {
    title: string;
    subtitle: string;
    q1: string;
    a1: string;
    q2: string;
    a2: string;
    q3: string;
    a3: string;
    q4: string;
    a4: string;
  };
  ctaSection: {
    title: string;
    subtitle: string;
    button: string;
    noCreditCard: string;
  };
  footer: {
    tagline: string;
    rights: string;
    privacy: string;
    terms: string;
    contact: string;
    disclaimer: string;
    selectLanguage: string;
  };
}

export const translations: Record<SupportedLocale, TranslationDictionary> = {
  en: {
    meta: {
      title: "DecaJobs — 10 Curated Jobs Delivered to Your Inbox Every Morning",
      description:
        "AI-powered job portal that matches your exact skills and location. Candidates worldwide receive 10 hand-curated, verified jobs every morning at 8:00 AM.",
      keywords:
        "curated jobs, daily 10 jobs, remote jobs, software engineer jobs, ai job matching, global careers",
    },
    nav: {
      jobs: "Jobs",
      resumeAi: "Resume AI",
      tools: "Tools",
      howItWorks: "How It Works",
      pricing: "Pricing",
      about: "About",
      blog: "Blog",
      login: "Log in",
      getStarted: "Get Started Free",
      postJob: "Post a Job",
      daily10: "My Daily 10",
    },
    hero: {
      badge: "✨ Worldwide Launch — Serving candidates across 150+ countries",
      titleLine1: "Stop applying to 100 jobs.",
      titleHighlight: "Get the 10 that matter.",
      titleLine2: "every morning.",
      subtitle:
        "DecaJobs cuts through job board spam. Our AI engine analyzes your target titles, skills, and country to curate exactly 10 verified opportunities to your inbox at 8:00 AM.",
      ctaPrimary: "Get My Daily 10 Free",
      ctaSecondary: "Browse Live Openings",
      guarantee: "100% free for candidates • Exactly 10 curated matches • Zero spam",
      ratingText: "Trusted by 25,000+ job seekers across the globe",
    },
    globalBanner: {
      badge: "Global Job Coverage",
      title: "Register from anywhere on Earth. Get 10 curated jobs.",
      description:
        "Whether you're in Madrid, Tokyo, Berlin, Paris, São Paulo, Seoul, Milan, or working remotely, our matching engine delivers hyper-relevant openings for your location and time zone.",
      stat1Label: "Curated Daily Matches",
      stat1Value: "10 Jobs",
      stat2Label: "Countries Supported",
      stat2Value: "150+",
      stat3Label: "Noise Reduction",
      stat3Value: "98%",
    },
    daily10: {
      eyebrow: "The Daily 10 Engine",
      title: "Quality over infinite scroll",
      subtitle:
        "Most job portals overwhelm you with thousands of stale listings. We deliver precision: exactly ten high-match roles picked for you every day.",
      badge1: "Skill-Weighted Matching",
      badge2: "Local + Remote Options",
      badge3: "Verified Real Employers",
      cardTag: "Today's Top Pick",
      matchScore: "96% Match",
      viewMatches: "See Today's Matches",
    },
    howItWorks: {
      title: "How DecaJobs Works in 3 Simple Steps",
      subtitle: "Set up once in under 2 minutes. Receive tailored jobs every morning.",
      step1Title: "1. Tell us what you do",
      step1Desc:
        "Enter your target titles, core skills, and preferred location (city, country, or remote).",
      step2Title: "2. Our engine scores 100k+ jobs",
      step2Desc:
        "Every night, our algorithm matches live postings against your unique profile and filters out spam.",
      step3Title: "3. Wake up to your Daily 10",
      step3Desc:
        "At 8:00 AM, open a clean email digest with direct 1-click application links. No fluff.",
    },
    features: {
      title: "Built for candidates who value their time",
      subtitle: "Everything you need to land your next high-impact role with zero distraction.",
      f1Title: "Noise-Free Daily Digest",
      f1Desc: "Never search through 50 pages of irrelevant listings again. Only 10 focused matches.",
      f2Title: "Global & Remote Matching",
      f2Desc: "Whether looking for local roles in your city or worldwide remote positions, we've got you covered.",
      f3Title: "Resume AI Optimizer",
      f3Desc: "Compare your resume against any job description and receive actionable ATS improvement scores.",
      f4Title: "Direct Employer Links",
      f4Desc: "Apply straight on official company career portals or ATS links without recruiter middlemen.",
    },
    faq: {
      title: "Frequently Asked Questions",
      subtitle: "Everything you need to know about DecaJobs and the Daily 10 service.",
      q1: "Is DecaJobs completely free for job seekers?",
      a1: "Yes! Creating a candidate profile and receiving the Daily 10 email digest is 100% free forever.",
      q2: "Can I use DecaJobs from outside the US or India?",
      a2: "Absolutely. DecaJobs supports candidates from over 150 countries. Our engine matches both local in-country jobs and global remote opportunities.",
      q3: "What if there are fewer than 10 jobs in my exact city?",
      a3: "Our engine automatically fills the remainder with verified, high-match global remote roles matching your exact skills, ensuring you always get 10 valuable opportunities.",
      q4: "Can employers post jobs on DecaJobs?",
      a4: "Yes, verified employers can post jobs to reach motivated, skill-matched candidates across our global network.",
    },
    ctaSection: {
      title: "Ready to upgrade your job search?",
      subtitle: "Join over 25,000 professionals receiving their 10 curated matches every morning.",
      button: "Claim Your Free Daily 10",
      noCreditCard: "No credit card required • Instant setup • Cancel anytime",
    },
    footer: {
      tagline: "The noise-free job platform delivering 10 curated matches to your inbox every morning.",
      rights: "DecaJobs. All rights reserved.",
      privacy: "Privacy Policy",
      terms: "Terms of Service",
      contact: "Contact",
      disclaimer: "Disclaimer",
      selectLanguage: "Language",
    },
  },

  es: {
    meta: {
      title: "DecaJobs — 10 Empleos Seleccionados en tu Bandeja de Entrada Cada Mañana",
      description:
        "Portal de empleo con IA que se adapta a tus habilidades y ubicación. Candidatos de España y Latinoamérica reciben 10 ofertas verificadas cada mañana a las 8:00 AM.",
      keywords:
        "empleos seleccionados, daily 10 jobs, trabajo remoto, empleos desarrollador software, portal de empleo internacional",
    },
    nav: {
      jobs: "Empleos",
      resumeAi: "CV con IA",
      tools: "Herramientas",
      howItWorks: "Cómo Funciona",
      pricing: "Precios",
      about: "Nosotros",
      blog: "Blog",
      login: "Iniciar Sesión",
      getStarted: "Comenzar Gratis",
      postJob: "Publicar Empleo",
      daily10: "Mis 10 Diarios",
    },
    hero: {
      badge: "✨ Lanzamiento Global — Disponible para candidatos en más de 150 países",
      titleLine1: "Deja de postularte a 100 ofertas.",
      titleHighlight: "Recibe las 10 que importan.",
      titleLine2: "cada mañana.",
      subtitle:
        "DecaJobs elimina el ruido de las bolsas de empleo. Nuestro motor de IA analiza tus cargos objetivo, habilidades y país para enviarte exactamente 10 oportunidades verificadas a las 8:00 AM.",
      ctaPrimary: "Recibir Mis 10 Diarios Gratis",
      ctaSecondary: "Explorar Vacantes Activas",
      guarantee: "100% gratuito para candidatos • Exactamente 10 vacantes curadas • Cero spam",
      ratingText: "Más de 25.000 profesionales confían en DecaJobs en todo el mundo",
    },
    globalBanner: {
      badge: "Cobertura Laboral Global",
      title: "Regístrate desde cualquier país. Recibe 10 empleos seleccionados.",
      description:
        "Ya estés en Madrid, Barcelona, Ciudad de México, Buenos Aires, Bogotá o trabajando en remoto, nuestro algoritmo selecciona vacantes hiperrelevantes para tu zona horaria y ubicación.",
      stat1Label: "Vacantes Curadas al Día",
      stat1Value: "10 Empleos",
      stat2Label: "Países Cubiertos",
      stat2Value: "150+",
      stat3Label: "Reducción de Ruido",
      stat3Value: "98%",
    },
    daily10: {
      eyebrow: "El Motor Daily 10",
      title: "Calidad antes que desplazamiento infinito",
      subtitle:
        "La mayoría de portales te abruman con miles de anuncios obsoletos. Nosotros te damos precisión: exactamente diez puestos con alta compatibilidad cada día.",
      badge1: "Ponderación por Habilidades",
      badge2: "Opciones Locales y Remotas",
      badge3: "Empresas Verificadas",
      cardTag: "Recomendación de Hoy",
      matchScore: "96% de Afinidad",
      viewMatches: "Ver Empleos de Hoy",
    },
    howItWorks: {
      title: "Cómo Funciona DecaJobs en 3 Simples Pasos",
      subtitle: "Configúralo una sola vez en menos de 2 minutos. Recibe ofertas cada mañana.",
      step1Title: "1. Cuéntanos tu perfil",
      step1Desc:
        "Ingresa los cargos que buscas, tus principales habilidades y tu ubicación deseada (ciudad, país o remoto).",
      step2Title: "2. Evaluamos más de 100.000 ofertas",
      step2Desc:
        "Cada noche, nuestro algoritmo compara ofertas activas contra tu perfil eliminando anuncios duplicados o spam.",
      step3Title: "3. Despierta con tus 10 Diarios",
      step3Desc:
        "A las 8:00 AM, revisa tu correo con enlaces directos para postularte con 1 clic sin intermediarios.",
    },
    features: {
      title: "Diseñado para profesionales que valoran su tiempo",
      subtitle: "Todo lo necesario para conseguir tu próximo gran trabajo sin distracciones.",
      f1Title: "Resumen Diario Sin Ruido",
      f1Desc: "Nunca más navegues 50 páginas de anuncios irrelevantes. Solo 10 ofertas con alta coincidencia.",
      f2Title: "Cobertura Local y Remota",
      f2Desc: "Ya busques puestos presenciales en tu ciudad o empleos remotos internacionales, estamos listos.",
      f3Title: "Optimizador de CV con IA",
      f3Desc: "Compara tu currículum contra descripciones de empleo y obtén mejoras para pasar los filtros ATS.",
      f4Title: "Enlaces Directos a Empresas",
      f4Desc: "Aplica directamente en las plataformas oficiales de las compañías sin intermediarios.",
    },
    faq: {
      title: "Preguntas Frecuentes",
      subtitle: "Todo lo que necesitas saber sobre DecaJobs y el servicio Daily 10.",
      q1: "¿DecaJobs es totalmente gratuito para los candidatos?",
      a1: "¡Sí! Crear tu perfil de candidato y recibir las 10 ofertas diarias por correo es 100% gratuito siempre.",
      q2: "¿Puedo usar DecaJobs desde cualquier país hispanohablante?",
      a2: "Totalmente. DecaJobs da soporte a candidatos en España, México, Colombia, Argentina, Chile y más de 150 países en todo el mundo.",
      q3: "¿Qué sucede si hay pocas ofertas en mi ciudad?",
      a3: "El sistema completa automáticamente las vacantes restantes con puestos remotos internacionales compatibles con tus habilidades, asegurando siempre tus 10 oportunidades diarias.",
      q4: "¿Las empresas pueden publicar ofertas?",
      a4: "Sí, empresas verificadas pueden publicar vacantes para llegar a candidatos cualificados de nuestra red.",
    },
    ctaSection: {
      title: "¿Listo para transformar tu búsqueda de empleo?",
      subtitle: "Únete a más de 25.000 candidatos que reciben sus 10 ofertas seleccionadas cada mañana.",
      button: "Obtener Mis 10 Empleos Gratis",
      noCreditCard: "Sin tarjeta de crédito • Configuración en 2 minutos • Cancela cuando quieras",
    },
    footer: {
      tagline: "La plataforma de empleo sin ruido que entrega 10 ofertas seleccionadas a tu correo cada mañana.",
      rights: "DecaJobs. Todos los derechos reservados.",
      privacy: "Política de Privacidad",
      terms: "Términos del Servicio",
      contact: "Contacto",
      disclaimer: "Aviso Legal",
      selectLanguage: "Idioma",
    },
  },

  ja: {
    meta: {
      title: "DecaJobs — 毎朝8時に厳選求人10件をお届けするAI求人サービス",
      description:
        "あなたのスキル・希望勤務地に完全にマッチした求人をAIが厳選。日本国内および世界の求職者に毎朝8時、選りすぐりの10件をお届けします。",
      keywords:
        "厳選求人, デイリー10, リモートワーク求人, エンジニア転職, AIマッチング求人, 海外リモート",
    },
    nav: {
      jobs: "求人一覧",
      resumeAi: "履歴書AI診断",
      tools: "便利ツール",
      howItWorks: "仕組み",
      pricing: "料金プラン",
      about: "会社概要",
      blog: "ブログ",
      login: "ログイン",
      getStarted: "無料で始める",
      postJob: "求人を掲載",
      daily10: "マイ・デイリー10",
    },
    hero: {
      badge: "✨ グローバル対応 — 世界150カ国以上の求職者にサービス提供中",
      titleLine1: "100件応募するのはもう終わり。",
      titleHighlight: "本当に合う厳選10件を、",
      titleLine2: "毎朝あなたの手元に。",
      subtitle:
        "DecaJobsは求人広告のノイズをゼロにします。AIがあなたの希望職種・スキル・勤務地を分析し、毎朝8時に厳選した10件の求人のみをメールでお届けします。",
      ctaPrimary: "毎朝10件の求人を無料で受け取る",
      ctaSecondary: "公開求人をチェックする",
      guarantee: "求職者はずっと完全無料 • 毎朝きっかり10件 • スパムゼロ",
      ratingText: "世界25,000人以上のエンジニア・プロフェッショナルが利用中",
    },
    globalBanner: {
      badge: "世界中どこからでも利用可能",
      title: "世界中どこにお住まいでも。毎朝10件の最適求人が届きます。",
      description:
        "東京、大阪、福岡はもちろん、世界各地のリモートワーク希望者まで、タイムゾーンと勤務形態に合わせた求人をAIが自動マッチングします。",
      stat1Label: "毎日の厳選求人数",
      stat1Value: "10件",
      stat2Label: "対応国数",
      stat2Value: "150カ国以上",
      stat3Label: "求人ノイズ削減率",
      stat3Value: "98%",
    },
    daily10: {
      eyebrow: "Daily 10 エンジン",
      title: "無限スクロールから「量より質」の転職へ",
      subtitle:
        "大量の古い求人情報に埋もれる必要はありません。DecaJobsはあなたに最高にマッチする10件だけを毎日お届けします。",
      badge1: "スキル重視の高精度スコアリング",
      badge2: "国内・グローバルリモート対応",
      badge3: "確認済みの信頼できる採用企業",
      cardTag: "本日のベストマッチ",
      matchScore: "マッチ度 96%",
      viewMatches: "本日の10件を見る",
    },
    howItWorks: {
      title: "DecaJobsのご利用手順（かんたん3ステップ）",
      subtitle: "初期設定は2分で完了。翌朝から自動で求人が届きます。",
      step1Title: "1. 希望条件を登録",
      step1Desc: "希望の職種、得意なスキル、希望勤務地（都市名やリモートなど）を入力します。",
      step2Title: "2. AIが10万件以上の求人を分析",
      step2Desc: "毎晩アルゴリズムが最新の募集情報を精査し、あなたに最適な案件のみを抽出します。",
      step3Title: "3. 毎朝8時にメールで届く",
      step3Desc: "毎朝8時に10件の求人リストをお届け。ワンクリックで企業の応募ページへ直接移動できます。",
    },
    features: {
      title: "時間を大切にする求職者のために設計",
      subtitle: "転職活動の無駄を極限まで削ぎ落とし、理想のキャリアを実現します。",
      f1Title: "ノイズゼロの朝刊ダイジェスト",
      f1Desc: "何十ページも無関係な求人を探す必要はありません。厳選10件だけを確認できます。",
      f2Title: "国内勤務地＆海外フルリモート対応",
      f2Desc: "日本の主要都市での就職はもちろん、外資系・海外企業のフルリモートワークも網羅。",
      f3Title: "履歴書・職務経歴書AI診断",
      f3Desc: "求人要件と照らし合わせ、書類選考の通過率を上げる具体的な改善提案を行います。",
      f4Title: "企業採用ページへの直接応募",
      f4Desc: "仲介業者を挟まず、企業の公式応募ページから直接アプライできます。",
    },
    faq: {
      title: "よくあるご質問",
      subtitle: "DecaJobsとデイリー10求人配信サービスについてのご案内です。",
      q1: "DecaJobsは本当に無料で利用できますか？",
      a1: "はい、求職者の方はアカウント登録から毎朝の求人配信まですべて完全無料でご利用いただけます。",
      q2: "日本国内の求人や日本語対応の仕事も届きますか？",
      a2: "はい、勤務地に「日本」や都市名を指定することで、国内求人や日本語が活かせる案件、グローバルリモート求人が届きます。",
      q3: "登録地域に10件の求人がない場合はどうなりますか？",
      a3: "あなたのスキルに合致する検証済みのグローバルリモート求人で自動補完され、毎朝必ず10件の良質な求人が届きます。",
      q4: "企業側として求人を掲載することはできますか？",
      a4: "はい、審査済みの採用企業様は求人掲載を行い、高いスキルを持つ世界中の求職者にアプローチできます。",
    },
    ctaSection: {
      title: "転職活動をシンプルにしませんか？",
      subtitle: "世界25,000人以上のプロフェッショナルと一緒に、毎朝10件の厳選求人を受け取りましょう。",
      button: "毎朝10件の求人を無料で受け取る",
      noCreditCard: "クレジットカード不要 • 2分で登録完了 • いつでも配信停止可能",
    },
    footer: {
      tagline: "ノイズを排し、毎朝10件の厳選求人をあなたのメールにお届けするスマート求人プラットフォーム。",
      rights: "DecaJobs. All rights reserved.",
      privacy: "プライバシーポリシー",
      terms: "利用規約",
      contact: "お問い合わせ",
      disclaimer: "免責事項",
      selectLanguage: "言語",
    },
  },

  fr: {
    meta: {
      title: "DecaJobs — 10 Offres d'Emploi Triées sur le Volet Chaque Matin",
      description:
        "Plateforme d'emploi propulsée par l'IA qui s'adapte à vos compétences et à votre localisation. Recevez 10 offres vérifiées chaque matin à 8h00.",
      keywords:
        "offres d'emploi, daily 10 jobs, télétravail, emploi développeur, recrutement IA, offres internationales",
    },
    nav: {
      jobs: "Offres",
      resumeAi: "CV avec IA",
      tools: "Outils",
      howItWorks: "Comment ça marche",
      pricing: "Tarifs",
      about: "À propos",
      blog: "Blog",
      login: "Connexion",
      getStarted: "Commencer Gratuitement",
      postJob: "Publier une Offre",
      daily10: "Mes 10 du Jour",
    },
    hero: {
      badge: "✨ Déploiement Mondial — Disponible pour les candidats de 150+ pays",
      titleLine1: "Arrêtez de postuler à 100 offres.",
      titleHighlight: "Recevez les 10 qui comptent.",
      titleLine2: "chaque matin.",
      subtitle:
        "DecaJobs élimine le spam des sites d'emploi. Notre moteur IA analyse vos titres cibles, vos compétences et votre pays pour vous envoyer 10 offres vérifiées à 8h00.",
      ctaPrimary: "Recevoir Mes 10 Offres Quotidiennes",
      ctaSecondary: "Explorer les Postes Ouverts",
      guarantee: "100% gratuit pour les candidats • Exactement 10 offres triées • Zéro spam",
      ratingText: "Recommandé par plus de 25 000 professionnels dans le monde",
    },
    globalBanner: {
      badge: "Couverture Mondiale",
      title: "Inscrivez-vous de n'importe où. Recevez 10 offres ciblées.",
      description:
        "Que vous soyez à Paris, Lyon, Montréal, Bruxelles, Genève ou en télétravail complet, notre algorithme sélectionne les offres les plus pertinentes pour votre fuseau horaire.",
      stat1Label: "Offres Triées Quotidiennes",
      stat1Value: "10 Postes",
      stat2Label: "Pays Couverts",
      stat2Value: "150+",
      stat3Label: "Réduction du Bruit",
      stat3Value: "98%",
    },
    daily10: {
      eyebrow: "Le Moteur Daily 10",
      title: "La qualité plutôt que le défilement infini",
      subtitle:
        "La plupart des portails vous noient sous des annonces périmées. Nous vous offrons de la précision : exactement dix opportunités hautement compatibles chaque jour.",
      badge1: "Scoring Basé sur les Compétences",
      badge2: "Postes Locaux & Télétravail",
      badge3: "Entreprises Vérifiées",
      cardTag: "Meilleur Match du Jour",
      matchScore: "96% de Correspondance",
      viewMatches: "Découvrir les Offres",
    },
    howItWorks: {
      title: "Comment Fonctionne DecaJobs en 3 Étapes Simples",
      subtitle: "Configurez votre profil en 2 minutes. Recevez vos offres chaque matin.",
      step1Title: "1. Décrivez votre profil",
      step1Desc: "Indiquez vos métiers cibles, compétences clés et localisation souhaitée (ville, pays ou remote).",
      step2Title: "2. Notre IA analyse 100 000+ offres",
      step2Desc: "Chaque nuit, notre algorithme compare les offres actives et élimine les doublons et annonces spam.",
      step3Title: "3. Réveillez-vous avec vos 10 offres",
      step3Desc: "À 8h00, ouvrez un e-mail épuré avec des liens de candidature directe en 1 clic.",
    },
    features: {
      title: "Conçu pour les talents qui valorisent leur temps",
      subtitle: "Tout le nécessaire pour trouver votre prochain poste sans distraction.",
      f1Title: "Digest Quotidien Sans Bruit",
      f1Desc: "Plus besoin de parcourir 50 pages d'annonces non pertinentes. Juste 10 opportunités de haute qualité.",
      f2Title: "Couverture Locale et Télétravail",
      f2Desc: "Que vous cherchiez un emploi sur site ou un rôle en remote international, nous vous accompagnons.",
      f3Title: "Optimiseur de CV par IA",
      f3Desc: "Analysez votre CV face aux fiches de poste et recevez des recommandations ATS concrètes.",
      f4Title: "Candidature Directe",
      f4Desc: "Postulez directement sur les sites carrières officiels des entreprises sans intermédiaires.",
    },
    faq: {
      title: "Questions Fréquentes",
      subtitle: "Tout ce qu'il faut savoir sur DecaJobs et le service Daily 10.",
      q1: "DecaJobs est-il entièrement gratuit pour les candidats ?",
      a1: "Oui ! La création de profil et la réception quotidienne des 10 offres par e-mail sont 100% gratuites à vie.",
      q2: "Puis-je utiliser DecaJobs depuis la France ou un pays francophone ?",
      a2: "Absolument. DecaJobs accompagne des candidats en France, au Canada, en Belgique, en Suisse et dans plus de 150 pays.",
      q3: "Que se passe-t-il s'il y a peu d'offres dans ma ville ?",
      a3: "Notre moteur complète automatiquement avec des offres en télétravail mondial correspondant à vos compétences, vous garantissant 10 postes chaque matin.",
      q4: "Les entreprises peuvent-elles publier des offres ?",
      a4: "Oui, les recruteurs vérifiés peuvent publier des postes pour toucher les meilleurs talents de notre réseau.",
    },
    ctaSection: {
      title: "Prêt à transformer votre recherche d'emploi ?",
      subtitle: "Rejoignez plus de 25 000 professionnels recevant leurs 10 offres triées chaque matin.",
      button: "Recevoir Mes 10 Offres Gratuites",
      noCreditCard: "Aucune carte requise • Configuration en 2 min • Désinscription en 1 clic",
    },
    footer: {
      tagline: "La plateforme d'emploi sans bruit qui livre 10 opportunités ciblées dans votre boîte mail chaque matin.",
      rights: "DecaJobs. Tous droits réservés.",
      privacy: "Politique de Confidentialité",
      terms: "Conditions d'Utilisation",
      contact: "Contact",
      disclaimer: "Mentions Légales",
      selectLanguage: "Langue",
    },
  },

  de: {
    meta: {
      title: "DecaJobs — Jeden Morgen 10 Handverlesene Jobs in Ihrem Postfach",
      description:
        "KI-gestütztes Jobportal, das genau auf Ihre Fähigkeiten und Ihren Standort abgestimmt ist. Erhalten Sie jeden Morgen um 8:00 Uhr 10 geprüfte Jobangebote.",
      keywords:
        "kuratierte jobs, daily 10 jobs, remote jobs, softwareentwickler jobs, ki jobsuche, internationale karriere",
    },
    nav: {
      jobs: "Jobs",
      resumeAi: "KI-Lebenslauf",
      tools: "Tools",
      howItWorks: "So funktioniert's",
      pricing: "Preise",
      about: "Über uns",
      blog: "Blog",
      login: "Anmelden",
      getStarted: "Kostenlos starten",
      postJob: "Job inserieren",
      daily10: "Meine Daily 10",
    },
    hero: {
      badge: "✨ Weltweiter Start — Verfügbar für Kandidaten in über 150 Ländern",
      titleLine1: "Schluss mit 100 Bewerbungen.",
      titleHighlight: "Erhalten Sie die 10 passenden,",
      titleLine2: "jeden Morgen.",
      subtitle:
        "DecaJobs beendet das endlose Suchen auf Jobportalen. Unsere KI analysiert Ihre Wunschpositionen, Skills und Ihr Land und schickt Ihnen pünktlich um 8:00 Uhr genau 10 geprüfte Angebote.",
      ctaPrimary: "Meine Daily 10 kostenlos erhalten",
      ctaSecondary: "Aktuelle Jobs durchsuchen",
      guarantee: "100% kostenlos für Bewerber • Genau 10 kuratierte Jobs • Kein Spam",
      ratingText: "Bereits von über 25.000 Fachkräften weltweit genutzt",
    },
    globalBanner: {
      badge: "Globale Jobabdeckung",
      title: "Egal von wo Sie sich anmelden: 10 passende Jobs jeden Tag.",
      description:
        "Ob in Berlin, München, Wien, Zürich oder im weltweiten Homeoffice — unser Matching-Algorithmus liefert hochrelevante Stellenangebote für Ihre Zeitzone und Region.",
      stat1Label: "Tägliche Matches",
      stat1Value: "10 Jobs",
      stat2Label: "Unterstützte Länder",
      stat2Value: "150+",
      stat3Label: "Reduzierter Spam",
      stat3Value: "98%",
    },
    daily10: {
      eyebrow: "Die Daily 10 Engine",
      title: "Qualität statt endlosem Scrollen",
      subtitle:
        "Die meisten Portale überfluten Sie mit veralteten Angeboten. Wir setzen auf Präzision: Genau zehn hochgradig passende Positionen pro Tag.",
      badge1: "Skill-gewichtetes Matching",
      badge2: "Lokale & Remote Optionen",
      badge3: "Verifizierte Arbeitgeber",
      cardTag: "Top-Tipp des Tages",
      matchScore: "96% Übereinstimmung",
      viewMatches: "Heutige Matches ansehen",
    },
    howItWorks: {
      title: "In 3 einfachen Schritten zu Ihrem Traumjob",
      subtitle: "Einmalig in 2 Minuten eingerichtet. Jeden Morgen neue Matches.",
      step1Title: "1. Profil definieren",
      step1Desc: "Geben Sie Ihre Wunschrollen, Kernkompetenzen und Ihren bevorzugten Arbeitsort an.",
      step2Title: "2. KI prüft über 100.000 Stellen",
      step2Desc: "Jede Nacht gleicht unser Algorithmus Stellenanzeigen ab und filtert Dubletten und Spam heraus.",
      step3Title: "3. Mit Ihren Daily 10 aufwachen",
      step3Desc: "Um 8:00 Uhr erhalten Sie eine übersichtliche E-Mail mit direkten 1-Klick-Bewerbungslinks.",
    },
    features: {
      title: "Entwickelt für Fachkräfte, die ihre Zeit schätzen",
      subtitle: "Alles, was Sie für Ihre nächste Karrierestufe ohne Ablenkung benötigen.",
      f1Title: "Spamfreie tägliche Zusammenfassung",
      f1Desc: "Nie wieder durch 50 Seiten irrelevanter Anzeigen wühlen. Nur 10 treffende Empfehlungen.",
      f2Title: "Lokale & weltweite Remote-Jobs",
      f2Desc: "Von Vor-Ort-Stellen in Ihrer Stadt bis zu globalen Remote-Rollen bei internationalen Vorreitern.",
      f3Title: "KI-Lebenslauf-Optimierer",
      f3Desc: "Gleichen Sie Ihren Lebenslauf mit Stellenprofilen ab und optimieren Sie ihn für ATS-Scanner.",
      f4Title: "Direkte Unternehmenslinks",
      f4Desc: "Bewerben Sie sich direkt auf den Karriereseiten der Unternehmen ohne Personalvermittler-Umwege.",
    },
    faq: {
      title: "Häufig gestellte Fragen",
      subtitle: "Wissenswertes rund um DecaJobs und den Daily 10 Service.",
      q1: "Ist DecaJobs für Bewerber dauerhaft kostenlos?",
      a1: "Ja! Das Erstellen Ihres Profils und der Empfang der täglichen 10 Jobs per E-Mail ist zu 100% kostenlos.",
      q2: "Funktioniert DecaJobs auch in Deutschland, Österreich und der Schweiz?",
      a2: "Selbstverständlich. DecaJobs unterstützt Fachkräfte in der gesamten DACH-Region sowie weltweit in über 150 Ländern.",
      q3: "Was passiert, wenn es in meiner Stadt weniger als 10 Jobs gibt?",
      a3: "Unser System füllt die Liste automatisch mit verifizierten, globalen Remote-Jobs auf, die genau zu Ihren Skills passen.",
      q4: "Können Arbeitgeber Stellenanzeigen schalten?",
      a4: "Ja, geprüfte Unternehmen können Stellen ausschreiben, um hochqualifizierte Talente in unserem Netzwerk zu erreichen.",
    },
    ctaSection: {
      title: "Bereit für eine smarte Jobsuche?",
      subtitle: "Schließen Sie sich über 25.000 Fachkräften an, die jeden Morgen ihre kuratierten 10 Jobs erhalten.",
      button: "Meine Daily 10 kostenlos starten",
      noCreditCard: "Keine Kreditkarte nötig • 2 Minuten Einrichtung • Jederzeit abbestellbar",
    },
    footer: {
      tagline: "Die fokussierte Jobplattform, die Ihnen jeden Morgen 10 kuratierte Stellenangebote ins Postfach liefert.",
      rights: "DecaJobs. Alle Rechte vorbehalten.",
      privacy: "Datenschutz",
      terms: "Nutzungsbedingungen",
      contact: "Kontakt",
      disclaimer: "Impressum",
      selectLanguage: "Sprache",
    },
  },

  pt: {
    meta: {
      title: "DecaJobs — 10 Vagas Selecionadas na Sua Caixa de Entrada Toda Manhã",
      description:
        "Portal de empregos com IA que combina perfeitamente com suas habilidades e localização. Candidatos do Brasil e Portugal recebem 10 vagas verificadas às 8h00.",
      keywords:
        "vagas selecionadas, daily 10 jobs, trabalho remoto, vagas desenvolvedor, ia recrutamento, vagas tecnologia",
    },
    nav: {
      jobs: "Vagas",
      resumeAi: "Currículo com IA",
      tools: "Ferramentas",
      howItWorks: "Como Funciona",
      pricing: "Planos",
      about: "Sobre",
      blog: "Blog",
      login: "Entrar",
      getStarted: "Começar Grátis",
      postJob: "Publicar Vaga",
      daily10: "Minhas 10 Diárias",
    },
    hero: {
      badge: "✨ Lançamento Global — Disponível para candidatos em mais de 150 países",
      titleLine1: "Pare de aplicar para 100 vagas.",
      titleHighlight: "Receba as 10 que importam,",
      titleLine2: "toda manhã.",
      subtitle:
        "O DecaJobs elimina o lixo dos sites de vagas. Nossa IA analisa seus cargos de interesse, habilidades e país para entregar exatamente 10 oportunidades verificadas às 8:00.",
      ctaPrimary: "Receber Minhas 10 Vagas Grátis",
      ctaSecondary: "Ver Vagas Abertas",
      guarantee: "100% gratuito para candidatos • Exatamente 10 vagas curadas • Zero spam",
      ratingText: "Mais de 25.000 profissionais em todo o mundo confiam no DecaJobs",
    },
    globalBanner: {
      badge: "Cobertura Global de Vagas",
      title: "Cadastre-se de qualquer lugar do mundo. Receba 10 vagas ideais.",
      description:
        "Esteja você em São Paulo, Rio de Janeiro, Lisboa, Porto, Curitiba ou trabalhando 100% remoto, nosso motor de busca entrega vagas sob medida para seu fuso horário.",
      stat1Label: "Vagas Diárias Curadas",
      stat1Value: "10 Vagas",
      stat2Label: "Países Atendidos",
      stat2Value: "150+",
      stat3Label: "Redução de Ruído",
      stat3Value: "98%",
    },
    daily10: {
      eyebrow: "O Motor Daily 10",
      title: "Qualidade em vez de rolagem infinita",
      subtitle:
        "A maioria das plataformas te afoga em anúncios antigos. Nós entregamos precisão: dez posições altamente compatíveis todo dia.",
      badge1: "Pontuação Ponderada por Habilidades",
      badge2: "Opções Locais e Remotas",
      badge3: "Empresas Verificadas",
      cardTag: "Destaque de Hoje",
      matchScore: "96% de Compatibilidade",
      viewMatches: "Ver Vagas de Hoje",
    },
    howItWorks: {
      title: "Como o DecaJobs Funciona em 3 Passos Simples",
      subtitle: "Configure em menos de 2 minutos. Receba vagas toda manhã.",
      step1Title: "1. Informe seu perfil",
      step1Desc: "Adicione os cargos que busca, suas principais habilidades e localização (cidade ou remoto).",
      step2Title: "2. A IA avalia mais de 100.000 vagas",
      step2Desc: "Toda madrugada, nosso algoritmo filtra anúncios duplicados e encontra as melhores oportunidades.",
      step3Title: "3. Acorde com suas 10 Vagas",
      step3Desc: "Às 8:00, receba um e-mail limpo com links diretos de candidatura em 1 clique.",
    },
    features: {
      title: "Criado para profissionais que valorizam seu tempo",
      subtitle: "Tudo o que você precisa para dar o próximo passo na carreira sem distrações.",
      f1Title: "Resumo Diário Sem Ruído",
      f1Desc: "Nunca mais perca tempo passando por 50 páginas de vagas sem sentido. Apenas 10 opções certeiras.",
      f2Title: "Vagas Locais e Remoto Global",
      f2Desc: "Desde posições presenciais na sua cidade até vagas remotas internacionais em empresas globais.",
      f3Title: "Otimizador de Currículo com IA",
      f3Desc: "Avalie seu currículo contra descrições de vagas e aumente sua taxa de aprovação nos filtros ATS.",
      f4Title: "Candidatura Direta na Empresa",
      f4Desc: "Candidate-se diretamente nas páginas oficiais de carreiras das empresas, sem intermediários.",
    },
    faq: {
      title: "Perguntas Frequentes",
      subtitle: "Tudo o que você precisa saber sobre o DecaJobs e o serviço Daily 10.",
      q1: "O DecaJobs é gratuito para quem busca emprego?",
      a1: "Sim! Criar seu perfil e receber diariamente as 10 vagas por e-mail é 100% gratuito para sempre.",
      q2: "Funciona para profissionais no Brasil e Portugal?",
      a2: "Com certeza. O DecaJobs atende candidatos no Brasil, Portugal e em mais de 150 países pelo mundo.",
      q3: "E se houver poucas vagas na minha cidade?",
      a3: "O algoritmo completa a seleção automaticamente com vagas remotas globais verificadas alinhadas às suas habilidades.",
      q4: "Empresas podem anunciar vagas no DecaJobs?",
      a4: "Sim, empresas verificadas podem publicar vagas para alcançar profissionais qualificados da nossa rede.",
    },
    ctaSection: {
      title: "Pronto para transformar sua busca de emprego?",
      subtitle: "Junte-se a mais de 25.000 profissionais que recebem suas 10 vagas selecionadas toda manhã.",
      button: "Receber Minhas 10 Vagas Grátis",
      noCreditCard: "Sem cartão de crédito • Configuração rápida • Cancele quando quiser",
    },
    footer: {
      tagline: "A plataforma de vagas sem ruído que entrega 10 oportunidades selecionadas no seu e-mail toda manhã.",
      rights: "DecaJobs. Todos os direitos reservados.",
      privacy: "Política de Privacidade",
      terms: "Termos de Uso",
      contact: "Contato",
      disclaimer: "Aviso Legal",
      selectLanguage: "Idioma",
    },
  },

  ko: {
    meta: {
      title: "DecaJobs — 매일 아침 맞춤형 채용 공고 10개를 이메일로 받아보세요",
      description:
        "당신의 기술과 희망 근무지에 맞춘 AI 기반 채용 플랫폼. 국내 및 글로벌 구직자에게 매일 아침 8시 검증된 10개의 채용 정보를 전달합니다.",
      keywords:
        "맞춤형 채용, 데일리 10, 원격근무 채용, 개발자 취업, AI 채용 매칭, 해외 리모트 잡",
    },
    nav: {
      jobs: "채용공고",
      resumeAi: "이력서 AI 진단",
      tools: "취업 툴",
      howItWorks: "서비스 소개",
      pricing: "요금제",
      about: "회사소개",
      blog: "블로그",
      login: "로그인",
      getStarted: "무료로 시작하기",
      postJob: "채용공고 등록",
      daily10: "마이 데일리 10",
    },
    hero: {
      badge: "✨ 글로벌 서비스 오픈 — 전 세계 150개국 구직자 대상 서비스",
      titleLine1: "100군데 지원하느라 지치셨나요?",
      titleHighlight: "나에게 꼭 맞는 10개만,",
      titleLine2: "매일 아침 받아보세요.",
      subtitle:
        "DecaJobs는 채용공고의 스팸과 무의미한 나열을 없앱니다. AI 엔진이 지원자의 희망 직무, 기술 스택, 국가를 분석해 매일 아침 8시 검증된 10개의 채용 정보를 보내드립니다.",
      ctaPrimary: "매일 아침 10개 공고 무료 구독",
      ctaSecondary: "실시간 채용공고 둘러보기",
      guarantee: "구직자는 평생 100% 무료 • 정확히 엄선된 10개 공고 • 스팸 제로",
      ratingText: "전 세계 25,000명 이상의 글로벌 인재들이 DecaJobs를 신뢰합니다",
    },
    globalBanner: {
      badge: "글로벌 채용 지원",
      title: "지구 어디서 가입하든, 매일 아침 최적의 10개 공고가 도착합니다.",
      description:
        "서울, 판교, 부산은 물론 해외 원격근무(Remote) 포지션까지 지원자의 시차와 선호도에 맞춰 가장 적합한 공고를 매칭합니다.",
      stat1Label: "매일 엄선되는 공고",
      stat1Value: "10개 공고",
      stat2Label: "지원 대상 국가",
      stat2Value: "150개국 이상",
      stat3Label: "불필요한 공고 제거율",
      stat3Value: "98%",
    },
    daily10: {
      eyebrow: "Daily 10 매칭 엔진",
      title: "끝없는 스크롤 대신 '질 높은 10개'에 집중하세요",
      subtitle:
        "오래되고 관련 없는 공고로 가득 찬 채용 사이트는 이제 그만. DecaJobs는 오직 당신에게 최적화된 10개의 기회만을 정밀 선별합니다.",
      badge1: "기술 스택 가중치 매칭",
      badge2: "국내 및 글로벌 원격근무",
      badge3: "검증된 채용 기업",
      cardTag: "오늘의 추천 공고",
      matchScore: "96% 일치",
      viewMatches: "오늘의 매칭 공고 보기",
    },
    howItWorks: {
      title: "DecaJobs 이용 방법 (초간단 3단계)",
      subtitle: "2분 만에 설정 완료. 내일부터 매일 아침 이메일로 받아보세요.",
      step1Title: "1. 희망 직무 및 기술 등록",
      step1Desc: "원하는 포지션명, 핵심 기술 스택, 희망 근무지(도시 또는 원격)를 입력합니다.",
      step2Title: "2. AI가 10만 개 이상의 채용공고 분석",
      step2Desc: "매일 밤 알고리즘이 중복과 허위 공고를 걸러내고 당신의 프로필과 대조합니다.",
      step3Title: "3. 매일 아침 8시 공고 확인",
      step3Desc: "아침 8시, 1클릭으로 바로 지원 가능한 링크가 담긴 깔끔한 메일을 확인하세요.",
    },
    features: {
      title: "시간의 가치를 아는 인재들을 위해 만들었습니다",
      subtitle: "불필요한 시간 낭비 없이 커리어를 도약시키는 데 필요한 모든 것.",
      f1Title: "군더더기 없는 아침 다이제스트",
      f1Desc: "관련 없는 수십 페이지를 뒤적일 필요 없이 나에게 딱 맞는 10개만 확인하세요.",
      f2Title: "국내 채용 및 글로벌 리모트",
      f2Desc: "국내 주요 테크 기업부터 전 세계를 무대로 일할 수 있는 글로벌 원격 근무까지 완벽 지원.",
      f3Title: "이력서 AI 진단 및 최적화",
      f3Desc: "채용공고와 이력서를 대조해 서류 합격률(ATS 통과율)을 높이는 실질적 팁을 제공합니다.",
      f4Title: "기업 공식 채용 링크 직접 연결",
      f4Desc: "채용 대행사나 중간 브로커 없이 기업 공식 채용 페이지로 직접 지원할 수 있습니다.",
    },
    faq: {
      title: "자주 묻는 질문",
      subtitle: "DecaJobs와 Daily 10 서비스에 대해 궁금한 점을 확인하세요.",
      q1: "구직자는 정말 평생 무료로 이용할 수 있나요?",
      a1: "네! 구직자 프로필 생성 및 매일 아침 10개 채용공고 메일 구독은 평생 100% 무료입니다.",
      q2: "한국 거주자나 한국어 채용공고도 지원되나요?",
      a2: "네, 희망 근무지에 한국 도시를 입력하거나 글로벌 원격 근무를 선택해 맞춤형 공고를 받아보실 수 있습니다.",
      q3: "내 거주 지역에 등록된 공고가 10개 미만이면 어떻게 되나요?",
      a3: "내 기술 스택과 일치하는 검증된 글로벌 원격 채용공고로 자동 보완되어 매일 아침 정확히 10개의 알찬 기회를 보장합니다.",
      q4: "기업 담당자가 채용공고를 직접 등록할 수 있나요?",
      a4: "네, 인증된 기업 회원은 공고를 등록하여 전 세계 우수 인재들에게 채용 소식을 알릴 수 있습니다.",
    },
    ctaSection: {
      title: "구직 활동의 패러다임을 바꿀 준비가 되셨나요?",
      subtitle: "매일 아침 엄선된 10개의 기회를 만나보는 25,000명 이상의 인재들과 함께하세요.",
      button: "무료로 Daily 10 시작하기",
      noCreditCard: "신용카드 필요 없음 • 2분 등록 • 언제든지 구독 해지 가능",
    },
    footer: {
      tagline: "채용 정보의 노이즈를 없애고 매일 아침 엄선된 10개의 기회를 전달하는 스마트 채용 플랫폼.",
      rights: "DecaJobs. All rights reserved.",
      privacy: "개인정보처리방침",
      terms: "이용약관",
      contact: "문의하기",
      disclaimer: "면책조항",
      selectLanguage: "언어",
    },
  },

  it: {
    meta: {
      title: "DecaJobs — 10 Offerte di Lavoro Selezionate nella Tua Casella Ogni Mattina",
      description:
        "Piattaforma di lavoro basata su intelligenza artificiale che trova il lavoro perfetto per le tue competenze e la tua città. Ricevi 10 offerte verificate ogni mattina alle 8:00.",
      keywords:
        "offerte di lavoro, daily 10 jobs, lavoro da remoto, lavoro sviluppatore software, matching lavoro ia, carriera internazionale",
    },
    nav: {
      jobs: "Lavoro",
      resumeAi: "CV con IA",
      tools: "Strumenti",
      howItWorks: "Come Funziona",
      pricing: "Prezzi",
      about: "Chi Siamo",
      blog: "Blog",
      login: "Accedi",
      getStarted: "Inizia Gratis",
      postJob: "Pubblica Offerta",
      daily10: "I Miei 10 del Giorno",
    },
    hero: {
      badge: "✨ Lancio Mondiale — Disponibile per candidati in oltre 150 Paesi",
      titleLine1: "Basta inviare 100 candidature a caso.",
      titleHighlight: "Ricevi le 10 che contano davvero,",
      titleLine2: "ogni mattina.",
      subtitle:
        "DecaJobs elimina il rumore dai portali di annunci. Il nostro motore IA analizza le tue competenze, il tuo ruolo desiderato e il tuo Paese per inviarti 10 posizioni verificate alle 8:00.",
      ctaPrimary: "Ricevi Gratis le Mie 10 Offerte",
      ctaSecondary: "Esplora Offerte Attive",
      guarantee: "100% gratuito per i candidati • Esattamente 10 offerte selezionate • Zero spam",
      ratingText: "Scelto da oltre 25.000 professionisti in tutto il mondo",
    },
    globalBanner: {
      badge: "Copertura Lavorativa Globale",
      title: "Registrati da qualunque parte del mondo. Ricevi 10 offerte su misura.",
      description:
        "Che tu sia a Milano, Roma, Torino, Firenze, Bologna o lavori in full remote, il nostro algoritmo seleziona le posizioni più vantaggiose per la tua area geografica.",
      stat1Label: "Offerte Selezionate al Giorno",
      stat1Value: "10 Offerte",
      stat2Label: "Paesi Supportati",
      stat2Value: "150+",
      stat3Label: "Rumore e Spam Filtrati",
      stat3Value: "98%",
    },
    daily10: {
      eyebrow: "Il Motore Daily 10",
      title: "Qualità al posto dello scrolling infinito",
      subtitle:
        "La maggior parte dei portali ti sommerge di annunci scaduti. Noi puntiamo sulla precisione: dieci opportunità ad alta affinità ogni giorno.",
      badge1: "Punteggio Basato sulle Competenze",
      badge2: "Opzioni Locali e da Remoto",
      badge3: "Aziende Verificate",
      cardTag: "Scelta Migliore di Oggi",
      matchScore: "96% di Compatibilità",
      viewMatches: "Visualizza Offerte di Oggi",
    },
    howItWorks: {
      title: "Come Funziona DecaJobs in 3 Semplici Passaggi",
      subtitle: "Configura il tuo profilo in meno di 2 minuti. Ricevi offerte ogni mattina.",
      step1Title: "1. Descrivi il tuo profilo",
      step1Desc: "Inserisci i ruoli cercati, le competenze chiave e la sede ideale (città, Paese o smart working).",
      step2Title: "2. L'IA analizza oltre 100.000 annunci",
      step2Desc: "Ogni notte il nostro algoritmo scansiona le offerte attive eliminando duplicati e annunci fittizi.",
      step3Title: "3. Svegliati con le tue 10 Offerte",
      step3Desc: "Alle 8:00 ricevi un'email pulita con link diretti per candidarti con 1 clic.",
    },
    features: {
      title: "Creato per professionisti che danno valore al loro tempo",
      subtitle: "Tutto ciò di cui hai bisogno per trovare la tua prossima opportunità senza perdite di tempo.",
      f1Title: "Riepilogo Mattutino Senza Spam",
      f1Desc: "Non dovrai più sfogliare decine di pagine di annunci non attinenti. Solo 10 opportunità mirate.",
      f2Title: "Lavoro in Sede e Remoto Globale",
      f2Desc: "Dalle posizioni nelle città italiane ai ruoli in smart working per aziende internazionali.",
      f3Title: "Ottimizzatore Curriculum con IA",
      f3Desc: "Confronta il tuo CV con i requisiti del lavoro e ottieni suggerimenti per superare i filtri ATS.",
      f4Title: "Candidature Dirette alle Aziende",
      f4Desc: "Candidati direttamente sui portali aziendali ufficiali senza intermediari o recruiter terzi.",
    },
    faq: {
      title: "Domande Frequenti",
      subtitle: "Tutto quello che c'è da sapere su DecaJobs e sul servizio Daily 10.",
      q1: "DecaJobs è completamente gratuito per i candidati?",
      a1: "Sì! Creare il profilo e ricevere le 10 offerte giornaliere via email è e rimarrà 100% gratuito.",
      q2: "Posso utilizzare DecaJobs dall'Italia o da altri Paesi europei?",
      a2: "Certamente. DecaJobs supporta candidati in Italia, Svizzera e in oltre 150 Paesi del mondo.",
      q3: "Cosa succede se nella mia città ci sono meno di 10 offerte?",
      a3: "Il sistema completa automaticamente le posizioni mancanti con offerte da remoto internazionali compatibili con le tue competenze.",
      q4: "I datori di lavoro possono pubblicare annunci?",
      a4: "Sì, le aziende verificate possono pubblicare offerte per raggiungere talenti qualificati nel nostro network.",
    },
    ctaSection: {
      title: "Pronto a rivoluzionare la tua ricerca di lavoro?",
      subtitle: "Unisciti a oltre 25.000 professionisti che ricevono le loro 10 offerte selezionate ogni mattina.",
      button: "Ricevi Gratis le Mie 10 Offerte",
      noCreditCard: "Nessuna carta di credito richiesta • Attivazione in 2 min • Cancellazione libera",
    },
    footer: {
      tagline: "La piattaforma di lavoro senza rumore che consegna 10 offerte mirate nella tua casella ogni mattina.",
      rights: "DecaJobs. Tutti i diritti riservati.",
      privacy: "Informativa sulla Privacy",
      terms: "Termini di Servizio",
      contact: "Contatti",
      disclaimer: "Note Legali",
      selectLanguage: "Lingua",
    },
  },
};
