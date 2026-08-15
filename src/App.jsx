import React, { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, CartesianGrid,
} from "recharts";
import {
  CheckCircle2, XCircle, AlertTriangle, ChevronRight, ChevronLeft,
  Building2, ClipboardCheck, LayoutDashboard, ExternalLink, Lock,
  LogOut, Sparkles, Loader2, Info,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Design tokens
// ---------------------------------------------------------------------------
const COLORS = {
  gold: "#FABE3F",
  goldDark: "#E0A62A",
  goldSoft: "#FDE7B8",
  ink: "#0A0A0B",
  paper: "#FFFFFF",
  stone: "#F6F5F2",
  line: "#E4E2DD",
  slate: "#55565B",
  slateLight: "#8B8C90",
  good: "#3E7D5B",
  goodBg: "#E9F3ED",
  warn: "#B5651D",
  warnBg: "#FBEEE2",
  bad: "#A23E3E",
  badBg: "#F6E9E9",
  aiBg: "#F1EBFF",
  aiText: "#5B3FA8",
};

const RUBRIC = [
  { key: "techReadiness", label: "Technology Readiness (Automation, Robotics & AI)", weight: 20,
    help: "How clear and significant is the automation, robotics, or AI adoption gap this project would close?" },
  { key: "impact", label: "Projected Impact (jobs + growth)", weight: 25,
    help: "Expected job creation/retention and measurable business growth." },
  { key: "feasibility", label: "Project Feasibility & Scope Clarity", weight: 20,
    help: "Is the proposed project realistically scoped for the program window?" },
  { key: "sustainability", label: "Financial Sustainability Post-Grant", weight: 15,
    help: "Can the company sustain and build on the improvement after services end?" },
  { key: "alignment", label: "Sector / Regional Alignment", weight: 10,
    help: "Fit with Michigan manufacturing priorities and program focus areas." },
  { key: "serviceFit", label: "Service Fit", weight: 10,
    help: "Clarity on which subrecipient/service type best matches the stated need." },
];

const SUBRECIPIENTS = [
  "University engineering institute",
  "Statewide manufacturing association",
  "Nonprofit technology center",
  "Not sure — help me determine fit",
];

const AUTOMATION_LEVELS = [
  "None — fully manual process today",
  "Basic — some standalone automation or robotic equipment",
  "Intermediate — partially integrated automation, robotics, or data systems",
  "Advanced — highly automated/AI-enabled, seeking optimization",
];

const TECH_FOCUS_OPTIONS = [
  "Automation",
  "Robotics",
  "Artificial Intelligence (AI)",
];

const TIMELINES = ["Less than 3 months", "3–6 months", "6–12 months", "12+ months"];

const PRIMARY_GOALS = [
  "Reduce labor costs",
  "Improve product quality",
  "Increase production capacity",
  "Improve worker safety",
  "Other",
];

const TARGET_COMPANIES = 240;

const STATUS_META = {
  Submitted: { color: COLORS.slate, bg: "#EFEFEE" },
  "Under Review": { color: COLORS.warn, bg: COLORS.warnBg },
  Scored: { color: "#1D5C8C", bg: "#E6EFF6" },
  Awarded: { color: COLORS.good, bg: COLORS.goodBg },
  Declined: { color: COLORS.bad, bg: COLORS.badBg },
};

// ---------------------------------------------------------------------------
// Seed data
// ---------------------------------------------------------------------------
const seedApplications = () => [
  {
    ref: "MAMAP-2026-0001", company: "Kettering Precision Tool", contact: "Dana Ruiz",
    email: "dana@ketteringprecision.example", employees: 38, revenue: 6200000,
    activity: "Precision CNC tooling for automotive suppliers",
    need: "Robotic pick-and-place to reduce manual handling on the finishing line.",
    techFocus: ["Automation", "Robotics"],
    interest: "University engineering institute", status: "Awarded",
    jobsImpact: 6, automationLevel: AUTOMATION_LEVELS[1], timeline: TIMELINES[1],
    primaryGoal: PRIMARY_GOALS[2], sustainPlan: "Reinvesting labor savings into a second line upgrade in year two.",
    scores: { techReadiness: 4, impact: 5, feasibility: 4, sustainability: 4, alignment: 5, serviceFit: 4 },
    notes: "Strong fit — clear ROI case and realistic 6-month implementation plan.",
    aiRationale: null,
  },
  {
    ref: "MAMAP-2026-0002", company: "Wolverine Sheet Metal", contact: "Marcus Webb",
    email: "marcus@wolverinesheet.example", employees: 112, revenue: 18500000,
    activity: "Custom sheet metal fabrication",
    need: "Predictive maintenance sensors on 6 stamping presses.",
    techFocus: ["Automation", "Artificial Intelligence (AI)"],
    interest: "Nonprofit technology center", status: "Scored",
    jobsImpact: 3, automationLevel: AUTOMATION_LEVELS[1], timeline: TIMELINES[2],
    primaryGoal: PRIMARY_GOALS[1], sustainPlan: "Maintenance team will own sensor upkeep; budget already allocated.",
    scores: { techReadiness: 4, impact: 3, feasibility: 3, sustainability: 4, alignment: 4, serviceFit: 3 },
    notes: "Solid application. Scope is a little broad for the timeline — flag in committee.",
    aiRationale: null,
  },
  {
    ref: "MAMAP-2026-0003", company: "Great Lakes Composite Works", contact: "Priya Nandan",
    email: "priya@glcomposite.example", employees: 24, revenue: 3100000,
    activity: "Carbon-fiber components for aerospace subassemblies",
    need: "Quality inspection automation using machine vision.",
    techFocus: ["Artificial Intelligence (AI)", "Automation"],
    interest: "University engineering institute", status: "Under Review",
    jobsImpact: 4, automationLevel: AUTOMATION_LEVELS[0], timeline: TIMELINES[1],
    primaryGoal: PRIMARY_GOALS[1], sustainPlan: "Plan to train two QA staff as in-house system owners.",
    scores: null, notes: "", aiRationale: null,
  },
  {
    ref: "MAMAP-2026-0004", company: "Saginaw Valley Fastener Co.", contact: "Tom Okafor",
    email: "tom@svfastener.example", employees: 640, revenue: 92000000,
    activity: "High-volume fastener manufacturing",
    need: "Full production-line digital twin.",
    techFocus: ["Artificial Intelligence (AI)", "Automation", "Robotics"],
    interest: "Statewide manufacturing association", status: "Declined",
    jobsImpact: 2, automationLevel: AUTOMATION_LEVELS[2], timeline: TIMELINES[3],
    primaryGoal: PRIMARY_GOALS[2], sustainPlan: "Unclear — not addressed in application.",
    scores: { techReadiness: 3, impact: 3, feasibility: 2, sustainability: 3, alignment: 2, serviceFit: 2 },
    notes: "Employee count is above the SBA small-business threshold for this NAICS code — ineligible.",
    aiRationale: null,
  },
  {
    ref: "MAMAP-2026-0005", company: "Flint Robotics Supply", contact: "Angela Torres",
    email: "angela@flintrobotics.example", employees: 57, revenue: 9800000,
    activity: "Robotic end-effector manufacturing",
    need: "MES integration to connect floor equipment to ERP.",
    techFocus: ["Automation", "Robotics"],
    interest: "Nonprofit technology center", status: "Submitted",
    jobsImpact: 5, automationLevel: AUTOMATION_LEVELS[1], timeline: TIMELINES[2],
    primaryGoal: PRIMARY_GOALS[2], sustainPlan: "IT lead identified to maintain integration post-launch.",
    scores: null, notes: "", aiRationale: null,
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function currency(n) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

function weightedTotal(scores) {
  if (!scores) return 0;
  return RUBRIC.reduce((sum, c) => sum + (scores[c.key] / 5) * c.weight, 0);
}

function recommendation(total) {
  if (total >= 75) return { label: "Recommend Award", color: COLORS.good, bg: COLORS.goodBg };
  if (total >= 55) return { label: "Conditional — Discuss", color: COLORS.warn, bg: COLORS.warnBg };
  return { label: "Recommend Decline", color: COLORS.bad, bg: COLORS.badBg };
}

function eligibilityCheck(employees, revenue) {
  // Simplified proxy only — real determination is per-NAICS via the SBA Size Standards Tool.
  const emp = Number(employees);
  if (!emp) return null;
  if (emp <= 500) return "eligible";
  if (emp <= 1500) return "verify";
  return "ineligible";
}

async function fetchAiSuggestion(app) {
  const prompt = `You are assisting a grant program manager in reviewing a manufacturer's application for a Michigan automation-adoption technical assistance program. Score the application against these six criteria, each 1-5 (1=weak, 5=strong), based only on the information given. Respond with ONLY raw JSON, no markdown fences, no preamble, matching exactly this schema:
{"techReadiness":{"score":1,"rationale":"one short sentence"},"impact":{"score":1,"rationale":"..."},"feasibility":{"score":1,"rationale":"..."},"sustainability":{"score":1,"rationale":"..."},"alignment":{"score":1,"rationale":"..."},"serviceFit":{"score":1,"rationale":"..."}}

Criteria definitions:
${RUBRIC.map((c) => `- ${c.key}: ${c.label} — ${c.help}`).join("\n")}

Application:
Company: ${app.company}
Employees: ${app.employees}, Annual revenue: ${app.revenue}
Activity: ${app.activity}
Stated automation/robotics/AI need: ${app.need}
Technology focus area(s): ${(app.techFocus || []).join(", ") || "not specified"}
Current automation/robotics/AI maturity level: ${app.automationLevel}
Primary goal: ${app.primaryGoal}
Expected jobs created/retained: ${app.jobsImpact}
Implementation timeline: ${app.timeline}
Post-grant sustainability plan: ${app.sustainPlan}
Interested service type: ${app.interest}`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 7000);
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1000,
        messages: [{ role: "user", content: prompt }],
      }),
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`API returned ${response.status}`);
    const data = await response.json();
    const text = (data.content || [])
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("\n")
      .replace(/```json|```/g, "")
      .trim();
    const parsed = JSON.parse(text);
    return { source: "live", result: parsed };
  } finally {
    clearTimeout(timeout);
  }
}

