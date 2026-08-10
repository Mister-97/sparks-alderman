type Block =
  | { type: "heading"; text: string }
  | { type: "list"; items: string[] }
  | { type: "paragraph"; text: string };

function parseBlocks(text: string): Block[] {
  const blocks: Block[] = [];
  const paragraphs = text.split(/\n\s*\n/);

  for (const para of paragraphs) {
    const lines = para.split("\n").map((l) => l.trim()).filter(Boolean);
    if (lines.length === 0) continue;

    if (lines[0].startsWith("## ")) {
      blocks.push({ type: "heading", text: lines[0].slice(3) });
      lines.shift();
      if (lines.length === 0) continue;
    }

    const isNumbered = lines.every((l) => /^\d+\.\s/.test(l));
    if (isNumbered) {
      blocks.push({
        type: "list",
        items: lines.map((l) => l.replace(/^\d+\.\s/, "")),
      });
    } else {
      blocks.push({ type: "paragraph", text: lines.join(" ") });
    }
  }

  return blocks;
}

export default function PolicyContent({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const blocks = parseBlocks(text);

  return (
    <div className={className}>
      {blocks.map((block, i) => {
        if (block.type === "heading") {
          return (
            <h2
              key={i}
              className="font-display font-bold text-navy text-xl pt-2 first:pt-0"
            >
              {block.text}
            </h2>
          );
        }
        if (block.type === "list") {
          return (
            <ol key={i} className="list-decimal pl-5 space-y-2">
              {block.items.map((item, j) => (
                <li key={j}>{item}</li>
              ))}
            </ol>
          );
        }
        return <p key={i}>{block.text}</p>;
      })}
    </div>
  );
}
