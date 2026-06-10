import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import api from "../services/api";

export default function HomeLogin({ onClose }) {
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg("");

        try {
            const trimmedEmail = email.trim();
            const trimmedPassword = password.trim();
            const endpoint = isLogin ? "/auth/login" : "/auth/register";
            const body = isLogin ? { email: trimmedEmail, password: trimmedPassword } : { name, email: trimmedEmail, password: trimmedPassword };
            
            const res = await api.post(endpoint, body);
            const data = res.data;
            
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify({ name: data.name || name, email: data.email || email }));
            if(onClose) onClose();
            navigate("/dashboard");
        } catch (err) {
            setErrorMsg(err.response?.data?.error || "Authentication failed");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        setLoading(true);
        try {
            const decoded = jwtDecode(credentialResponse.credential);
            const res = await api.post("/auth/google", {
                email: decoded.email,
                name: decoded.name,
                googleId: decoded.sub,
                picture: decoded.picture
            });
            
            const data = res.data;
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify({ 
                name: data.name, 
                email: data.email, 
                profilePicture: data.profilePicture || decoded.picture 
            }));
            
            if(onClose) onClose();
            navigate("/dashboard");
        } catch (err) {
            setErrorMsg("Google login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            background: "#fff",
            borderRadius: "12px",
            padding: "36px 40px",
            width: "100%",
            position: "relative",
            fontFamily: "'Inter', 'Sora', sans-serif",
            color: "#333",
            boxSizing: "border-box",
            boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
        }}>
            {/* Close Button */}
            {onClose && (
                <button 
                    onClick={onClose}
                    style={{ position: "absolute", top: 20, right: 20, background: "none", border: "none", cursor: "pointer", fontSize: 24, color: "#9ca3af" }}
                >
                    &times;
                </button>
            )}

            <h2 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "8px", color: "#111827" }}>
                {isLogin ? "Log in" : "Register"}
            </h2>
            
            <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "28px" }}>
                {isLogin ? "New user ? " : "Already have an account? "}
                <span 
                    onClick={() => { setIsLogin(!isLogin); setErrorMsg(""); }} 
                    style={{ color: "#2563eb", cursor: "pointer", fontWeight: "500" }}
                >
                    {isLogin ? "Register Now" : "Log in Now"}
                </span>
            </p>

            {errorMsg && (
                <div style={{ padding: "10px", background: "#fee2e2", color: "#ef4444", borderRadius: "8px", fontSize: "13px", marginBottom: "20px" }}>
                    {errorMsg}
                </div>
            )}

            {/* Google Button */}
            <div style={{ marginBottom: "20px", width: "100%", display: "flex", justifyContent: "center" }}>
                <GoogleLogin 
                    onSuccess={handleGoogleSuccess}
                    onError={() => setErrorMsg("Google login failed")}
                    useOneTap
                    theme="outline"
                    size="large"
                    width="100%"
                />
            </div>

            {/* Social Icons Row */}
            <div style={{ display: "flex", justifyContent: "center", gap: "16px", marginBottom: "24px" }}>
                {[
                    { c: "#1877f2", p: "M24 12.07C17.37 12.07 12 17.44 12 24c0 5.95 4.36 10.89 10.13 11.83v-8.37H19.1v-3.46h3.03v-2.65c0-3 1.79-4.66 4.53-4.66 1.31 0 2.68.23 2.68.23v2.95h-1.51c-1.49 0-1.95.93-1.95 1.88v2.25h3.32l-.53 3.46h-2.79v8.37A12.01 12.01 0 0036 24c0-6.56-5.37-11.93-12-11.93z" },
                    { c: "#0a66c2", p: "M15.4 34.6v-15.4h-5.1v15.4h5.1zm-2.5-17.5c1.8 0 2.9-1.2 2.9-2.7-.1-1.5-1.1-2.7-2.8-2.7-1.7 0-2.9 1.1-2.9 2.7 0 1.5 1.1 2.7 2.8 2.7zm21.4 17.5v-8.9c0-4.8-1.8-8.1-6.7-8.1-2.7 0-4.2 1.5-4.9 2.7h.1v-2.3h-4.9v15.4h5.1v-8.3c0-.4 0-.9.1-1.2.4-1 1.2-1.9 2.5-1.9 1.8 0 2.6 1.4 2.6 3.4v8h5.1z" },
                    { c: "#181717", p: "M24 11.5c-6.9 0-12.5 5.6-12.5 12.5 0 5.5 3.6 10.2 8.6 11.9.6.1.9-.3.9-.6v-2.1c-3.5.8-4.2-1.7-4.2-1.7-.6-1.5-1.4-1.9-1.4-1.9-1.1-.8.1-.7.1-.7 1.3.1 1.9 1.3 1.9 1.3 1.1 1.9 3 1.4 3.7 1 .1-.8.4-1.4.8-1.7-2.8-.3-5.7-1.4-5.7-6.2 0-1.4.5-2.5 1.3-3.4-.1-.3-.6-1.6.1-3.3 0 0 1.1-.3 3.5 1.3 1-.3 2.1-.4 3.1-.4 1 0 2.1.1 3.1.4 2.4-1.6 3.5-1.3 3.5-1.3.7 1.7.2 3 .1 3.3.8.9 1.3 2 1.3 3.4 0 4.8-2.9 5.9-5.7 6.2.5.4.9 1.2.9 2.4v3.5c0 .3.3.7.9.6 5-1.7 8.6-6.4 8.6-11.9 0-6.9-5.6-12.5-12.5-12.5z" },
                    { c: "#10b981", p: "M24 14.5c5.25 0 9.5 4.25 9.5 9.5S29.25 33.5 24 33.5s-9.5-4.25-9.5-9.5 4.25-9.5 9.5-9.5z" }
                ].map((icon, i) => (
                    <div key={i} style={{ width: "42px", height: "42px", borderRadius: "50%", border: "1px solid #e5e7eb", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.2s" }} onMouseEnter={e => e.currentTarget.style.boxShadow = "0 2px 6px rgba(0,0,0,0.05)"} onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}>
                        <svg width="48" height="48" viewBox="0 0 48 48">
                            {icon.p.includes("circle") ? null : <path fill={icon.c} d={icon.p}/>}
                            {icon.c === "#10b981" && <circle cx="24" cy="24" r="7" stroke="#3b82f6" strokeWidth="4" fill="none" />}
                        </svg>
                    </div>
                ))}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
                <div style={{ flex: 1, height: "1px", background: "#e5e7eb" }}></div>
                <span style={{ fontSize: "14px", color: "#9ca3af" }}>or</span>
                <div style={{ flex: 1, height: "1px", background: "#e5e7eb" }}></div>
            </div>

            <form onSubmit={handleSubmit}>
                {!isLogin && (
                    <div style={{ marginBottom: "16px" }}>
                        <label style={{ display: "block", fontSize: "14px", color: "#374151", marginBottom: "6px" }}>Full Name</label>
                        <input 
                            type="text" 
                            placeholder="Full Name" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            style={{ width: "100%", padding: "12px 14px", borderRadius: "8px", border: "1px solid #d1d5db", fontSize: "15px", outline: "none", boxSizing: "border-box" }} 
                            onFocus={e => e.target.style.borderColor = "#004ac6"}
                            onBlur={e => e.target.style.borderColor = "#d1d5db"}
                        />
                    </div>
                )}
                
                <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "14px", color: "#374151", marginBottom: "6px" }}>Username or Email</label>
                    <input 
                        type="email" 
                        placeholder="Username or Email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{ width: "100%", padding: "12px 14px", borderRadius: "8px", border: "1px solid #d1d5db", fontSize: "15px", outline: "none", boxSizing: "border-box" }} 
                        onFocus={e => e.target.style.borderColor = "#004ac6"}
                        onBlur={e => e.target.style.borderColor = "#d1d5db"}
                    />
                </div>

                <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "14px", color: "#374151", marginBottom: "6px" }}>Password</label>
                    <div style={{ position: "relative" }}>
                        <input 
                            type={showPassword ? "text" : "password"} 
                            placeholder="Enter password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{ width: "100%", padding: "12px 40px 12px 14px", borderRadius: "8px", border: "1px solid #d1d5db", fontSize: "15px", outline: "none", boxSizing: "border-box" }}
                            onFocus={e => e.target.style.borderColor = "#004ac6"}
                            onBlur={e => e.target.style.borderColor = "#d1d5db"}
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9ca3af", display: "flex", alignItems: "center", padding: 0 }}>
                            <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>
                                {showPassword ? "visibility" : "visibility_off"}
                            </span>
                        </button>
                    </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", color: "#4b5563", cursor: "pointer" }}>
                        <input type="checkbox" style={{ width: "16px", height: "16px", accentColor: "#2563eb", cursor: "pointer" }} />
                        Remember Me
                    </label>
                    {isLogin && (
                        <a href="#" style={{ fontSize: "14px", color: "#2563eb", textDecoration: "none", fontWeight: "500" }}>Forgot password</a>
                    )}
                </div>

                <button type="submit" disabled={loading} style={{
                    width: "100%",
                    padding: "14px",
                    background: "linear-gradient(135deg, #004ac6, #2563eb)",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "16px",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    marginBottom: "24px",
                    boxShadow: "0 4px 12px rgba(0, 74, 198, 0.2)"
                }} onMouseEnter={e => !loading && (e.currentTarget.style.transform = "scale(1.02)")} onMouseLeave={e => !loading && (e.currentTarget.style.transform = "scale(1)")}>
                    {loading ? "Processing..." : (isLogin ? "Sign In" : "Register")}
                </button>
            </form>

            <div style={{ textAlign: "center", fontSize: "12px", color: "#6b7280" }}>
                By creating this account, you agree to our <a href="/privacy-policy" style={{ color: "#374151", textDecoration: "none", fontWeight: 600 }}>Privacy Policy</a> & <a href="/terms-of-service" style={{ color: "#374151", textDecoration: "none", fontWeight: 600 }}>Terms of Service</a>.
            </div>
        </div>
    );
}
