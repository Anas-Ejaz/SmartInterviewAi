import { Link } from "react-router-dom";
import Nav from "../components/Nav";
import "../landing.css";

const PAIN = [
  ["Generic question lists", "Copy-pasted lists don't match your role, your level or the project on your CV."],
  ["No real feedback", "Reading answers on your own never tells you what an interviewer would actually pick apart."],
  ["No follow-ups", "Real interviews dig deeper when an answer is thin. Most practice tools never do."],
];

const STEPS = [
  ["Tell us about you", "Pick your target role, experience level and skills. Optionally add a GitHub repo or a short project description."],
  ["Answer one question at a time", "Questions are generated for you and asked one by one, like a real interview, in your own words."],
  ["Get probed on weak spots", "If an answer is vague or incomplete, the interviewer asks a follow-up that targets the gap."],
  ["Read your report", "See an overall score, a five-part breakdown, evidence from your answers and what to practice next."],
];

const FEATURES = [
  ["Personalized questions", "Built from your role, level, skills and the project you describe, not a fixed question bank."],
  ["Adaptive follow-ups", "Vague or incomplete answers trigger a follow-up that digs into exactly what was missing."],
  ["Feedback after every answer", "Get a score, what was strong and what to improve before moving to the next question."],
  ["Five-dimension scoring", "Technical correctness, reasoning, practical application, problem-solving and communication."],
  ["Project-aware", "Share a public GitHub repo and the interview can ask about what you actually built."],
  ["A practice plan", "Your report ends with concrete things to practice next, so the next session is better."],
];

const DIMS = [
  ["Technical correctness", "Are the facts and concepts right?"],
  ["Reasoning", "Can you explain why, not just what?"],
  ["Practical application", "Can you connect it to real code and real projects?"],
  ["Problem-solving", "How do you break a problem down?"],
  ["Communication", "Is your answer clear and well structured?"],
];

const FAQ = [
  ["Is the score a prediction of whether I'll get hired?", "No. It's a practice score that shows how your answers held up in this mock interview. Use it to find gaps, not to predict hiring outcomes."],
  ["What does it read from my GitHub repository?", "Only the public README, never the code. The GitHub link is optional."],
  ["How long is an interview?", "You choose 3, 5, 7 or 10 questions. You can also finish early and still get a report based on what you've answered."],
  ["Which roles and levels are supported?", "Frontend, Backend, Full Stack and Python developer roles, at Intern, Junior or Mid-level."],
];

function Preview() {
  return (
    <div className="preview card" aria-label="Example of the interview screen">
      <span className="tag">Example · Question 2 of 5</span>
      <h3>How would you stop a React component from re-rendering when its props haven't changed?</h3>
      <div className="mock-answer">I'd wrap it in React.memo and make sure the callbacks I pass down are stable…</div>
      <div className="mock-fb">
        <div className="row"><strong>Feedback</strong><strong>72/100</strong></div>
        <div className="bar"><i style={{ width: "72%" }} /></div>
        <span className="tag" style={{ marginTop: 12 }}>Follow-up based on your last answer</span>
        <p className="note">When would memoization actually make performance worse?</p>
      </div>
    </div>
  );
}

export default function Landing() {
  return (
    <div className="lp">
      <div className="lp-wrap">
        <Nav cta />

        <header className="hero">
          <span className="pill">AI mock technical interviews</span>
          <h1>Practice Smarter. Interview Better.</h1>
          <p className="lead">
            InterviewIQ AI runs a mock technical interview tailored to you, asks one question at a time,
            digs into weak answers, and tells you exactly what to improve.
          </p>
          <div className="cta-row">
            <Link to="/interview" className="btn">Start Your Interview</Link>
            <a href="#how" className="btn ghost">See how it works</a>
          </div>
          <p className="note">3 to 10 questions · Five-dimension scoring · Report with practice tasks</p>
          <Preview />
        </header>

        <section className="sec" aria-labelledby="problem">
          <h2 id="problem">Interview prep shouldn't be guesswork</h2>
          <p className="sec-lead">Most candidates practice alone, with no one to push back. That's where InterviewIQ helps.</p>
          <div className="grid">
            {PAIN.map(([t, d]) => <div className="card" key={t}><h3>{t}</h3><span className="note">{d}</span></div>)}
          </div>
        </section>

        <section className="sec" id="how" aria-labelledby="how-h">
          <h2 id="how-h">How it works</h2>
          <p className="sec-lead">From setup to report in four steps.</p>
          <ol className="steps">
            {STEPS.map(([t, d], i) => (
              <li className="card" key={t}>
                <span className="num">{i + 1}</span>
                <h3>{t}</h3>
                <span className="note">{d}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="sec" aria-labelledby="feat">
          <h2 id="feat">What you get</h2>
          <p className="sec-lead">Everything you need to turn practice into progress.</p>
          <div className="grid">
            {FEATURES.map(([t, d]) => <div className="card" key={t}><h3>{t}</h3><span className="note">{d}</span></div>)}
          </div>
        </section>

        <section className="sec" aria-labelledby="dims">
          <h2 id="dims">Scored on five dimensions</h2>
          <p className="sec-lead">You see where you're strong and where you lose points, not just one number.</p>
          <div className="card">
            {DIMS.map(([t, d]) => (
              <div className="dim" key={t}>
                <strong>{t}</strong>
                <span className="note">{d}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="sec" aria-labelledby="who">
          <h2 id="who">Built for developers starting their careers</h2>
          <p className="sec-lead">Pick the role and level you're aiming for and the skills you want to be asked about.</p>
          <div className="card">
            <div className="who-row"><span className="note">Roles</span>
              <div className="chips">{["Frontend", "Backend", "Full Stack", "Python"].map((x) => <span className="chip on" key={x}>{x}</span>)}</div></div>
            <div className="who-row"><span className="note">Levels</span>
              <div className="chips">{["Intern", "Junior", "Mid-level"].map((x) => <span className="chip on" key={x}>{x}</span>)}</div></div>
            <div className="who-row"><span className="note">Skills</span>
              <div className="chips">{["React", "JavaScript", "Python", "Java", "C++", "Node.js", "SQL", "MongoDB"].map((x) => <span className="chip" key={x}>{x}</span>)}</div></div>
          </div>
        </section>

        <section className="sec" aria-labelledby="faq">
          <h2 id="faq">Questions</h2>
          <div className="faq">
            {FAQ.map(([q, a]) => (
              <details className="card" key={q}>
                <summary>{q}</summary>
                <p className="note">{a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="final card">
          <h2>Ready for your first mock interview?</h2>
          <p className="sec-lead" style={{ margin: "0 auto 20px" }}>Set it up in under a minute and start answering.</p>
          <Link to="/interview" className="btn">Start Your Interview</Link>
        </section>

        <footer className="foot note">
          <span>© {new Date().getFullYear()} InterviewIQ AI</span>
          <span>Practice scores are not predictions of hiring outcomes.</span>
        </footer>
      </div>
    </div>
  );
}
