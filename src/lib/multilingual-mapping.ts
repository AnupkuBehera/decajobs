/**
 * Multilingual Search & Job Title Synonym Mapping
 *
 * Enables cross-language discovery where users searching in Hindi (e.g. "लेखा सहायक", "सॉफ्टवेयर डेवलपर")
 * or regional terms are seamlessly mapped to standard industry job titles, skills, and categories.
 */

export interface MultilingualTermMapping {
  standardTitle: string;
  hindiTerms: string[];
  bengaliTerms?: string[];
  tamilTerms?: string[];
  teluguTerms?: string[];
  odiaTerms?: string[];
  hinglishTerms: string[];
  categorySlug: string;
  equivalentSkills: string[];
}

export const MULTILINGUAL_ROLE_MAPPINGS: MultilingualTermMapping[] = [
  {
    standardTitle: "Software Engineer",
    hindiTerms: ["सॉफ्टवेयर इंजीनियर", "सॉफ्टवेयर डेवलपर", "कंप्यूटर प्रोग्रामर", "सॉफ्टवेयर प्रोग्रामर"],
    bengaliTerms: ["সফটওয়্যার ইঞ্জিনিয়ার", "সফটওয়্যার ডেভেলপার", "কম্পিউটার প্রোগ্রামার"],
    tamilTerms: ["மென்பொருள் பொறியாளர்", "மென்பொருள் டெவலப்பர்"],
    teluguTerms: ["సాఫ్ట్‌వేర్ ఇంజనీర్", "సాఫ్ట్‌వేర్ డెవలపర్"],
    odiaTerms: ["ସଫ୍ଟୱେୟାର ଇଞ୍ଜିନିୟର", "ସଫ୍ଟୱେୟାର ଡେଭଲପର"],
    hinglishTerms: ["software engineer", "developer", "coder", "programmer", "sde"],
    categorySlug: "software-engineering",
    equivalentSkills: ["JavaScript", "Python", "Java", "React", "Node.js", "SQL"],
  },
  {
    standardTitle: "Frontend Developer",
    hindiTerms: ["फ्रंटएंड डेवलपर", "वेबसाइट डिज़ाइनर", "वेब डेवलपर"],
    bengaliTerms: ["ফ্রন্টএন্ড ডেভেলপার", "ওয়েব ডিজাইনার", "ওয়েব ডেভেলপার"],
    tamilTerms: ["முன்நிலை டெவலப்பர்", "வலை வடிவமைப்பாளர்"],
    teluguTerms: ["ఫ్రంటెండ్ డెవలపర్", "వెబ్ డిజైనర్"],
    odiaTerms: ["ଫ୍ରଣ୍ଟଏଣ୍ଡ ଡେଭଲପର", "ୱେବ ଡିଜାଇନର"],
    hinglishTerms: ["frontend", "front end", "ui developer", "web designer", "react developer"],
    categorySlug: "software-engineering",
    equivalentSkills: ["React", "HTML", "CSS", "JavaScript", "TypeScript", "Tailwind"],
  },
  {
    standardTitle: "Backend Developer",
    hindiTerms: ["बैकएंड डेवलपर", "सर्वर इंजीनियर", "डेटाबेस प्रोग्रामर"],
    bengaliTerms: ["ব্যাকএন্ড ডেভেলপার", "সার্ভার ইঞ্জিনিয়ার"],
    tamilTerms: ["பின்னணி டெவலப்பர்", "சர்வர் பொறியாளர்"],
    teluguTerms: ["బ్యాకెండ్ డెవలపర్", "సర్వర్ ఇంజనీర్"],
    odiaTerms: ["ବ୍ୟାକଏଣ୍ଡ ଡେଭଲପର", "ସର୍ଭର ଇଞ୍ଜିନିୟର"],
    hinglishTerms: ["backend", "back end", "api developer", "node developer", "java developer"],
    categorySlug: "software-engineering",
    equivalentSkills: ["Node.js", "Python", "Java", "PostgreSQL", "Go", "REST API"],
  },
  {
    standardTitle: "Accounts Assistant / Accountant",
    hindiTerms: ["लेखा सहायक", "अकाउंटेंट", "मुनीम", "अकाउंट असिस्टेंट", "खातापाल"],
    bengaliTerms: ["হিসাব সহকারী", "অ্যাকাউন্ট্যান্ট", "হিসাবরক্ষক"],
    tamilTerms: ["கணக்காளர்", "கணக்கு உதவியாளர்"],
    teluguTerms: ["అకౌంటెంట్", "ఖాతాల సహాయకుడు"],
    odiaTerms: ["ହିସାବ ସହାୟକ", "ଆକାଉଣ୍ଟାଣ୍ଟ"],
    hinglishTerms: ["accountant", "accounts assistant", "tally operator", "billing executive"],
    categorySlug: "finance-accounting",
    equivalentSkills: ["Tally", "GST", "Excel", "Bookkeeping", "Invoicing", "TDS"],
  },
  {
    standardTitle: "Financial Analyst",
    hindiTerms: ["वित्तीय विश्लेषक", "फाइनेंस एनालिस्ट", "वित्त विशेषज्ञ"],
    bengaliTerms: ["আর্থিক বিশ্লেষক", "ফাইন্যান্স অ্যানালিস্ট"],
    tamilTerms: ["நிதி ஆய்வாளர்"],
    teluguTerms: ["ఆర్థిక విశ్లేషకుడు"],
    odiaTerms: ["ଆର୍ଥିକ ବିଶ୍ଳେଷକ"],
    hinglishTerms: ["finance analyst", "financial analyst", "fp&a", "investment analyst"],
    categorySlug: "finance-accounting",
    equivalentSkills: ["Financial Modeling", "Excel", "SQL", "Forecasting", "Audit"],
  },
  {
    standardTitle: "Data Analyst",
    hindiTerms: ["डेटा विश्लेषक", "डेटा एनालिस्ट", "आंकड़ा विश्लेषक"],
    bengaliTerms: ["তথ্য বিশ্লেষক", "ডেটা অ্যানালিস্ট"],
    tamilTerms: ["தரவு ஆய்வாளர்"],
    teluguTerms: ["డేటా అనలిస్ట్", "దత్తాంశ విశ్లేషకుడు"],
    odiaTerms: ["ଡାଟା ଆନାଲିଷ୍ଟ", "ତଥ୍ୟ ବିଶ୍ଳେଷକ"],
    hinglishTerms: ["data analyst", "bi analyst", "business analyst", "data analytics"],
    categorySlug: "data-analytics",
    equivalentSkills: ["SQL", "Excel", "Power BI", "Tableau", "Python", "Pandas"],
  },
  {
    standardTitle: "Customer Support Executive",
    hindiTerms: ["ग्राहक सेवा", "कस्टमर सपोर्ट", "हेल्पडेस्क एग्जीक्यूटिव", "कॉल सेंटर"],
    bengaliTerms: ["গ্রাহক সেবা", "কাস্টমার সাপোর্ট", "কল সেন্টার"],
    tamilTerms: ["வாடிக்கையாளர் சேவை", "கால் சென்டர்"],
    teluguTerms: ["కస్టమర్ సపోర్ట్", "కాల్ సెంటర్"],
    odiaTerms: ["ଗ୍ରାହକ ସେବା", "କଷ୍ଟମର ସପୋର୍ଟ"],
    hinglishTerms: ["customer support", "customer care", "support executive", "bpo", "helpdesk"],
    categorySlug: "customer-support",
    equivalentSkills: ["Communication", "Zendesk", "Ticketing", "Problem Solving", "Email Support"],
  },
  {
    standardTitle: "Human Resources (HR) Executive",
    hindiTerms: ["मानव संसाधन", "एचआर एग्जीक्यूटिव", "रिक्रूटर", "भर्ती अधिकारी"],
    bengaliTerms: ["মানব সম্পদ", "এইচআর এক্সিকিউটিভ"],
    tamilTerms: ["மனித வளம்", "எச்ஆர்"],
    teluguTerms: ["మానవ వనరులు", "హెచ్‌ఆర్ ఎగ్జిక్యూటివ్"],
    odiaTerms: ["ମାନବ ସମ୍ବଳ", "ଏଚଆର ଏକ୍ଜିକ୍ୟୁଟିଭ"],
    hinglishTerms: ["hr executive", "recruiter", "talent acquisition", "hr assistant"],
    categorySlug: "human-resources",
    equivalentSkills: ["Sourcing", "Screening", "Interviewing", "Onboarding", "Payroll"],
  },
  {
    standardTitle: "Fresher / Entry-Level Jobs",
    hindiTerms: ["फ्रेशर नौकरियां", "शुरुआती स्तर", "कॉलेज प्लेसमेंट", "ट्रेनी"],
    bengaliTerms: ["ফ্রেশার চাকরি", "নতুনদের চাকরি", "ট্রেইনি"],
    tamilTerms: ["புதியவர்களுக்கான வேலை", "பயிற்சியாளர்"],
    teluguTerms: ["ఫ్రెషర్ ఉద్యోగాలు", "ట్రైనీ"],
    odiaTerms: ["ଫ୍ରେସର ଚାକିରି", "ଟ୍ରେନି"],
    hinglishTerms: ["fresher", "entry level", "graduate trainee", "intern", "junior developer"],
    categorySlug: "software-engineering",
    equivalentSkills: ["Basic Programming", "Aptitude", "Problem Solving", "Git"],
  },
];

