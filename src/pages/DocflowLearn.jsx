import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

/* ══════════════════════════════════════════════════════════
   DOCFLOW LEARN  —  Full Interactive Dashboard
   • YouTube video lessons (Lesson 1 & 5)
   • Rich notes editor (Lesson 2 & 4)
   • 10-min live quiz (Lesson 3)
   • Real-time stats: total / published / draft / duration
   • Build New Course wizard (3-step)
   • Settings modal (profile/notifications/security/billing)
   • Support modal (ticket form)
   • Upgrade modal (3 plans)
   • Notification panel
   • AI floating bar
══════════════════════════════════════════════════════════ */

// ─── Inject fonts + CSS once ──────────────────────────────
const useInject = () => {
  useEffect(() => {
    const hrefs = [
      "https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&display=swap",
      "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap",
    ];
    hrefs.forEach(href => {
      if (!document.querySelector(`link[href="${href}"]`)) {
        const l = document.createElement("link"); l.rel = "stylesheet"; l.href = href;
        document.head.appendChild(l);
      }
    });
    if (!document.getElementById("dfl-css")) {
      const s = document.createElement("style"); s.id = "dfl-css";
      s.textContent = `
        *{box-sizing:border-box;margin:0;padding:0;}
        html{scroll-behavior:smooth;}
        body{font-family:'DM Sans',sans-serif;background:#edf3ff;color:#1e293b;overflow-x:hidden;}
        .sora{font-family:'Sora',sans-serif;}
        .ms{font-family:'Material Symbols Outlined';font-style:normal;line-height:1;
          font-variation-settings:'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 24;user-select:none;display:inline-block;vertical-align:middle;}
        .msf{font-variation-settings:'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 24;}
        ::-webkit-scrollbar{width:5px;height:5px;}
        ::-webkit-scrollbar-track{background:#dbeafe;}
        ::-webkit-scrollbar-thumb{background:#93c5fd;border-radius:6px;}
        .card{background:#fff;border-radius:18px;border:1px solid rgba(37,99,235,.08);box-shadow:0 2px 12px rgba(37,99,235,.06);}
        .btnp{background:#2563eb;color:#fff;border:none;border-radius:11px;padding:9px 18px;font-weight:700;font-size:.83rem;cursor:pointer;transition:all .2s;font-family:'Sora',sans-serif;display:inline-flex;align-items:center;gap:6px;}
        .btnp:hover{background:#1d4ed8;transform:translateY(-1px);box-shadow:0 6px 18px rgba(37,99,235,.3);}
        .btnp:active{transform:scale(.97);}
        .btng{background:transparent;border:1.5px solid #bfdbfe;color:#2563eb;border-radius:11px;padding:8px 16px;font-weight:600;font-size:.82rem;cursor:pointer;transition:all .2s;font-family:'Sora',sans-serif;display:inline-flex;align-items:center;gap:6px;}
        .btng:hover{background:#eff6ff;border-color:#93c5fd;}
        .inp{width:100%;padding:10px 13px;border:1.5px solid #e2e8f0;border-radius:11px;font-size:.87rem;font-family:'DM Sans',sans-serif;outline:none;background:#fff;color:#1e293b;transition:border .2s;}
        .inp:focus{border-color:#93c5fd;box-shadow:0 0 0 3px rgba(147,197,253,.2);}
        .badge{display:inline-flex;align-items:center;padding:3px 9px;border-radius:100px;font-size:.67rem;font-weight:800;letter-spacing:.5px;text-transform:uppercase;}
        .drag{background:#f8fbff;border:1.5px dashed #bfdbfe;border-radius:13px;padding:12px 14px;cursor:grab;transition:all .2s;user-select:none;display:flex;align-items:center;gap:10px;}
        .drag:hover{border-color:#60a5fa;background:#eff6ff;}
        .drag.dov{border-color:#2563eb;background:#dbeafe;transform:scale(1.01);}
        .pbar{height:7px;border-radius:4px;background:#dbeafe;overflow:hidden;}
        .pbar-f{height:100%;border-radius:4px;background:linear-gradient(90deg,#3b82f6,#60a5fa);transition:width .5s ease;}
        .tabb{padding:7px 15px;border-radius:10px;font-size:.79rem;font-weight:700;cursor:pointer;border:none;font-family:'Sora',sans-serif;transition:all .2s;}
        .tabb.on{background:#2563eb;color:#fff;box-shadow:0 4px 12px rgba(37,99,235,.25);}
        .tabb:not(.on){background:transparent;color:#64748b;}
        .tabb:not(.on):hover{background:#f1f5f9;color:#2563eb;}
        .tog{width:40px;height:22px;border-radius:11px;border:none;cursor:pointer;position:relative;transition:background .2s;flex-shrink:0;}
        .tog .knob{position:absolute;width:16px;height:16px;border-radius:50%;background:#fff;top:3px;transition:left .2s;box-shadow:0 1px 4px rgba(0,0,0,.2);}
        .ovl{position:fixed;inset:0;background:rgba(15,23,42,.45);backdrop-filter:blur(4px);z-index:200;display:flex;align-items:center;justify-content:center;padding:16px;}
        .modal{background:#fff;border-radius:22px;padding:28px;width:min(540px,100%);max-height:90vh;overflow-y:auto;box-shadow:0 24px 80px rgba(15,23,42,.25);position:relative;}
        .npanel{position:fixed;top:60px;right:20px;width:330px;background:#fff;border-radius:18px;border:1px solid #e0ecff;box-shadow:0 16px 48px rgba(37,99,235,.14);z-index:150;overflow:hidden;}
        .qopt{padding:12px 16px;border-radius:13px;border:1.5px solid #e2e8f0;cursor:pointer;font-size:.87rem;transition:all .2s;background:#fff;display:flex;align-items:center;gap:11px;}
        .qopt:hover:not(.sel):not(.cor):not(.wrg){border-color:#93c5fd;background:#f0f9ff;}
        .qopt.sel{border-color:#2563eb;background:#eff6ff;}
        .qopt.cor{border-color:#22c55e;background:#f0fdf4;}
        .qopt.wrg{border-color:#ef4444;background:#fef2f2;}
        .ytwrap{position:relative;padding-bottom:56.25%;height:0;border-radius:14px;overflow:hidden;background:#000;}
        .ytwrap iframe{position:absolute;inset:0;width:100%;height:100%;border:0;}
        .nta{width:100%;min-height:200px;padding:13px;border:1.5px solid #e2e8f0;border-radius:12px;font-size:.87rem;font-family:'DM Sans',sans-serif;resize:vertical;outline:none;background:#fafcff;color:#1e293b;line-height:1.75;transition:border .2s;}
        .nta:focus{border-color:#93c5fd;box-shadow:0 0 0 3px rgba(147,197,253,.2);}
        .sli{animation:sli .35s ease both;}
        @keyframes sli{from{opacity:0;transform:translateY(13px);}to{opacity:1;transform:translateY(0);}}
        .fad{animation:fad .22s ease both;}
        @keyframes fad{from{opacity:0;}to{opacity:1;}}
        @keyframes spin{to{transform:rotate(360deg);}}
        @media(max-width:900px){
          .sb-desk{display:none!important;}
          .main-ml{margin-left:0!important;}
          .topbar-w{width:100%!important;}
          .sg4{grid-template-columns:1fr 1fr!important;}
          .g2col{grid-template-columns:1fr!important;}
        }
      `;
      document.head.appendChild(s);
    }
  }, []);
};

// ─── Icon component ───────────────────────────────────────
const Ic = ({ n, fill = false, size = 20, col, style: st = {}, className = "" }) => (
  <span className={`ms${fill ? " msf" : ""} ${className}`} style={{ fontSize: size, color: col, ...st }}>{n}</span>
);

// ─── Toggle ───────────────────────────────────────────────
const Tog = ({ on, setOn }) => (
  <button className="tog" onClick={() => setOn(!on)} style={{ background: on ? "#2563eb" : "#e2e8f0" }}>
    <span className="knob" style={{ left: on ? 21 : 3 }} />
  </button>
);

// ─── Toggle row for settings ──────────────────────────────
const TRow = ({ label, defaultOn = false }) => {
  const [on, setOn] = useState(defaultOn);
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #f1f5f9" }}>
      <span style={{ fontSize: ".87rem", color: "#334155" }}>{label}</span>
      <Tog on={on} setOn={setOn} />
    </div>
  );
};

