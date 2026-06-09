import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import YouTube from 'react-youtube';

/* ─── STYLES ─── */
const styles = {
    container: {
        display: 'flex',
        minHeight: '100vh',
        background: '#f8fafc',
    },
    main: {
        flex: 1,
        marginLeft: 256,
        paddingBottom: 100,
    },
    hero: {
        background: 'linear-gradient(180deg, #3b82f6 0%, #eff6ff 100%)',
        padding: '60px 40px 120px',
        color: '#fff',
        position: 'relative',
    },
    breadcrumb: {
        fontSize: 14,
        marginBottom: 20,
        opacity: 0.9,
    },
    heroTitle: {
        fontSize: 'clamp(28px, 4vw, 42px)',
        fontWeight: 800,
        marginBottom: 12,
        fontFamily: "'Space Grotesk', sans-serif",
    },
    ratings: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        marginBottom: 40,
    },
    heroContent: {
        display: 'flex',
        gap: 40,
        alignItems: 'flex-start',
        position: 'relative',
        zIndex: 2,
    },
    videoWrapper: {
        flex: 1.6,
        background: '#000',
        borderRadius: 24,
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        aspectRatio: '16/9',
    },
    summaryCard: {
        flex: 1,
        background: '#fff',
        borderRadius: 24,
        padding: 32,
        color: '#1e293b',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    },
    tag: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        fontSize: 13,
        fontWeight: 600,
        color: '#10b981',
        marginBottom: 16,
    },
    description: {
        fontSize: 15,
        lineHeight: 1.6,
        color: '#475569',
        marginBottom: 24,
    },
    metaGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 16,
        marginBottom: 32,
    },
    metaItem: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        fontSize: 13,
        color: '#64748b',
    },
    registerBtn: {
        width: '100%',
        padding: '16px',
        background: '#1e293b',
        color: '#fff',
        border: 'none',
        borderRadius: 12,
        fontSize: 16,
        fontWeight: 700,
        cursor: 'pointer',
        transition: 'all 0.2s',
    },
    featurePills: {
        display: 'flex',
        gap: 12,
        padding: '0 40px',
        marginTop: -40,
        position: 'relative',
        zIndex: 3,
        flexWrap: 'wrap',
    },
    pill: {
        padding: '10px 20px',
        background: '#fff',
        borderRadius: 99,
        fontSize: 13,
        fontWeight: 600,
        color: '#064e3b',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        border: '1px solid #d1fae5',
    },
    section: {
        padding: '80px 40px',
        maxWidth: 1200,
        margin: '0 auto',
    },
    sectionTitle: {
        fontSize: 28,
        fontWeight: 800,
        marginBottom: 40,
        textAlign: 'center',
        fontFamily: "'Space Grotesk', sans-serif",
    },
    roadmapList: {
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
    },
    roadmapItem: {
        background: '#fff',
        padding: 24,
        borderRadius: 16,
        border: '1px solid #e2e8f0',
        display: 'flex',
        gap: 20,
    },
    pricingGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: 32,
    },
    pricingCard: {
        background: '#fff',
        padding: 40,
        borderRadius: 24,
        border: '1px solid #e2e8f0',
        textAlign: 'center',
    },
    discountBanner: {
        position: 'fixed',
        bottom: 0,
        left: 256,
        right: 0,
        background: '#facc15',
        padding: '12px',
        textAlign: 'center',
        fontWeight: 700,
        fontSize: 14,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
    }
};