// Deterministic, transparent fallback used whenever a live AI connection isn't
// available (e.g. this app hosted as a static site with no backend/API key).
// Not a guess dressed up as AI — every rule is visible in this function.
function localHeuristicSuggestion(app) {
  const levelIndex = Math.max(0, AUTOMATION_LEVELS.indexOf(app.automationLevel));
  const techCount = (app.techFocus || []).length;
  const timelineIndex = Math.max(0, TIMELINES.indexOf(app.timeline));
  const planLen = (app.sustainPlan || "").trim().length;
  const jobs = Number(app.jobsImpact) || 0;

  const clamp = (n) => Math.max(1, Math.min(5, Math.round(n)));

  const scores = {
    techReadiness: clamp(2 + levelIndex * 0.6 + Math.min(techCount, 3) * 0.4),
    impact: clamp(jobs >= 10 ? 5 : jobs >= 6 ? 4 : jobs >= 3 ? 3 : jobs >= 1 ? 2 : 1),
    feasibility: clamp([4, 5, 4, 2][timelineIndex] ?? 3),
    sustainability: clamp(planLen > 80 ? 4 : planLen > 30 ? 3 : planLen > 0 ? 2 : 1),
    alignment: clamp(app.employees >= 10 && app.employees <= 300 ? 5 : app.employees < 10 ? 3 : 3),
    serviceFit: clamp(app.interest && !app.interest.startsWith("Not sure") ? 4 : 2),
  };

  const rationale = {
    techReadiness: `Estimated from a "${app.automationLevel}" maturity level and ${techCount} technology area(s) selected.`,
    impact: `Estimated from ${jobs || 0} stated jobs created/retained.`,
    feasibility: `Estimated from a "${app.timeline}" implementation timeline.`,
    sustainability: planLen > 0 ? "Estimated from the length and specificity of the sustainability plan provided." : "No sustainability plan text provided.",
    alignment: `Estimated from company size (${app.employees} employees).`,
    serviceFit: app.interest && !app.interest.startsWith("Not sure") ? `Applicant specified an interested service (${app.interest}).` : "Applicant did not specify a preferred service type.",
  };

  const out = {};
  RUBRIC.forEach((c) => { out[c.key] = { score: scores[c.key], rationale: rationale[c.key] }; });
  return { source: "heuristic", result: out };
}

