"use client";

import { useEffect, useState } from "react";

import { translateText } from "@/services/geminiService";
import { LoadingSpinner } from "@/constants/icons/LoadingSpinner";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { SpeakerIcon } from "@/constants/icons/SpeakerIcon";
import { TranslatorIcon } from "@/constants/icons/TranslatorIcon";
import { SwapIcon } from "@/constants/icons/SwapIcon";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { LANGUAGES } from "@/constants/constants";
import { translatorParams, User } from "@/types";
import { translatorTrigger } from "@/services/inngestTriggers";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/services/firebase";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import { toast } from "sonner";

interface TranslatorProps {
  selectedLanguage: string;
  user: User;
}

export const Translator: React.FC<TranslatorProps> = ({
  selectedLanguage,
  user,
}) => {
  const [sourceText, setSourceText] = useState("");
  const [pending, setPending] = useState(false);
  const [translations, setTranslations] = useState<translatorParams[]>([]);
  const [direction, setDirection] = useState<"en-to-lang" | "lang-to-en">(
    "en-to-lang"
  );
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentInex] = useState(0);
  const { speak, pause, resume, cancel, restart, isSpeaking, isPaused, isSupported, hasCurrentUtterance } = useTextToSpeech();

  const language = LANGUAGES.find(
    (language) => language.name === selectedLanguage
  );

  const handleTranslate = async () => {
    if (!sourceText.trim()) return;

    setError(null);
    setPending(true);

    if (!user.isPro && language?.pro) {
      setError("Select language is only available for PRO members");
      toast.error("Select language is only available for PRO members");
      return;
    }

    try {
      const sourceLangName =
        direction === "en-to-lang" ? "English" : selectedLanguage;
      const targetLangName =
        direction === "en-to-lang" ? selectedLanguage : "English";

      await translatorTrigger({
        sourceLangName,
        targetLangName,
        text: sourceText,
        userId: user.id,
        selectedLanguage,
      });
      setSourceText("");
      setPending(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred."
      );
      setPending(false);
    }
  };

  const handleSwap = () => {
    setDirection((prev) =>
      prev === "en-to-lang" ? "lang-to-en" : "en-to-lang"
    );
  };

  const sourceLang = direction === "en-to-lang" ? "English" : selectedLanguage;
  const targetLang = direction === "en-to-lang" ? selectedLanguage : "English";

  const targetLangCode = direction === "en-to-lang" ? language?.code : "en-US";

  useEffect(() => {
    const unsub = onSnapshot(
      query(
        collection(db, "translations"),
        where("selectedLanguage", "==", selectedLanguage),
        where("userId", "==", user.id),
        orderBy("createdAt", "desc")
      ),
      (snapshot) => {
        setTranslations(
          snapshot.docs.map((doc) => ({
            text: doc.data().text,
            translatedText: doc.data().translatedText,
            sourceLangName: doc.data().sourceLangName,
            targetLangName: doc.data().targetLangName,
            userId: doc.data().userId,
            selectedLanguage: doc.data().selectedLanguage,
          }))
        );
      }
    );

    return () => unsub();
  }, [selectedLanguage]); // 👈 always has exactly one dependency
  // console.log("Translations:", translations, selectedLanguage, user.id);
  return (
    <div className="flex flex-col p-6 space-y-4">
      <div className="flex items-center text-xl font-bold text-primary">
        <TranslatorIcon />
        <h2>Translator</h2>
      </div>

      <div className="flex items-center justify-center gap-2">
        <span className="font-medium text-slate-600 dark:text-slate-300">
          {sourceLang}
        </span>
        <Button
          onClick={handleSwap}
          className="p-2 rounded-full transition-colors size-9.5"
          aria-label="Swap languages"
        >
          <SwapIcon />
        </Button>
        <span className="font-medium text-slate-600 dark:text-slate-300">
          {targetLang}
        </span>
      </div>

      <div>
        <Label htmlFor="source-text" className="sr-only">
          Text to translate
        </Label>
        <Textarea
          id="source-text"
          rows={5}
          value={sourceText}
          onChange={(e) => setSourceText(e.target.value)}
          placeholder={`Enter text in ${sourceLang}...`}
          className="dark:text-white"
        />
      </div>

      <Button onClick={handleTranslate} disabled={!sourceText.trim() || pending}>
        {pending ? <LoadingSpinner /> : "Translate"}
      </Button>

      {error && (
        <div className="text-red-500 text-sm p-3 bg-red-100 dark:bg-red-900/50 rounded-md">
          {error}
        </div>
      )}
      {translations.length === 0 && (
        <p className="text-center text-sm text-slate-500 dark:text-slate-400 py-4">
          Your translations will appear here.
        </p>
      )}
      {translations.length > 0 && (
        <>
          <div className="flex justify-between items-center">
            <h4 className="font-bold text-lg text-primary">
              Translations History
            </h4>
            <div className="flex gap-2">
              <span className="text-sm text-slate-500 dark:text-slate-400 self-center">
                Translation {currentIndex + 1} of {translations.length}
              </span>
              <Button
                size={"icon"}
                onClick={() =>
                  setCurrentInex((index) => Math.max(index - 1, 0))
                }
                disabled={currentIndex === 0}
              >
                <ChevronsLeft className="size-6" />
              </Button>
              <Button
                onClick={() =>
                  setCurrentInex((index) =>
                    Math.min(index + 1, translations.length - 1)
                  )
                }
                disabled={currentIndex === translations.length - 1}
                size={"icon"}
              >
                <ChevronsRight className="size-6" />
              </Button>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700 flex flex-col">
            {isSupported && translations.length !== 0 && (
              <div className="flex justify-between mb-2">
                <div className="font-medium text-slate-500 dark:text-slate-400 mb-1">
                  {translations[currentIndex].sourceLangName} →{" "}
                  {translations[currentIndex].targetLangName}
                </div>
                <div className="flex gap-1">
                  <SpeakerIcon
                    onClick={() =>
                      speak(
                        translations[currentIndex].translatedText || "",
                        targetLangCode!
                      )
                    }
                    disabled={isSpeaking}
                  />
                  <Button
                    size="sm"
                    onClick={pause}
                    disabled={!isSpeaking || isPaused}
                    className="px-2 py-1 text-xs"
                  >
                    Pause
                  </Button>
                  <Button
                    size="sm"
                    onClick={resume}
                    disabled={!isSpeaking || !isPaused}
                    className="px-2 py-1 text-xs"
                  >
                    Continue
                  </Button>
                  <Button
                    size="sm"
                    onClick={cancel}
                    disabled={!isSpeaking}
                    className="px-2 py-1 text-xs"
                  >
                    Stop
                  </Button>
                  <Button
                    size="sm"
                    onClick={restart}
                    disabled={!hasCurrentUtterance}
                    className="px-2 py-1 text-xs"
                  >
                    Restart
                  </Button>
                </div>
              </div>
            )}
            <div className="items-center mb-2">
              <div className="space-y-2">
                <p className="text-slate-800 dark:text-slate-100 whitespace-pre-wrap">
                  Original Text:
                  <span className="text-slate-500 dark:text-slate-400  ml-2">
                    {translations[currentIndex].text}
                  </span>
                </p>
                <p className="text-slate-800 dark:text-slate-100 whitespace-pre-wrap">
                  Translated Text:
                  <span className="text-slate-500 dark:text-slate-400  ml-2">
                    {translations[currentIndex].translatedText}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};