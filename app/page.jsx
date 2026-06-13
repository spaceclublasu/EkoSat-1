"use client";
import { useState, useEffect, useRef } from "react";

// ─── FONTS and the global styles that was used.. responsiveness also───────────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,400&family=Space+Mono:wght@400;700&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body { background: #04060F; color: #F0F4FF; -webkit-font-smoothing: antialiased; }
    ::-webkit-scrollbar { width: 5px; }
    ::-webkit-scrollbar-track { background: #04060F; }
    ::-webkit-scrollbar-thumb { background: #1A2540; border-radius: 3px; }
    @keyframes fadeUp { from { opacity:0; transform:translateY(22px); } to { opacity:1; transform:translateY(0); } }
    @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.35} }
    .cansat-fade { animation: fadeUp .55s ease both; }
    .live-dot { animation: pulse 1.4s ease-in-out infinite; }
    .tab-scroll { overflow-x: auto; -webkit-overflow-scrolling: touch; scrollbar-width: none; }
    .tab-scroll::-webkit-scrollbar { display: none; }

    /* Responsive grid helpers */
    @media (max-width: 960px) {
      .two-col   { grid-template-columns: 1fr !important; }
      .hero-grid { grid-template-columns: 1fr !important; }
      .team-grid { grid-template-columns: 1fr 1fr !important; }
      .tele-secondary { grid-template-columns: 1fr 1fr !important; }
    }
    @media (max-width: 640px) {
      .stats-grid      { grid-template-columns: 1fr 1fr !important; }
      .tele-top-row    { grid-template-columns: 1fr 1fr !important; }
      .tele-secondary  { grid-template-columns: 1fr !important; }
      .team-grid       { grid-template-columns: 1fr !important; }
      .tl-detail-grid  { grid-template-columns: 1fr !important; }
    }
  `}</style>
);

// ─── DESIGN TOKENS used ───────────────────────────────────────────────────────────
const C = {
  bg: "#04060F",
  bgCard: "#070C18",
  bgCardAlt: "#0B1120",
  accent: "#E8612A",
  accentSoft: "#FF7A42",
  blue: "#1A6CFF",
  blueGlow: "rgba(26,108,255,0.16)",
  green: "#27C47A",
  red: "#FF4560",
  yellow: "#FFB800",
  purple: "#9B59B6",
  cyan: "#38BDF8",
  white: "#F0F4FF",
  muted: "#7A8FAD",
  border: "#141D30",
  borderHi: "rgba(26,108,255,0.32)",
};

// ─── STAR CANVAS (EFFECTS)─────────────────────────────────────────────────────────────
function StarField() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let w, h, raf;
    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    resize();
    const stars = Array.from({ length: 200 }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      r: Math.random() * 1.1 + .2,
      t: Math.random() * Math.PI * 2,
      s: .0015 + Math.random() * .003,
    }));
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      stars.forEach(s => {
        s.t += s.s;
        const a = (Math.sin(s.t) * .45 + .55) * .7;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, 6.28);
        ctx.fillStyle = `rgba(180,210,255,${a})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, opacity: .5 }} />;
}

// ─── SMALL COMPONENTS INVLVED LIKED THE HOVER EFFECT AND ALL ────────────────────────────────────────────────────────
const SLabel = ({ text }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
    <div style={{ width: 26, height: 2, background: C.accent }} />
    <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, letterSpacing: 3, color: C.accent, textTransform: "uppercase" }}>{text}</span>
  </div>
);

const Badge = ({ children, color = C.accent }) => (
  <span style={{ display: "inline-block", padding: "3px 10px", background: color + "1A", border: `1px solid ${color}44`, borderRadius: 20, fontSize: 11, color, fontFamily: "'Space Mono',monospace", letterSpacing: .8 }}>{children}</span>
);

function HoverCard({ children, style = {}, glowColor }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      style={{ background: C.bgCard, border: `1px solid ${hovered ? (glowColor || C.borderHi) : C.border}`, borderRadius: 12, overflow: "hidden", transition: "border-color .25s, transform .25s", transform: hovered ? "translateY(-2px)" : "translateY(0)", ...style }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >{children}</div>
  );
}

// ─── SVG CHART USED ──────────────────────────────────────────────────────────
function LineChart({ data, color, unit, label, height = 160 }) {
  const W = 400, H = height;
  const pad = { t: 20, r: 12, b: 36, l: 44 };
  const iw = W - pad.l - pad.r;
  const ih = H - pad.t - pad.b;
  if (!data || data.length < 2) return null;
  const vals = data.map(d => d.v);
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const range = max - min || 1;
  const pts = vals.map((v, i) => [
    pad.l + (i / (vals.length - 1)) * iw,
    pad.t + ih - ((v - min) / range) * ih,
  ]);
  const polyline = pts.map(p => p.join(",")).join(" ");
  const area = `M${pts[0][0]},${pad.t + ih} ` + pts.map(p => `L${p[0]},${p[1]}`).join(" ") + ` L${pts[pts.length - 1][0]},${pad.t + ih} Z`;
  const gid = `grad_${label.replace(/\W/g, "")}`;
  const ticks = [0, .25, .5, .75, 1];

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ display: "block", overflow: "visible" }}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity=".32" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Grid */}
      {ticks.map((t, i) => {
        const y = pad.t + ih * (1 - t);
        const v = (min + t * range).toFixed(1);
        return (
          <g key={i}>
            <line x1={pad.l} y1={y} x2={W - pad.r} y2={y} stroke={C.border} strokeWidth=".6" strokeDasharray="3,4" />
            <text x={pad.l - 5} y={y + 3.5} fill={C.muted} fontSize="8" textAnchor="end" fontFamily="'Space Mono',monospace">{v}</text>
          </g>
        );
      })}
      {/* Time x-axis labels */}
      {[0, .5, 1].map((t, i) => {
        const x = pad.l + t * iw;
        const idx = Math.round(t * (data.length - 1));
        return <text key={i} x={x} y={H - 4} fill={C.muted} fontSize="7.5" textAnchor="middle" fontFamily="'Space Mono',monospace">{data[idx]?.t || ""}</text>;
      })}
      {/* Unit label */}
      <text x={pad.l - 36} y={pad.t + ih / 2} fill={C.muted} fontSize="8" textAnchor="middle" fontFamily="'Space Mono',monospace" transform={`rotate(-90,${pad.l - 36},${pad.t + ih / 2})`}>{unit}</text>
      {/* Fill */}
      <path d={area} fill={`url(#${gid})`} />
      {/* Line */}
      <polyline points={polyline} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      {/* Latest value dot */}
      <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r="4" fill={color} stroke={C.bgCard} strokeWidth="2" />
      {/* Latest label */}
      <text x={pts[pts.length - 1][0] + 6} y={pts[pts.length - 1][1] - 6} fill={color} fontSize="9" fontFamily="'Space Mono',monospace">{vals[vals.length - 1].toFixed(1)}{unit}</text>
    </svg>
  );
}