/**
 * Normalizes query string across Indian regional languages and English.
 * If user queries in Hindi, Bengali, Tamil, Telugu, or Odia, returns the English canonical equivalent.
 */
export function expandMultilingualQuery(query: string): {
  normalizedQuery: string;
  detectedLanguage: "hi" | "bn" | "ta" | "te" | "or" | "en";
  matchedRole?: MultilingualTermMapping;
} {
  const clean = query.trim().toLowerCase();
  if (!clean) {
    return { normalizedQuery: "", detectedLanguage: "en" };
  }

  // Detect script
  let detectedLanguage: "hi" | "bn" | "ta" | "te" | "or" | "en" = "en";
  if (/[\u0900-\u097F]/.test(clean)) detectedLanguage = "hi";
  else if (/[\u0980-\u09FF]/.test(clean)) detectedLanguage = "bn";
  else if (/[\u0B80-\u0BFF]/.test(clean)) detectedLanguage = "ta";
  else if (/[\u0C00-\u0C7F]/.test(clean)) detectedLanguage = "te";
  else if (/[\u0B00-\u0B7F]/.test(clean)) detectedLanguage = "or";

  for (const mapping of MULTILINGUAL_ROLE_MAPPINGS) {
    const termArrays = [
      mapping.hindiTerms,
      mapping.bengaliTerms || [],
      mapping.tamilTerms || [],
      mapping.teluguTerms || [],
      mapping.odiaTerms || [],
    ];

    for (const terms of termArrays) {
      for (const term of terms) {
        if (clean.includes(term.toLowerCase()) || term.toLowerCase().includes(clean)) {
          return {
            normalizedQuery: `${mapping.standardTitle} ${mapping.equivalentSkills.slice(0, 3).join(" ")}`,
            detectedLanguage,
            matchedRole: mapping,
          };
        }
      }
    }

    // Check Hinglish / English match
    for (const hinglishTerm of mapping.hinglishTerms) {
      if (clean.includes(hinglishTerm) || hinglishTerm.includes(clean)) {
        return {
          normalizedQuery: mapping.standardTitle,
          detectedLanguage,
          matchedRole: mapping,
        };
      }
    }
  }

  return {
    normalizedQuery: query,
    detectedLanguage,
  };
}

