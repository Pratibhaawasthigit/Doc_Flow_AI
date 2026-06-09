import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Footer from "../components/Footer";

/* ── AI SDK Initialization ───────────────── */
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });


/* ─────────────────────────────────────────
   DATA CONSTANTS
───────────────────────────────────────── */
const NAV_LINKS = [];


const SIDEBAR_ITEMS = [
    { icon: "book_5", label: "Modules", active: true },
    { icon: "description", label: "Notes" },
    { icon: "smart_toy", label: "AI Chat" },
    { icon: "folder_open", label: "Resources" },
    { icon: "settings", label: "Settings" },
];

const RECENT_NOTES = [
    {
        icon: "psychology",
        iconBg: "bg-purple-100",
        iconColor: "text-purple-600",
        title: "Advanced Calculus III Summary",
        meta: "Processed 2h ago • 14 Pages",
    },
    {
        icon: "biotech",
        iconBg: "bg-emerald-100",
        iconColor: "text-emerald-600",
        title: "Molecular Biology - CRISPR-Cas9",
        meta: "Processed 5h ago • 8 Pages",
    },
    {
        icon: "history_edu",
        iconBg: "bg-blue-100",
        iconColor: "text-blue-600",
        title: "Post-Modernism in Lit Review",
        meta: "Processed Yesterday • 22 Pages",
    },
];

const CHART_BARS = [
    { day: "Mon", height: 40 },
    { day: "Tue", height: 65 },
    { day: "Wed", height: 55 },
    { day: "Thu", height: 92, active: true },
    { day: "Fri", height: 75 },
    { day: "Sat", height: 30 },
    { day: "Sun", height: 45 },
];

const STAT_CARDS = [
    { label: "Active Students", value: "2,840", change: "+8.1%", icon: "group", color: "blue" },
    { label: "Notes Generated", value: "14,290", change: "+22.4%", icon: "auto_awesome", color: "purple" },
    { label: "Avg. Score", value: "87.4%", change: "+3.2%", icon: "emoji_events", color: "emerald" },
];

/* ─────────────────────────────────────────
   MATERIAL ICON COMPONENT
───────────────────────────────────────── */
function Icon({ name, className = "" }) {
    return (
        <span
            className={`material-symbols-outlined select-none ${className}`}
            style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}
        >
            {name}
        </span>
    );
}

