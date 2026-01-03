import { generateLesson, translateText } from "@/services/geminiService";
import { inngest } from "./client";
import { db } from "@/services/firebase";
import { NonRetriableError } from "inngest";
import { lessongeneratorParams, translatorParams } from "@/types";

import { addDoc, collection, Timestamp } from "firebase/firestore";

export const lessongenerator = inngest.createFunction(
  { id: "congivox-lessongenerator" },
  { event: "congivox/lessongenerator" },
  async ({ event, step }) => {
    const { topic, proficiency, selectedLanguage, userId } =
      event.data as lessongeneratorParams;

    const plan = await step.run("Generate Lession", async () => {
      try {
        const plan = await generateLesson(topic, proficiency, selectedLanguage);
        return plan;
      } catch (error) {
        console.log(error);
        return null;
      }
    });

    const Saved = await step.run("Save the Lession", async () => {
      try {
        if (!plan) throw new NonRetriableError("No lesson plan generated");
        await addDoc(collection(db, "lessons"), {
          language: selectedLanguage,
          proficiency: proficiency,
          topic: topic,
          lessonPlan: plan,
          userId: userId,
          createdAt: Timestamp.now(),
        });
        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    });

    return {
      plan: plan,
      Saved,
    };
  }
);

export const translator = inngest.createFunction(
  { id: "congivox-translator" },
  { event: "congivox/translator" },
  async ({ event, step }) => {
    const { userId, sourceLangName, targetLangName, text, selectedLanguage } =
      event.data as translatorParams;

    const translatedText = await step.run("Translate text", async () => {
      try {
        const translatedText = await translateText(
          text,
          sourceLangName,
          targetLangName
        );
        return translatedText;
      } catch (error) {
        console.log(error);
        return "Failed to translate. Please try again.";
      }
    });

    const Saved = await step.run("Save translation", async () => {
      try {
        await addDoc(collection(db, "translations"), {
          translatedText,
          sourceLangName,
          targetLangName,
          text: text,
          userId: userId,
          selectedLanguage: selectedLanguage,
          createdAt: Timestamp.now(),
        });
        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    });

    return {
      translatedText,
      Saved,
    };
  }
);