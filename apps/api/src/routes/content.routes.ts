import { Router } from "express";
import { QUOTES } from "@typemind/shared";
import { CODE_SNIPPETS } from "../data/code-snippets";

const router = Router();

router.get("/quotes", (_req, res) => {
  res.json({ quotes: QUOTES });
});

router.get("/code/:lang", (req, res) => {
  const lang = req.params.lang?.toLowerCase() || "javascript";
  const snippets = CODE_SNIPPETS[lang];
  if (!snippets) {
    res.status(404).json({ error: "Language not found" });
    return;
  }
  const snippet = snippets[Math.floor(Math.random() * snippets.length)]!;
  res.json({ language: lang, content: snippet });
});

export default router;
