import { useState, useRef, useEffect } from "react";

/* ── ICON HELPER ── */
const Ic = ({ n, fill = false, sz = 18, col, style: s = {} }) => (
  <span className={`msym${fill ? " mfill" : ""}`} style={{ fontSize: sz, color: col, ...s }}>{n}</span>
);

/* ── BOLD PARSER ── */
const Txt = ({ t }) => {
  const parts = t.split(/(\*\*[^*]+\*\*)/g);
  return <>{parts.map((p, i) => p.startsWith("**") && p.endsWith("**")
    ? <strong key={i} style={{ color: "#191c1e" }}>{p.slice(2, -2)}</strong>
    : <span key={i}>{p}</span>)}</>;
};

/* ── DATA ── */
const INIT_MSGS = [
  {
    id: 1, role: "ai",
    text: "Hello! I noticed you're watching the segment on **Softmax Normalization**. Would you like me to explain why we use the exponential function instead of simple linear scaling?",
    time: "Just now", card: null,
  },
  {
    id: 2, role: "user",
    text: "Yes, that would be helpful. Also, how does this relate to the **Exploding Gradient** problem mentioned earlier?",
    time: "2m ago", card: null,
  },
  {
    id: 3, role: "ai",
    text: "Great question! Softmax helps with stabilization via the scaling factor **1/√d_k** — which directly addresses gradient explosion in the Attention Scoring phase.\n\nI've extracted the key formulas and diagrams from this lecture segment.",
    time: "Just now",
    card: { title: "Lecture → Notes", desc: "Key formulas and diagrams extracted from the current lecture segment into a structured note.", status: "Ready" },
  },
];

