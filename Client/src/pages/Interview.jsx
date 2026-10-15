import { useEffect, useState } from "react";
import { api } from "../api";
import Nav from "../components/Nav";
import "../interview.css";

const ROLES = ["Frontend Developer", "Backend Developer", "Full Stack Developer", "Python Developer"];
const LEVELS = ["Intern", "Junior", "Mid-level"];
const SKILLS = ["React", "JavaScript", "Python", "Java", "C++", "Node.js", "SQL", "MongoDB"];
const DIM_LABELS = {
  technical_correctness: "Technical correctness", reasoning: "Reasoning", practical_application: "Practical application",
  problem_solving: "Problem-solving", communication: "Communication",
};

const Spinner = ({ text }) => <><span className="spin" aria-hidden />{text}</>;
const Err = ({ msg }) => (msg ? <div className="err" role="alert">{msg}</div> : null);

const MAX_SKILLS = 20;
// Split on commas, trim, drop empties/duplicates (case-insensitive) and cap the total.
function mergeSkills(list, raw) {
  const out = [...list];
  for (const part of raw.split(",")) {
    const s = part.trim().slice(0, 40);
    if (s && out.length < MAX_SKILLS && !out.some((x) => x.toLowerCase() === s.toLowerCase())) out.push(s);
  }
  return out;
}

const LOADING_STEPS = [
  "Reading your role and skills…",
  "Looking at your project details…",
  "Writing your interview questions…",
  "Almost ready…",
];

function QuestionsLoader() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((n) => Math.min(n + 1, LOADING_STEPS.length - 1)), 3500);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="card loader" role="status" aria-live="polite">
      <div className="orb" aria-hidden />
      <h2>Preparing your interview</h2>
      <p className="note">{LOADING_STEPS[i]}</p>
      <div className="bar indet" aria-hidden><i /></div>
      <span className="note">This can take a little while. Please keep this tab open.</span>
    </div>
  );
}

function Setup({ onCreated }) {
  const [f, setF] = useState({ role: "", level: LEVELS[1], skills: [], count: 5, github: "", project: "" });
  const [skillInput, setSkillInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));
  const addSkills = (raw) => { set("skills", mergeSkills(f.skills, raw)); setSkillInput(""); };
  const removeSkill = (s) => set("skills", f.skills.filter((x) => x !== s));
  function onSkillKey(e) {
    if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addSkills(skillInput); }
    else if (e.key === "Backspace" && !skillInput && f.skills.length) removeSkill(f.skills[f.skills.length - 1]);
  }

  async function submit() {
    const role = f.role.trim();
    const skills = mergeSkills(f.skills, skillInput); // include anything typed but not yet added
    if (!role) return setError("Enter your target role.");
    if (!skills.length) return setError("Add at least one skill.");
    setBusy(true); setError("");
    try {
      const data = await api("/interviews", {
        role, level: f.level, skills, question_count: Number(f.count),
        project_description: f.project, github_url: f.github.trim() || null,
      });
      if (!data || !data.session_id || typeof data.question !== "string") {
        throw new Error("The backend replied, but not with an interview. Check the backend terminal for errors.");
      }
      onCreated(data);
    } catch (e) { setError(e.message); setBusy(false); }
  }

  if (busy) return <QuestionsLoader />;

  return (
    <div className="card">
      <h2>Set up your interview</h2>
      <div className="grid">
        <div><label htmlFor="role">Target role</label>
          <input id="role" list="role-list" maxLength={80} placeholder="e.g. Frontend Developer, DevOps Engineer" value={f.role} onChange={(e) => set("role", e.target.value)} />
          <datalist id="role-list">{ROLES.map((r) => <option key={r} value={r} />)}</datalist></div>
        <div><label htmlFor="lvl">Experience level</label>
          <select id="lvl" value={f.level} onChange={(e) => set("level", e.target.value)}>{LEVELS.map((r) => <option key={r}>{r}</option>)}</select></div>
        <div><label htmlFor="cnt">Questions</label>
          <select id="cnt" value={f.count} onChange={(e) => set("count", e.target.value)}>{[3, 5, 7, 10].map((n) => <option key={n}>{n}</option>)}</select></div>
      </div>
      <label htmlFor="skill-in">Skills</label>
      <input id="skill-in" maxLength={80} placeholder="Type a skill and press Enter (or use commas), e.g. Docker, GraphQL"
        value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={onSkillKey} onBlur={() => skillInput.trim() && addSkills(skillInput)} />
      {f.skills.length > 0 && (
        <div className="chips" style={{ marginTop: 10 }}>{f.skills.map((s) => (
          <button type="button" key={s} className="chip on" aria-label={`Remove ${s}`} onClick={() => removeSkill(s)}>{s} ×</button>
        ))}</div>
      )}
      <span className="note">Quick add:</span>
      <div className="chips" style={{ marginTop: 6 }}>{SKILLS.filter((s) => !f.skills.some((x) => x.toLowerCase() === s.toLowerCase())).map((s) => (
        <button type="button" key={s} className="chip" onClick={() => addSkills(s)}>+ {s}</button>
      ))}</div>
      <label htmlFor="gh">GitHub repository URL (optional)</label>
      <input id="gh" placeholder="https://github.com/user/repo" value={f.github} onChange={(e) => set("github", e.target.value)} />
      <span className="note">Only the public README is read, never the code.</span>
      <label htmlFor="pr">Project description (optional)</label>
      <textarea id="pr" style={{ minHeight: 90 }} placeholder="What you built, the stack, and one decision you are proud of" value={f.project} onChange={(e) => set("project", e.target.value)} />
      <Err msg={error} />
      <p><button className="btn" disabled={busy} onClick={submit}>{busy ? <Spinner text="Preparing your questions…" /> : "Start Interview"}</button></p>
    </div>
  );
}

