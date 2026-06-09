import React from 'react';
import { Link } from 'react-router-dom';

const Footer = ({ sidebarOffset = false }) => {
    const cols = {
        Platform: [
            { name: "Home", path: "/" },
            { name: "Education Hub", path: "/education-hub" },
            { name: "Courses", path: "/course-page" },
            { name: "Platform", path: "/platform" },
            { name: "Workspace", path: "/workspace" },
        ],
        Product: [
            { name: "AI Engine", path: "/ai-engine" },
            { name: "DocFlow Learn", path: "/docflow-learn" },
            { name: "DocFlow Core", path: "/docflow-core" },
        ],
        Support: [
            { name: "How It Works", path: "/#how-it-works" },
            { name: "Pricing", path: "/#pricing" },
            { name: "Contact", path: "#" },
            { name: "API Docs", path: "#" },
        ],
        Legal: [
            { name: "Privacy Policy", path: "#" },
            { name: "Terms of Service", path: "#" },
        ],
    };

    return (
        <footer style={{
            background: "#f8fafc",
            borderTop: "1px solid rgba(195,198,215,0.25)",
            padding: "64px 32px",
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            marginLeft: sidebarOffset ? '256px' : '0',
            transition: 'margin-left 0.3s ease',
        }}>
            <div style={{ maxWidth: 1280, margin: "0 auto" }}>
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: 40,
                }}>
                    {/* Branding */}
                    <div style={{ gridColumn: "span 2" }}>
                        <Link to="/" style={{ textDecoration: 'none' }}>
                            <div style={{
                                fontSize: 22,
                                fontWeight: 900,
                                fontFamily: "'Space Grotesk', sans-serif",
                                color: "#0f172a",
                                textTransform: "uppercase",
                                letterSpacing: "0.1em",
                                marginBottom: 16
                            }}>
                                DocFlow <span style={{ color: "#004ac6" }}>AI</span>
                            </div>
                        </Link>
                        <p style={{
                            fontSize: 14,
                            color: "#64748b",
                            lineHeight: 1.7,
                            maxWidth: 320,
                            marginBottom: 24
                        }}>
                            © 2026 DocFlow AI. The Digital Curator for Intelligent Workspaces.
                            Empowering modern learners and creators with neural-enhanced document automation.
                        </p>
                    </div>

                    {/* Columns */}
                    {Object.entries(cols).map(([heading, links]) => (
                        <div key={heading}>
                            <div style={{
                                fontWeight: 800,
                                color: "#0f172a",
                                marginBottom: 24,
                                fontSize: 13,
                                textTransform: "uppercase",
                                letterSpacing: "0.1em"
                            }}>
                                {heading}
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                                {links.map(l => (
                                    l.path.startsWith('http') || l.path.startsWith('#') || l.path.includes('#') ? (
                                        <a key={l.name} href={l.path} style={{
                                            fontSize: 14,
                                            color: "#64748b",
                                            textDecoration: "none",
                                            transition: "color .2s",
                                            fontWeight: 500
                                        }}
                                            onMouseEnter={e => e.target.style.color = "#004ac6"}
                                            onMouseLeave={e => e.target.style.color = "#64748b"}
                                        >
                                            {l.name}
                                        </a>
                                    ) : (
                                        <Link key={l.name} to={l.path} style={{
                                            fontSize: 14,
                                            color: "#64748b",
                                            textDecoration: "none",
                                            transition: "color .2s",
                                            fontWeight: 500
                                        }}
                                            onMouseEnter={e => e.target.style.color = "#004ac6"}
                                            onMouseLeave={e => e.target.style.color = "#64748b"}
                                        >
                                            {l.name}
                                        </Link>
                                    )
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom line */}
                <div style={{
                    marginTop: 64,
                    paddingTop: 32,
                    borderTop: "1px solid rgba(226,232,240,0.5)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 20
                }}>
                    <div style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                        The Intelligent Workspace for modern learners.
                    </div>
                    <div style={{ display: "flex", gap: 24 }}>
                        {['Twitter', 'LinkedIn', 'GitHub'].map(s => (
                            <a key={s} href="#" style={{ fontSize: 12, color: "#94a3b8", textDecoration: "none", fontWeight: 700 }}>{s}</a>
                        ))}
                    </div>
                </div>
            </div>

            {/* Responsive fix for sidebar offset */}
            <style>{`
                @media (max-width: 768px) {
                    footer { margin-left: 0 !important; padding: 48px 24px !important; }
                    footer > div > div:first-child { grid-column: span 1 !important; }
                }
            `}</style>
        </footer>
    );
};

export default Footer;