// ─── TELEMETRY DATA SIMULATOR( THO , THIS CAN BE REMOVED TO ALLOW REAL DATA FROM THE BACKEND) ────────────────────────────────────────────────
const MAX_PTS = 40;
function makeSeries(base, noise, n = 22) {
  return Array.from({ length: n }, (_, i) => ({
    t: `-${n - i}s`,
    v: +(base + (Math.random() - .5) * noise).toFixed(2),
  }));
}
function addPoint(prev, base, noise, drift = 0) {
  const last = prev[prev.length - 1].v;
  const next = +(last + drift + (Math.random() - .5) * noise).toFixed(2);
  return [...prev.slice(-(MAX_PTS - 1)), { t: "now", v: next }];
}

// ─── NAV TAGS LIKE THE OVERVIEW, MISSION, ETC. ──────────────────────────────────────────────────────────────────────
function CanSatNav({ active, setActive }) {
  const tabs = ["Overview", "Mission", "Systems", "Telemetry", "Timeline", "Team"];
  return (
    <nav style={{ position: "sticky", top: 0, zIndex: 100, background: C.bg + "F0", backdropFilter: "blur(20px)", borderBottom: `1px solid ${C.border}` }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 clamp(14px,4vw,60px)", display: "flex", alignItems: "center", gap: 4 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginRight: 18, padding: "14px 0", flexShrink: 0 }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: C.accent, boxShadow: `0 0 8px ${C.accent}` }} />
          <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: C.white, letterSpacing: 2 }}>EKOSAT-1</span>
        </div>
        <div className="tab-scroll" style={{ flex: 1, display: "flex" }}>
          <div style={{ display: "flex", gap: 2, minWidth: "max-content" }}>
            {tabs.map(tab => (
              <button key={tab} onClick={() => setActive(tab)} style={{
                background: "none", border: "none", cursor: "pointer",
                padding: "16px 13px", fontFamily: "'Space Mono',monospace", fontSize: 11, letterSpacing: .8,
                color: active === tab ? C.accentSoft : C.muted,
                borderBottom: `2px solid ${active === tab ? C.accent : "transparent"}`,
                transition: "all .2s", whiteSpace: "nowrap",
              }}>{tab}</button>
            ))}
          </div>
        </div>
        <div style={{ flexShrink: 0, paddingLeft: 8 }}>
          <Badge color={C.accent}>Apr 12 2026</Badge>
        </div>
      </div>
    </nav>
  );
}

