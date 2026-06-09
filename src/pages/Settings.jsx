import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Ic = ({ name, size = 20, fill = false, style = {} }) => (
    <span className={`material-symbols-outlined ${fill ? 'icon-fill' : ''}`} style={{ fontSize: size, ...style }}>
        {name}
    </span>
);

/* ─── Animated counter hook ──────────────────────────────────── */
const useAnimatedCount = (target, duration = 1200) => {
    const [count, setCount] = useState(0);
    useEffect(() => {
        if (!target) { setCount(0); return; }
        let start = 0;
        const step = Math.ceil(target / (duration / 16));
        const timer = setInterval(() => {
            start += step;
            if (start >= target) { setCount(target); clearInterval(timer); }
            else setCount(start);
        }, 16);
        return () => clearInterval(timer);
    }, [target, duration]);
    return count;
};

/* ─── Stat card component ────────────────────────────────────── */
const StatPill = ({ icon, value, label, gradient }) => {
    const animatedValue = useAnimatedCount(value);
    return (
        <div style={{
            background: gradient,
            borderRadius: '16px',
            padding: '20px 24px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            flex: 1,
            minWidth: '160px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            transition: 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s',
            cursor: 'default',
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.12)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0) scale(1)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)'; }}
        >
            <div style={{
                width: 48, height: 48, borderRadius: '14px',
                background: 'rgba(255,255,255,0.25)', backdropFilter: 'blur(8px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
                <Ic name={icon} size={26} fill style={{ color: '#fff' }} />
            </div>
            <div>
                <div style={{ fontSize: '28px', fontWeight: '800', color: '#fff', lineHeight: 1.1 }}>{animatedValue}</div>
                <div style={{ fontSize: '11px', fontWeight: '600', color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 2 }}>{label}</div>
            </div>
        </div>
    );
};

/* ─── Activity item component ────────────────────────────────── */
const ActivityItem = ({ activity, isLast }) => {
    const typeConfig = {
        DOCUMENT: { icon: 'description', color: '#3b82f6', bg: '#eff6ff', label: 'Document' },
        QUIZ: { icon: 'quiz', color: '#8b5cf6', bg: '#f5f3ff', label: 'Quiz' },
        SUMMARY: { icon: 'summarize', color: '#10b981', bg: '#ecfdf5', label: 'Summary' },
    };
    const cfg = typeConfig[activity.type] || typeConfig.DOCUMENT;
    const timeAgo = (dateStr) => {
        if (!dateStr) return 'Just now';
        const d = new Date(dateStr);
        const diff = (Date.now() - d.getTime()) / 1000;
        if (diff < 60) return 'Just now';
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    return (
        <div style={{ display: 'flex', gap: '16px', position: 'relative', paddingBottom: isLast ? 0 : '24px' }}>
            {/* Timeline line */}
            {!isLast && <div style={{
                position: 'absolute', left: '19px', top: '44px', bottom: 0, width: '2px',
                background: 'linear-gradient(to bottom, #e2e8f0, transparent)'
            }} />}
            {/* Timeline dot */}
            <div style={{
                width: 40, height: 40, borderRadius: '12px', background: cfg.bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                border: `2px solid ${cfg.color}20`, zIndex: 1
            }}>
                <Ic name={cfg.icon} size={20} fill style={{ color: cfg.color }} />
            </div>
            {/* Content */}
            <div style={{
                flex: 1, background: '#fff', borderRadius: '14px', padding: '16px 20px',
                border: '1px solid #f1f5f9',
                transition: 'all 0.2s', cursor: 'default',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = cfg.color + '40'; e.currentTarget.style.boxShadow = `0 4px 16px ${cfg.color}15`; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#f1f5f9'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)'; }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>{activity.title}</span>
                        <span style={{
                            fontSize: '10px', fontWeight: '700', padding: '2px 8px', borderRadius: '99px',
                            background: cfg.bg, color: cfg.color, textTransform: 'uppercase', letterSpacing: '0.04em'
                        }}>{cfg.label}</span>
                    </div>
                    <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '500' }}>{timeAgo(activity.createdAt)}</span>
                </div>
                <p style={{ fontSize: '13px', color: '#64748b', margin: 0, lineHeight: 1.5 }}>{activity.description}</p>
            </div>
        </div>
    );
};

/* ═══════════════════════════════════════════════════════════════
   MAIN SETTINGS COMPONENT
   ═══════════════════════════════════════════════════════════════ */
const Settings = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const [user, setUser] = useState({ name: '', email: '', provider: 'local', profilePicture: null, createdAt: null });
    const [workspace, setWorkspace] = useState({ totalDocuments: 0, totalQuizzes: 0, totalSummaries: 0 });
    const [activities, setActivities] = useState([]);
    const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '' });
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [fadeIn, setFadeIn] = useState(false);
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    const navigate = useNavigate();

    const handleThemeChange = (newTheme) => {
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
    };

    const fetchAll = useCallback(async () => {
        setPageLoading(true);
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };
            const storedUser = localStorage.getItem('user');
            let emailHint = '';
            if (storedUser) {
                const parsed = JSON.parse(storedUser);
                emailHint = parsed.email || '';
            }

            const [profileRes, activityRes] = await Promise.all([
                axios.get('http://localhost:8080/api/settings/profile', { headers }),
                axios.get('http://localhost:8080/api/settings/activity', { headers, params: { limit: 30 } }),
            ]);

            const p = profileRes.data;
            setUser({
                name: p.name || '',
                email: p.email || '',
                provider: p.provider || 'local',
                profilePicture: p.profilePicture || null,
                createdAt: p.createdAt || null,
            });
            setWorkspace({
                totalDocuments: p.workspaceStats?.totalDocuments || 0,
                totalQuizzes: p.workspaceStats?.totalQuizzes || 0,
                totalSummaries: p.workspaceStats?.totalSummaries || 0,
            });
            setActivities(activityRes.data || []);
        } catch (err) {
            console.error('Error fetching settings data:', err);
            // If unauthorized, try using localStorage as fallback
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const parsed = JSON.parse(storedUser);
                setUser(prev => ({ ...prev, ...parsed }));
            }
        } finally {
            setPageLoading(false);
            setTimeout(() => setFadeIn(true), 50);
        }
    }, []);

    useEffect(() => { fetchAll(); }, [fetchAll]);

    // Clear messages after 4s
    useEffect(() => {
        if (message.text) {
            const t = setTimeout(() => setMessage({ type: '', text: '' }), 4000);
            return () => clearTimeout(t);
        }
    }, [message]);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });
        try {
            const token = localStorage.getItem('token');
            await axios.put('http://localhost:8080/api/settings/profile', { name: user.name, profilePicture: user.profilePicture }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Update localStorage
            const stored = JSON.parse(localStorage.getItem('user') || '{}');
            stored.name = user.name;
            if (user.profilePicture) stored.profilePicture = user.profilePicture;
            localStorage.setItem('user', JSON.stringify(stored));
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (err) {
            if (err.response?.status === 403 || err.response?.status === 401) {
                setMessage({ type: 'error', text: 'Session expired. Please log out and log back in.' });
            } else {
                setMessage({ type: 'error', text: err.response?.data?.error || 'Update failed. Please try again later.' });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });
        try {
            const token = localStorage.getItem('token');
            await axios.put('http://localhost:8080/api/settings/password', passwords, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage({ type: 'success', text: 'Password changed successfully!' });
            setPasswords({ currentPassword: '', newPassword: '' });
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.error || 'Password change failed' });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!window.confirm('Are you sure you want to delete your account? This action is irreversible.')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete('http://localhost:8080/api/settings/account', {
                headers: { Authorization: `Bearer ${token}` }
            });
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/login');
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to delete account' });
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    /* ─── Avatar helper ──────────────────────────────────── */
    const getInitials = (name) => {
        if (!name) return '?';
        const parts = name.trim().split(' ');
        return parts.length >= 2
            ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
            : parts[0][0].toUpperCase();
    };

    const memberSince = user.createdAt
        ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
        : 'Recently';

    const tabs = [
        { id: 'profile', icon: 'person', label: 'Profile' },
        { id: 'activity', icon: 'timeline', label: 'Activity' },
        { id: 'security', icon: 'shield', label: 'Security' },
        { id: 'preferences', icon: 'tune', label: 'Preferences' },
    ];

    if (pageLoading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', fontFamily: "'Sora', sans-serif" }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        width: 48, height: 48, border: '4px solid #e2e8f0', borderTopColor: '#3b82f6',
                        borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px'
                    }} />
                    <p style={{ color: '#64748b', fontSize: '14px', fontWeight: '500' }}>Loading your settings...</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            fontFamily: "'Sora', sans-serif",
            minHeight: '100vh',
            background: 'var(--bg-primary)',
            opacity: fadeIn ? 1 : 0,
            transition: 'opacity 0.5s ease-out, background-color 0.3s ease',
        }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=Syne:wght@400;500;600;700;800&display=swap');
                .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
                .icon-fill { font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
                @keyframes spin { to { transform: rotate(360deg); } }
                @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes pulseGlow { 0%, 100% { box-shadow: 0 0 0 0 rgba(59,130,246,0.3); } 50% { box-shadow: 0 0 0 8px rgba(59,130,246,0); } }
                .settings-input {
                    background: var(--bg-primary) !important;
                    color: var(--text-primary) !important;
                    border-color: var(--border-color) !important;
                }
                .settings-input:focus { border-color: #3b82f6 !important; box-shadow: 0 0 0 4px rgba(59,130,246,0.1) !important; }
                .tab-btn { position: relative; overflow: hidden; }
                .tab-btn::after { content: ''; position: absolute; bottom: -2px; left: 50%; width: 0; height: 3px; background: linear-gradient(90deg, #3b82f6, #8b5cf6); border-radius: 3px; transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1); transform: translateX(-50%); }
                .tab-btn.active::after { width: 60%; }
                .tab-btn:hover { background: rgba(59,130,246,0.06) !important; }
            `}</style>

            {/* ═══ HERO BANNER ═══════════════════════════════════════ */}
            <div style={{
                background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 40%, #0f172a 100%)',
                borderRadius: '0 0 32px 32px',
                padding: '40px 48px 0',
                position: 'relative',
                overflow: 'hidden',
            }}>
                {/* Background decorative elements */}
                <div style={{
                    position: 'absolute', top: -80, right: -40, width: 300, height: 300,
                    borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.15), transparent 70%)',
                    filter: 'blur(40px)'
                }} />
                <div style={{
                    position: 'absolute', bottom: -60, left: -20, width: 200, height: 200,
                    borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.12), transparent 70%)',
                    filter: 'blur(30px)'
                }} />

                {/* Profile row */}
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '28px', marginBottom: '32px',
                    position: 'relative', zIndex: 2
                }}>
                    {/* Avatar */}
                    <div style={{ position: 'relative' }}>
                        {user.profilePicture ? (
                            <img src={user.profilePicture} alt="Profile" referrerPolicy="no-referrer" style={{
                                width: 88, height: 88, borderRadius: '24px', objectFit: 'cover',
                                border: '3px solid rgba(255,255,255,0.2)',
                                boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                            }} />
                        ) : (
                            <div style={{
                                width: 88, height: 88, borderRadius: '24px',
                                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '32px', fontWeight: '800', color: '#fff',
                                border: '3px solid rgba(255,255,255,0.2)',
                                boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                            }}>
                                {getInitials(user.name)}
                            </div>
                        )}
                        {/* Online indicator */}
                        <div style={{
                            position: 'absolute', bottom: -2, right: -2,
                            width: 20, height: 20, borderRadius: '50%',
                            background: '#22c55e', border: '3px solid #0f172a',
                            animation: 'pulseGlow 2s infinite'
                        }} />
                    </div>

                    {/* User info */}
                    <div style={{ flex: 1 }}>
                        <h1 style={{
                            fontSize: '28px', fontWeight: '800', color: '#fff', margin: '0 0 4px 0',
                            fontFamily: "'Syne', sans-serif", letterSpacing: '-0.03em'
                        }}>
                            {user.name || 'User'}
                        </h1>
                        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', margin: '0 0 8px 0' }}>{user.email}</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span style={{
                                fontSize: '11px', fontWeight: '700', padding: '4px 12px', borderRadius: '99px',
                                background: user.provider === 'google' ? 'rgba(234,67,53,0.2)' : 'rgba(59,130,246,0.2)',
                                color: user.provider === 'google' ? '#fca5a5' : '#93c5fd',
                                textTransform: 'uppercase', letterSpacing: '0.06em',
                                display: 'flex', alignItems: 'center', gap: '4px'
                            }}>
                                <Ic name={user.provider === 'google' ? 'public' : 'lock'} size={12} />
                                {user.provider === 'google' ? 'Google' : 'Local'} Account
                            </span>
                            <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>•</span>
                            <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Ic name="calendar_month" size={14} /> Member since {memberSince}
                            </span>
                        </div>
                    </div>

                    {/* Logout button */}
                    <button onClick={handleLogout} style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        padding: '10px 20px', borderRadius: '12px',
                        background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)',
                        color: 'rgba(255,255,255,0.7)', fontSize: '13px', fontWeight: '600',
                        cursor: 'pointer', transition: 'all 0.2s',
                        backdropFilter: 'blur(8px)',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.15)'; e.currentTarget.style.color = '#fca5a5'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                    >
                        <Ic name="logout" size={18} /> Logout
                    </button>
                </div>

                {/* Stats row */}
                <div style={{ display: 'flex', gap: '16px', marginBottom: '32px', position: 'relative', zIndex: 2, flexWrap: 'wrap' }}>
                    <StatPill icon="description" value={workspace.totalDocuments} label="Documents" gradient="linear-gradient(135deg, #3b82f6, #2563eb)" />
                    <StatPill icon="quiz" value={workspace.totalQuizzes} label="Quizzes" gradient="linear-gradient(135deg, #8b5cf6, #7c3aed)" />
                    <StatPill icon="summarize" value={workspace.totalSummaries} label="Summaries" gradient="linear-gradient(135deg, #10b981, #059669)" />
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: '4px', position: 'relative', zIndex: 2 }}>
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '8px',
                                padding: '14px 24px', borderRadius: '14px 14px 0 0',
                                border: 'none', cursor: 'pointer',
                                fontSize: '13px', fontWeight: '600',
                                fontFamily: "'Sora', sans-serif",
                                transition: 'all 0.2s',
                                background: activeTab === tab.id ? 'var(--bg-primary)' : 'transparent',
                                color: activeTab === tab.id ? 'var(--text-primary)' : 'rgba(255,255,255,0.5)',
                            }}
                        >
                            <Ic name={tab.icon} size={18} fill={activeTab === tab.id} />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* ═══ CONTENT AREA ═══════════════════════════════════════ */}
            <div style={{ padding: '32px 48px 64px', maxWidth: '900px' }}>
                {/* Alert message */}
                {message.text && (
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '10px',
                        padding: '14px 20px', borderRadius: '14px', fontSize: '14px', fontWeight: '500',
                        marginBottom: '24px', animation: 'fadeUp 0.3s ease-out',
                        backgroundColor: message.type === 'success' ? '#ecfdf5' : '#fef2f2',
                        color: message.type === 'success' ? '#059669' : '#dc2626',
                        border: `1px solid ${message.type === 'success' ? '#d1fae5' : '#fecaca'}`,
                    }}>
                        <Ic name={message.type === 'success' ? 'check_circle' : 'error'} size={20} fill />
                        {message.text}
                    </div>
                )}

                {/* ─── Profile Tab ─────────────────────────────────── */}
                {activeTab === 'profile' && (
                    <div style={{ animation: 'fadeUp 0.4s ease-out' }}>
                        <div style={{ marginBottom: '28px' }}>
                            <h2 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 6px 0', fontFamily: "'Syne', sans-serif" }}>
                                Edit Profile
                            </h2>
                            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0 }}>Update your personal information and profile picture.</p>
                        </div>

                        <div style={{
                            background: 'var(--bg-secondary)', borderRadius: '20px', padding: '32px',
                            boxShadow: 'var(--card-shadow)',
                            border: '1px solid var(--border-color)',
                        }}>
                            <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                {/* Avatar preview + edit */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                    {user.profilePicture ? (
                                        <img src={user.profilePicture} alt="Profile" referrerPolicy="no-referrer" style={{
                                            width: 72, height: 72, borderRadius: '20px', objectFit: 'cover',
                                            border: '2px solid #e2e8f0'
                                        }} />
                                    ) : (
                                        <div style={{
                                            width: 72, height: 72, borderRadius: '20px',
                                            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: '26px', fontWeight: '800', color: '#fff'
                                        }}>
                                            {getInitials(user.name)}
                                        </div>
                                    )}
                                    <div>
                                        <p style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)', margin: '0 0 2px 0' }}>Profile Picture</p>
                                        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>
                                            {user.provider === 'google' ? 'Synced from your Google account' : 'Enter a URL below to set your avatar'}
                                        </p>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>Full Name</label>
                                    <input
                                        className="settings-input"
                                        type="text" value={user.name}
                                        onChange={(e) => setUser({ ...user, name: e.target.value })}
                                        placeholder="Enter your name"
                                        style={{
                                            padding: '12px 16px', borderRadius: '12px', border: '1.5px solid var(--border-color)',
                                            fontSize: '14px', outline: 'none', transition: 'all 0.2s',
                                            fontFamily: "'Sora', sans-serif",
                                        }}
                                    />
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>Email Address</label>
                                    <input
                                        type="email" value={user.email} disabled
                                        style={{
                                            padding: '12px 16px', borderRadius: '12px', border: '1.5px solid var(--border-color)',
                                            fontSize: '14px', outline: 'none', backgroundColor: 'var(--bg-tertiary)',
                                            cursor: 'not-allowed', color: 'var(--text-secondary)',
                                            fontFamily: "'Sora', sans-serif",
                                        }}
                                    />
                                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Email cannot be changed.</span>
                                </div>

                                {user.provider !== 'google' && (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                        <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>Profile Picture</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files[0];
                                                if (file) {
                                                    if (file.size > 2 * 1024 * 1024) {
                                                        setMessage({ type: 'error', text: 'Image must be smaller than 2MB' });
                                                        return;
                                                    }
                                                    const reader = new FileReader();
                                                    reader.onloadend = () => {
                                                        setUser({ ...user, profilePicture: reader.result });
                                                    };
                                                    reader.readAsDataURL(file);
                                                }
                                            }}
                                            style={{
                                                padding: '12px', borderRadius: '12px', border: '1.5px dashed var(--border-color)',
                                                fontSize: '14px', outline: 'none', transition: 'all 0.2s',
                                                fontFamily: "'Sora', sans-serif", cursor: 'pointer',
                                                background: 'var(--bg-tertiary)', color: 'var(--text-secondary)'
                                            }}
                                            onMouseEnter={e => { e.currentTarget.style.borderColor = '#3b82f6'; e.currentTarget.style.background = 'rgba(59,130,246,0.1)'; e.currentTarget.style.color = '#3b82f6'; }}
                                            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.background = 'var(--bg-tertiary)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                                        />
                                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Click to select an image file (max 2MB).</span>
                                    </div>
                                )}

                                <button type="submit" disabled={loading} style={{
                                    padding: '13px 28px', borderRadius: '12px', border: 'none',
                                    fontSize: '14px', fontWeight: '700', cursor: loading ? 'wait' : 'pointer',
                                    background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                                    color: '#fff', alignSelf: 'flex-start',
                                    boxShadow: '0 4px 14px rgba(59,130,246,0.3)',
                                    transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '8px',
                                }}
                                onMouseEnter={e => !loading && (e.currentTarget.style.transform = 'translateY(-2px)', e.currentTarget.style.boxShadow = '0 6px 20px rgba(59,130,246,0.4)')}
                                onMouseLeave={e => !loading && (e.currentTarget.style.transform = 'translateY(0)', e.currentTarget.style.boxShadow = '0 4px 14px rgba(59,130,246,0.3)')}
                                >
                                    <Ic name={loading ? 'hourglass_empty' : 'save'} size={18} />
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* ─── Activity Tab ────────────────────────────────── */}
                {activeTab === 'activity' && (
                    <div style={{ animation: 'fadeUp 0.4s ease-out' }}>
                        <div style={{ marginBottom: '28px' }}>
                            <h2 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 6px 0', fontFamily: "'Syne', sans-serif" }}>
                                Recent Activity
                            </h2>
                            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0 }}>Your document processing, quiz generation, and summary activity timeline.</p>
                        </div>

                        {activities.length === 0 ? (
                            <div style={{
                                background: 'var(--bg-secondary)', borderRadius: '20px', padding: '64px 32px',
                                textAlign: 'center', border: '1px solid var(--border-color)',
                                boxShadow: 'var(--card-shadow)',
                            }}>
                                <div style={{
                                    width: 80, height: 80, borderRadius: '24px', margin: '0 auto 20px',
                                    background: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(139,92,246,0.1))',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <Ic name="timeline" size={36} style={{ color: 'var(--text-secondary)' }} />
                                </div>
                                <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)', margin: '0 0 8px 0' }}>No activity yet</h3>
                                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: '0 0 24px 0', maxWidth: 400, marginLeft: 'auto', marginRight: 'auto' }}>
                                    Start processing documents, generating quizzes, or creating summaries to see your activity timeline here.
                                </p>
                                <button onClick={() => navigate('/ai-engine')} style={{
                                    padding: '12px 24px', borderRadius: '12px', border: 'none',
                                    background: 'linear-gradient(135deg, #3b82f6, #2563eb)', color: '#fff',
                                    fontSize: '13px', fontWeight: '700', cursor: 'pointer',
                                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                                    boxShadow: '0 4px 14px rgba(59,130,246,0.3)',
                                    transition: 'all 0.2s',
                                }}
                                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
                                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
                                >
                                    <Ic name="rocket_launch" size={18} /> Go to AI Engine
                                </button>
                            </div>
                        ) : (
                            <div style={{
                                background: 'var(--bg-secondary)', borderRadius: '20px', padding: '28px',
                                border: '1px solid var(--border-color)',
                                boxShadow: 'var(--card-shadow)',
                            }}>
                                {activities.map((act, i) => (
                                    <ActivityItem key={act.id || i} activity={act} isLast={i === activities.length - 1} />
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* ─── Security Tab ────────────────────────────────── */}
                {activeTab === 'security' && (
                    <div style={{ animation: 'fadeUp 0.4s ease-out' }}>
                        <div style={{ marginBottom: '28px' }}>
                            <h2 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 6px 0', fontFamily: "'Syne', sans-serif" }}>
                                Security Settings
                            </h2>
                            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0 }}>Manage your password and account security.</p>
                        </div>

                        <div style={{
                            background: 'var(--bg-secondary)', borderRadius: '20px', padding: '32px',
                            boxShadow: 'var(--card-shadow)',
                            border: '1px solid var(--border-color)', marginBottom: '24px',
                        }}>
                            {user.provider !== 'local' ? (
                                <div style={{
                                    display: 'flex', gap: '14px', padding: '20px',
                                    backgroundColor: 'rgba(59,130,246,0.1)', borderRadius: '14px', fontSize: '14px', color: 'var(--text-primary)',
                                    alignItems: 'center', border: '1px solid var(--border-color)',
                                }}>
                                    <Ic name="info" size={22} fill style={{ color: '#3b82f6' }} />
                                    <p style={{ margin: 0 }}>You are logged in via <strong>{user.provider}</strong>. Password management is handled by your provider.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                        <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>Current Password</label>
                                        <input
                                            className="settings-input"
                                            type="password" value={passwords.currentPassword}
                                            onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                                            placeholder="••••••••"
                                            style={{
                                                padding: '12px 16px', borderRadius: '12px', border: '1.5px solid var(--border-color)',
                                                fontSize: '14px', outline: 'none', transition: 'all 0.2s',
                                                fontFamily: "'Sora', sans-serif",
                                            }}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                        <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>New Password</label>
                                        <input
                                            className="settings-input"
                                            type="password" value={passwords.newPassword}
                                            onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                                            placeholder="••••••••"
                                            style={{
                                                padding: '12px 16px', borderRadius: '12px', border: '1.5px solid var(--border-color)',
                                                fontSize: '14px', outline: 'none', transition: 'all 0.2s',
                                                fontFamily: "'Sora', sans-serif",
                                            }}
                                        />
                                    </div>
                                    <button type="submit" disabled={loading} style={{
                                        padding: '13px 28px', borderRadius: '12px', border: 'none',
                                        fontSize: '14px', fontWeight: '700', cursor: loading ? 'wait' : 'pointer',
                                        background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                                        color: '#fff', alignSelf: 'flex-start',
                                        boxShadow: '0 4px 14px rgba(59,130,246,0.3)',
                                        transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '8px',
                                    }}
                                    onMouseEnter={e => !loading && (e.currentTarget.style.transform = 'translateY(-2px)')}
                                    onMouseLeave={e => !loading && (e.currentTarget.style.transform = 'translateY(0)')}
                                    >
                                        <Ic name="lock" size={18} />
                                        {loading ? 'Updating...' : 'Update Password'}
                                    </button>
                                </form>
                            )}
                        </div>

                        {/* Danger Zone */}
                        <div style={{
                            background: 'var(--bg-secondary)', borderRadius: '20px', padding: '32px',
                            border: '1px solid rgba(239,68,68,0.3)',
                            boxShadow: 'var(--card-shadow)',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                                <Ic name="warning" size={22} fill style={{ color: '#ef4444' }} />
                                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#ef4444', margin: 0 }}>Danger Zone</h3>
                            </div>
                            <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px', lineHeight: 1.6 }}>
                                Once you delete your account, there is no going back. All your documents, quizzes, summaries, and activity history will be permanently removed.
                            </p>
                            <button type="button" onClick={handleDeleteAccount} style={{
                                padding: '12px 24px', borderRadius: '12px', border: '1.5px solid #fecaca',
                                fontSize: '13px', fontWeight: '700', cursor: 'pointer',
                                background: '#fef2f2', color: '#dc2626',
                                transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '8px',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = '#fee2e2'; e.currentTarget.style.borderColor = '#f87171'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = '#fef2f2'; e.currentTarget.style.borderColor = '#fecaca'; }}
                            >
                                <Ic name="delete_forever" size={18} /> Delete Account
                            </button>
                        </div>
                    </div>
                )}

                {/* ─── Preferences Tab ─────────────────────────────── */}
                {activeTab === 'preferences' && (
                    <div style={{ animation: 'fadeUp 0.4s ease-out' }}>
                        <div style={{ marginBottom: '28px' }}>
                            <h2 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 6px 0', fontFamily: "'Syne', sans-serif" }}>
                                Preferences
                            </h2>
                            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0 }}>Customize your experience and notification settings.</p>
                        </div>

                        <div style={{
                            background: 'var(--bg-secondary)', borderRadius: '20px', padding: '32px',
                            boxShadow: 'var(--card-shadow)',
                            border: '1px solid var(--border-color)', marginBottom: '24px',
                        }}>
                            <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Ic name="palette" size={20} fill style={{ color: '#3b82f6' }} /> Theme Preference
                            </h3>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button 
                                    onClick={() => handleThemeChange('light')}
                                    style={{
                                        flex: 1, padding: '16px', borderRadius: '14px',
                                        border: `2px solid ${theme === 'light' ? '#3b82f6' : 'var(--border-color)'}`, 
                                        background: theme === 'light' ? 'var(--bg-primary)' : 'var(--bg-secondary)',
                                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                                        fontSize: '14px', fontWeight: '600', color: theme === 'light' ? 'var(--text-primary)' : 'var(--text-secondary)',
                                        transition: 'all 0.2s',
                                    }}
                                >
                                    <Ic name="light_mode" size={22} fill style={{ color: '#f59e0b' }} /> Light Mode
                                </button>
                                <button 
                                    onClick={() => handleThemeChange('dark')}
                                    style={{
                                        flex: 1, padding: '16px', borderRadius: '14px',
                                        border: `2px solid ${theme === 'dark' ? '#3b82f6' : 'var(--border-color)'}`, 
                                        background: theme === 'dark' ? 'var(--bg-primary)' : 'var(--bg-secondary)',
                                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                                        fontSize: '14px', fontWeight: '600', color: theme === 'dark' ? 'var(--text-primary)' : 'var(--text-secondary)',
                                        transition: 'all 0.2s',
                                    }}
                                >
                                    <Ic name="dark_mode" size={22} fill style={{ color: '#6366f1' }} /> Dark Mode
                                </button>
                            </div>
                        </div>

                        <div style={{
                            background: 'var(--bg-secondary)', borderRadius: '20px', padding: '32px',
                            boxShadow: 'var(--card-shadow)',
                            border: '1px solid var(--border-color)', marginBottom: '24px',
                        }}>
                            <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)', margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Ic name="notifications" size={20} fill style={{ color: '#8b5cf6' }} /> Notification Settings
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {[
                                    { label: 'Email updates on AI Document Summaries', icon: 'mail', checked: true },
                                    { label: 'Weekly Workspace Usage Reports', icon: 'analytics', checked: true },
                                    { label: 'Quiz completion notifications', icon: 'quiz', checked: false },
                                ].map((notif, i) => (
                                    <label key={i} style={{
                                        display: 'flex', alignItems: 'center', gap: '14px',
                                        padding: '14px 16px', borderRadius: '12px', cursor: 'pointer',
                                        transition: 'all 0.2s', border: '1px solid transparent',
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-primary)'; e.currentTarget.style.borderColor = 'var(--border-color)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent'; }}
                                    >
                                        <Ic name={notif.icon} size={20} style={{ color: 'var(--text-secondary)' }} />
                                        <span style={{ flex: 1, fontSize: '14px', color: 'var(--text-primary)', fontWeight: '500' }}>{notif.label}</span>
                                        <input type="checkbox" defaultChecked={notif.checked} style={{ width: '20px', height: '20px', accentColor: '#3b82f6', cursor: 'pointer' }} />
                                    </label>
                                ))}
                            </div>
                        </div>

                        <button type="button" onClick={() => {
                            setMessage({ type: 'success', text: 'Preferences saved successfully!' });
                        }} style={{
                            padding: '13px 28px', borderRadius: '12px', border: 'none',
                            fontSize: '14px', fontWeight: '700', cursor: 'pointer',
                            background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                            color: '#fff', display: 'flex', alignItems: 'center', gap: '8px',
                            boxShadow: '0 4px 14px rgba(59,130,246,0.3)',
                            transition: 'all 0.2s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(59,130,246,0.4)'; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(59,130,246,0.3)'; }}
                        >
                            <Ic name="save" size={18} /> Save Preferences
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Settings;