function Room({ session, onDone }) {
  const [q, setQ] = useState(session);
  const [answer, setAnswer] = useState("");
  const [fb, setFb] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const base = `/interviews/${session.session_id}`;
  const answered = q.number - 1 + (fb ? 1 : 0);

  async function submit() {
    if (busy || !answer.trim()) return;
    setBusy(true); setError("");
    try {
      const r = await api(`${base}/answer`, { answer });
      setFb(r);
    } catch (e) { setError(e.message); }
    setBusy(false);
  }
  async function finish() {
    setBusy(true); setError("");
    try { onDone(await api(`${base}/complete`, {})); }
    catch (e) { setError(e.message); setBusy(false); }
  }
  function next() { if (!fb || !fb.next) return; setQ(fb.next); setFb(null); setAnswer(""); } // FIX 1

  return (
    <>
      <div className="row"><span>Question {Math.min(q.number, q.total)} of {q.total}{q.is_follow_up ? " (follow-up)" : ""}</span>
        <button className="btn ghost" disabled={busy || (!fb && q.number === 1)} onClick={finish}>Finish early</button></div>
      <div className="bar" role="progressbar" aria-valuenow={answered} aria-valuemax={q.total}><i style={{ width: `${(Math.min(answered, q.total) / q.total) * 100}%` }} /></div>
      <div className="card" style={{ marginTop: 18 }}>
        {q.is_follow_up && <span className="tag">Follow-up based on your last answer</span>}
        <h2>{q.question}</h2>
        <textarea aria-label="Your answer" value={answer} disabled={busy || !!fb} placeholder="Type your answer…" onChange={(e) => setAnswer(e.target.value)} />
        {!fb && <p><button className="btn" disabled={busy || !answer.trim()} onClick={submit}>{busy ? <Spinner text="Evaluating…" /> : "Submit Answer"}</button></p>}
      </div>
      <Err msg={error} />
      {fb && (
        <div className="card fb">
          <h3>Feedback · {fb.score}/100</h3>
          <p>{fb.feedback}</p>
          {fb.strengths?.length > 0 && <><strong>Strong</strong><ul>{fb.strengths.map((s, i) => <li key={i}>{s}</li>)}</ul></>}{/* FIX 2 */}
          {fb.improvements?.length > 0 && <><strong>Improve</strong><ul>{fb.improvements.map((s, i) => <li key={i}>{s}</li>)}</ul></>}{/* FIX 2 */}
          {fb.finished
            ? <button className="btn" disabled={busy} onClick={finish}>{busy ? <Spinner text="Writing your report…" /> : "See my report"}</button>
            : <button className="btn" disabled={!fb.next} onClick={next}>{fb.next?.is_follow_up ? "Answer follow-up" : "Next question"}</button>}{/* FIX 3 */}
        </div>
      )}
    </>
  );
}

function Results({ r, onRestart }) {
  const List = ({ title, items }) => items?.length ? <div className="card"><h3>{title}</h3><ul>{items.map((s, i) => <li key={i}>{s}</li>)}</ul></div> : null;
  return (
    <>
      <div className="card">
        <span className="tag">Mock interview performance · {r.answered} of {r.planned} planned questions answered</span>
        <div className="big">{r.overall_score}<span className="note" style={{ fontSize: "1.2rem" }}> / 100</span></div>
        <p>{r.readiness_summary}</p>
        <span className="note">This is a practice score, not a prediction of hiring outcomes.</span>
      </div>
      <div className="card"><h3>Score breakdown</h3>
        {Object.entries(r.dimension_scores).map(([k, v]) => (
          <div key={k}><div className="row"><span>{DIM_LABELS[k]}</span><span>{v}</span></div><div className="bar"><i style={{ width: `${v}%` }} /></div></div>
        ))}
      </div>
      <div className="grid"><List title="Strengths" items={r.strengths} /><List title="Areas to improve" items={r.weaknesses} /></div>
      <List title="Evidence from your answers" items={r.evidence} />
      <List title="Not enough evidence to assess" items={r.insufficient_evidence} />
      <List title="Practice next" items={r.recommendations} />
      <button className="btn" onClick={onRestart}>Start another interview</button>
    </>
  );
}

export default function Interview() {
  const [view, setView] = useState("setup");
  const [session, setSession] = useState(null);
  const [report, setReport] = useState(null);
  const [ai, setAi] = useState(null);
  useEffect(() => { api("/health").then((h) => setAi(h.ai_configured)).catch(() => setAi(null)); }, []);
  const restart = () => { setSession(null); setReport(null); setView("setup"); };
  return (
    <div className="wrap">
      <Nav />
      {ai === false && <Err msg="Backend is running but GROQ_API_KEY / GROQ_MODEL are not set in backend/.env." />}
      {view === "setup" && <Setup onCreated={(s) => { setSession(s); setView("room"); }} />}
      {view === "room" && <Room session={session} onDone={(r) => { setReport(r); setView("results"); }} />}
      {view === "results" && <Results r={report} onRestart={restart} />}
    </div>
  );
}