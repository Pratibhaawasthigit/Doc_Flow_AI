import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleGenerativeAI } from "@google/generative-ai";

/* ── AI SDK Initialization ───────────────── */
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
if (!API_KEY) {
    console.warn("VITE_GEMINI_API_KEY is missing. AI features will be limited.");
}
const genAI = new GoogleGenerativeAI(API_KEY || "fallback_key");
// Using gemini-3-flash-preview as the primary model based on user settings
const aiModel = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });
const fallbackModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

/* ─────────────────────────────────────────────
   EMBEDDED STYLES
───────────────────────────────────────────── */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=Syne:wght@600;700;800&family=Space+Mono:wght@400;700&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }

  body {
    font-family: 'Sora', sans-serif;
    background: #f7f9fb;
    color: #191c1e;
    overflow-x: hidden;
  }

  a { text-decoration: none; color: inherit; }
  button { font-family: inherit; cursor: pointer; }
  input { font-family: inherit; }
  img { max-width: 100%; display: block; }

  ::-webkit-scrollbar { width: 5px; height: 5px; }
  ::-webkit-scrollbar-track { background: #f2f4f6; }
  ::-webkit-scrollbar-thumb { background: #004ac6; border-radius: 3px; }

  .ms {
    font-family: 'Material Symbols Outlined';
    font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
    user-select: none;
    line-height: 1;
    display: inline-block;
    vertical-align: middle;
  }
  .ms-fill { font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24; }

  /* Animations */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: none; }
  }
  @keyframes slideIn {
    from { opacity: 0; transform: translateX(-14px); }
    to   { opacity: 1; transform: none; }
  }
  @keyframes pulse {
    0%,100% { box-shadow: 0 0 0 0 rgba(78,222,163,.5); }
    50%      { box-shadow: 0 0 0 6px rgba(78,222,163,0); }
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes scalePop {
    0%   { transform: scale(0.85); opacity: 0; }
    70%  { transform: scale(1.04); }
    100% { transform: scale(1);   opacity: 1; }
  }
  @keyframes shimmer {
    0%   { background-position: -600px 0; }
    100% { background-position:  600px 0; }
  }
  @keyframes toastIn {
    from { opacity: 0; transform: translateX(100%); }
    to   { opacity: 1; transform: none; }
  }
  @keyframes toastOut {
    to { opacity: 0; transform: translateX(110%); }
  }
  @keyframes dotPulse {
    0%,100% { opacity:1; transform:scale(1); }
    50%     { opacity:.45; transform:scale(.8); }
  }

  .fade-up-1 { animation: fadeUp .5s ease both; }
  .fade-up-2 { animation: fadeUp .5s .08s ease both; }
  .fade-up-3 { animation: fadeUp .5s .16s ease both; }
  .fade-up-4 { animation: fadeUp .5s .24s ease both; }
  .fade-up-5 { animation: fadeUp .5s .32s ease both; }

  /* Skeleton shimmer */
  .skeleton {
    background: linear-gradient(90deg, #e8eaed 25%, #f2f4f6 50%, #e8eaed 75%);
    background-size: 600px 100%;
    animation: shimmer 1.4s infinite linear;
    border-radius: 6px;
  }

  /* Glass */
  .glass {
    background: rgba(255,255,255,.78);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
  }


  /* Note card hover scale */
  .note-folder:hover { transform: scale(1.025); box-shadow: 0 12px 36px rgba(0,74,198,.12); }
  .note-row:hover { background: #f2f4f6; }

  /* Tooltip */
  .has-tooltip { position: relative; }
  .has-tooltip:hover .tooltip {
    opacity: 1;
    pointer-events: auto;
    transform: translateY(0);
  }
  .tooltip {
    position: absolute;
    bottom: calc(100% + 6px);
    left: 50%;
    transform: translateX(-50%) translateY(4px);
    background: #191c1e;
    color: #fff;
    font-size: .72rem;
    font-weight: 600;
    padding: 4px 10px;
    border-radius: 6px;
    white-space: nowrap;
    opacity: 0;
    pointer-events: none;
    transition: all .18s;
    z-index: 9999;
  }
`;

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
// Data is now fetched from the backend API during component mount.

/* ─────────────────────────────────────────────
   ICON COMPONENT
───────────────────────────────────────────── */
const Icon = ({ name, size = 22, fill = false, style = {}, className = "" }) => (
    <span
        className={`ms ${fill ? "ms-fill" : ""} ${className}`}
        style={{ fontSize: size, ...style }}
    >
        {name}
    </span>
);

/* ─────────────────────────────────────────────
   TOAST SYSTEM
───────────────────────────────────────────── */
const Toast = ({ toasts, remove }) => (
    <div style={{
        position: "fixed", bottom: 88, right: 20, zIndex: 9999,
        display: "flex", flexDirection: "column", gap: 8,
        pointerEvents: "none",
    }}>
        {toasts.map(t => (
            <div
                key={t.id}
                style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "12px 18px",
                    background: "#fff", border: "1px solid #e2e8f0",
                    borderRadius: 12, boxShadow: "0 8px 28px rgba(0,0,0,.13)",
                    fontSize: ".84rem", fontWeight: 600, color: "#191c1e",
                    pointerEvents: "auto", minWidth: 220, maxWidth: 310,
                    animation: t.out ? "toastOut .3s ease forwards" : "toastIn .3s ease both",
                }}
            >
                <Icon
                    name={t.type === "success" ? "check_circle" : t.type === "error" ? "error" : "info"}
                    size={20}
                    style={{ color: t.type === "success" ? "#059669" : t.type === "error" ? "#dc2626" : "#2563eb" }}
                />
                {t.msg}
                <button
                    onClick={() => remove(t.id)}
                    style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: "#94a3b8", lineHeight: 1 }}
                >
                    <Icon name="close" size={16} />
                </button>
            </div>
        ))}
    </div>
);

function useToasts() {
    const [toasts, setToasts] = useState([]);
    const add = (msg, type = "info") => {
        const id = Date.now();
        setToasts(p => [...p, { id, msg, type, out: false }]);
        setTimeout(() => {
            setToasts(p => p.map(t => t.id === id ? { ...t, out: true } : t));
            setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 320);
        }, 3200);
    };
    const remove = id => setToasts(p => p.filter(t => t.id !== id));
    return { toasts, add, remove };
}

/* ─────────────────────────────────────────────
   FOLDER CARD
───────────────────────────────────────────── */
const FolderCard = ({ folder, onClick, onNoteClick, notes = [], delay = 0 }) => (
    <div
        className="note-folder"
        onClick={() => onClick(folder)}
        style={{
            background: "#fff",
            borderRadius: 16, padding: "22px 20px",
            boxShadow: "0 2px 16px rgba(0,74,198,.06)",
            cursor: "pointer", position: "relative", overflow: "hidden",
            transition: "transform .25s, box-shadow .25s",
            animation: `fadeUp .5s ${delay}s ease both`,
            display: "flex",
            flexDirection: "column",
            minHeight: "260px"
        }}
    >
        {/* Accent blob */}
        <div style={{
            position: "absolute", right: -16, top: -16,
            width: 80, height: 80, borderRadius: "50%",
            background: folder.bg, filter: "blur(20px)", opacity: .6,
            pointerEvents: "none",
        }} />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
            <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: folder.iconBg,
                display: "flex", alignItems: "center", justifyContent: "center",
            }}>
                <Icon name={folder.icon} size={22} style={{ color: folder.iconColor }} />
            </div>
            <span style={{
                fontSize: ".72rem", fontWeight: 700,
                padding: "3px 10px", borderRadius: 100,
                background: folder.badgeBg, color: folder.badgeColor,
            }}>
                {notes.length || folder.count || 0} Notes
            </span>
        </div>

        <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: "1.05rem", fontWeight: 700, marginBottom: 8, color: "#191c1e" }}>
            {folder.label}
        </h3>
        
        <p style={{ fontSize: ".76rem", color: "#737686", lineHeight: 1.5, marginBottom: 16, display: "-webkit-box", WebkitLineClamp: "2", WebkitBoxOrient: "vertical", overflow: "hidden" }}>
            {folder.description || "No description available for this module."}
        </p>

        {/* Note Previews */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6, margin: "4px 0 16px" }}>
            {notes.slice(0, 3).map(note => (
                <div 
                    key={note.id} 
                    onClick={(e) => { e.stopPropagation(); onNoteClick(note); }}
                    style={{ display: "flex", alignItems: "center", gap: 8, fontSize: ".72rem", color: "#434655", cursor: "pointer", transition: "color .2s" }}
                    onMouseEnter={e => e.currentTarget.style.color = "#004ac6"}
                    onMouseLeave={e => e.currentTarget.style.color = "#434655"}
                >
                    <Icon name={note.icon || "description"} size={14} style={{ color: "#94a3b8" }} />
                    <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontWeight: 500 }}>{note.label}</span>
                </div>
            ))}
            {notes.length > 3 && (
                <div style={{ fontSize: ".68rem", color: "#94a3b8", fontWeight: 600, paddingLeft: 22 }}>
                    + {notes.length - 3} more
                </div>
            )}
            {notes.length === 0 && (
                <div style={{ fontSize: ".7rem", color: "#cbd5e1", fontStyle: "italic", marginTop: 8 }}>
                    Empty Module
                </div>
            )}
        </div>
        
        {folder.externalLink && (
            <a 
                href={folder.externalLink} 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    fontSize: ".72rem", fontWeight: 700, color: "#004ac6",
                    background: "rgba(0,74,198,.08)", padding: "5px 10px",
                    borderRadius: 8, transition: "all .2s", textDecoration: "none",
                    alignSelf: "flex-start"
                }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(0,74,198,.15)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(0,74,198,.08)"}
            >
                <Icon name="add_link" size={14} />
                {folder.externalLabel || "Link"}
            </a>
        )}
    </div>
);

/* ─────────────────────────────────────────────
   MORE ACTIONS DROPDOWN
   "User Handlize" Responsive Interface
───────────────────────────────────────────── */
const MoreActionsMenu = ({ note, onRename, onDelete, onClose }) => {
    const menuRef = useRef(null);

    useEffect(() => {
        const h = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) onClose(); };
        document.addEventListener("mousedown", h);
        return () => document.removeEventListener("mousedown", h);
    }, [onClose]);

    return (
        <div
            ref={menuRef}
            onClick={e => e.stopPropagation()}
            style={{
                position: "absolute", top: 40, right: 0, zIndex: 500,
                width: 160, background: "#fff", borderRadius: 12,
                boxShadow: "0 10px 30px rgba(0,0,0,.12), 0 0 0 1px rgba(0,0,0,.04)",
                padding: "6px", animation: "scalePop .2s ease both",
            }}
        >
            {[
                { label: "Rename", icon: "edit", action: onRename, color: "#434655" },
                { label: "Pin Note", icon: "push_pin", action: () => { }, color: "#434655" },
                { label: "Share", icon: "share", action: () => { }, color: "#434655" },
                { label: "Delete", icon: "delete", action: onDelete, color: "#dc2626" },
            ].map((btn, i) => (
                <button
                    key={btn.label}
                    onClick={() => { btn.action(note); onClose(); }}
                    style={{
                        width: "100%", padding: "8px 10px", borderRadius: 8,
                        border: "none", background: "transparent",
                        display: "flex", alignItems: "center", gap: 10,
                        fontSize: ".8rem", fontWeight: 600, color: btn.color,
                        textAlign: "left", cursor: "pointer", transition: "all .18s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "#f1f5f9"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                    <Icon name={btn.icon} size={18} style={{ color: "inherit" }} />
                    {btn.label}
                </button>
            ))}
        </div>
    );
};

/* ─────────────────────────────────────────────
   RECENT NOTE ROW
───────────────────────────────────────────── */
const NoteRow = ({ note, isSelected, onClick, onRename, onDelete, delay = 0 }) => {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div
            className="note-row"
            onClick={() => onClick(note)}
            style={{
                padding: "14px 16px",
                borderRadius: 12,
                border: `1px solid ${isSelected ? "rgba(0,74,198,.25)" : "rgba(195,198,215,.2)"}`,
                display: "flex", alignItems: "center", justifyContent: "space-between",
                cursor: "pointer", transition: "all .18s",
                background: isSelected ? "#eff6ff" : "#fff",
                animation: `fadeUp .5s ${delay}s ease both`,
                position: "relative",
            }}
        >
            <div style={{ display: "flex", alignItems: "center", gap: 14, flex: 1, minWidth: 0 }}>
                <div style={{
                    width: 44, height: 44, borderRadius: 10, flexShrink: 0,
                    background: "#eceef0",
                    display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                    <Icon name={note.icon} size={22} style={{ color: "#737686" }} />
                </div>
                <div style={{ minWidth: 0 }}>
                    <h4 style={{ fontWeight: 700, fontSize: ".9rem", color: "#191c1e", marginBottom: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {note.label}
                    </h4>
                    <p style={{ fontSize: ".74rem", color: "#737686" }}>{note.meta}</p>
                </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 14, flexShrink: 0 }}>
                <span style={{
                    fontSize: ".72rem", fontWeight: 700,
                    padding: "3px 10px", borderRadius: 100,
                    background: note.tagBg, color: note.tagColor,
                    display: "flex", alignItems: "center", gap: 4,
                    whiteSpace: "nowrap",
                }}>
                    {note.tag === "AI Summarized" && <Icon name="auto_awesome" size={13} />}
                    {note.tag}
                </span>
                <div style={{ position: "relative" }}>
                    <button
                        style={{ background: menuOpen ? "#eceef0" : "none", border: "none", cursor: "pointer", color: "#737686", padding: 4, borderRadius: 6, transition: "all .18s" }}
                        onClick={e => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
                        onMouseEnter={e => { if (!menuOpen) e.currentTarget.style.background = "#eceef0"; }}
                        onMouseLeave={e => { if (!menuOpen) e.currentTarget.style.background = "none"; }}
                    >
                        <Icon name="more_vert" size={20} />
                    </button>
                    {menuOpen && (
                        <MoreActionsMenu
                            note={note}
                            onClose={() => setMenuOpen(false)}
                            onRename={onRename}
                            onDelete={onDelete}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

/* ─────────────────────────────────────────────
   AI SIDEBAR PANEL - Fully functional
───────────────────────────────────────────── */
const AISidebarPanel = ({ selectedNote }) => {
    const [loading, setLoading] = useState(false);
    const [flashcardLoading, setFlashcardLoading] = useState(false);
    const [aiResult, setAiResult] = useState(null);      // { type: 'insight'|'flashcards', content }
    const [error, setError] = useState(null);

    // Reset when note changes
    useEffect(() => {
        setAiResult(null);
        setError(null);
    }, [selectedNote?.id]);

    const runAI = async (type) => {
        if (!selectedNote?.content) {
            setError("This note has no content to analyze. Please create a note with text content first.");
            return;
        }
        setError(null);
        setAiResult(null);
        type === "insight" ? setLoading(true) : setFlashcardLoading(true);

        const prompts = {
            insight: `You are an expert educational assistant. Analyze the following content deeply:\n\n"${selectedNote.content}"\n\nProvide a structured "Full AI Insight" with these clear sections:\n1. MAIN CONCEPT (2-3 sentences)\n2. KEY TERMINOLOGY (3-5 bullet points of key terms)\n3. PRACTICAL APPLICATION (1-2 sentences on real-world use)\n4. STUDY TIP (one actionable tip for the student)\n\nFormat clearly with section headers using "**" for bold.`,
            flashcards: `You are an educational flashcard generator. Based on this content:\n\n"${selectedNote.content}"\n\nGenerate exactly 5 study flashcards. Format each one as:\nQ: [Clear question]\nA: [Concise answer]\n\nNumber each card 1-5. Make them progressively more challenging.`,
        };

        try {
            const result = await aiModel.generateContent(prompts[type]);
            const text = result.response.text();
            setAiResult({ type, content: text });
        } catch (err) {
            console.error("AI Error:", err);
            setError(`AI Error: ${err.message || "Could not connect. Check API key."}`);
        } finally {
            setLoading(false);
            setFlashcardLoading(false);
        }
    };

    // Parse flashcards from AI text
    const parseFlashcards = (text) => {
        const cards = [];
        const lines = text.split("\n");
        let current = null;
        for (const line of lines) {
            if (line.match(/^Q:/i) || line.match(/^\d+\.\s*Q:/i)) {
                if (current) cards.push(current);
                current = { q: line.replace(/^\d+\.\s*Q:/i, "").replace(/^Q:/i, "").trim(), a: "" };
            } else if (line.match(/^A:/i) && current) {
                current.a = line.replace(/^A:/i, "").trim();
            } else if (current && line.trim() && !current.a) {
                current.a += line.trim() + " ";
            }
        }
        if (current) cards.push(current);
        return cards;
    };

    return (
        <aside style={{
            width: 340, flexShrink: 0,
            background: "#fff", borderRadius: 20,
            padding: "22px 20px",
            boxShadow: "0 8px 32px rgba(0,74,198,.08)",
            display: "flex", flexDirection: "column", gap: 16,
            alignSelf: "flex-start",
            position: "sticky", top: 80,
            animation: "scalePop .4s ease both",
            maxHeight: "calc(100vh - 100px)",
            overflowY: "auto",
        }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                    width: 32, height: 32, borderRadius: 8,
                    background: "linear-gradient(135deg,#712ae2,#8a4cfc)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                    <Icon name="auto_awesome" size={18} style={{ color: "#fff" }} />
                </div>
                <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: ".95rem", color: "#191c1e" }}>
                    AI Workspace Intelligence
                </div>
            </div>

            {/* Summary content OR AI Result */}
            {!aiResult ? (
                selectedNote ? (
                    <div style={{ animation: "fadeUp .4s ease both" }}>
                        <div style={{ fontSize: ".64rem", fontWeight: 800, color: "#712ae2", textTransform: "uppercase", letterSpacing: ".18em", marginBottom: 6 }}>Live Summary</div>
                        <h4 style={{ fontFamily: "'Syne',sans-serif", fontSize: "1.05rem", fontWeight: 700, lineHeight: 1.25, marginBottom: 14, color: "#191c1e" }}>
                            {selectedNote.label}
                        </h4>
                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                            {(selectedNote.summary || []).map((point, i) => (
                                <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", animation: `fadeUp .4s ${i * .09}s ease both` }}>
                                    <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#712ae2", flexShrink: 0, marginTop: 6 }} />
                                    <p style={{ fontSize: ".82rem", color: "#434655", lineHeight: 1.6 }}>{point}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div style={{ textAlign: "center", padding: "24px 0" }}>
                        <Icon name="description" size={40} style={{ color: "#c3c6d7", display: "block", margin: "0 auto 10px" }} />
                        <p style={{ fontSize: ".82rem", color: "#737686" }}>Select a note to activate AI features</p>
                    </div>
                )
            ) : (
                <div style={{ animation: "fadeUp .35s ease both" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                        <span style={{ fontSize: ".7rem", fontWeight: 800, color: "#712ae2", textTransform: "uppercase", letterSpacing: ".14em" }}>
                            {aiResult.type === "insight" ? "AI Insight" : "Flashcards"}
                        </span>
                        <button
                            onClick={() => setAiResult(null)}
                            style={{ background: "#f1f5f9", border: "none", borderRadius: 6, padding: "3px 8px", fontSize: ".7rem", cursor: "pointer", color: "#737686", fontWeight: 600 }}
                        >← Back</button>
                    </div>

                    {aiResult.type === "insight" ? (
                        <div style={{ fontSize: ".8rem", color: "#434655", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>
                            {aiResult.content.split("\n").map((line, i) => (
                                <p key={i} style={{
                                    fontWeight: line.startsWith("**") ? 700 : 400,
                                    color: line.startsWith("**") ? "#191c1e" : "#434655",
                                    marginBottom: 6,
                                }}>
                                    {line.replace(/\*\*/g, "")}
                                </p>
                            ))}
                        </div>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                            {parseFlashcards(aiResult.content).map((card, i) => (
                                <FlashCard key={i} index={i + 1} question={card.q} answer={card.a} />
                            ))}
                            {parseFlashcards(aiResult.content).length === 0 && (
                                <div style={{ fontSize: ".8rem", color: "#434655", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{aiResult.content}</div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Error */}
            {error && (
                <div style={{ background: "#fff0f0", border: "1px solid #fecaca", borderRadius: 10, padding: "10px 14px", fontSize: ".78rem", color: "#dc2626", animation: "fadeUp .3s ease" }}>
                    {error}
                </div>
            )}

            {/* Action Buttons */}
            <div style={{ borderTop: "1px solid rgba(195,198,215,.2)", paddingTop: 14, display: "flex", flexDirection: "column", gap: 8 }}>
                <button
                    onClick={() => runAI("insight")}
                    disabled={!selectedNote || loading}
                    style={{
                        width: "100%", padding: "11px",
                        background: loading ? "#f1f5f9" : "rgba(113,42,226,.08)",
                        color: loading ? "#737686" : "#712ae2",
                        border: "1px solid rgba(113,42,226,.2)",
                        borderRadius: 12, fontWeight: 700, fontSize: ".85rem",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                        transition: "all .2s", cursor: (selectedNote && !loading) ? "pointer" : "not-allowed",
                        opacity: selectedNote ? 1 : .5,
                    }}
                    onMouseEnter={e => { if (selectedNote && !loading) e.currentTarget.style.background = "rgba(113,42,226,.14)"; }}
                    onMouseLeave={e => { if (selectedNote && !loading) e.currentTarget.style.background = "rgba(113,42,226,.08)"; }}
                >
                    {loading
                        ? <><div style={{ width: 16, height: 16, border: "2px solid rgba(113,42,226,.25)", borderTopColor: "#712ae2", borderRadius: "50%", animation: "spin .65s linear infinite" }} /> Analyzing…</>
                        : <><Icon name="edit_note" size={18} /> Full AI Insight</>
                    }
                </button>
                <button
                    onClick={() => runAI("flashcards")}
                    disabled={!selectedNote || flashcardLoading}
                    style={{
                        width: "100%", padding: "10px",
                        background: flashcardLoading ? "#f1f5f9" : "#f8fafc",
                        color: flashcardLoading ? "#737686" : "#434655",
                        border: "1px solid rgba(195,198,215,.3)",
                        borderRadius: 12, fontWeight: 600, fontSize: ".82rem",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                        transition: "all .2s", cursor: (selectedNote && !flashcardLoading) ? "pointer" : "not-allowed",
                        opacity: selectedNote ? 1 : .5,
                    }}
                    onMouseEnter={e => { if (selectedNote && !flashcardLoading) { e.currentTarget.style.borderColor = "#004ac6"; e.currentTarget.style.color = "#004ac6"; } }}
                    onMouseLeave={e => { if (selectedNote && !flashcardLoading) { e.currentTarget.style.borderColor = "rgba(195,198,215,.3)"; e.currentTarget.style.color = "#434655"; } }}
                >
                    {flashcardLoading
                        ? <><div style={{ width: 14, height: 14, border: "2px solid #c3c6d7", borderTopColor: "#004ac6", borderRadius: "50%", animation: "spin .65s linear infinite" }} /> Generating…</>
                        : <><Icon name="style" size={17} /> Generate Flashcards</>
                    }
                </button>
                <p style={{ fontSize: ".68rem", textAlign: "center", color: "#b0b5c4", marginTop: 2 }}>
                    Powered by Gemini AI • Insights shown in-panel
                </p>
            </div>
        </aside>
    );
};

/* Flip Card component for flashcards */
const FlashCard = ({ index, question, answer }) => {
    const [flipped, setFlipped] = useState(false);
    return (
        <div
            onClick={() => setFlipped(!flipped)}
            style={{
                background: flipped ? "linear-gradient(135deg,#712ae2,#8a4cfc)" : "#f8fafc",
                border: "1px solid", borderColor: flipped ? "transparent" : "rgba(195,198,215,.3)",
                borderRadius: 12, padding: "12px 14px", cursor: "pointer",
                transition: "all .3s ease", minHeight: 80,
            }}
        >
            <div style={{ fontSize: ".62rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: ".1em", color: flipped ? "rgba(255,255,255,.6)" : "#712ae2", marginBottom: 4 }}>
                Card {index} • {flipped ? "ANSWER" : "QUESTION — tap to flip"}
            </div>
            <p style={{ fontSize: ".8rem", color: flipped ? "#fff" : "#191c1e", lineHeight: 1.55, fontWeight: flipped ? 500 : 600 }}>
                {flipped ? answer : question}
            </p>
        </div>
    );
};


/* ─────────────────────────────────────────────
   AI DOCK (bottom bar)
───────────────────────────────────────────── */
const AIDock = ({ onGenerate, selectedNote, allNotes = [] }) => {
    const [val, setVal] = useState("");
    const [loading, setLoading] = useState(false);
    const [chatHistory, setChatHistory] = useState([]);
    const [chatOpen, setChatOpen] = useState(false);
    const inputRef = useRef(null);
    const chatRef = useRef(null);

    const [minimized, setMinimized] = useState(false);

    const handleGenerate = async () => {
        if (!val.trim()) return;
        const query = val.trim();
        setVal("");
        setLoading(true);
        setChatOpen(true);
        setMinimized(false); // Auto-expand when sending
        setChatHistory(prev => [...prev, { role: "user", text: query }]);

        try {
            const libraryContext = allNotes.length > 0 
                ? `Library Map (All Available Notes): ${allNotes.map(n => `"${n.label}" (Module: ${n.meta?.split(':')?.[1] || 'General'})`).join(", ")}\n`
                : "The library is currently empty.\n";

            const currentNoteContext = selectedNote?.content
                ? `Context (Currently Open Note: "${selectedNote.label}"): ${selectedNote.content}\n\n`
                : "";
            
            const prompt = `${libraryContext}\n${currentNoteContext}Student question: ${query}\n\nAs an advanced educational AI assistant, please provide a highly formal and structured response. Use clear sections, bullet points, and numbered lists to organize information. Avoid long paragraphs and maintain a professional, academic tone. If the user is looking for a note, check the Library Map. If they are asking about details, check the Currently Open Note.`;
            const result = await aiModel.generateContent(prompt);
            const text = result.response.text();
            setChatHistory(prev => [...prev, { role: "ai", text }]);
            onGenerate?.(query);
        } catch (err) {
            setChatHistory(prev => [...prev, { role: "ai", text: `Error: ${err.message || "Could not reach AI."}` }]);
        } finally {
            setLoading(false);
            setTimeout(() => { chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" }); }, 100);
        }
    };

    return (
        <div style={{
            position: "fixed", bottom: 20, left: "50%", transform: "translateX(-50%)",
            width: "calc(100% - 40px)", maxWidth: 680, zIndex: 800,
            padding: "0 4px", display: "flex", flexDirection: "column", gap: 8,
        }}>
            {/* Chat history floating above dock */}
            {chatOpen && chatHistory.length > 0 && (
                <div
                    ref={chatRef}
                    style={{
                        background: "rgba(255,255,255,.97)", backdropFilter: "blur(20px)",
                        borderRadius: 16, border: "1px solid rgba(195,198,215,.3)",
                        boxShadow: "0 16px 48px rgba(0,0,0,.15)",
                        maxHeight: minimized ? 46 : 320, overflowY: minimized ? "hidden" : "auto",
                        padding: "14px 16px",
                        display: "flex", flexDirection: "column", gap: 10,
                        animation: "scalePop .25s ease",
                        transition: "max-height .3s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: minimized ? 0 : 8, borderBottom: minimized ? "none" : "1px solid #f1f5f9" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <Icon name="psychology" size={16} style={{ color: "#712ae2" }} />
                            <span style={{ fontSize: ".72rem", fontWeight: 800, color: "#712ae2", textTransform: "uppercase", letterSpacing: ".12em" }}>AI Chat</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <button 
                                onClick={() => setMinimized(!minimized)} 
                                style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", color: "#94a3b8", transition: "color .2s" }}
                                onMouseEnter={(e) => e.currentTarget.style.color = "#712ae2"}
                                onMouseLeave={(e) => e.currentTarget.style.color = "#94a3b8"}
                            >
                                <Icon name={minimized ? "keyboard_arrow_up" : "keyboard_arrow_down"} size={20} />
                            </button>
                            <button onClick={() => { setChatOpen(false); setChatHistory([]); setMinimized(false); }} style={{ background: "none", border: "none", cursor: "pointer", fontSize: ".75rem", color: "#94a3b8", transition: "color .2s" }}
                                onMouseEnter={(e) => e.currentTarget.style.color = "#ef4444"}
                                onMouseLeave={(e) => e.currentTarget.style.color = "#94a3b8"}
                            >Clear ×</button>
                        </div>
                    </div>
                    
                    {!minimized && (
                        <>
                            {chatHistory.map((msg, i) => (
                                <div key={i} style={{
                                    alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                                    maxWidth: "85%",
                                    padding: "9px 13px", borderRadius: 12,
                                    background: msg.role === "user" ? "#004ac6" : "#f1f5f9",
                                    color: msg.role === "user" ? "#fff" : "#191c1e",
                                    fontSize: ".8rem", lineHeight: 1.6,
                                    whiteSpace: "pre-wrap",
                                    animation: "fadeUp .3s ease both",
                                }}>
                                    {msg.text}
                                </div>
                            ))}
                            {loading && (
                                <div style={{ alignSelf: "flex-start", display: "flex", gap: 5, padding: "6px 10px", background: "#f1f5f9", borderRadius: 10 }}>
                                    {[0, 1, 2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "#712ae2", animation: `pulse 1.2s ${i * .2}s infinite` }} />)}
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}


            <div className="glass" style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "7px 7px 7px 14px",
                borderRadius: 18, border: "1px solid rgba(255,255,255,.6)",
                boxShadow: "0 8px 36px rgba(0,0,0,.14)",
            }}>
                <div style={{
                    width: 38, height: 38, borderRadius: 10,
                    background: "linear-gradient(135deg,#712ae2,#8a4cfc)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0, boxShadow: "0 3px 12px rgba(113,42,226,.3)",
                    cursor: "pointer",
                }} onClick={() => setChatOpen(!chatOpen)}>
                    <Icon name="bolt" size={20} style={{ color: "#fff" }} />
                </div>
                <input
                    ref={inputRef}
                    value={val}
                    onChange={e => setVal(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") handleGenerate(); }}
                    placeholder="Ask AI to find, summarize or quiz you on your notes..."
                    style={{
                        flex: 1, border: "none", background: "transparent",
                        outline: "none", fontSize: ".875rem", fontWeight: 500,
                        color: "#191c1e", minWidth: 0,
                    }}
                />
                <button
                    onClick={handleGenerate}
                    disabled={loading || !val.trim()}
                    style={{
                        padding: "9px 20px",
                        background: loading ? "#737686" : "#004ac6",
                        color: "#fff", border: "none", borderRadius: 12,
                        fontSize: ".82rem", fontWeight: 700,
                        boxShadow: "0 3px 12px rgba(0,74,198,.28)",
                        transition: "all .2s", flexShrink: 0,
                        display: "flex", alignItems: "center", gap: 7,
                        cursor: loading || !val.trim() ? "not-allowed" : "pointer",
                        opacity: !val.trim() ? .6 : 1,
                    }}
                >
                    {loading
                        ? <><div style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin .65s linear infinite" }} /> Sending…</>
                        : <><Icon name="auto_awesome" size={16} /> Ask AI</>
                    }
                </button>
            </div>
        </div>
    );
};


/* ─────────────────────────────────────────────
   NEW DOCUMENT MODAL
───────────────────────────────────────────── */
const NewDocModal = ({ open, onClose, onCreate }) => {
    const [title, setTitle] = useState("");
    const [module, setModule] = useState("CS402");
    const [content, setContent] = useState("");
    const [sourceType, setSourceType] = useState("text"); // text | upload

    if (!open) return null;
    return (
        <div
            onClick={onClose}
            style={{
                position: "fixed", inset: 0, background: "rgba(0,0,0,.35)",
                backdropFilter: "blur(4px)", zIndex: 9000,
                display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
                animation: "fadeUp .2s ease both",
            }}
        >
            <div
                onClick={e => e.stopPropagation()}
                style={{
                    background: "#fff", borderRadius: 20, padding: "28px 26px",
                    width: "100%", maxWidth: 420,
                    boxShadow: "0 24px 64px rgba(0,0,0,.2)",
                    animation: "scalePop .3s ease both",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                    <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "1.1rem" }}>New Document</div>
                    <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#737686" }}>
                        <Icon name="close" size={22} />
                    </button>
                </div>
                <div style={{ marginBottom: 14 }}>
                    <label style={{ fontSize: ".78rem", fontWeight: 700, color: "#434655", display: "block", marginBottom: 6 }}>Document Title</label>
                    <input
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        placeholder="e.g. Lecture 7 — Photosynthesis"
                        autoFocus
                        style={{
                            width: "100%", padding: "10px 14px",
                            border: "1.5px solid rgba(195,198,215,.4)", borderRadius: 10,
                            fontSize: ".875rem", outline: "none", transition: "border-color .2s",
                        }}
                        onFocus={e => e.target.style.borderColor = "#004ac6"}
                        onBlur={e => e.target.style.borderColor = "rgba(195,198,215,.4)"}
                    />
                </div>
                <div style={{ marginBottom: 22 }}>
                    <label style={{ fontSize: ".78rem", fontWeight: 700, color: "#434655", display: "block", marginBottom: 6 }}>Module</label>
                    <select
                        value={module}
                        onChange={e => setModule(e.target.value)}
                        style={{ width: "100%", padding: "10px 14px", border: "1.5px solid rgba(195,198,215,.4)", borderRadius: 10, fontSize: ".875rem", outline: "none", background: "#fff" }}
                    >
                        {["CS402", "DE101", "MATH301", "BIO201", "PSYC101"].map(m => <option key={m}>{m}</option>)}
                    </select>
                </div>

                <div style={{ marginBottom: 22 }}>
                    <div style={{ display: "flex", gap: 12, marginBottom: 10 }}>
                        <button
                            onClick={() => setSourceType("text")}
                            style={{ flex: 1, padding: "8px", borderRadius: 8, border: "1px solid", borderColor: sourceType === "text" ? "#004ac6" : "#e2e8f0", background: sourceType === "text" ? "#eff6ff" : "transparent", fontSize: ".75rem", fontWeight: 600, color: sourceType === "text" ? "#004ac6" : "#434655" }}
                        >Text Content</button>
                        <button
                            onClick={() => setSourceType("upload")}
                            style={{ flex: 1, padding: "8px", borderRadius: 8, border: "1px solid", borderColor: sourceType === "upload" ? "#004ac6" : "#e2e8f0", background: sourceType === "upload" ? "#eff6ff" : "transparent", fontSize: ".75rem", fontWeight: 600, color: sourceType === "upload" ? "#004ac6" : "#434655" }}
                        >File Upload (Sim)</button>
                    </div>

                    {sourceType === "text" ? (
                        <textarea
                            value={content}
                            onChange={e => setContent(e.target.value)}
                            placeholder="Paste your lecture notes or document text here..."
                            style={{
                                width: "100%", minHeight: 120, padding: "10px 14px",
                                border: "1.5px solid rgba(195,198,215,.4)", borderRadius: 10,
                                fontSize: ".875rem", outline: "none", transition: "border-color .2s",
                                resize: "vertical", fontFamily: "inherit"
                            }}
                            onFocus={e => e.target.style.borderColor = "#004ac6"}
                            onBlur={e => e.target.style.borderColor = "rgba(195,198,215,.4)"}
                        />
                    ) : (
                        <div style={{ padding: "24px", border: "2px dashed #e2e8f0", borderRadius: 12, textAlign: "center", background: "#f8fafc" }}>
                            <Icon name="cloud_upload" size={32} style={{ color: "#94a3b8", marginBottom: 8 }} />
                            <div style={{ fontSize: ".75rem", color: "#64748b" }}>Select a file to sync metadata</div>
                            <input type="file" style={{ marginTop: 10, fontSize: ".7rem" }} onChange={e => {
                                if (e.target.files[0]) {
                                    setTitle(e.target.files[0].name.replace(/\.[^/.]+$/, ""));
                                    setContent(`[Simulated content for ${e.target.files[0].name}]`);
                                }
                            }} />
                        </div>
                    )}
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                    <button onClick={onClose} style={{ flex: 1, padding: "10px", background: "#f1f5f9", color: "#737686", border: "none", borderRadius: 10, fontWeight: 600, fontSize: ".85rem", cursor: "pointer" }}>
                        Cancel
                    </button>
                    <button
                        onClick={() => { if (title.trim()) { onCreate({ label: title, module, content }); setTitle(""); setContent(""); } }}
                        disabled={!title.trim() || !content.trim()}
                        style={{
                            flex: 2, padding: "10px",
                            background: (title.trim() && content.trim()) ? "#004ac6" : "#c3c6d7",
                            color: "#fff", border: "none", borderRadius: 10,
                            fontWeight: 700, fontSize: ".85rem", cursor: (title.trim() && content.trim()) ? "pointer" : "not-allowed",
                            transition: "background .2s",
                        }}
                    >
                        Create & Process
                    </button>
                </div>
            </div>
        </div>
    );
};

/* ─────────────────────────────────────────────
   MAIN NOTES PAGE
───────────────────────────────────────────── */
export default function DocFlowNotes() {
    const [viewMode, setViewMode] = useState("grid"); // grid | list
    const [selectedNote, setSelectedNote] = useState(null);
    const [selectedFolder, setSelectedFolder] = useState(null);
    const [searchVal, setSearchVal] = useState("");
    const [notes, setNotes] = useState([]);
    const [folders, setFolders] = useState([]);
    const [newDocOpen, setNewDocOpen] = useState(false);
    const [aiPanelOpen, setAiPanelOpen] = useState(true);
    const [isNoteOpen, setIsNoteOpen] = useState(false);
    const [readingMode, setReadingMode] = useState(false);
    const { toasts, add: toast, remove } = useToasts();

    useEffect(() => {
        // Fetch Folders
        fetch("/api/folders")
            .then(res => res.ok ? res.json() : [])
            .then(data => setFolders(Array.isArray(data) ? data : []))
            .catch(err => {
                console.error("Error fetching folders:", err);
                setFolders([]);
            });
    }, []);

    useEffect(() => {
        const url = selectedFolder ? `/api/notes/folder/${selectedFolder}` : "/api/notes";
        fetch(url)
            .then(res => res.ok ? res.json() : [])
            .then(data => {
                const notesList = Array.isArray(data) ? data : [];
                setNotes(notesList);
                if (notesList.length > 0) {
                    setSelectedNote(notesList[0]);
                } else {
                    setSelectedNote(null);
                }
            })
            .catch(err => {
                console.error("Error fetching notes:", err);
                setNotes([]);
            });
    }, [selectedFolder]);


    /* Filter notes by search */
    const filteredFolders = folders.filter(f => {
        const matchesSearch = f.label.toLowerCase().includes(searchVal.toLowerCase());
        if (selectedFolder) return f.id === selectedFolder && matchesSearch;
        return matchesSearch;
    });

    const filteredNotes = notes.filter(n => {
        const matchesSearch = n.label.toLowerCase().includes(searchVal.toLowerCase());
        if (selectedFolder) return n.folderId === selectedFolder && matchesSearch;
        return matchesSearch;
    });

    /* Handlers */
    const handleAddDoc = () => setNewDocOpen(true);

    const handleCreateDoc = async ({ label, module, content }) => {
        const newNote = {
            id: Date.now(), icon: "article",
            label, meta: `Processing... • Module: ${module}`,
            tag: "AI Processing", tagBg: "#fef3c7", tagColor: "#d97706",
            summary: ["AI is analyzing your document..."],
            content: content || ""
        };
        setNotes(p => [newNote, ...p]);
        setSelectedNote(newNote);
        setNewDocOpen(false);
        toast(`"${label}" is being processed...`, "info");

        try {
            console.log("Starting AI Processing for:", label);
            if (!API_KEY) throw new Error("API Key missing");

            const prompt = `Act as an educational assistant. Provide a concise, 3-bullet point summary of the following document content: "${content}". Be very factual and student-focused.`;
            let result;
            try {
                result = await aiModel.generateContent(prompt);
            } catch (e) {
                console.warn("Primary model (Flash) failed, trying fallback (Pro)...", e);
                result = await fallbackModel.generateContent(prompt);
            }

            const summaryText = result.response.text();
            console.log("AI Summary Generated:", summaryText);

            const points = summaryText.split(/\n|•|-|\d\./).filter(s => s.trim().length > 5).slice(0, 3);

            const processedNote = {
                ...newNote,
                tag: "AI Summarized", tagBg: "#d1fae5", tagColor: "#059669",
                summary: points.length > 0 ? points : [summaryText.substring(0, 100) + "..."],
                meta: `Processed just now • Module: ${module}`
            };

            // Save processed note to backend
            const response = await fetch("/api/notes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(processedNote)
            });
            const savedNote = await response.json();

            setNotes(p => p.map(n => n.id === newNote.id ? savedNote : n));
            setSelectedNote(savedNote);
            toast(`"${label}" processed and saved!`, "success");
        } catch (err) {
            console.error("AI Error Debug:", err);
            const errMsg = err.message || "Unknown error";
            toast(`AI Error: ${errMsg}`, "error");
            setNotes(p => p.map(n => n.id === newNote.id ? {
                ...n,
                tag: "Processing Error",
                tagBg: "#fee2e2",
                tagColor: "#e11d48",
                summary: [`Reason: ${errMsg}`, "Ensure your content is descriptive and valid."],
                error: true
            } : n));
        }
    };

    const handleRenameNote = async (note) => {
        const newName = prompt("Enter new name for note:", note.label);
        if (newName && newName !== note.label) {
            try {
                const response = await fetch(`/api/notes/${note.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ ...note, label: newName })
                });
                const updatedNote = await response.json();
                setNotes(p => p.map(n => n.id === note.id ? updatedNote : n));
                if (selectedNote?.id === note.id) setSelectedNote(updatedNote);
                toast("Note renamed!", "success");
            } catch (err) {
                toast("Failed to rename note", "error");
            }
        }
    };

    const handleDeleteNote = async (note) => {
        if (confirm(`Are you sure you want to delete "${note.label}"?`)) {
            try {
                await fetch(`/api/notes/${note.id}`, { method: "DELETE" });
                setNotes(p => p.filter(n => n.id !== note.id));
                if (selectedNote?.id === note.id) setSelectedNote(null);
                toast("Note deleted", "error");
            } catch (err) {
                toast("Failed to delete note", "error");
            }
        }
    };

    const handleRetry = (note) => {
        toast("Retrying AI analysis...", "info");
        handleCreateDoc({ label: note.label, module: note.meta.split(":")[1]?.trim() || "Gen", content: note.content });
        setNotes(p => p.filter(n => n.id !== note.id));
    };

    const handleFolderClick = (folder) => {
        setSelectedFolder(folder.id === selectedFolder ? null : folder.id);
        toast(`Opened: ${folder.label}`, "info");
    };

    const handleNoteClick = (note) => {
        setSelectedNote(note);
        setIsNoteOpen(true);
        setAiPanelOpen(true);
    };

    const handleAIGenerate = (query) => {
        // Redundant alert logic removed. The AIDock now handles its own generation with full library context.
        console.log(`Global AI Query initiated: ${query}`);
    };





    return (
        <>
            <style>{GLOBAL_CSS}</style>
            <div style={{ flex: 1, padding: "32px 40px", display: "flex", gap: 32, alignItems: "flex-start", width: "100%" }}>

                {/* LEFT: Main content */}
                <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 28 }}>
                    
                    {isNoteOpen && selectedNote ? (
                        <div className="fade-up-1" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                <button 
                                    onClick={() => setIsNoteOpen(false)}
                                    style={{ background: "#f1f5f9", border: "none", borderRadius: 10, padding: "8px 12px", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: ".85rem", fontWeight: 600, color: "#64748b" }}
                                >
                                    <Icon name="arrow_back" size={18} /> Back
                                </button>
                                <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: "1.5rem", fontWeight: 800 }}>{selectedNote.label}</h2>
                            </div>

                            <div style={{ background: "#fff", borderRadius: 20, padding: "30px", boxShadow: "0 4px 20px rgba(0,0,0,.05)", minHeight: "400px", display: "flex", flexDirection: "column" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20, paddingBottom: 15, borderBottom: "1px solid #f1f5f9" }}>
                                    <Icon name={selectedNote.icon} size={24} style={{ color: "#004ac6" }} />
                                    <span style={{ fontSize: ".85rem", fontWeight: 700, color: "#191c1e" }}>{selectedNote.meta}</span>
                                    <span style={{ marginLeft: "auto", fontSize: ".72rem", fontWeight: 700, padding: "4px 12px", borderRadius: 100, background: selectedNote.tagBg, color: selectedNote.tagColor }}>{selectedNote.tag}</span>
                                </div>
                                
                                <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
                                    <button 
                                        onClick={() => setReadingMode(false)}
                                        style={{ flex: 1, padding: "10px", borderRadius: 10, border: "1px solid", borderColor: !readingMode ? "#004ac6" : "#e2e8f0", background: !readingMode ? "#eff6ff" : "transparent", fontSize: ".8rem", fontWeight: 700, color: !readingMode ? "#004ac6" : "#64748b" }}
                                    >
                                        <Icon name="edit" size={16} /> Edit Mode
                                    </button>
                                    <button 
                                        onClick={() => setReadingMode(true)}
                                        style={{ flex: 1, padding: "10px", borderRadius: 10, border: "1px solid", borderColor: readingMode ? "#004ac6" : "#e2e8f0", background: readingMode ? "#eff6ff" : "transparent", fontSize: ".8rem", fontWeight: 700, color: readingMode ? "#004ac6" : "#64748b" }}
                                    >
                                        <Icon name="menu_book" size={16} /> Reader View (PDF Data)
                                    </button>
                                    <button 
                                        onClick={() => {
                                            const cleaned = (selectedNote.content || "").replace(/<[^>]*>?/gm, '');
                                            const updated = { ...selectedNote, content: cleaned };
                                            setSelectedNote(updated);
                                            setNotes(p => p.map(n => n.id === updated.id ? updated : n));
                                            toast("HTML tags removed! Clean text only.", "info");
                                        }}
                                        style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid #e2e8f0", background: "#f8fafc", fontSize: ".8rem", fontWeight: 700, color: "#dc2626" }}
                                        title="Strip HTML Tags"
                                    >
                                        <Icon name="cleaning_services" size={16} />
                                    </button>
                                </div>

                                {readingMode ? (
                                    <div style={{ flex: 1, fontSize: ".95rem", lineHeight: 1.7, color: "#1e293b", padding: "10px", overflowY: "auto", whiteSpace: "pre-wrap", fontFamily: "'Sora', sans-serif" }}>
                                        {/* Render content as clean text/formatted block to simulate PDF data */}
                                        <div style={{ background: "#fcfcfc", padding: "24px", borderRadius: 12, border: "1px solid #f1f5f9", boxShadow: "inset 0 2px 4px rgba(0,0,0,.02)" }}>
                                            {(selectedNote.content || "").replace(/<[^>]*>?/gm, '')}
                                        </div>
                                    </div>
                                ) : (
                                    <textarea
                                        value={selectedNote.content || ""}
                                        onChange={(e) => {
                                            const updated = { ...selectedNote, content: e.target.value };
                                            setSelectedNote(updated);
                                            setNotes(p => p.map(n => n.id === updated.id ? updated : n));
                                        }}
                                        placeholder="Your note content is empty. Type something here..."
                                        style={{
                                            width: "100%", minHeight: "350px", border: "none", outline: "none",
                                            fontSize: ".95rem", lineHeight: 1.6, color: "#434655", resize: "none",
                                            fontFamily: "inherit", flex: 1
                                        }}
                                    />
                                )}
                                
                                <div style={{ marginTop: 20, display: "flex", justifyContent: "flex-end", gap: 12, alignItems: "center" }}>
                                    <span style={{ fontSize: ".72rem", color: "#94a3b8", fontWeight: 500 }}>
                                        {readingMode ? "Reading Mode Active (Tags Hidden)" : "Editing Mode (All Characters Visible)"}
                                    </span>
                                    <button 
                                        onClick={async () => {
                                            try {
                                                await fetch(`/api/notes/${selectedNote.id}`, {
                                                    method: "PUT",
                                                    headers: { "Content-Type": "application/json" },
                                                    body: JSON.stringify(selectedNote)
                                                });
                                                toast("Note saved successfully!", "success");
                                            } catch (err) {
                                                toast("Failed to save note", "error");
                                            }
                                        }}
                                        style={{ background: "#004ac6", color: "#fff", border: "none", borderRadius: 10, padding: "10px 24px", fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 12px rgba(0,74,198,.2)" }}
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>

                    {/* Page header */}
                    <div className="fade-up-1" style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 14, flexWrap: "wrap" }}>
                        <div>
                            <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(1.5rem,3vw,2rem)", fontWeight: 800, letterSpacing: "-.04em", marginBottom: 4 }}>
                                Knowledge Library
                            </h2>
                            <p style={{ color: "#737686", fontSize: ".88rem" }}>
                                All your academic modules and personal insights curated by AI.
                                {searchVal && <span style={{ color: "#004ac6", fontWeight: 600 }}> · "{searchVal}"</span>}
                            </p>
                        </div>
                        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                            <button
                                onClick={handleAddDoc}
                                style={{
                                    padding: "10px 20px", fontSize: ".82rem", fontWeight: 700,
                                    background: "#004ac6", color: "#fff",
                                    border: "none",
                                    borderRadius: 12, boxShadow: "0 4px 14px rgba(0,74,198,.2)",
                                    transition: "all .2s", whiteSpace: "nowrap",
                                    display: "flex", alignItems: "center", gap: 8
                                }}
                                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-1px)"}
                                onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
                            >
                                <Icon name="add" size={18} /> New Document
                            </button>
                            <div style={{ width: 1, height: 24, background: "#e2e8f0", margin: "0 4px" }} />
                            <div style={{ display: "flex", gap: 4, background: "#eceef0", borderRadius: 10, padding: 4 }}>
                                {[{ v: "grid", icon: "grid_view" }, { v: "list", icon: "format_list_bulleted" }].map(m => (
                                    <button
                                        key={m.v}
                                        onClick={() => setViewMode(m.v)}
                                        style={{
                                            padding: "6px 10px", border: "none", borderRadius: 7,
                                            background: viewMode === m.v ? "#fff" : "transparent",
                                            color: viewMode === m.v ? "#004ac6" : "#737686",
                                            boxShadow: viewMode === m.v ? "0 1px 6px rgba(0,0,0,.08)" : "none",
                                            cursor: "pointer", transition: "all .18s",
                                        }}
                                    >
                                        <Icon name={m.icon} size={19} />
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={() => setAiPanelOpen(p => !p)}
                                style={{
                                    display: "flex", alignItems: "center", gap: 6,
                                    padding: "7px 14px", border: "1px solid rgba(195,198,215,.3)",
                                    borderRadius: 10, background: aiPanelOpen ? "#ede9fe" : "#fff",
                                    color: aiPanelOpen ? "#712ae2" : "#737686",
                                    fontSize: ".8rem", fontWeight: 600, cursor: "pointer", transition: "all .2s",
                                }}
                            >
                                <Icon name="auto_awesome" size={16} />
                                {aiPanelOpen ? "Hide AI" : "Show AI"}
                            </button>
                        </div>
                    </div>

                    {/* Folder Grid */}
                    {filteredFolders.length > 0 ? (
                        <div>
                            <div style={{ fontWeight: 700, fontSize: ".84rem", color: "#737686", textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 14, display: "flex", alignItems: "center", gap: 10 }}>
                                {selectedFolder ? (
                                    <button 
                                        onClick={() => setSelectedFolder(null)}
                                        style={{ background: "#eff6ff", border: "none", borderRadius: 8, padding: "6px 12px", color: "#004ac6", cursor: "pointer", fontWeight: 700, fontSize: ".75rem", display: "flex", alignItems: "center", gap: 6 }}
                                    >
                                        <Icon name="arrow_back" size={16} /> All Modules
                                    </button>
                                ) : (
                                    <><Icon name="folder" size={17} style={{ color: "#737686" }} /> Modules</>
                                )}
                            </div>
                            <div style={{
                                display: "grid",
                                gridTemplateColumns: viewMode === "grid"
                                    ? "repeat(auto-fill, minmax(220px, 1fr))"
                                    : "1fr",
                                gap: 16,
                            }}>
                                {filteredFolders.map((f, i) =>
                                    viewMode === "grid"
                                        ? <FolderCard key={f.id} folder={f} notes={notes.filter(n => n.folderId === f.id)} onClick={handleFolderClick} onNoteClick={handleNoteClick} delay={i * .04} />
                                        : (
                                            <div key={f.id}
                                                className="note-row"
                                                onClick={() => handleFolderClick(f)}
                                                style={{
                                                    display: "flex", alignItems: "center", gap: 14,
                                                    padding: "13px 16px", border: "1px solid rgba(195,198,215,.2)",
                                                    borderRadius: 12, background: "#fff", cursor: "pointer",
                                                    transition: "all .18s",
                                                    animation: `fadeUp .5s ${i * .04}s ease both`,
                                                }}
                                            >
                                                <div style={{ width: 40, height: 40, borderRadius: 10, background: f.iconBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                                    <Icon name={f.icon} size={20} style={{ color: f.iconColor }} />
                                                </div>
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <div style={{ fontWeight: 700, fontSize: ".9rem" }}>{f.label}</div>
                                                    <div style={{ fontSize: ".76rem", color: "#737686" }}>{f.description}</div>
                                                </div>
                                                <span style={{ padding: "3px 10px", borderRadius: 100, background: f.badgeBg, color: f.badgeColor, fontSize: ".72rem", fontWeight: 700, whiteSpace: "nowrap" }}>
                                                    {f.count} Notes
                                                </span>
                                            </div>
                                        )
                                )}
                            </div>
                        </div>
                    ) : searchVal ? (
                        <div style={{ textAlign: "center", padding: "32px 0" }}>
                            <Icon name="search_off" size={40} style={{ color: "#c3c6d7", display: "block", margin: "0 auto 12px" }} />
                            <div style={{ fontWeight: 700, color: "#737686", marginBottom: 4 }}>No folders match "{searchVal}"</div>
                        </div>
                    ) : null}

                    {/* Recent Notes */}
                    <div className="fade-up-3">
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                            <Icon name="schedule" size={19} style={{ color: "#004ac6" }} />
                            <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "1rem" }}>Recently Modified</span>
                            <span style={{ marginLeft: "auto", fontSize: ".76rem", color: "#737686" }}>{filteredNotes.length} notes</span>
                        </div>
                        {filteredNotes.length > 0 ? (
                            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                {filteredNotes.map((note, i) => (
                                    <div key={note.id} style={{ position: "relative" }}>
                                        <NoteRow
                                            note={note}
                                            isSelected={selectedNote?.id === note.id}
                                            onClick={handleNoteClick}
                                            onRename={handleRenameNote}
                                            onDelete={handleDeleteNote}
                                            delay={i * .07}
                                        />
                                        {note.error && (
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleRetry(note); }}
                                                style={{ position: "absolute", right: 60, top: "50%", transform: "translateY(-50%)", padding: "4px 10px", borderRadius: 8, background: "#004ac6", color: "#fff", border: "none", fontSize: ".7rem", fontWeight: 700, cursor: "pointer" }}
                                            >Retry</button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div style={{ textAlign: "center", padding: "28px 0", background: "#fff", borderRadius: 14, border: "1px solid rgba(195,198,215,.2)" }}>
                                <Icon name="notes" size={40} style={{ color: "#c3c6d7", display: "block", margin: "0 auto 10px" }} />
                                <div style={{ fontWeight: 700, color: "#737686", marginBottom: 4 }}>No notes found for "{searchVal}"</div>
                                <button
                                    onClick={handleAddDoc}
                                    style={{ marginTop: 10, padding: "8px 20px", background: "#004ac6", color: "#fff", border: "none", borderRadius: 100, fontWeight: 700, fontSize: ".82rem", cursor: "pointer" }}
                                >
                                    Create New Note
                                </button>
                            </div>
                        )}
                    </div>

                        </>
                    )}
                </div>

                {/* RIGHT: AI Panel */}
                {aiPanelOpen && (
                    <div style={{
                        width: 340, flexShrink: 0,
                        display: "flex",
                        visibility: "visible",
                        animation: "scalePop .35s ease both",
                    }}
                        className="ai-panel-wrap"
                    >
                        <AISidebarPanel
                            selectedNote={selectedNote}
                        />
                    </div>
                )}
            </div>


        {/* AI Dock */}
        <AIDock onGenerate={handleAIGenerate} selectedNote={selectedNote} allNotes={notes} />

        {/* Modals */}
        <NewDocModal
            open={newDocOpen}
            onClose={() => setNewDocOpen(false)}
            onCreate={handleCreateDoc}
        />

        {/* Toasts */}
        <Toast toasts={toasts} remove={remove} />

        {/* Responsive styles injected */}
        <style>{`
        @media (max-width: 900px) {
          .ai-panel-wrap { display: none; }
        }
        @media (max-width: 560px) {
          .upgrade-btn { display: none !important; }
        }
        `}</style>
        </>
    );
}