// biome-ignore lint/style/useFilenamingConvention: Blume derives each island's MDX component name from its PascalCase filename, so this file must stay PascalCase.
import { useCallback, useState } from "react";

/** The three things that can arrive at the endpoint, and what goes back.
 *  Mirrors handleWebhook() in src/index.ts. */

const STAGES = [
  {
    name: "Setup challenge",
    note: "Zoom sends this when you save the endpoint URL. It carries no signature, so it is answered before any signature check — otherwise the Marketplace could never verify the endpoint.",
    received: `POST /api/webhooks/zoom

{
  "event": "endpoint.url_validation",
  "payload": { "plainToken": "qgg8vlvZRS6UYooatFL8Aw" }
}`,
    returned: `200 OK

{
  "plainToken": "qgg8vlvZRS6UYooatFL8Aw",
  "encryptedToken": "23a89b634c017..."
}`,
  },
  {
    name: "A message",
    note: "The signature is HMAC-SHA256 over v0:{timestamp}:{raw body}, compared in constant time. Anything older than five minutes is refused. Then the event becomes a Chat thread and your handlers run.",
    received: `POST /api/webhooks/zoom
x-zm-request-timestamp: 1750000000
x-zm-signature: v0=3c4a…

{
  "event": "bot_notification",
  "event_ts": 1750000000000,
  "payload": { "cmd": "status api-gateway", "toJid": "…", "userJid": "…" }
}`,
    returned: "200 ok",
  },
  {
    name: "Something wrong",
    note: "A missing, stale, or mismatched signature stops here. A body that is not JSON returns 400 Invalid JSON. An event the adapter does not handle still returns 200 ok, so Zoom does not retry it.",
    received: `POST /api/webhooks/zoom
x-zm-signature: v0=0000…`,
    returned: "401 Invalid signature",
  },
];

export default function WebhookInspector() {
  const [active, setActive] = useState(0);
  const pick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) =>
      setActive(Number(event.currentTarget.dataset.index)),
    []
  );
  const stage = STAGES[active];

  return (
    <div className="demo">
      <p className="demo-label">At the endpoint</p>
      <div className="demo-choices">
        {STAGES.map((item, index) => (
          <button
            aria-pressed={index === active}
            className="demo-choice"
            data-index={index}
            key={item.name}
            onClick={pick}
            type="button"
          >
            {item.name}
          </button>
        ))}
      </div>

      <div className="demo-out">
        <p className="demo-out-label">Zoom sends</p>
        <pre className="demo-json">{stage.received}</pre>
      </div>
      <div className="demo-out">
        <p className="demo-out-label">The adapter answers</p>
        <pre className="demo-json">{stage.returned}</pre>
      </div>
      <p className="demo-note">{stage.note}</p>
    </div>
  );
}
