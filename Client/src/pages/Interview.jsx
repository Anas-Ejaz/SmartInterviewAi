import { useEffect, useState } from "react";
import { api } from "../api";
import Nav from "../components/Nav";

const ROLES = ["Frontend Developer", "Backend Developer", "Full Stack Developer", "Python Developer"];
const LEVELS = ["Intern", "Junior", "Mid-level"];
const SKILLS = ["React", "JavaScript", "Python", "Java", "C++", "Node.js", "SQL", "MongoDB"];
const DIM_LABELS = {
  technical_correctness: "Technical correctness", reasoning: "Reasoning", practical_application: "Practical application",
  problem_solving: "Problem-solving", communication: "Communication",
};

const Spinner = ({ text }) => <><span className="spin" aria-hidden />{text}</>;
const Err = ({ msg }) => (msg ? <div className="err" role="alert">{msg}</div> : null);

function Setup({ onCreated }) {
  const [f, setF] = useState({ role: ROLES[2], level: LEVELS[1], skills: ["React", "JavaScript"], count: 5, github: "", project: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));
  const toggle = (s) => set("skills", f.skills.includes(s) ? f.skills.filter((x) => x !== s) : [...f.skills, s]);

  async function submit() {
    if (!f.skills.length) return setError("Pick at least one skill.");
    setBusy(true); setError("");
    try {
      const data = await api("/interviews", {
        role: f.role, level: f.level, skills: f.skills, question_count: Number(f.count),
        project_description: f.project, github_url: f.github.trim() || null,
      });
      onCreated(data);
    } catch (e) { setError(e.message); setBusy(false); }
  }

  return (
    <div className="card">
      <h2>Set up your interview</h2>
      <div className="grid">
        <div><label htmlFor="role">Target role</label>
          <select id="role" value={f.role} onChange={(e) => set("role", e.target.value)}>{ROLES.map((r) => <option key={r}>{r}</option>)}</select></div>
        <div><label htmlFor="lvl">Experience level</label>
          <select id="lvl" value={f.level} onChange={(e) => set("level", e.target.value)}>{LEVELS.map((r) => <option key={r}>{r}</option>)}</select></div>
        <div><label htmlFor="cnt">Questions</label>
          <select id="cnt" value={f.count} onChange={(e) => set("count", e.target.value)}>{[3, 5, 7, 10].map((n) => <option key={n}>{n}</option>)}</select></div>
      </div>
      <label>Skills</label>
      <div className="chips">{SKILLS.map((s) => (
        <button type="button" key={s} className={"chip" + (f.skills.includes(s) ? " on" : "")} aria-pressed={f.skills.includes(s)} onClick={() => toggle(s)}>{s}</button>
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
  function next() { setQ(fb.next); setFb(null); setAnswer(""); }

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
          {fb.strengths.length > 0 && <><strong>Strong</strong><ul>{fb.strengths.map((s, i) => <li key={i}>{s}</li>)}</ul></>}
          {fb.improvements.length > 0 && <><strong>Improve</strong><ul>{fb.improvements.map((s, i) => <li key={i}>{s}</li>)}</ul></>}
          {fb.finished
            ? <button className="btn" disabled={busy} onClick={finish}>{busy ? <Spinner text="Writing your report…" /> : "See my report"}</button>
            : <button className="btn" onClick={next}>{fb.next.is_follow_up ? "Answer follow-up" : "Next question"}</button>}
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