// ─── SECTION: OVERVIEW (1, THE FIRST NAV SECTION) ───────────────────────────────────────────────────────
function OverviewSection() {
  const stats = [
    { label: "Target Altitude", value: "~1 KM", sub: "Sub-orbital range" },
    { label: "Launch Date", value: "Apr 12", sub: "2026" },
    { label: "Subsystems", value: "5", sub: "Modular architecture" },
    { label: "Telemetry", value: "LoRa", sub: "RF real-time link" },
    { label: "Onboard CPU", value: "Pico W", sub: "RP2040 + Wi-Fi" },
    { label: "Sensors", value: "8+", sub: "Environmental & IMU" },
  ];
  return (
    <section style={{ position: "relative", minHeight: "88vh", display: "flex", alignItems: "center", padding: "80px clamp(14px,4vw,60px)" }}>
      <div style={{ position: "absolute", top: "12%", right: "6%", width: 480, height: 480, borderRadius: "50%", background: `radial-gradient(circle,${C.blueGlow} 0%,transparent 70%)`, pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "8%", left: "3%", width: 260, height: 260, borderRadius: "50%", background: `radial-gradient(circle,${C.accent}0D 0%,transparent 70%)`, pointerEvents: "none" }} />
      <div style={{ maxWidth: 1280, margin: "0 auto", width: "100%" }}>
        <div className="hero-grid cansat-fade" style={{ display: "grid", gridTemplateColumns: "1.15fr .85fr", gap: "clamp(28px,5vw,72px)", alignItems: "center" }}>
          <div>
            <SLabel text="Space Clubs LASU — Flagship Mission" />
            <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(38px,5.8vw,74px)", fontWeight: 800, lineHeight: 1.02, margin: "0 0 20px", color: C.white }}>
               <span style={{ color: C.accent }}>EkoSat-1</span>
            </h1>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "clamp(14px,1.5vw,17px)", color: C.muted, lineHeight: 1.8, maxWidth: 500, marginBottom: 34 }}>
              LASU's first hands-on aerospace mission — a miniature satellite designed, built and launched by students. It reaches altitudes up to 1 km, streams real-time sensor telemetry via LoRa RF, and recovers safely by parachute.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button style={{ padding: "13px 28px", background: C.accent, border: "none", borderRadius: 6, color: "#fff", fontFamily: "'Space Mono',monospace", fontSize: 12, letterSpacing: 1, cursor: "pointer", boxShadow: `0 4px 20px ${C.accent}44` }}>Explore Mission →</button>
              <button style={{ padding: "13px 28px", background: "transparent", border: `1px solid ${C.border}`, borderRadius: 6, color: C.muted, fontFamily: "'Space Mono',monospace", fontSize: 12, letterSpacing: 1, cursor: "pointer" }}>System Architecture</button>
            </div>
          </div>
          <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 13 }}>
            {stats.map(s => (
              <HoverCard key={s.label} style={{ padding: "17px 19px" }}>
                <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 9, color: C.muted, letterSpacing: 2, marginBottom: 7, textTransform: "uppercase" }}>{s.label}</div>
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(17px,2vw,25px)", fontWeight: 700, color: C.white, marginBottom: 3 }}>{s.value}</div>
                <div style={{ fontSize: 12, color: C.muted }}>{s.sub}</div>
              </HoverCard>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── SECTION: MISSION(2, THE SECONDNAV SECTION) ────────────────────────────────────────────────────────
function MissionSection() {
  const objectives = [
    { icon: "🛰️", title: "Design & Build", body: "Fully functional CanSat within standard size and mass constraints, engineered through structured aerospace review gates." },
    { icon: "📡", title: "Real-Time Telemetry", body: "Transmit live flight data via LoRa RF link to a dedicated ground station throughout ascent and descent." },
    { icon: "🌡️", title: "Environmental Sensing", body: "Collect temperature, pressure, humidity, altitude, and light data during the full flight profile." },
    { icon: "🪂", title: "Safe Recovery", body: "Servo-actuated parachute ensures controlled descent rate and structural survivability upon landing." },
    { icon: "📊", title: "Data Analysis", body: "Generate atmospheric profiles and descent rate characterisation through post-flight time-series analysis." },
    { icon: "🇳🇬", title: "Inspire Nigeria", body: "Position LASU as an emerging participant in hands-on space technology engineering and innovation." },
  ];
  const gates = [
    { label: "SRR", full: "System Requirements Review", status: "done" },
    { label: "PDR", full: "Preliminary Design Review", status: "done" },
    { label: "CDR", full: "Critical Design Review", status: "active" },
    { label: "TRR", full: "Test Readiness Review", status: "upcoming" },
    { label: "FRR", full: "Flight Readiness Review", status: "upcoming" },
  ];
  const gColor = s => s === "done" ? C.green : s === "active" ? C.accent : C.muted;

  return (
    <section style={{ padding: "90px clamp(14px,4vw,60px)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div className="two-col cansat-fade" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(28px,5vw,76px)", alignItems: "start" }}>
          <div>
            <SLabel text="Mission Definition" />
            <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(26px,3.6vw,50px)", fontWeight: 800, color: C.white, margin: "0 0 18px", lineHeight: 1.1 }}>From Theory<br /><span style={{ color: C.accent }}>to Flight</span></h2>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, color: C.muted, lineHeight: 1.85, marginBottom: 18 }}>
              EKOSAT-1 is SPACE CLUBS LASU's inaugural hardware mission — bridging the gap between classroom theory and real-world aerospace systems engineering. The satellite flies to 100 m–1 km, logging and streaming time-series data throughout.
            </p>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, color: C.muted, lineHeight: 1.85, marginBottom: 28 }}>
              Every phase follows formal aerospace review gates: SRR → PDR → CDR → TRR → FRR. This is not an experiment — it is a controlled, documented, performance-driven programme.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {gates.map(g => (
                <div key={g.label} style={{ display: "flex", alignItems: "center", gap: 13, padding: "9px 13px", background: C.bgCardAlt, borderRadius: 8, border: `1px solid ${g.status === "active" ? C.accent + "55" : C.border}` }}>
                  <div style={{ width: 30, height: 30, borderRadius: 6, background: gColor(g.status) + "1A", border: `1px solid ${gColor(g.status)}44`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Space Mono',monospace", fontSize: 9, color: gColor(g.status), flexShrink: 0 }}>{g.label}</div>
                  <div style={{ flex: 1, fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: C.white }}>{g.full}</div>
                  <Badge color={gColor(g.status)}>{g.status === "done" ? "✓ Done" : g.status === "active" ? "● Active" : "Upcoming"}</Badge>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 13 }}>
            {objectives.map(o => (
              <HoverCard key={o.title} style={{ padding: "17px 17px" }}>
                <div style={{ fontSize: 22, marginBottom: 9 }}>{o.icon}</div>
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 14, fontWeight: 700, color: C.white, marginBottom: 5 }}>{o.title}</div>
                <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: C.muted, lineHeight: 1.7 }}>{o.body}</div>
              </HoverCard>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── SECTION: SYSTEMS(3, THE THIRD NAV SECTION) ────────────────────────────────────────────────────────
function SystemsSection() {
  const [active, setActive] = useState(0);
  const systems = [
    { id: "Payload", icon: "🔬", color: C.green, short: "Environmental sensors & onboard data logging", full: "Integrates BME280 (temp/humidity/pressure), BH1750 (ambient light), MPU-6050 IMU (6-DOF), NEO-6M GPS, and SD card onboard logging — all powered from the monitored 3.3 V rail.", specs: ["BME280 — Temp / Humidity / Pressure", "BH1750 — Ambient Light (Lux)", "MPU-6050 — IMU 6-DOF", "NEO-6M — GPS & Time Sync", "SD Card — Onboard Logging"] },
    { id: "Avionics", icon: "💻", color: C.blue, short: "Raspberry Pi Pico W onboard computer", full: "The RP2040 dual-core Pico W acts as the central onboard computer managing all sensor polling (I²C/SPI/UART), telemetry processing, firmware control loops, and system health monitoring.", specs: ["RP2040 Dual-core @ 133 MHz", "I²C / SPI / UART buses", "LoRa SX1278 telemetry module", "MicroPython firmware", "LED status indicators"] },
    { id: "Power", icon: "⚡", color: C.yellow, short: "Li-ion battery with regulated dual-rail distribution", full: "A 3.7 V Li-ion battery powers the system through a main switch. A 5 V boost feeds high-power loads; a 3.3 V buck supplies sensitive electronics. USB charging module allows safe replenishment between tests.", specs: ["3.7 V Li-ion main source", "5 V Step-Up (Boost) Converter", "3.3 V Step-Down (Buck) Converter", "Overcurrent protection", "Power ON LED indicator"] },
    { id: "Comms", icon: "📡", color: C.accent, short: "LoRa RF telemetry link to ground station", full: "LoRa SX1278 transmitter sends live sensor readings, system status and power metrics to a PicoW ground station receiver at 433/868/915 MHz. Antenna placement optimised for dynamic flight orientations.", specs: ["LoRa SX1278 transmitter", "433 / 868 / 915 MHz RF band", "PicoW ground station receiver", "Integrated GS data logging", "Antenna orientation optimised"] },
    { id: "Recovery", icon: "🪂", color: C.purple, short: "Servo-actuated parachute & shock protection", full: "Structural enclosure designed for balance, rigidity and shock tolerance. A micro-servo triggers parachute deployment at apogee for controlled descent. Internal mounting optimises mass distribution and vibration damping.", specs: ["Micro-servo deployment trigger", "Swivel connector — prevents twist", "Foam + rubber shock dampers", "Durable structural casing", "Balance-optimised CG layout"] },
  ];
  const sys = systems[active];
  return (
    <section style={{ padding: "90px clamp(14px,4vw,60px)", background: `linear-gradient(180deg,transparent,${C.bgCardAlt}33,transparent)` }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 44 }}>
          <SLabel text="System Architecture" />
          <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(26px,3.6vw,50px)", fontWeight: 800, color: C.white, margin: "0 0 12px" }}>Five Integrated <span style={{ color: C.accent }}>Subsystems</span></h2>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, color: C.muted, maxWidth: 520, margin: "0 auto" }}>Each subsystem is independently validated before full integration, mirroring scaled aerospace standards.</p>
        </div>
        <div className="tab-scroll" style={{ marginBottom: 26 }}>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", minWidth: "max-content", margin: "0 auto" }}>
            {systems.map((s, i) => (
              <button key={s.id} onClick={() => setActive(i)} style={{ padding: "9px 17px", borderRadius: 6, border: `1px solid ${active === i ? s.color : C.border}`, background: active === i ? s.color + "18" : "transparent", color: active === i ? s.color : C.muted, fontFamily: "'Space Mono',monospace", fontSize: 11, cursor: "pointer", transition: "all .2s", letterSpacing: .8, whiteSpace: "nowrap" }}>{s.icon} {s.id}</button>
            ))}
          </div>
        </div>
        <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28, background: C.bgCard, border: `1px solid ${sys.color}33`, borderRadius: 14, padding: "clamp(18px,3vw,38px)" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 13, marginBottom: 17 }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: sys.color + "1A", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, border: `1px solid ${sys.color}44`, flexShrink: 0 }}>{sys.icon}</div>
              <div>
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 19, fontWeight: 700, color: C.white }}>{sys.id} Subsystem</div>
                <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: sys.color }}>{sys.short}</div>
              </div>
            </div>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: C.muted, lineHeight: 1.85 }}>{sys.full}</p>
          </div>
          <div>
            <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 9, letterSpacing: 2, color: C.muted, marginBottom: 13, textTransform: "uppercase" }}>Key Components</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {sys.specs.map(s => (
                <div key={s} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", background: C.bgCardAlt, borderRadius: 6, border: `1px solid ${C.border}` }}>
                  <div style={{ width: 5, height: 5, borderRadius: "50%", background: sys.color, flexShrink: 0 }} />
                  <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: C.white }}>{s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}



// ─── SECTION: LIVE TELEMETRY ─────────────────────────────────────────────────
// Replace your entire TelemetrySection function with this one.
// Make sure your server.py is running on port 4443 before testing.

function TelemetrySection() {
  const [isLive, setIsLive] = useState(false);
  const [connected, setConnected] = useState(false);
  const [phase, setPhase] = useState("STANDBY");
  const [elapsed, setElapsed] = useState(0);
  const [error, setError] = useState(null);
  const wsRef = useRef(null);
  const bufferRef = useRef([]);
  const renderRef = useRef(null);
  const elapsedRef = useRef(null);

  // ── Chart state — all sensors from server.py ─────────────────────────────
  const [alt, setAlt] = useState(() => makeSeries(0, 0, 2));
  const [temp, setTemp] = useState(() => makeSeries(0, 0, 2));
  const [pressure, setPressure] = useState(() => makeSeries(0, 0, 2));
  const [humidity, setHumidity] = useState(() => makeSeries(0, 0, 2));
  const [accelX, setAccelX] = useState(() => makeSeries(0, 0, 2));
  const [accelY, setAccelY] = useState(() => makeSeries(0, 0, 2));
  const [light, setLight] = useState(() => makeSeries(0, 0, 2));
  const [voltage, setVoltage] = useState(() => makeSeries(0, 0, 2));
  const [gyroX, setGyroX] = useState(() => makeSeries(0, 0, 2));
  const [current, setCurrent] = useState(() => makeSeries(0, 0, 2));

  // GPS — just show latest value, no chart needed
  const [gps, setGps] = useState({ lat: null, lon: null });

  const doReset = () => {
    setAlt(makeSeries(0, 0, 2));
    setTemp(makeSeries(0, 0, 2));
    setPressure(makeSeries(0, 0, 2));
    setHumidity(makeSeries(0, 0, 2));
    setAccelX(makeSeries(0, 0, 2));
    setAccelY(makeSeries(0, 0, 2));
    setLight(makeSeries(0, 0, 2));
    setVoltage(makeSeries(0, 0, 2));
    setGyroX(makeSeries(0, 0, 2));
    setCurrent(makeSeries(0, 0, 2));
    setGps({ lat: null, lon: null });
    setElapsed(0);
    setPhase("STANDBY");
    setError(null);
  };

  // ── WebSocket connection ──────────────────────────────────────────────────
  const connect = () => {
    if (wsRef.current) wsRef.current.close();
    setError(null);

   const ws = new WebSocket("ws://127.0.0.1:4443");
    wsRef.current = ws;

    ws.onopen = () => {
      setConnected(true);
      setIsLive(true);
      setPhase("ASCENT");
    };

    const connect = () => {
  if (wsRef.current) {
    wsRef.current.close();
    wsRef.current = null;
  }
  setError(null);
  setConnected(false);

  // Small delay so previous connection fully closes
  setTimeout(() => {
    const ws = new WebSocket("ws://localhost:4443");
    wsRef.current = ws;

    ws.onopen = () => {
      setConnected(true);
      setIsLive(true);
      setPhase("ASCENT");
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        bufferRef.current.push(data);
      } catch (_) {}
    };

    ws.onerror = () => {
      setError("Cannot reach server — make sure server.py is running on port 4443");
      setConnected(false);
      setIsLive(false);
      setPhase("STANDBY");
    };

    ws.onclose = () => {
      setConnected(false);
      setIsLive(false);
      if (phase !== "STANDBY") setPhase("LANDED");
    };
  }, 100);
};

    // Buffer ALL 50 packets/sec
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        bufferRef.current.push(data);
      } catch (_) {}
    };

    ws.onerror = () => {
      setError("Cannot reach server — make sure server.py is running on port 4443");
      setConnected(false);
      setIsLive(false);
      setPhase("STANDBY");
    };

    ws.onclose = () => {
      setConnected(false);
      setIsLive(false);
      setPhase("LANDED");
    };
  };

  const disconnect = () => {
    if (wsRef.current) wsRef.current.close();
    setIsLive(false);
    setConnected(false);
    setPhase("STANDBY");
  };

  // ── Throttled render — update charts at 5fps regardless of incoming rate ─
  useEffect(() => {
    if (!isLive) {
      if (renderRef.current) clearInterval(renderRef.current);
      if (elapsedRef.current) clearInterval(elapsedRef.current);
      return;
    }

    // Elapsed counter
    elapsedRef.current = setInterval(() => setElapsed(e => e + 1), 1000);

    // Chart update — 5 times per second (200ms)
    renderRef.current = setInterval(() => {
      if (bufferRef.current.length === 0) return;

      // Take latest packet from buffer
      const data = bufferRef.current[bufferRef.current.length - 1];
      bufferRef.current = [];

      // Map server.py fields to charts
      if (data.altitude !== undefined) {
  const realAlt = +(data.altitude / 10).toFixed(1);
  setAlt(prev => [...prev.slice(-(MAX_PTS - 1)), { t: "now", v: realAlt }]);
  // Phase detection using real altitude
  if (realAlt >= 990) setPhase("DESCENT");
  else if (realAlt <= 2 && realAlt > 0) setPhase("LANDED");
  else if (realAlt > 2) setPhase("ASCENT");
}
      if (data.temperature !== undefined)
        setTemp(prev => [...prev.slice(-(MAX_PTS - 1)), { t: "now", v: +data.temperature.toFixed(1) }]);
      if (data.pressure !== undefined)
        setPressure(prev => [...prev.slice(-(MAX_PTS - 1)), { t: "now", v: +data.pressure.toFixed(1) }]);
      if (data.humidity !== undefined)
        setHumidity(prev => [...prev.slice(-(MAX_PTS - 1)), { t: "now", v: +data.humidity.toFixed(1) }]);
      if (data.acceleration !== undefined) {
        setAccelX(prev => [...prev.slice(-(MAX_PTS - 1)), { t: "now", v: +data.acceleration[0].toFixed(2) }]);
        setAccelY(prev => [...prev.slice(-(MAX_PTS - 1)), { t: "now", v: +data.acceleration[1].toFixed(2) }]);
      }
      if (data["Luminous Intensity"] !== undefined)
        setLight(prev => [...prev.slice(-(MAX_PTS - 1)), { t: "now", v: +data["Luminous Intensity"].toFixed(0) }]);
      if (data.voltage !== undefined)
        setVoltage(prev => [...prev.slice(-(MAX_PTS - 1)), { t: "now", v: +data.voltage.toFixed(1) }]);
      if (data.Gyro !== undefined)
        setGyroX(prev => [...prev.slice(-(MAX_PTS - 1)), { t: "now", v: +data.Gyro[0].toFixed(2) }]);
      if (data.current !== undefined)
        setCurrent(prev => [...prev.slice(-(MAX_PTS - 1)), { t: "now", v: +data.current.toFixed(1) }]);
      if (data["GPS Lattitude"] !== undefined)
        setGps({ lat: data["GPS Lattitude"], lon: data["GPS Longitude"] });

    }, 1000);

    return () => {
      clearInterval(renderRef.current);
      clearInterval(elapsedRef.current);
    };
  }, [isLive]);

  // Cleanup on unmount
  useEffect(() => () => { if (wsRef.current) wsRef.current.close(); }, []);

  // ── Latest values ─────────────────────────────────────────────────────────
  const L = {
    alt:      alt[alt.length - 1]?.v.toFixed(1),
    temp:     temp[temp.length - 1]?.v.toFixed(1),
    pressure: pressure[pressure.length - 1]?.v.toFixed(1),
    humidity: humidity[humidity.length - 1]?.v.toFixed(1),
    accelX:   accelX[accelX.length - 1]?.v.toFixed(2),
    accelY:   accelY[accelY.length - 1]?.v.toFixed(2),
    light:    light[light.length - 1]?.v.toFixed(0),
    voltage:  voltage[voltage.length - 1]?.v.toFixed(1),
    gyroX:    gyroX[gyroX.length - 1]?.v.toFixed(2),
    current:  current[current.length - 1]?.v.toFixed(1),
  };

  const phaseCol = { ASCENT: C.green, DESCENT: C.accent, LANDED: C.blue, STANDBY: C.muted };
  const pCol = phaseCol[phase] || C.muted;

  const topCards = [
    { label: "Altitude",    val: L.alt,      unit: "m",   color: C.green,        icon: "↑" },
    { label: "Temperature", val: L.temp,     unit: "°C",  color: "#FF6B6B",      icon: "🌡" },
    { label: "Pressure",    val: L.pressure, unit: "Pa",  color: C.blue,         icon: "⬤" },
    { label: "Voltage",     val: L.voltage,  unit: "mV",  color: C.yellow,       icon: "⚡" },
  ];

  const subCharts = [
    { label: "Temperature",       data: temp,     color: "#FF6B6B",   unit: "°C",  val: L.temp     },
    { label: "Pressure",          data: pressure, color: C.blue,      unit: "Pa",  val: L.pressure },
    { label: "Humidity",          data: humidity, color: C.cyan,      unit: "%",   val: L.humidity },
    { label: "Accel X",           data: accelX,   color: C.yellow,    unit: "",    val: L.accelX   },
    { label: "Accel Y",           data: accelY,   color: C.accentSoft,unit: "",    val: L.accelY   },
    { label: "Light Intensity",   data: light,    color: "#FFD700",   unit: "lux", val: L.light    },
    { label: "Voltage",           data: voltage,  color: C.yellow,    unit: "mV",  val: L.voltage  },
    { label: "Gyro X",            data: gyroX,    color: C.purple,    unit: "",    val: L.gyroX    },
    { label: "Current",           data: current,  color: C.green,     unit: "mA",  val: L.current  },
  ];

  return (
    <section style={{ padding: "90px clamp(14px,4vw,60px)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>

        {/* ── Header ── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16, marginBottom: 36 }}>
          <div>
            <SLabel text="Live Telemetry Dashboard" />
            <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(26px,3.6vw,50px)", fontWeight: 800, color: C.white, margin: "0 0 8px" }}>
              Mission <span style={{ color: C.accent }}>Data Stream</span>
            </h2>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: C.muted }}>
              Real-time sensor data · WebSocket · Port 4443 · 50 Hz incoming · 5 Hz rendered
            </p>
          </div>

          {/* Controls */}
          <div style={{ display: "flex", flexDirection: "column", gap: 9, minWidth: 220 }}>
            {/* Status chip */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 14px", background: C.bgCard, border: `1px solid ${pCol}44`, borderRadius: 8 }}>
              <div className="live-dot" style={{ width: 7, height: 7, borderRadius: "50%", background: connected ? pCol : C.muted, flexShrink: 0 }} />
              <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: connected ? pCol : C.muted, letterSpacing: 1 }}>
                {connected ? `● ${phase}` : "○ DISCONNECTED"}
              </span>
              <div style={{ marginLeft: "auto", fontFamily: "'Space Mono',monospace", fontSize: 9, color: C.muted }}>T+{elapsed}s</div>
            </div>

            {/* Buttons */}
            <div style={{ display: "flex", gap: 8 }}>
              {!connected ? (
                <button onClick={connect} style={{ flex: 1, padding: "8px 10px", borderRadius: 6, border: `1px solid ${C.green}88`, background: "transparent", color: C.green, fontFamily: "'Space Mono',monospace", fontSize: 9, cursor: "pointer", letterSpacing: .8 }}>
                  ▶ Connect
                </button>
              ) : (
                <button onClick={disconnect} style={{ flex: 1, padding: "8px 10px", borderRadius: 6, border: `1px solid ${C.red}88`, background: "transparent", color: C.red, fontFamily: "'Space Mono',monospace", fontSize: 9, cursor: "pointer", letterSpacing: .8 }}>
                  ■ Disconnect
                </button>
              )}
              <button onClick={doReset} style={{ flex: 1, padding: "8px 10px", borderRadius: 6, border: `1px solid ${C.border}`, background: "transparent", color: C.muted, fontFamily: "'Space Mono',monospace", fontSize: 9, cursor: "pointer", letterSpacing: .8 }}>
                ↺ Reset
              </button>
            </div>
          </div>
        </div>

        {/* ── Error banner ── */}
        {error && (
          <div style={{ marginBottom: 20, padding: "12px 16px", background: C.red + "12", border: `1px solid ${C.red}44`, borderRadius: 8, fontFamily: "'Space Mono',monospace", fontSize: 11, color: C.red }}>
            ⚠ {error}
          </div>
        )}

        {/* ── Not connected placeholder ── */}
        {!connected && !error && (
          <div style={{ textAlign: "center", padding: "60px 20px", background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 12, marginBottom: 24 }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>🛰️</div>
            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 20, fontWeight: 700, color: C.white, marginBottom: 8 }}>Awaiting Connection</div>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: C.muted, marginBottom: 24 }}>
              Make sure <span style={{ color: C.white, fontFamily: "'Space Mono',monospace" }}>server.py</span> is running on port 4443, then click Connect.
            </p>
            <button onClick={connect} style={{ padding: "11px 28px", background: C.accent, border: "none", borderRadius: 6, color: "#fff", fontFamily: "'Space Mono',monospace", fontSize: 11, letterSpacing: 1, cursor: "pointer", boxShadow: `0 4px 20px ${C.accent}44` }}>
              ▶ Connect to Server
            </button>
          </div>
        )}

        {/* ── Live data UI (only shown when connected) ── */}
        {connected && (
          <>
            {/* Top summary cards */}
            <div className="tele-top-row" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
              {topCards.map(s => (
                <HoverCard key={s.label} glowColor={s.color + "55"} style={{ padding: "14px 15px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: s.color + "18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, flexShrink: 0 }}>{s.icon}</div>
                    <div>
                      <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 9, color: C.muted, letterSpacing: 1.4, marginBottom: 3, textTransform: "uppercase" }}>{s.label}</div>
                      <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(15px,1.8vw,21px)", fontWeight: 700, color: s.color }}>{s.val}<span style={{ fontSize: 10, color: C.muted, marginLeft: 3 }}>{s.unit}</span></div>
                    </div>
                  </div>
                </HoverCard>
              ))}
            </div>

            {/* GPS row */}
            {gps.lat !== null && (
              <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
                <div style={{ flex: 1, background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 8, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 16 }}>📍</span>
                  <div>
                    <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 9, color: C.muted, letterSpacing: 1.5, marginBottom: 3 }}>GPS LATITUDE</div>
                    <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 18, fontWeight: 700, color: C.cyan }}>{gps.lat}</div>
                  </div>
                </div>
                <div style={{ flex: 1, background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 8, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 16 }}>📍</span>
                  <div>
                    <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 9, color: C.muted, letterSpacing: 1.5, marginBottom: 3 }}>GPS LONGITUDE</div>
                    <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 18, fontWeight: 700, color: C.cyan }}>{gps.lon}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Main Altitude chart */}
            <HoverCard glowColor={C.green + "44"} style={{ padding: "22px 22px 14px", marginBottom: 18 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 10 }}>
                <div>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 16, fontWeight: 700, color: C.white }}>Altitude — Time Series</div>
                  <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: C.muted }}>Primary mission parameter: ascent & descent arc</div>
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <Badge color={C.green}>Current: {L.alt} m</Badge>
                  <Badge color={pCol}>{phase}</Badge>
                </div>
              </div>
              <LineChart data={alt} color={C.green} unit="m" label="Altitude" height={180} />
            </HoverCard>

            {/* Secondary charts 3-column */}
            <div className="tele-secondary" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
              {subCharts.map(ch => (
                <HoverCard key={ch.label} glowColor={ch.color + "44"} style={{ padding: "16px 16px 10px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                    <div>
                      <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 9, color: C.muted, letterSpacing: 1.4, textTransform: "uppercase", marginBottom: 3 }}>{ch.label}</div>
                      <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 20, fontWeight: 700, color: ch.color }}>{ch.val}<span style={{ fontSize: 11, color: C.muted, marginLeft: 3 }}>{ch.unit}</span></div>
                    </div>
                  </div>
                  <LineChart data={ch.data} color={ch.color} unit={ch.unit} label={ch.label} height={140} />
                </HoverCard>
              ))}
            </div>

            {/* Raw packet readout */}
            <div style={{ marginTop: 16, background: C.bgCardAlt, border: `1px solid ${C.border}`, borderRadius: 8, padding: "12px 16px", fontFamily: "'Space Mono',monospace", fontSize: 11, color: C.green, overflowX: "auto", whiteSpace: "nowrap" }}>
              <span style={{ color: C.muted, marginRight: 10 }}>PACKET ›</span>
              ALT:{L.alt}m · TMP:{L.temp}°C · PRE:{L.pressure}Pa · HUM:{L.humidity}% · AX:{L.accelX} · AY:{L.accelY} · LUX:{L.light} · V:{L.voltage}mV · GX:{L.gyroX} · I:{L.current}mA · T+{elapsed}s · {phase}
            </div>
          </>
        )}

      </div>
    </section>
  );
}
// ─── SECTION: TIMELINE( WILL BE UPDATED AS THE PROJECT PROGRESSES,  SYLVESTER WILL KEEP US UPDATED) ───────────────────────────────────────────────────────
function TimelineSection() {
  const phases = [
    { week: "Week 1", dates: "Mar 2–8", phase: "Architecture Finalization", status: "complete", tasks: ["System block diagram", "Subsystem interfaces", "Mass & power budget", "Mechanical CAD begin", "Component procurement"], del: "Finalized architecture, mass/power budget, preliminary CAD" },
    { week: "Week 2", dates: "Mar 9–15", phase: "Preliminary Validation & SRR", status: "complete", tasks: ["Conduct SRR", "Sensor/power/telemetry bench testing", "Validate data paths", "Refine risk register"], del: "SRR report, subsystem test logs, updated risk register" },
    { week: "Week 3", dates: "Mar 16–22", phase: "Design Freeze & CDR", status: "active", tasks: ["PDR & initial CDR", "Validate schematics & PCB", "Approve mechanical CAD", "Freeze architecture"], del: "CDR report, approved CAD, frozen architecture baseline" },
    { week: "Week 4", dates: "Mar 23–29", phase: "Prototype Build & Integration", status: "upcoming", tasks: ["Assemble avionics stack", "Develop & test firmware", "Establish telemetry link", "Integrate payload & power"], del: "Working integrated prototype, firmware test results" },
    { week: "Week 5", dates: "Mar 30–Apr 5", phase: "Field Testing & Qualification", status: "upcoming", tasks: ["Full mission simulation", "Drop & descent rate tests", "Power endurance testing", "Telemetry range testing"], del: "Field test report, performance validation data" },
    { week: "Week 6", dates: "Apr 6–11", phase: "Final Testing & FRR", status: "upcoming", tasks: ["Conduct TRR", "Final integrated system test", "Conduct FRR", "Finalize launch checklist"], del: "TRR/FRR approval, final system sign-off" },
    { week: "Launch Day", dates: "Apr 12, 2026", phase: "Launch & Post-Flight", status: "launch", tasks: ["Execute launch", "Monitor live telemetry", "Recover CanSat", "Begin post-flight analysis"], del: "Flight data package, initial analysis report" },
  ];
  const sc = { complete: C.green, active: C.accent, upcoming: C.muted, launch: C.yellow };
  const sl = { complete: "✓ Complete", active: "● In Progress", upcoming: "○ Upcoming", launch: "🚀 Launch" };

  return (
    <section style={{ padding: "90px clamp(14px,4vw,60px)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 50 }}>
          <SLabel text="Engineering Timeline" />
          <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(26px,3.6vw,50px)", fontWeight: 800, color: C.white, margin: "0 0 12px" }}>6-Week Sprint to <span style={{ color: C.accent }}>Launch</span></h2>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, color: C.muted, maxWidth: 480, margin: "0 auto" }}>A milestone-driven schedule from architecture freeze to flight day.</p>
        </div>
        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", left: 21, top: 0, bottom: 0, width: 2, background: `linear-gradient(180deg,${C.accent},${C.blue},${C.yellow})`, opacity: .3 }} />
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {phases.map(p => {
              const color = sc[p.status];
              return (
                <div key={p.week} style={{ display: "flex", gap: 26, paddingBottom: 24 }}>
                  <div style={{ flexShrink: 0, width: 44, display: "flex", justifyContent: "center", paddingTop: 7 }}>
                    <div style={{ width: 15, height: 15, borderRadius: "50%", background: p.status === "complete" ? color : C.bg, border: `2px solid ${color}`, boxShadow: (p.status === "active" || p.status === "launch") ? `0 0 12px ${color}` : "none", zIndex: 1 }} />
                  </div>
                  <div style={{ flex: 1, background: C.bgCard, border: `1px solid ${(p.status === "active" || p.status === "launch") ? color + "66" : C.border}`, borderRadius: 10, padding: "17px 20px", transition: "border-color .3s" }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = color + "88"}
                    onMouseLeave={e => e.currentTarget.style.borderColor = (p.status === "active" || p.status === "launch") ? color + "66" : C.border}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginBottom: 9 }}>
                      <div>
                        <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 9, color, letterSpacing: 2, marginBottom: 3 }}>{p.week} · {p.dates}</div>
                        <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 16, fontWeight: 700, color: C.white }}>{p.phase}</div>
                      </div>
                      <Badge color={color}>{sl[p.status]}</Badge>
                    </div>
                    <div className="tl-detail-grid" style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 12, alignItems: "start" }}>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                        {p.tasks.map(t => <span key={t} style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: C.muted, background: C.bgCardAlt, padding: "3px 9px", borderRadius: 4 }}>{t}</span>)}
                      </div>
                      <div style={{ minWidth: 170 }}>
                        <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 9, color: C.muted, letterSpacing: 1, marginBottom: 5, textTransform: "uppercase" }}>Deliverables</div>
                        <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: C.white, lineHeight: 1.6 }}>{p.del}</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── SECTION: TEAM ( TEAM SECTION NOT COMPLETED DUE TO LACK OF INFO FROM OTHER DEPARTMENTS)───────────────────────────────────────────────────────────
