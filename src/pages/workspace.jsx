import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";


/* ─── Google Fonts + base CSS ──────────────────────────────── */
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');

    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    html{scroll-behavior:smooth}
    body{font-family:'Plus Jakarta Sans',sans-serif;background:#f7f9fb;color:#191c1e;overflow-x:hidden}
    ::-webkit-scrollbar{width:5px}
    ::-webkit-scrollbar-track{background:transparent}
    ::-webkit-scrollbar-thumb{background:#c3c6d7;border-radius:8px}

    .material-symbols-outlined{
      font-family:'Material Symbols Outlined';
      font-variation-settings:'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 24;
      font-style:normal;line-height:1;display:inline-block;vertical-align:middle;
      white-space:nowrap;word-wrap:normal;user-select:none;
    }
    .icon-fill{font-variation-settings:'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 24}
    .font-headline{font-family:'Space Grotesk',sans-serif}

    /* animations */
    @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
    @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
    @keyframes shimmer{0%{opacity:.6}50%{opacity:1}100%{opacity:.6}}
    @keyframes slideRight{from{width:0}to{width:var(--w,80%)}}
    @keyframes gradientShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}

    .anim-fade{animation:fadeUp .55s cubic-bezier(.16,1,.3,1) both}
    .anim-float{animation:float 4s ease-in-out infinite}
    .anim-shimmer{animation:shimmer 2s ease-in-out infinite}
    .progress-bar{animation:slideRight .9s cubic-bezier(.4,0,.2,1) .3s both}

    .glass{background:rgba(255,255,255,.75);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px)}
    .glass-panel{background:rgba(255,255,255,.7);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px)}
    .gradient-primary{background:linear-gradient(135deg,#004ac6,#2563eb)}
    .gradient-hero{background:linear-gradient(135deg,#004ac6 0%,#2563eb 50%,#712ae2 100%);background-size:200% 200%;animation:gradientShift 6s ease infinite}

    /* sidebar nav */
    .nav-link{
      display:flex;align-items:center;gap:12px;padding:12px 16px;border-radius:12px;
      font-family:'Space Grotesk',sans-serif;font-size:14px;font-weight:500;
      color:#64748b;cursor:pointer;border:none;background:none;width:100%;
      text-align:left;letter-spacing:-.01em;
      transition:background .18s,color .18s,transform .18s;
    }
    .nav-link:hover{background:rgba(0,0,0,.04);color:#1e293b;transform:translateX(3px)}
    .nav-link.active{background:rgba(0,74,198,.07);color:#1d4ed8;font-weight:700;border-right:3px solid #2563eb}

    /* card hover */
    .card-hover{transition:box-shadow .22s,transform .22s}
    .card-hover:hover{box-shadow:0 12px 40px rgba(0,0,0,.12);transform:translateY(-3px)}

    /* bento card */
    .bento-card{background:#fff;border-radius:20px;border:1px solid rgba(195,198,215,.2);box-shadow:0 2px 8px rgba(0,0,0,.05)}

    /* feature badge */
    .badge{display:inline-flex;align-items:center;gap:6px;padding:4px 14px;border-radius:99px;font-size:11px;font-weight:700;letter-spacing:.06em}

    /* section divider line */
    .section-line{height:1px;background:linear-gradient(90deg,transparent,rgba(195,198,215,.5),transparent);margin:20px 0}

    /* image overlay */
    .img-card{overflow:hidden;border-radius:16px;position:relative}
    .img-card img{width:100%;height:100%;object-fit:cover;transition:transform .5s cubic-bezier(.4,0,.2,1),filter .5s}
    .img-card:hover img{transform:scale(1.06);filter:grayscale(0)!important}

    /* floating dock */
    .float-dock{
      position:fixed;bottom:28px;left:50%;transform:translateX(-50%);
      width:100%;max-width:640px;padding:0 20px;z-index:60;
    }

    /* mobile */
    @media(max-width:768px){
      .sidebar{transform:translateX(-100%);transition:transform .3s}
      .sidebar.open{transform:translateX(0)}
      .main-content{margin-left:0!important}
      .hide-mobile{display:none!important}
      .mob-overlay{display:block}
      .bento-2col{grid-template-columns:1fr!important}
      .bento-3col{grid-template-columns:1fr!important}
      .hero-grid{flex-direction:column!important}
      .core-grid{grid-template-columns:1fr!important}
    }
    @media(min-width:769px){
      .mob-only{display:none!important}
      .mob-overlay{display:none!important}
    }
  `}</style>
);

/* ─── Icon helper ───────────────────────────────────────────── */
const Ic = ({ name, size = 22, fill = false, style: s = {}, cls = "" }) => (
  <span className={`material-symbols-outlined${fill ? " icon-fill" : ""}${cls ? " " + cls : ""}`}
    style={{ fontSize: size, ...s }}>{name}</span>
);

/* ─── Sidebar ───────────────────────────────────────────────── */
const NAV = [
  { id: "engine", icon: "psychology",              label: "DocFlow AI Engine", path: "/ai-engine" },
  { id: "learn",  icon: "school",                  label: "DocFlow Learn", path: "/docflow-learn" },
  { id: "core",   icon: "settings_input_component", label: "DocFlow Core", path: "/docflow-core" },
];

const BOTTOM_NAV = [
  { id: "help", icon: "help",     label: "Help Center", path: "/help" },
  { id: "sets", icon: "settings", label: "Settings",    path: "/settings" },
];



/* ─── Hero Section ──────────────────────────────────────────── */
function HeroSection() {
  return (
    <section className="anim-fade" style={{ marginBottom: 80, animationDelay: ".05s" }}>
      <div className="hero-grid" style={{ display: "flex", gap: 56, alignItems: "center" }}>
        {/* Left */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 24 }}>
          <div className="badge" style={{ background: "#eaddff", color: "#5a00c6", width: "fit-content" }}>
            Workspace Title
          </div>
          <h2 className="font-headline" style={{ fontSize: "clamp(2.4rem,4.5vw,3.8rem)", fontWeight: 900, letterSpacing: "-.05em", lineHeight: 1.08, color: "#0f172a" }}>
            The Intelligence<br />
            <span style={{ background: "linear-gradient(135deg,#004ac6,#2563eb)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Behind Your Data.
            </span>
          </h2>
          <p style={{ fontSize: 18, color: "#64748b", lineHeight: 1.75, maxWidth: 520 }}>
            A unified workspace where AI transforms raw documentation into actionable knowledge, professional learning paths, and legal-grade workflows.
          </p>
          {/* Call to action and stats removed */}
        </div>

        {/* Right */}
        <div style={{ width: 420, flexShrink: 0, position: "relative" }} className="hide-mobile">
          <div className="anim-float" style={{ borderRadius: 24, overflow: "hidden", boxShadow: "0 40px 80px rgba(0,74,198,.2)", aspectRatio: "1/1", position: "relative" }}>
            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAw1QUUHpmoDeyQuJJH64HJ21zw3QuQ8nnm1qaAEKhAxbC7CpDH9gJ4ISt2AktMHdnT_60MkRBJimIeRhk1b-3SHmpZjkh7CsN5UxQZG7sNdx-DcoO4A2rgZ17EajSJBt_CftW40rNvr3Xzn6CeKNOT0YAL9pnyMsmZiq1ZaNsUWhotCtLxL3MjL1RMAvjqh1o72edl2gb43qMWUIKmfGQMb3DDpMhs5NVdN5J9zzOowHjNBHDWe82pagd5-uBYSNKZuzyPH2jJpCaq"
              alt="AI visualization" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(0,74,198,.45),transparent)" }} />
            <div className="glass-panel" style={{ position: "absolute", bottom: 20, left: 20, right: 20, padding: "18px 20px", borderRadius: 16, border: "1px solid rgba(255,255,255,.25)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#004ac6,#712ae2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Ic name="memory" size={18} style={{ color: "#fff" }} />
                </div>
                <div>
                  <p className="font-headline" style={{ fontWeight: 700, fontSize: 13, color: "#191c1e" }}>DocFlow Intelligence Engine</p>
                  <p style={{ fontSize: 11, color: "#64748b" }}>Processing 1.2GB of workspace data…</p>
                </div>
              </div>
              <div style={{ marginTop: 12, height: 5, background: "rgba(195,198,215,.4)", borderRadius: 99, overflow: "hidden" }}>
                <div className="progress-bar" style={{ height: "100%", width: "72%", background: "linear-gradient(90deg,#004ac6,#2563eb)", borderRadius: 99 }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Section Header ────────────────────────────────────────── */
function SectionHeader({ icon, iconBg, iconColor, title, delay = 0 }) {
  return (
    <div className="anim-fade" style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 36, animationDelay: `${delay}s` }}>
      <div style={{ width: 46, height: 46, borderRadius: 14, background: iconBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Ic name={icon} size={24} style={{ color: iconColor }} />
      </div>
      <h3 className="font-headline" style={{ fontSize: 28, fontWeight: 800, color: "#0f172a", letterSpacing: "-.03em" }}>{title}</h3>
    </div>
  );
}

/* ─── DocFlow AI Engine Section ─────────────────────────────── */
function AIEngineSection() {
  return (
    <div style={{ marginBottom: 88 }}>
      <SectionHeader icon="psychology" iconBg="rgba(0,74,198,.08)" iconColor="#004ac6" title="DocFlow AI Engine" delay={.1} />

      <div className="anim-fade" style={{ display: "grid", gridTemplateColumns: "8fr 4fr", gap: 20, marginBottom: 20, animationDelay: ".15s" }}>
        {/* Large card */}
        <div className="bento-card card-hover" style={{ padding: 36 }}>
          <div style={{ display: "flex", gap: 32 }}>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: 11, fontWeight: 800, color: "#004ac6", letterSpacing: ".1em", textTransform: "uppercase", display: "block", marginBottom: 10 }}>Interactive Learning</span>
              <h4 className="font-headline" style={{ fontSize: 24, fontWeight: 800, marginBottom: 14, color: "#0f172a", letterSpacing: "-.03em" }}>AI Video Lessons</h4>
              <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.75, marginBottom: 20 }}>
                Automatically generate structured curriculum and interactive video chapters from raw recordings. Let AI handle the indexing while you focus on content delivery.
              </p>
              <div style={{ display: "flex", gap: 10 }}>
                <span className="badge" style={{ background: "#6ffbbe", color: "#002113" }}>✨ Smart Chapters</span>
                <span className="badge" style={{ background: "#e6e8ea", color: "#434655" }}>99% Accuracy</span>
              </div>
            </div>
            <div className="img-card hide-mobile" style={{ width: 240, height: 160, flexShrink: 0 }}>
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDZYx4hAwK5o_wIiizkoBNBWpLlS2iKXFntPZXwV5IEeNKKGAD2aGQQtlaWKX46Zyg3vsRfQXW7GYeIecCkMGxv-WAHreHowGELdFQVC7FPfbJV8ySqSZzNORawCp5326AUypXzH8dCSpQj2xA_qNC15al3WmsqvcRzgmpRagFDaFuLCRr7DTgZucqS_8RTZtiwgwR2omrQQuRUfog0agsHAvDUxKp76MRTc0eUsnfO2tGeK2Ikvm9_kDoQdRpFGRWl_pBU9dohPwve"
                alt="AI Video Lessons" />
            </div>
          </div>
        </div>

        {/* Blue CTA card */}
        <div style={{ background: "linear-gradient(135deg,#004ac6,#2563eb)", borderRadius: 20, padding: 36, display: "flex", flexDirection: "column", justifyContent: "space-between", boxShadow: "0 12px 32px rgba(0,74,198,.28)" }}>
          <Ic name="auto_awesome" size={42} fill style={{ color: "rgba(255,255,255,.9)" }} />
          <div>
            <h4 className="font-headline" style={{ fontSize: 22, fontWeight: 800, color: "#fff", marginBottom: 10 }}>AI Generation</h4>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,.75)", lineHeight: 1.65 }}>
              Create quizzes, study guides, and complex summaries with a single natural language prompt.
            </p>
          </div>
          <button style={{ marginTop: 20, padding: "10px 0", borderRadius: 12, border: "1.5px solid rgba(255,255,255,.35)", background: "rgba(255,255,255,.1)", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer", transition: "background .18s", fontFamily: "'Plus Jakarta Sans',sans-serif" }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,.2)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,.1)"}>
            Try Now →
          </button>
        </div>
      </div>

      {/* Lecture → Notes strip */}
      <div className="anim-fade bento-card card-hover" style={{ padding: "28px 36px", display: "flex", alignItems: "center", gap: 24, animationDelay: ".2s" }}>
        <div style={{ width: 52, height: 52, borderRadius: 14, background: "rgba(113,42,226,.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Ic name="edit_note" size={28} style={{ color: "#712ae2" }} />
        </div>
        <div style={{ flex: 1 }}>
          <h4 className="font-headline" style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", marginBottom: 4 }}>Lecture → Notes</h4>
          <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6 }}>Instant transcription and smart note-taking that captures every key insight from your live sessions.</p>
        </div>
        <div className="hide-mobile" style={{ display: "flex", alignItems: "center", gap: -8 }}>
          {["#cbd5e1","#94a3b8","#64748b"].map((bg, i) => (
            <div key={i} style={{ width: 36, height: 36, borderRadius: "50%", background: bg, border: "2.5px solid #fff", marginLeft: i > 0 ? -10 : 0, zIndex: 3 - i }} />
          ))}
          <div style={{ marginLeft: -10, width: 36, height: 36, borderRadius: "50%", background: "#475569", border: "2.5px solid #fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 800, color: "#fff", zIndex: 0 }}>+12</div>
        </div>
        <button style={{ padding: "10px 22px", borderRadius: 12, border: "1.5px solid rgba(0,74,198,.25)", background: "rgba(0,74,198,.05)", color: "#004ac6", fontWeight: 700, fontSize: 13, cursor: "pointer", transition: "all .18s", flexShrink: 0, fontFamily: "'Plus Jakarta Sans',sans-serif" }}
          onMouseEnter={e => { e.currentTarget.style.background = "#004ac6"; e.currentTarget.style.color = "#fff"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(0,74,198,.05)"; e.currentTarget.style.color = "#004ac6"; }}>
          Start Transcribing
        </button>
      </div>
    </div>
  );
}

/* ─── DocFlow Learn Section ─────────────────────────────────── */
function LearnSection() {
  const cards = [
    {
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBfc4K_LTxmsqp_dNtlVuS1xaLlwyuJxxcIE43Bse00nWcraxx-BPtzOM60H35Qut0eTNxb2HucoEARt8MADBg4Er-qjFREUjPAVLxdwK8hIRMdmhCYbavqQRYOfoubPJKcOgiWEBhA0lt-WMzPU3YUeV4TXb8U7jd1olbwgrZte1sqrCVM7RRwYL651WVbc3Id3SF333xZPxsm3ZvIftyUTckkXKz49po6uxCTrTUWoySpfMn7PRGR2ou38D6Tl9nNsd6MuFA6Yu7Y",
      offset: false, title: "Course Builder",
      desc: "Drag-and-drop course creation with modular lesson planning, prerequisites, and live scheduling. Build educational journeys effortlessly.",
      cta: "Explore Modules", ctaIcon: "arrow_forward", badge: null, accent: "#004ac6",
    },
    {
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBydT1cm83KjlrtisYr0tsbfOVaueR5yC5tYoJ6HdaRSDtY43X_mma5Ae1C0CEnlHJRgKWZP8s5FGHOPLqhQfOmUaiW0ZUmQqYve_jLQGm7NARl5_VtYB3O6Durm0qpk4F1fgqZdK4dzwCGPkzTyytg7wVs8mdq5fQpj4hEF22gKxZrTpa8HBxxCm2robQ2Xvx1tjjM3UAu1RA6hH6AWUhEvQ6KrvHMIztUfcK0M8hpl-dYS59NZfRNB54l8jIfmwe7jPlwlkTIfkvQ",
      offset: true, title: "Smart Assessments",
      desc: "Adaptive quizzes that adjust difficulty in real-time based on learner performance data. Personalization at scale.",
      cta: "Active Personalization Enabled", ctaIcon: "trending_up", badge: null, accent: "#006242",
    },
    {
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAKEk_TBbuFhN6IJkZcb_vXvl-uG8DMAyX28FpPe78MXYgxUfyV0ENtLrJJFHk5QVqtLzVZLJ9F6brRe6Lmyv72rcdZlMU_lvz-YIqyMhBB11PWKRyMGRqovt_SIQLUGblzm96b1POmx_IdN8TMbbK6q5sxsHz82q_e2dowe2g3TGhxi4M6p-0ud0ouP-MUvgrWnKywlD-U8wve4c0PBABmJbHW4VKPDEdl34sKpFCy98t2XobAJaZYrgFd_ANmcNixRplpf95CRDRD",
      offset: false, title: "Certification Engine",
      desc: "Issue verifiable digital certificates with custom branding and instant LinkedIn sharing. Build authority instantly.",
      cta: "Web3 Verified", ctaIcon: "verified", badge: true, accent: "#712ae2",
    },
  ];

  return (
    <div style={{ marginBottom: 88 }}>
      <SectionHeader icon="school" iconBg="rgba(113,42,226,.08)" iconColor="#712ae2" title="DocFlow Learn" delay={.2} />
      <div className="anim-fade bento-3col" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 28, animationDelay: ".25s" }}>
        {cards.map((card, i) => (
          <div key={card.title} style={{ display: "flex", flexDirection: "column", gap: 20, paddingTop: card.offset ? 48 : 0 }}>
            <div className="img-card" style={{ height: 220 }}>
              <img src={card.img} alt={card.title} style={{ filter: i === 0 ? "grayscale(80%)" : "none" }} />
            </div>
            <div className="bento-card" style={{ padding: 24, flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
              <h4 className="font-headline" style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", letterSpacing: "-.02em" }}>{card.title}</h4>
              <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.7, flex: 1 }}>{card.desc}</p>
              {card.badge ? (
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px", background: "#f2f4f6", border: "1px solid rgba(195,198,215,.4)", borderRadius: 99, width: "fit-content" }}>
                  <Ic name="verified" size={14} style={{ color: card.accent }} />
                  <span style={{ fontSize: 10, fontWeight: 800, color: card.accent, textTransform: "uppercase", letterSpacing: ".08em" }}>{card.cta}</span>
                </div>
              ) : (
                <button style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", color: card.accent, fontWeight: 700, fontSize: 14, padding: 0, fontFamily: "'Plus Jakarta Sans',sans-serif", transition: "gap .18s" }}
                  onMouseEnter={e => e.currentTarget.style.gap = "10px"}
                  onMouseLeave={e => e.currentTarget.style.gap = "6px"}>
                  {card.cta} <Ic name={card.ctaIcon} size={18} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── DocFlow Core Section ──────────────────────────────────── */
function CoreSection() {
  const [active, setActive] = useState(null);

  const features = [
    {
      id: "doc", icon: "document_scanner", iconColor: "#004ac6", title: "Document Processing",
      desc: "OCR-powered extraction transforms scanned PDFs, images, and slides into editable, searchable content.",
      extra: (
        <div style={{ marginTop: 16 }}>
          <div style={{ height: 5, background: "#e6e8ea", borderRadius: 99, overflow: "hidden", marginBottom: 6 }}>
            <div className="progress-bar" style={{ height: "100%", width: "80%", background: "linear-gradient(90deg,#004ac6,#2563eb)", borderRadius: 99, "--w": "80%" }} />
          </div>
          <p style={{ fontSize: 9, fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: ".14em" }}>PDF Analysis In Progress</p>
        </div>
      ),
    },
    {
      id: "sum", icon: "summarize", iconColor: "#712ae2", title: "AI Summarization",
      desc: "Compress 100-page reports into crisp executive summaries with configurable depth and tone.",
      extra: (
        <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
          {[["S","#e6e8ea","#64748b"],["M","#004ac6","#fff"],["L","#e6e8ea","#64748b"]].map(([lb, bg, color]) => (
            <div key={lb} style={{ width: 34, height: 34, borderRadius: 10, background: bg, color, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 12, cursor: "pointer", transition: "transform .18s" }}
              onMouseEnter={e => e.currentTarget.style.transform = "scale(1.1)"}
              onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>
              {lb}
            </div>
          ))}
        </div>
      ),
    },
    {
      id: "sig", icon: "ink_pen", iconColor: "#006242", title: "E-Signature",
      desc: "Legally-binding digital signatures integrated directly into your document automation pipeline.",
      extra: (
        <div style={{ marginTop: 16, padding: "14px 16px", background: "rgba(111,251,190,.15)", borderRadius: 14, border: "1px solid rgba(78,222,163,.3)", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,.1)" }}>
            <Ic name="draw" size={18} style={{ color: "#006242" }} />
          </div>
          <span style={{ fontSize: 12, fontWeight: 700, color: "#006242" }}>Ready for signature</span>
        </div>
      ),
    },
  ];

  return (
    <div style={{ marginBottom: 120 }}>
      <SectionHeader icon="settings_input_component" iconBg="#e6e8ea" iconColor="#434655" title="DocFlow Core" delay={.3} />
      <div className="anim-fade" style={{ animationDelay: ".35s" }}>
        <div style={{ background: "#f2f4f6", borderRadius: 24, padding: 4 }}>
          <div className="core-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", background: "#fff", borderRadius: 20, overflow: "hidden" }}>
            {features.map((f, i) => (
              <div key={f.id}
                style={{ padding: "36px 32px", borderRight: i < 2 ? "1px solid rgba(195,198,215,.2)" : "none", cursor: "pointer", transition: "background .22s", background: active === f.id ? "#f8fafc" : "#fff" }}
                onMouseEnter={() => setActive(f.id)}
                onMouseLeave={() => setActive(null)}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: `${f.iconColor}12`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20, transition: "transform .22s", transform: active === f.id ? "scale(1.1)" : "scale(1)" }}>
                  <Ic name={f.icon} size={26} style={{ color: f.iconColor }} />
                </div>
                <h4 className="font-headline" style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", marginBottom: 10, letterSpacing: "-.02em" }}>{f.title}</h4>
                <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.7, marginBottom: 4 }}>{f.desc}</p>
                {f.extra}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Floating AI Dock ──────────────────────────────────────── */
function FloatingDock() {
  const [q, setQ] = useState("");
  return (
    <div className="float-dock">
      <div className="glass-panel" style={{ borderRadius: 9999, padding: "10px 10px 10px 20px", display: "flex", alignItems: "center", gap: 12, border: "1px solid rgba(255,255,255,.45)", boxShadow: "0 20px 60px rgba(0,74,198,.18)" }}>
        <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg,#004ac6,#712ae2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 4px 12px rgba(0,74,198,.35)" }}>
          <Ic name="temp_preferences_custom" size={20} fill style={{ color: "#fff" }} />
        </div>
        <input type="text" value={q} onChange={e => setQ(e.target.value)} placeholder="Ask DocFlow AI anything…"
          onKeyDown={e => e.key === "Enter" && setQ("")}
          style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: 14, color: "#191c1e", fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 500 }} />
        <button onClick={() => setQ("")} style={{
          padding: "9px 22px", borderRadius: 99, border: "none", cursor: "pointer",
          background: q ? "linear-gradient(135deg,#004ac6,#2563eb)" : "#191c1e", color: "#f7f9fb",
          fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 13,
          transition: "background .2s, transform .15s", flexShrink: 0,
          boxShadow: q ? "0 4px 14px rgba(0,74,198,.35)" : "none",
        }}
          onMouseEnter={e => e.currentTarget.style.transform = "scale(1.04)"}
          onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>
          Command
        </button>
      </div>
      {/* glow */}
      <div style={{ position: "absolute", bottom: -4, left: "50%", transform: "translateX(-50%)", width: "50%", height: 6, background: "rgba(0,74,198,.18)", filter: "blur(14px)", borderRadius: 99 }} />
    </div>
  );
}

/* ─── Root App ──────────────────────────────────────────────── */
export default function DocFlowApp() {
  return (
    <div className="anim-fade-in" style={{ padding: "48px 40px 40px", maxWidth: 1240, margin: "0 auto" }}>
      <GlobalStyles />
      <HeroSection />
      <AIEngineSection />
      <LearnSection />
      <CoreSection />
      <FloatingDock />
      
      <style>{`
        .anim-fade-in { animation: fadeIn 0.6s ease-out both; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
