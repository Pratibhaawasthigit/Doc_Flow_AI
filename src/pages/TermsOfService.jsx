import { useEffect } from "react";
import { Link } from "react-router-dom";

export default function TermsOfService() {
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
          <Link to="/privacy-policy" style={{ fontSize: 13, fontWeight: 600, color: "#64748b", textDecoration: "none" }}>Privacy Policy</Link>
          <Link to="/" style={{
            fontSize: 13, fontWeight: 700, color: "#fff",
            background: "#004ac6", padding: "8px 20px", borderRadius: 10,
            textDecoration: "none",
          }}>Back to Home</Link>
        </div>
      </nav>

      {/* Hero Header */}
      <header style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 40%, #334155 100%)",
        padding: "72px 32px 56px", textAlign: "center",
      }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "rgba(255,255,255,0.1)", borderRadius: 100,
          padding: "6px 18px", marginBottom: 20,
          fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.8)",
          textTransform: "uppercase", letterSpacing: ".1em",
        }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#3b82f6" }} />
          Legal Agreement
        </div>
        <h1 style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: "clamp(2rem, 4vw, 3rem)",
          fontWeight: 800, color: "#fff",
          marginBottom: 12, letterSpacing: "-.03em",
        }}>Terms & Conditions</h1>
        <p style={{
          fontSize: "1.05rem", color: "rgba(255,255,255,0.65)",
          maxWidth: 560, margin: "0 auto",
        }}>
          Please read these terms carefully before using DocFlow AI. They govern your access to and use of our platform.
        </p>
        <div style={{ marginTop: 20, fontSize: 13, color: "rgba(255,255,255,0.4)", fontWeight: 600 }}>
          Last Updated: June 10, 2026 &nbsp;•&nbsp; Version 2.0
        </div>
      </header>

      {/* Content */}
      <main style={{ maxWidth: 820, margin: "0 auto", padding: "56px 28px 80px" }}>

        <div style={sectionStyle}>
          <h2 style={h2Style}>1. Acceptance of Terms</h2>
          <p style={pStyle}>
            By creating an account on or accessing DocFlow AI ("the Platform"), you acknowledge that you have read, 
            understood, and agree to be bound by these Terms and Conditions ("Terms"), along with our{" "}
            <Link to="/privacy-policy" style={{ color: "#004ac6", fontWeight: 600 }}>Privacy Policy</Link>, 
            which is incorporated herein by reference. If you do not agree to these Terms, you must not use the Platform.
          </p>
          <p style={pStyle}>
            These Terms constitute a legally binding agreement between you ("User", "you", or "your") and DocFlow AI Inc. 
            ("DocFlow AI", "Company", "we", "our", or "us"). We reserve the right to modify these Terms at any time; 
            your continued use of the Platform following any changes constitutes acceptance of the revised Terms.
          </p>
        </div>

        <div style={sectionStyle}>
          <h2 style={h2Style}>2. Description of Service</h2>
          <p style={pStyle}>
            DocFlow AI is an AI-powered intelligent workspace and education platform that provides:
          </p>
          <ul style={listStyle}>
            <li style={liStyle}><strong>Education Hub:</strong> A curated library of tutorials, courses, and learning resources powered by AI-driven recommendations.</li>
            <li style={liStyle}><strong>AI Workspace:</strong> Intelligent document management, automated summarization, flashcard generation, and neural content analysis.</li>
            <li style={liStyle}><strong>Notes System:</strong> A modular knowledge repository with AI-assisted note organization, search, and study tools.</li>
            <li style={liStyle}><strong>AI Engine:</strong> Advanced natural language processing capabilities including content generation, document analysis, and personalized learning paths.</li>
            <li style={liStyle}><strong>DocFlow Core:</strong> Backend infrastructure providing API access, data processing pipelines, and integration capabilities.</li>
          </ul>
        </div>

        <div style={sectionStyle}>
          <h2 style={h2Style}>3. User Accounts</h2>
          <p style={pStyle}>To access certain features of the Platform, you must create an account. You agree to:</p>
          <ul style={listStyle}>
            <li style={liStyle}>Provide accurate, current, and complete registration information.</li>
            <li style={liStyle}>Maintain and promptly update your account information to keep it accurate.</li>
            <li style={liStyle}>Maintain the security and confidentiality of your login credentials.</li>
            <li style={liStyle}>Accept responsibility for all activities that occur under your account.</li>
            <li style={liStyle}>Notify us immediately of any unauthorized use of your account.</li>
          </ul>
          <p style={pStyle}>
            We reserve the right to suspend or terminate your account if any information provided is found to be 
            inaccurate, false, or in violation of these Terms.
          </p>
        </div>

        <div style={sectionStyle}>
          <h2 style={h2Style}>4. Acceptable Use Policy</h2>
          <p style={pStyle}>You agree not to use the Platform to:</p>
          <ul style={listStyle}>
            <li style={liStyle}>Upload, transmit, or distribute any content that is unlawful, harmful, threatening, abusive, defamatory, or otherwise objectionable.</li>
            <li style={liStyle}>Infringe upon the intellectual property rights, privacy rights, or other rights of any third party.</li>
            <li style={liStyle}>Attempt to gain unauthorized access to any portion of the Platform, other user accounts, or any systems or networks connected to the Platform.</li>
            <li style={liStyle}>Use automated scripts, bots, or scraping tools to access the Platform without prior written consent.</li>
            <li style={liStyle}>Reverse engineer, decompile, or disassemble any aspect of the Platform's software or AI models.</li>
            <li style={liStyle}>Use AI-generated content from the Platform to develop competing AI products or services.</li>
            <li style={liStyle}>Distribute malware, viruses, or any other malicious code through the Platform.</li>
            <li style={liStyle}>Engage in any activity that disrupts or interferes with the Platform's performance or other users' experience.</li>
          </ul>
        </div>

        <div style={sectionStyle}>
          <h2 style={h2Style}>5. Intellectual Property Rights</h2>

          <h3 style={{ ...h2Style, fontSize: "1.1rem", marginTop: 20 }}>5.1 Platform Ownership</h3>
          <p style={pStyle}>
            All rights, title, and interest in and to the Platform — including all software, algorithms, AI models, 
            visual designs, text, graphics, logos, trademarks, and service marks — are and shall remain the exclusive 
            property of DocFlow AI Inc. and its licensors. Nothing in these Terms grants you any right, title, or 
            interest in the Platform except for the limited right to use it in accordance with these Terms.
          </p>

          <h3 style={{ ...h2Style, fontSize: "1.1rem", marginTop: 20 }}>5.2 Your Content</h3>
          <p style={pStyle}>
            You retain full ownership of all content you upload, create, or submit to the Platform ("User Content"). 
            By uploading User Content, you grant DocFlow AI a non-exclusive, worldwide, royalty-free license to use, 
            process, and display your content solely for the purpose of providing and improving our services to you. 
            This license terminates when you delete your content or your account.
          </p>

          <h3 style={{ ...h2Style, fontSize: "1.1rem", marginTop: 20 }}>5.3 AI-Generated Content</h3>
          <p style={pStyle}>
            Content generated by our AI features (summaries, flashcards, insights) based on your User Content is 
            considered a derivative of your content. You are granted a perpetual, non-exclusive license to use such 
            AI-generated content for personal and educational purposes. DocFlow AI retains no ownership claim over 
            AI outputs derived from your personal content.
          </p>
        </div>

        <div style={sectionStyle}>
          <h2 style={h2Style}>6. Educational Content & Courses</h2>
          <p style={pStyle}>
            The educational materials, courses, tutorials, and learning resources available on the Platform are 
            provided for informational and educational purposes only. While we strive to ensure accuracy and quality:
          </p>
          <ul style={listStyle}>
            <li style={liStyle}>We do not guarantee that all educational content is error-free, complete, or up-to-date.</li>
            <li style={liStyle}>Course enrollment does not constitute a formal educational credential or certification unless explicitly stated.</li>
            <li style={liStyle}>AI-curated learning paths are recommendations based on algorithms and should not replace professional academic guidance.</li>
            <li style={liStyle}>Third-party content linked from our platform is subject to the respective provider's terms and policies.</li>
          </ul>
        </div>

        <div style={sectionStyle}>
          <h2 style={h2Style}>7. Payments & Subscriptions</h2>
          <p style={pStyle}>
            Certain features of the Platform may require a paid subscription. By subscribing to a paid plan:
          </p>
          <ul style={listStyle}>
            <li style={liStyle}>You agree to pay all applicable fees as described at the time of purchase.</li>
            <li style={liStyle}>Subscriptions automatically renew unless cancelled prior to the renewal date.</li>
            <li style={liStyle}>Refunds are provided in accordance with our refund policy, available upon request.</li>
            <li style={liStyle}>We reserve the right to change subscription pricing with 30 days' advance notice.</li>
            <li style={liStyle}>Free-tier features may be modified, limited, or discontinued at our discretion.</li>
          </ul>
        </div>

        <div style={sectionStyle}>
          <h2 style={h2Style}>8. Limitation of Liability</h2>
          <p style={pStyle}>
            TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, DOCFLOW AI AND ITS DIRECTORS, OFFICERS, EMPLOYEES, 
            AGENTS, AND AFFILIATES SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR 
            PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE 
            LOSSES, ARISING OUT OF OR IN CONNECTION WITH:
          </p>
          <ul style={listStyle}>
            <li style={liStyle}>Your access to, use of, or inability to use the Platform.</li>
            <li style={liStyle}>Any conduct or content of any third party on the Platform.</li>
            <li style={liStyle}>Any AI-generated content, recommendations, or outputs produced by the Platform.</li>
            <li style={liStyle}>Unauthorized access to or alteration of your transmissions or data.</li>
          </ul>
          <p style={pStyle}>
            In no event shall our total aggregate liability exceed the greater of (a) the amount you have paid to 
            DocFlow AI in the twelve (12) months preceding the claim, or (b) one hundred US dollars ($100).
          </p>
        </div>

        <div style={sectionStyle}>
          <h2 style={h2Style}>9. Disclaimer of Warranties</h2>
          <p style={pStyle}>
            THE PLATFORM IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS WITHOUT WARRANTIES OF ANY KIND, EITHER 
            EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A 
            PARTICULAR PURPOSE, NON-INFRINGEMENT, AND ACCURACY. WE DO NOT WARRANT THAT THE PLATFORM WILL BE 
            UNINTERRUPTED, SECURE, OR ERROR-FREE, OR THAT DEFECTS WILL BE CORRECTED.
          </p>
        </div>

        <div style={sectionStyle}>
          <h2 style={h2Style}>10. Indemnification</h2>
          <p style={pStyle}>
            You agree to indemnify, defend, and hold harmless DocFlow AI, its affiliates, officers, directors, employees, 
            and agents from and against any and all claims, damages, obligations, losses, liabilities, costs, and expenses 
            (including attorney's fees) arising from: (a) your use of the Platform; (b) your violation of these Terms; 
            (c) your violation of any third-party rights, including intellectual property or privacy rights; or 
            (d) any content you upload or submit to the Platform.
          </p>
        </div>

        <div style={sectionStyle}>
          <h2 style={h2Style}>11. Termination</h2>
          <p style={pStyle}>
            We may terminate or suspend your access to the Platform immediately, without prior notice or liability, 
            for any reason, including if you breach these Terms. Upon termination:
          </p>
          <ul style={listStyle}>
            <li style={liStyle}>Your right to use the Platform will immediately cease.</li>
            <li style={liStyle}>We may delete your account and all associated data within 30 days, unless retention is required by law.</li>
            <li style={liStyle}>You may request a data export prior to account deletion by contacting our support team.</li>
            <li style={liStyle}>Provisions of these Terms that by their nature should survive termination shall survive, including ownership, warranty disclaimers, indemnity, and limitations of liability.</li>
          </ul>
        </div>

        <div style={sectionStyle}>
          <h2 style={h2Style}>12. Governing Law & Dispute Resolution</h2>
          <p style={pStyle}>
            These Terms shall be governed by and construed in accordance with the laws of India, without regard to 
            its conflict of law provisions. Any dispute arising out of or relating to these Terms or the Platform 
            shall be resolved through binding arbitration in Rewa, Madhya Pradesh, India, under the rules of the Indian 
            Arbitration and Conciliation Act. You agree to waive any right to participate in a class action lawsuit 
            or class-wide arbitration.
          </p>
        </div>

        <div style={{
          background: "#fff", borderRadius: 16, padding: "28px 32px",
          border: "1px solid rgba(226,232,240,0.6)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
        }}>
          <h2 style={{ ...h2Style, marginBottom: 10 }}>13. Contact Information</h2>
          <p style={pStyle}>
            For any questions regarding these Terms & Conditions, please contact us:
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: ".925rem", color: "#334155", fontWeight: 500 }}>
            <span>📧 Email: <strong>legal@docflowai.com</strong></span>
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
          <Link to="/privacy-policy" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            fontSize: 14, fontWeight: 700, color: "#004ac6", textDecoration: "none",
          }}>
            Read our Privacy Policy →
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
