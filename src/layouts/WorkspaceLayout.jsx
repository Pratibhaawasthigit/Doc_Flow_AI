import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation, Outlet } from "react-router-dom";

/* ─── Shared Icon Helper ────────────────────────────────────────── */
const Ic = ({ name, size = 22, fill = false, style: s = {}, cls = "" }) => (
  <span className={`material-symbols-outlined${fill ? " icon-fill" : ""}${cls ? " " + cls : ""}`}
    style={{ fontSize: size, ...s }}>{name}</span>
);

export default function WorkspaceLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const hideSidebar = location.pathname === "/notes" || location.pathname === "/settings";

  const [user, setUser] = useState({ name: "Pratibha", profilePicture: null });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed.name) {
          setUser(prev => ({ ...prev, ...parsed }));
        }
      } catch (e) {}
    }

    const token = localStorage.getItem("token");
    if (token) {
      fetch("/api/settings/profile", {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data && data.name) {
            setUser({
              name: data.name,
              profilePicture: data.profilePicture || null
            });
          }
        })
        .catch(err => {});
    }
  }, []);

  const getInitials = (name) => {
    if (!name) return "PA";
    const parts = name.trim().split(/\s+/);
    return parts.length >= 2
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : parts[0][0].toUpperCase();
  };

  const NAV = [
    { id: "dashboard", icon: "dashboard",              label: "Dashboard", path: "/workspace" },
    { id: "engine",    icon: "psychology",             label: "AI Engine", path: "/ai-engine" },
    { id: "learn",     icon: "school",                 label: "Docflow Learn", path: "/docflow-learn" },
    { id: "core",      icon: "settings_input_component", label: "Docflow Core", path: "/docflow-core" },
  ];

  const BOTTOM_NAV = [
    { id: "help", icon: "help",     label: "Help Center", path: "/help" },
    { id: "sets", icon: "settings", label: "Settings",    path: "/settings" },
  ];

  // Handle scroll shadow for header
  useEffect(() => {
    const el = document.getElementById("main-content-area");
    if (!el) return;
    const h = () => setScrolled(el.scrollTop > 20);
    el.addEventListener("scroll", h);
    return () => el.removeEventListener("scroll", h);
  }, []);

  // Close sidebar on navigation (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: "#f7f9fb" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');

        .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
        .icon-fill { font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
        .font-headline { font-family: 'Space Grotesk', sans-serif; }
        body { font-family: 'Plus Jakarta Sans', sans-serif; }

        .workspace-sidebar {
            width: 260px;
            height: 100vh;
            position: fixed;
            left: 0;
            top: 0;
            background: #f8fafc;
            border-right: 1px solid rgba(195,198,215,0.25);
            display: flex;
            flex-direction: column;
            padding: 24px 16px;
            z-index: 100;
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .nav-link {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 16px;
            border-radius: 12px;
            font-family: 'Space Grotesk', sans-serif;
            font-size: 14px;
            font-weight: 500;
            color: #64748b;
            cursor: pointer;
            border: none;
            background: none;
            width: 100%;
            text-align: left;
            transition: all 0.2s;
            text-decoration: none;
        }
        .nav-link:hover { background: rgba(0,74,198,0.04); color: #1e293b; transform: translateX(4px); }
        .nav-link.active { background: rgba(0,74,198,0.08); color: #004ac6; font-weight: 700; border-right: 3px solid #004ac6; }

        .main-wrapper {
            margin-left: 260px;
            flex: 1;
            height: 100vh;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            position: relative;
        }

        @media (max-width: 1024px) {
            .workspace-sidebar { transform: translateX(-100%); }
            .workspace-sidebar.open { transform: translateX(0); }
            .main-wrapper { margin-left: 0; }
            .sidebar-overlay { display: block; position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 90; backdrop-filter: blur(4px); }
        }
      `}</style>

      {/* Mobile Overlay */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      {!hideSidebar && (
      <aside className={`workspace-sidebar ${sidebarOpen ? "open" : ""}`}>
        <Link to="/" style={{ padding: "4px 8px", marginBottom: 36, textDecoration: 'none', display: 'block' }}>
          <h1 className="font-headline" style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", letterSpacing: "-.04em", lineHeight: 1.1 }}>DocFlow <span style={{ color: "#004ac6" }}>AI</span></h1>
          <p style={{ fontSize: 11, color: "#737686", marginTop: 4, fontWeight: 500 }}>Intelligent Workspace</p>
        </Link>

        <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
          {NAV.map(n => {
             const active = location.pathname === n.path;
             return (
                <Link key={n.id} to={n.path} className={`nav-link ${active ? "active" : ""}`}>
                    <Ic name={n.icon} size={20} fill={active} />
                    {n.label}
                </Link>
             );
          })}
        </nav>

        <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 4 }}>
          {BOTTOM_NAV.map(n => (
            <Link key={n.id} to={n.path} className="nav-link">
              <Ic name={n.icon} size={20} />
              {n.label}
            </Link>
          ))}
        </div>
      </aside>
      )}

      {/* Main Content Area */}
      <div className="main-wrapper" style={hideSidebar ? { marginLeft: 0 } : {}}>
        <header className="glass" style={{
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 28px",
          background: "rgba(255,255,255,0.8)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(195,198,215,0.2)",
          boxShadow: scrolled ? "0 8px 28px rgba(37,99,235,0.08)" : "none",
          zIndex: 80,
          transition: "box-shadow 0.3s"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <button className="lg-hide" onClick={() => setSidebarOpen(true)}
              style={{ display: window.innerWidth <= 1024 ? "flex" : "none", padding: 8, background: "none", border: "none", cursor: "pointer", color: "#64748b" }}>
              <Ic name="menu" size={24} />
            </button>
            <h2 className="font-headline" style={{ fontSize: 18, fontWeight: 700, color: "#004ac6", margin: 0 }}>
              {NAV.find(n => n.path === location.pathname)?.label || "Workspace"}
            </h2>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 14px", background: "#fff", borderRadius: 99, border: "1px solid #e2e8f0", marginRight: 12 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#4edea3", boxShadow: "0 0 8px #4edea3" }} />
                <span style={{ fontSize: 10, fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>AI Copilot Online</span>
            </div>
            {user.profilePicture ? (
              <div style={{ width: 36, height: 36, borderRadius: "50%", overflow: "hidden", border: "2px solid #fff", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
                <img src={user.profilePicture} alt="User" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            ) : (
              <div style={{
                width: 36, height: 36, borderRadius: "50%",
                background: "linear-gradient(135deg, #004ac6, #2563eb)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 800, color: "#fff",
                border: "2px solid #fff", boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
              }}>
                {getInitials(user.name)}
              </div>
            )}
          </div>
        </header>

        <main id="main-content-area" style={{ flex: 1, overflowY: "auto", position: "relative", width: "100%" }}>
          <Outlet />
        </main>
      </div>

      <style>{`
        @media (min-width: 1025px) {
            .lg-hide { display: none !important; }
        }
      `}</style>
    </div>
  );
}
