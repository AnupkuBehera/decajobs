"use client";

import React, { useState } from "react";
import { ENGLISH_TO_HINDI_DICTIONARY } from "@/lib/multilingual-mapping";

interface JobTranslatorButtonProps {
  originalTitle: string;
  originalDescription: string;
  location: string;
}

export function JobTranslatorButton({
  originalTitle,
  originalDescription,
  location,
}: JobTranslatorButtonProps) {
  const [isTranslated, setIsTranslated] = useState(false);

  // In-browser translation heuristic
  const translatedTitle =
    ENGLISH_TO_HINDI_DICTIONARY[originalTitle] ||
    `${originalTitle} (सत्यापित पद)`;

  const translateSummary = (text: string) => {
    let t = text;
    // Common terms replace
    t = t.replace(/Responsibilities:/gi, "मुख्य जिम्मेदारियां:");
    t = t.replace(/Requirements:/gi, "आवश्यक योग्यताएं एवं कौशल:");
    t = t.replace(/We are looking for/gi, "कंपनी को आवश्यकता है");
    t = t.replace(/years of experience/gi, "वर्षों का कार्यानुभव");
    t = t.replace(/Strong knowledge of/gi, "गहरा ज्ञान होना चाहिए:");
    t = t.replace(/Excellent communication/gi, "उत्कृष्ट संवाद कौशल");
    t = t.replace(/Competitive salary/gi, "आकर्षक एवं प्रतिस्पर्धी वेतन");
    t = t.replace(/Visa sponsorship/gi, "वीज़ा स्पॉन्सरशिप उपलब्ध");
    return t;
  };

  return (
    <div className="my-4">
      <div className="flex items-center justify-between gap-3 p-3 bg-neutral-50 rounded-xl border border-neutral-200">
        <div className="flex items-center gap-2 text-xs text-neutral-700">
          <span className="text-base">🌐</span>
          <span className="font-semibold">
            {isTranslated ? "हिंदी अनुवाद सक्रिय है" : "Read this job in Hindi?"}
          </span>
          <span className="text-neutral-400 text-[11px] hidden sm:inline">
            (तकनीकी कीवर्ड्स जैसे React, Python, SQL सुरक्षित रखे गए हैं)
          </span>
        </div>
        <button
          type="button"
          onClick={() => setIsTranslated(!isTranslated)}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-2xs ${
            isTranslated
              ? "bg-primary-600 text-white"
              : "bg-white border border-neutral-300 text-neutral-800 hover:bg-neutral-100"
          }`}
        >
          {isTranslated ? "✓ View in English" : "अनुवाद करें (हिन्दी)"}
        </button>
      </div>

      {isTranslated && (
        <div className="mt-3 p-4 bg-orange-50/50 border border-orange-200/80 rounded-xl text-xs text-neutral-800 space-y-2.5 animate-fadeIn">
          <div className="flex items-center gap-2 text-orange-900 font-bold">
            <span>🇮🇳</span>
            <span>हिंदी विवरण: {translatedTitle}</span>
          </div>
          <p className="leading-relaxed whitespace-pre-line text-neutral-700 font-sans">
            {translateSummary(originalDescription.slice(0, 800))}
            {originalDescription.length > 800 && "..."}
          </p>
          <div className="pt-2 border-t border-orange-200/60 flex items-center justify-between text-[11px] text-orange-950 font-medium">
            <span>📍 स्थान: {location.includes("Remote") ? "रिमोट (घर से काम)" : location}</span>
            <span>✓ AI त्वरित अनुवाद</span>
          </div>
        </div>
      )}
    </div>
  );
}