// ---------------------------------------------------------------------------
// Shared UI bits
// ---------------------------------------------------------------------------
function Logo({ mode = "dark" }) {
  const fg = mode === "dark" ? COLORS.paper : COLORS.ink;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <svg width="26" height="26" viewBox="0 0 100 100" fill="none">
        <path d="M16 10 H58 L84 36 V90 H68 V52 L16 52 Z M16 52 H68 V90 H16 Z" fill={COLORS.gold} />
        <rect x="16" y="24" width="34" height="14" fill={mode === "dark" ? COLORS.ink : COLORS.paper} />
        <rect x="30" y="64" width="26" height="14" fill={mode === "dark" ? COLORS.ink : COLORS.paper} />
      </svg>
      <span style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 15, color: fg, letterSpacing: 0.2 }}>
        Automation Alley
      </span>
    </div>
  );
}

function StatusPill({ status }) {
  const meta = STATUS_META[status] || STATUS_META.Submitted;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", padding: "3px 10px", borderRadius: 999,
      fontFamily: "Inter, sans-serif", fontSize: 12, fontWeight: 600, color: meta.color, background: meta.bg,
      whiteSpace: "nowrap",
    }}>
      {status}
    </span>
  );
}

function ScoreBar({ scores, compact }) {
  const segments = RUBRIC.map((c, i) => ({
    ...c,
    contribution: scores ? (scores[c.key] / 5) * c.weight : 0,
    shade: [0.35, 0.48, 0.6, 0.72, 0.85, 1][i],
  }));
  const total = segments.reduce((s, c) => s + c.contribution, 0);
  return (
    <div>
      <div style={{ display: "flex", height: compact ? 10 : 22, borderRadius: 6, overflow: "hidden", border: `1px solid ${COLORS.line}` }}>
        {segments.map((s) => (
          <div
            key={s.key}
            title={`${s.label}: ${s.contribution.toFixed(1)} pts`}
            style={{ width: `${(s.contribution / 100) * 100}%`, background: COLORS.gold, opacity: s.shade, transition: "width 0.3s ease" }}
          />
        ))}
        <div style={{ flex: 1, background: COLORS.stone }} />
      </div>
      {!compact && (
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: COLORS.slateLight }}>0</span>
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, fontWeight: 700, color: COLORS.ink }}>
            {total.toFixed(1)} / 100
          </span>
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: COLORS.slateLight }}>100</span>
        </div>
      )}
    </div>
  );
}

const labelStyle = {
  display: "block", fontFamily: "Inter, sans-serif", fontSize: 12, fontWeight: 600,
  color: COLORS.slate, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.3,
};
const inputStyle = {
  width: "100%", padding: "10px 12px", borderRadius: 7, border: `1px solid ${COLORS.line}`,
  fontFamily: "Inter, sans-serif", fontSize: 14, color: COLORS.ink, background: COLORS.paper, boxSizing: "border-box",
};
const btnGold = {
  display: "inline-flex", alignItems: "center", gap: 6, background: COLORS.gold, color: COLORS.ink,
  border: "none", borderRadius: 7, padding: "10px 20px", fontFamily: "Inter, sans-serif", fontWeight: 700,
  fontSize: 14, cursor: "pointer",
};
const btnGhost = {
  display: "inline-flex", alignItems: "center", gap: 6, background: "transparent", color: COLORS.ink,
  border: `1px solid ${COLORS.line}`, borderRadius: 7, padding: "10px 16px", fontFamily: "Inter, sans-serif",
  fontWeight: 600, fontSize: 14, cursor: "pointer",
};

function Field({ label, value, onChange, type = "text" }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} style={inputStyle} />
    </div>
  );
}
function TextArea({ label, value, onChange, rows }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={rows} style={{ ...inputStyle, resize: "vertical", fontFamily: "Inter, sans-serif" }} />
    </div>
  );
}
function Select({ label, value, onChange, options }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} style={inputStyle}>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}
function SummaryRow({ label, value }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
      <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12.5, color: COLORS.slateLight }}>{label}</span>
      <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13.5, color: COLORS.ink, fontWeight: 600, textAlign: "right" }}>{value}</span>
    </div>
  );
}
function MiniStat({ label, value, small }) {
  return (
    <div>
      <div style={{ fontFamily: "Inter, sans-serif", fontSize: 10.5, color: COLORS.slateLight, textTransform: "uppercase", letterSpacing: 0.3 }}>{label}</div>
      <div style={{ fontFamily: small ? "Inter, sans-serif" : "'IBM Plex Mono', monospace", fontSize: small ? 13 : 16, fontWeight: 700, color: COLORS.ink, marginTop: 2 }}>{value}</div>
    </div>
  );
}
function EmptyState({ text }) {
  return <div style={{ padding: 60, textAlign: "center", color: COLORS.slateLight, fontFamily: "Inter, sans-serif" }}>{text}</div>;
}

