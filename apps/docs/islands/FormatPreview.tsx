// biome-ignore lint/style/useFilenamingConvention: Blume derives each island's MDX component name from its PascalCase filename, so this file must stay PascalCase.
import { useCallback, useMemo, useState } from "react";

/**
 * Mirrors ZoomFormatConverter.toZoomContentBody() in src/markdown.ts: the same
 * block handling, the same inline stripping, and the same places where text is
 * dropped. If the converter changes, change this too — it is a demo of real
 * behaviour, not an idealised one.
 */

interface Segment {
  style?: { bold?: boolean };
  text: string;
  type: "message";
}

const SAMPLES: Record<string, string> = {
  bullets: "Checks finished:\n\n* api-gateway — passing\n* billing — passing",
  code: "Latest build:\n\n```\nbuild 4812 ok\n```",
  dropped: "~Rolled back~ and __confirmed__ in [the console](https://zoom.us)",
  message:
    "**Deploy finished**\n\nShipped `api-gateway` to _production_ in 94s.",
};

const CODE_SLOT = "\uE000"; // private-use sentinel, never present in real input
const CODE_SPAN = /`[^`]+`/g;
const CODE_SLOT_PATTERN = /\uE000/g;
const LINK = /\[([^\]]*)\]\([^)]*\)/g;
const UNDERLINE = /__([^\n_]+?)__/g;
const STRIKETHROUGH = /(?<!~)~(?!~)([^\n~]+?)~(?!~)/g;
const BOLD = /\*\*([^*]+)\*\*/g;
const ITALIC = /(?<!_)_([^_\n]+)_(?!_)/g;
const ALL_BOLD = /^\*\*[^*]+\*\*$/;
const HEADING = /^\s*#{1,6}\s+/;
const BULLET = /^\s*[*-]\s+/;
const FENCE = "```";
const DROPPABLE = [UNDERLINE, STRIKETHROUGH, LINK];

/** Inline handling: code survives, emphasis markers are stripped, and
 *  strikethrough, underline, and link text are dropped entirely. */
function inline(src: string): string {
  const codes: string[] = [];
  let text = src.replace(CODE_SPAN, (match) => {
    codes.push(match);
    return CODE_SLOT;
  });

  text = text.replace(LINK, ""); // links: dropped
  text = text.replace(UNDERLINE, ""); // underline: dropped
  text = text.replace(STRIKETHROUGH, ""); // strikethrough: dropped
  text = text.replace(BOLD, "$1"); // bold markers: stripped
  text = text.replace(ITALIC, "$1"); // italic markers: stripped

  const restored = codes[Symbol.iterator]();
  return text
    .replace(CODE_SLOT_PATTERN, () => restored.next().value ?? "")
    .trim();
}

function toSegments(src: string): Segment[] {
  const segments: Segment[] = [];
  let paragraph: string[] = [];
  let fence: string[] | null = null;

  const flushParagraph = () => {
    if (paragraph.length === 0) {
      return;
    }
    const joined = paragraph.join(" ");
    const text = inline(joined);
    paragraph = [];
    if (!text) {
      return;
    }
    segments.push(
      ALL_BOLD.test(joined.trim())
        ? { style: { bold: true }, text, type: "message" }
        : { text, type: "message" }
    );
  };

  const flushFence = () => {
    if (fence) {
      segments.push({
        text: `${FENCE}\n${fence.join("\n")}\n${FENCE}`,
        type: "message",
      });
      fence = null;
    }
  };

  for (const line of src.split("\n")) {
    if (line.trim().startsWith(FENCE)) {
      if (fence) {
        flushFence();
      } else {
        flushParagraph();
        fence = [];
      }
    } else if (fence) {
      fence.push(line);
    } else if (!line.trim()) {
      flushParagraph();
    } else if (HEADING.test(line)) {
      flushParagraph();
      const text = inline(line.replace(HEADING, ""));
      if (text) {
        segments.push({ style: { bold: true }, text, type: "message" });
      }
    } else if (BULLET.test(line)) {
      flushParagraph();
      segments.push({
        text: `• ${inline(line.replace(BULLET, ""))}`,
        type: "message",
      });
    } else {
      paragraph.push(line);
    }
  }

  flushParagraph();
  flushFence();
  return segments.length > 0 ? segments : [{ text: "", type: "message" }];
}

export default function FormatPreview() {
  const [sample, setSample] = useState<keyof typeof SAMPLES>("message");
  const text = SAMPLES[sample];
  const segments = useMemo(() => toSegments(text), [text]);

  const pick = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setSample(event.currentTarget.dataset.sample as keyof typeof SAMPLES);
  }, []);

  // Anything the converter silently discards, spotted in the input itself.
  const hasDropped = DROPPABLE.some((pattern) => {
    pattern.lastIndex = 0;
    return pattern.test(text);
  });

  return (
    <div className="demo">
      <p className="demo-label">What Zoom receives</p>
      <div className="demo-choices">
        {Object.keys(SAMPLES).map((key) => (
          <button
            aria-pressed={key === sample}
            className="demo-choice"
            data-sample={key}
            key={key}
            onClick={pick}
            type="button"
          >
            {key}
          </button>
        ))}
      </div>

      <div className="demo-out">
        <p className="demo-out-label">Zoom shows</p>
        <div style={{ fontSize: 15, lineHeight: 1.6 }}>
          {segments.map((segment, index) => (
            <p
              key={index}
              style={{
                color: "var(--graphite)",
                fontWeight: segment.style?.bold ? 600 : 400,
                margin: "0 0 4px",
                whiteSpace: "pre-wrap",
              }}
            >
              {segment.text || "\u00A0"}
            </p>
          ))}
        </div>
      </div>

      {hasDropped && (
        <p className="demo-note">
          Strikethrough, underline, and link text are gone: Zoom's segments
          cannot carry them, so the converter drops those words rather than
          sending markup. See the table below.
        </p>
      )}
    </div>
  );
}