/* ══════════════════════════════════════════════════════════
   LESSON DATA  (5 lessons exactly as specified)
══════════════════════════════════════════════════════════ */
const LESSONS_INIT = [
  {
    id: 1, title: "Introduction to DocFlow", type: "video", durationMin: 12, status: "published",
    youtubeId: "UHzlvUOzJsk",
    desc: "Welcome to DocFlow! Discover what DocFlow is, why it was built, and how it transforms document management for businesses of all sizes using AI-powered automation.",
    notes: "",
  },
  {
    id: 2, title: "Document Upload & AI Extraction", type: "notes", durationMin: 18, status: "published",
    content: `📄  Document Upload & AI Extraction — Study Notes

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1.  UPLOADING DOCUMENTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  • Upload via mobile app, web app, or email
  • Supported formats: PDF, JPG, PNG, DOCX
  • Automatic document cropping on upload
  • AI detects document type automatically
  • Option to split and merge multi-page documents

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
2.  AI DATA EXTRACTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  • DocFlow's in-house AI reads and extracts all fields
  • Trained on thousands of Slovak and Czech invoices
  • Key fields extracted automatically:
       ▸ Supplier name & address
       ▸ Invoice number
       ▸ Total amount & VAT
       ▸ Due date
       ▸ Line items (for inventory)
  • Confidence score shown per extraction

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
3.  AI LEARNING & ADAPTING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  • AI immediately learns from each new document
  • You can correct extractions — AI remembers
  • Set a reliability threshold (e.g. 90%)
  • Below threshold → human review is requested

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
4.  BEST PRACTICES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ✓ Upload high-resolution scans for best accuracy
  ✓ Review AI extractions before approving
  ✓ Use labels/tags to organise document categories
  ✓ Enable automation once threshold is reached`,
    notes: "",
  },
  {
    id: 3, title: "Digital Archive & Search", type: "quiz", durationMin: 10, status: "published",
    desc: "Test your knowledge of DocFlow's Digital Archive feature — storage, search, backups, and organisation.",
    notes: "",
  },
  {
    id: 4, title: "Approval Workflows", type: "notes", durationMin: 20, status: "published",
    content: `✅  Approval Workflows — Study Notes

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1.  WHAT IS AN APPROVAL WORKFLOW?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  • A defined sequence of review steps before a document
    is finalised — no more physical signing!
  • Approve digitally via app or web, anytime, anywhere

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
2.  HOW THE FLOW WORKS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Step 1 → Document uploaded / received
  Step 2 → Assigned to responsible person(s)
  Step 3 → Reviewer approves or requests changes
  Step 4 → Document marked "Approved" and archived
  Step 5 → Full audit trail recorded in change log

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
3.  KEY FEATURES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  • Multi-step approval chains supported
  • Assign to specific users or job roles
  • Mobile approval via DocFlow app
  • Email + push notifications for pending approvals
  • All approval info stored in change history

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
4.  COMMON USE CASES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ✓ Invoice approval before payment
  ✓ Contract sign-off workflow
  ✓ Purchase order authorisation
  ✓ HR document review process
  ✓ Regulatory compliance documents`,
    notes: "",
  },
  {
    id: 5, title: "Business Analytics Dashboard", type: "video", durationMin: 15, status: "published",
    youtubeId: "B9GiMBVB2-s",
    desc: "Explore DocFlow's Business Analytics Dashboard — understand revenue, expenses, VAT liability, and unpaid invoices at a glance with real-time financial intelligence.",
    notes: "",
  },
];

// Quiz questions for Lesson 3 — Digital Archive & Search
const QUIZ_QS = [
  { q: "What is the primary purpose of DocFlow's Digital Archive?", opts: ["Store only invoices", "Secure cloud storage & quick search of all company documents", "Replace email attachments", "Print documents automatically"], ans: 1 },
  { q: "Which feature allows you to find any document instantly in DocFlow?", opts: ["Duplicate Detection", "Business Analysis", "Keyword Search in Digital Archive", "QR Code Generator"], ans: 2 },
  { q: "How long are documents archived in DocFlow's cloud?", opts: ["1 year", "5 years", "10 years", "Forever"], ans: 3 },
  { q: "What backup option does DocFlow offer besides cloud storage?", opts: ["USB drive", "FTP server backup", "Email backup", "DVD burn"], ans: 1 },
  { q: "Which document types can be stored in DocFlow's archive?", opts: ["Only PDFs", "Only invoices", "Invoices, orders, contracts, receipts and more", "Only scanned images"], ans: 2 },
  { q: "Documents in the archive are organised into:", opts: ["Alphabetical list only", "Categories / folders", "Date folders only", "By file size"], ans: 1 },
  { q: "What happens during an FTP backup in DocFlow?", opts: ["Files are emailed", "Documents are copied to your own FTP server automatically", "Files are printed", "Files are deleted"], ans: 1 },
  { q: "The Digital Archive search is powered by:", opts: ["Manual tagging only", "Google Search", "Full-text and keyword search with AI indexing", "File name only"], ans: 2 },
  { q: "Can you access DocFlow's archive from a mobile device?", opts: ["No, desktop only", "Yes, via the mobile app", "Only with VPN", "Only on Windows"], ans: 1 },
  { q: "The change log in the archive records:", opts: ["Only deletions", "All changes, including who made them and when", "Only approvals", "Only uploads"], ans: 1 },
];

const TYPE_BG = { video: "#dbeafe", notes: "#dcfce7", quiz: "#fef9c3" };
const TYPE_COL = { video: "#1d4ed8", notes: "#166534", quiz: "#854d0e" };
const TYPE_IC = { video: "play_circle", notes: "menu_book", quiz: "quiz" };

