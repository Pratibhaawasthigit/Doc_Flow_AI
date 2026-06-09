import { Outlet, Link, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

export default function EducationLayout() {
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/education-hub") return "Education Hub";
    if (path === "/courses") return "Courses";
    if (path === "/notes") return "Notes";
    if (path === "/settings") return "Settings";
    return "Learning Hub";
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
      `}</style>

      {/* Shared Sidebar */}
      <Sidebar />

      <div className="flex-1 flex flex-col md:pl-64">
        {/* Global Navigation Header */}
        <nav className="fixed top-0 right-0 left-0 md:left-64 z-40 bg-white/70 backdrop-blur-xl border-b border-slate-200/60 flex justify-between items-center px-6 h-16 transition-all duration-300">
          <div className="flex items-center gap-8">
            <span
              className="text-xl md:text-2xl font-extrabold bg-gradient-to-br from-blue-700 to-blue-500 bg-clip-text text-transparent"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {getPageTitle()}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-full mr-2">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.7)]" />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">AI Tutor Active</span>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-xs font-extrabold shadow-lg shadow-blue-200 hover:scale-95 transition-all duration-200 uppercase tracking-wider">
              Try Pro
            </button>
          </div>
        </nav>

        {/* Dynamic Page Content */}
        <main className="flex-1 pt-16">
          <Outlet />
        </main>

        {/* Global Footer */}
        <Footer sidebarOffset={false} /> {/* We handle the offset in the parent div md:pl-64, but Footer.jsx has its own logic, let's see */}
      </div>
    </div>
  );
}
