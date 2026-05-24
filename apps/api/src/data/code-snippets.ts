export const CODE_SNIPPETS: Record<string, string[]> = {
  javascript: [
    `function greet(name) {\n  return \`Hello, \${name}!\`;\n}\n\nconsole.log(greet("TypeMind"));`,
    `const sum = (a, b) => a + b;\nconst nums = [1, 2, 3].map(n => n * 2);`,
  ],
  python: [
    `def fibonacci(n):\n    a, b = 0, 1\n    for _ in range(n):\n        yield a\n        a, b = b, a + b`,
    `class User:\n    def __init__(self, name):\n        self.name = name`,
  ],
  html: [`<!DOCTYPE html>\n<html>\n  <body>\n    <h1>TypeMind AI</h1>\n  </body>\n</html>`],
  css: [`.container {\n  display: flex;\n  gap: 1rem;\n  color: #f5f5f5;\n}`],
  sql: [`SELECT id, username, wpm\nFROM users\nWHERE wpm > 60\nORDER BY wpm DESC;`],
};