function TeamSection() {
  const teams = [
  {
    name: "Project Leadership", color: C.accent,
    members: [
      { name: "Sylvester Agose", role: "Project Lead", bio: "Overall technical authority, integration oversight, milestone approval and external coordination." },
      { name: "Yusuf Atolagbe", role: "Co-Lead", bio: "Subsystem alignment, schedule adherence and review preparation." },
    ]
  },
  {
    name: "Software / Visualisation", color: C.blue,
    members: [
      { name: "MURAINA DAVID", role: "Backend & Visualization", bio: "Backend architecture, live telemetry data pipeline, real-time visualization and ground station software development." },
      { name: "RAJI ABDULLAH OPEYEMI", role: "Frontend & Graphics", bio: "Frontend architecture, UI/UX design, mission dashboard, live telemetry display and graphics development." },
      { name: "CHIBUEZE VICTORY", role: "Frontend", bio: "Mission dashboard, live telemetry display." },
    ]
  },
  {
    name: "Design / CAD", color: C.purple,
    members: [
      { name: "Praise Omgbrumaye", role: "Team Lead" },
      { name: "Adekoya Eniola", role: "Member" },
      { name: "Kehinde Fodunrin", role: "Member" },
      { name: "Elisha Bello", role: "Member" },
    ]
  },
  {
    name: "Hardware / IoT", color: C.green,
    members: [
      { name: "Yusuf Atolagbe", role: "Team Lead" },
      { name: "Favour Obama", role: "Member" },
    ]
  },
  {
    name: "Research & Documentation", color: C.yellow,
    members: [
      { name: "Judith Oluchi", role: "Team Lead" },
      { name: "Odoziaku Stephen", role: "Member" },
      { name: "Abdurrauf Salahudeen", role: "Member" },
      { name: "Azeezat Ogunjobi", role: "Member" },
    ]
  },
  {
    name: "Project & Event Management", color: C.cyan,
    members: [
      { name: "Fasasi Sulaimon", role: "Team Lead" },
      { name: "Ojo Nihinlolawa", role: "Member" },
      { name: "Igbokwe Chisom", role: "Member" },
      { name: "Oregbesan Godsfavour", role: "Member" },
    ]
  },
];
  return (
    <section style={{ padding: "90px clamp(14px,4vw,60px)", background: `linear-gradient(180deg,transparent,${C.bgCardAlt}33,transparent)` }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 44 }}>
          <SLabel text="Project Team" />
          <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(26px,3.6vw,50px)", fontWeight: 800, color: C.white, margin: "0 0 12px" }}>The People Behind <span style={{ color: C.accent }}>the Mission</span></h2>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, color: C.muted, maxWidth: 480, margin: "0 auto" }}>Five functional teams under unified project leadership.</p>
        </div>
        <div className="team-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 18, marginBottom: 44 }}>
          {teams.map(team => (
            <div key={team.name} style={{ background: C.bgCard, border: `1px solid ${team.color}33`, borderRadius: 12, overflow: "hidden" }}>
              <div style={{ padding: "13px 17px", borderBottom: `1px solid ${team.color}22`, background: team.color + "0A", display: "flex", alignItems: "center", gap: 9 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: team.color, boxShadow: `0 0 8px ${team.color}` }} />
                <span style={{ fontFamily: "'Syne',sans-serif", fontSize: 13, fontWeight: 700, color: team.color }}>{team.name}</span>
              </div>
{team.members.map(m => (
  <div key={m.name} style={{ padding: "15px 17px", borderBottom: `1px solid ${C.border}` }}>
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: m.bio ? 7 : 0 }}>
      <div style={{ width: 32, height: 32, borderRadius: "50%", background: team.color + "18", border: `1px solid ${team.color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Syne',sans-serif", fontSize: 13, fontWeight: 700, color: team.color, flexShrink: 0 }}>
        {m.name.charAt(0)}
      </div>
      <div>
        <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 13, fontWeight: 600, color: C.white }}>{m.name}</div>
        <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 9, color: team.color, letterSpacing: .8, textTransform: "uppercase" }}>{m.role}</div>
      </div>
    </div>
    {m.bio && (
      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: C.muted, lineHeight: 1.7, margin: 0 }}>{m.bio}</p>
    )}
  </div>
))}
            </div>
          ))}
        </div>
        {/* CTA */}
        <div style={{ textAlign: "center", padding: "clamp(24px,4vw,48px)", background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 16 }}>
          <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(18px,2.6vw,28px)", fontWeight: 800, color: C.white, marginBottom: 10 }}>Want to support EkoSat-1?</div>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, color: C.muted, maxWidth: 440, margin: "0 auto 26px" }}>Sponsorships, donations, and institutional partnerships are open. Help us put Nigeria's first student CanSat in the sky.</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="https://www.spaceclubslasu.org/donate" style={{ padding: "13px 28px", background: C.accent, borderRadius: 6, color: "#fff", textDecoration: "none", fontFamily: "'Space Mono',monospace", fontSize: 11, letterSpacing: 1, boxShadow: `0 4px 18px ${C.accent}44` }}>Donate to the Mission</a>
            <a href="https://www.spaceclubslasu.org/join" style={{ padding: "13px 28px", background: "transparent", borderRadius: 6, color: C.white, textDecoration: "none", fontFamily: "'Space Mono',monospace", fontSize: 11, letterSpacing: 1, border: `1px solid ${C.border}` }}>Join the Club</a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function CanSatPage() {
  const [activeTab, setActiveTab] = useState("Overview");
  const sections = {
    Overview: OverviewSection,
    Mission: MissionSection,
    Systems: SystemsSection,
    Telemetry: TelemetrySection,
    Timeline: TimelineSection,
    Team: TeamSection,
  };
  const ActiveSection = sections[activeTab] || OverviewSection;
  return (
    <>
      <GlobalStyles />
      <div style={{ minHeight: "100vh", background: C.bg, position: "relative" }}>
        <StarField />
        <div style={{ position: "relative", zIndex: 1 }}>
          <CanSatNav active={activeTab} setActive={setActiveTab} />
          <main key={activeTab} className="cansat-fade">
            <ActiveSection />
          </main>
          <footer style={{ borderTop: `1px solid ${C.border}`, padding: "22px clamp(14px,4vw,60px)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.accent }} />
              <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: C.muted }}>EKOSAT-1 — SPACE CLUBS LASU</span>
            </div>
            <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 9, color: C.muted }}>Target Launch: April 12, 2026</span>
            <a href="https://www.spaceclubslasu.org" style={{ fontFamily: "'Space Mono',monospace", fontSize: 9, color: C.muted, textDecoration: "none" }}>← spaceclubslasu.org</a>
          </footer>
        </div>
      </div>
    </>
  );
}