// ---------------------------------------------------------------------------
// LOGIN GATE (demo-only — explicitly not a real auth system)
// ---------------------------------------------------------------------------
function LoginGate({ onLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  return (
    <div style={{ maxWidth: 420, margin: "80px auto", padding: "0 20px" }}>
      <div style={{ background: COLORS.paper, border: `1px solid ${COLORS.line}`, borderRadius: 12, padding: 32, boxShadow: "0 12px 40px rgba(10,10,11,0.08)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: COLORS.ink, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Lock size={16} color={COLORS.gold} />
          </div>
          <h2 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 18, color: COLORS.ink, margin: 0 }}>
            Committee sign-in
          </h2>
        </div>
        <div style={{ display: "flex", gap: 8, padding: 12, background: COLORS.warnBg, borderRadius: 8, marginBottom: 20 }}>
          <Info size={16} color={COLORS.warn} style={{ flexShrink: 0, marginTop: 1 }} />
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: COLORS.warn, margin: 0, lineHeight: 1.5 }}>
            Demo only — this is not a functional login. Nothing you enter is verified, stored, or sent anywhere.
            It just personalizes this session.
          </p>
        </div>
        <div style={{ display: "grid", gap: 14 }}>
          <Field label="Name" value={name} onChange={setName} />
          <Field label="Email" value={email} onChange={setEmail} type="email" />
          <button onClick={() => name && email && onLogin({ name, email })} disabled={!name || !email}
            style={{ ...btnGold, justifyContent: "center", opacity: name && email ? 1 : 0.4, marginTop: 4 }}>
            Continue to committee view
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// APPLY VIEW
// ---------------------------------------------------------------------------
function ApplyView({ onSubmit }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    company: "", contact: "", email: "", phone: "", city: "",
    employees: "", revenue: "", activity: "", need: "", interest: SUBRECIPIENTS[0],
    jobsImpact: "", automationLevel: AUTOMATION_LEVELS[0], timeline: TIMELINES[0],
    primaryGoal: PRIMARY_GOALS[0], sustainPlan: "", techFocus: [],
  });
  const [submitted, setSubmitted] = useState(null);

  const elig = eligibilityCheck(form.employees, form.revenue);
  const steps = ["Company Info", "Eligibility Check", "Your Project", "Review & Submit"];
  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const toggleTechFocus = (opt) => setForm((f) => ({
    ...f,
    techFocus: f.techFocus.includes(opt) ? f.techFocus.filter((t) => t !== opt) : [...f.techFocus, opt],
  }));

  const canAdvance = () => {
    if (step === 0) return form.company && form.contact && form.email && form.city;
    if (step === 1) return form.employees && form.revenue;
    if (step === 2) return form.activity && form.need && form.jobsImpact && form.sustainPlan && form.techFocus.length > 0;
    return true;
  };

  const handleSubmit = () => {
    const ref = `MAMAP-2026-${String(Math.floor(1000 + Math.random() * 8999))}`;
    onSubmit({
      ref, company: form.company, contact: form.contact, email: form.email,
      employees: Number(form.employees), revenue: Number(form.revenue),
      activity: form.activity, need: form.need, interest: form.interest, techFocus: form.techFocus,
      jobsImpact: Number(form.jobsImpact), automationLevel: form.automationLevel,
      timeline: form.timeline, primaryGoal: form.primaryGoal, sustainPlan: form.sustainPlan,
      status: "Submitted", scores: null, notes: "", aiRationale: null,
    });
    setSubmitted(ref);
  };

  if (submitted) {
    return (
      <div style={{ maxWidth: 560, margin: "80px auto", textAlign: "center", padding: "0 20px" }}>
        <CheckCircle2 size={48} color={COLORS.good} />
        <h2 style={{ fontFamily: "Poppins, sans-serif", fontSize: 26, fontWeight: 700, color: COLORS.ink, marginTop: 16 }}>
          Application received
        </h2>
        <p style={{ fontFamily: "Inter, sans-serif", color: COLORS.slate, fontSize: 15, lineHeight: 1.6, marginTop: 8 }}>
          Your reference number is <strong style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{submitted}</strong>.
          The vetting committee reviews applications on a monthly cadence — you'll hear back at{" "}
          <strong>{form.email}</strong> once a decision is made.
        </p>
        <button
          onClick={() => {
            setSubmitted(null); setStep(0);
            setForm({ company: "", contact: "", email: "", phone: "", city: "", employees: "", revenue: "",
              activity: "", need: "", interest: SUBRECIPIENTS[0], jobsImpact: "", automationLevel: AUTOMATION_LEVELS[0],
              timeline: TIMELINES[0], primaryGoal: PRIMARY_GOALS[0], sustainPlan: "", techFocus: [] });
          }}
          style={btnGold}
        >
          Submit another application
        </button>
      </div>
    );
  }

  return (
    <div>
      <Hero />
      <div style={{ maxWidth: 720, margin: "-48px auto 80px", padding: "0 20px" }}>
        <div style={{ background: COLORS.paper, border: `1px solid ${COLORS.line}`, borderRadius: 12, boxShadow: "0 12px 40px rgba(10,10,11,0.08)", overflow: "hidden" }}>
          <div style={{ display: "flex", borderBottom: `1px solid ${COLORS.line}` }}>
            {steps.map((s, i) => (
              <div key={s} style={{
                flex: 1, padding: "14px 8px", textAlign: "center",
                borderBottom: i === step ? `2px solid ${COLORS.gold}` : "2px solid transparent",
                background: i === step ? COLORS.stone : COLORS.paper,
              }}>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: COLORS.slateLight }}>
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12, fontWeight: 600, color: i === step ? COLORS.ink : COLORS.slateLight, marginTop: 2 }}>
                  {s}
                </div>
              </div>
            ))}
          </div>

          <div style={{ padding: 32 }}>
            {step === 0 && (
              <div style={{ display: "grid", gap: 16 }}>
                <Field label="Company name" value={form.company} onChange={(v) => update("company", v)} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <Field label="Contact name" value={form.contact} onChange={(v) => update("contact", v)} />
                  <Field label="City" value={form.city} onChange={(v) => update("city", v)} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <Field label="Email" value={form.email} onChange={(v) => update("email", v)} type="email" />
                  <Field label="Phone" value={form.phone} onChange={(v) => update("phone", v)} />
                </div>
              </div>
            )}

            {step === 1 && (
              <div style={{ display: "grid", gap: 16 }}>
                <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: COLORS.slate, marginBottom: 4 }}>
                  MAMAP services are limited to companies that qualify as small businesses under SBA size standards.
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <Field label="Number of employees" value={form.employees} onChange={(v) => update("employees", v)} type="number" />
                  <Field label="Annual revenue (USD)" value={form.revenue} onChange={(v) => update("revenue", v)} type="number" />
                </div>
                {elig && (
                  <div style={{
                    display: "flex", gap: 12, alignItems: "flex-start", padding: 16, borderRadius: 8,
                    background: elig === "eligible" ? COLORS.goodBg : elig === "verify" ? COLORS.warnBg : COLORS.badBg,
                    border: `1px solid ${elig === "eligible" ? COLORS.good : elig === "verify" ? COLORS.warn : COLORS.bad}33`,
                  }}>
                    {elig === "eligible" && <CheckCircle2 size={20} color={COLORS.good} style={{ flexShrink: 0, marginTop: 1 }} />}
                    {elig === "verify" && <AlertTriangle size={20} color={COLORS.warn} style={{ flexShrink: 0, marginTop: 1 }} />}
                    {elig === "ineligible" && <XCircle size={20} color={COLORS.bad} style={{ flexShrink: 0, marginTop: 1 }} />}
                    <div>
                      <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 13,
                        color: elig === "eligible" ? COLORS.good : elig === "verify" ? COLORS.warn : COLORS.bad }}>
                        {elig === "eligible" && "Likely eligible"}
                        {elig === "verify" && "Verify eligibility before proceeding"}
                        {elig === "ineligible" && "Likely does not meet the small-business threshold"}
                      </div>
                      <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12.5, color: COLORS.slate, marginTop: 4, lineHeight: 1.5 }}>
                        This is a quick estimate based on employee count only. Actual eligibility depends on your
                        specific NAICS code.{" "}
                        <a href="https://legacy.sba.gov/federal-contracting/contracting-guide/size-standards/size-standards-tool"
                          target="_blank" rel="noreferrer" style={{ color: COLORS.ink, fontWeight: 600 }}>
                          Confirm with the official SBA Size Standards Tool <ExternalLink size={11} style={{ display: "inline", verticalAlign: -1 }} />
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {step === 2 && (
              <div style={{ display: "grid", gap: 16 }}>
                <TextArea label="What does your company make or do?" value={form.activity} onChange={(v) => update("activity", v)} rows={2} />
                <div>
                  <label style={labelStyle}>Which technology area(s) does your project involve? (select all that apply)</label>
                  <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: COLORS.slateLight, margin: "0 0 8px" }}>
                    MAMAP provides technical assistance across automation, robotics, and AI adoption — not automation alone.
                  </p>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    {TECH_FOCUS_OPTIONS.map((opt) => {
                      const checked = form.techFocus.includes(opt);
                      return (
                        <button key={opt} type="button" onClick={() => toggleTechFocus(opt)} style={{
                          display: "flex", alignItems: "center", gap: 7, padding: "8px 14px", borderRadius: 999,
                          border: `1px solid ${checked ? COLORS.gold : COLORS.line}`,
                          background: checked ? COLORS.goldSoft : COLORS.paper, cursor: "pointer",
                          fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 600, color: checked ? COLORS.ink : COLORS.slate,
                        }}>
                          <span style={{
                            width: 14, height: 14, borderRadius: 4, border: `1.5px solid ${checked ? COLORS.gold : COLORS.line}`,
                            background: checked ? COLORS.gold : "transparent", display: "flex", alignItems: "center", justifyContent: "center",
                          }}>
                            {checked && <CheckCircle2 size={11} color={COLORS.ink} strokeWidth={3} />}
                          </span>
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <TextArea label="What automation, robotics, or AI need are you looking to address?" value={form.need} onChange={(v) => update("need", v)} rows={3} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <Select label="Current automation/robotics/AI maturity level" value={form.automationLevel} onChange={(v) => update("automationLevel", v)} options={AUTOMATION_LEVELS} />
                  <Field label="Estimated jobs created or retained" value={form.jobsImpact} onChange={(v) => update("jobsImpact", v)} type="number" />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <Select label="Primary goal" value={form.primaryGoal} onChange={(v) => update("primaryGoal", v)} options={PRIMARY_GOALS} />
                  <Select label="Expected implementation timeline" value={form.timeline} onChange={(v) => update("timeline", v)} options={TIMELINES} />
                </div>
                <TextArea label="How will you sustain and build on this improvement after the program ends?" value={form.sustainPlan} onChange={(v) => update("sustainPlan", v)} rows={2} />
                <Select label="Which type of support sounds like the best fit?" value={form.interest} onChange={(v) => update("interest", v)} options={SUBRECIPIENTS} />
              </div>
            )}

            {step === 3 && (
              <div style={{ display: "grid", gap: 10 }}>
                <SummaryRow label="Company" value={form.company} />
                <SummaryRow label="Contact" value={`${form.contact} · ${form.email}`} />
                <SummaryRow label="Size" value={`${form.employees} employees · ${form.revenue ? currency(Number(form.revenue)) : ""} revenue`} />
                <SummaryRow label="Technology focus" value={form.techFocus.join(", ") || "—"} />
                <SummaryRow label="Automation/robotics/AI maturity" value={form.automationLevel} />
                <SummaryRow label="Jobs impact" value={form.jobsImpact} />
                <SummaryRow label="Timeline" value={form.timeline} />
                <SummaryRow label="Interested service" value={form.interest} />
                <div style={{ marginTop: 8, paddingTop: 16, borderTop: `1px solid ${COLORS.line}` }}>
                  <label style={labelStyle}>Automation need</label>
                  <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13.5, color: COLORS.ink, lineHeight: 1.5 }}>{form.need}</p>
                </div>
              </div>
            )}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", padding: "16px 32px", background: COLORS.stone, borderTop: `1px solid ${COLORS.line}` }}>
            <button onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0} style={{ ...btnGhost, opacity: step === 0 ? 0.35 : 1 }}>
              <ChevronLeft size={16} /> Back
            </button>
            {step < 3 ? (
              <button onClick={() => setStep((s) => s + 1)} disabled={!canAdvance()} style={{ ...btnGold, opacity: canAdvance() ? 1 : 0.4 }}>
                Continue <ChevronRight size={16} />
              </button>
            ) : (
              <button onClick={handleSubmit} style={btnGold}>Submit application</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <div style={{ background: COLORS.ink, padding: "64px 20px 120px", textAlign: "center" }}>
      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: COLORS.gold, letterSpacing: 1.5, textTransform: "uppercase" }}>
        Michigan Advanced Manufacturing Adoption Program
      </div>
      <h1 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "clamp(28px, 4vw, 42px)", color: COLORS.paper, margin: "16px 0 12px", lineHeight: 1.15 }}>
        No-cost help adopting automation,<br />robotics, and AI on your floor.
      </h1>
      <p style={{ fontFamily: "Inter, sans-serif", fontSize: 16, color: "#C7C7C9", maxWidth: 520, margin: "0 auto" }}>
        Automation Alley connects qualifying Michigan manufacturers with expert technical assistance —
        fully funded, no cost to your business.
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// SCORING METHODOLOGY EXPLAINER
// ---------------------------------------------------------------------------
function ScoringExplainer() {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ border: `1px solid ${COLORS.line}`, borderRadius: 8, marginBottom: 20, overflow: "hidden" }}>
      <button onClick={() => setOpen((o) => !o)} style={{
        width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "10px 14px", background: COLORS.stone, border: "none", cursor: "pointer",
      }}>
        <span style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 12.5, color: COLORS.ink }}>
          <Info size={14} /> How is this score calculated?
        </span>
        <span style={{ fontFamily: "Inter, sans-serif", fontSize: 11, color: COLORS.slateLight }}>{open ? "Hide" : "Show"}</span>
      </button>
      {open && (
        <div style={{ padding: 14, fontFamily: "Inter, sans-serif", fontSize: 12.5, color: COLORS.slate, lineHeight: 1.6 }}>
          <p style={{ margin: "0 0 10px" }}>
            Each application is scored 1–5 on six weighted criteria. A criterion's point contribution is{" "}
            <code style={{ fontFamily: "'IBM Plex Mono', monospace", background: COLORS.stone, padding: "1px 5px", borderRadius: 4 }}>
              (score ÷ 5) × weight
            </code>. The six contributions sum to a total out of 100.
          </p>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ textAlign: "left", borderBottom: `1px solid ${COLORS.line}` }}>
                <th style={{ padding: "4px 0", fontWeight: 600 }}>Criterion</th>
                <th style={{ padding: "4px 0", fontWeight: 600, textAlign: "right" }}>Weight</th>
              </tr>
            </thead>
            <tbody>
              {RUBRIC.map((c) => (
                <tr key={c.key} style={{ borderBottom: `1px solid ${COLORS.line}` }}>
                  <td style={{ padding: "5px 0" }}>{c.label}</td>
                  <td style={{ padding: "5px 0", textAlign: "right", fontFamily: "'IBM Plex Mono', monospace" }}>{c.weight}%</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p style={{ margin: "10px 0 0" }}>
            <strong>Recommendation bands:</strong> 75+ Recommend Award · 55–74 Conditional (discuss in committee) · below 55 Recommend Decline.
            These bands are a starting point for discussion, not an automatic decision.
          </p>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// VETTING COMMITTEE VIEW
// ---------------------------------------------------------------------------
function VettingView({ applications, setApplications, user, onLogout }) {
  const [selectedRef, setSelectedRef] = useState(applications[0]?.ref || null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(null);
  const selected = applications.find((a) => a.ref === selectedRef);

  const updateScore = (key, value) => {
    setApplications((apps) => apps.map((a) => {
      if (a.ref !== selectedRef) return a;
      const scores = { ...(a.scores || Object.fromEntries(RUBRIC.map((c) => [c.key, 3]))), [key]: value };
      return { ...a, scores, status: a.status === "Submitted" || a.status === "Under Review" ? "Scored" : a.status };
    }));
  };

  const updateNotes = (notes) => {
    setApplications((apps) => apps.map((a) => a.ref === selectedRef ? { ...a, notes } : a));
  };

  const setDecision = (status) => {
    setApplications((apps) => apps.map((a) => a.ref === selectedRef ? { ...a, status } : a));
  };

  const requestAiSuggestion = async () => {
    setAiLoading(true);
    setAiError(null);
    let outcome;
    try {
      outcome = await fetchAiSuggestion(selected);
    } catch (e) {
      // Expected on a static host with no backend/API key — fall back automatically.
      outcome = localHeuristicSuggestion(selected);
    }
    const scores = {};
    const rationale = {};
    RUBRIC.forEach((c) => {
      const entry = outcome.result[c.key];
      scores[c.key] = entry && entry.score ? Math.max(1, Math.min(5, Math.round(entry.score))) : 3;
      rationale[c.key] = entry ? entry.rationale : "";
    });
    setApplications((apps) => apps.map((a) => a.ref === selectedRef
      ? { ...a, scores, aiRationale: rationale, aiSource: outcome.source, status: a.status === "Submitted" || a.status === "Under Review" ? "Scored" : a.status }
      : a));
    setAiLoading(false);
  };

  if (!selected) return <EmptyState text="No applications yet." />;

  const total = weightedTotal(selected.scores);
  const rec = recommendation(total);

  return (
    <div>
      <TopStrip user={user} onLogout={onLogout} />
      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", minHeight: "70vh" }}>
        <div style={{ borderRight: `1px solid ${COLORS.line}`, background: COLORS.stone, padding: 16, overflowY: "auto" }}>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: COLORS.slateLight, marginBottom: 12, textTransform: "uppercase" }}>
            {applications.length} applications
          </div>
          {applications.map((a) => (
            <button key={a.ref} onClick={() => setSelectedRef(a.ref)} style={{
              display: "block", width: "100%", textAlign: "left", padding: 12, marginBottom: 8,
              borderRadius: 8, border: `1px solid ${a.ref === selectedRef ? COLORS.gold : COLORS.line}`,
              background: a.ref === selectedRef ? COLORS.goldSoft : COLORS.paper, cursor: "pointer",
            }}>
              <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 13.5, color: COLORS.ink }}>{a.company}</div>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10.5, color: COLORS.slateLight, margin: "3px 0 8px" }}>{a.ref}</div>
              <StatusPill status={a.status} />
            </button>
          ))}
        </div>

        <div style={{ padding: 32, maxWidth: 760 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
            <div>
              <h2 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 22, color: COLORS.ink, margin: 0 }}>{selected.company}</h2>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: COLORS.slateLight, marginTop: 2 }}>{selected.ref}</div>
            </div>
            <StatusPill status={selected.status} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12, margin: "20px 0", padding: 16, background: COLORS.stone, borderRadius: 8 }}>
            <MiniStat label="Employees" value={selected.employees} />
            <MiniStat label="Revenue" value={currency(selected.revenue)} />
            <MiniStat label="Jobs impact" value={selected.jobsImpact} />
            <MiniStat label="Timeline" value={selected.timeline} small />
          </div>

          <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13.5, color: COLORS.slate, lineHeight: 1.6 }}>
            <strong style={{ color: COLORS.ink }}>Activity:</strong> {selected.activity}
          </p>
          {selected.techFocus && selected.techFocus.length > 0 && (
            <div style={{ display: "flex", gap: 6, margin: "6px 0 10px", flexWrap: "wrap" }}>
              {selected.techFocus.map((t) => (
                <span key={t} style={{
                  fontFamily: "Inter, sans-serif", fontSize: 11, fontWeight: 600, color: COLORS.ink,
                  background: COLORS.goldSoft, padding: "3px 9px", borderRadius: 999,
                }}>{t}</span>
              ))}
            </div>
          )}
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13.5, color: COLORS.slate, lineHeight: 1.6 }}>
            <strong style={{ color: COLORS.ink }}>Stated need:</strong> {selected.need}
          </p>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13.5, color: COLORS.slate, lineHeight: 1.6, marginBottom: 24 }}>
            <strong style={{ color: COLORS.ink }}>Sustainability plan:</strong> {selected.sustainPlan}
          </p>

          <ScoringExplainer />

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
            <h3 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 15, color: COLORS.ink, margin: 0 }}>
              Scoring rubric
            </h3>
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12, fontWeight: 700, padding: "3px 10px", borderRadius: 999, color: rec.color, background: rec.bg }}>
              {rec.label}
            </span>
          </div>
          <ScoreBar scores={selected.scores} />

          <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <button onClick={requestAiSuggestion} disabled={aiLoading} style={{
              display: "inline-flex", alignItems: "center", gap: 6, background: COLORS.aiBg, color: COLORS.aiText,
              border: `1px solid ${COLORS.aiText}33`, borderRadius: 7, padding: "8px 14px", fontFamily: "Inter, sans-serif",
              fontWeight: 700, fontSize: 12.5, cursor: aiLoading ? "default" : "pointer", opacity: aiLoading ? 0.7 : 1,
            }}>
              {aiLoading ? <Loader2 size={14} className="spin" /> : <Sparkles size={14} />}
              {aiLoading ? "Generating suggestion…" : "Suggest starting scores"}
            </button>
            {selected.aiSource && (
              <span style={{
                fontFamily: "Inter, sans-serif", fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 999,
                color: selected.aiSource === "live" ? COLORS.aiText : COLORS.slate,
                background: selected.aiSource === "live" ? COLORS.aiBg : "#EFEFEE",
              }}>
                {selected.aiSource === "live" ? "Live AI" : "Heuristic (offline mode)"}
              </span>
            )}
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: 11.5, color: COLORS.slateLight }}>
              Sets a starting point from the application — review and adjust every value below. Uses live AI when
              connected; falls back to a transparent rule-based estimate otherwise.
            </span>
          </div>
          {aiError && <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: COLORS.bad, marginTop: 8 }}>{aiError}</p>}

          <div style={{ marginTop: 20, display: "grid", gap: 14 }}>
            {RUBRIC.map((c) => {
              const val = selected.scores ? selected.scores[c.key] : 3;
              const rationale = selected.aiRationale ? selected.aiRationale[c.key] : null;
              return (
                <div key={c.key} style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 12, alignItems: "center", paddingBottom: 12, borderBottom: `1px solid ${COLORS.line}` }}>
                  <div>
                    <div style={{ fontFamily: "Inter, sans-serif", fontSize: 13.5, fontWeight: 600, color: COLORS.ink }}>
                      {c.label} <span style={{ color: COLORS.slateLight, fontWeight: 400 }}>· {c.weight}% weight</span>
                    </div>
                    <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: COLORS.slateLight, marginTop: 2 }}>{c.help}</div>
                    {rationale && (
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 5, marginTop: 6, padding: "6px 8px",
                        background: selected.aiSource === "live" ? COLORS.aiBg : "#EFEFEE", borderRadius: 6 }}>
                        <Sparkles size={12} color={selected.aiSource === "live" ? COLORS.aiText : COLORS.slate} style={{ flexShrink: 0, marginTop: 2 }} />
                        <span style={{ fontFamily: "Inter, sans-serif", fontSize: 11.5,
                          color: selected.aiSource === "live" ? COLORS.aiText : COLORS.slate, lineHeight: 1.4 }}>{rationale}</span>
                      </div>
                    )}
                    <div style={{ display: "flex", gap: 4, marginTop: 8 }}>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <button key={n} onClick={() => updateScore(c.key, n)} style={{
                          width: 26, height: 26, borderRadius: 5, border: `1px solid ${n <= val ? COLORS.gold : COLORS.line}`,
                          background: n <= val ? COLORS.gold : COLORS.paper, cursor: "pointer",
                          fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: n <= val ? COLORS.ink : COLORS.slateLight,
                        }}>{n}</button>
                      ))}
                    </div>
                  </div>
                  <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 15, fontWeight: 700, color: COLORS.ink, textAlign: "right", minWidth: 60 }}>
                    {selected.scores ? ((val / 5) * c.weight).toFixed(1) : "—"}
                    <div style={{ fontSize: 10, color: COLORS.slateLight, fontWeight: 400 }}>pts</div>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: 20 }}>
            <label style={labelStyle}>Reviewer notes</label>
            <textarea value={selected.notes} onChange={(e) => updateNotes(e.target.value)} rows={3}
              style={{ ...inputStyle, resize: "vertical", fontFamily: "Inter, sans-serif" }} />
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
            <button onClick={() => setDecision("Awarded")} style={{ ...btnGold, background: COLORS.good, color: COLORS.paper }}>
              <CheckCircle2 size={16} /> Award
            </button>
            <button onClick={() => setDecision("Declined")} style={{ ...btnGhost, borderColor: COLORS.bad, color: COLORS.bad }}>
              <XCircle size={16} /> Decline
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// DASHBOARD VIEW
// ---------------------------------------------------------------------------
function DashboardView({ applications, user, onLogout }) {
  const awarded = applications.filter((a) => a.status === "Awarded").length;
  const scoredApps = applications.filter((a) => a.scores);
  const avgScore = scoredApps.length
    ? scoredApps.reduce((s, a) => s + weightedTotal(a.scores), 0) / scoredApps.length
    : 0;

  const statusData = Object.keys(STATUS_META).map((s) => ({
    status: s, count: applications.filter((a) => a.status === s).length,
  }));

  const subData = SUBRECIPIENTS.filter((s) => s !== "Not sure — help me determine fit").map((s) => ({
    name: s.replace(" engineering institute", "").replace(" manufacturing association", "").replace(" technology center", ""),
    value: applications.filter((a) => a.interest === s).length,
  }));
  const PIE_COLORS = [COLORS.gold, COLORS.ink, COLORS.slateLight];

  return (
    <div>
      <TopStrip user={user} onLogout={onLogout} />
      <div style={{ padding: 32, maxWidth: 1100, margin: "0 auto" }}>
        <h2 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 22, color: COLORS.ink, marginBottom: 4 }}>
          Program pipeline
        </h2>
        <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: COLORS.slateLight, marginBottom: 24 }}>
          Live snapshot from application data. Sample data shown for demonstration.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
          <StatCard label="Applications received" value={applications.length} />
          <StatCard label="Companies awarded" value={awarded} />
          <StatCard label="% of 240 target" value={`${((awarded / TARGET_COMPANIES) * 100).toFixed(1)}%`} accent />
          <StatCard label="Avg. rubric score" value={avgScore ? avgScore.toFixed(1) : "—"} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 20 }}>
          <div style={{ background: COLORS.paper, border: `1px solid ${COLORS.line}`, borderRadius: 10, padding: 20 }}>
            <h3 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 14, color: COLORS.ink, marginBottom: 16 }}>
              Applications by status
            </h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={statusData} margin={{ left: -20 }}>
                <CartesianGrid stroke={COLORS.line} vertical={false} />
                <XAxis dataKey="status" tick={{ fontFamily: "Inter, sans-serif", fontSize: 11, fill: COLORS.slate }} axisLine={{ stroke: COLORS.line }} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontFamily: "Inter, sans-serif", fontSize: 11, fill: COLORS.slate }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontFamily: "Inter, sans-serif", fontSize: 12, borderRadius: 6, border: `1px solid ${COLORS.line}` }} />
                <Bar dataKey="count" fill={COLORS.gold} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={{ background: COLORS.paper, border: `1px solid ${COLORS.line}`, borderRadius: 10, padding: 20 }}>
            <h3 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 14, color: COLORS.ink, marginBottom: 16 }}>
              Interest by subrecipient
            </h3>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={subData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={{ fontFamily: "Inter, sans-serif", fontSize: 10 }}>
                  {subData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ fontFamily: "Inter, sans-serif", fontSize: 12, borderRadius: 6, border: `1px solid ${COLORS.line}` }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, accent }) {
  return (
    <div style={{ background: accent ? COLORS.ink : COLORS.paper, border: `1px solid ${accent ? COLORS.ink : COLORS.line}`, borderRadius: 10, padding: 18 }}>
      <div style={{ fontFamily: "Inter, sans-serif", fontSize: 11.5, color: accent ? "#C7C7C9" : COLORS.slateLight, textTransform: "uppercase", letterSpacing: 0.3 }}>
        {label}
      </div>
      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 28, fontWeight: 700, color: accent ? COLORS.gold : COLORS.ink, marginTop: 6 }}>
        {value}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// TOP STRIP (shown on gated views once signed in)
