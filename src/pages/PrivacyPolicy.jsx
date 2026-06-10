import { useEffect } from "react";
import { Link } from "react-router-dom";

export default function PrivacyPolicy() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const sectionStyle = {
    marginBottom: 40,
  };
  const h2Style = {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: "1.35rem",
    fontWeight: 800,
    color: "#0f172a",
    marginBottom: 14,
    letterSpacing: "-.02em",
  };
  const pStyle = {
    fontSize: ".925rem",
    lineHeight: 1.8,
    color: "#475569",
    marginBottom: 12,
  };
  const listStyle = {
    paddingLeft: 24,
    marginBottom: 16,
  };
  const liStyle = {
    fontSize: ".925rem",
    lineHeight: 1.8,
    color: "#475569",
    marginBottom: 6,
  };

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: "#f8fafc", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
      `}</style>

      {/* Navigation Bar */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(255,255,255,0.85)", backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(226,232,240,0.6)",
        padding: "0 32px", height: 64,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 20, fontWeight: 800, color: "#0f172a",
          }}>DocFlow <span style={{ color: "#004ac6" }}>AI</span></span>
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <Link to="/terms-of-service" style={{ fontSize: 13, fontWeight: 600, color: "#64748b", textDecoration: "none" }}>Terms of Service</Link>
          <Link to="/" style={{
            fontSize: 13, fontWeight: 700, color: "#fff",
            background: "#004ac6", padding: "8px 20px", borderRadius: 10,
            textDecoration: "none",
          }}>Back to Home</Link>
        </div>
      </nav>

      {/* Hero Header */}
      <header style={{
        background: "linear-gradient(135deg, #004ac6 0%, #1d4ed8 40%, #3b82f6 100%)",
        padding: "72px 32px 56px", textAlign: "center",
      }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "rgba(255,255,255,0.15)", borderRadius: 100,
          padding: "6px 18px", marginBottom: 20,
          fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.9)",
          textTransform: "uppercase", letterSpacing: ".1em",
        }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80" }} />
          Legal Document
        </div>
        <h1 style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: "clamp(2rem, 4vw, 3rem)",
          fontWeight: 800, color: "#fff",
          marginBottom: 12, letterSpacing: "-.03em",
        }}>Privacy Policy</h1>
        <p style={{
          fontSize: "1.05rem", color: "rgba(255,255,255,0.75)",
          maxWidth: 560, margin: "0 auto",
        }}>
          Your trust matters. Here's how DocFlow AI collects, protects, and uses your information.
        </p>
        <div style={{ marginTop: 20, fontSize: 13, color: "rgba(255,255,255,0.5)", fontWeight: 600 }}>
          Last Updated: June 10, 2026 &nbsp;•&nbsp; Effective Immediately
        </div>
      </header>

      {/* Content */}
      <main style={{ maxWidth: 820, margin: "0 auto", padding: "56px 28px 80px" }}>

        <div style={sectionStyle}>
          <h2 style={h2Style}>1. Introduction</h2>
          <p style={pStyle}>
            DocFlow AI ("we", "our", or "us") operates the DocFlow AI platform, including all associated web applications, 
            APIs, AI-powered services, and educational tools (collectively, the "Service"). This Privacy Policy explains 
            how we collect, use, disclose, and safeguard your personal information when you access or use our Service.
          </p>
          <p style={pStyle}>
            By accessing or using DocFlow AI, you agree to this Privacy Policy. If you do not agree with the terms of this 
            policy, please do not access or use our Service.
          </p>
        </div>

        <div style={sectionStyle}>
          <h2 style={h2Style}>2. Information We Collect</h2>
          <p style={pStyle}>We collect the following categories of information:</p>

          <h3 style={{ ...h2Style, fontSize: "1.1rem", marginTop: 20 }}>2.1 Personal Information You Provide</h3>
          <ul style={listStyle}>
            <li style={liStyle}><strong>Account Data:</strong> Name, email address, and profile picture when you create an account.</li>
            <li style={liStyle}><strong>Content Data:</strong> Documents, notes, course progress, and any text or files you upload to the platform.</li>
            <li style={liStyle}><strong>Communication Data:</strong> Messages you send through our support channels or AI chat features.</li>
            <li style={liStyle}><strong>Payment Data:</strong> Billing information processed through our secure third-party payment providers (we do not store full payment card details).</li>
          </ul>

          <h3 style={{ ...h2Style, fontSize: "1.1rem", marginTop: 20 }}>2.2 Information Collected Automatically</h3>
          <ul style={listStyle}>
            <li style={liStyle}><strong>Usage Data:</strong> Pages visited, features used, timestamps, click patterns, and session duration.</li>
            <li style={liStyle}><strong>Device Data:</strong> Browser type, operating system, device identifiers, and screen resolution.</li>
            <li style={liStyle}><strong>Log Data:</strong> IP address, access times, referring URLs, and error logs.</li>
            <li style={liStyle}><strong>Cookie Data:</strong> We use essential, analytical, and preference cookies to enhance your experience.</li>
          </ul>
        </div>

        <div style={sectionStyle}>
          <h2 style={h2Style}>3. How We Use Your Information</h2>
          <p style={pStyle}>We use the information we collect to:</p>
          <ul style={listStyle}>
            <li style={liStyle}>Provide, maintain, and improve our AI-powered educational services.</li>
            <li style={liStyle}>Personalize your learning experience, including AI-curated course recommendations and intelligent note summaries.</li>
            <li style={liStyle}>Process your documents through our AI Engine for summarization, flashcard generation, and content analysis.</li>
            <li style={liStyle}>Send you service-related notifications, security alerts, and support messages.</li>
            <li style={liStyle}>Detect, investigate, and prevent fraudulent or unauthorized activities.</li>
            <li style={liStyle}>Comply with legal obligations and enforce our Terms of Service.</li>
            <li style={liStyle}>Conduct anonymized research to improve our AI models and educational methodologies.</li>
          </ul>
        </div>

        <div style={sectionStyle}>
          <h2 style={h2Style}>4. AI Data Processing</h2>
          <p style={pStyle}>
            DocFlow AI utilizes advanced artificial intelligence models (including Google Gemini) to provide features such as 
            document summarization, flashcard generation, intelligent search, and personalized learning recommendations. 
            When you use these features:
          </p>
          <ul style={listStyle}>
            <li style={liStyle}>Your content is transmitted securely to our AI processing partners for analysis.</li>
            <li style={liStyle}>We do not use your personal documents to train third-party AI models without your explicit consent.</li>
            <li style={liStyle}>AI-generated outputs (summaries, flashcards, insights) are stored within your account and are not shared with other users.</li>
            <li style={liStyle}>You retain full ownership of all content you upload and all AI-generated derivatives of your content.</li>
          </ul>
        </div>

        <div style={sectionStyle}>
          <h2 style={h2Style}>5. Data Sharing & Disclosure</h2>
          <p style={pStyle}>We do not sell your personal information. We may share your data with:</p>
          <ul style={listStyle}>
            <li style={liStyle}><strong>Service Providers:</strong> Trusted third-party vendors who assist in operating our platform (hosting, analytics, AI processing) under strict data protection agreements.</li>
            <li style={liStyle}><strong>Legal Authorities:</strong> When required by law, subpoena, or governmental request, or to protect the rights, safety, and property of DocFlow AI and its users.</li>
            <li style={liStyle}><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets, your data may be transferred to the succeeding entity.</li>
          </ul>
        </div>

        <div style={sectionStyle}>
          <h2 style={h2Style}>6. Data Security</h2>
          <p style={pStyle}>
            We implement industry-standard security measures to protect your information, including:
          </p>
          <ul style={listStyle}>
            <li style={liStyle}>TLS/SSL encryption for all data transmitted between your browser and our servers.</li>
            <li style={liStyle}>Encrypted storage for sensitive personal data at rest.</li>
            <li style={liStyle}>Role-based access controls limiting employee access to user data.</li>
            <li style={liStyle}>Regular security audits and vulnerability assessments.</li>
            <li style={liStyle}>Automated threat detection and incident response protocols.</li>
          </ul>
          <p style={pStyle}>
            While we strive to protect your information, no method of electronic transmission or storage is 100% secure. 
            We cannot guarantee absolute security but commit to promptly notifying affected users of any data breach 
            in accordance with applicable laws.
          </p>
        </div>

        <div style={sectionStyle}>
          <h2 style={h2Style}>7. Data Retention</h2>
          <p style={pStyle}>
            We retain your personal information for as long as your account is active or as needed to provide you with 
            our services. Upon account deletion, we will remove your personal data within 30 days, except where 
            retention is required for legal compliance, dispute resolution, or enforcement of our agreements.
          </p>
        </div>

        <div style={sectionStyle}>
          <h2 style={h2Style}>8. Your Rights & Choices</h2>
          <p style={pStyle}>Depending on your jurisdiction, you may have the right to:</p>
          <ul style={listStyle}>
            <li style={liStyle}><strong>Access:</strong> Request a copy of the personal data we hold about you.</li>
            <li style={liStyle}><strong>Rectification:</strong> Request correction of inaccurate or incomplete personal data.</li>
            <li style={liStyle}><strong>Erasure:</strong> Request deletion of your personal data ("right to be forgotten").</li>
            <li style={liStyle}><strong>Portability:</strong> Request transfer of your data to another service provider in a structured format.</li>
            <li style={liStyle}><strong>Objection:</strong> Object to the processing of your personal data for certain purposes.</li>
            <li style={liStyle}><strong>Withdraw Consent:</strong> Withdraw previously given consent at any time without affecting prior processing.</li>
          </ul>
          <p style={pStyle}>
            To exercise any of these rights, please contact us at <strong>privacy@docflowai.com</strong>.
          </p>
        </div>

        <div style={sectionStyle}>
          <h2 style={h2Style}>9. Children's Privacy</h2>
          <p style={pStyle}>
            DocFlow AI is not intended for children under the age of 13. We do not knowingly collect personal 
            information from children under 13. If you believe a child has provided us with personal information, 
            please contact us immediately and we will take steps to delete such information.
          </p>
        </div>

        <div style={sectionStyle}>
          <h2 style={h2Style}>10. Changes to This Policy</h2>
          <p style={pStyle}>
            We may update this Privacy Policy from time to time to reflect changes in our practices, technologies, 
            legal requirements, or other factors. We will notify you of material changes by posting a prominent notice 
            on our platform or by sending you a direct notification. Your continued use of the Service after such 
            changes constitutes acceptance of the updated policy.
          </p>
        </div>

        <div style={{
          background: "#fff", borderRadius: 16, padding: "28px 32px",
          border: "1px solid rgba(226,232,240,0.6)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
        }}>
          <h2 style={{ ...h2Style, marginBottom: 10 }}>11. Contact Us</h2>
          <p style={pStyle}>
            If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, 
            please reach out to us:
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: ".925rem", color: "#334155", fontWeight: 500 }}>
            <span>📧 Email: <strong>privacy@docflowai.com</strong></span>
            <span>🏢 DocFlow AI — TRS College, Rewa</span>
            <span>📍 Rewa, Madhya Pradesh, India</span>
          </div>
        </div>

        {/* Bottom navigation */}
        <div style={{
          marginTop: 48, paddingTop: 32,
          borderTop: "1px solid rgba(226,232,240,0.5)",
          display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16,
        }}>
          <Link to="/terms-of-service" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            fontSize: 14, fontWeight: 700, color: "#004ac6", textDecoration: "none",
          }}>
            Read our Terms of Service →
          </Link>
          <Link to="/" style={{
            fontSize: 13, fontWeight: 600, color: "#64748b", textDecoration: "none",
          }}>
            ← Back to Home
          </Link>
        </div>
      </main>
    </div>
  );
}
