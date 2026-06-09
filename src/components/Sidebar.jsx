import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
    const location = useLocation();

    const menuItems = [
        { name: "Education Hub", icon: "school", path: "/education-hub" },
        { name: "Courses", icon: "library_books", path: "/courses" },
        { name: "Notes", icon: "edit_note", path: "/notes" },
        { name: "Settings", icon: "settings", path: "/settings" }
    ];

    const isActive = (path) => {
        if (path === "#") return false;
        return location.pathname === path;
    };

    return (
        <aside className="h-screen w-64 fixed left-0 top-0 bg-slate-100/60 backdrop-blur-xl hidden md:flex flex-col p-6 font-['Space_Grotesk'] text-sm border-r border-slate-200/50 z-[100]">
            <Link to="/" className="mb-10 px-2 no-underline block hover:opacity-80 transition-opacity">
                <p className="text-blue-600 text-2xl font-bold m-0 tracking-tight">DocFlow <span className="text-blue-700">AI</span></p>
                <div className="flex items-center gap-2 mt-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest m-0">Pro Dashboard</p>
                </div>
            </Link>

            <nav className="flex flex-col gap-1.5 flex-1">
                {menuItems.map(item => {
                    const active = isActive(item.path);
                    return (
                        <Link
                            key={item.name}
                            className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 no-underline group ${active ? 'text-blue-700 font-bold bg-white shadow-sm' : 'text-slate-500 hover:bg-white/50 hover:text-blue-600'}`}
                            to={item.path}
                        >
                            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0" }}>
                                {item.icon}
                            </span>
                            <span className="font-medium">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-auto flex flex-col gap-1 opacity-80">
                <Link to="/platform" className="flex items-center gap-4 px-4 py-2.5 text-slate-500 hover:text-blue-600 transition-colors text-xs font-semibold no-underline">
                    <span className="material-symbols-outlined text-lg">rocket_launch</span>
                    <span>Workspace</span>
                </Link>
                <Link to="/login" className="flex items-center gap-4 px-4 py-2.5 text-slate-500 hover:text-blue-600 transition-colors text-xs font-semibold no-underline">
                    <span className="material-symbols-outlined text-lg">logout</span>
                    <span>Logout</span>
                </Link>
            </div>
        </aside>
    );
};

export default Sidebar;
