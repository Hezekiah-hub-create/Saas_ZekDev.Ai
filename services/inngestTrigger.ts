"use server";

import { inngest } from "@/inngest/client";
import { lessongeneratorParams, translatorParams } from "@/types";

export async function lessongeneratorTrigger({
  topic,
  proficiency,
  selectedLanguage,
  userId,
}: lessongeneratorParams) {
  try {
    await inngest.send({
      name: "congivox/lessongenerator",
      data: { topic, proficiency, selectedLanguage, userId },
    });
  } catch (error) {
    console.log(error);
  }
}

export async function translatorTrigger({
  sourceLangName,
  targetLangName,
  text,
  userId,
  selectedLanguage,
}: translatorParams) {
  try {
    await inngest.send({
      name: "congivox/translator",
      data: { sourceLangName, targetLangName, text, userId, selectedLanguage },
    });
  } catch (error) {
    console.log(error);
  }
}