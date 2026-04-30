const fs = require("fs");
const path = require("path");
const TurndownService = require("turndown");

const turndown = new TurndownService({
  headingStyle: "atx",
  bulletListMarker: "-",
  codeBlockStyle: "fenced",
});

// Configure Turndown rules for better output
turndown.addRule("preserveLineBreaksInParagraphs", {
  filter: "p",
  replacement: function (content) {
    return "\n\n" + content + "\n\n";
  },
});

const DIR = path.join(__dirname, "..", "src", "content", "insights");
const files = fs.readdirSync(DIR).filter((f) => f.endsWith(".json"));

for (const file of files) {
  const filePath = path.join(DIR, file);
  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  if (data.bodyFr) {
    data.bodyFr = turndown.turndown(data.bodyFr);
  }
  if (data.bodyEn) {
    data.bodyEn = turndown.turndown(data.bodyEn);
  }

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  console.log(`Migrated ${file}`);
}

console.log(`\nDone: ${files.length} articles migrated to Markdown.`);
