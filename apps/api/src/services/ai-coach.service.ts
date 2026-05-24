import OpenAI from "openai";
import type { TypingSessionInput } from "@typemind/shared";
import type { AiAnalyzeResponse, AiGenerateTextResponse, WeaknessProfile } from "@typemind/shared";
import { generateWordsText } from "@typemind/shared";
import { env } from "../config/env";
import { WeaknessProfile as WeaknessProfileModel } from "../models/WeaknessProfile";
import { AdaptiveText } from "../models/AdaptiveText";

const PUNCTUATION = /[.,!?;:'"()\[\]{}@#$%^&*\-_/\\<>]/;
const NUMBERS = /[0-9]/;

export function localPreAnalyze(session: TypingSessionInput): WeaknessProfile {
  const weakChars: { char: string; rate: number }[] = [];
  for (const stat of session.charStats) {
    const total = stat.correct + stat.incorrect;
    if (total < 3) continue;
    const errorRate = stat.incorrect / total;
    if (errorRate > 0.15 || stat.avgLatencyMs > 400) {
      weakChars.push({ char: stat.char, rate: errorRate });
    }
  }
  weakChars.sort((a, b) => b.rate - a.rate);

  const slowPatterns = session.charStats
    .filter((s) => s.avgLatencyMs > 350 && s.correct + s.incorrect >= 2)
    .map((s) => s.char)
    .slice(0, 8);

  let punctTotal = 0;
  let punctErrors = 0;
  let numTotal = 0;
  let numErrors = 0;

  for (const stat of session.charStats) {
    if (PUNCTUATION.test(stat.char)) {
      punctTotal += stat.correct + stat.incorrect;
      punctErrors += stat.incorrect;
    }
    if (NUMBERS.test(stat.char)) {
      numTotal += stat.correct + stat.incorrect;
      numErrors += stat.incorrect;
    }
  }

  const hesitationZones = session.keyEvents
    .filter((e, i, arr) => {
      if (i === 0) return false;
      return e.timestamp - arr[i - 1]!.timestamp > 800;
    })
    .map((e) => e.key)
    .slice(0, 10);

  return {
    weakChars: weakChars.map((c) => c.char).slice(0, 10),
    weakNgrams: session.ngramMistakes
      .sort((a, b) => b.count - a.count)
      .map((n) => n.pattern)
      .slice(0, 10),
    slowPatterns,
    punctuationScore:
      punctTotal > 0 ? Math.round((1 - punctErrors / punctTotal) * 100) : 100,
    numberScore: numTotal > 0 ? Math.round((1 - numErrors / numTotal) * 100) : 100,
    hesitationZones: [...new Set(hesitationZones)],
  };
}

function buildFallbackInsights(profile: WeaknessProfile): string[] {
  const insights: string[] = [];
  if (profile.punctuationScore < 85) {
    insights.push("You are slow while typing punctuation.");
  }
  if (profile.numberScore < 85) {
    insights.push("Your accuracy drops near numbers.");
  }
  if (profile.weakNgrams.length > 0) {
    insights.push(`You frequently mistype '${profile.weakNgrams[0]}' combinations.`);
  }
  if (profile.slowPatterns.length > 0) {
    insights.push(`Hesitation detected around '${profile.slowPatterns.slice(0, 3).join("', '")}'.`);
  }
  if (profile.weakChars.length > 0) {
    insights.push(`Weak characters: ${profile.weakChars.slice(0, 5).join(", ")}.`);
  }
  if (insights.length === 0) {
    insights.push("Great session! Keep practicing to maintain consistency.");
  }
  return insights.slice(0, 5);
}

function generateBuiltinText(focusAreas: string[]): string {
  const areas = focusAreas.length > 0 ? focusAreas : ["th", "tion", "ing"];
  const sentences = [
    `The ${areas[0] ?? "th"} combination appears throughout this thoughtful practice passage.`,
    `Precision with punctuation, numbers (12345), and symbols (@#$) builds typing fluency.`,
    `Repetition of ${areas.join(", ")} patterns strengthens muscle memory naturally.`,
    `Quick brown foxes jump; however, steady rhythm matters more than raw speed.`,
    generateWordsText(30),
  ];
  return sentences.join(" ");
}

export async function analyzeSession(
  userId: string,
  session: TypingSessionInput
): Promise<AiAnalyzeResponse> {
  const weaknessProfile = localPreAnalyze(session);
  const focusAreas = [
    ...weaknessProfile.weakNgrams.slice(0, 3),
    ...weaknessProfile.weakChars.slice(0, 3),
  ].filter(Boolean);

  if (weaknessProfile.punctuationScore < 85) focusAreas.push("punctuation");
  if (weaknessProfile.numberScore < 85) focusAreas.push("numbers");

  const uniqueFocus = [...new Set(focusAreas)].slice(0, 6);

  let insights = buildFallbackInsights(weaknessProfile);
  let suggestedDrills = uniqueFocus.map((pattern) => ({
    pattern,
    exampleText: `Practice the "${pattern}" pattern repeatedly in context.`,
  }));

  if (env.openaiApiKey) {
    try {
      const openai = new OpenAI({ apiKey: env.openaiApiKey });
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: `You are a typing coach. Respond ONLY with JSON: { "insights": string[] (max 5), "focusAreas": string[], "suggestedDrills": { "pattern": string, "exampleText": string }[] }`,
          },
          {
            role: "user",
            content: JSON.stringify({
              wpm: session.wpm,
              accuracy: session.accuracy,
              weaknessProfile,
            }),
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
      });

      const content = response.choices[0]?.message?.content;
      if (content) {
        const parsed = JSON.parse(content) as {
          insights?: string[];
          focusAreas?: string[];
          suggestedDrills?: { pattern: string; exampleText: string }[];
        };
        if (parsed.insights?.length) insights = parsed.insights.slice(0, 5);
        if (parsed.suggestedDrills?.length) suggestedDrills = parsed.suggestedDrills;
      }
    } catch (err) {
      console.warn("OpenAI analyze failed, using fallback:", err);
    }
  }

  await WeaknessProfileModel.findOneAndUpdate(
    { userId },
    { ...weaknessProfile, lastAnalyzedAt: new Date() },
    { upsert: true, new: true }
  );

  return {
    insights,
    focusAreas: uniqueFocus,
    suggestedDrills,
    weaknessProfile,
  };
}

