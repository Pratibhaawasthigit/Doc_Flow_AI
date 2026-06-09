import HomeLogin from "../components/HomeLogin";

export default function Login() {
    return (
        <div style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "#f8fafc",
            padding: "20px"
        }}>
            <div style={{ width: "100%", maxWidth: "440px" }}>
                <div style={{ textAlign: "center", marginBottom: "32px" }}>
                    <h2 style={{
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontSize: "28px",
                        fontWeight: 800,
                        color: "#004ac6",
                        letterSpacing: "-.03em",
                        margin: 0
                    }}>
                        DocFlow AI
                    </h2>
                </div>
                <HomeLogin />
            </div>
        </div>
    );
}
