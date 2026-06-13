
function TelemetrySection() {
  const [logIdx, setLogIdx] = useState(0);
  const [pct, setPct] = useState(0);

  const logs = [
    "[SCAN]  Sweeping 433MHz band...",
    "[RX]    Packet fragment detected...",
    "[ERR]   Signal lost — retrying...",
    "[SCAN]  Adjusting antenna gain...",
    "[RX]    LoRa preamble detected...",
    "[ERR]   CRC mismatch — discarding...",
    "[SCAN]  Searching for CanSat beacon...",
    "[ERR]   No telemetry stream detected",
  ];

  useEffect(() => {
    const logTimer = setInterval(() => setLogIdx(i => (i + 1) % logs.length), 2000);
    const pctTimer = setInterval(() => setPct(p => (p + Math.floor(Math.random() * 15)) % 100), 800);
    return () => { clearInterval(logTimer); clearInterval(pctTimer); };
  }, []);

  const barColors = ["#27C47A", "#FF6B6B", "#1A6CFF", "#FFB800", "#9B59B6", "#38BDF8"];
  const barHeights = [6, 10, 14, 18, 14, 10, 6];

  return (
    <section style={{ minHeight: "88vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "80px clamp(14px,4vw,60px)", position: "relative", overflow: "hidden" }}>

      {/* Animated CSS styles */}
      <style>{`
        @keyframes orbit1 { to { transform: rotate(360deg); } }
        @keyframes orbit2 { to { transform: rotate(-360deg); } }
        @keyframes barPulse {
          0%,100% { background: #141D30; box-shadow: none; }
          50% { background: #E8612A; box-shadow: 0 0 8px rgba(232,97,42,0.5); }
        }
        @keyframes progressAnim {
          0%   { width: 0%;  opacity: 1; }
          70%  { width: 85%; opacity: 1; }
          90%  { width: 85%; opacity: 0.5; }
          100% { width: 0%;  opacity: 0; }
        }
        @keyframes logFadeIn {
          from { opacity:0; transform: translateY(5px); }
          to   { opacity:1; transform: translateY(0); }
        }
        @keyframes gradientShift {
          0%,100% { background-position: 0% 50%; }
          50%     { background-position: 100% 50%; }
        }
        @keyframes floatSat {
          0%,100% { transform: translateY(0px); }
          50%     { transform: translateY(-8px); }
        }
        @keyframes scanline {
          0%   { top: -10%; opacity: 0.6; }
          100% { top: 110%; opacity: 0; }
        }
        .bar-pulse-1 { animation: barPulse 1.8s ease-in-out infinite 0s; }
        .bar-pulse-2 { animation: barPulse 1.8s ease-in-out infinite 0.15s; }
        .bar-pulse-3 { animation: barPulse 1.8s ease-in-out infinite 0.3s; }
        .bar-pulse-4 { animation: barPulse 1.8s ease-in-out infinite 0.45s; }
        .bar-pulse-5 { animation: barPulse 1.8s ease-in-out infinite 0.6s; }
        .bar-pulse-6 { animation: barPulse 1.8s ease-in-out infinite 0.75s; }
        .bar-pulse-7 { animation: barPulse 1.8s ease-in-out infinite 0.9s; }
        .progress-fill-anim { animation: progressAnim 3s ease-in-out infinite; }
        .log-fade { animation: logFadeIn 0.4s ease both; }
        .sat-float { animation: floatSat 3s ease-in-out infinite; }
        .tele-preview-wrap { filter: blur(1.5px); opacity: 0.3; pointer-events: none; }
      `}</style>

      {/* Grid background */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(26,108,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(26,108,255,0.04) 1px, transparent 1px)", backgroundSize: "40px 40px", pointerEvents: "none" }} />

      {/* Glow orbs */}
      <div style={{ position: "absolute", top: "-10%", right: "-5%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(26,108,255,0.09) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "-5%", left: "-5%", width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(circle, rgba(232,97,42,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: "40%", left: "10%", width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(39,196,122,0.05) 0%, transparent 70%)", pointerEvents: "none" }} />

      {/* Scanline effect on blurred cards */}
      <div style={{ position: "absolute", left: 0, right: 0, height: "2px", background: "linear-gradient(90deg, transparent, rgba(232,97,42,0.4), transparent)", animation: "scanline 4s linear infinite", pointerEvents: "none", zIndex: 2 }} />

      {/* Main content */}
      <div style={{ position: "relative", zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", maxWidth: 560, width: "100%" }}>

        {/* Satellite orbit icon */}
        <div className="sat-float" style={{ position: "relative", width: 120, height: 120, marginBottom: 28, flexShrink: 0 }}>
          {/* Outer orbit ring */}
          <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "1px solid rgba(232,97,42,0.25)", animation: "orbit1 6s linear infinite" }}>
            <div style={{ position: "absolute", width: 8, height: 8, background: "#E8612A", borderRadius: "50%", top: -4, left: "50%", transform: "translateX(-50%)", boxShadow: "0 0 10px #E8612A, 0 0 20px rgba(232,97,42,0.4)" }} />
          </div>
          {/* Inner orbit ring */}
          <div style={{ position: "absolute", inset: 14, borderRadius: "50%", border: "1px solid rgba(26,108,255,0.2)", animation: "orbit2 4s linear infinite" }}>
            <div style={{ position: "absolute", width: 6, height: 6, background: "#1A6CFF", borderRadius: "50%", bottom: -3, left: "50%", transform: "translateX(-50%)", boxShadow: "0 0 8px #1A6CFF, 0 0 16px rgba(26,108,255,0.4)" }} />
          </div>
          {/* Center */}
          <div style={{ position: "absolute", inset: 28, background: "#070C18", border: "1px solid #1A2540", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>🛰️</div>
        </div>

        {/* Signal bars */}
        <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 20, marginBottom: 24 }}>
          {barHeights.map((h, i) => (
            <div key={i} className={`bar-pulse-${i + 1}`} style={{ width: 5, height: h, borderRadius: 2, background: "#141D30", transition: "background 0.3s" }} />
          ))}
        </div>

        {/* Status chip */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "5px 14px", background: "rgba(232,97,42,0.1)", border: "1px solid rgba(232,97,42,0.3)", borderRadius: 20, fontFamily: "'Space Mono',monospace", fontSize: 10, letterSpacing: 2, color: "#E8612A", marginBottom: 18 }}>
          <div className="live-dot" style={{ width: 6, height: 6, borderRadius: "50%", background: "#E8612A" }} />
          TELEMETRY LINK OFFLINE
        </div>

        {/* 404 */}
        <div style={{ fontFamily: "'Space Mono',monospace", fontSize: "clamp(64px,12vw,96px)", fontWeight: 700, background: "linear-gradient(135deg, #E8612A, #FF7A42 40%, #FFB800)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", lineHeight: 1, marginBottom: 10, letterSpacing: -3 }}>404</div>

        <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(20px,3vw,28px)", fontWeight: 800, color: "#F0F4FF", marginBottom: 14 }}>
          Signal Not Found<span style={{ color: "#E8612A" }}>.</span>
        </h2>

        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, color: "#7A8FAD", lineHeight: 1.8, marginBottom: 28, maxWidth: 420 }}>
          The live telemetry dashboard is under construction. Ground station integration and LoRa data pipeline are being configured. Check back closer to launch —{" "}
          <strong style={{ color: "#F0F4FF" }}>Apr 12, 2026</strong>.
        </p>

        {/* Blurred ghost preview of telemetry cards */}
        <div className="tele-preview-wrap" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, width: "100%", marginBottom: 24, position: "relative" }}>
          {[
            { label: "Altitude",     val: "— m",    color: "#27C47A", w: "60%" },
            { label: "Temperature",  val: "— °C",   color: "#FF6B6B", w: "45%" },
            { label: "Pressure",     val: "— hPa",  color: "#1A6CFF", w: "75%" },
          ].map(card => (
            <div key={card.label} style={{ background: "#070C18", border: "1px solid #141D30", borderRadius: 8, padding: "12px 14px", textAlign: "left" }}>
              <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 8, color: "#7A8FAD", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 5 }}>{card.label}</div>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 20, fontWeight: 700, color: card.color, marginBottom: 8 }}>{card.val}</div>
              <div style={{ height: 3, background: "#141D30", borderRadius: 2 }}>
                <div style={{ width: card.w, height: "100%", background: card.color, borderRadius: 2 }} />
              </div>
            </div>
          ))}
          {/* No signal overlay */}
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(4,6,15,0.5)", borderRadius: 8 }}>
            <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, letterSpacing: 3, color: "#E8612A" }}>NO SIGNAL</span>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ width: "100%", maxWidth: 340, marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'Space Mono',monospace", fontSize: 10, color: "#7A8FAD", letterSpacing: 1, marginBottom: 7 }}>
            <span>ESTABLISHING LINK</span>
            <span>{pct}%</span>
          </div>
          <div style={{ height: 3, background: "#141D30", borderRadius: 2, overflow: "hidden" }}>
            <div className="progress-fill-anim" style={{ height: "100%", background: "linear-gradient(90deg, #E8612A, #FFB800)", borderRadius: 2 }} />
          </div>
        </div>

        {/* Packet log */}
        <div style={{ width: "100%", background: "#070C18", border: "1px solid #141D30", borderRadius: 8, padding: "12px 16px", fontFamily: "'Space Mono',monospace", fontSize: 11, textAlign: "left", marginBottom: 28 }}>
          <div style={{ color: "#27C47A", opacity: 0.25, marginBottom: 3 }}>[INIT]  LoRa SX1278 @ 433MHz — searching...</div>
          <div style={{ color: "#27C47A", opacity: 0.25, marginBottom: 3 }}>[RX]    Awaiting ground station connection...</div>
          <div key={logIdx} className="log-fade" style={{ color: "#27C47A" }}>{logs[logIdx]}</div>
        </div>

        {/* Back button */}
        <button
          onClick={() => {}}
          style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "11px 24px", background: "transparent", border: "1px solid #1A2540", borderRadius: 6, color: "#7A8FAD", fontFamily: "'Space Mono',monospace", fontSize: 11, letterSpacing: 1, cursor: "pointer", transition: "border-color .2s, color .2s" }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "#E8612A"; e.currentTarget.style.color = "#E8612A"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "#1A2540"; e.currentTarget.style.color = "#7A8FAD"; }}
        >
          ← Back to Overview
        </button>