/* ══════════════════════════════════════════════════════════
   LIVE STAT CARDS (fetch from workspace API)
══════════════════════════════════════════════════════════ */
const StatCards = ({ lessons }) => {
  const [ws, setWs] = useState({ docsProcessed: 0, quizzesGenerated: 0, summariesCreated: 0 });

  useEffect(() => {
    fetch("/api/workspace")
      .then(res => res.json())
      .then(data => setWs(data))
      .catch(e => console.error("Failed to fetch stats", e));
  }, []);

  const total = lessons.length;
  const pub = lessons.filter(l => l.status === "published").length;
  const draft = total - pub;
  const stats = [
    { label: "Docs Processed", value: ws.docsProcessed, ic: "description", bg: "#eff6ff", col: "#2563eb" },
    { label: "Quizzes Done", value: ws.quizzesGenerated, ic: "quiz", bg: "#f0fdf4", col: "#16a34a" },
    { label: "Summaries", value: ws.summariesCreated, ic: "summarize", bg: "#fefce8", col: "#b45309" },
    { label: "Total Lessons", value: total, ic: "layers", bg: "#fdf4ff", col: "#9333ea" },
  ];
  return (
    <div className="sg4" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 22 }}>
      {stats.map(s => (
        <div key={s.label} className="card" style={{ padding: "15px 17px", display: "flex", alignItems: "center", gap: 11 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Ic n={s.ic} fill size={19} col={s.col} />
          </div>
          <div>
            <div className="sora" style={{ fontSize: "1.3rem", fontWeight: 800, color: "#1e293b", lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: ".69rem", color: "#94a3b8", fontWeight: 600, marginTop: 2 }}>{s.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

/* ══════════════════════════════════════════════════════════
   LESSON VIEWER MODAL
══════════════════════════════════════════════════════════ */
const LessonViewer = ({ lesson, onClose }) => {
  const [tab, setTab] = useState(lesson.type === "video" ? "video" : lesson.type === "quiz" ? "quiz" : "notes");
  const [myNotes, setMyNotes] = useState(lesson.notes || "");
  const [saved, setSaved] = useState(false);
  const [qs, setQs] = useState({ idx: 0, sel: null, answered: false, score: 0, done: false });

  const saveNotes = () => { setSaved(true); setTimeout(() => setSaved(false), 2200); };

  const qq = QUIZ_QS[qs.idx];
  const selectOpt = (i) => {
    if (qs.answered) return;
    setQs(p => ({ ...p, sel: i, answered: true, score: p.score + (i === qq.ans ? 1 : 0) }));
  };
  const nextQ = () => {
    if (qs.idx + 1 >= QUIZ_QS.length) { 
      setQs(p => ({ ...p, done: true })); 
      /* Increment Workspace Quizzes Generated */
      fetch("/api/workspace/increment/quizzes", { method: "POST" }).catch(e => console.error("Stat update failed", e));
      return; 
    }
    setQs(p => ({ ...p, idx: p.idx + 1, sel: null, answered: false }));
  };
  const restartQ = () => setQs({ idx: 0, sel: null, answered: false, score: 0, done: false });

  const pct = Math.round((qs.score / QUIZ_QS.length) * 100);

  return (
    <div className="ovl fad" onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: "#fff", borderRadius: 22, width: "min(800px,97vw)", maxHeight: "92vh", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 24px 80px rgba(15,23,42,.28)" }}>
        {/* Header */}
        <div style={{ padding: "15px 22px", borderBottom: "1px solid #e0ecff", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: TYPE_BG[lesson.type], display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Ic n={TYPE_IC[lesson.type]} fill size={18} col={TYPE_COL[lesson.type]} />
            </div>
            <div>
              <div className="sora" style={{ fontWeight: 700, fontSize: ".9rem", color: "#1e293b" }}>{lesson.title}</div>
              <div style={{ fontSize: ".7rem", color: "#94a3b8" }}>
                {lesson.type === "video" ? "YouTube Video" : lesson.type === "quiz" ? "Interactive Quiz — 10 min" : "Study Notes"} · {lesson.durationMin} min
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {lesson.type === "video" && <>
              <button className={`tabb${tab === "video" ? " on" : ""}`} onClick={() => setTab("video")}>Video</button>
              <button className={`tabb${tab === "notes" ? " on" : ""}`} onClick={() => setTab("notes")}>My Notes</button>
            </>}
            {lesson.type === "notes" && <>
              <button className={`tabb${tab === "notes" ? " on" : ""}`} onClick={() => setTab("notes")}>Notes</button>
              <button className={`tabb${tab === "mynotes" ? " on" : ""}`} onClick={() => setTab("mynotes")}>My Notes</button>
            </>}
            {lesson.type === "quiz" && <button className={`tabb${tab === "quiz" ? " on" : ""}`} onClick={() => setTab("quiz")}>Quiz</button>}
            <button onClick={onClose} style={{ background: "#f1f5f9", border: "none", borderRadius: 9, padding: "7px 10px", cursor: "pointer", color: "#64748b", marginLeft: 4 }}>
              <Ic n="close" size={18} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: "22px 24px", overflowY: "auto", flex: 1 }}>
          {/* ─── VIDEO ─── */}
          {tab === "video" && lesson.youtubeId && (
            <div className="fad">
              <div className="ytwrap" style={{ marginBottom: 18 }}>
                <iframe src={`https://www.youtube.com/embed/${lesson.youtubeId}?rel=0&modestbranding=1`}
                  title={lesson.title} allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" />
              </div>
              <div className="card" style={{ padding: "15px 19px" }}>
                <div className="sora" style={{ fontWeight: 700, fontSize: ".88rem", marginBottom: 6 }}>{lesson.title}</div>
                <p style={{ fontSize: ".83rem", color: "#64748b", lineHeight: 1.72 }}>{lesson.desc}</p>
              </div>
            </div>
          )}

          {/* ─── COURSE NOTES (read) ─── */}
          {tab === "notes" && lesson.type === "notes" && (
            <div className="fad">
              <div className="card" style={{ padding: "18px 22px", background: "#f8fbff" }}>
                <pre style={{ fontSize: ".86rem", color: "#334155", lineHeight: 1.8, whiteSpace: "pre-wrap", fontFamily: "'DM Sans',sans-serif" }}>{lesson.content}</pre>
              </div>
            </div>
          )}

          {/* ─── MY NOTES (editable) ─── */}
          {(tab === "notes" && lesson.type === "video") || tab === "mynotes" ? (
            <div className="fad">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <div className="sora" style={{ fontWeight: 700, fontSize: ".9rem" }}>My Personal Notes</div>
                {saved && <span style={{ fontSize: ".74rem", color: "#16a34a", fontWeight: 700 }}>✓ Saved!</span>}
              </div>
              <textarea className="nta" value={myNotes} onChange={e => setMyNotes(e.target.value)}
                placeholder={`Write your notes for "${lesson.title}"…\n\nTip: use bullet points for key takeaways`} />
              <div style={{ display: "flex", gap: 8, marginTop: 11 }}>
                <button className="btnp" onClick={saveNotes}><Ic n="save" size={15} />Save</button>
                <button className="btng" onClick={() => setMyNotes("")}><Ic n="delete" size={14} />Clear</button>
                <button className="btng" onClick={() => navigator.clipboard?.writeText(myNotes)}><Ic n="content_copy" size={14} />Copy</button>
              </div>
            </div>
          ) : null}

          {/* ─── QUIZ ─── */}
          {tab === "quiz" && (
            <div className="fad">
              {qs.done ? (
                <div style={{ textAlign: "center", padding: "28px 0" }}>
                  <div style={{ fontSize: "3.5rem", marginBottom: 12 }}>{pct >= 70 ? "🎉" : "📚"}</div>
                  <div className="sora" style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: 6 }}>{pct >= 70 ? "Excellent Work!" : "Keep Studying!"}</div>
                  <div style={{ fontSize: "3rem", fontWeight: 800, color: pct >= 70 ? "#16a34a" : "#dc2626", fontFamily: "Sora", marginBottom: 6 }}>{qs.score}/{QUIZ_QS.length}</div>
                  <p style={{ color: "#64748b", marginBottom: 22 }}>{pct}% correct · Digital Archive Quiz — 10 min</p>
                  <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                    <button className="btnp" onClick={restartQ}><Ic n="refresh" size={15} />Retake</button>
                    <button className="btng" onClick={onClose}><Ic n="check" size={15} />Done</button>
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                    <span className="badge" style={{ background: "#dbeafe", color: "#1d4ed8" }}>Digital Archive & Search Quiz</span>
                    <span style={{ fontSize: ".77rem", color: "#94a3b8", fontWeight: 600 }}>Q {qs.idx + 1} / {QUIZ_QS.length}</span>
                  </div>
                  <div className="pbar" style={{ marginBottom: 20 }}>
                    <div className="pbar-f" style={{ width: `${(qs.idx / QUIZ_QS.length) * 100}%` }} />
                  </div>
                  <div style={{ fontSize: "1rem", fontWeight: 700, color: "#1e293b", marginBottom: 20, lineHeight: 1.55 }}>{qq.q}</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 9, marginBottom: 16 }}>
                    {qq.opts.map((opt, i) => {
                      let cls = "qopt";
                      if (qs.answered && i === qq.ans) cls += " cor";
                      else if (qs.answered && i === qs.sel && i !== qq.ans) cls += " wrg";
                      else if (!qs.answered && i === qs.sel) cls += " sel";
                      return (
                        <div key={i} className={cls} onClick={() => selectOpt(i)}>
                          <span style={{ width: 27, height: 27, borderRadius: "50%", background: "rgba(37,99,235,.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: ".74rem", fontWeight: 800, flexShrink: 0, fontFamily: "Sora" }}>{String.fromCharCode(65 + i)}</span>
                          <span style={{ flex: 1 }}>{opt}</span>
                          {qs.answered && i === qq.ans && <Ic n="check_circle" fill size={17} col="#22c55e" style={{ marginLeft: "auto" }} />}
                          {qs.answered && i === qs.sel && i !== qq.ans && <Ic n="cancel" fill size={17} col="#ef4444" style={{ marginLeft: "auto" }} />}
                        </div>
                      );
                    })}
                  </div>
                  {qs.answered && (
                    <div className="fad">
                      <div style={{ background: qs.sel === qq.ans ? "#f0fdf4" : "#fff7ed", border: `1px solid ${qs.sel === qq.ans ? "#bbf7d0" : "#fed7aa"}`, borderRadius: 12, padding: "12px 16px", marginBottom: 13 }}>
                        <div style={{ fontWeight: 700, fontSize: ".86rem", color: qs.sel === qq.ans ? "#166534" : "#9a3412" }}>
                          {qs.sel === qq.ans ? "✓ Correct!" : `✗ Correct answer: "${qq.opts[qq.ans]}"`}
                        </div>
                      </div>
                      <button className="btnp" onClick={nextQ} style={{ width: "100%" }}>
                        {qs.idx + 1 >= QUIZ_QS.length ? "See Results" : "Next Question →"}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════
   BUILD NEW COURSE MODAL (3-step wizard)
══════════════════════════════════════════════════════════ */
const BuildCourseModal = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const [info, setInfo] = useState({ title: "", category: "Technology", level: "Beginner", desc: "" });
  const [chapters, setChapters] = useState([{ id: 1, title: "Chapter 1: Introduction" }]);
  const [chInput, setChInput] = useState("");
  const [created, setCreated] = useState(false);

  const addCh = () => {
    if (!chInput.trim()) return;
    setChapters(p => [...p, { id: Date.now(), title: chInput }]);
    setChInput("");
  };

  if (created) return (
    <div className="ovl fad" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ textAlign: "center" }}>
        <Ic n="check_circle" fill size={56} col="#22c55e" style={{ display: "block", margin: "0 auto 16px" }} />
        <div className="sora" style={{ fontWeight: 800, fontSize: "1.2rem", marginBottom: 8 }}>Course Created!</div>
        <p style={{ color: "#64748b", fontSize: ".87rem", marginBottom: 22 }}>"{info.title}" has been created with {chapters.length} chapter(s). You can now add lessons in the Course Builder.</p>
        <button className="btnp" onClick={onClose}><Ic n="check" size={15} />Go to Builder</button>
      </div>
    </div>
  );

  return (
    <div className="ovl fad" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
          <div>
            <div className="sora" style={{ fontWeight: 800, fontSize: "1.15rem", color: "#1e293b" }}>Build New Course</div>
            <div style={{ fontSize: ".75rem", color: "#94a3b8", marginTop: 2 }}>Step {step} of 3</div>
          </div>
          <button onClick={onClose} style={{ background: "#f1f5f9", border: "none", borderRadius: 9, padding: "7px 10px", cursor: "pointer", color: "#64748b" }}><Ic n="close" size={18} /></button>
        </div>
        <div style={{ display: "flex", gap: 8, marginBottom: 26 }}>
          {["Course Info", "Chapters", "Settings"].map((label, i) => (
            <div key={label} style={{ flex: 1 }}>
              <div style={{ height: 4, borderRadius: 2, background: i + 1 <= step ? "#2563eb" : "#e2e8f0", marginBottom: 5, transition: "background .3s" }} />
              <div style={{ fontSize: ".67rem", fontWeight: 700, color: i + 1 <= step ? "#2563eb" : "#94a3b8", textAlign: "center" }}>{label}</div>
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className="fad" style={{ display: "flex", flexDirection: "column", gap: 13 }}>
            <div>
              <label style={{ fontSize: ".72rem", fontWeight: 700, color: "#64748b", display: "block", marginBottom: 5, textTransform: "uppercase" }}>Course Title *</label>
              <input className="inp" placeholder="e.g. DocFlow Mastery Program" value={info.title} onChange={e => setInfo(p => ({ ...p, title: e.target.value }))} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 11 }}>
              <div>
                <label style={{ fontSize: ".72rem", fontWeight: 700, color: "#64748b", display: "block", marginBottom: 5, textTransform: "uppercase" }}>Category</label>
                <select className="inp" value={info.category} onChange={e => setInfo(p => ({ ...p, category: e.target.value }))}>
                  {["Technology", "Business", "Finance", "Design", "Marketing", "Operations"].map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: ".72rem", fontWeight: 700, color: "#64748b", display: "block", marginBottom: 5, textTransform: "uppercase" }}>Level</label>
                <select className="inp" value={info.level} onChange={e => setInfo(p => ({ ...p, level: e.target.value }))}>
                  {["Beginner", "Intermediate", "Advanced"].map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label style={{ fontSize: ".72rem", fontWeight: 700, color: "#64748b", display: "block", marginBottom: 5, textTransform: "uppercase" }}>Description</label>
              <textarea className="inp" rows={3} style={{ resize: "none" }} placeholder="What will students learn?" value={info.desc} onChange={e => setInfo(p => ({ ...p, desc: e.target.value }))} />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="fad">
            <div style={{ display: "flex", gap: 8, marginBottom: 13 }}>
              <input className="inp" placeholder="Chapter title…" value={chInput} onChange={e => setChInput(e.target.value)} onKeyDown={e => e.key === "Enter" && addCh()} />
              <button className="btnp" onClick={addCh} style={{ whiteSpace: "nowrap" }}><Ic n="add" size={15} />Add</button>
            </div>
            {chapters.length === 0 ? (
              <div style={{ textAlign: "center", padding: "30px 0", color: "#94a3b8" }}>
                <Ic n="folder_open" size={42} style={{ display: "block", margin: "0 auto 10px" }} />
                <div style={{ fontSize: ".84rem" }}>No chapters yet. Add your first chapter above.</div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {chapters.map((ch, i) => (
                  <div key={ch.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 14px", background: "#f8fbff", borderRadius: 12, border: "1px solid #e0ecff" }}>
                    <div style={{ width: 27, height: 27, borderRadius: 8, background: "#dbeafe", display: "flex", alignItems: "center", justifyContent: "center", fontSize: ".73rem", fontWeight: 800, color: "#2563eb", flexShrink: 0, fontFamily: "Sora" }}>{i + 1}</div>
                    <span style={{ flex: 1, fontSize: ".87rem", fontWeight: 600, color: "#1e293b" }}>{ch.title}</span>
                    <button onClick={() => setChapters(p => p.filter(c => c.id !== ch.id))} style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", opacity: .7 }}><Ic n="delete" size={15} /></button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="fad">
            {[["Require enrollment approval", true], ["Issue certificate on completion", true], ["Enable discussion forum", false], ["Allow student reviews", true], ["Public (visible in catalog)", false], ["Send welcome email on enroll", true]].map(([l, d]) => <TRow key={l} label={l} defaultOn={d} />)}
          </div>
        )}

        <div style={{ display: "flex", gap: 10, justifyContent: "space-between", marginTop: 24 }}>
          <button className="btng" onClick={() => step > 1 ? setStep(s => s - 1) : onClose()}>
            {step > 1 ? <><Ic n="arrow_back" size={14} />Back</> : "Cancel"}
          </button>
          {step < 3
            ? <button className="btnp" onClick={() => setStep(s => s + 1)} disabled={step === 1 && !info.title.trim()} style={{ opacity: step === 1 && !info.title.trim() ? .5 : 1 }}>Next <Ic n="arrow_forward" size={14} /></button>
            : <button className="btnp" onClick={async () => {
                const courseData = {
                  title: info.title,
                  category: info.category,
                  level: info.level,
                  description: info.desc,
                  lessons: chapters.length,
                  instructor: "Admin User",
                  progress: 0
                };
                try {
                  const res = await fetch("/api/courses", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(courseData)
                  });
                  if (res.ok) setCreated(true);
                  else alert("Failed to create course on server");
                } catch (e) { alert("Network error"); }
              }}><Ic n="rocket_launch" size={15} />Create Course</button>
          }
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════
   UPGRADE MODAL
══════════════════════════════════════════════════════════ */
const UpgradeModal = ({ onClose }) => {
  const [upgraded, setUpgraded] = useState(false);
  const [sel, setSel] = useState("pro");
  const plans = [
    { id: "starter", name: "Starter", price: "€29", period: "/mo", col: "#64748b", feats: ["200 documents/month", "5 active courses", "Basic analytics", "Email support"] },
    { id: "pro", name: "Professional", price: "€79", period: "/mo", col: "#2563eb", popular: true, feats: ["Unlimited documents", "Unlimited courses", "Smart Assessments AI", "Certification Engine", "Priority support", "Advanced analytics"] },
    { id: "ent", name: "Enterprise", price: "Custom", period: "", col: "#7c3aed", feats: ["Everything in Pro", "Multi-company", "Dedicated manager", "Custom integrations & API", "SLA guarantee"] },
  ];

  if (upgraded) return (
    <div className="ovl fad" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ textAlign: "center" }}>
        <div style={{ width: 64, height: 64, background: "#dcfce7", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
          <Ic n="check_circle" fill size={32} col="#16a34a" />
        </div>
        <div className="sora" style={{ fontWeight: 800, fontSize: "1.3rem", marginBottom: 8 }}>Account Upgraded!</div>
        <p style={{ color: "#64748b", fontSize: ".88rem", marginBottom: 24 }}>You are now on the **{plans.find(p => p.id === sel)?.name}** plan. Enjoy your new features!</p>
        <button className="btnp" onClick={onClose}>Back to Dashboard</button>
      </div>
    </div>
  );

  return (
    <div className="ovl fad" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 640 }}>
        <button onClick={onClose} style={{ position: "absolute", top: 20, right: 20, background: "#f1f5f9", border: "none", borderRadius: 9, padding: "7px 10px", cursor: "pointer", color: "#64748b" }}><Ic n="close" size={18} /></button>
        <div style={{ textAlign: "center", marginBottom: 26 }}>
          <Ic n="workspace_premium" fill size={42} col="#f59e0b" style={{ display: "block", margin: "0 auto 10px" }} />
          <div className="sora" style={{ fontWeight: 800, fontSize: "1.3rem", marginBottom: 4 }}>Upgrade Your Plan</div>
          <div style={{ fontSize: ".85rem", color: "#64748b" }}>Scale your document workflow with AI-powered engine</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 24 }}>
          {plans.map(p => (
            <div key={p.id} onClick={() => setSel(p.id)} style={{ border: `2px solid ${sel === p.id ? p.col : "#e2e8f0"}`, borderRadius: 16, padding: "18px 14px", cursor: "pointer", transition: "all .2s", background: sel === p.id ? p.col + "08" : "#fff", position: "relative", boxShadow: sel === p.id ? `0 8px 20px ${p.col}15` : "none" }}>
              {p.popular && <div style={{ position: "absolute", top: -11, left: "50%", transform: "translateX(-50%)", background: "#f59e0b", color: "#fff", fontSize: ".62rem", fontWeight: 800, padding: "3px 10px", borderRadius: 100, whiteSpace: "nowrap" }}>Most Popular</div>}
              <div className="sora" style={{ fontWeight: 800, fontSize: ".72rem", color: p.col, textTransform: "uppercase", letterSpacing: ".5px", marginBottom: 5 }}>{p.name}</div>
              <div className="sora" style={{ fontSize: "1.4rem", fontWeight: 800, color: "#1e293b", lineHeight: 1 }}>{p.price}</div>
              <div style={{ fontSize: ".68rem", color: "#94a3b8", marginBottom: 14 }}>{p.period}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                {p.feats.map(f => (
                  <div key={f} style={{ display: "flex", gap: 6, alignItems: "flex-start" }}>
                    <Ic n="check" size={13} col={p.col} style={{ flexShrink: 0, marginTop: 1 }} />
                    <span style={{ fontSize: ".69rem", color: "#475569", lineHeight: 1.3 }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <button className="btnp" onClick={() => setUpgraded(true)} style={{ width: "100%", padding: 14, fontSize: ".9rem", borderRadius: 14, justifyContent: "center" }}>
          Activate {plans.find(p => p.id === sel)?.name} Plan <Ic n="arrow_forward" size={16} />
        </button>
        <p style={{ textAlign: "center", fontSize: ".72rem", color: "#94a3b8", marginTop: 10 }}>14-day free trial · Cancel anytime · Secured by Stripe</p>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════
   SETTINGS MODAL
══════════════════════════════════════════════════════════ */
const SettingsModal = ({ onClose }) => {
  const [tab, setTab] = useState("profile");
  return (
    <div className="ovl fad" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div className="sora" style={{ fontWeight: 800, fontSize: "1.1rem" }}>Settings</div>
          <button onClick={onClose} style={{ background: "#f1f5f9", border: "none", borderRadius: 9, padding: "7px 10px", cursor: "pointer", color: "#64748b" }}><Ic n="close" size={18} /></button>
        </div>
        <div style={{ display: "flex", gap: 5, marginBottom: 22 }}>
          {["profile", "notifications", "security", "billing"].map(t => (
            <button key={t} className={`tabb${tab === t ? " on" : ""}`} style={{ fontSize: ".74rem" }} onClick={() => setTab(t)}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
        {tab === "profile" && (
          <div className="fad" style={{ display: "flex", flexDirection: "column", gap: 13 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "15px 18px", background: "rgba(37,99,235,.04)", borderRadius: 16, border: "1px solid rgba(37,99,235,.08)" }}>
              <div style={{ width: 54, height: 54, borderRadius: "50%", background: "linear-gradient(135deg,#2563eb,#60a5fa)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: "1.1rem", fontFamily: "Sora", boxShadow: "0 4px 12px rgba(37,99,235,.2)" }}>AD</div>
              <div>
                <div style={{ fontWeight: 800, fontSize: ".95rem", color: "#1e293b" }}>Administrator Account</div>
                <div style={{ fontSize: ".8rem", color: "#64748b" }}>admin@docflow.ai · Slovak Republic</div>
              </div>
              <button className="btng" style={{ marginLeft: "auto", padding: "6px 14px", fontSize: ".75rem", borderRadius: 10 }}>Change Avatar</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[["First Name", "Admin"], ["Last Name", "User"], ["Email Address", "admin@docflow.ai"], ["Phone Number", "+421 900 000 000"]].map(([l, v]) => (
                <div key={l}>
                  <label style={{ fontSize: ".7rem", fontWeight: 700, color: "#94a3b8", display: "block", marginBottom: 5, textTransform: "uppercase" }}>{l}</label>
                  <input className="inp" defaultValue={v} style={{ fontSize: ".82rem" }} />
                </div>
              ))}
            </div>
            <div>
              <label style={{ fontSize: ".7rem", fontWeight: 700, color: "#94a3b8", display: "block", marginBottom: 5, textTransform: "uppercase" }}>Organization Name</label>
              <input className="inp" defaultValue="DocFlow Global Solutions s.r.o." style={{ fontSize: ".82rem" }} />
            </div>
            <button className="btnp" style={{ justifyContent: "center", marginTop: 5 }}><Ic n="save" size={16} />Update Profile</button>
          </div>
        )}
        {tab === "notifications" && (
          <div className="fad">
            <div style={{ fontSize: ".75rem", color: "#94a3b8", fontWeight: 700, marginBottom: 15, textTransform: "uppercase" }}>System Notifications</div>
            {[["New course enrollments", true], ["AI content generation ready", true], ["Student quiz submissions", true], ["Weekly platform analytics", false], ["Security & Login alerts", true], ["Maintenance notifications", true]].map(([l, d]) => <TRow key={l} label={l} defaultOn={d} />)}
          </div>
        )}
        {tab === "security" && (
          <div className="fad" style={{ display: "flex", flexDirection: "column", gap: 13 }}>
            <div style={{ padding: "12px 14px", background: "#fef2f2", border: "1px solid #fee2e2", borderRadius: 12, marginBottom: 5 }}>
              <div style={{ display: "flex", gap: 8, alignItems: "center", color: "#991b1b" }}>
                <Ic n="warning" size={16} />
                <span style={{ fontSize: ".75rem", fontWeight: 700 }}>Password expires in 12 days</span>
              </div>
            </div>
            {[["Current Password", "••••••••"], ["New Password", ""], ["Confirm New Password", ""]].map(([l, p]) => (
              <div key={l}>
                <label style={{ fontSize: ".7rem", fontWeight: 700, color: "#94a3b8", display: "block", marginBottom: 5, textTransform: "uppercase" }}>{l}</label>
                <input type="password" className="inp" placeholder={p} style={{ fontSize: ".82rem" }} />
              </div>
            ))}
            <button className="btnp" style={{ justifyContent: "center" }}><Ic n="lock_reset" size={16} />Change Password</button>
          </div>
        )}
        {tab === "billing" && (
          <div className="fad">
            <div style={{ background: "linear-gradient(135deg,#1e293b,#334155)", borderRadius: 16, padding: "20px", color: "#fff", marginBottom: 18, position: "relative", overflow: "hidden" }}>
              <Ic n="account_balance_wallet" size={80} col="rgba(255,255,255,.05)" style={{ position: "absolute", right: -10, bottom: -10 }} />
              <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div className="sora" style={{ fontWeight: 800, fontSize: "1rem" }}>Professional Plan</div>
                    <div style={{ fontSize: ".75rem", opacity: .7, marginTop: 2 }}>Next billing: March 12, 2025</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div className="sora" style={{ fontWeight: 800, fontSize: "1.4rem" }}>€79.00</div>
                    <div style={{ fontSize: ".65rem", opacity: .7 }}>per month</div>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ fontSize: ".75rem", color: "#94a3b8", fontWeight: 700, marginBottom: 12, textTransform: "uppercase" }}>Recent Invoices</div>
            {[
              { id: "INV-2025-002", d: "Feb 12, 2025", a: "€79.00", s: "Paid" },
              { id: "INV-2025-001", d: "Jan 12, 2025", a: "€79.00", s: "Paid" }
            ].map(b => (
              <div key={b.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: "#fff", borderRadius: 14, border: "1px solid #f1f5f9", marginBottom: 8, transition: "all .2s" }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "#f8fbff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Ic n="receipt_long" size={18} col="#2563eb" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: ".82rem", color: "#1e293b" }}>{b.id}</div>
                  <div style={{ fontSize: ".72rem", color: "#94a3b8" }}>{b.d}</div>
                </div>
                <div style={{ textAlign: "right", marginRight: 10 }}>
                  <div style={{ fontWeight: 800, fontSize: ".82rem", color: "#1e293b" }}>{b.a}</div>
                  <div style={{ fontSize: ".65rem", color: "#16a34a", fontWeight: 800 }}>{b.s}</div>
                </div>
                <button className="btng" style={{ padding: "5px 10px", fontSize: ".7rem", borderRadius: 8 }}>View</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const SupportModal = ({ onClose }) => {
  const [form, setForm] = useState({ subject: "", cat: "Technical", priority: "Medium", msg: "" });
  const [sent, setSent] = useState(false);
  const [qTab, setQTab] = useState("general");
  const faqs = {
    general: [
      { q: "How do I create a new course?", a: "Click the 'Build New Course' button in the sidebar to start the 3-step wizard." },
      { q: "Is DocFlow Learn included in my plan?", a: "Standard plans include up to 5 courses. Pro plans have unlimited access." }
    ],
    technical: [
      { q: "Which browsers are supported?", a: "We support the latest versions of Chrome, Safari, and Edge." },
      { q: "How do I reset my API key?", a: "Go to Settings > Security to regenerate your API access tokens." }
    ]
  };
  const submit = () => { if (!form.subject.trim() || !form.msg.trim()) return; setSent(true); };
  if (sent) return (
    <div className="ovl fad" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ textAlign: "center" }}>
        <Ic n="check_circle" fill size={54} col="#22c55e" style={{ display: "block", margin: "0 auto 14px" }} />
        <div className="sora" style={{ fontWeight: 800, fontSize: "1.1rem", marginBottom: 8 }}>Ticket Submitted!</div>
        <p style={{ color: "#64748b", fontSize: ".87rem", marginBottom: 20 }}>Our support team will respond within 2 business hours via email.</p>
        <button className="btnp" onClick={onClose}>Close Support</button>
      </div>
    </div>
  );
  return (
    <div className="ovl fad" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 640 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
          <div className="sora" style={{ fontWeight: 800, fontSize: "1.15rem" }}>Help & Support</div>
          <button onClick={onClose} style={{ background: "#f1f5f9", border: "none", borderRadius: 9, padding: "7px 10px", cursor: "pointer", color: "#64748b" }}><Ic n="close" size={18} /></button>
        </div>
        <div style={{ marginBottom: 26 }}>
          <div style={{ fontSize: ".74rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: ".5px", marginBottom: 12 }}>Frequently Asked Questions</div>
          <div style={{ display: "flex", gap: 5, marginBottom: 15 }}>
            {["general", "technical"].map(t => (
              <button key={t} className={`tabb${qTab === t ? " on" : ""}`} style={{ fontSize: ".73rem", padding: "5px 12px" }} onClick={() => setQTab(t)}>
                {t.charAt(0).toUpperCase() + t.slice(1)} Issues
              </button>
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {faqs[qTab].map((f, i) => (
              <div key={i} style={{ background: "#f8fbff", border: "1px solid #e2e8f0", borderRadius: 12, padding: "12px 14px" }}>
                <div style={{ fontWeight: 700, fontSize: ".82rem", color: "#1e293b", marginBottom: 4 }}>{f.q}</div>
                <div style={{ fontSize: ".78rem", color: "#64748b", lineHeight: 1.5 }}>{f.a}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: 22 }}>
          <div style={{ fontSize: ".74rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: ".5px", marginBottom: 16 }}>Still need help? Submit a ticket</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div>
              <label style={{ fontSize: ".71rem", fontWeight: 700, color: "#64748b", display: "block", marginBottom: 5, textTransform: "uppercase" }}>Subject *</label>
              <input className="inp" placeholder="Brief description of your issue" value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div>
                <label style={{ fontSize: ".71rem", fontWeight: 700, color: "#64748b", display: "block", marginBottom: 5, textTransform: "uppercase" }}>Category</label>
                <select className="inp" value={form.cat} onChange={e => setForm(p => ({ ...p, cat: e.target.value }))}>
                  {["Technical", "Billing", "Course", "Other"].map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: ".71rem", fontWeight: 700, color: "#64748b", display: "block", marginBottom: 5, textTransform: "uppercase" }}>Priority</label>
                <select className="inp" value={form.priority} onChange={e => setForm(p => ({ ...p, priority: e.target.value }))}>
                  {["Low", "Medium", "High"].map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            </div>
            <textarea className="nta" rows={3} placeholder="Describe your issue…" value={form.msg} onChange={e => setForm(p => ({ ...p, msg: e.target.value }))} />
            <button className="btnp" onClick={submit} disabled={!form.subject.trim() || !form.msg.trim()} style={{ width: "100%", justifyContent: "center", padding: 13 }}>
              <Ic n="send" size={15} />Send Support Ticket
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════
   NOTIFICATION PANEL
══════════════════════════════════════════════════════════ */
const NotifPanel = ({ onClose }) => {
  const items = [
    { ic: "auto_awesome", bg: "#eff6ff", col: "#2563eb", t: "AI Suggestion", s: "Optimization ready for Digital Archive course.", time: "Just now", unread: true },
    { ic: "description", bg: "#f0fdf4", col: "#16a34a", t: "Auto-Notes Generated", s: "DocFlow Core — Lesson 1 (Complete)", time: "12 min ago", unread: true },
    { ic: "add_circle", bg: "#eff6ff", col: "#3b82f6", t: "New Course created", s: "Advanced Data Structures — 1st Draft", time: "28 min ago", unread: false },
    { ic: "school", bg: "#fdf4ff", col: "#9333ea", t: "Course Published", s: "Cloud Computing Mastery is now live.", time: "1 hr ago", unread: false },
    { ic: "quiz", bg: "#fff7ed", col: "#ea580c", t: "AI Quiz Ready", s: "Generated 15 questions for Lesson 3.", time: "2 hr ago", unread: false },
  ];
  return (
    <div className="npanel fad">
      <div style={{ padding: "14px 17px", borderBottom: "1px solid #e0ecff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <div className="sora" style={{ fontWeight: 700, fontSize: ".87rem" }}>Notifications</div>
          <span style={{ background: "#ef4444", color: "#fff", borderRadius: 100, fontSize: ".63rem", fontWeight: 800, padding: "2px 7px" }}>2</span>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <span style={{ fontSize: ".7rem", color: "#2563eb", fontWeight: 700, cursor: "pointer" }}>Mark all read</span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}><Ic n="close" size={16} /></button>
        </div>
      </div>
      {items.map((n, i) => (
        <div key={i} style={{ display: "flex", gap: 11, padding: "12px 17px", borderBottom: i < items.length - 1 ? "1px solid #f1f5f9" : "none", background: n.unread ? "#f8fbff" : "#fff", cursor: "pointer" }}
          onMouseEnter={e => { e.currentTarget.style.background = "#f0f6ff"; }}
          onMouseLeave={e => { e.currentTarget.style.background = n.unread ? "#f8fbff" : "#fff"; }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: n.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Ic n={n.ic} size={17} col={n.col} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: n.unread ? 700 : 500, fontSize: ".81rem", color: "#1e293b" }}>{n.t}</div>
            <div style={{ fontSize: ".73rem", color: "#64748b" }}>{n.s}</div>
            <div style={{ fontSize: ".67rem", color: "#94a3b8", marginTop: 2 }}>{n.time}</div>
          </div>
          {n.unread && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#2563eb", flexShrink: 0, marginTop: 5 }} />}
        </div>
      ))}
    </div>
  );
};

/* ══════════════════════════════════════════════════════════
   COURSE BUILDER (main content)
══════════════════════════════════════════════════════════ */
const CourseBuilder = ({ onOpenLesson }) => {
  const [lessons, setLessons] = useState(LESSONS_INIT);
  const [dragging, setDragging] = useState(null);
  const [dragOver, setDragOver] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newL, setNewL] = useState({ title: "", type: "video", durationMin: 10, youtubeId: "", content: "" });
  const [bTab, setBTab] = useState("builder");
  const [schedule, setSchedule] = useState({ date: "2025-02-15", time: "10:00", tz: "UTC+1" });
  const [prereqs, setPrereqs] = useState(["DocFlow Basics (Course #101)"]);
  const [prereqInput, setPrereqInput] = useState("");

  // Re-enable this when a proper Lesson API is available
  /*
  useEffect(() => {
    fetch("/api/lessons")
        .then(res => res.json())
        .then(data => {
            if (data && data.length > 0) setLessons(data);
        })
        .catch(err => console.error("Error fetching lessons:", err));
  }, []);
  */

  const onDragStart = id => setDragging(id);
  const onDragOver = (e, id) => { e.preventDefault(); setDragOver(id); };
  const onDrop = (e, targetId) => {
    e.preventDefault();
    if (dragging === targetId) { setDragging(null); setDragOver(null); return; }
    const arr = [...lessons];
    const from = arr.findIndex(l => l.id === dragging);
    const to = arr.findIndex(l => l.id === targetId);
    const [item] = arr.splice(from, 1);
    arr.splice(to, 0, item);
    setLessons(arr);
    setDragging(null); setDragOver(null);
  };

  const toggleStatus = id => setLessons(prev => prev.map(l => l.id === id ? { ...l, status: l.status === "published" ? "draft" : "published" } : l));
  const publishAll = () => setLessons(prev => prev.map(l => ({ ...l, status: "published" })));
  const removeLesson = id => setLessons(prev => prev.filter(l => l.id !== id));
  const addLesson = () => {
    if (!newL.title.trim()) return;
    setLessons(prev => [...prev, { ...newL, id: Date.now(), durationMin: Number(newL.durationMin) || 10, status: "draft", notes: "" }]);
    setNewL({ title: "", type: "video", durationMin: 10, youtubeId: "", content: "" });
    setShowAdd(false);
  };
  const addPrereq = () => { if (prereqInput.trim()) { setPrereqs(p => [...p, prereqInput]); setPrereqInput(""); } };

  return (
    <div className="sli">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <h2 className="sora" style={{ fontSize: "1.42rem", fontWeight: 800, color: "#1e293b" }}>Course Builder</h2>
          <p style={{ color: "#64748b", fontSize: ".84rem", marginTop: 2 }}>Drag to reorder · Click 🔗 to open · Stats update live</p>
        </div>
        <div style={{ display: "flex", gap: 7, alignItems: "center" }}>
          <button className="btng" onClick={publishAll} style={{ padding: "8px 14px", border: "1.5px solid #bbf7d0", color: "#166534", background: "#f0fdf4" }}>
            <Ic n="rocket_launch" size={15} /> Publish All
          </button>
          <div style={{ width: 1, height: 24, background: "#e2e8f0", margin: "0 4px" }} />
          {["builder", "schedule", "prereqs"].map(t => (
            <button key={t} className={`tabb${bTab === t ? " on" : ""}`} onClick={() => setBTab(t)}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* LIVE STATS */}
      <StatCards lessons={lessons} />

      {bTab === "builder" && (
        <div className="g2col" style={{ display: "grid", gridTemplateColumns: "1fr 296px", gap: 16 }}>
          {/* Lesson list */}
          <div className="card" style={{ padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 15 }}>
              <span className="sora" style={{ fontWeight: 700, fontSize: ".88rem", color: "#1e293b" }}>Lesson Sequence</span>
              <button className="btnp" onClick={() => setShowAdd(v => !v)} style={{ padding: "7px 12px", fontSize: ".77rem" }}>
                <Ic n="add" size={14} />Add Lesson
              </button>
            </div>

            {showAdd && (
              <div className="fad" style={{ background: "#f0f6ff", borderRadius: 12, padding: 13, marginBottom: 12, display: "flex", flexDirection: "column", gap: 9 }}>
                <input className="inp" placeholder="Lesson title…" value={newL.title} onChange={e => setNewL(p => ({ ...p, title: e.target.value }))} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  <select className="inp" value={newL.type} onChange={e => setNewL(p => ({ ...p, type: e.target.value }))}>
                    {Object.keys(TYPE_BG).map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                  </select>
                  <input className="inp" type="number" min={1} max={300} placeholder="Duration (min)" value={newL.durationMin} onChange={e => setNewL(p => ({ ...p, durationMin: e.target.value }))} />
                </div>
                {newL.type === "video" && <input className="inp" placeholder="YouTube Video ID (e.g. UHzlvUOzJsk)" value={newL.youtubeId} onChange={e => setNewL(p => ({ ...p, youtubeId: e.target.value }))} />}
                {newL.type === "notes" && <textarea className="inp" rows={3} style={{ resize: "none" }} placeholder="Notes content…" value={newL.content} onChange={e => setNewL(p => ({ ...p, content: e.target.value }))} />}
                <div style={{ display: "flex", gap: 7 }}>
                  <button className="btnp" onClick={addLesson} style={{ flex: 1 }}>Add Lesson</button>
                  <button className="btng" onClick={() => setShowAdd(false)} style={{ padding: "7px 11px" }}><Ic n="close" size={15} /></button>
                </div>
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {lessons.map((lesson, idx) => (
                <div key={lesson.id}
                  className={`drag${dragOver === lesson.id ? " dov" : ""}`}
                  draggable
                  onDragStart={() => onDragStart(lesson.id)}
                  onDragOver={e => onDragOver(e, lesson.id)}
                  onDrop={e => onDrop(e, lesson.id)}>
                  <span style={{ color: "#cbd5e1", fontSize: ".7rem", fontWeight: 800, minWidth: 18, fontFamily: "Sora", flexShrink: 0 }}>{idx + 1}</span>
                  <Ic n="drag_indicator" size={16} col="#cbd5e1" style={{ flexShrink: 0 }} />
                  <div style={{ width: 32, height: 32, borderRadius: 9, background: TYPE_BG[lesson.type], display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Ic n={TYPE_IC[lesson.type]} fill size={15} col={TYPE_COL[lesson.type]} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: ".85rem", fontWeight: 600, color: "#1e293b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{lesson.title}</div>
                    <div style={{ fontSize: ".69rem", color: "#94a3b8" }}>
                      {lesson.type === "video" ? "YouTube Video" : lesson.type === "quiz" ? "Interactive Quiz" : "Study Notes"} · {lesson.durationMin} min
                    </div>
                  </div>
                  {/* Open lesson */}
                  <button title="Open lesson" onClick={() => onOpenLesson(lesson)}
                    style={{ background: "#eff6ff", border: "none", borderRadius: 8, padding: "5px 7px", cursor: "pointer", color: "#2563eb", flexShrink: 0 }}>
                    <Ic n="open_in_new" size={14} />
                  </button>
                  {/* Status */}
                  <button onClick={() => toggleStatus(lesson.id)}
                    style={{ background: lesson.status === "published" ? "#dcfce7" : "#fef9c3", border: "none", borderRadius: 100, padding: "3px 8px", fontSize: ".64rem", fontWeight: 800, cursor: "pointer", color: lesson.status === "published" ? "#16a34a" : "#a16207", whiteSpace: "nowrap" }}>
                    {lesson.status === "published" ? "Live" : "Draft"}
                  </button>
                  <button onClick={() => removeLesson(lesson.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", opacity: .55, padding: 3 }}>
                    <Ic n="delete" size={15} />
                  </button>
                </div>
              ))}
            </div>

            {/* Progress bar */}
            <div style={{ marginTop: 17, padding: "12px 14px", background: "#f8fbff", borderRadius: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: ".74rem", fontWeight: 600, color: "#64748b" }}>Published Progress</span>
                <span style={{ fontSize: ".74rem", fontWeight: 800, color: "#2563eb" }}>
                  {Math.round((lessons.filter(l => l.status === "published").length / Math.max(lessons.length, 1)) * 100)}%
                </span>
              </div>
              <div className="pbar">
                <div className="pbar-f" style={{ width: `${(lessons.filter(l => l.status === "published").length / Math.max(lessons.length, 1)) * 100}%` }} />
              </div>
            </div>
          </div>

          {/* Settings panel */}
          <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
            <div className="card" style={{ padding: 17 }}>
              <div className="sora" style={{ fontWeight: 700, fontSize: ".84rem", marginBottom: 12 }}>Course Info</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                <input className="inp" defaultValue="DocFlow Mastery Program" placeholder="Course title" />
                <textarea className="inp" rows={2} style={{ resize: "none" }} defaultValue="Master document management with AI-powered tools." />
                <select className="inp" defaultValue="beginner">
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>
            <div className="card" style={{ padding: 17 }}>
              <div className="sora" style={{ fontWeight: 700, fontSize: ".84rem", marginBottom: 12 }}>Publish Settings</div>
              {[["Enrollment approval", true], ["Certificate on completion", true], ["Student discussions", false]].map(([l, d]) => <TRow key={l} label={l} defaultOn={d} />)}
            </div>
            <button className="btnp" onClick={publishAll} style={{ borderRadius: 13, padding: 12, fontSize: ".87rem", justifyContent: "center", background: "linear-gradient(135deg, #2563eb, #1d4ed8)" }}>
              <Ic n="rocket_launch" size={16} />Publish Course
            </button>
          </div>
        </div>
      )}

      {bTab === "schedule" && (
        <div className="card fad" style={{ padding: 24 }}>
          <div className="sora" style={{ fontWeight: 700, fontSize: ".92rem", marginBottom: 17 }}>Live Scheduling</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 13, marginBottom: 17 }}>
            <div>
              <label style={{ fontSize: ".71rem", fontWeight: 700, color: "#64748b", display: "block", marginBottom: 5, textTransform: "uppercase" }}>Launch Date</label>
              <input type="date" className="inp" value={schedule.date} onChange={e => setSchedule(s => ({ ...s, date: e.target.value }))} />
            </div>
            <div>
              <label style={{ fontSize: ".71rem", fontWeight: 700, color: "#64748b", display: "block", marginBottom: 5, textTransform: "uppercase" }}>Launch Time</label>
              <input type="time" className="inp" value={schedule.time} onChange={e => setSchedule(s => ({ ...s, time: e.target.value }))} />
            </div>
            <div>
              <label style={{ fontSize: ".71rem", fontWeight: 700, color: "#64748b", display: "block", marginBottom: 5, textTransform: "uppercase" }}>Timezone</label>
              <select className="inp" value={schedule.tz} onChange={e => setSchedule(s => ({ ...s, tz: e.target.value }))}>
                {["UTC+0", "UTC+1", "UTC+2", "UTC+5:30", "UTC-5", "UTC-8"].map(tz => <option key={tz}>{tz}</option>)}
              </select>
            </div>
          </div>
          <div style={{ background: "#f0f6ff", borderRadius: 12, padding: 15, display: "flex", gap: 12, alignItems: "center" }}>
            <Ic n="event" size={26} col="#2563eb" />
            <div>
              <div className="sora" style={{ fontWeight: 700, fontSize: ".88rem" }}>Launch: {schedule.date} at {schedule.time} ({schedule.tz})</div>
              <div style={{ fontSize: ".77rem", color: "#64748b" }}>Enrolled students notified 24 hours before launch</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 9, marginTop: 14 }}>
            <button className="btnp">Confirm Schedule</button>
            <button className="btng">Send Preview Email</button>
          </div>
        </div>
      )}

      {bTab === "prereqs" && (
        <div className="card fad" style={{ padding: 24 }}>
          <div className="sora" style={{ fontWeight: 700, fontSize: ".92rem", marginBottom: 17 }}>Prerequisites</div>
          <div style={{ display: "flex", gap: 9, marginBottom: 13 }}>
            <input className="inp" placeholder="Add prerequisite course or skill…" value={prereqInput} onChange={e => setPrereqInput(e.target.value)} onKeyDown={e => e.key === "Enter" && addPrereq()} />
            <button className="btnp" onClick={addPrereq}>Add</button>
          </div>
          {prereqs.map((p, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 14px", background: "#f8fbff", borderRadius: 12, border: "1px solid #e0ecff", marginBottom: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                <Ic n="check_circle" fill size={16} col="#22c55e" />
                <span style={{ fontSize: ".86rem", fontWeight: 500 }}>{p}</span>
              </div>
              <button onClick={() => setPrereqs(l => l.filter((_, j) => j !== i))} style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444" }}><Ic n="close" size={14} /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ══════════════════════════════════════════════════════════
   SIDEBAR
══════════════════════════════════════════════════════════ */
const Sidebar = ({ activeNav, setActiveNav, onBuild, onSettings, onSupport }) => {
  const navigate = useNavigate();
  return (
  <nav className="sb-desk" style={{ width: 232, minHeight: "100vh", background: "#fff", borderRight: "1px solid rgba(37,99,235,.08)", padding: "20px 10px", display: "flex", flexDirection: "column", position: "fixed", left: 0, top: 0, zIndex: 50, boxShadow: "4px 0 18px rgba(37,99,235,.05)" }}>
    <Link to="/" style={{ padding: "0 6px 32px", display: "flex", alignItems: "center", gap: 12, textDecoration: 'none' }}>
      <div style={{ width: 44, height: 44, background: "#1d4ed8", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Ic n="psychology" fill size={26} col="#fff" />
      </div>
      <div>
        <div className="sora" style={{ fontSize: "1.1rem", fontWeight: 800, color: "#1d4ed8", letterSpacing: "-.5px", lineHeight: 1 }}>DocFlow <span style={{ color: "#004ac6" }}>AI</span></div>
        <div style={{ fontSize: ".58rem", color: "#64748b", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginTop: 4, lineHeight: 1.3 }}>Intelligent<br/>Workspace</div>
      </div>
    </Link>
    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
      {[{ ic: "psychology", l: "AI Engine", id: "ai" }, { ic: "school", l: "DocFlow Learn", id: "learn" }, { ic: "tune", l: "DocFlow Core", id: "core" }].map(n => (
        <button key={n.id} onClick={() => {
          if (n.id === "ai") navigate("/ai-engine");
          else if (n.id === "core") navigate("/docflow-core");
          else setActiveNav(n.id);
        }}
          style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 12, fontFamily: "Sora,sans-serif", fontSize: ".85rem", fontWeight: activeNav === n.id ? 700 : 500, color: activeNav === n.id ? "#2563eb" : "#475569", background: activeNav === n.id ? "rgba(37,99,235,.07)" : "transparent", border: "none", cursor: "pointer", width: "100%", transition: "all .18s", borderRight: activeNav === n.id ? "3px solid #2563eb" : "3px solid transparent", textAlign: "left" }}>
          <Ic n={n.ic} size={20} col={activeNav === n.id ? "#2563eb" : "#64748b"} />
          {n.l}
        </button>
      ))}
    </div>
    <div style={{ margin: "24px 6px" }}>
      <button className="btnp" onClick={onBuild} style={{ width: "100%", borderRadius: 14, padding: "14px", justifyContent: "center", boxShadow: "0 4px 14px rgba(37,99,235,.25)" }}>
        <Ic n="add" size={18} />New Project
      </button>
    </div>
    <div style={{ marginTop: "auto", padding: "16px 6px", borderTop: "1px solid #f1f5f9", display: "flex", flexDirection: "column", gap: 4 }}>
      {[["help", "Help Center", onSupport], ["settings", "Settings", onSettings]].map(([ic, lb, fn]) => (
        <button key={lb} onClick={fn}
          style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 12px", borderRadius: 10, fontFamily: "Sora,sans-serif", fontSize: ".82rem", fontWeight: 500, color: "#64748b", background: "transparent", border: "none", cursor: "pointer", width: "100%", transition: "all .18s", textAlign: "left" }}
          onMouseEnter={e => { e.currentTarget.style.background = "#eff6ff"; e.currentTarget.style.color = "#2563eb"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#64748b"; }}>
          <Ic n={ic} size={19} />{lb}
        </button>
      ))}
    </div>
  </nav>
  );
};

/* ══════════════════════════════════════════════════════════
   TOP BAR
══════════════════════════════════════════════════════════ */
const TopBar = ({ onUpgrade, onNotif, notifOpen }) => (
  <header style={{ position: "fixed", top: 0, right: 0, width: "100%", height: 62, background: "rgba(255,255,255,.85)", backdropFilter: "blur(24px) saturate(180%)", borderBottom: "1px solid rgba(37,99,235,.12)", boxShadow: "0 4px 20px rgba(37,99,235,.04)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 28px", zIndex: 40 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      {/* Premium Sub-branding */}
      <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "6px 14px", background: "linear-gradient(135deg,rgba(37,99,235,.1),rgba(37,99,235,.02))", borderRadius: 14, border: "1px solid rgba(37,99,235,.15)" }}>
        <Ic n="school" size={20} col="#2563eb" />
        <span className="sora" style={{ fontWeight: 800, fontSize: ".95rem", background: "linear-gradient(90deg, #1e293b, #2563eb)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: "-.02em" }}>DocFlow Learn</span>
      </div>
    </div>

    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <button className="btnp" onClick={onUpgrade} style={{ padding: "8px 18px", fontSize: ".78rem", borderRadius: 12, boxShadow: "0 6px 16px rgba(37,99,235,.22)", fontWeight: 700 }}>
        <Ic n="workspace_premium" fill size={15} col="#fff" />Upgrade Plans
      </button>

      <div style={{ position: "relative" }}>
        <button onClick={onNotif} style={{ background: notifOpen ? "#eff6ff" : "none", border: "none", cursor: "pointer", padding: "8px", borderRadius: 10, display: "flex", alignItems: "center", transition: "all .2s", border: `1px solid ${notifOpen ? "rgba(37,99,235,.2)" : "transparent"}` }}>
          <Ic n="notifications" size={22} col={notifOpen ? "#2563eb" : "#64748b"} />
        </button>
        <div style={{ position: "absolute", top: 6, right: 6, width: 9, height: 9, borderRadius: "50%", background: "#ef4444", border: "2px solid #fff", boxShadow: "0 0 0 2px rgba(239, 68, 68, 0.1)" }} />
      </div>

      <div style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 10, padding: "4px 4px 4px 12px", background: "#f8fbff", borderRadius: 100, border: "1px solid #f1f5f9", transition: "all .2s" }}>
        <div style={{ textAlign: "right", paddingRight: 4 }}>
          <div style={{ fontSize: ".74rem", fontWeight: 800, color: "#1e293b", lineHeight: 1 }}>Administrator</div>
          <div style={{ fontSize: ".62rem", color: "#64748b", fontWeight: 700, marginTop: 2 }}>Professional Plan</div>
        </div>
        <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg,#2563eb,#60a5fa)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: ".76rem", fontFamily: "Sora", boxShadow: "0 3px 10px rgba(37,99,235,.15)" }}>AD</div>
      </div>
    </div>
  </header>
);

/* ══════════════════════════════════════════════════════════
   AI FLOATING BAR
══════════════════════════════════════════════════════════ */
const AIBar = () => {
  const [q, setQ] = useState("");
  const [resp, setResp] = useState("");
  const [loading, setLoading] = useState(false);
  const sugg = ["Generate quiz for Digital Archive", "Create notes for Lesson 4", "Suggest YouTube video for DocFlow"];
  const send = () => {
    if (!q.trim()) return;
    setLoading(true); setResp("");
    setTimeout(() => {
      const query = q.toLowerCase();
      if (query.includes("workflow") || query.includes("approval") || query.includes("aproval")) {
        setResp(`DocFlow AI → "${q}": The approval workflow features are defined across these spaces in the application:
1. **Lesson 4 (Approval Workflows)** in DocFlow Learn provides detailed study notes on review steps.
2. **DocFlow Core (/docflow-core)** is the active space where document states (Pending, Approved, Rejected) are tracked, and e-signatures are handled.
3. **AI Workspace (/workspace)** is where documents are processed and verified using confidence scores before being finalized.`);
      } else {
        setResp(`DocFlow AI → "${q}": Based on your 5-lesson course (75 min total), I recommend adding a final assessment and a certificate milestone. Your current progress: 2 published, 3 drafts.`);
      }
      setLoading(false);
    }, 1100);
  };
  return (
    <div style={{ position: "fixed", bottom: 20, left: "50%", transform: "translateX(-50%)", width: "min(620px,86vw)", zIndex: 100 }}>
      {resp && (
        <div className="fad card" style={{ marginBottom: 8, padding: "12px 16px", fontSize: ".81rem", lineHeight: 1.65 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ fontWeight: 700, color: "#2563eb", fontSize: ".72rem" }}>DocFlow AI</span>
            <button onClick={() => setResp("")} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: 0 }}>✕</button>
          </div>
          {resp}
        </div>
      )}
      {!resp && !loading && (
        <div style={{ marginBottom: 7, display: "flex", gap: 5, flexWrap: "wrap" }}>
          {sugg.map(s => (
            <button key={s} onClick={() => setQ(s)}
              style={{ background: "rgba(255,255,255,.92)", border: "1px solid rgba(37,99,235,.15)", borderRadius: 100, padding: "4px 11px", fontSize: ".68rem", cursor: "pointer", color: "#2563eb", fontWeight: 700, fontFamily: "Sora", backdropFilter: "blur(10px)" }}>
              {s}
            </button>
          ))}
        </div>
      )}
      <div style={{ background: "rgba(255,255,255,.9)", backdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,.6)", boxShadow: "0 8px 36px rgba(37,99,235,.14)", borderRadius: 100, display: "flex", alignItems: "center", gap: 10, padding: "8px 12px 8px 17px" }}>
        <Ic n="auto_awesome" fill size={18} col="#2563eb" style={{ flexShrink: 0 }} />
        <input value={q} onChange={e => setQ(e.target.value)} onKeyDown={e => e.key === "Enter" && send()}
          placeholder="Ask DocFlow AI to generate quiz, notes, or syllabus…"
          style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: ".83rem", color: "#1e293b", fontFamily: "DM Sans" }} />
        {loading
          ? <div style={{ width: 33, height: 33, display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ width: 15, height: 15, border: "2.5px solid #bfdbfe", borderTop: "2.5px solid #2563eb", borderRadius: "50%", animation: "spin .8s linear infinite" }} /></div>
          : <button onClick={send} style={{ width: 33, height: 33, borderRadius: "50%", background: "#2563eb", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(37,99,235,.3)", transition: "transform .18s" }}
            onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.1)"; }} onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}>
            <Ic n="send" size={14} col="#fff" />
          </button>
        }
      </div>

    </div>
  );
};

/* ══════════════════════════════════════════════════════════
   ROOT APP
══════════════════════════════════════════════════════════ */
export default function DocFlowLearn() {
  useInject();
  const [openLesson, setOpenLesson] = useState(null);
  const [showBuild, setShowBuild] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  const [showNotif, setShowNotif] = useState(false);

  return (
    <div style={{ padding: "28px", maxWidth: 1300, margin: "0 auto" }}>
      <CourseBuilder onOpenLesson={setOpenLesson} />

      {showNotif && <NotifPanel onClose={() => setShowNotif(false)} />}
      <AIBar />

      {openLesson && <LessonViewer lesson={openLesson} onClose={() => setOpenLesson(null)} />}
      {showBuild && <BuildCourseModal onClose={() => setShowBuild(false)} />}
      {showUpgrade && <UpgradeModal onClose={() => setShowUpgrade(false)} />}
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
      {showSupport && <SupportModal onClose={() => setShowSupport(false)} />}
    </div>
  );
}
