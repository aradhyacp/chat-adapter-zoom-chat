// biome-ignore lint/style/useFilenamingConvention: Blume derives each island's MDX component name from its PascalCase filename, so this file must stay PascalCase.
import { useCallback, useMemo, useState } from "react";

/** Mirrors decodeThreadId(), isDM(), and channelIdFromThreadId() in src/index.ts. */

type Decoded =
  | { channelId: string; kind: "channel" | "DM"; messageId: string; ok: true }
  | { message: string; ok: false };

function decode(threadId: string): Decoded {
  if (!threadId.startsWith("zoom:")) {
    return {
      message: `ValidationError: Invalid Zoom thread ID: ${threadId}`,
      ok: false,
    };
  }
  const rest = threadId.slice("zoom:".length);
  const separator = rest.indexOf(":");
  if (separator === -1) {
    return {
      channelId: rest,
      kind: rest.endsWith("@conference.xmpp.zoom.us") ? "channel" : "DM",
      messageId: "",
      ok: true,
    };
  }
  const channelId = rest.slice(0, separator);
  if (!channelId) {
    return {
      message: `ValidationError: Invalid Zoom thread ID format (empty channelId): ${threadId}`,
      ok: false,
    };
  }
  return {
    channelId,
    kind: channelId.endsWith("@conference.xmpp.zoom.us") ? "channel" : "DM",
    messageId: rest.slice(separator + 1),
    ok: true,
  };
}

const SAMPLES: Record<string, string> = {
  "@-mention": "zoom:abc123@conference.xmpp.zoom.us:20230814T120000Z-ab12cd34",
  "channel-level": "zoom:abc123@conference.xmpp.zoom.us",
  "direct message": "zoom:user123@xmpp.zoom.us:1750000000000",
  rejected: "zoom::1750000000000",
};

export default function ThreadIdPlayground() {
  const [value, setValue] = useState(SAMPLES["@-mention"]);
  const result = useMemo(() => decode(value.trim()), [value]);

  const pick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) =>
      setValue(SAMPLES[event.currentTarget.dataset.sample as string]),
    []
  );

  const edit = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) =>
      setValue(event.target.value),
    []
  );

  return (
    <div className="demo">
      <p className="demo-label">Decode a thread ID</p>
      <div className="demo-choices">
        {Object.keys(SAMPLES).map((key) => (
          <button
            aria-pressed={value === SAMPLES[key]}
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
      <input
        className="demo-input"
        onChange={edit}
        spellCheck={false}
        value={value}
      />
      <div className="demo-out">
        {result.ok ? (
          <>
            <p className="demo-out-label">
              {result.kind === "channel"
                ? "Channel — the JID ends in @conference.xmpp.zoom.us"
                : "Direct message — any other JID"}
            </p>
            <pre className="demo-json">
              {JSON.stringify(
                { channelId: result.channelId, messageId: result.messageId },
                null,
                2
              )}
            </pre>
            {result.messageId === "" && (
              <p className="demo-note">
                No message ID: a channel-level thread, which is what you post a
                brand new message to.
              </p>
            )}
          </>
        ) : (
          <>
            <p className="demo-out-label">decodeThreadId throws</p>
            <pre className="demo-json">{result.message}</pre>
          </>
        )}
      </div>
    </div>
  );
}