/* ─────────────────────────────────────────
   TOP NAV BAR
───────────────────────────────────────── */
function TopNav({ sidebarOpen, setSidebarOpen }) {
    const [scrolled, setScrolled] = useState(false);


    useEffect(() => {
        const handler = () => setScrolled(window.scrollY > 8);
        window.addEventListener("scroll", handler);
        return () => window.removeEventListener("scroll", handler);
    }, []);

    return (
        <>
            <nav
                style={{
                    position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
                    height: 64,
                    background: scrolled ? "rgba(247,249,251,0.92)" : "rgba(247,249,251,0.75)",
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    borderBottom: "1px solid rgba(195,198,215,0.25)",
                    boxShadow: scrolled ? "0 4px 24px rgba(0,74,198,0.07)" : "none",
                    transition: "all 0.3s ease",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "0 24px",
                }}
            >
                {/* Left: hamburger + logo + links */}
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    {/* Hamburger (mobile + tablet) */}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        style={{
                            display: "flex", flexDirection: "column", gap: 5,
                            padding: "6px", background: "none", border: "none", cursor: "pointer",
                            borderRadius: 8,
                        }}
                        aria-label="Toggle menu"
                        className="lg-hide-btn"
                    >
                        <span style={{ display: "block", width: 20, height: 2, background: "#191c1e", borderRadius: 2, transition: "all 0.3s", transform: sidebarOpen ? "rotate(45deg) translate(5px,5px)" : "none" }} />
                        <span style={{ display: "block", width: 20, height: 2, background: "#191c1e", borderRadius: 2, opacity: sidebarOpen ? 0 : 1, transition: "all 0.3s" }} />
                        <span style={{ display: "block", width: 20, height: 2, background: "#191c1e", borderRadius: 2, transition: "all 0.3s", transform: sidebarOpen ? "rotate(-45deg) translate(5px,-5px)" : "none" }} />
                    </button>

                    {/* Logo */}
                    <Link to="/" style={{
                        fontSize: "1.3rem", fontWeight: 800,
                        fontFamily: "'Space Grotesk', sans-serif",
                        background: "linear-gradient(135deg,#1d4ed8,#3b82f6)",
                        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                        backgroundClip: "text", letterSpacing: "-0.5px", cursor: "pointer",
                        textDecoration: "none"
                    }}>
                        DocFlow AI
                    </Link>

                    {/* Desktop Nav Links */}
                    <div className="desktop-nav-links">
                        {NAV_LINKS.map((link) => (
                            <Link
                                key={link.label}
                                to={link.to}
                                style={{
                                    fontSize: "0.875rem", fontWeight: link.active ? 600 : 500,
                                    fontFamily: "'Space Grotesk', sans-serif",
                                    color: link.active ? "#1d4ed8" : "#64748b",
                                    textDecoration: "none",
                                    paddingBottom: link.active ? 2 : 0,
                                    borderBottom: link.active ? "2px solid #2563eb" : "2px solid transparent",
                                    transition: "color 0.2s",
                                    letterSpacing: "-0.01em",
                                }}
                                onMouseEnter={(e) => { if (!link.active) e.currentTarget.style.color = "#2563eb"; }}
                                onMouseLeave={(e) => { if (!link.active) e.currentTarget.style.color = "#64748b"; }}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                </div>

                {/* Right: AI Engine status + action buttons */}
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    {/* AI Engine badge — hidden on small screens */}
                    <div className="ai-badge-desktop" style={{
                        display: "flex", alignItems: "center", gap: 8,
                        padding: "6px 14px", background: "#fff",
                        borderRadius: 10, border: "1px solid #e2e8f0",
                        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                    }}>
                        <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#4edea3", boxShadow: "0 0 6px #4edea3", animation: "pulse 2s infinite" }} />
                        <span style={{ fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.09em", color: "#434655" }}>AI Engine Active</span>
                    </div>

                </div>
            </nav>

            {/* Mobile: AI Engine badge below nav */}
            <div className="ai-badge-mobile" style={{
                position: "fixed", top: 64, left: 0, right: 0, zIndex: 99,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                padding: "8px 16px",
                background: "rgba(247,249,251,0.95)", backdropFilter: "blur(12px)",
                borderBottom: "1px solid rgba(195,198,215,0.3)",
            }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#4edea3", boxShadow: "0 0 6px #4edea3", animation: "pulse 2s infinite" }} />
                <span style={{ fontSize: "0.66rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#434655" }}>AI Engine Active</span>
            </div>
        </>
    );
}

/* ─────────────────────────────────────────
   SIDEBAR
───────────────────────────────────────── */
function Sidebar({ open, onClose }) {
    const navigate = useNavigate();
    return (
        <>
            {/* Overlay for mobile */}
            {open && (
                <div
                    onClick={onClose}
                    style={{
                        position: "fixed", inset: 0, zIndex: 89,
                        background: "rgba(0,0,0,0.3)", backdropFilter: "blur(2px)",
                    }}
                    className="sidebar-overlay"
                />
            )}

            <aside
                style={{
                    position: "fixed",
                    top: 64, left: 0,
                    height: "calc(100vh - 64px)",
                    width: 256,
                    background: "#f8fafc",
                    borderRight: "1px solid rgba(195,198,215,0.3)",
                    display: "flex", flexDirection: "column",
                    padding: "16px 12px",
                    zIndex: 90,
                    transition: "transform 0.3s cubic-bezier(0.16,1,0.3,1)",
                }}
                className={`sidebar ${open ? "sidebar-open" : "sidebar-closed"}`}
            >
                {/* Profile section */}
                <div style={{ padding: "16px 12px 24px", marginBottom: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{
                            width: 44, height: 44, borderRadius: 12,
                            background: "linear-gradient(135deg,#2563eb,#8a4cfc)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                            <Icon name="architecture" className="" style={{ color: "#fff", fontSize: 22 }} />
                        </div>
                        <div>
                            <p style={{ fontWeight: 700, fontSize: "0.9rem", color: "#191c1e", fontFamily: "'Space Grotesk',sans-serif" }}>Education Hub</p>
                            <p style={{ fontSize: "0.65rem", color: "#737686", textTransform: "uppercase", letterSpacing: "0.08em" }}>AI Architecture</p>
                        </div>
                    </div>
                </div>

                {/* Nav items */}
                <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
                    {SIDEBAR_ITEMS.map((item) => (
                        <a
                            key={item.label}
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                if (item.label === "Notes") navigate("/notes");
                                onClose();
                            }}
                            style={{
                                display: "flex", alignItems: "center", gap: 12,
                                padding: "11px 14px", borderRadius: 10,
                                fontFamily: "'Space Grotesk',sans-serif",
                                fontSize: "0.875rem", fontWeight: item.active ? 700 : 500,
                                color: item.active ? "#1d4ed8" : "#64748b",
                                background: item.active ? "#fff" : "transparent",
                                boxShadow: item.active ? "0 0 20px rgba(0,74,198,0.12)" : "none",
                                textDecoration: "none", transition: "all 0.18s", cursor: "pointer",
                            }}
                            onMouseEnter={(e) => { if (!item.active) { e.currentTarget.style.background = "#e2e8f0"; e.currentTarget.style.color = "#191c1e"; } }}
                            onMouseLeave={(e) => { if (!item.active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#64748b"; } }}
                        >
                            <span className="material-symbols-outlined" style={{ fontSize: 20, fontVariationSettings: "'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 24" }}>{item.icon}</span>
                            {item.label}
                        </a>
                    ))}
                </nav>

                {/* Bottom actions */}
                <div style={{ borderTop: "1px solid rgba(195,198,215,0.4)", paddingTop: 16, display: "flex", flexDirection: "column", gap: 4 }}>
                    <button style={{
                        width: "100%", padding: "11px", borderRadius: 12, border: "none", cursor: "pointer",
                        background: "linear-gradient(135deg,#712ae2,#8a4cfc)",
                        color: "#fff", fontWeight: 700, fontSize: "0.875rem",
                        fontFamily: "'Space Grotesk',sans-serif",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                        boxShadow: "0 4px 14px rgba(113,42,226,0.3)", marginBottom: 8,
                        transition: "all 0.2s",
                    }}
                        onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 6px 20px rgba(113,42,226,0.45)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 4px 14px rgba(113,42,226,0.3)"; e.currentTarget.style.transform = "none"; }}
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: 18, fontVariationSettings: "'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 24" }}>rocket_launch</span>
                        Open Workspace
                    </button>
                    {[{ icon: "help", label: "Help" }, { icon: "shield", label: "Privacy" }].map((item) => (
                        <a key={item.label} href="#"
                            style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", color: "#94a3b8", fontSize: "0.84rem", textDecoration: "none", transition: "color 0.2s", fontFamily: "'Space Grotesk',sans-serif" }}
                            onMouseEnter={(e) => e.currentTarget.style.color = "#191c1e"}
                            onMouseLeave={(e) => e.currentTarget.style.color = "#94a3b8"}
                        >
                            <span className="material-symbols-outlined" style={{ fontSize: 18, fontVariationSettings: "'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 24" }}>{item.icon}</span>
                            {item.label}
                        </a>
                    ))}
                </div>
            </aside>
        </>
    );
}

/* ─────────────────────────────────────────
   STAT MINI CARD
───────────────────────────────────────── */
function StatMiniCard({ label, value, change, icon, color }) {
    const colors = {
        blue: { bg: "#dbeafe", iconColor: "#2563eb", changeBg: "#d1fae5", changeColor: "#059669" },
        purple: { bg: "#ede9fe", iconColor: "#7c3aed", changeBg: "#d1fae5", changeColor: "#059669" },
        emerald: { bg: "#d1fae5", iconColor: "#059669", changeBg: "#d1fae5", changeColor: "#059669" },
    };
    const c = colors[color];
    return (
        <div style={{
            background: "#fff", border: "1px solid rgba(195,198,215,0.15)",
            borderRadius: 16, padding: "20px 18px",
            display: "flex", alignItems: "center", gap: 14,
            transition: "all 0.25s", cursor: "default",
            boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
        }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 10px 28px rgba(0,74,198,0.1)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 1px 6px rgba(0,0,0,0.04)"; }}
        >
            <div style={{ width: 44, height: 44, borderRadius: 12, background: c.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span className="material-symbols-outlined" style={{ color: c.iconColor, fontSize: 22, fontVariationSettings: "'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 24" }}>{icon}</span>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "#737686", marginBottom: 2 }}>{label}</p>
                <p style={{ fontSize: "1.2rem", fontWeight: 800, fontFamily: "'Space Grotesk',sans-serif", color: "#191c1e", letterSpacing: "-0.03em" }}>{value}</p>
            </div>
            <span style={{ fontSize: "0.72rem", fontWeight: 700, padding: "3px 9px", borderRadius: 100, background: c.changeBg, color: c.changeColor, flexShrink: 0 }}>{change}</span>
        </div>
    );
}

/* ─────────────────────────────────────────
   UPLOAD ZONE
───────────────────────────────────────── */
function UploadZone({ onNoteGenerated }) {
    const [dragging, setDragging] = useState(false);
    const [file, setFile] = useState(null);
    const [processing, setProcessing] = useState(false);
    const inputRef = useRef(null);

    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        const dropped = e.dataTransfer.files[0];
        if (dropped) setFile(dropped);
    };

    const processWithAI = async () => {
        if (!file) return;
        setProcessing(true);
        try {
            // Simulate reading file content (Metadata used for the demo)
            const prompt = `Act as an educational assistant. Generate a structured summary for a file named "${file.name}" of size ${(file.size / 1024 / 1024).toFixed(2)}MB. 
            Format the output as a JSON object with: 
            "title": (a catchy short name), 
            "summary": (2-3 sentences of educational overview),
            "meta": (e.g. "Processed just now • X Pages")`;

            const result = await model.generateContent(prompt);
            const text = result.response.text();

            // Clean JSON if model returns backticks
            const jsonStr = text.replace(/```json|```/g, "");
            const noteData = JSON.parse(jsonStr);

            const newNote = {
                icon: "description",
                iconBg: "bg-blue-100",
                iconColor: "text-blue-600",
                title: noteData.title || file.name,
                meta: noteData.meta || `Processed just now • ${Math.floor(Math.random() * 20) + 1} Pages`,
                summary: noteData.summary
            };

            onNoteGenerated(newNote);
            setFile(null);
        } catch (err) {
            console.error("AI Processing failed:", err);
            alert("AI Error: Check console or API Key.");
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div style={{
            background: "#fff",
            border: "1px solid rgba(195,198,215,0.15)",
            borderRadius: 20, padding: "28px 24px",
            boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
        }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
                <div>
                    <h2 style={{ fontSize: "1.05rem", fontWeight: 700, fontFamily: "'Space Grotesk',sans-serif", color: "#191c1e", marginBottom: 4 }}>Document Neural Processor</h2>
                    <p style={{ fontSize: "0.82rem", color: "#737686" }}>Upload course materials for automated note generation</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {processing && <span className="material-symbols-outlined" style={{ color: "#2563eb", animation: "pulse 1s infinite" }}>neurology</span>}
                    <span className="material-symbols-outlined" style={{ color: "#2563eb", fontSize: 28, fontVariationSettings: "'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 24" }}>cloud_upload</span>
                </div>
            </div>

            <div
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
                style={{
                    border: `2px dashed ${dragging ? "#2563eb" : "rgba(195,198,215,0.45)"}`,
                    borderRadius: 14,
                    minHeight: 220,
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14,
                    background: dragging ? "rgba(37,99,235,0.04)" : "rgba(242,244,246,0.4)",
                    cursor: "pointer", transition: "all 0.2s",
                    padding: "24px 16px",
                }}
            >
                <input ref={inputRef} type="file" accept=".pdf,.docx,.mp4" style={{ display: "none" }} onChange={(e) => setFile(e.target.files[0])} />
                <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(37,99,235,0.07)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span className="material-symbols-outlined" style={{ color: "#2563eb", fontSize: 32, fontVariationSettings: "'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 24" }}>{processing ? "sync" : "add_circle"}</span>
                </div>
                {file ? (
                    <div style={{ textAlign: "center" }}>
                        <p style={{ fontWeight: 700, color: "#191c1e", fontSize: "0.9rem" }}>{file.name}</p>
                        <p style={{ fontSize: "0.75rem", color: "#737686", marginTop: 4 }}>{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                ) : (
                    <div style={{ textAlign: "center" }}>
                        <p style={{ fontWeight: 700, color: "#191c1e", fontSize: "0.9rem" }}>Drop your PDF, DOCX or MP4</p>
                        <p style={{ fontSize: "0.75rem", color: "#737686", marginTop: 4 }}>Maximum file size 256MB • Powered by DocFlow AI</p>
                    </div>
                )}

                <div style={{ display: "flex", gap: 12 }}>
                    <button
                        onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
                        disabled={processing}
                        style={{
                            marginTop: 8, padding: "9px 28px",
                            background: "#2563eb", color: "#fff",
                            border: "none", borderRadius: 9999,
                            fontWeight: 700, fontSize: "0.84rem",
                            cursor: "pointer", fontFamily: "inherit",
                            boxShadow: "0 4px 14px rgba(37,99,235,0.3)",
                            transition: "all 0.2s",
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "#1d4ed8"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "#2563eb"; e.currentTarget.style.transform = "none"; }}
                    >
                        {file ? "Change File" : "Select Files"}
                    </button>
                    {file && (
                        <button
                            onClick={(e) => { e.stopPropagation(); processWithAI(); }}
                            disabled={processing}
                            style={{
                                marginTop: 8, padding: "9px 28px",
                                background: "linear-gradient(135deg,#712ae2,#8a4cfc)", color: "#fff",
                                border: "none", borderRadius: 9999,
                                fontWeight: 700, fontSize: "0.84rem",
                                cursor: "pointer", fontFamily: "inherit",
                                boxShadow: "0 4px 14px rgba(113,42,226,0.3)",
                                transition: "all 0.2s",
                            }}
                        >
                            {processing ? "Analysing..." : "Process with AI"}
                        </button>
                    )}
                </div>
            </div>

            {/* Format pills */}
            <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
                {["PDF", "DOCX", "MP4", "PPTX"].map((fmt) => (
                    <span key={fmt} style={{ padding: "3px 11px", borderRadius: 100, background: "rgba(37,99,235,0.07)", color: "#2563eb", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.04em" }}>{fmt}</span>
                ))}
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────
   SALES CARD
───────────────────────────────────────── */
function SalesCard() {
    return (
        <div style={{
            background: "linear-gradient(135deg,#e0e9ff,#dbeafe)",
            borderRadius: 20, padding: "28px 24px",
            position: "relative", overflow: "hidden",
            display: "flex", flexDirection: "column", height: "100%",
            minHeight: 220,
        }}>
            <div style={{ position: "absolute", right: -16, top: -16, color: "rgba(37,99,235,0.1)" }}>
                <span className="material-symbols-outlined" style={{ fontSize: 100, fontVariationSettings: "'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 24" }}>trending_up</span>
            </div>
            <p style={{ fontSize: "0.65rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.12em", color: "#434655", opacity: 0.7, marginBottom: 16 }}>Course Sales</p>
            <h3 style={{ fontSize: "2.8rem", fontWeight: 800, fontFamily: "'Space Grotesk',sans-serif", color: "#191c1e", letterSpacing: "-1.5px", lineHeight: 1 }}>$12,480</h3>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8, color: "#059669", fontWeight: 700 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 16, fontVariationSettings: "'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 24" }}>north_east</span>
                <span style={{ fontSize: "0.84rem" }}>+14.2% this month</span>
            </div>
            <div style={{ marginTop: "auto", paddingTop: 28 }}>
                <div style={{ height: 6, width: "100%", background: "rgba(255,255,255,0.5)", borderRadius: 100, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: "62%", background: "linear-gradient(90deg,#2563eb,#60a5fa)", borderRadius: 100 }} />
                </div>
                <p style={{ fontSize: "0.65rem", marginTop: 6, fontWeight: 700, color: "#434655" }}>TARGET: $20,000</p>
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────
   RECENT NOTES
───────────────────────────────────────── */
function RecentNotes({ notes }) {
    return (
        <div style={{
            background: "rgba(242,244,246,0.7)", borderRadius: 20, padding: "22px 20px",
        }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                <h3 style={{ fontSize: "1rem", fontWeight: 700, fontFamily: "'Space Grotesk',sans-serif", color: "#191c1e" }}>Recent Neural Notes</h3>
                <button style={{ color: "#2563eb", fontWeight: 700, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.06em", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>View Archive</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {notes.map((note, i) => (
                    <div
                        key={`${note.title}-${i}`}
                        style={{
                            background: "#fff", padding: "14px 16px", borderRadius: 12,
                            display: "flex", alignItems: "center", gap: 14, cursor: "pointer",
                            transition: "all 0.2s", border: "1px solid transparent",
                        }}
                        onClick={() => alert(note.summary || "No summary available")}
                        onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,74,198,0.1)"; e.currentTarget.style.borderColor = "rgba(37,99,235,0.15)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = "transparent"; }}
                    >
                        <div style={{ width: 44, height: 44, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }} className={note.iconBg}>
                            <span className="material-symbols-outlined" style={{ fontSize: 22, fontVariationSettings: "'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 24" }} data-class={note.iconColor}>{note.icon}</span>
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ fontWeight: 700, fontSize: "0.84rem", color: "#191c1e", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{note.title}</p>
                            <p style={{ fontSize: "0.72rem", color: "#737686", marginTop: 2 }}>{note.meta}</p>
                        </div>
                        <span className="material-symbols-outlined" style={{ color: "#b0b5c4", fontSize: 18, flexShrink: 0, transition: "color 0.2s", fontVariationSettings: "'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 24" }}>chevron_right</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────
   CHART
───────────────────────────────────────── */
function EngagementChart() {
    const [activeView, setActiveView] = useState("Month");
    return (
        <div style={{
            background: "#fff", borderRadius: 20, padding: "24px 20px",
            border: "1px solid rgba(195,198,215,0.15)",
            boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
        }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, gap: 12, flexWrap: "wrap" }}>
                <div>
                    <h3 style={{ fontSize: "1rem", fontWeight: 700, fontFamily: "'Space Grotesk',sans-serif", color: "#191c1e", marginBottom: 2 }}>Student Success Index</h3>
                    <p style={{ fontSize: "0.76rem", color: "#737686" }}>Engagement levels across all modules</p>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                    {["Week", "Month"].map((v) => (
                        <button
                            key={v}
                            onClick={() => setActiveView(v)}
                            style={{
                                padding: "5px 14px", borderRadius: 100, border: "none", cursor: "pointer",
                                background: activeView === v ? "#2563eb" : "#eceef0",
                                color: activeView === v ? "#fff" : "#737686",
                                fontSize: "0.7rem", fontWeight: 700, fontFamily: "inherit", transition: "all 0.2s",
                            }}
                        >
                            {v}
                        </button>
                    ))}
                </div>
            </div>

            {/* Chart bars */}
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", height: 180, gap: 8, padding: "0 4px" }}>
                {CHART_BARS.map((bar) => (
                    <div key={bar.day} style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1, gap: 6, height: "100%" }}>
                        <div style={{ flex: 1, width: "100%", display: "flex", alignItems: "flex-end", position: "relative" }}>
                            {bar.active && (
                                <div style={{
                                    position: "absolute", top: -32, left: "50%", transform: "translateX(-50%)",
                                    background: "#191c1e", color: "#fff",
                                    padding: "3px 8px", borderRadius: 6, fontSize: "0.7rem", fontWeight: 700, whiteSpace: "nowrap",
                                }}>
                                    {bar.height}%
                                </div>
                            )}
                            <div
                                style={{
                                    width: "100%",
                                    height: `${bar.height}%`,
                                    background: bar.active
                                        ? "linear-gradient(180deg,#2563eb,#60a5fa)"
                                        : "rgba(37,99,235,0.1)",
                                    borderRadius: "5px 5px 0 0",
                                    transition: "all 0.3s",
                                    cursor: "pointer",
                                }}
                                onMouseEnter={(e) => { if (!bar.active) e.currentTarget.style.background = "rgba(37,99,235,0.2)"; }}
                                onMouseLeave={(e) => { if (!bar.active) e.currentTarget.style.background = "rgba(37,99,235,0.1)"; }}
                            />
                        </div>
                        <span style={{ fontSize: "0.65rem", fontWeight: 700, color: "#737686", textTransform: "uppercase", letterSpacing: "0.04em" }}>{bar.day}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────
   AI DOCK (bottom floating bar)
───────────────────────────────────────── */
function AIDock() {
    const [value, setValue] = useState("");
    const [sending, setSending] = useState(false);
    const [history, setHistory] = useState([]);
    const [chatOpen, setChatOpen] = useState(false);
    const chatRef = useRef(null);

    const handleSend = async () => {
        if (!value.trim()) return;
        const userMsg = value;
        setValue("");
        setSending(true);
        setHistory(prev => [...prev, { role: "user", text: userMsg }]);
        setChatOpen(true);

        try {
            const chat = model.startChat({
                history: history.map(h => ({
                    role: h.role === "user" ? "user" : "model",
                    parts: [{ text: h.text }]
                }))
            });

            const result = await chat.sendMessage(userMsg);
            const response = await result.response;
            const text = response.text();
            setHistory(prev => [...prev, { role: "ai", text: text }]);
        } catch (err) {
            console.error("AI Chat failed:", err);
            setHistory(prev => [...prev, { role: "ai", text: "Error: Could not reach AI Engine. Check API Key." }]);
        } finally {
            setSending(false);
            if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    };

    return (
        <div style={{
            position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
            width: "calc(100% - 48px)", maxWidth: 680, zIndex: 200,
            padding: "0 16px", display: "flex", flexDirection: "column", gap: 12
        }}>
            {/* Chat Box (Floating) */}
            {chatOpen && (
                <div style={{
                    background: "rgba(255,255,255,0.95)", backdropFilter: "blur(20px)",
                    borderRadius: 20, padding: 20, boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
                    border: "1px solid rgba(0,74,198,0.1)", maxHeight: 350, overflowY: "auto",
                    display: "flex", flexDirection: "column", gap: 12
                }} ref={chatRef}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #eee", paddingBottom: 8 }}>
                        <span style={{ fontWeight: 700, fontSize: "0.85rem", color: "#1d4ed8" }}>AI Assistant</span>
                        <button onClick={() => setChatOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18 }}>×</button>
                    </div>
                    {history.map((msg, i) => (
                        <div key={i} style={{
                            alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                            maxWidth: "80%", padding: "10px 14px", borderRadius: 12,
                            background: msg.role === "user" ? "#2563eb" : "#f1f5f9",
                            color: msg.role === "user" ? "#fff" : "#191c1e",
                            fontSize: "0.84rem", lineHeight: 1.5
                        }}>
                            {msg.text}
                        </div>
                    ))}
                    {sending && <div style={{ fontSize: "0.75rem", color: "#64748b", fontStyle: "italic" }}>AI is typing...</div>}
                </div>
            )}

            {/* Input Bar */}
            <div style={{
                background: "rgba(255,255,255,0.82)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
                padding: "8px 8px 8px 10px", borderRadius: 9999,
                boxShadow: "0 8px 32px rgba(0,0,0,0.14), 0 0 0 1px rgba(255,255,255,0.5)",
                border: "1px solid rgba(255,255,255,0.5)",
                display: "flex", alignItems: "center", gap: 10,
            }}>
                <div
                    onClick={() => setChatOpen(!chatOpen)}
                    style={{
                        width: 40, height: 40, borderRadius: "50%",
                        background: "linear-gradient(135deg,#004ac6,#712ae2)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0, boxShadow: "0 2px 8px rgba(0,74,198,0.3)", cursor: "pointer"
                    }}>
                    <span className="material-symbols-outlined" style={{ color: "#fff", fontSize: 20, fontVariationSettings: "'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 24" }}>smart_toy</span>
                </div>
                <input
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") handleSend(); }}
                    placeholder={history.length > 0 ? "Type follow up..." : "Ask AI to restructure a module..."}
                    style={{
                        flex: 1, border: "none", background: "transparent", outline: "none",
                        fontSize: "0.875rem", fontWeight: 500, fontFamily: "inherit",
                        color: "#191c1e", minWidth: 0,
                    }}
                />
                <button
                    onClick={handleSend}
                    disabled={sending}
                    style={{
                        background: sending ? "#94a3b8" : "#191c1e",
                        color: "#fff", height: 40, padding: "0 20px",
                        borderRadius: 9999, border: "none", cursor: sending ? "default" : "pointer",
                        fontWeight: 700, fontSize: "0.78rem", fontFamily: "inherit",
                        transition: "all 0.2s", flexShrink: 0, whiteSpace: "nowrap",
                    }}
                    onMouseEnter={(e) => { if (!sending) e.currentTarget.style.background = "#2563eb"; }}
                    onMouseLeave={(e) => { if (!sending) e.currentTarget.style.background = "#191c1e"; }}
                >
                    {sending ? "Sending…" : "Send Request"}
                </button>
            </div>
        </div>
    );
}


/* ─────────────────────────────────────────
   MAIN DASHBOARD COMPONENT
───────────────────────────────────────── */
export default function DocFlowDashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [notes, setNotes] = useState([]);
    const [stats, setStats] = useState({
        activeStudents: "2,840",
        notesGenerated: "0",
        avgScore: "87.4%"
    });

    useEffect(() => {
        // Fetch Notes
        fetch("/api/notes")
            .then(res => res.json())
            .then(data => {
                const mapped = data.map(n => ({
                    icon: n.icon || "description",
                    iconBg: "bg-blue-100",
                    iconColor: "text-blue-600",
                    title: n.label,
                    meta: n.meta,
                    summary: Array.isArray(n.summary) ? n.summary.join(" ") : n.summary
                }));
                setNotes(mapped.slice(0, 5));
                setStats(prev => ({ ...prev, notesGenerated: data.length.toLocaleString() }));
            })
            .catch(err => console.error("Notes fetch error:", err));
    }, []);

    const addNote = async (newNote) => {
        const noteData = {
            label: newNote.title,
            tag: "AI Generated",
            tagBg: "#eff6ff",
            tagColor: "#2563eb",
            meta: newNote.meta,
            summary: [newNote.summary],
            error: false,
            icon: newNote.icon
        };

        try {
            const res = await fetch("/api/notes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(noteData)
            });
            if (res.ok) {
                setNotes(prev => [newNote, ...prev]);
                setStats(prev => ({ ...prev, notesGenerated: (parseInt(prev.notesGenerated.replace(/,/g,'')) + 1).toLocaleString() }));
            }
        } catch (err) {
            console.error("Save note error:", err);
        }
    };

    // Close sidebar on large screens when resizing up
    useEffect(() => {
        const handler = () => {
            if (window.innerWidth >= 1024) setSidebarOpen(false);
        };
        window.addEventListener("resize", handler);
        return () => window.removeEventListener("resize", handler);
    }, []);

    return (
        <>
            {/* Google Fonts + Material Symbols */}
            <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
            <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />

            <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: #f7f9fb; font-family: 'Plus Jakarta Sans', sans-serif; color: #191c1e; overflow-x: hidden; }
        a { text-decoration: none; color: inherit; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #f7f9fb; }
        ::-webkit-scrollbar-thumb { background: #2563eb; border-radius: 3px; }
        .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; user-select: none; }

        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(78,222,163,0.5); }
          50% { box-shadow: 0 0 0 5px rgba(78,222,163,0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: none; }
        }
        .fade-in { animation: fadeInUp 0.55s ease both; }
        .fade-in-1 { animation: fadeInUp 0.55s 0.08s ease both; }
        .fade-in-2 { animation: fadeInUp 0.55s 0.16s ease both; }
        .fade-in-3 { animation: fadeInUp 0.55s 0.24s ease both; }
        .fade-in-4 { animation: fadeInUp 0.55s 0.32s ease both; }
        .fade-in-5 { animation: fadeInUp 0.55s 0.4s ease both; }

        /* Sidebar: always visible on lg screens */
        @media (min-width: 1024px) {
          .sidebar { transform: translateX(0) !important; }
          .sidebar-overlay { display: none !important; }
          .lg-hide-btn { display: none !important; }
          .main-content { margin-left: 256px !important; }
        }
        @media (max-width: 1023px) {
          .sidebar-closed { transform: translateX(-100%); }
          .sidebar-open { transform: translateX(0); }
          .main-content { margin-left: 0 !important; }
        }

        /* Desktop nav links */
        @media (min-width: 768px) {
          .desktop-nav-links { display: flex !important; gap: 24px; align-items: center; }
          .ai-badge-desktop { display: flex !important; }
          .ai-badge-mobile { display: none !important; }
        }
        @media (max-width: 767px) {
          .desktop-nav-links { display: none !important; }
          .ai-badge-desktop { display: none !important; }
          .ai-badge-mobile { display: flex !important; }
        }

        /* Bento grid responsive */
        .bento-grid {
          display: grid;
          gap: 20px;
          grid-template-columns: 1fr;
        }
        @media (min-width: 640px) {
          .bento-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (min-width: 1024px) {
          .bento-grid { grid-template-columns: 1fr 1fr 1fr; }
        }

        /* Upload + Sales row */
        .upload-sales-row {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
        }
        @media (min-width: 768px) {
          .upload-sales-row { grid-template-columns: 2fr 1fr; }
        }

        /* Notes + Chart row */
        .notes-chart-row {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
        }
        @media (min-width: 900px) {
          .notes-chart-row { grid-template-columns: 5fr 7fr; }
        }

        /* Note icon color fix */
        [data-class="text-purple-600"] { color: #9333ea !important; }
        [data-class="text-emerald-600"] { color: #059669 !important; }
        [data-class="text-blue-600"] { color: #2563eb !important; }

        /* Note icon bg fix */
        .bg-purple-100 { background-color: #f3e8ff; }
        .bg-emerald-100 { background-color: #d1fae5; }
        .bg-blue-100 { background-color: #dbeafe; }
      `}</style>

            <div style={{ minHeight: "100vh", background: "#f7f9fb" }}>
                <TopNav sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

                {/* Main Content */}
                <main
                    className="main-content"
                    style={{
                        minHeight: "100vh",
                        paddingTop: 64,
                        paddingBottom: 100,
                        background: "#f7f9fb",
                        transition: "margin-left 0.3s",
                    }}
                >
                    {/* Secondary top bar for mobile AI status */}
                    <div className="ai-badge-mobile" />

                    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 20px 24px" }}>

                        {/* Dashboard Header */}
                        <header className="fade-in" style={{
                            marginBottom: 32,
                            display: "flex", flexWrap: "wrap",
                            alignItems: "flex-end", justifyContent: "space-between", gap: 20,
                        }}>
                            <div>
                                <h1 style={{
                                    fontSize: "clamp(1.6rem, 4vw, 2.4rem)",
                                    fontWeight: 800, fontFamily: "'Space Grotesk',sans-serif",
                                    color: "#191c1e", letterSpacing: "-0.04em", lineHeight: 1.1, marginBottom: 6,
                                }}>
                                    Professional Dashboard
                                </h1>
                                <p style={{ color: "#737686", maxWidth: 400, fontSize: "0.9rem", lineHeight: 1.6 }}>
                                    Orchestrate your educational workflow with neural-enhanced document automation.
                                </p>
                            </div>

                            {/* Users avatars + status */}
                            <div style={{
                                display: "flex", alignItems: "center", gap: 12,
                                background: "#f2f4f6", padding: "8px 12px", borderRadius: 16,
                                flexWrap: "wrap",
                            }}>
                                <div style={{
                                    display: "flex", alignItems: "center", gap: 8,
                                    padding: "6px 14px", background: "#fff",
                                    borderRadius: 10, border: "1px solid #e2e8f0",
                                    boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                                }}>
                                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#4edea3", animation: "pulse 2s infinite" }} />
                                    <span style={{ fontSize: "0.66rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.09em", color: "#434655" }}>AI Engine Active</span>
                                </div>
                                <div style={{ display: "flex" }}>
                                    {[
                                        { bg: "linear-gradient(135deg,#60a5fa,#2563eb)", text: "" },
                                        { bg: "linear-gradient(135deg,#a78bfa,#7c3aed)", text: "" },
                                        { bg: "#eaddff", text: "+12", color: "#25005a" },
                                    ].map((av, i) => (
                                        <div key={i} style={{
                                            width: 36, height: 36, borderRadius: "50%",
                                            border: "2px solid #fff", background: av.bg,
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            marginLeft: i === 0 ? 0 : -10, fontSize: "0.72rem", fontWeight: 700,
                                            color: av.color || "#fff", flexShrink: 0,
                                            boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                                        }}>
                                            {av.text}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </header>

                        {/* Mini stat cards row */}
                        <div className="bento-grid fade-in-1" style={{ marginBottom: 20 }}>
                            <StatMiniCard label="Active Students" value={stats.activeStudents} change="+8.1%" icon="group" color="blue" />
                            <StatMiniCard label="Notes Generated" value={stats.notesGenerated} change="+22.4%" icon="auto_awesome" color="purple" />
                            <StatMiniCard label="Avg. Score" value={stats.avgScore} change="+3.2%" icon="emoji_events" color="emerald" />
                        </div>

                        {/* Upload + Sales */}
                        <div className="upload-sales-row fade-in-2" style={{ marginBottom: 20 }}>
                            <UploadZone onNoteGenerated={addNote} />
                            <SalesCard />
                        </div>

                        {/* Notes + Chart */}
                        <div className="notes-chart-row fade-in-3">
                            <RecentNotes notes={notes} />
                            <EngagementChart />
                        </div>

                    </div>
                    <Footer />
                </main>

                <AIDock />
            </div>
        </>
    );
}