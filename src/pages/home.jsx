import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Footer from "../components/Footer";
import HomeLogin from "../components/HomeLogin";
/* â”€â”€ Global Styles â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const GlobalStyles = () => (
    <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Syne:wght@400;500;600;700;800&family=Sora:wght@300;400;500;600;700&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body { font-family: 'Sora', sans-serif; background: #f7f9fb; color: #191c1e; }
    h1, h2, h3 { font-family: 'Syne', sans-serif; }

    .material-symbols-outlined {
      font-family: 'Material Symbols Outlined';
      font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
      font-style: normal; line-height: 1; display: inline-block; vertical-align: middle;
    }

    .text-gradient-primary {
      background: linear-gradient(135deg, #004ac6 0%, #2563eb 100%);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    }
    .dark-glass-card { background: rgba(15,23,42,.6); backdrop-filter: blur(16px); }



    .section-title-underline {
      display: inline-block;
      position: relative;
      padding-bottom: 12px;
      margin-bottom: 24px;
    }
    .section-title-underline::after {
      content: "";
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 80px;
      height: 4px;
      background: linear-gradient(90deg, #2563eb, #3b82f6);
      border-radius: 2px;
    }
    .section-title-left { text-align: left !important; }
    .section-title-left::after { left: 0; transform: none; }

    /* Nav */
    .nav-fixed { position: fixed; top: 0; width: 100%; z-index: 50; background: rgba(255,255,255,.72);
      backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
      box-shadow: 0 12px 32px rgba(0,74,198,.06); transition: all .3s; }
    .nav-inner { display: flex; justify-content: space-between; align-items: center; padding: 16px 32px; }
    .nav-logo { font-family: 'Space Grotesk',sans-serif; font-size: 24px; font-weight: 700;
      letter-spacing: -.03em; background: linear-gradient(135deg,#1d4ed8,#3b82f6);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
    .nav-links { display: flex; align-items: center; gap: 32px; }
    .nav-link { font-family: 'Space Grotesk',sans-serif; font-size: 15px; color: #475569;
      text-decoration: none; letter-spacing: -.01em; transition: all .3s; cursor: pointer; position: relative; padding: 4px 0; }
    .nav-link::after { content: ""; position: absolute; bottom: 0; left: 0; width: 0; height: 2px; background: #2563eb; transition: width .3s ease; }
    .nav-link:hover { color: #004ac6; }
    .nav-link:hover::after { width: 100%; }
    .nav-link.active { color: #1d4ed8; font-weight: 700; }
    .nav-link.active::after { width: 100%; height: 3px; }
    .btn-sign { background: none; border: none; color: #475569; font-size: 15px; font-weight: 500; cursor: pointer; transition: color .2s; font-family: 'Sora',sans-serif; }
    .btn-sign:hover { color: #004ac6; }
    .btn-cta-nav { background: linear-gradient(135deg,#004ac6,#2563eb); color: #fff; padding: 10px 24px;
      border-radius: 12px; border: none; font-size: 15px; font-weight: 700; cursor: pointer;
      box-shadow: 0 8px 24px rgba(0,74,198,.2); transition: transform .2s; font-family: 'Sora',sans-serif; }
    .btn-cta-nav:hover { transform: scale(1.02); }

    /* Hero buttons */
    .btn-hero-primary { background: linear-gradient(135deg,#004ac6,#2563eb); color: #fff;
      padding: 20px 40px; border-radius: 16px; border: none; font-size: 18px; font-weight: 700;
      cursor: pointer; box-shadow: 0 20px 40px rgba(0,74,198,.3); transition: transform .2s; font-family: 'Sora',sans-serif; }
    .btn-hero-primary:hover { transform: scale(1.03); }
    .btn-hero-secondary { background: #e6e8ea; color: #191c1e; padding: 20px 40px; border-radius: 16px;
      border: none; font-size: 18px; font-weight: 700; cursor: pointer; transition: background .2s; font-family: 'Sora',sans-serif; }
    .btn-hero-secondary:hover { background: #e0e3e5; }

    /* Tags */
    .tag-pill { display: inline-flex; align-items: center; gap: 8px; padding: 8px 16px;
      border-radius: 9999px; font-size: 11px; font-weight: 700; text-transform: uppercase;
      letter-spacing: .12em; font-family: 'Plus Jakarta Sans',sans-serif; }
    .tag-primary-light { background: rgba(0,74,198,.05); color: #004ac6; border: 1px solid rgba(0,74,198,.1); }
    .tag-dark-blue { background: rgba(0,74,198,.2); color: #60a5fa; border: 1px solid rgba(0,74,198,.3); }
    .tag-green { background: #6ffbbe; color: #002113; }
    .tag-purple { background: #eaddff; color: #25005a; }

    /* Filter chips */
    .chip { padding: 8px 24px; border-radius: 9999px; font-size: 14px; font-weight: 500;
      cursor: pointer; border: none; transition: all .2s; font-family: 'Sora',sans-serif; }
    .chip.on { background: #004ac6; color: #fff; }
    .chip.off { background: #e0e3e5; color: #191c1e; }
    .chip.off:hover { background: rgba(0,74,198,.1); }

    /* Subject card */
    .sub-card { padding: 24px; background: #fff; border-radius: 16px;
      border: 1px solid rgba(195,198,215,.15); cursor: pointer; transition: all .25s; }
    .sub-card:hover { box-shadow: 0 20px 40px rgba(0,74,198,.05); transform: translateY(-2px); }
    .sub-emoji { font-size: 30px; margin-bottom: 16px; display: block; transition: transform .2s; }
    .sub-card:hover .sub-emoji { transform: scale(1.1); }

    /* Feature card */
    .feat-card { padding: 32px; border-radius: 16px; background: #f2f4f6;
      border: 1px solid transparent; transition: all .25s; }
    .feat-card:hover { background: #fff; border-color: rgba(0,74,198,.1); box-shadow: 0 20px 40px rgba(0,74,198,.05); }
    .feat-icon { width: 56px; height: 56px; border-radius: 12px; background: rgba(0,74,198,.1);
      display: flex; align-items: center; justify-content: center; color: #004ac6;
      margin-bottom: 24px; transition: all .25s; }
    .feat-card:hover .feat-icon { background: #004ac6; color: #fff; }

    /* Resource row */
    .res-row { display: flex; align-items: center; justify-content: space-between;
      padding: 24px; background: #fff; border-radius: 12px;
      box-shadow: 0 1px 4px rgba(0,0,0,.06); transition: box-shadow .2s; }
    .res-row:hover { box-shadow: 0 4px 16px rgba(0,0,0,.1); }

    /* Persona card */
    .pers-card { display: flex; gap: 32px; align-items: center; padding: 40px; background: #fff;
      border-radius: 24px; box-shadow: 0 20px 60px rgba(0,0,0,.08); border: 1px solid rgba(195,198,215,.1); }

    /* Workspace tab */
    .ws-tab { padding: 10px 24px; border-radius: 12px; font-size: 14px; font-weight: 700;
      cursor: pointer; border: none; transition: all .2s; font-family: 'Sora',sans-serif; }
    .ws-tab.on { background: #004ac6; color: #fff; }
    .ws-tab.off { background: transparent; color: rgba(255,255,255,.6); }
    .ws-tab.off:hover { color: #fff; }

    /* Step circle */
    .step-num { width: 64px; height: 64px; border-radius: 9999px; background: #004ac6; color: #fff;
      display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: 700;
      margin: 0 auto 24px; box-shadow: 0 8px 24px rgba(0,74,198,.2); position: relative; z-index: 1; }

    /* Pricing card */
    .price-card { padding: 32px; border-radius: 24px; display: flex; flex-direction: column; height: 100%; }
    .price-starter { background: #f2f4f6; border: 1px solid rgba(195,198,215,.15); }
    .price-pro { background: #fff; border: 2px solid #004ac6;
      box-shadow: 0 20px 60px rgba(0,74,198,.1); transform: scale(1.05); position: relative; }
    .price-biz { background: #f2f4f6; border: 1px solid rgba(195,198,215,.15); }
    .price-badge { position: absolute; top: -16px; left: 50%; transform: translateX(-50%);
      background: #004ac6; color: #fff; padding: 4px 16px; border-radius: 9999px;
      font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .1em; white-space: nowrap; }
    .price-feat { display: flex; align-items: center; gap: 8px; font-size: 14px; margin-bottom: 16px; }
    .btn-price-out { width: 100%; padding: 16px; border-radius: 12px; border: 2px solid #004ac6;
      color: #004ac6; background: none; font-size: 15px; font-weight: 700; cursor: pointer;
      transition: background .2s; font-family: 'Sora',sans-serif; }
    .btn-price-out:hover { background: rgba(0,74,198,.05); }
    .btn-price-fill { width: 100%; padding: 16px; border-radius: 12px;
      background: linear-gradient(135deg,#004ac6,#2563eb); color: #fff; border: none;
      font-size: 15px; font-weight: 700; cursor: pointer; box-shadow: 0 8px 24px rgba(0,74,198,.2);
      transition: transform .2s; font-family: 'Sora',sans-serif; }
    .btn-price-fill:hover { transform: scale(1.02); }

    /* Footer */
    .foot-link { color: #64748b; text-decoration: none; font-size: 14px; transition: color .2s; }
    .foot-link:hover { color: #3b82f6; text-decoration: underline; }



    /* Responsive */
    @media(max-width:900px){
      .hero-flex { flex-direction: column; text-align: center !important; }
      .hero-text { text-align: center !important; }
      .hero-btns { justify-content: center !important; }
      .nav-links, .btn-sign { display: none !important; }
      .hero-h1 { font-size: 44px !important; }
      .subs-grid { grid-template-columns: repeat(2,1fr) !important; }
      .feats-grid { grid-template-columns: 1fr !important; }
      .pers-card { flex-direction: column; }
      .steps-row { grid-template-columns: 1fr !important; }
      .steps-row::before { display: none !important; }
      .price-grid { grid-template-columns: 1fr !important; }
      .price-pro { transform: none !important; }
      .ws-layout { flex-direction: column !important; }
      .dual-cta { flex-direction: column; }
      .foot-grid { grid-template-columns: 1fr 1fr !important; }
      .pers-grid { grid-template-columns: 1fr !important; }
      .res-grid { grid-template-columns: 1fr !important; }
    }

    /* Modal / Overlay */
    .modal-ovl {
      position: fixed; inset: 0; background: rgba(15,23,42,0.4); 
      backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
      z-index: 9999; display: flex; align-items: center; justify-content: center;
      padding: 20px; animation: modalIn 0.36s cubic-bezier(0.16, 1, 0.3, 1);
    }
    @keyframes modalIn {
      from { opacity: 0; transform: scale(0.96) translateY(10px); }
      to { opacity: 1; transform: scale(1) translateY(0); }
    }
  `}</style>
);

/* ── Nav ────────────────────────────────────────────────────────── */
function Nav({ onLoginClick }) {
    const [sc, setSc] = useState(false);
    const location = useLocation();
    useEffect(() => {
        const h = () => setSc(window.scrollY > 20);
        window.addEventListener("scroll", h);
        return () => window.removeEventListener("scroll", h);
    }, []);
    return (
        <nav className="nav-fixed" style={{ boxShadow: sc ? "0 12px 32px rgba(0,74,198,.08)" : "0 12px 32px rgba(0,74,198,.06)" }}>
            <div className="nav-inner">
                <Link to="/" className="nav-logo" style={{ textDecoration: 'none' }}>DocFlow AI</Link>
                <div className="nav-links">
                    {["Education Hub", "Platform", "Workspace", "How It Works", "Pricing"].map((l) => {
                        const isActive = (l === "Education Hub" && location.pathname === "/education-hub") ||
                            (l === "Platform" && location.pathname === "/platform") ||
                            (l === "Workspace" && location.pathname === "/workspace") ||
                            (l === "Pricing" && location.hash === "#pricing") ||
                            (l === "How It Works" && location.hash === "#how-it-works");

                        if (l === "Education Hub") return <Link key={l} to="/education-hub" className={`nav-link${isActive ? " active" : ""}`}>{l}</Link>;
                        if (l === "Platform") return <Link key={l} to="/platform" className={`nav-link${isActive ? " active" : ""}`}>{l}</Link>;
                        if (l === "Workspace") return <Link key={l} to="/workspace" className={`nav-link${isActive ? " active" : ""}`}>{l}</Link>;
                        if (l === "How It Works") return <a key={l} href="#how-it-works" className={`nav-link${isActive ? " active" : ""}`}>{l}</a>;
                        if (l === "Pricing") return <a key={l} href="#pricing" className={`nav-link${isActive ? " active" : ""}`}>{l}</a>;
                        return <a key={l} href="#" className={`nav-link${isActive ? " active" : ""}`}>{l}</a>;
                    })}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <button className="btn-sign" onClick={onLoginClick}>Sign In</button>
                    <button className="btn-cta-nav">Start Free</button>
                </div>
            </div>
        </nav>
    );
}


/* ── Hero ───────────────────────────────────────────────────────── */
function Hero({ onLoginClick }) {
    return (
        <section style={{ position: "relative", paddingTop: 128, paddingBottom: 80, paddingLeft: 32, paddingRight: 32, overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: "100%", height: 600, background: "linear-gradient(to bottom,#eff6ff,transparent)", zIndex: -1 }} />
            <div style={{ maxWidth: 1280, margin: "0 auto" }}>
                <div className="hero-flex" style={{ display: "flex", gap: 64, alignItems: "center", textAlign: "left" }}>
                    <div className="hero-text" style={{ flex: 1.2 }}>
                        <div className="tag-pill tag-primary-light" style={{ marginBottom: 32 }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 16, fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                            The Future of Intelligent Learning
                        </div>
                        <h1 className="hero-h1" style={{ fontSize: "clamp(2.5rem,5vw,72px)", fontWeight: 900, marginBottom: 32, lineHeight: 1.1, letterSpacing: "-.04em" }}>
                            Learn Free. <span className="text-gradient-primary">Build Smart.</span><br />Automate Everything.
                        </h1>
                        <p style={{ fontSize: 19, color: "#434655", maxWidth: 640, marginBottom: 48, lineHeight: 1.7 }}>
                            Unlock the world's knowledge with our open Education Hub, then transform your workflows using the most advanced AI Workspace built for educators and students.
                        </p>
                        <div className="hero-btns" style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
                            <button className="btn-hero-primary" onClick={onLoginClick}>Join Now</button>
                            <Link to="/platform" style={{ textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px 32px", fontSize: 16 }} className="btn-hero-secondary">Try AI Tools</Link>
                        </div>
                    </div>

                    <div style={{ flex: 0.8, minWidth: 320 }}>
                        <div style={{ position: "relative" }}>
                            <div style={{ position: "absolute", inset: 0, background: "rgba(0,74,198,.12)", filter: "blur(120px)", borderRadius: "50%", transform: "scale(.75)", zIndex: -1 }} />
                            <img
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB9W6432-vU8VzivRwHxALlMrPe8mVelueB0wBbFzOabhAgxVmg9pfCO7n3MTUKMZPgyXyrRWNN5GWZZeQvMMxSXtKKgz4dXdUUvINt7v2yPkr8ke5rJ_5FmoFq3I7m6K2aELfee56NWFrZXkgyEZkpWl2GsjNblI9mUXu7Bmo0T5-tbPfruhZPch4JqSxRkY0WWEacTL1LsdAzrqw-VRPK6AUiuCRmGY-QHAcr0nA1Bkoao1S_rSIlqADaWqJi5kYW7sYYPqvuUiAj"
                                alt="DocFlow AI dashboard"
                                style={{ width: "100%", borderRadius: 24, boxShadow: "0 40px 80px rgba(0,0,0,.1)", border: "1px solid rgba(255,255,255,.5)", display: "block" }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}


/* ── Education Hub ─────────────────────────────────────────────── */
function EducationHub() {
    const [active, setActive] = useState("All Topics");
    const filters = ["All Topics", "IT", "AI", "CS", "DSA"];
    const [subjects, setSubjects] = useState([]);

    useEffect(() => {
        fetch("/api/subjects")
            .then(res => res.json())
            .then(data => setSubjects(data))
            .catch(err => console.error("Failed to fetch subjects:", err));
    }, []);
    return (
        <section id="education-hub" style={{ padding: "96px 32px", background: "#f2f4f6" }}>
            <div style={{ maxWidth: 1280, margin: "0 auto" }}>
                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 32, marginBottom: 64, flexWrap: "wrap" }}>
                    <div style={{ maxWidth: 600 }}>
                        <Link to="/education-hub" style={{ textDecoration: 'none', color: 'inherit' }}>
                            <h2 className="section-title-underline section-title-left" style={{ fontSize: "clamp(2rem,4vw,48px)", fontWeight: 700, cursor: 'pointer' }}>Education Hub</h2>
                        </Link>
                        <p style={{ fontSize: 18, color: "#434655", lineHeight: 1.65 }}>Access curated learning paths and thousands of free resources across all major academic and technical disciplines.</p>
                    </div>
                    <div style={{ position: "relative", width: "100%", maxWidth: 384 }}>
                        <span className="material-symbols-outlined" style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "#737686" }}>search</span>
                        <input type="text" placeholder="Search subjects, IT, AI..." style={{ width: "100%", paddingLeft: 48, paddingRight: 16, paddingTop: 16, paddingBottom: 16, borderRadius: 12, border: "none", outline: "none", background: "#fff", boxShadow: "0 0 0 1px rgba(195,198,215,.3)", fontSize: 15, fontFamily: "'Sora',sans-serif" }} />
                    </div>
                </div>
                {/* Filters */}
                <div style={{ display: "flex", gap: 12, marginBottom: 48, flexWrap: "wrap" }}>
                    {filters.map(f => <button key={f} className={`chip ${active === f ? "on" : "off"}`} onClick={() => setActive(f)}>{f}</button>)}
                </div>
                {/* Grid */}
                <div className="subs-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
                    {subjects.filter(s => active === "All Topics" || (s.tags && s.tags.includes(active))).map(s => (
                        <div key={s.name} className="sub-card">
                            <span className="sub-emoji">{s.icon}</span>
                            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{s.name}</div>
                            <div style={{ fontSize: 12, color: "#434655" }}>{s.count} Resources</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ── Our Features ────────────────────────────────────────────────── */
function Features() {
    const feats = [
        { ic: "school", t: "500+ Free Courses", d: "Curated from elite universities and top-tier educators worldwide, all in one place." },
        { ic: "manage_search", t: "Smart Search", d: "Semantic AI search that finds specific concepts across thousands of video lessons and PDFs." },
        { ic: "download", t: "Unlimited Downloads", d: "Take your library offline. One-click downloads for notes, slides, and generated summaries." },
        { ic: "style", t: "Flashcards", d: "AI-generated flashcards using spaced repetition algorithms to ensure you never forget." },
        { ic: "forum", t: "Community Notes", d: "Collaborative workspace to share insights and annotations with a global network of peers." },
        { ic: "smartphone", t: "Mobile Friendly", d: "A seamless experience across all devices. Study on the train, review at home." },
        { ic: "auto_fix_high", t: "AI Content Generation", d: "Instantly create quizzes, study guides, and lesson plans tailored to your curriculum." },
        { ic: "analytics", t: "Progress Analytics", d: "Track your learning journey with detailed insights, heatmaps, and performance metrics." },
    ];
    return (
        <section id="features" style={{ padding: "96px 32px" }}>
            <div style={{ maxWidth: 1280, margin: "0 auto" }}>
                <div style={{ textAlign: "center", marginBottom: 80 }}>
                    <div className="tag-pill tag-primary-light" style={{ marginBottom: 16 }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>star</span>
                        Why DocFlow AI?
                    </div>
                    <h2 className="section-title-underline" style={{ fontSize: "clamp(1.8rem,3.5vw,40px)", fontWeight: 700, marginBottom: 16 }}>Our Features</h2>
                    <p style={{ color: "#434655", fontSize: 16 }}>Everything you need to master any subject and automate your workflow.</p>
                </div>
                <div className="feats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 24 }}>
                    <style>{`
                        @media(max-width:1100px){ .feats-grid { grid-template-columns: repeat(2,1fr) !important; } }
                        @media(max-width:700px){ .feats-grid { grid-template-columns: 1fr !important; } }
                    `}</style>
                    {feats.map(f => (
                        <div key={f.t} className="feat-card" style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: "flex-start", padding: "28px" }}>
                            <div className="feat-icon" style={{ flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", width: 52, height: 52, marginBottom: 8 }}>
                                <span className="material-symbols-outlined" style={{ fontSize: 26, display: "block", textAlign: "center" }}>{f.ic}</span>
                            </div>
                            <div>
                                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{f.t}</h3>
                                <p style={{ color: "#434655", lineHeight: 1.6, fontSize: 14 }}>{f.d}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}


/* ── AI Workspace ─────────────────────────────────────────────────── */
function AIWorkspace() {
    const [tab, setTab] = useState("engine");
    const tabs = [{ id: "engine", l: "DocFlow AI Engine" }, { id: "learn", l: "DocFlow Learn" }, { id: "core", l: "DocFlow Core" }];
    const content = {
        engine: [
            { ic: "video_library", t: "AI Video Lessons", d: "Automatically generate structured curriculum and interactive video chapters from raw recordings." },
            { ic: "auto_fix_high", t: "AI Generation", d: "Create quizzes, study guides, and complex summaries with a single natural language prompt." },
            { ic: "description", t: "Lecture → Notes", d: "Instant transcription and smart note-taking that captures every key insight from your live sessions." },
        ],
        learn: [
            { ic: "school", t: "Course Builder", d: "Drag-and-drop course creation with modular lesson planning, prerequisites, and live scheduling." },
            { ic: "quiz", t: "Smart Assessments", d: "Adaptive quizzes that adjust difficulty in real-time based on learner performance data." },
            { ic: "workspace_premium", t: "Certification Engine", d: "Issue verifiable digital certificates with custom branding and instant LinkedIn sharing." },
        ],
        core: [
            { ic: "scanner", t: "Document Processing", d: "OCR-powered extraction transforms scanned PDFs, images, and slides into editable, searchable content." },
            { ic: "summarize", t: "AI Summarization", d: "Compress 100-page reports into crisp executive summaries with configurable depth and tone." },
            { ic: "draw", t: "E-Signature", d: "Legally-binding digital signatures integrated directly into your document automation pipeline." },
        ],
    };
    return (
        <section id="workspace" style={{ padding: "96px 0", background: "#020617", color: "#fff", overflow: "hidden" }}>
            <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px" }}>
                <div className="ws-layout" style={{ display: "flex", gap: 64, alignItems: "center" }}>
                    {/* Left */}
                    <div style={{ flex: 1 }}>
                        <div className="tag-pill tag-dark-blue" style={{ marginBottom: 32 }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 16, fontVariationSettings: "'FILL' 1" }}>neurology</span>
                            The Professional Workspace
                        </div>
                        <h2 className="section-title-underline section-title-left" style={{ fontSize: "clamp(2rem,4.5vw,56px)", fontWeight: 700, marginBottom: 32, lineHeight: 1.2 }}>
                            Elevate Teaching &amp; Learning with <span style={{ color: "#3b82f6" }}>AI Core.</span>
                        </h2>
                        {/* Tab switcher */}
                        <div style={{ display: "inline-flex", gap: 4, padding: 6, background: "rgba(255,255,255,.05)", borderRadius: 16, marginBottom: 16 }}>
                            {tabs.map(t => (
                                <button key={t.id} className={`ws-tab ${tab === t.id ? "on" : "off"}`} onClick={() => setTab(t.id)}>{t.l}</button>
                            ))}
                        </div>
                        {/* Tab content */}
                        <div style={{ padding: 32, borderRadius: 16, background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)" }}>
                            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 24 }}>
                                {content[tab].map(f => (
                                    <li key={f.t} style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                                        <span className="material-symbols-outlined" style={{ color: "#60a5fa", marginTop: 2, flexShrink: 0 }}>{f.ic}</span>
                                        <div>
                                            <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 4 }}>{f.t}</div>
                                            <p style={{ color: "rgba(255,255,255,.6)", fontSize: 14, lineHeight: 1.65 }}>{f.d}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    {/* Right â€“ image */}
                    <div style={{ flex: 1, position: "relative" }}>
                        <div style={{ position: "absolute", inset: 0, background: "rgba(37,99,235,.25)", filter: "blur(120px)", zIndex: 0 }} />
                        <div className="dark-glass-card" style={{ padding: 4, borderRadius: 24, border: "1px solid rgba(255,255,255,.1)", boxShadow: "0 40px 80px rgba(0,0,0,.4)", position: "relative", zIndex: 1 }}>
                            <img
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDFA3alkhJ0yBWo4mgvjqqOUUcUOr9HyCbvsYaHNoyPPq3jVlvY6-oMzSZ_RqXxY80dkjQ5j-BymapunogirnWuAabqSb2rWfzUEGaEl5Cr32TMVcwb_FkNjsqHWbP3tA2qFPPlXpvKFWet06JnlRA1Q2CPRUTGqqzFpRkxwqA_LuyV4djmWWPO0A7ap2dOPiz7WmqhLqEyuXE_8jGi0PV0wrM-E_b6S1MURRPEyufzFnfJwUAc1mdDt03VU3GE8mxo9YQQQeeybzUM"
                                alt="AI workspace"
                                style={{ borderRadius: 20, width: "100%", display: "block" }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

/* ── How It Works ─────────────────────────────────────────────────── */
function HowItWorks() {
    const [path, setPath] = useState("student");
    const steps = {
        student: [
            { n: 1, t: "Connect Sources", d: "Upload documents, link video lectures, or browse the Hub." },
            { n: 2, t: "AI Processing", d: "Our engine extracts insights and creates your custom workspace." },
            { n: 3, t: "Master & Automate", d: "Learn faster with flashcards or automate teaching tasks effortlessly." },
        ],
        educator: [
            { n: 1, t: "Upload Content", d: "Drop in raw recordings, PDFs, or link your existing course materials." },
            { n: 2, t: "AI Transforms", d: "The engine creates structured lessons, quizzes, and summaries automatically." },
            { n: 3, t: "Publish & Earn", d: "Launch your course in minutes and reach thousands of eager learners." },
        ],
    };
    return (
        <section id="how-it-works" style={{ padding: "96px 32px", background: "#f7f9fb" }}>
            <div style={{ maxWidth: 1280, margin: "0 auto" }}>
                <div style={{ textAlign: "center", marginBottom: 64 }}>
                    <h2 className="section-title-underline" style={{ fontSize: "clamp(1.8rem,3.5vw,40px)", fontWeight: 700, marginBottom: 32 }}>How It Works</h2>
                    <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
                        {[["student", "Student Path"], ["educator", "Educator Path"]].map(([id, label]) => (
                            <button key={id} onClick={() => setPath(id)} style={{ padding: "12px 32px", borderRadius: "9999px", border: "none", cursor: "pointer", fontWeight: 700, fontFamily: "'Sora',sans-serif", transition: "all .2s", background: path === id ? "#004ac6" : "#e6e8ea", color: path === id ? "#fff" : "#191c1e" }}>{label}</button>
                        ))}
                    </div>
                </div>
                <div className="steps-row" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 48, position: "relative" }}>
                    <div style={{ position: "absolute", top: 32, left: 0, width: "100%", height: 1, background: "linear-gradient(90deg,transparent,#c3c6d7,transparent)", zIndex: 0 }} />
                    {steps[path].map(s => (
                        <div key={s.n} style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                            <div className="step-num">{s.n}</div>
                            <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>{s.t}</h3>
                            <p style={{ color: "#434655", lineHeight: 1.65, fontSize: 15 }}>{s.d}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}



/* ── Pricing ──────────────────────────────────────────────────────── */
function Pricing() {
    const [currency, setCurrency] = useState("INR");
    const plans = [
        {
            cls: "price-starter", name: "Starter",
            price: currency === "USD" ? "$0" : "₹0",
            note: "/mo", cta: "Get Started", fill: false,
            feats: ["All Hub Courses", "5 AI Workspace Runs", "Smart Search (Basic)"]
        },
        {
            cls: "price-pro", name: "Pro",
            price: currency === "USD" ? "$29" : "₹2,299",
            note: "/mo", cta: "Go Pro", fill: true,
            feats: ["Unlimited AI Workspace", "Custom Course Builder", "Bulk Document Uploads", "Priority Support"]
        },
        {
            cls: "price-biz", name: "Business",
            price: currency === "USD" ? "$99" : "₹7,999",
            note: "/mo", cta: "Contact Sales", fill: false,
            feats: ["Team Workspaces", "Dedicated AI Engine", "API Access", "Admin Controls"]
        },
    ];
    return (
        <section id="pricing" style={{ padding: "96px 32px" }}>
            <div style={{ maxWidth: 1280, margin: "0 auto" }}>
                <div style={{ textAlign: "center", marginBottom: 64 }}>
                    <h2 className="section-title-underline" style={{ fontSize: "clamp(1.8rem,3.5vw,40px)", fontWeight: 700, marginBottom: 16 }}>Simple, Transparent Pricing</h2>
                    <p style={{ color: "#434655", fontSize: 16, marginBottom: 32 }}>Free for students, powerful for professionals.</p>

                    {/* Currency Toggle */}
                    <div style={{ display: "inline-flex", background: "#f1f5f9", padding: 4, borderRadius: 12, marginBottom: 20 }}>
                        {["INR", "USD"].map(curr => (
                            <button
                                key={curr}
                                onClick={() => setCurrency(curr)}
                                style={{
                                    padding: "10px 24px", borderRadius: 10, border: "none",
                                    background: currency === curr ? "#fff" : "transparent",
                                    color: currency === curr ? "#004ac6" : "#64748b",
                                    fontWeight: 700, fontSize: 14, cursor: "pointer",
                                    boxShadow: currency === curr ? "0 4px 12px rgba(0,0,0,0.05)" : "none",
                                    transition: "all 0.2s"
                                }}
                            >
                                {curr}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="price-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 32, alignItems: "center" }}>
                    {plans.map(p => (
                        <div key={p.name} className={`price-card ${p.cls}`}>
                            {p.cls === "price-pro" && <div className="price-badge">Most Popular</div>}
                            <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 8 }}>{p.name}</div>
                            <div style={{ marginBottom: 24 }}>
                                <span style={{ fontSize: 40, fontWeight: 700 }}>{p.price}</span>
                                <span style={{ fontSize: 14, color: "#434655" }}>{p.note}</span>
                            </div>
                            <div style={{ flex: 1, marginBottom: 40 }}>
                                {p.feats.map(f => (
                                    <div key={f} className="price-feat">
                                        <span className="material-symbols-outlined" style={{ color: "#004ac6", fontSize: 20, fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                                        {f}
                                    </div>
                                ))}
                            </div>
                            {p.fill
                                ? <button className="btn-price-fill">{p.cta}</button>
                                : <button className="btn-price-out">{p.cta}</button>}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ── Dual CTA ─────────────────────────────────────────────────────── */
function DualCTA() {
    return (
        <div className="dual-cta" style={{ display: "flex" }}>
            <div style={{ flex: 1, padding: "96px 32px", background: "#dbe1ff", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
                <h2 style={{ fontSize: "clamp(1.8rem,3.5vw,40px)", fontWeight: 700, marginBottom: 24, color: "#00174b" }}>Education is a Right.</h2>
                <p style={{ marginBottom: 32, maxWidth: 400, lineHeight: 1.65, color: "#003ea8", fontSize: 16 }}>Start your learning journey today with our completely free Education Hub.</p>
                <Link to="/education-hub" style={{ textDecoration: 'none' }}>
                    <button style={{ padding: "16px 40px", background: "#004ac6", color: "#fff", borderRadius: 12, border: "none", fontWeight: 700, fontSize: 16, cursor: "pointer", transition: "transform .2s", fontFamily: "'Sora',sans-serif", display: "flex", alignItems: "center", gap: 8 }}
                        onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
                        onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>
                        <span className="material-symbols-outlined">explore</span>
                        Explore Free Hub
                    </button>
                </Link>
            </div>
            <div style={{ flex: 1, padding: "96px 32px", background: "#020617", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
                <h2 style={{ fontSize: "clamp(1.8rem,3.5vw,40px)", fontWeight: 700, marginBottom: 24, color: "#fff" }}>AI do the heavy lifting.</h2>
                <p style={{ marginBottom: 32, maxWidth: 400, lineHeight: 1.65, color: "rgba(255,255,255,.6)", fontSize: 16 }}>Automate your teaching workflow and unlock professional-grade productivity.</p>
                <Link to="/ai-engine" style={{ textDecoration: 'none' }}>
                    <button style={{ padding: "16px 40px", background: "#fff", color: "#020617", borderRadius: 12, border: "none", fontWeight: 700, fontSize: 16, cursor: "pointer", transition: "transform .2s", fontFamily: "'Sora',sans-serif", display: "flex", alignItems: "center", gap: 8 }}
                        onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
                        onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>
                        <span className="material-symbols-outlined">rocket_launch</span>
                        Start AI Workspace
                    </button>
                </Link>
            </div>
        </div>
    );
}


/* ── Root ─────────────────────────────────────────────────────────── */
export default function DocFlowAIApp() {
    const navigate = useNavigate();
    const [showLogin, setShowLogin] = useState(false);
    
    const handleLoginClick = () => {
        setShowLogin(true);
    };

    return (
        <div style={{ position: "relative" }}>
            <GlobalStyles />
            <Nav onLoginClick={handleLoginClick} />
            <Hero onLoginClick={handleLoginClick} />
            <EducationHub />
            <Features />
            <AIWorkspace />
            <HowItWorks />
            <Pricing />
            <DualCTA />
            <Footer />

            {showLogin && (
                <div className="modal-ovl" onClick={(e) => e.target === e.currentTarget && setShowLogin(false)}>
                    <div style={{ width: "100%", maxWidth: 460 }}>
                        <HomeLogin onClose={() => setShowLogin(false)} />
                    </div>
                </div>
            )}
        </div>
    );
}