export async function generateAdaptiveText(
  userId: string,
  focusAreas?: string[]
): Promise<AiGenerateTextResponse> {
  const profile = await WeaknessProfileModel.findOne({ userId }).lean();
  const areas =
    focusAreas ??
    [
      ...(profile?.weakNgrams ?? []).slice(0, 3),
      ...(profile?.weakChars ?? []).slice(0, 2),
    ];

  if (!env.openaiApiKey) {
    const content = generateBuiltinText(areas);
    await AdaptiveText.create({ userId, source: "builtin", content, focusAreas: areas });
    return { content, focusAreas: areas, source: "builtin" };
  }

  try {
    const openai = new OpenAI({ apiKey: env.openaiApiKey });
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Generate an 80-120 word English typing practice passage. Include the weak patterns provided. No markdown. Plain text only.",
        },
        {
          role: "user",
          content: `Focus areas: ${areas.join(", ") || "general typing"}. Include punctuation and numbers if listed.`,
        },
      ],
      temperature: 0.8,
      max_tokens: 300,
    });

    const content =
      response.choices[0]?.message?.content?.trim() || generateBuiltinText(areas);
    await AdaptiveText.create({ userId, source: "ai", content, focusAreas: areas });
    return { content, focusAreas: areas, source: "ai" };
  } catch (err) {
    console.warn("OpenAI generate failed, using fallback:", err);
    const content = generateBuiltinText(areas);
    await AdaptiveText.create({ userId, source: "builtin", content, focusAreas: areas });
    return { content, focusAreas: areas, source: "builtin" };
  }
}
