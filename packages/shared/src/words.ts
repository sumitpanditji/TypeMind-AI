export const COMMON_WORDS = [
  "the", "be", "to", "of", "and", "a", "in", "that", "have", "it",
  "for", "not", "on", "with", "he", "as", "you", "do", "at", "this",
  "but", "his", "by", "from", "they", "we", "say", "her", "she", "or",
  "an", "will", "my", "one", "all", "would", "there", "their", "what",
  "so", "up", "out", "if", "about", "who", "get", "which", "go", "me",
  "when", "make", "can", "like", "time", "no", "just", "him", "know",
  "take", "people", "into", "year", "your", "good", "some", "could",
  "them", "see", "other", "than", "then", "now", "look", "only", "come",
  "its", "over", "think", "also", "back", "after", "use", "two", "how",
  "our", "work", "first", "well", "way", "even", "new", "want", "because",
  "any", "these", "give", "day", "most", "us", "find", "tell", "ask",
  "need", "feel", "become", "leave", "put", "mean", "keep", "let", "begin",
  "seem", "help", "talk", "turn", "start", "show", "hear", "play", "run",
  "move", "live", "believe", "hold", "bring", "happen", "write", "provide",
  "sit", "stand", "lose", "pay", "meet", "include", "continue", "set",
  "learn", "change", "lead", "understand", "watch", "follow", "stop", "create",
  "speak", "read", "allow", "add", "spend", "grow", "open", "walk", "win",
  "offer", "remember", "love", "consider", "appear", "buy", "wait", "serve",
  "die", "send", "expect", "build", "stay", "fall", "cut", "reach", "kill",
  "remain", "suggest", "raise", "pass", "sell", "require", "report", "decide",
  "pull", "break", "mind", "develop", "join", "plan", "pick", "carry", "drive",
];

export const PUNCTUATION_WORDS = [
  "hello, world!", "wait... what?", "she said: \"go now.\"", "it's fine.",
  "don't stop; keep going.", "yes? no! maybe.", "(@user) #trending",
  "3.14... pi!", "cost: $49.99", "email: test@mail.com",
  "brackets [like] these", "curly {braces}", "angle <tags>",
  "semi;colon", "colon: value", "dash - hyphen", "underscore_snake",
  "path/to/file", "back\\slash", "quote 'single'", "mix: a,b;c.",
];

export const NUMBER_WORDS = [
  "123", "4567", "89012", "2024", "3.14159", "99.99", "0.001",
  "1000000", "42", "7", "13", "256", "1024", "404", "500",
  "phone: 555-1234", "zip: 90210", "id: #98765", "v2.0.1",
  "50%", "25% off", "1st place", "2nd attempt", "3rd time",
  "binary 1010", "hex 0xFF", "ratio 16:9", "score 10/10",
];

export const QUOTES = [
  "The only way to do great work is to love what you do.",
  "Innovation distinguishes between a leader and a follower.",
  "Stay hungry, stay foolish.",
  "Simplicity is the ultimate sophistication.",
  "Code is like humor. When you have to explain it, it is bad.",
  "First, solve the problem. Then, write the code.",
  "Programs must be written for people to read.",
  "Any fool can write code that a computer can understand.",
  "The best error message is the one that never shows up.",
  "Talk is cheap. Show me the code.",
];

export function generateWordsText(count = 50): string {
  const words: string[] = [];
  for (let i = 0; i < count; i++) {
    words.push(COMMON_WORDS[Math.floor(Math.random() * COMMON_WORDS.length)]!);
  }
  return words.join(" ");
}

export function getTextForMode(mode: string): string {
  switch (mode) {
    case "punctuation":
      return PUNCTUATION_WORDS.join(" ");
    case "numbers":
      return NUMBER_WORDS.join(" ");
    case "quote":
      return QUOTES[Math.floor(Math.random() * QUOTES.length)]!;
    case "words":
    default:
      return generateWordsText(60);
  }
}