/* ═══════════════════════════════
   NOTE CARD (inside chat)
═══════════════════════════════ */
function NoteCard({ card }) {
  const [saved, setSaved] = useState(false);
  return (
    <div style={{
      background: "#fff",
      border: `1px solid ${saved ? "rgba(0,74,198,0.28)" : "rgba(195,198,215,0.3)"}`,
      borderRadius: 12, padding: 13,
      boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
      transition: "border-color 0.2s",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Ic n="auto_awesome" fill sz={15} col="var(--sec)" />
          <span style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em" }}>{card.title}</span>
        </div>
        <span style={{
          fontSize: 9, fontWeight: 900,
          background: "var(--ter-fix)", color: "var(--on-ter-fix)",
          padding: "2px 7px", borderRadius: 4,
        }}>{card.status}</span>
      </div>
      <p style={{ fontSize: 11, color: "var(--on)", lineHeight: 1.6, marginBottom: 10 }}>{card.desc}</p>
      <button
        onClick={() => setSaved(true)}
        style={{
          width: "100%", padding: "8px 0", borderRadius: 9, border: "none", cursor: "pointer",
          background: saved ? "linear-gradient(135deg,var(--pri),var(--pri2))" : "var(--surf3)",
          color: saved ? "#fff" : "var(--on)",
          fontSize: 11, fontWeight: 700,
          display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
          fontFamily: "var(--fb)", transition: "all 0.2s",
        }}
      >
        <Ic n={saved ? "check_circle" : "download"} sz={14} col={saved ? "#fff" : "var(--on)"} />
        {saved ? "Saved to Workspace!" : "Save to Workspace"}
      </button>
    </div>
  );
}

/* ═══════════════════════════════
   CHAT MESSAGE
═══════════════════════════════ */
function Msg({ msg }) {
  const ai = msg.role === "ai";
  return (
    <div className="anim-fade" style={{ display: "flex", gap: 10, flexDirection: ai ? "row" : "row-reverse" }}>
      <div style={{
        width: 30, height: 30, borderRadius: 9, flexShrink: 0,
        background: ai ? "var(--pri2)" : "var(--surf4)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <Ic n={ai ? "smart_toy" : "person"} fill={ai} sz={15} col={ai ? "#fff" : "var(--on2)"} />
      </div>
      <div style={{ maxWidth: "80%", display: "flex", flexDirection: "column", gap: 5, alignItems: ai ? "flex-start" : "flex-end" }}>
        <div style={{
          padding: "10px 14px",
          background: ai ? "var(--surf1)" : "var(--pri)",
          color: ai ? "var(--on)" : "#fff",
          borderRadius: ai ? "3px 14px 14px 14px" : "14px 3px 14px 14px",
          fontSize: 12, lineHeight: 1.68,
        }}>
          {msg.text.split("\n\n").map((p, i, arr) => (
            <p key={i} style={{ marginBottom: i < arr.length - 1 ? 8 : 0 }}>
              <Txt t={p} />
            </p>
          ))}
        </div>
        {msg.card && <NoteCard card={msg.card} />}
        <span style={{ fontSize: 9, fontWeight: 700, color: "var(--outline)", textTransform: "uppercase", letterSpacing: "0.07em" }}>
          {ai ? "AI Assistant" : "You"} · {msg.time}
        </span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════
   AUTOMATION TAB
═══════════════════════════════ */
function AutomationTab() {
  const items = [
    { icon: "auto_awesome", col: "var(--sec)", title: "Auto Note Generation", desc: "Extracts formulas and diagrams from lecture in real-time", badge: "Active", bg: "rgba(113,42,226,0.1)", tc: "var(--sec)" },
    { icon: "quiz", col: "var(--ter)", title: "Quiz Generator", desc: "Creates questions automatically after each module completes", badge: "Ready", bg: "rgba(0,98,66,0.1)", tc: "var(--ter)" },
    { icon: "summarize", col: "var(--pri)", title: "Lecture Summary", desc: "Auto-summarizes key concepts at the end of each video", badge: "Idle", bg: "var(--surf2)", tc: "var(--on2)" },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <p style={{ fontSize: 11, color: "var(--on2)", lineHeight: 1.55, marginBottom: 2 }}>
        DocFlow AI processes your lecture content in real-time, automatically creating assets as you learn.
      </p>
      {items.map((a, i) => (
        <div key={i} style={{ padding: 14, background: "#fff", border: "1px solid rgba(195,198,215,0.28)", borderRadius: 12, display: "flex", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 9, background: `${a.col}14`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Ic n={a.icon} fill sz={17} col={a.col} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
              <span style={{ fontSize: 12, fontWeight: 700 }}>{a.title}</span>
              <span style={{ fontSize: 9, fontWeight: 800, padding: "2px 7px", borderRadius: 4, background: a.bg, color: a.tc }}>{a.badge}</span>
            </div>
            <p style={{ fontSize: 11, color: "var(--on2)", lineHeight: 1.5 }}>{a.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════
   NOTES TAB
═══════════════════════════════ */
function NotesTab() {
  const notes = [
    { title: "Self-Attention Formula", body: "Q·Kᵀ / √d_k → Softmax → × V", tag: "Formula", mono: true },
    { title: "Why Softmax?", body: "Converts raw scores to probability distribution, preventing gradient explosion via the scaling factor.", tag: "Concept", mono: false },
    { title: "Multi-head Attention", body: "Runs attention multiple times in parallel with different learned linear projections.", tag: "Architecture", mono: false },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button style={{
          fontSize: 11, fontWeight: 700, padding: "6px 12px",
          background: "var(--pri)", color: "#fff", border: "none",
          borderRadius: 8, cursor: "pointer",
          display: "flex", alignItems: "center", gap: 4, fontFamily: "var(--fb)",
        }}>
          <Ic n="add" sz={14} col="#fff" /> New Note
        </button>
      </div>
      {notes.map((n, i) => (
        <div key={i}
          style={{ padding: 14, background: "#fff", border: "1px solid rgba(195,198,215,0.28)", borderRadius: 12, cursor: "pointer", transition: "border-color 0.18s" }}
          onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(0,74,198,0.28)"}
          onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(195,198,215,0.28)"}
        >
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
            <span style={{ fontSize: 12, fontWeight: 700 }}>{n.title}</span>
            <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 7px", background: "var(--surf2)", color: "var(--on2)", borderRadius: 4 }}>{n.tag}</span>
          </div>
          <p style={{ fontSize: 11, color: "var(--on2)", lineHeight: 1.55, fontFamily: n.mono ? "monospace" : "var(--fb)" }}>{n.body}</p>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════
   AI TUTOR CHAT — COMPONENT BOX
═══════════════════════════════ */
export default function AIChatBox() {
  const TABS = ["AI Tutor", "Automation", "Notes"];
  const [min, setMin] = useState(false);
  const [tab, setTab] = useState(0);

  const [msgs, setMsgs] = useState(INIT_MSGS);
  const [inp, setInp] = useState("");
  const [typing, setTyping] = useState(false);
  const chatRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [msgs, typing]);

  const send = () => {
    const t = inp.trim();
    if (!t) return;
    setMsgs(p => [...p, { id: Date.now(), role: "user", text: t, time: "Just now", card: null }]);
    setInp("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMsgs(p => [...p, {
        id: Date.now() + 1, role: "ai",
        text: "That's a great insight! The **scaling factor** prevents the dot products from growing large in magnitude, keeping the softmax in a region with **healthy gradients**.\n\nShall I generate a visual diagram for this concept?",
        time: "Just now", card: null,
      }]);
    }, 1400);
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      height: min ? "auto" : "100%",
      width: "100%",
      background: "#ffffff",
      borderRadius: 18,
      overflow: "hidden",
      boxShadow: "0 0 0 1px rgba(195,198,215,0.3), 0 8px 36px rgba(0,74,198,0.12), 0 2px 8px rgba(0,0,0,0.06)",
      transition: "height 0.3s cubic-bezier(0.16,1,0.3,1)",
      alignSelf: min ? "flex-end" : "stretch",
      marginTop: min ? "auto" : 0,
    }}>


      {/* ── Box Header ── */}
      <div style={{
        flexShrink: 0,
        padding: "14px 16px 0",
        background: "linear-gradient(135deg,rgba(0,74,198,0.04),rgba(113,42,226,0.04))",
        borderBottom: "1px solid rgba(195,198,215,0.18)",
      }}>
        {/* Title row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <div style={{
              width: 30, height: 30, borderRadius: 9,
              background: "linear-gradient(135deg,var(--pri2),var(--sec))",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 3px 10px rgba(0,74,198,0.28)",
            }}>
              <Ic n="smart_toy" fill sz={16} col="#fff" />
            </div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 800, fontFamily: "var(--fh)", lineHeight: 1.2 }}>DocFlow AI Tutor</p>
              <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 2 }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--ter-dim)", display: "inline-block" }} className="anim-pulse" />
                <span style={{ fontSize: 9, color: "var(--on2)", fontWeight: 600, letterSpacing: "0.03em" }}>Listening to lecture audio</span>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button style={{
              background: "rgba(113,42,226,0.07)", border: "none",
              borderRadius: 8, padding: "5px 10px",
              fontSize: 10, fontWeight: 700, cursor: "pointer",
              color: "var(--sec)", display: "flex", alignItems: "center", gap: 4,
              fontFamily: "var(--fb)",
            }}>
              <Ic n="auto_awesome" fill sz={12} col="var(--sec)" /> Ask AI
            </button>
            <button
              onClick={() => setMin(!min)}
              style={{
                background: "rgba(0,0,0,0.04)", border: "none",
                borderRadius: 8, width: 28, height: 28,
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", color: "var(--on2)",
                transition: "background 0.2s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(0,0,0,0.08)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(0,0,0,0.04)"}
            >
              <Ic n={min ? "keyboard_arrow_up" : "keyboard_arrow_down"} sz={18} />
            </button>
          </div>
        </div>

        {/* Tab bar */}
        {!min && (
          <div style={{ display: "flex", gap: 0 }}>
            {TABS.map((tb, i) => (
              <button key={tb} onClick={() => setTab(i)} style={{
                flex: 1, padding: "8px 4px",
                fontSize: 11, fontWeight: tab === i ? 700 : 500,
                color: tab === i ? "var(--pri)" : "var(--on2)",
                background: "none", border: "none",
                borderBottom: `2px solid ${tab === i ? "var(--pri)" : "transparent"}`,
                cursor: "pointer", transition: "all 0.18s",
                fontFamily: "var(--fb)",
              }}>{tb}</button>
            ))}
          </div>
        )}
      </div>

      {/* ── Box Body (scrollable) ── */}
      {!min && (
        <div
          ref={chatRef}
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "16px 14px",
            display: "flex",
            flexDirection: "column",
            gap: 16,
            minHeight: 0,
            scrollbarWidth: "thin",
          }}
        >
          {tab === 0 && (
            <>
              {msgs.map(m => <Msg key={m.id} msg={m} />)}
              {typing && (
                <div className="anim-fade" style={{ display: "flex", gap: 10 }}>
                  <div style={{ width: 30, height: 30, borderRadius: 9, background: "var(--pri2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Ic n="smart_toy" fill sz={15} col="#fff" />
                  </div>
                  <div style={{ padding: "12px 16px", background: "var(--surf1)", borderRadius: "3px 14px 14px 14px", display: "flex", gap: 5, alignItems: "center" }}>
                    {[0, 1, 2].map(i => (
                      <div key={i} style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--outv)", animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite` }} />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
          {tab === 1 && <AutomationTab />}
          {tab === 2 && <NotesTab />}
        </div>
      )}

      {/* ── Box Footer / Input ── */}
      {!min && tab === 0 && (
        <div style={{
          flexShrink: 0,
          padding: "10px 14px 14px",
          borderTop: "1px solid rgba(195,198,215,0.15)",
          background: "#fff",
        }}>

          <div style={{ display: "flex", justifyContent: "center", marginBottom: 9 }}>
            <div style={{
              background: "rgba(255,255,255,0.9)", backdropFilter: "blur(10px)",
              padding: "5px 13px", borderRadius: 99,
              border: "1px solid rgba(0,74,198,0.1)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              display: "flex", alignItems: "center", gap: 7,
            }}>
              <div className="anim-pulse" style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--ter-dim)" }} />
              <span style={{ fontSize: 9, fontWeight: 700, color: "var(--on2)" }}>AI is listening to lecture audio</span>
            </div>
          </div>

          <div style={{
            display: "flex", alignItems: "flex-end", gap: 8,
            background: "var(--surf1)", borderRadius: 13,
            padding: "8px 8px 8px 12px",
            border: "1px solid rgba(195,198,215,0.22)",
          }}>
            <textarea
              ref={inputRef}
              value={inp}
              onChange={e => setInp(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
              placeholder="Ask AI Tutor anything…"
              rows={1}
              style={{
                flex: 1, background: "transparent", border: "none", outline: "none",
                fontSize: 12, resize: "none", fontFamily: "var(--fb)",
                color: "var(--on)", lineHeight: 1.5, maxHeight: 100, overflowY: "auto",
                padding: "4px 0",
              }}
            />
            <button
              onClick={send}
              style={{
                width: 32, height: 32, borderRadius: 9,
                background: "var(--pri)", border: "none",
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 3px 10px rgba(0,74,198,0.3)", flexShrink: 0,
                transition: "transform 0.14s",
              }}
              onMouseEnter={e => e.currentTarget.style.transform = "scale(0.92)"}
              onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
            >
              <Ic n="arrow_upward" sz={16} col="#fff" />
            </button>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8, padding: "0 2px" }}>
            <div style={{ display: "flex", gap: 10 }}>
              {["mic", "attach_file"].map(ic => (
                <button key={ic} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--on2)", display: "flex", padding: 2, transition: "color 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.color = "var(--pri)"}
                  onMouseLeave={e => e.currentTarget.style.color = "var(--on2)"}
                >
                  <Ic n={ic} sz={17} />
                </button>
              ))}
            </div>
            <span style={{ fontSize: 9, color: "var(--outline)", fontWeight: 500 }}>Press Enter to send</span>
          </div>
        </div>
      )}
    </div>
  );
}
