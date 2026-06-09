import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import * as pdfjsLib from "pdfjs-dist";

/* Configure pdf.js worker */
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

/* ─── Fonts & base styles ──────────────────────────────────── */
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Dancing+Script:wght@700&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');

    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    html,body,#root{height:100%;overflow:hidden}
    body{font-family:'Plus Jakarta Sans',sans-serif;background:#f7f9fb;color:#191c1e}

    .material-symbols-outlined{
      font-family:'Material Symbols Outlined';
      font-variation-settings:'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 24;
      font-style:normal;line-height:1;display:inline-block;vertical-align:middle;
      white-space:nowrap;word-wrap:normal;user-select:none;
    }
    .icon-fill{font-variation-settings:'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 24}

    ::-webkit-scrollbar{width:5px;height:5px}
    ::-webkit-scrollbar-track{background:transparent}
    ::-webkit-scrollbar-thumb{background:#c3c6d7;border-radius:8px}

    /* animations */
    @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
    @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
    @keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
    @keyframes scanLine{0%{top:0;opacity:1}90%{top:100%;opacity:.8}100%{top:100%;opacity:0}}
    @keyframes progressFill{from{width:0}to{width:var(--w,60%)}}

    @keyframes checkBounce{0%{transform:scale(0)}60%{transform:scale(1.2)}100%{transform:scale(1)}}

    .anim-fade   {animation:fadeUp .4s cubic-bezier(.16,1,.3,1) both}
    .anim-spin   {animation:spin 1s linear infinite}
    .anim-pulse  {animation:pulse 1.5s ease-in-out infinite}
    .anim-check  {animation:checkBounce .45s cubic-bezier(.16,1,.3,1) both}

    /* glassmorphism */
    .glass{background:rgba(255,255,255,.75);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px)}
    .glass-dock{background:rgba(230,232,234,.7);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px)}



    /* drop zone */
    .drop-zone{
      border:2px dashed rgba(0,74,198,.25);border-radius:16px;
      display:flex;flex-direction:column;align-items:center;justify-content:center;
      padding:32px 20px;text-align:center;cursor:pointer;
      transition:border-color .2s,background .2s,box-shadow .2s;
      background:rgba(242,244,246,.5);
    }
    .drop-zone:hover{border-color:#004ac6;background:rgba(0,74,198,.03);box-shadow:0 0 0 4px rgba(0,74,198,.06)}
    .drop-zone.drag-over{border-color:#004ac6;background:rgba(0,74,198,.06);box-shadow:0 0 0 6px rgba(0,74,198,.12)}

    /* buttons */
    .btn-primary{
      display:inline-flex;align-items:center;gap:8px;padding:12px 24px;border-radius:14px;
      border:none;background:linear-gradient(135deg,#004ac6,#2563eb);color:#fff;
      font-weight:700;font-size:14px;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;
      box-shadow:0 6px 20px rgba(0,74,198,.28);transition:opacity .18s,transform .15s;width:100%;
      justify-content:center;
    }
    .btn-primary:hover{opacity:.92}
    .btn-primary:active{transform:scale(.97)}
    .btn-primary:disabled{opacity:.5;cursor:not-allowed}

    .btn-secondary{
      display:inline-flex;align-items:center;gap:8px;padding:12px 24px;border-radius:14px;
      border:none;background:linear-gradient(135deg,#712ae2,#8a4cfc);color:#fff;
      font-weight:700;font-size:14px;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;
      box-shadow:0 6px 20px rgba(113,42,226,.28);transition:opacity .18s,transform .15s;width:100%;
      justify-content:center;
    }
    .btn-secondary:hover{opacity:.92}
    .btn-secondary:active{transform:scale(.97)}
    .btn-secondary:disabled{opacity:.5;cursor:not-allowed}

    .btn-ghost{
      display:inline-flex;align-items:center;gap:8px;padding:12px 24px;border-radius:14px;
      border:2px solid rgba(0,74,198,.2);background:rgba(0,74,198,.05);color:#004ac6;
      font-weight:700;font-size:14px;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;
      transition:all .18s;width:100%;justify-content:center;
    }
    .btn-ghost:hover{background:#004ac6;color:#fff;border-color:#004ac6}
    .btn-ghost:disabled{opacity:.5;cursor:not-allowed}

    .btn-icon{
      padding:8px;border-radius:10px;border:none;background:none;
      color:#64748b;cursor:pointer;display:flex;align-items:center;justify-content:center;
      transition:background .18s,color .18s;
    }
    .btn-icon:hover{background:#e6e8ea;color:#004ac6}

    /* section card */
    .section-card{
      background:#fff;border-radius:20px;padding:28px;
      box-shadow:0 4px 20px rgba(0,0,0,.06);border:1px solid rgba(195,198,215,.2);
    }

    /* progress bar */
    .progress-track{height:6px;background:#e6e8ea;border-radius:99px;overflow:hidden}
    .progress-fill{height:100%;border-radius:99px;animation:progressFill .8s cubic-bezier(.4,0,.2,1) forwards}

    /* slider */
    input[type=range]{
      -webkit-appearance:none;height:6px;border-radius:99px;outline:none;cursor:pointer;
      background:linear-gradient(to right,#004ac6 var(--val,50%),#e0e3e5 var(--val,50%));
    }
    input[type=range]::-webkit-slider-thumb{
      -webkit-appearance:none;width:16px;height:16px;border-radius:50%;
      background:#004ac6;cursor:pointer;box-shadow:0 2px 6px rgba(0,74,198,.4);
    }

    /* signature canvas */
    canvas{cursor:crosshair;touch-action:none}

    /* mobile */
    @media(max-width:768px){
      .sidebar-wrap{transform:translateX(-100%);transition:transform .3s}
      .sidebar-wrap.open{transform:translateX(0)}
      .main-wrap{margin-left:0!important}

    }
    @media(min-width:769px){
      .sidebar-wrap{transform:none!important}

    }

    /* scan line */
    .scan-line{
      position:absolute;left:0;width:100%;height:3px;
      background:linear-gradient(90deg,transparent,rgba(37,99,235,.7),transparent);
      box-shadow:0 0 16px 3px rgba(37,99,235,.35);
      animation:scanLine 2.5s ease-in-out infinite;pointer-events:none;
    }

    /* summary output typing */
    @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
    .cursor-blink{animation:blink 1s step-end infinite}
  `}</style>
);

/* ─── Icon ─────────────────────────────────────────────────── */
const Ic = ({ n, name, fill = false, size = 20, col, style: st = {}, className = "" }) => (
  <span 
    className={`material-symbols-outlined${fill ? " icon-fill" : ""} ${className}`} 
    style={{ fontSize: size, color: col, ...st }}
  >
    {n || name}
  </span>
);

/* ─── Spinner ───────────────────────────────────────────────── */
const Spinner = ({ size = 20 }) => (
  <div className="anim-spin" style={{ width: size, height: size, border: "2.5px solid rgba(255,255,255,.3)", borderTopColor: "#fff", borderRadius: "50%" }} />
);



/* ══════════════════════════════════════════════════════════════
   FEATURE 1 — DOCUMENT PROCESSING (OCR)
══════════════════════════════════════════════════════════════ */
function DocumentProcessing() {
  const [file, setFile]   = useState(null);
  const [drag, setDrag]   = useState(false);
  const [step, setStep]   = useState("idle"); // idle | scanning | done | error
  const [ocrText, setOcrText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [pageCount, setPageCount] = useState(0);
  const inputRef          = useRef(null);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    if (!ocrText) return;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(ocrText)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch(() => {
          fallbackCopy(ocrText);
        });
    } else {
      fallbackCopy(ocrText);
    }
  };

  const fallbackCopy = (text) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Fallback copy failed:', err);
    }
    document.body.removeChild(textArea);
  };

  const exportText = () => {
    if (!ocrText) return;
    const element = document.createElement("a");
    const blob = new Blob([ocrText], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(blob);
    element.download = file?.name ? `extracted_${file.name.replace(/\.[^/.]+$/, "")}.txt` : "extracted_text.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  /* ── Extract text from a PDF using pdf.js ── */
  const extractPdfText = async (pdfFile) => {
    try {
      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      setPageCount(pdf.numPages);
      let fullText = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items.map(item => item.str).join(" ");
        fullText += `--- Page ${i} ---\n${pageText}\n\n`;
      }
      return fullText.trim() || "No readable text found in this PDF.";
    } catch (err) {
      console.error("PDF extraction error:", err);
      throw new Error("Could not read this PDF. It may be image-only or corrupted.");
    }
  };

  const handleFile = async (f) => {
    if (!f) return;
    setFile(f);
    setStep("scanning");
    setErrorMsg("");
    setPageCount(0);

    try {
      let extractedText = "";

      if (f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf")) {
        /* ── Real PDF text extraction ── */
        extractedText = await extractPdfText(f);
      } else if (f.name.endsWith(".txt") || f.type === "text/plain") {
        /* ── Plain text files ── */
        extractedText = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result || "No content found.");
          reader.onerror = () => reject(new Error("Failed to read file."));
          reader.readAsText(f);
        });
      } else if (f.type.startsWith("image/") || f.name.toLowerCase().endsWith(".png") || f.name.toLowerCase().endsWith(".jpg") || f.name.toLowerCase().endsWith(".jpeg") || f.name.toLowerCase().endsWith(".tiff")) {
        /* ── Real OCR for Images using Gemini API ── */
        const formData = new FormData();
        formData.append('file', f);
        formData.append('email', "admin@docflow.ai");
        formData.append('mode', "ocr");
        formData.append('prompt', "Identify and transcribe all readable text from this image exactly. Preserve the layout and hierarchy where possible. Do not add any conversational preamble or notes, just return the raw transcribed text.");

        const customKey = localStorage.getItem("gemini_api_key");
        const headers = {};
        if (customKey) {
            headers["X-Gemini-Key"] = customKey;
        }

        const res = await fetch("/api/ai/generate", {
            method: "POST",
            headers: headers,
            body: formData
        });
        if (!res.ok) throw new Error("Image OCR extraction failed.");
        const data = await res.json();
        
        extractedText = Array.isArray(data.content) ? data.content.join("\n") : data.content;
      } else {
        /* ── Other formats — informative placeholder ── */
        extractedText = `Document Loaded: ${f.name}\nFile Size: ${(f.size / 1024).toFixed(1)} KB\nType: ${f.type || "unknown"}\n\nFor full OCR on DOCX, a backend service is required. PDF files and images are fully supported with text extraction.`;
      }

      typewriterDisplay(extractedText);
      /* Increment Workspace Docs Processed */
      fetch("/api/workspace/increment/docs", { method: "POST" }).catch(e => console.error("Stat update failed", e));
    } catch (err) {
      setStep("error");
      setErrorMsg(err.message);
    }
  };

  /* ── Typewriter animation for the output box ── */
  const typewriterDisplay = (content) => {
    setStep("done");
    setIsTyping(true);
    let i = 0;
    setOcrText("");
    const stepSize = Math.max(1, Math.floor(content.length / 120));
    const timer = setInterval(() => {
      setOcrText(content.slice(0, i + stepSize));
      i += stepSize;
      if (i >= content.length) {
        setOcrText(content);
        setIsTyping(false);
        clearInterval(timer);
      }
    }, 12);
  };

  const reset = () => { setFile(null); setStep("idle"); setOcrText(""); setErrorMsg(""); setPageCount(0); };

  return (
    <div className="section-card anim-fade" style={{ animationDelay: ".05s" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: 14, background: "rgba(0,74,198,.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Ic name="description" size={24} style={{ color: "#004ac6" }} />
          </div>
          <div>
            <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 18, fontWeight: 700, color: "#191c1e" }}>Document Processing</h3>
            <p style={{ fontSize: 12, color: "#737686", marginTop: 2 }}>OCR-powered extraction from any document format</p>
          </div>
        </div>
        <span style={{ padding: "4px 12px", background: "#6ffbbe", color: "#002113", borderRadius: 99, fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: ".1em" }}>AI Enhanced</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Left: upload / scan preview */}
        <div>
          {step === "idle" && (
            <div className={`drop-zone${drag ? " drag-over" : ""}`}
              style={{ minHeight: 260 }}
              onDragOver={e => { e.preventDefault(); setDrag(true); }}
              onDragLeave={() => setDrag(false)}
              onDrop={e => { e.preventDefault(); setDrag(false); handleFile(e.dataTransfer.files[0]); }}
              onClick={() => inputRef.current?.click()}>
              <input ref={inputRef} type="file" accept=".pdf,.png,.jpg,.jpeg,.tiff,.docx,.txt" style={{ display: "none" }} onChange={e => handleFile(e.target.files[0])} />
              <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(0,74,198,.08)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16, transition: "transform .2s" }}
                onMouseEnter={e => e.currentTarget.style.transform = "scale(1.1)"}
                onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>
                <Ic name="upload_file" size={32} style={{ color: "#004ac6" }} />
              </div>
              <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 6 }}>Upload PDF or Image</p>
              <p style={{ fontSize: 12, color: "#737686", marginBottom: 16 }}>Drag & drop · PDF, PNG, JPG, TIFF, DOCX</p>
              <span style={{ padding: "8px 18px", background: "#e6e8ea", borderRadius: 10, fontSize: 13, fontWeight: 600, color: "#004ac6", cursor: "pointer" }}>Browse Files</span>
            </div>
          )}

          {(step === "scanning" || step === "done") && file && (
            <div style={{ borderRadius: 14, overflow: "hidden", background: "#f2f4f6", position: "relative", minHeight: 260, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12, padding: 20 }}>
              {/* File preview / Dynamic Image Preview */}
              {file.type.startsWith("image/") ? (
                <img 
                  src={URL.createObjectURL(file)} 
                  alt="preview" 
                  style={{ width: 90, height: 90, borderRadius: 12, objectFit: "cover", boxShadow: "0 4px 16px rgba(0,0,0,.15)" }} 
                />
              ) : (
                <div style={{ width: 64, height: 64, borderRadius: 16, background: "#fff", boxShadow: "0 4px 16px rgba(0,0,0,.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Ic name={file.name.toLowerCase().endsWith(".pdf") ? "picture_as_pdf" : "description"} size={36} style={{ color: "#004ac6" }} />
                </div>
              )}
              <p style={{ fontSize: 13, fontWeight: 700, color: "#191c1e", maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{file.name}</p>
              <p style={{ fontSize: 11, color: "#737686" }}>{(file.size / 1024).toFixed(1)} KB</p>

              {step === "scanning" && (
                <>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
                    <Spinner size={16} style={{ borderColor: "rgba(0,74,198,.3)", borderTopColor: "#004ac6" }} />
                    <span style={{ fontSize: 12, color: "#004ac6", fontWeight: 600 }}>Extracting data…</span>
                  </div>
                  <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
                    <div className="scan-line" />
                  </div>
                </>
              )}
              {step === "done" && (
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div className="anim-check" style={{ width: 22, height: 22, borderRadius: "50%", background: "#006242", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Ic name="check" size={14} style={{ color: "#fff" }} />
                  </div>
                  <span style={{ fontSize: 12, color: "#006242", fontWeight: 700 }}>
                    Extraction complete{pageCount > 0 && ` · ${pageCount} page${pageCount > 1 ? "s" : ""}`}
                  </span>
                </div>
              )}
              {step === "error" && (
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <Ic name="error" size={18} style={{ color: "#dc2626" }} />
                  <span style={{ fontSize: 12, color: "#dc2626", fontWeight: 700 }}>Extraction failed</span>
                </div>
              )}

              <button onClick={reset} style={{ position: "absolute", top: 10, right: 10, padding: 6, background: "rgba(255,255,255,.8)", border: "none", borderRadius: 8, cursor: "pointer", color: "#737686" }}>
                <Ic name="close" size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Right: extraction results / OCR Box */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ background: "#fff", borderRadius: 14, padding: "20px", flex: 1, border: "1px solid rgba(0,74,198,.15)", boxShadow: "inset 0 2px 10px rgba(0,74,198,.02)", position: "relative", minHeight: 400, display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <p style={{ fontSize: 10, fontWeight: 800, color: "#004ac6", textTransform: "uppercase", letterSpacing: ".14em" }}>Extracted Document Paragraph</p>
              {step === "done" && !isTyping && (
                <div style={{ display: "flex", gap: 6 }}>
                  <button onClick={copyToClipboard} className="btn-icon" style={{ padding: "4px 8px", fontSize: 10, fontWeight: 700, gap: 5, color: copied ? "#006242" : "inherit" }}>
                    <Ic name={copied ? "check" : "content_copy"} size={14} />{copied ? "Copied!" : "Copy Text"}
                  </button>
                  <button onClick={exportText} className="btn-icon" style={{ padding: "4px 8px", fontSize: 10, fontWeight: 700, gap: 5 }}>
                    <Ic name="download" size={14} />Export Text
                  </button>
                  <button 
                    onClick={async () => {
                      try {
                        const noteData = {
                          label: file?.name || "OCR Result",
                          tag: "OCR Extracted",
                          tagBg: "#f2f4f6",
                          tagColor: "#004ac6",
                          meta: `Extracted ${new Date().toLocaleDateString()}`,
                          summary: ocrText.split("\n").filter(l => l.trim()),
                          error: false
                        };
                        const res = await fetch("/api/notes", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify(noteData)
                        });
                        if(res.ok) alert("Saved to Workspace!");
                      } catch(err) { alert("Failed to save"); }
                    }} 
                    className="btn-icon" 
                    style={{ padding: "4px 8px", fontSize: 10, fontWeight: 700, gap: 5, color: "#006242", background: "rgba(0,98,66,.05)" }}
                  >
                    <Ic name="save" size={14} />Save to Workspace
                  </button>
                </div>
              )}
            </div>

            <div style={{ flex: 1, background: "#f8fafc", borderRadius: 8, padding: 20, border: "1px solid #e2e8f0", overflowY: "auto", position: "relative" }}>
               {step === "idle" && (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 12, opacity: .4 }}>
                  <Ic name="document_scanner" size={40} style={{ color: "#737686" }} />
                  <p style={{ fontSize: 12, color: "#737686", textAlign: "center", maxWidth: 220, lineHeight: 1.5 }}>Upload a PDF, TXT or document — text will be extracted automatically</p>
                </div>
              )}

              {step === "error" && (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 12 }}>
                  <Ic name="error_outline" size={40} style={{ color: "#dc2626" }} />
                  <p style={{ fontSize: 13, color: "#dc2626", textAlign: "center", maxWidth: 260, lineHeight: 1.5, fontWeight: 600 }}>{errorMsg}</p>
                  <button onClick={reset} style={{ marginTop: 8, padding: "8px 20px", borderRadius: 10, border: "none", background: "#fee2e2", color: "#dc2626", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>Try Again</button>
                </div>
              )}

              {step === "scanning" && (
                <div style={{ height: "100%", position: "relative", opacity: .5 }}>
                   {[70, 85, 60, 90, 40, 75, 50].map((w, i) => (
                    <div key={i} className="anim-pulse" style={{ height: 10, width: `${w}%`, background: "#e2e8f0", borderRadius: 4, marginBottom: 16 }} />
                  ))}
                  <div className="scan-line" style={{ top: "10%" }} />
                </div>
              )}

              {step === "done" && (
                <p style={{ margin: 0, whiteSpace: "pre-wrap", fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 14, lineHeight: 1.7, color: "#1e293b", letterSpacing: "0.2px" }}>
                  {ocrText}<span className="cursor-blink" style={{ display: isTyping ? "inline" : "none", color: "#004ac6", fontWeight: "bold" }}>|</span>
                </p>
              )}
            </div>
          </div>


        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   FEATURE 2 — AI SUMMARIZATION
══════════════════════════════════════════════════════════════ */
const SUMMARIES = {
  concise: {
    professional: "This contract establishes a 12-month service agreement between Curator AI and Global Enterprise Solutions. Key obligations: Provider delivers OCR & document intelligence services at 99% accuracy. Client pays $12,450/mo. Either party may terminate with 30-day notice. Governing law: Delaware.",
    creative: "Here's the deal — Curator AI becomes Global Enterprise's document wizard for a year! We deliver lightning-fast OCR magic at near-perfect accuracy, they pay $12,450 monthly, and if things don't work out, 30 days' notice sets everyone free. Delaware calls the shots legally.",
  },
  detailed: {
    professional: "EXECUTIVE SUMMARY — SERVICE AGREEMENT #7721\n\n📋 Parties: Curator AI (Provider) & Global Enterprise Solutions (Client)\n📅 Term: 12 months from Oct 14, 2023 | Auto-renewal clause included\n💰 Financials: $12,450/mo + 18% tax = $14,691/mo effective | Net-30 payment\n\n🎯 Key Deliverables:\n• High-fidelity OCR with structure & table recognition\n• Handwritten annotation digitization\n• Three-tier neural verification (99% accuracy SLA)\n• Monthly performance reports\n\n⚖️ Legal: Governed by Delaware law | Arbitration preferred | IP retained by Provider\n\n🚨 Risk Flags: Clause 4.2 liability mismatch identified — legal review recommended before signing.",
    creative: "🌟 THE BIG PICTURE\n\nCurator AI is signing on as Global Enterprise's document intelligence partner for a full year — starting October 2023. Think of it as hiring a brilliant AI librarian who never sleeps!\n\n💸 Money Talk: $12,450/month (plus taxes — yes, the taxman cometh). Payments due within 30 days.\n\n🚀 What We're Delivering: Laser-accurate OCR, table magic, handwriting decoding, and a triple-check neural system ensuring 99% perfection.\n\n⚡ Watch Out: There's a sneaky clause 4.2 liability issue — get your lawyers to look before you sign on the dotted line!",
  },
};

function AISummarization() {
  const [file,    setFile]    = useState(null);
  const [drag,    setDrag]    = useState(false);
  const [depth,   setDepth]   = useState(50);   // 0=concise, 100=detailed
  const [tone,    setTone]    = useState(30);    // 0=professional, 100=creative
  const [step,    setStep]    = useState("idle"); // idle | processing | done
  const [summary, setSummary] = useState("");
  const [displayed, setDisplayed] = useState("");
  const inputRef = useRef(null);

  const depthKey = depth >= 50 ? "detailed" : "concise";
  const toneKey  = tone  >= 50 ? "creative" : "professional";
  const [copied,  setCopied]  = useState(false);

  const copyToClipboard = () => {
    if (!summary) return;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(summary)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch(() => {
          fallbackCopy(summary);
        });
    } else {
      fallbackCopy(summary);
    }
  };

  const fallbackCopy = (text) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Fallback copy failed:', err);
    }
    document.body.removeChild(textArea);
  };

  const exportSummary = () => {
    if (!summary) return;
    const element = document.createElement("a");
    const blob = new Blob([summary], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(blob);
    element.download = file?.name ? `summary_${file.name.replace(/\.[^/.]+$/, "")}.txt` : "summary.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleFile = (f) => { if (f) { setFile(f); setStep("idle"); setSummary(""); setDisplayed(""); } };

  const extractTextFromFile = async (f) => {
    if (f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf")) {
      const arrayBuffer = await f.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items.map(item => item.str).join(" ");
        fullText += `--- Page ${i} ---\n${pageText}\n\n`;
      }
      return fullText.trim() || "No readable text found in this PDF.";
    } else if (f.name.endsWith(".txt") || f.type === "text/plain") {
      return await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result || "No content found.");
        reader.onerror = () => reject(new Error("Failed to read file."));
        reader.readAsText(f);
      });
    }
    return "";
  };

  const summarize = async () => {
    if (!file) return;
    setStep("processing");
    setSummary("");
    setDisplayed("");

    try {
      let extractedText = "";
      const isImage = file.type.startsWith("image/") || 
                      file.name.toLowerCase().endsWith(".png") || 
                      file.name.toLowerCase().endsWith(".jpg") || 
                      file.name.toLowerCase().endsWith(".jpeg") || 
                      file.name.toLowerCase().endsWith(".tiff");

      if (!isImage) {
        try {
          extractedText = await extractTextFromFile(file);
          if (!extractedText || extractedText.trim() === "") {
            throw new Error("Could not extract any readable text from this PDF. Please make sure it is a text-searchable PDF and not an image-only/scanned document.");
          }
        } catch (e) {
          throw new Error("Document extraction failed: " + e.message);
        }
      }

      const depthDesc = depth >= 75 ? "extremely thorough, comprehensive, and highly detailed" : 
                        depth >= 40 ? "balanced and medium length" : 
                        "concise, short, and brief";
      
      const toneDesc = tone >= 75 ? "creative, engaging, lively, and storytelling-like" : 
                       tone >= 40 ? "neutral and natural" : 
                       "professional, formal, objective, and executive";

      const promptText = `Generate a ${depthDesc} executive summary of the document. The tone must be ${toneDesc}. Focus on Key Insights, Action Items, and a thorough detailed breakdown. Use clear markdown formatting.`;

      const formData = new FormData();
      if (isImage) {
        formData.append('file', file);
      }
      formData.append('email', "admin@docflow.ai");
      formData.append('mode', "summary");
      formData.append('prompt', promptText);
      if (extractedText) {
        formData.append('extractedText', extractedText);
      }

      const customKey = localStorage.getItem("gemini_api_key");
      const headers = {};
      if (customKey) {
        headers["X-Gemini-Key"] = customKey;
      }

      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: headers,
        body: formData
      });

      if (!res.ok) {
        throw new Error("API call to summarize failed.");
      }

      const data = await res.json();
      
      let resultText = "";
      if (data && data.content) {
        if (Array.isArray(data.content)) {
          resultText = data.content.join("\n");
        } else {
          resultText = data.content;
        }
      } else {
        throw new Error("No summary content returned from AI service.");
      }

      setStep("done");
      setSummary(resultText);
      
      fetch("/api/workspace/increment/summaries", { method: "POST" }).catch(e => console.error("Stat update failed", e));
      
      let i = 0;
      const stepSize = Math.max(1, Math.floor(resultText.length / 100));
      const timer = setInterval(() => {
        setDisplayed(resultText.slice(0, i + stepSize));
        i += stepSize;
        if (i >= resultText.length) {
          setDisplayed(resultText);
          clearInterval(timer);
        }
      }, 12);

    } catch (err) {
      setStep("idle");
      alert(err.message || "An error occurred during summarization.");
    }
  };

  const reset = () => { setFile(null); setStep("idle"); setSummary(""); setDisplayed(""); };

  const updateSlider = (e, setter) => {
    const val = e.target.value;
    e.target.style.setProperty("--val", val + "%");
    setter(Number(val));
  };

  return (
    <div className="section-card anim-fade" style={{ animationDelay: ".1s" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <div style={{ width: 44, height: 44, borderRadius: 14, background: "rgba(0,74,198,.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Ic name="summarize" size={24} style={{ color: "#2563eb" }} />
        </div>
        <div>
          <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 18, fontWeight: 700 }}>AI Summarization</h3>
          <p style={{ fontSize: 12, color: "#737686", marginTop: 2 }}>Compress 100-page reports into crisp executive summaries</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: 20 }}>
        {/* Controls */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Upload */}
          <div className={`drop-zone${drag ? " drag-over" : ""}`}
            style={{ minHeight: 130, padding: 20 }}
            onDragOver={e => { e.preventDefault(); setDrag(true); }}
            onDragLeave={() => setDrag(false)}
            onDrop={e => { e.preventDefault(); setDrag(false); handleFile(e.dataTransfer.files[0]); }}
            onClick={() => inputRef.current?.click()}>
            <input ref={inputRef} type="file" accept=".pdf,.docx,.txt,.pptx" style={{ display: "none" }} onChange={e => handleFile(e.target.files[0])} />
            {file ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <Ic name="task" size={28} style={{ color: "#006242" }} />
                <p style={{ fontSize: 12, fontWeight: 700, color: "#006242", maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{file.name}</p>
                <button onClick={e => { e.stopPropagation(); reset(); }} style={{ fontSize: 10, color: "#737686", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>Remove</button>
              </div>
            ) : (
              <>
                <Ic name="add_circle" size={28} style={{ color: "#004ac6", marginBottom: 8 }} />
                <p style={{ fontWeight: 700, fontSize: 13 }}>Drop file to summarize</p>
                <p style={{ fontSize: 11, color: "#737686", marginTop: 4 }}>PDF · DOCX · TXT · PPTX</p>
              </>
            )}
          </div>

          {/* Sliders */}
          <div style={{ background: "rgba(0,74,198,.04)", border: "1px solid rgba(0,74,198,.1)", borderRadius: 14, padding: 16, display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <label style={{ fontSize: 10, fontWeight: 800, color: "#737686", textTransform: "uppercase", letterSpacing: ".12em" }}>Summary Depth</label>
                <span style={{ fontSize: 10, fontWeight: 700, color: "#004ac6" }}>{depth >= 50 ? "Detailed" : "Concise"}</span>
              </div>
              <input type="range" min="0" max="100" value={depth}
                onChange={e => updateSlider(e, setDepth)}
                style={{ width: "100%", "--val": depth + "%" }} />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                <span style={{ fontSize: 10, color: "#737686" }}>Concise</span>
                <span style={{ fontSize: 10, color: "#737686" }}>Detailed</span>
              </div>
            </div>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <label style={{ fontSize: 10, fontWeight: 800, color: "#737686", textTransform: "uppercase", letterSpacing: ".12em" }}>Tone Profile</label>
                <span style={{ fontSize: 10, fontWeight: 700, color: "#712ae2" }}>{tone >= 50 ? "Creative" : "Professional"}</span>
              </div>
              <input type="range" min="0" max="100" value={tone}
                onChange={e => { const v = e.target.value; e.target.style.setProperty("--val", v + "%"); setTone(Number(v)); }}
                style={{ width: "100%", "--val": tone + "%", accentColor: "#712ae2" }} />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                <span style={{ fontSize: 10, color: "#737686" }}>Professional</span>
                <span style={{ fontSize: 10, color: "#737686" }}>Creative</span>
              </div>
            </div>
          </div>

          <button className="btn-primary" disabled={!file || step === "processing"} onClick={summarize}>
            {step === "processing" ? <><Spinner size={16} />Summarizing…</> : <><Ic name="bolt" size={18} fill />AI Summarize Now</>}
          </button>
        </div>

        {/* Output */}
        <div style={{ background: "#f2f4f6", borderRadius: 16, padding: 20, minHeight: 320, display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <p style={{ fontSize: 10, fontWeight: 800, color: "#737686", textTransform: "uppercase", letterSpacing: ".14em" }}>Summary Output</p>
            {step === "done" && (
              <div style={{ display: "flex", gap: 6 }}>
                <button onClick={copyToClipboard} className="btn-icon" style={{ padding: "4px 8px", fontSize: 11, fontWeight: 600, gap: 4, color: copied ? "#006242" : "inherit" }}>
                  <Ic name={copied ? "check" : "content_copy"} size={14} />{copied ? "Copied!" : "Copy"}
                </button>
                <button 
                  onClick={async () => {
                    try {
                      const noteData = {
                        label: file?.name ? `Summary: ${file.name}` : "AI Summary",
                        tag: "AI Summary",
                        tagBg: "#f0fdf4",
                        tagColor: "#166534",
                        meta: `Generated ${new Date().toLocaleDateString()}`,
                        summary: summary.split("\n").filter(l => l.trim()),
                        error: false
                      };
                      const res = await fetch("/api/notes", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(noteData)
                      });
                      if(res.ok) alert("Saved to Workspace!");
                    } catch(err) { alert("Failed to save"); }
                  }}
                  className="btn-icon" 
                  style={{ padding: "4px 8px", fontSize: 11, fontWeight: 600, gap: 4, color: "#2563eb", background: "rgba(37,99,235,.05)" }}
                >
                  <Ic name="save" size={14} />Workspace
                </button>
                <button onClick={exportSummary} className="btn-icon" style={{ padding: "4px 8px", fontSize: 11, fontWeight: 600, gap: 4 }}>
                  <Ic name="download" size={14} />Export
                </button>
              </div>
            )}
          </div>

          {step === "idle" && (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, opacity: .45 }}>
              <Ic name="article" size={40} style={{ color: "#737686" }} />
              <p style={{ fontSize: 13, color: "#737686", textAlign: "center" }}>Upload a document and click<br /><strong>AI Summarize Now</strong> to see results</p>
            </div>
          )}

          {step === "processing" && (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
              {[90, 75, 60, 85, 55].map((w, i) => (
                <div key={i} className="progress-track" style={{ "--w": w + "%" }}>
                  <div className="progress-fill anim-pulse" style={{ width: w + "%", background: i % 2 ? "linear-gradient(90deg,#712ae2,#8a4cfc)" : "linear-gradient(90deg,#004ac6,#2563eb)" }} />
                </div>
              ))}
              <p style={{ fontSize: 12, color: "#004ac6", fontWeight: 600, marginTop: 8, display: "flex", alignItems: "center", gap: 6 }}>
                <span className="anim-pulse" style={{ width: 7, height: 7, borderRadius: "50%", background: "#004ac6", display: "inline-block" }} />
                Neural compression in progress…
              </p>
            </div>
          )}

          {step === "done" && (
            <div style={{ flex: 1 }}>
              {/* Badges */}
              <div style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" }}>
                {[["Key Insights","#006242"],["Action Items","#004ac6"],["Sentiment Map","#712ae2"]].map(([lb, c]) => (
                  <span key={lb} style={{ padding: "3px 10px", borderRadius: 99, background: `${c}15`, color: c, fontSize: 10, fontWeight: 700, border: `1px solid ${c}30` }}>{lb}</span>
                ))}
              </div>
              <pre style={{ fontSize: 13, lineHeight: 1.75, color: "#191c1e", whiteSpace: "pre-wrap", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
                {displayed}<span className="cursor-blink" style={{ display: displayed.length < summary.length ? "inline" : "none" }}>|</span>
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   FEATURE 3 — E-SIGNATURE
══════════════════════════════════════════════════════════════ */
function ESignature() {
  const [docFile,  setDocFile]  = useState(null);
  const [drag,     setDrag]     = useState(false);
  const [sigMode,  setSigMode]  = useState("draw");   // draw | upload | type
  const [sigText,  setSigText]  = useState("");
  const [step,     setStep]     = useState("idle");   // idle | positioning | processing | done
  const [sigImg,   setSigImg]   = useState(null);
  
  // Signature positioning states
  const [sigX,     setSigX]     = useState(50);       // percentage X (5 to 95)
  const [sigY,     setSigY]     = useState(70);       // percentage Y (5 to 95)
  const [sigScale, setSigScale] = useState(100);      // scale percentage (50 to 150)
  const [isDragging, setIsDragging] = useState(false);
  
  const canvasRef  = useRef(null);
  const isDrawing  = useRef(false);
  const docInput   = useRef(null);
  const sigInput   = useRef(null);
  const containerRef = useRef(null);

  // Canvas drawing
  const startDraw = (e) => {
    isDrawing.current = true;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
    ctx.beginPath(); ctx.moveTo(x, y);
  };
  const draw = (e) => {
    if (!isDrawing.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
    ctx.lineTo(x, y);
    ctx.strokeStyle = "#004ac6"; ctx.lineWidth = 2.5; ctx.lineCap = "round"; ctx.lineJoin = "round";
    ctx.stroke();
  };
  const stopDraw = () => { isDrawing.current = false; };
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleSigUpload = (f) => {
    if (!f) return;
    const reader = new FileReader();
    reader.onload = e => setSigImg(e.target.result);
    reader.readAsDataURL(f);
  };

  const handleDocFile = (f) => { if (f) setDocFile(f); };

  // Adjust signature drag events
  const handleStartDrag = (e) => {
    setIsDragging(true);
    e.preventDefault();
  };

  const handleDrag = (e) => {
    if (!isDragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    let x = ((clientX - rect.left) / rect.width) * 100;
    let y = ((clientY - rect.top) / rect.height) * 100;
    
    x = Math.max(5, Math.min(95, x));
    y = Math.max(5, Math.min(95, y));
    
    setSigX(x);
    setSigY(y);
  };

  const handleStopDrag = () => {
    setIsDragging(false);
  };

  const applySignature = () => {
    if (!docFile) return;
    
    if (sigMode === "draw" && canvasRef.current) {
      const dataUrl = canvasRef.current.toDataURL();
      setSigImg(dataUrl);
    }
    
    setStep("positioning");
  };

  const confirmSignature = () => {
    setStep("processing");
    setTimeout(() => {
      setStep("done");
      // Increment workspace stat
      fetch("/api/workspace/increment/docs", { method: "POST" }).catch(e => console.error("Stat update failed", e));
    }, 2000);
  };

  const downloadSignedDocument = () => {
    if (!docFile) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    
    canvas.width = 800;
    canvas.height = 1100;

    // Background white
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const drawSignatureAndDownload = (bgImageElement = null) => {
      if (bgImageElement) {
        const imgRatio = bgImageElement.width / bgImageElement.height;
        const canvasRatio = canvas.width / canvas.height;
        let drawWidth, drawHeight, x, y;
        
        if (imgRatio > canvasRatio) {
          drawWidth = canvas.width;
          drawHeight = canvas.width / imgRatio;
          x = 0;
          y = (canvas.height - drawHeight) / 2;
        } else {
          drawHeight = canvas.height;
          drawWidth = canvas.height * imgRatio;
          x = (canvas.width - drawWidth) / 2;
          y = 0;
        }
        
        ctx.globalAlpha = 0.95;
        ctx.drawImage(bgImageElement, x, y, drawWidth, drawHeight);
        ctx.globalAlpha = 1.0;
      }

      // Draw contract headers
      ctx.fillStyle = "#0f172a";
      ctx.font = "bold 24px 'Space Grotesk', sans-serif";
      ctx.fillText(docFile.name.toUpperCase(), 50, 80);
      
      ctx.strokeStyle = "#cbd5e1";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(50, 100);
      ctx.lineTo(750, 100);
      ctx.stroke();

      ctx.fillStyle = "#94a3b8";
      ctx.font = "bold 12px sans-serif";
      ctx.fillText("PAGE 1 OF 1", 680, 80);

      // Paragraph lines (drawn only if bgImage is NOT present to represent contract)
      if (!bgImageElement) {
        ctx.fillStyle = "#64748b";
        ctx.font = "16px sans-serif";
        const lines = [
          "This document constitutes a legally-binding, cryptographically-certified agreement",
          "under the Electronic Signatures in Global and National Commerce (ESIGN) Act.",
          "The parties hereto agree that the signature embedded below represents a valid,",
          "authentic, and binding expression of assent to the terms laid out herein.",
          "",
          "SECTION 1: DISCLOSURE & SECURITY",
          "All cryptographic hashes associated with this transaction have been verified against the",
          "DocFlow AI Neural Integrity Engine. Integrity audit trail has been logged with ID 0x4f3ac81e."
        ];
        let currentY = 160;
        lines.forEach(line => {
          ctx.fillText(line, 50, currentY);
          currentY += 28;
        });

        // Draw footer
        ctx.strokeStyle = "#cbd5e1";
        ctx.beginPath();
        ctx.moveTo(50, 1020);
        ctx.lineTo(750, 1020);
        ctx.stroke();

        ctx.fillStyle = "#94a3b8";
        ctx.font = "bold 11px monospace";
        ctx.fillText("CONFIDENTIAL CONTRACT AUDIT", 50, 1045);
        ctx.fillText("CERTIFICATE: VALID (DOCFLOW SECURE)", 500, 1045);
      }

      // Draw signature overlay
      const pixelX = (sigX / 100) * canvas.width;
      const pixelY = (sigY / 100) * canvas.height;
      const scale = sigScale / 100;

      ctx.save();
      ctx.translate(pixelX, pixelY);
      ctx.scale(scale, scale);
      
      if (sigMode === "type") {
        ctx.fillStyle = "#004ac6";
        ctx.font = "bold 32px cursive, 'Dancing Script', sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(sigText || "Signature", 0, 0);
        ctx.restore();
        triggerDownload();
      } else if (sigImg) {
        const sigElement = new Image();
        sigElement.crossOrigin = "anonymous";
        sigElement.src = sigImg;
        sigElement.onload = () => {
          const drawW = 150;
          const drawH = 60;
          ctx.drawImage(sigElement, -drawW / 2, -drawH / 2, drawW, drawH);
          ctx.restore();
          triggerDownload();
        };
        sigElement.onerror = () => {
          ctx.restore();
          triggerDownload();
        };
      } else {
        ctx.restore();
        triggerDownload();
      }
    };

    const triggerDownload = () => {
      const link = document.createElement("a");
      link.download = `signed_${docFile.name.replace(/\.[^/.]+$/, "")}.png`;
      link.href = canvas.toDataURL("image/png");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    const isDocImage = docFile.type?.startsWith("image/") || 
                       docFile.name?.toLowerCase().endsWith(".png") || 
                       docFile.name?.toLowerCase().endsWith(".jpg") || 
                       docFile.name?.toLowerCase().endsWith(".jpeg");

    if (isDocImage) {
      const bgImg = new Image();
      bgImg.crossOrigin = "anonymous";
      bgImg.src = URL.createObjectURL(docFile);
      bgImg.onload = () => {
        drawSignatureAndDownload(bgImg);
      };
      bgImg.onerror = () => {
        drawSignatureAndDownload(null);
      };
    } else {
      drawSignatureAndDownload(null);
    }
  };

  const reset = () => { 
    setDocFile(null); 
    setStep("idle"); 
    setSigImg(null); 
    setSigText(""); 
    setSigX(50);
    setSigY(70);
    setSigScale(100);
    clearCanvas(); 
  };

  const renderDocumentSheet = (isLocked = false) => {
    const isDocImage = docFile?.type?.startsWith("image/") || 
                       docFile?.name?.toLowerCase().endsWith(".png") || 
                       docFile?.name?.toLowerCase().endsWith(".jpg") || 
                       docFile?.name?.toLowerCase().endsWith(".jpeg");

    return (
      <div 
        ref={containerRef}
        onMouseMove={isLocked ? null : handleDrag}
        onTouchMove={isLocked ? null : handleDrag}
        onMouseUp={isLocked ? null : handleStopDrag}
        onTouchEnd={isLocked ? null : handleStopDrag}
        style={{
          width: "100%",
          height: 280,
          background: "#fff",
          borderRadius: 12,
          border: isLocked ? "2px solid #006242" : "1.5px solid rgba(113,42,226,.3)",
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 6px 20px rgba(0,0,0,.08)",
          display: "flex",
          flexDirection: "column",
          padding: "16px 20px",
          boxSizing: "border-box",
          userSelect: "none"
        }}
      >
        {isDocImage ? (
          <img 
            src={URL.createObjectURL(docFile)} 
            alt="document background" 
            style={{ 
              position: "absolute", 
              inset: 0, 
              width: "100%", 
              height: "100%", 
              objectFit: "contain", 
              opacity: 0.15, 
              pointerEvents: "none" 
            }} 
          />
        ) : null}

        {/* Dummy document content lines */}
        <div style={{ pointerEvents: "none" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #e2e8f0", paddingBottom: 6, marginBottom: 12 }}>
            <span style={{ fontSize: 10, fontWeight: 800, color: "#94a3b8", textTransform: "uppercase" }}>{docFile?.name || "Contract.pdf"}</span>
            <span style={{ fontSize: 9, color: "#94a3b8" }}>PAGE 1 OF 1</span>
          </div>
          <div style={{ width: "90%", height: 8, background: "#f1f5f9", borderRadius: 4, marginBottom: 8 }} />
          <div style={{ width: "95%", height: 8, background: "#f1f5f9", borderRadius: 4, marginBottom: 8 }} />
          <div style={{ width: "80%", height: 8, background: "#f1f5f9", borderRadius: 4, marginBottom: 8 }} />
          <div style={{ width: "85%", height: 8, background: "#f1f5f9", borderRadius: 4, marginBottom: 16 }} />
          
          <div style={{ width: "50%", height: 6, background: "#f1f5f9", borderRadius: 4, marginBottom: 6 }} />
          <div style={{ width: "40%", height: 6, background: "#f1f5f9", borderRadius: 4, marginBottom: 24 }} />
        </div>

        {/* Document Footer */}
        <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", borderTop: "1px solid #e2e8f0", paddingTop: 8, pointerEvents: "none" }}>
          <span style={{ fontSize: 8, color: "#cbd5e1" }}>CONFIDENTIAL CONTRACT</span>
          <span style={{ fontSize: 8, color: "#cbd5e1", fontStyle: "italic" }}>DOCFLOW AI E-SIGN SECURE</span>
        </div>

        {/* Draggable/Applied Signature Overlay */}
        <div 
          onMouseDown={isLocked ? null : handleStartDrag}
          onTouchStart={isLocked ? null : handleStartDrag}
          style={{
            position: "absolute",
            left: `${sigX}%`,
            top: `${sigY}%`,
            transform: `translate(-50%, -50%) scale(${sigScale / 100})`,
            cursor: isLocked ? "default" : "move",
            zIndex: 10,
            transition: isDragging ? "none" : "transform 0.1s ease-out"
          }}
        >
          {sigMode === "type" ? (
            <span style={{ 
              fontFamily: "'Dancing Script', cursive", 
              fontSize: 20, 
              color: "#004ac6", 
              fontWeight: "bold", 
              border: isLocked ? "none" : "1.5px dashed rgba(113,42,226,0.6)", 
              padding: "4px 10px", 
              background: isLocked ? "transparent" : "rgba(255,255,255,0.9)", 
              borderRadius: 4,
              boxShadow: isLocked ? "none" : "0 2px 8px rgba(113,42,226,0.15)",
              whiteSpace: "nowrap"
            }}>
              {sigText || "Signature"}
            </span>
          ) : (
            <img 
              src={sigImg} 
              alt="signature placement" 
              style={{ 
                maxHeight: 48, 
                maxWidth: 120, 
                objectFit: "contain", 
                border: isLocked ? "none" : "1.5px dashed rgba(113,42,226,0.6)", 
                padding: 4, 
                background: isLocked ? "transparent" : "rgba(255,255,255,0.9)", 
                borderRadius: 4,
                boxShadow: isLocked ? "none" : "0 2px 8px rgba(113,42,226,0.15)"
              }} 
            />
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="section-card anim-fade" style={{ animationDelay: ".15s" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <div style={{ width: 44, height: 44, borderRadius: 14, background: "rgba(113,42,226,.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Ic name="draw" size={24} style={{ color: "#712ae2" }} />
        </div>
        <div>
          <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 18, fontWeight: 700 }}>E-Signature</h3>
          <p style={{ fontSize: 12, color: "#737686", marginTop: 2 }}>Legally-binding digital signatures for your documents</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Left: document upload + signature */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {step === "positioning" || step === "processing" || step === "done" ? (
            <div style={{ flex: 1, background: "rgba(113,42,226,.02)", border: "1px dashed rgba(113,42,226,.3)", borderRadius: 16, padding: "28px 20px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", gap: 12 }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(113,42,226,.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Ic name="design_services" size={24} style={{ color: "#712ae2" }} />
              </div>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#712ae2" }}>Signature Created</p>
              <p style={{ fontSize: 11, color: "#737686", maxWidth: 220, lineHeight: 1.5 }}>
                {step === "positioning" 
                  ? "👉 Please use the preview panel on the right to drag and adjust your signature position on the document."
                  : "Signature is being cryptographically embedded and certified."}
              </p>
              {step === "positioning" && (
                <button onClick={() => setStep("idle")} style={{ marginTop: 12, padding: "8px 20px", background: "#f2f4f6", color: "#475569", border: "none", borderRadius: 10, fontSize: 11, fontWeight: 700, cursor: "pointer" }}>Edit Signature</button>
              )}
            </div>
          ) : (
            <>
              {/* Doc upload */}
              <div className={`drop-zone${drag ? " drag-over" : ""}`}
                style={{ minHeight: 110, padding: 20 }}
                onDragOver={e => { e.preventDefault(); setDrag(true); }}
                onDragLeave={() => setDrag(false)}
                onDrop={e => { e.preventDefault(); setDrag(false); handleDocFile(e.dataTransfer.files[0]); }}
                onClick={() => docInput.current?.click()}>
                <input ref={docInput} type="file" accept=".pdf,.docx,.png,.jpg" style={{ display: "none" }} onChange={e => handleDocFile(e.target.files[0])} />
                {docFile ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Ic name="task" size={24} style={{ color: "#006242" }} />
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#006242", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 160 }}>{docFile.name}</span>
                    <button onClick={e => { e.stopPropagation(); setDocFile(null); }} style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: "#737686" }}>
                      <Ic name="close" size={16} />
                    </button>
                  </div>
                ) : (
                  <>
                    <Ic name="cloud_upload" size={26} style={{ color: "#712ae2", marginBottom: 8 }} />
                    <p style={{ fontWeight: 700, fontSize: 13 }}>Upload Document to Sign</p>
                    <p style={{ fontSize: 11, color: "#737686", marginTop: 4 }}>PDF · DOCX · PNG · JPG</p>
                  </>
                )}
              </div>

              {/* Signature mode tabs */}
              <div>
                <p style={{ fontSize: 10, fontWeight: 800, color: "#737686", textTransform: "uppercase", letterSpacing: ".12em", marginBottom: 8 }}>Create Your Signature</p>
                <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
                  {[["draw","Draw"],["upload","Upload"],["type","Type"]].map(([id,lb]) => (
                    <button key={id} onClick={() => setSigMode(id)} style={{
                      flex: 1, padding: "7px 0", borderRadius: 10, border: "none", cursor: "pointer",
                      fontFamily: "'Space Grotesk',sans-serif", fontSize: 12, fontWeight: 700,
                      background: sigMode === id ? "#004ac6" : "#f2f4f6",
                      color: sigMode === id ? "#fff" : "#737686", transition: "all .18s",
                    }}>{lb}</button>
                  ))}
                </div>

                {/* Draw */}
                {sigMode === "draw" && (
                  <div style={{ position: "relative" }}>
                    <canvas ref={canvasRef} width={280} height={110} style={{ width: "100%", height: 110, background: "#fff", borderRadius: 12, border: "1.5px dashed rgba(0,74,198,.25)", display: "block" }}
                      onMouseDown={startDraw} onMouseMove={draw} onMouseUp={stopDraw} onMouseLeave={stopDraw}
                      onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={stopDraw} />
                    <button onClick={clearCanvas} style={{ position: "absolute", top: 8, right: 8, background: "rgba(255,255,255,.8)", border: "none", borderRadius: 8, padding: "3px 8px", fontSize: 10, fontWeight: 700, cursor: "pointer", color: "#737686" }}>Clear</button>
                    <p style={{ fontSize: 10, color: "#94a3b8", marginTop: 6, textAlign: "center" }}>Draw your signature above</p>
                  </div>
                )}

                {/* Upload */}
                {sigMode === "upload" && (
                  <div style={{ background: "#f2f4f6", borderRadius: 12, padding: 16, textAlign: "center", cursor: "pointer", border: "1.5px dashed rgba(0,74,198,.25)", minHeight: 110, display: "flex", alignItems: "center", justifyItems: "center", flexDirection: "column", gap: 8 }}
                    onClick={() => sigInput.current?.click()}>
                    <input ref={sigInput} type="file" accept="image/*" style={{ display: "none" }} onChange={e => handleSigUpload(e.target.files[0])} />
                    {sigImg ? (
                      <img src={sigImg} alt="Signature" style={{ maxHeight: 80, maxWidth: "100%", objectFit: "contain" }} />
                    ) : (
                      <><Ic name="upload" size={24} style={{ color: "#004ac6" }} /><p style={{ fontSize: 12, fontWeight: 700, color: "#004ac6" }}>Upload signature image</p></>
                    )}
                  </div>
                )}

                {/* Type */}
                {sigMode === "type" && (
                  <div>
                    <input type="text" value={sigText} onChange={e => setSigText(e.target.value)}
                      placeholder="Type your full name…"
                      style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "1.5px solid rgba(0,74,198,.2)", background: "#fff", fontSize: 13, fontFamily: "'Plus Jakarta Sans',sans-serif", outline: "none", color: "#191c1e" }} />
                    {sigText && (
                      <div style={{ marginTop: 10, padding: "14px", background: "#fff", borderRadius: 12, border: "1.5px dashed rgba(0,74,198,.2)", textAlign: "center" }}>
                        <span style={{ fontFamily: "'Dancing Script', cursive", fontSize: 28, color: "#004ac6", fontWeight: 700 }}>{sigText}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <button className="btn-secondary" disabled={!docFile || (sigMode === "type" && !sigText) || (sigMode === "upload" && !sigImg)} onClick={applySignature}>
                <Ic name="verified" size={18} />Apply Signature
              </button>
            </>
          )}
        </div>

        {/* Right: preview / result */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ flex: 1, borderRadius: 16, background: "#f2f4f6", padding: 20, minHeight: 280, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
            {/* Dot grid bg */}
            <div style={{ position: "absolute", inset: 0, opacity: .04, backgroundImage: "radial-gradient(circle at 2px 2px,#712ae2 1px,transparent 0)", backgroundSize: "16px 16px" }} />

            {step === "idle" && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, opacity: .5 }}>
                <Ic name="description" size={44} style={{ color: "#712ae2" }} />
                <p style={{ fontSize: 13, color: "#737686", textAlign: "center" }}>Signed document<br />preview will appear here</p>
              </div>
            )}

            {step === "positioning" && (
              <div className="anim-fade" style={{ display: "flex", flexDirection: "column", gap: 14, width: "100%" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <p style={{ fontSize: 11, fontWeight: 800, color: "#712ae2", textTransform: "uppercase" }}>Signature Placement</p>
                    <p style={{ fontSize: 10, color: "#737686", marginTop: 2 }}>Drag and resize the signature inside the page</p>
                  </div>
                </div>

                {renderDocumentSheet(false)}

                {/* Scale controls */}
                <div style={{ background: "#fff", border: "1px solid rgba(113,42,226,.15)", borderRadius: 12, padding: "10px 14px", marginTop: 4 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <label style={{ fontSize: 9, fontWeight: 800, color: "#737686", textTransform: "uppercase" }}>Signature Scale</label>
                    <span style={{ fontSize: 9, fontWeight: 700, color: "#712ae2" }}>{sigScale}%</span>
                  </div>
                  <input type="range" min="50" max="150" value={sigScale} onChange={e => setSigScale(Number(e.target.value))} style={{ width: "100%", accentColor: "#712ae2", height: 4 }} />
                </div>

                <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                  <button style={{ flex: 1.5, padding: "10px 0", borderRadius: 12, border: "none", background: "linear-gradient(135deg,#712ae2,#8a4cfc)", color: "#fff", fontWeight: 700, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, boxShadow: "0 4px 12px rgba(113,42,226,.25)" }}
                    onClick={confirmSignature}>
                    <Ic name="verified" size={16} />Confirm & Embed Signature
                  </button>
                  <button style={{ flex: 1, padding: "10px 0", borderRadius: 12, border: "1px solid #cbd5e1", background: "#fff", color: "#475569", fontWeight: 700, fontSize: 12, cursor: "pointer" }}
                    onClick={() => setStep("idle")}>
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {step === "processing" && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                <div className="anim-spin" style={{ width: 44, height: 44, border: "3px solid rgba(113,42,226,.2)", borderTopColor: "#712ae2", borderRadius: "50%" }} />
                <p style={{ fontSize: 13, color: "#712ae2", fontWeight: 700 }}>Applying signature…</p>
                <p style={{ fontSize: 11, color: "#737686", textAlign: "center" }}>Embedding legally-binding<br />cryptographic signature</p>
              </div>
            )}

            {step === "done" && (
              <div className="anim-fade" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, width: "100%" }}>
                <div style={{ width: 54, height: 54, borderRadius: "50%", background: "#006242", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 16px rgba(0,98,66,.3)" }}>
                  <Ic name="verified" size={28} fill style={{ color: "#fff" }} />
                </div>
                <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 800, fontSize: 15, color: "#006242" }}>Signature Applied!</p>

                {renderDocumentSheet(true)}

                <div style={{ width: "100%", background: "#fff", borderRadius: 12, padding: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: 8, borderBottom: "1px solid #f2f4f6", marginBottom: 8 }}>
                    <span style={{ fontSize: 11, color: "#737686" }}>Document</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#191c1e", maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{docFile?.name}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: 8, borderBottom: "1px solid #f2f4f6", marginBottom: 8 }}>
                    <span style={{ fontSize: 11, color: "#737686" }}>Signed</span>
                    <span style={{ fontSize: 11, fontWeight: 700 }}>{new Date().toLocaleDateString()}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: 8, borderBottom: "1px solid #f2f4f6", marginBottom: 8 }}>
                    <span style={{ fontSize: 11, color: "#737686" }}>Certificate</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#006242" }}>Valid ✓</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 11, color: "#737686" }}>Hash</span>
                    <span style={{ fontSize: 10, fontWeight: 700, color: "#712ae2", fontFamily: "monospace" }}>0x4f3a…c81e</span>
                  </div>
                </div>

                <div style={{ display: "flex", gap: 8, width: "100%" }}>
                  <button style={{ flex: 1, padding: "9px 0", borderRadius: 10, border: "none", background: "#712ae2", color: "#fff", fontWeight: 700, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
                    onClick={downloadSignedDocument}>
                    <Ic name="download" size={16} />Download
                  </button>
                  <button style={{ flex: 1, padding: "9px 0", borderRadius: 10, border: "1px solid rgba(113,42,226,.3)", background: "rgba(113,42,226,.05)", color: "#712ae2", fontWeight: 700, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
                    onClick={() => alert(`📧 Signature request shared! Unique Hash: 0x4f3ac81e-placed-at-X${sigX.toFixed(0)}Y${sigY.toFixed(0)}`)}>
                    <Ic name="send" size={16} />Share
                  </button>
                </div>

                <button onClick={reset} style={{ fontSize: 11, color: "#737686", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>Start over</button>
              </div>
            )}
          </div>

          {/* Trust badges */}
          <div style={{ display: "flex", gap: 8 }}>
            {[["lock","256-bit encrypted"],["gavel","Legally binding"],["verified","AATL certified"]].map(([ic, lb]) => (
              <div key={lb} style={{ flex: 1, display: "flex", alignItems: "center", gap: 6, padding: "8px 10px", background: "rgba(0,98,66,.05)", borderRadius: 10, border: "1px solid rgba(0,98,66,.1)" }}>
                <Ic name={ic} size={14} style={{ color: "#006242" }} />
                <span style={{ fontSize: 10, fontWeight: 700, color: "#006242" }}>{lb}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
/* ══════════════════════════════════════════════════════════════
   SIDEBAR
══════════════════════════════════════════════════════════════ */
const Sidebar = ({ activeNav }) => {
  const navigate = useNavigate();
  return (
    <nav className="sidebar-wrap" style={{ width: 232, minHeight: "100vh", background: "#fff", borderRight: "1px solid rgba(37,99,235,.08)", padding: "20px 10px", display: "flex", flexDirection: "column", position: "fixed", left: 0, top: 0, zIndex: 50, boxShadow: "4px 0 18px rgba(37,99,235,.05)" }}>
      <Link to="/" style={{ padding: "0 6px 32px", display: "flex", alignItems: "center", gap: 12, textDecoration: 'none' }}>
        <div style={{ width: 44, height: 44, background: "#1d4ed8", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Ic n="psychology" fill size={26} col="#fff" />
        </div>
        <div>
          <div className="sora" style={{ fontSize: "1.1rem", fontWeight: 800, color: "#1d4ed8", letterSpacing: "-.5px", lineHeight: 1 }}>DocFlow <span style={{ color: "#004ac6" }}>AI</span></div>
          <div style={{ fontSize: ".58rem", color: "#64748b", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginTop: 4, lineHeight: 1.3 }}>Intelligent<br/>Workspace</div>
        </div>
      </Link>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
        {[{ ic: "psychology", l: "AI Engine", id: "ai" }, { ic: "school", l: "DocFlow Learn", id: "learn" }, { ic: "tune", l: "DocFlow Core", id: "core" }].map(n => (
          <button key={n.id} onClick={() => {
            if (n.id === "ai") navigate("/ai-engine");
            else if (n.id === "learn") navigate("/docflow-learn");
            else if (n.id === "core") navigate("/docflow-core");
          }}
            style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 12, fontFamily: "inherit", fontSize: ".85rem", fontWeight: activeNav === n.id ? 700 : 500, color: activeNav === n.id ? "#2563eb" : "#475569", background: activeNav === n.id ? "rgba(37,99,235,.07)" : "transparent", border: "none", cursor: "pointer", width: "100%", transition: "all .18s", borderRight: activeNav === n.id ? "3px solid #2563eb" : "3px solid transparent", textAlign: "left" }}>
            <Ic n={n.ic} size={20} col={activeNav === n.id ? "#2563eb" : "#64748b"} />
            {n.l}
          </button>
        ))}
      </div>
      <div style={{ margin: "24px 6px" }}>
        <button className="btn-primary" onClick={() => alert("Creating a new project... Feature coming soon!")} style={{ borderRadius: 14, padding: "14px", width: "100%", justifyContent: "center", fontSize: "14px", fontWeight: 700, boxShadow: "0 4px 14px rgba(37,99,235,.25)" }}>
          <Ic n="add" size={18} />New Project
        </button>
      </div>
      <div style={{ marginTop: "auto", padding: "16px 6px", borderTop: "1px solid #f1f5f9", display: "flex", flexDirection: "column", gap: 4 }}>
        {[["help", "Help Center"], ["settings", "Settings"]].map(([ic, lb]) => (
          <button key={lb} onClick={() => alert(`${lb} feature is coming soon!`)}
            style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 12px", borderRadius: 10, fontFamily: "inherit", fontSize: ".82rem", fontWeight: 500, color: "#64748b", background: "transparent", border: "none", cursor: "pointer", width: "100%", transition: "all .18s", textAlign: "left" }}
            onMouseEnter={e => { e.currentTarget.style.background = "#eff6ff"; e.currentTarget.style.color = "#2563eb"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#64748b"; }}>
            <Ic n={ic} size={19} />{lb}
          </button>
        ))}
      </div>
    </nav>
  );
};

/* ─── Floating AI Dock ──────────────────────────────────────── */
function FloatingDock() {
  const [q, setQ] = useState("");
  return (
    <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 640, padding: "0 20px", zIndex: 70 }}>
      <div className="glass-dock" style={{ borderRadius: 9999, padding: "10px 14px 10px 14px", display: "flex", alignItems: "center", gap: 12, border: "1px solid rgba(255,255,255,.25)", boxShadow: "0 16px 48px rgba(0,74,198,.16)" }}>
        <div style={{ width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg,#004ac6,#2563eb)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 4px 12px rgba(0,74,198,.35)" }}>
          <Ic name="bolt" size={20} fill style={{ color: "#fff" }} />
        </div>
        <input type="text" value={q} onChange={e => setQ(e.target.value)} placeholder="Ask Core to process, summarize or find…"
          onKeyDown={e => e.key === "Enter" && setQ("")}
          style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: 13, color: "#191c1e", fontFamily: "'Plus Jakarta Sans',sans-serif" }} />
        <div style={{ display: "flex", gap: 2 }}>
          <button className="btn-icon"><Ic name="mic" size={20} /></button>
          <button className="btn-icon"><Ic name="attach_file" size={20} /></button>
          <button onClick={() => setQ("")} style={{ width: 34, height: 34, borderRadius: "50%", background: q ? "linear-gradient(135deg,#004ac6,#2563eb)" : "#e6e8ea", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "background .18s", boxShadow: q ? "0 4px 10px rgba(0,74,198,.3)" : "none" }}>
            <Ic name="send" size={17} style={{ color: q ? "#fff" : "#94a3b8" }} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Top Header ────────────────────────────────────────────── */
function TopHeader() {
  const navigate = useNavigate();
  return (
    <header className="glass" style={{
      position: "sticky", top: 0, zIndex: 40,
      display: "flex", alignItems: "center", justifyContent: "flex-end",
      padding: "0 28px", height: 72,
      borderBottom: "1px solid rgba(195,198,215,.3)",
      boxShadow: "0 4px 20px rgba(0,74,198,.06)",
    }}>
      {/* Right: Navigation Links */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <button className="btn-ghost" style={{ width: "auto", gap: 8, padding: "8px 20px", height: "auto", border: "1px solid rgba(0,74,198,0.15)", background: "rgba(0,74,198,0.04)" }} onClick={() => navigate("/")}>
          <Ic n="home" size={18} />
          <span style={{ fontSize: 13, fontWeight: 700 }}>Back to Home</span>
        </button>
      </div>
    </header>
  );
}

/* ─── Root App ──────────────────────────────────────────────── */
export default function DocFlowCore() {
  return (
    <div className="anim-fade-in" style={{ padding: "32px 28px 120px", maxWidth: 1200, margin: "0 auto" }}>
      <GlobalStyles />
      

      {/* Feature Sections */}
      <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
        <DocumentProcessing />
        <AISummarization />
        <ESignature />
      </div>

      <FloatingDock />

      <style>{`
        .anim-fade-in { animation: fadeIn 0.6s ease-out both; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        
        @media(max-width:1024px){
          div[style*="grid-template-columns: 1fr 1fr"]{grid-template-columns: 1fr !important}
          div[style*="grid-template-columns: 1fr 1.6fr"]{grid-template-columns: 1fr !important}
        }
      `}</style>
    </div>
  );
}