// ---------------------------------------------------------------------------
function TopStrip({ user, onLogout }) {
  return (
    <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 10, padding: "8px 24px", background: COLORS.stone, borderBottom: `1px solid ${COLORS.line}` }}>
      <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12.5, color: COLORS.slate }}>
        Signed in as <strong style={{ color: COLORS.ink }}>{user.name}</strong> ({user.email})
      </span>
      <button onClick={onLogout} style={{
        display: "inline-flex", alignItems: "center", gap: 5, background: "transparent", border: `1px solid ${COLORS.line}`,
        borderRadius: 6, padding: "5px 10px", fontFamily: "Inter, sans-serif", fontSize: 12, color: COLORS.slate, cursor: "pointer",
      }}>
        <LogOut size={12} /> Log off
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// APP SHELL
// ---------------------------------------------------------------------------
export default function App() {
  const [applications, setApplications] = useState(seedApplications());
  const [view, setView] = useState("apply");
  const [user, setUser] = useState(null);

  const addApplication = (app) => setApplications((prev) => [app, ...prev]);
  const handleLogout = () => { setUser(null); setView("apply"); };

  const NAV = [
    { key: "apply", label: "Apply", icon: Building2, gated: false },
    { key: "vetting", label: "Vetting Committee", icon: ClipboardCheck, gated: true },
    { key: "dashboard", label: "Dashboard", icon: LayoutDashboard, gated: true },
  ];

  return (
    <div style={{ fontFamily: "Inter, sans-serif", background: COLORS.stone, minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@600;700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;700&display=swap');
        * { box-sizing: border-box; }
        button { font-family: inherit; }
        input:focus, textarea:focus, select:focus { outline: 2px solid ${COLORS.gold}; outline-offset: 1px; }
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>

      <div style={{ background: COLORS.gold, padding: "6px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: COLORS.ink, fontWeight: 700 }}>
          MICHIGAN ADVANCED MANUFACTURING ADOPTION PROGRAM
        </span>
        <span style={{ fontFamily: "Inter, sans-serif", fontSize: 11.5, color: COLORS.ink }}>
          {applications.length} applications on file
        </span>
      </div>

      <div style={{ background: COLORS.ink, padding: "14px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Logo mode="dark" />
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {NAV.map((n) => {
            const Icon = n.icon;
            const active = view === n.key;
            return (
              <button key={n.key} onClick={() => setView(n.key)} style={{
                display: "flex", alignItems: "center", gap: 6, background: "transparent", border: "none",
                borderBottom: active ? `2px solid ${COLORS.gold}` : "2px solid transparent",
                color: active ? COLORS.gold : "#D8D8D9", padding: "8px 14px", cursor: "pointer",
                fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 13.5,
              }}>
                <Icon size={15} /> {n.label} {n.gated && !user && <Lock size={11} style={{ marginLeft: 2, opacity: 0.6 }} />}
              </button>
            );
          })}
          {user && (
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: COLORS.gold, marginLeft: 8, paddingLeft: 12, borderLeft: "1px solid #333" }}>
              {user.name}
            </span>
          )}
        </div>
      </div>

      {view === "apply" && <ApplyView onSubmit={addApplication} />}
      {view === "vetting" && (user ? <VettingView applications={applications} setApplications={setApplications} user={user} onLogout={handleLogout} /> : <LoginGate onLogin={setUser} />)}
      {view === "dashboard" && (user ? <DashboardView applications={applications} user={user} onLogout={handleLogout} /> : <LoginGate onLogin={setUser} />)}

      <div style={{ textAlign: "center", padding: "24px", fontFamily: "Inter, sans-serif", fontSize: 11.5, color: COLORS.slateLight }}>
        Demo build for the Grant Program Manager assessment — not affiliated with or endorsed by Automation Alley's production systems.
      </div>
    </div>
  );
}
