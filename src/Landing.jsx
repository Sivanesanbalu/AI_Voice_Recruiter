import React from "react";

export default function LandingPage({session,go,Button,Badge}){
  const steps=[
    ["01","Describe the role","Paste the JD, select categories, duration and whether a coding round is needed."],
    ["02","Review the interview","AI drafts role-specific questions and rubrics. Edit anything before publishing."],
    ["03","Share one link","Candidates upload a CV and complete a timed voice-first interview."],
    ["04","Review evidence","See transcripts, CV context, coding answers, per-question reasoning and category scores."]
  ];
  const features=[
    ["JD-aware design","Questions grounded in the real job description, not generic templates."],
    ["Voice + typed fallback","Questions are spoken aloud; candidates can answer by voice or type."],
    ["Coding rounds","Enable practical coding questions for software and technical roles."],
    ["Evidence-based scoring","Per-question reasoning, strengths, gaps and category breakdowns."],
    ["Recruiter control","Edit questions, close roles, export CSV and keep a reviewable audit trail."],
    ["Integrations","Connect Google Apps Script, Make, Zapier or your own webhook endpoint."]
  ];
  return <main className="landing">
    <section className="hero hero-real">
      <div className="hero-copy">
        <div className="hero-kicker"><span className="pulse-dot"/> AI interviews, human decisions</div>
        <h1>Structured first-round interviews that run <em>themselves.</em></h1>
        <p>InterviewOS turns a job description into a timed, role-specific interview and gives your team a consistent evidence trail to review — without replacing the human hiring decision.</p>
        <div className="actions hero-actions">
          <Button className="primary large" onClick={()=>go(session?"dashboard":"signup")}>{session?"Open recruiter dashboard":"Create your workspace"}</Button>
          <Button className="ghost large" onClick={()=>document.getElementById("how-it-works")?.scrollIntoView({behavior:"smooth"})}>See how it works ↓</Button>
        </div>
        <div className="hero-proof">
          <span>✓ Editable AI questions</span><span>✓ CV-aware context</span><span>✓ Voice + typed fallback</span><span>✓ Transparent scoring</span>
        </div>
      </div>

      <div className="product-preview">
        <div className="preview-bar"><i/><i/><i/><b>InterviewOS / Recruiter workspace</b></div>
        <div className="preview-body">
          <div className="preview-head"><div><small>Senior AI Engineer</small><h3>Candidate evidence</h3></div><Badge tone="success">completed</Badge></div>
          <div className="preview-stats"><div><small>Overall</small><strong>82%</strong></div><div><small>Technical</small><strong>8.6</strong></div><div><small>Problem solving</small><strong>8.2</strong></div></div>
          <div className="preview-answer"><small>Question 3 · Technical depth</small><b>How would you evaluate a production RAG system?</b><p>Candidate discussed retrieval quality, grounding, latency, failure analysis and online/offline metrics…</p><div className="preview-score"><span>Evidence-backed reasoning</span><strong>8 / 10</strong></div></div>
        </div>
      </div>
    </section>

    <section className="trust-strip"><span>Built for structured hiring workflows</span><b>Recruiting teams</b><b>Engineering teams</b><b>AI/ML roles</b><b>Operations roles</b></section>

    <section id="how-it-works" className="landing-section">
      <div className="section-heading"><span className="eyebrow">Workflow</span><h2>From role description to reviewable evidence.</h2><p>Automate the repetitive parts while keeping the recruiter in control.</p></div>
      <div className="steps-grid">{steps.map(([n,t,d])=><article className="step-card" key={n}><span>{n}</span><h3>{t}</h3><p>{d}</p></article>)}</div>
    </section>

    <section className="landing-section">
      <div className="section-heading"><span className="eyebrow">Product</span><h2>A complete interview workflow, not just a chatbot.</h2></div>
      <div className="feature-grid">{features.map(([t,d],i)=><article className="feature-card" key={t}><span className="feature-num">0{i+1}</span><h3>{t}</h3><p>{d}</p></article>)}</div>
    </section>

    <section className="landing-section split-showcase">
      <div><span className="eyebrow">Candidate experience</span><h2>Professional for the candidate. Useful for the recruiter.</h2><p>One guided interview room with CV upload, visible timing, question progress, voice playback, speech recognition when supported, typed fallback and coding input when needed.</p><ul className="check-list"><li>Timed session with refresh recovery</li><li>Voice delivery + typed fallback</li><li>CV upload with extraction fallback</li><li>Role-specific coding questions</li><li>Clear completion state</li></ul></div>
      <div className="candidate-mock card"><div className="between"><div><small>AI Engineer interview</small><h3>Question 4 of 8</h3></div><div className="timer mini">21:42</div></div><div className="progress"><span style={{width:"50%"}}/></div><Badge>Problem solving</Badge><h2>How would you diagnose a sudden drop in retrieval quality after a production deployment?</h2><textarea readOnly rows="5" value="I would first isolate whether the regression comes from indexing, embeddings, retrieval configuration, or downstream ranking..." /><div className="between"><Button className="ghost">🎙 Speak answer</Button><Button className="primary">Submit & next →</Button></div></div>
    </section>

    <section className="landing-section scoring-section">
      <div className="section-heading"><span className="eyebrow">Evaluation</span><h2>Scores your team can inspect.</h2><p>Every result is tied back to the candidate's answer. InterviewOS does not make the hiring decision.</p></div>
      <div className="scoring-grid"><div className="score-demo">{[["Technical depth",86],["Problem solving",82],["Communication",74]].map(([k,v])=><div key={k}><div className="between"><b>{k}</b><strong>{v/10} / 10</strong></div><div className="score-bar"><span style={{width:v+"%"}}/></div></div>)}</div><div className="evidence-card card"><span className="eyebrow">Evidence, not a verdict</span><h3>Reviewer gets</h3><ul className="check-list"><li>Per-question score and reasoning</li><li>Strengths and gaps tied to answers</li><li>Category score breakdown</li><li>CV claims separated from interview evidence</li><li>No automatic hire/reject label</li></ul></div></div>
    </section>

    <section className="guardrail-section">
      <article><b>Human-controlled questions</b><p>Recruiters review and edit every generated question before publishing.</p></article>
      <article><b>Evidence-only evaluation</b><p>Scoring is instructed to use explicit interview evidence, not personality or protected traits.</p></article>
      <article><b>No hidden decisioning</b><p>The product gives reviewers evidence and context instead of automatically deciding who gets hired.</p></article>
    </section>

    <section className="cta-panel"><div><span className="eyebrow">Start with one role</span><h2>Build your next first-round interview in minutes.</h2><p>Paste the job description, review the generated interview and share one candidate link.</p></div><Button className="primary large" onClick={()=>go(session?"dashboard":"signup")}>{session?"Open dashboard":"Create company workspace →"}</Button></section>

    <footer className="landing-footer"><b>InterviewOS</b><span>Structured AI interviews for hiring teams.</span><div><a onClick={()=>go("login")}>Recruiter login</a><a onClick={()=>go("signup")}>Create workspace</a></div></footer>
  </main>
}