/**
 * Quick inline dictionary for translating job titles and key responsibilities
 * into Hindi for the on-demand "Translate Job" feature.
 */
export const ENGLISH_TO_HINDI_DICTIONARY: Record<string, string> = {
  "Software Engineer": "सॉफ्टवेयर इंजीनियर",
  "Frontend Developer": "फ्रंटएंड डेवलपर",
  "Backend Developer": "बैकएंड डेवलपर",
  "Full Stack Developer": "फुल-स्टैक डेवलपर",
  "Data Analyst": "डेटा एनालिस्ट (डेटा विश्लेषक)",
  "Customer Support Specialist": "ग्राहक सेवा विशेषज्ञ",
  "Product Manager": "प्रोडक्ट मैनेजर",
  "DevOps Engineer": "डेवऑप्स एवं क्लाउड इंजीनियर",
  "Remote": "रिमोट (घर से काम)",
  "Hybrid": "हाइब्रिड (कार्यालय + घर)",
  "Full-time": "पूर्णकालिक (Full-time)",
  "Contract": "अनुबंध (Contract)",
  "Visa Sponsorship Available": "वीज़ा स्पॉन्सरशिप उपलब्ध",
  "Tax-Free Salary": "कर-मुक्त वेतन (100% टैक्स फ्री)",
  "Responsibilities": "मुख्य जिम्मेदारियां:",
  "Requirements": "आवश्यक योग्यताएं एवं कौशल:",
  "Benefits": "सुविधाएं एवं लाभ:",
  "Apply Now": "अभी आवेदन करें",
};
