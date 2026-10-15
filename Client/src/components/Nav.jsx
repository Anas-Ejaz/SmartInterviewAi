import { Link } from "react-router-dom";

export default function Nav({ cta = false }) {
  return (
    <nav className="nav" aria-label="Main">
      <Link to="/" className="brand" style={{ marginBottom: 0, color: "inherit", textDecoration: "none" }}>
        <span className="logo" />InterviewIQ AI
      </Link>
      {cta && <Link to="/interview" className="btn sm">Start Interview</Link>}
    </nav>
  );
}
