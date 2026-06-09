import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Footer from "../components/Footer";

export default function Dashboard() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [stats, setStats] = useState({
    activeCourses: 0,
    hoursStudied: 0,
    notesSaved: 0,
    quizzesTaken: 0,
    docsProcessed: 0,
  });
  const [recentCourses, setRecentCourses] = useState([]);
  const [recentNotes, setRecentNotes] = useState([]);
  const [greeting, setGreeting] = useState("Hello");
  const [user, setUser] = useState({ name: "Pratibha", profilePicture: null });

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 17) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  useEffect(() => {
    // 1. Get initial data from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed.name) {
          setUser(prev => ({ ...prev, ...parsed }));
        }
      } catch (e) {
        console.error("Error parsing user from localStorage", e);
      }
    }

    // 2. Fetch latest profile from backend to ensure synchronization
    const token = localStorage.getItem("token");
    if (token) {
      fetch("/api/settings/profile", {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => {
          if (!res.ok) throw new Error("Failed to fetch profile");
          return res.json();
        })
        .then(data => {
          if (data && data.name) {
            setUser({
              name: data.name,
              profilePicture: data.profilePicture || null
            });
            // Update localStorage
            const updatedUser = {
              name: data.name,
              email: data.email,
              profilePicture: data.profilePicture || null,
              provider: data.provider || 'local'
            };
            localStorage.setItem("user", JSON.stringify(updatedUser));
          }
        })
        .catch(err => console.error("Error fetching user profile:", err));
    }
  }, []);

  const getInitials = (name) => {
    if (!name) return "PA";
    const parts = name.trim().split(/\s+/);
    return parts.length >= 2
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : parts[0][0].toUpperCase();
  };

  useEffect(() => {
    fetch("/api/notes")
      .then(res => res.json())
      .then(data => {
        setStats(prev => ({ ...prev, notesSaved: data.length }));
        setRecentNotes(data.slice(0, 4));
      })
      .catch(err => console.error(err));

    fetch("/api/courses")
      .then(res => res.json())
      .then(data => {
        setStats(prev => ({ ...prev, activeCourses: data.length }));
        setRecentCourses(data.slice(0, 3));
      })
      .catch(err => console.error(err));

    fetch("/api/workspace")
      .then(res => res.json())
      .then(data => {
        setStats(prev => ({
          ...prev,
          quizzesTaken: data.quizzesGenerated,
          docsProcessed: data.docsProcessed,
          hoursStudied: Math.round(data.docsProcessed * 0.4 * 10) / 10
        }));
      })
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const handleLogout = () => {
    alert("Logging out...");
    navigate("/");
  };

  /* ── Quick Access Pages ── */
  const quickAccess = [
    { title: "AI Workspace", desc: "Unified AI-powered workspace hub", icon: "🧠", path: "/workspace", gradient: "linear-gradient(135deg, #6366f1, #8b5cf6)", glow: "rgba(99,102,241,0.25)" },
    { title: "AI Engine", desc: "Generate quizzes, summaries & more", icon: "⚡", path: "/ai-engine", gradient: "linear-gradient(135deg, #f59e0b, #ef4444)", glow: "rgba(245,158,11,0.25)" },
    { title: "Browse Courses", desc: "Explore all available learning paths", icon: "📚", path: "/courses", gradient: "linear-gradient(135deg, #10b981, #059669)", glow: "rgba(16,185,129,0.25)" },
    { title: "My Notes", desc: "View and manage your saved notes", icon: "📝", path: "/notes", gradient: "linear-gradient(135deg, #3b82f6, #2563eb)", glow: "rgba(59,130,246,0.25)" },
    { title: "Education Hub", desc: "Free curated educational resources", icon: "🎓", path: "/education-hub", gradient: "linear-gradient(135deg, #ec4899, #db2777)", glow: "rgba(236,72,153,0.25)" },
    { title: "DocFlow Learn", desc: "Course builder & smart assessments", icon: "🏫", path: "/docflow-learn", gradient: "linear-gradient(135deg, #14b8a6, #0d9488)", glow: "rgba(20,184,166,0.25)" },
    { title: "DocFlow Core", desc: "Document processing & e-signature", icon: "📄", path: "/docflow-core", gradient: "linear-gradient(135deg, #64748b, #475569)", glow: "rgba(100,116,139,0.25)" },
    { title: "Help Center", desc: "FAQs, guides & support resources", icon: "❓", path: "/help", gradient: "linear-gradient(135deg, #a78bfa, #7c3aed)", glow: "rgba(167,139,250,0.25)" },
    { title: "Settings", desc: "Theme, profile & preferences", icon: "⚙️", path: "/settings", gradient: "linear-gradient(135deg, #78716c, #57534e)", glow: "rgba(120,113,108,0.25)" },
  ];

  /* ── AI Tool Highlights ── */
  const aiTools = [
    { title: "AI Video Lessons", desc: "Auto-generate structured curriculum from raw recordings", icon: "🎬", link: "/ai-engine" },
    { title: "Smart Quiz Generator", desc: "Create adaptive quizzes from any content with AI", icon: "🧩", link: "/ai-engine" },
    { title: "Document Summarizer", desc: "Compress long documents into crisp summaries", icon: "📋", link: "/docflow-core" },
    { title: "Lecture → Notes", desc: "Instant transcription & smart note-taking", icon: "✍️", link: "/ai-engine" },
    { title: "Flashcard Engine", desc: "AI-generated flashcards with spaced repetition", icon: "🃏", link: "/docflow-learn" },
    { title: "E-Signature", desc: "Legally-binding digital signatures in your pipeline", icon: "🖊️", link: "/docflow-core" },
  ];

  const completionPercent = Math.min(100, Math.round(
    ((stats.activeCourses > 0 ? 20 : 0) +
     (stats.notesSaved > 0 ? 20 : 0) +
     (stats.quizzesTaken > 0 ? 20 : 0) +
     (stats.hoursStudied > 0 ? 20 : 0) +
     (stats.docsProcessed > 0 ? 20 : 0))
  ));

  return (
    <div style={{ fontFamily: "'Sora', sans-serif", background: "var(--bg-primary, #f8fafc)", color: "var(--text-primary, #0f172a)", minHeight: "100vh", position: "relative", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');

        .dash-card {
          background: var(--bg-secondary, #ffffff);
          border: 1px solid var(--border-color, #e2e8f0);
          border-radius: 24px;
          padding: 32px;
          transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: var(--card-shadow, 0 4px 20px rgba(0,0,0,0.06));
        }
        .dash-card:hover {
          transform: translateY(-6px);
          border-color: var(--accent-primary, #2563eb);
          box-shadow: 0 20px 50px rgba(37,99,235,0.12);
        }

        .quick-card {
          background: var(--bg-secondary, #ffffff);
          border: 1px solid var(--border-color, #e2e8f0);
          border-radius: 20px;
          padding: 28px;
          cursor: pointer;
          transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: var(--card-shadow, 0 2px 12px rgba(0,0,0,0.04));
          text-decoration: none;
          color: inherit;
          display: flex;
          flex-direction: column;
          gap: 14px;
          position: relative;
          overflow: hidden;
        }
        .quick-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          border-radius: 20px 20px 0 0;
          opacity: 0;
          transition: opacity 0.3s;
        }
        .quick-card:hover::before {
          opacity: 1;
        }
        .quick-card:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 24px 48px rgba(0,0,0,0.12);
          border-color: transparent;
        }

        .tool-chip {
          background: var(--bg-secondary, #ffffff);
          border: 1px solid var(--border-color, #e2e8f0);
          border-radius: 16px;
          padding: 20px 24px;
          cursor: pointer;
          transition: all 0.3s;
          text-decoration: none;
          color: inherit;
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .tool-chip:hover {
          transform: translateX(8px);
          background: var(--bg-tertiary, #f1f5f9);
          box-shadow: 0 8px 24px rgba(0,0,0,0.08);
        }

        .stat-card {
          background: var(--bg-secondary, #ffffff);
          border: 1px solid var(--border-color, #e2e8f0);
          border-radius: 20px;
          padding: 28px;
          transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: var(--card-shadow, 0 2px 12px rgba(0,0,0,0.04));
          display: flex;
          align-items: center;
          gap: 20px;
          position: relative;
          overflow: hidden;
        }
        .stat-card::after {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 120px;
          height: 120px;
          border-radius: 50%;
          filter: blur(40px);
          opacity: 0.08;
          pointer-events: none;
          transition: opacity 0.3s;
        }
        .stat-card:hover::after {
          opacity: 0.15;
        }
        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 40px rgba(0,0,0,0.1);
        }

        .progress-ring {
          position: relative;
          width: 160px;
          height: 160px;
        }

        .note-preview {
          background: var(--bg-secondary, #ffffff);
          border: 1px solid var(--border-color, #e2e8f0);
          border-radius: 14px;
          padding: 18px 20px;
          transition: all 0.25s;
          cursor: pointer;
        }
        .note-preview:hover {
          background: var(--bg-tertiary, #f1f5f9);
          transform: translateX(4px);
        }

        .btn-logout {
          background: rgba(239, 68, 68, 0.08);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.2);
          border-radius: 12px;
          padding: 10px 22px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 0.85rem;
        }
        .btn-logout:hover {
          background: #ef4444;
          color: white;
          transform: scale(1.05);
        }

        .avatar {
          width: 42px; height: 42px; border-radius: 12px;
          background: linear-gradient(135deg, #2563eb, #7c3aed);
          display: flex; align-items: center; justify-content: center;
          font-size: 1rem; font-weight: 800; cursor: pointer;
          color: #fff; transition: transform 0.2s;
        }
        .avatar:hover { transform: rotate(10deg) scale(1.1); }

        .section-label {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(37,99,235,0.08);
          color: var(--accent-primary, #3b82f6);
          padding: 6px 16px;
          border-radius: 100px;
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          border: 1px solid rgba(37,99,235,0.15);
          margin-bottom: 20px;
        }

        .course-tag {
          display: inline-block;
          font-size: 0.7rem;
          font-weight: 800;
          padding: 4px 12px;
          border-radius: 100px;
          margin-bottom: 16px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes countUp {
          from { opacity: 0; transform: scale(0.5); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes shimmerBg {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }

        .animate-fade { animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both; }
        .animate-delay-1 { animation-delay: 0.08s; }
        .animate-delay-2 { animation-delay: 0.16s; }
        .animate-delay-3 { animation-delay: 0.24s; }
        .animate-delay-4 { animation-delay: 0.32s; }
        .animate-delay-5 { animation-delay: 0.40s; }
        .animate-delay-6 { animation-delay: 0.48s; }

        @media(max-width: 1100px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .quick-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .tool-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .courses-grid { grid-template-columns: 1fr !important; }
        }

        @media(max-width: 768px) {
          nav { padding: 0 24px !important; }
          .nav-links { display: none !important; }
          .hamburger { display: flex !important; }
          main { padding: 100px 20px 60px !important; }
          header h1 { font-size: 2rem !important; }
          .stats-grid { grid-template-columns: 1fr !important; }
          .quick-grid { grid-template-columns: 1fr !important; }
          .tool-grid { grid-template-columns: 1fr !important; }
          .bottom-bento { grid-template-columns: 1fr !important; }
          .promo-card { flex-direction: column !important; text-align: center !important; gap: 32px !important; }
          .promo-card p { max-width: 100% !important; }
          .avatar { display: none !important; }
        }
      `}</style>

      {/* BACKGROUND AMBIENT ORBS */}
      <div style={{ position: "absolute", top: -120, left: -80, width: 500, height: 500, background: "radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: 400, right: -100, width: 400, height: 400, background: "radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: 200, left: "30%", width: 350, height: 350, background: "radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />

      {/* ═══ NAVBAR ═══ */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? "rgba(6,9,18,0.92)" : "rgba(6,9,18,0.7)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        transition: "all 0.4s ease",
        padding: "0 60px",
        height: 74,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }}>
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}>
          <div style={{ width: 36, height: 36, background: "linear-gradient(135deg,#2563eb,#7c3aed)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><path d="M16 13H8"></path><path d="M16 17H8"></path><polyline points="10 9 9 9 8 9"></polyline></svg>
          </div>
          <span style={{ fontWeight: 800, fontSize: "1.15rem", letterSpacing: "-0.02em", color: "#fff" }}>Doc Flow <span style={{ color: "#60a5fa" }}>AI</span></span>
        </Link>

        <div className="nav-links" style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <Link to="/workspace" style={{ fontSize: "0.82rem", color: "#94a3b8", fontWeight: 600, letterSpacing: "0.04em", textDecoration: "none", transition: "color 0.2s" }} onMouseEnter={e => e.target.style.color = "#fff"} onMouseLeave={e => e.target.style.color = "#94a3b8"}>WORKSPACE</Link>
          <Link to="/courses" style={{ fontSize: "0.82rem", color: "#94a3b8", fontWeight: 600, letterSpacing: "0.04em", textDecoration: "none", transition: "color 0.2s" }} onMouseEnter={e => e.target.style.color = "#fff"} onMouseLeave={e => e.target.style.color = "#94a3b8"}>COURSES</Link>
          <Link to="/notes" style={{ fontSize: "0.82rem", color: "#94a3b8", fontWeight: 600, letterSpacing: "0.04em", textDecoration: "none", transition: "color 0.2s" }} onMouseEnter={e => e.target.style.color = "#fff"} onMouseLeave={e => e.target.style.color = "#94a3b8"}>NOTES</Link>
          <Link to="/settings" style={{ fontSize: "0.82rem", color: "#94a3b8", fontWeight: 600, letterSpacing: "0.04em", textDecoration: "none", transition: "color 0.2s" }} onMouseEnter={e => e.target.style.color = "#fff"} onMouseLeave={e => e.target.style.color = "#94a3b8"}>SETTINGS</Link>
          <button className="btn-logout" onClick={handleLogout}>LOG OUT</button>
          {user.profilePicture ? (
            <img src={user.profilePicture} alt="User Profile" style={{ width: 42, height: 42, borderRadius: 12, objectFit: "cover" }} className="avatar" />
          ) : (
            <div className="avatar">{getInitials(user.name)}</div>
          )}
        </div>

        {/* Hamburger (Mobile) */}
        <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}
          style={{ display: "none", flexDirection: "column", gap: 5, cursor: "pointer", padding: 8 }}>
          <span style={{ display: "block", width: 22, height: 2, background: "#fff", borderRadius: 2, transform: menuOpen ? "rotate(45deg) translate(5px, 5px)" : "none", transition: "0.3s" }} />
          <span style={{ display: "block", width: 22, height: 2, background: "#fff", borderRadius: 2, opacity: menuOpen ? 0 : 1, transition: "0.3s" }} />
          <span style={{ display: "block", width: 22, height: 2, background: "#fff", borderRadius: 2, transform: menuOpen ? "rotate(-45deg) translate(5px, -5px)" : "none", transition: "0.3s" }} />
        </div>

        {/* Mobile Nav */}
        {menuOpen && (
          <div style={{
            position: "absolute", top: 74, left: 0, right: 0,
            background: "var(--bg-secondary, #ffffff)", borderBottom: "1px solid var(--border-color, #e2e8f0)",
            padding: "20px 24px", display: "flex", flexDirection: "column", gap: 20,
            zIndex: 99, boxShadow: "0 20px 40px rgba(0,0,0,0.15)"
          }}>
            <Link to="/workspace" style={{ color: "var(--text-primary)", fontWeight: 700, textDecoration: "none" }}>WORKSPACE</Link>
            <Link to="/courses" style={{ color: "var(--text-primary)", fontWeight: 700, textDecoration: "none" }}>COURSES</Link>
            <Link to="/notes" style={{ color: "var(--text-primary)", fontWeight: 700, textDecoration: "none" }}>NOTES</Link>
            <Link to="/settings" style={{ color: "var(--text-primary)", fontWeight: 700, textDecoration: "none" }}>SETTINGS</Link>
            <button className="btn-logout" onClick={handleLogout} style={{ width: "fit-content" }}>LOG OUT</button>
          </div>
        )}
      </nav>

      <main style={{ maxWidth: 1280, margin: "0 auto", padding: "120px 48px 80px", position: "relative", zIndex: 1 }}>

        {/* ═══ HEADER ═══ */}
        <header className="animate-fade" style={{ marginBottom: 56 }}>
          <span className="section-label">📊 Dashboard Overview</span>
          <h1 style={{ fontSize: "3.2rem", fontWeight: 900, marginBottom: 10, letterSpacing: "-0.04em", lineHeight: 1.1 }}>
            {greeting}, <span style={{ background: "linear-gradient(135deg, #2563eb, #7c3aed)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>{user.name.split(" ")[0]}</span> 👋
          </h1>
          <p style={{ color: "var(--text-secondary, #475569)", fontSize: "1.1rem", fontWeight: 500, maxWidth: 600 }}>
            Your central command center — access all pages, track progress, and explore AI tools in one place.
          </p>
        </header>


        {/* ═══ STATS SECTION ═══ */}
        <section className="animate-fade animate-delay-1" style={{ marginBottom: 64 }}>
          <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 20 }}>
            {[
              { label: "Active Courses", value: stats.activeCourses, icon: "📖", color: "#3b82f6", bg: "rgba(59,130,246,0.1)" },
              { label: "Hours Studied", value: stats.hoursStudied, icon: "⚡", color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
              { label: "Notes Saved", value: stats.notesSaved, icon: "📝", color: "#10b981", bg: "rgba(16,185,129,0.1)" },
              { label: "Quizzes Taken", value: stats.quizzesTaken, icon: "🎯", color: "#a78bfa", bg: "rgba(167,139,250,0.1)" },
              { label: "Docs Processed", value: stats.docsProcessed, icon: "📄", color: "#ec4899", bg: "rgba(236,72,153,0.1)" },
            ].map((stat, i) => (
              <div key={stat.label} className="stat-card" style={{ "--stat-color": stat.color }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: stat.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, border: `1px solid ${stat.color}20`, flexShrink: 0 }}>
                  {stat.icon}
                </div>
                <div>
                  <div style={{ fontSize: "1.8rem", fontWeight: 900, lineHeight: 1, color: "var(--text-primary)" }}>{stat.value}</div>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-secondary, #64748b)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginTop: 4 }}>{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </section>


        {/* ═══ OVERALL PROGRESS + RECENT NOTES ═══ */}
        <section className="bottom-bento animate-fade animate-delay-2" style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: 28, marginBottom: 64 }}>
          {/* Progress Circle */}
          <div className="dash-card" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", gap: 20 }}>
            <span className="section-label">🏆 Journey Progress</span>
            <div className="progress-ring">
              <svg width="160" height="160" viewBox="0 0 160 160">
                <circle cx="80" cy="80" r="66" fill="none" stroke="var(--border-color, #e2e8f0)" strokeWidth="12" />
                <circle cx="80" cy="80" r="66" fill="none" stroke="url(#progressGrad)" strokeWidth="12" strokeLinecap="round"
                  strokeDasharray={`${completionPercent * 4.15} ${415 - completionPercent * 4.15}`}
                  strokeDashoffset="104"
                  style={{ transition: "stroke-dasharray 1s ease" }} />
                <defs><linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#2563eb" /><stop offset="100%" stopColor="#7c3aed" /></linearGradient></defs>
              </svg>
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: "2.4rem", fontWeight: 900, lineHeight: 1 }}>{completionPercent}%</span>
                <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Complete</span>
              </div>
            </div>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", maxWidth: 240, lineHeight: 1.6 }}>
              {completionPercent >= 100 ? "Amazing! You've explored all features! 🎉" :
               completionPercent >= 60 ? "Great progress! Keep pushing forward! 💪" :
               "Start exploring courses, notes, and AI tools to grow! 🚀"}
            </p>
          </div>

          {/* Recent Notes */}
          <div className="dash-card" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span className="section-label">📝 Recent Notes</span>
              <Link to="/notes" style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--accent-primary, #2563eb)", textDecoration: "none", borderBottom: "1.5px solid var(--accent-primary, #2563eb)" }}>VIEW ALL →</Link>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {recentNotes.length === 0 ? (
                <div style={{ padding: "40px 20px", textAlign: "center", color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                  <span style={{ fontSize: "2.5rem", display: "block", marginBottom: 12 }}>📭</span>
                  No notes yet — head to <Link to="/notes" style={{ color: "var(--accent-primary, #2563eb)", fontWeight: 700 }}>My Notes</Link> to get started!
                </div>
              ) : recentNotes.map((note, i) => (
                <Link to="/notes" key={i} className="note-preview" style={{ textDecoration: "none", color: "inherit" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: `hsl(${(i * 80) % 360}, 70%, 95%)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
                      {["📄", "📋", "📓", "📑"][i % 4]}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: "0.9rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{note.title || `Note ${i + 1}`}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: 2 }}>{note.category || "General"} • {note.date || "Recent"}</div>
                    </div>
                    <span style={{ color: "var(--text-secondary)", fontSize: 18 }}>→</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>


        {/* ═══ QUICK ACCESS — ALL PAGES ═══ */}
        <section className="animate-fade animate-delay-3" style={{ marginBottom: 64 }}>
          <div style={{ marginBottom: 32 }}>
            <span className="section-label">🚀 Quick Access</span>
            <h2 style={{ fontSize: "1.8rem", fontWeight: 800, letterSpacing: "-0.02em" }}>Navigate Your Platform</h2>
            <p style={{ color: "var(--text-secondary)", marginTop: 6, fontSize: "0.95rem" }}>Jump to any page instantly — every feature is one click away.</p>
          </div>
          <div className="quick-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 22 }}>
            {quickAccess.map((item, i) => (
              <Link to={item.path} key={item.title} className="quick-card" style={{ "--card-grad": item.gradient }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: item.gradient, borderRadius: "20px 20px 0 0", opacity: 0, transition: "opacity 0.3s" }} className="quick-card-bar" />
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 50, height: 50, borderRadius: 14, background: item.gradient, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, boxShadow: `0 8px 20px ${item.glow}`, transition: "transform 0.3s" }}>
                    {item.icon}
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: "1.05rem", letterSpacing: "-0.01em" }}>{item.title}</div>
                    <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)", fontWeight: 500, marginTop: 2 }}>{item.desc}</div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: "auto" }}>
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--accent-primary, #2563eb)" }}>Open →</span>
                </div>
              </Link>
            ))}
          </div>
        </section>


        {/* ═══ AI TOOLS SPOTLIGHT ═══ */}
        <section className="animate-fade animate-delay-4" style={{ marginBottom: 64 }}>
          <div style={{ marginBottom: 32 }}>
            <span className="section-label">🤖 AI Tools Spotlight</span>
            <h2 style={{ fontSize: "1.8rem", fontWeight: 800, letterSpacing: "-0.02em" }}>Powerful AI at Your Fingertips</h2>
            <p style={{ color: "var(--text-secondary)", marginTop: 6, fontSize: "0.95rem" }}>Explore the AI-powered tools available across the platform.</p>
          </div>
          <div className="tool-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {aiTools.map((tool, i) => (
              <Link to={tool.link} key={tool.title} className="tool-chip" style={{ textDecoration: "none", color: "inherit" }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "var(--bg-tertiary, #f1f5f9)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>
                  {tool.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>{tool.title}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{tool.desc}</div>
                </div>
                <span style={{ color: "var(--accent-primary, #2563eb)", fontSize: 18, flexShrink: 0 }}>→</span>
              </Link>
            ))}
          </div>
        </section>


        {/* ═══ IN-PROGRESS LEARNING ═══ */}
        <section className="animate-fade animate-delay-5" style={{ marginBottom: 64 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
            <div>
              <span className="section-label">📖 Continue Learning</span>
              <h2 style={{ fontSize: "1.8rem", fontWeight: 800, letterSpacing: "-0.02em" }}>In-Progress Courses</h2>
              <p style={{ color: "var(--text-secondary)", marginTop: 6, fontSize: "0.95rem" }}>Pick up where you left off in your learning journey.</p>
            </div>
            <Link to="/courses" style={{ color: "var(--accent-primary, #2563eb)", fontSize: "0.85rem", fontWeight: 700, textDecoration: "none", borderBottom: "2px solid var(--accent-primary, #2563eb)", paddingBottom: 2 }}>VIEW ALL COURSES →</Link>
          </div>
          <div className="courses-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 24 }}>
            {recentCourses.length === 0 ? (
              <div className="dash-card" style={{ textAlign: "center", padding: "48px 24px", gridColumn: "1 / -1" }}>
                <span style={{ fontSize: "3rem", display: "block", marginBottom: 16 }}>🎒</span>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: 8 }}>No courses yet</h3>
                <p style={{ color: "var(--text-secondary)", marginBottom: 20 }}>Start your learning journey by browsing our course catalog.</p>
                <Link to="/courses" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "linear-gradient(135deg, #2563eb, #7c3aed)", color: "#fff", padding: "12px 28px", borderRadius: 14, fontWeight: 700, fontSize: "0.9rem", textDecoration: "none", transition: "transform 0.2s" }}
                  onMouseEnter={e => e.target.style.transform = "scale(1.03)"}
                  onMouseLeave={e => e.target.style.transform = "scale(1)"}>
                  Browse Courses →
                </Link>
              </div>
            ) : recentCourses.map(course => (
              <div key={course.title} className="dash-card">
                <div className="course-tag" style={{ background: (course.color || "#3b82f6") + "15", color: course.color || "#3b82f6" }}>{course.level || "PRO"}</div>
                <div style={{ display: "flex", gap: 20, marginBottom: 28 }}>
                  <div style={{ width: 64, height: 64, background: "var(--bg-tertiary, #0f172a)", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, border: "1px solid var(--border-color, #e2e8f0)" }}>{course.icon || "🚀"}</div>
                  <div>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: 4, lineHeight: 1.2 }}>{course.title}</h3>
                    <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontWeight: 500 }}>{course.category || "Professional Development"}</p>
                  </div>
                </div>
                <div style={{ marginBottom: 12, display: "flex", justifyContent: "space-between", fontSize: "0.8rem", fontWeight: 800 }}>
                  <span style={{ color: "var(--text-secondary)" }}>PROGRESS</span>
                  <span style={{ color: course.color || "#3b82f6" }}>{course.progress || 0}%</span>
                </div>
                <div style={{ height: 8, background: "var(--bg-tertiary, #e2e8f0)", borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ height: "100%", background: `linear-gradient(90deg, ${course.color || "#3b82f6"}, ${course.color || "#60a5fa"})`, width: `${course.progress || 0}%`, borderRadius: 4, transition: "width 1s ease" }}></div>
                </div>
              </div>
            ))}
          </div>
        </section>


        {/* ═══ PROMO CTA ═══ */}
        <section className="animate-fade animate-delay-6" style={{ marginBottom: 80 }}>
          <div className="promo-card dash-card" style={{ display: "flex", alignItems: "center", gap: 40, padding: "48px 40px", background: "linear-gradient(135deg, rgba(37,99,235,0.04), rgba(124,58,237,0.04))", border: "1px solid rgba(37,99,235,0.12)" }}>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: "1.6rem", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 12 }}>
                Ready to supercharge your workflow? 🚀
              </h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "1rem", lineHeight: 1.7, maxWidth: 500, marginBottom: 24 }}>
                Explore the AI Workspace to automate document processing, generate quizzes, and create entire courses in minutes.
              </p>
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                <Link to="/workspace" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "linear-gradient(135deg, #2563eb, #7c3aed)", color: "#fff", padding: "14px 32px", borderRadius: 14, fontWeight: 700, fontSize: "0.9rem", textDecoration: "none", boxShadow: "0 8px 24px rgba(37,99,235,0.25)", transition: "transform 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.transform = "scale(1.03)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>
                  Open Workspace →
                </Link>
                <Link to="/education-hub" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "var(--bg-secondary, #ffffff)", color: "var(--text-primary)", padding: "14px 32px", borderRadius: 14, fontWeight: 700, fontSize: "0.9rem", textDecoration: "none", border: "1px solid var(--border-color, #e2e8f0)", transition: "all 0.2s" }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.03)"; e.currentTarget.style.borderColor = "var(--accent-primary, #2563eb)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.borderColor = "var(--border-color, #e2e8f0)"; }}>
                  Explore Education Hub
                </Link>
              </div>
            </div>
            <div style={{ width: 140, height: 140, borderRadius: 28, background: "linear-gradient(135deg, #2563eb, #7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 64, flexShrink: 0, boxShadow: "0 16px 40px rgba(37,99,235,0.2)" }}>
              🧠
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