export default function CourseDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);

    // Mock detailed course data
    const mockDetails = {
        id: id || 101,
        title: "Data Structures and Algorithms - Self Paced",
        youtubeId: "vLnPwxZdW4Y", // Example ID
        description: "Most popular course on DSA trusted by 1,00,000+ students! Built with years of experience by industry experts, the course gives you a complete package of video lectures, practice problems, quizzes and contests. Enrol now to learn and master DSA skills!",
        rating: 4.7,
        category: "Self-Paced Course",
        level: "Beginner to Advanced",
        duration: "16 Weeks",
        interested: "1581k+",
        roadmap: [
            { title: "Introduction to Recursion", desc: "Learn the fundamentals of recursive thinking and patterns." },
            { title: "Sorting and Searching", desc: "Master all major algorithms for efficiency." },
            { title: "Linked Lists & Stacks", desc: "Deep dive into dynamic data structures." },
            { title: "Dynamic Programming", desc: "Unlock the power of optimal substructure solutions." }
        ],
        faqs: [
            { q: "Is this course free?", a: "The foundational modules are free. Full certification requires enrollment." },
            { q: "Will I get a certificate?", a: "Yes, a DocFlow AI verified certificate is issued upon completion." }
        ]
    };

    useEffect(() => {
        // In a real app, fetch detailed data by ID
        setCourse(mockDetails);
    }, [id]);

    if (!course) return null;

    return (
        <div style={styles.container}>
            <Sidebar />
            <main style={styles.main}>
                {/* HERO */}
                <header style={styles.hero}>
                    <div style={styles.breadcrumb}>
                        All Courses &gt; {course.category}
                    </div>
                    <h1 style={styles.heroTitle}>{course.title}</h1>
                    <div style={styles.ratings}>
                        <span style={{ color: '#fbbf24' }}>
                            {"★".repeat(Math.floor(course.rating))}
                            {"☆".repeat(5 - Math.floor(course.rating))}
                        </span>
                        <span>{course.rating}/5 ratings</span>
                    </div>

                    <div style={styles.heroContent}>
                        <div style={styles.videoWrapper}>
                            <YouTube 
                                videoId={course.youtubeId} 
                                opts={{ width: '100%', height: '100%', playerVars: { autoplay: 0 } }} 
                                style={{ width: '100%', height: '100%' }}
                            />
                        </div>

                        <div style={styles.summaryCard}>
                            <div style={styles.tag}>
                                <span className="material-symbols-outlined">trending_up</span>
                                {course.interested} interested Geeks
                            </div>
                            <p style={styles.description}>{course.description}</p>
                            
                            <div style={styles.metaGrid}>
                                <div style={styles.metaItem}>
                                    <span className="material-symbols-outlined">analytics</span> {course.level}
                                </div>
                                <div style={styles.metaItem}>
                                    <span className="material-symbols-outlined">schedule</span> {course.duration}
                                </div>
                            </div>

                            <button style={styles.registerBtn} onClick={() => alert("Registration logic coming soon!")}>
                                Register Now
                            </button>
                        </div>
                    </div>
                </header>

                {/* FEATURE PILLS */}
                <div style={styles.featurePills}>
                    <div style={styles.pill}>
                        <span style={{ color: '#10b981' }} className="material-symbols-outlined">task_alt</span> Comprehensive Learning
                    </div>
                    <div style={styles.pill}>
                        <span style={{ color: '#10b981' }} className="material-symbols-outlined">task_alt</span> Beginner Friendly
                    </div>
                    <div style={styles.pill}>
                        <span style={{ color: '#10b981' }} className="material-symbols-outlined">task_alt</span> Course Certificate
                    </div>
                    <div style={styles.pill}>
                        <span style={{ color: '#10b981' }} className="material-symbols-outlined">task_alt</span> Assessment Tests
                    </div>
                </div>

                {/* COURSE OVERVIEW */}
                <section style={styles.section}>
                    <h2 style={styles.sectionTitle}>Course Overview</h2>
                    <div style={styles.roadmapList}>
                        {course.roadmap.map((item, i) => (
                            <div key={i} style={styles.roadmapItem}>
                                <div style={{ fontSize: 24, fontWeight: 900, color: '#e2e8f0' }}>{i + 1}</div>
                                <div>
                                    <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{item.title}</h3>
                                    <p style={{ color: '#64748b' }}>{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* FAQ */}
                <section style={{ ...styles.section, background: '#fff' }}>
                    <h2 style={styles.sectionTitle}>Frequently Asked Questions</h2>
                    <div style={{ maxWidth: 800, margin: '0 auto' }}>
                        {course.faqs.map((faq, i) => (
                            <details key={i} style={{ marginBottom: 16, padding: '16px', border: '1px solid #e2e8f0', borderRadius: 12 }}>
                                <summary style={{ fontWeight: 700, cursor: 'pointer', listStyle: 'none' }}>{faq.q}</summary>
                                <p style={{ marginTop: 12, color: '#475569' }}>{faq.a}</p>
                            </details>
                        ))}
                    </div>
                </section>

                {/* PRICING */}
                <section style={styles.section}>
                    <h2 style={styles.sectionTitle}>Flexible Pricing</h2>
                    <div style={styles.pricingGrid}>
                        <div style={styles.pricingCard}>
                            <h3 style={{ fontWeight: 800, fontSize: 20, marginBottom: 16 }}>Starter</h3>
                            <div style={{ fontSize: 32, fontWeight: 900, marginBottom: 32 }}>FREE</div>
                            <ul style={{ textAlign: 'left', listStyle: 'none', marginBottom: 40, color: '#475569' }}>
                                <li style={{ marginBottom: 12 }}>✓ First 5 Modules</li>
                                <li style={{ marginBottom: 12 }}>✓ Community Support</li>
                                <li style={{ marginBottom: 12 }}>✓ Basic Quizzes</li>
                            </ul>
                            <button style={{ ...styles.registerBtn, background: '#e2e8f0', color: '#1e293b' }}>Try Now</button>
                        </div>
                        <div style={{ ...styles.pricingCard, borderColor: '#3b82f6', borderSize: 2, position: 'relative' }}>
                            <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: '#3b82f6', color: '#fff', padding: '4px 16px', borderRadius: 99, fontSize: 10, fontWeight: 800 }}>MOST POPULAR</div>
                            <h3 style={{ fontWeight: 800, fontSize: 20, marginBottom: 16 }}>Premium</h3>
                            <div style={{ fontSize: 32, fontWeight: 900, marginBottom: 32 }}>$29</div>
                            <ul style={{ textAlign: 'left', listStyle: 'none', marginBottom: 40, color: '#475569' }}>
                                <li style={{ marginBottom: 12 }}>✓ All 16 Modules</li>
                                <li style={{ marginBottom: 12 }}>✓ Verifiable Certificate</li>
                                <li style={{ marginBottom: 12 }}>✓ 1-on-1 Mentorship</li>
                            </ul>
                            <button style={{ ...styles.registerBtn, background: '#3b82f6' }}>Enroll Full</button>
                        </div>
                    </div>
                </section>

                <Footer />

                {/* DISCOUNT BANNER */}
                <div style={styles.discountBanner}>
                    <span className="material-symbols-outlined" style={{ fontSize: 20 }}>info</span>
                    Limited Time Discount Active - Apply Discount on Checkout Page!
                    <button style={{ marginLeft: 20, background: '#1e293b', color: '#fff', border: 'none', padding: '6px 16px', borderRadius: 8, fontSize: 12, cursor: 'pointer' }}>Apply Now</button>
                </div>
            </main>
        </div>
    );
}
