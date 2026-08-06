import { TracePlayer } from "./_components/trace-player";

const challenges = [
  {
    number: "01",
    time: "15 min",
    title: "Constrain retrieval",
    concept: "Metadata first, similarity second.",
    prompt:
      "Implement composable cuisine, category, price, dietary, and availability filters before semantic ranking.",
    command:
      "uv run pytest -o addopts='' -m challenge tests/challenges/test_challenge_1_retrieval.py",
  },
  {
    number: "02",
    time: "15 min",
    title: "Route with evidence",
    concept: "Select one specialist—or both—and say why.",
    prompt:
      "Implement an explainable router for menu, order, and combined requests. Keep greetings on menu.",
    command:
      "uv run pytest -o addopts='' -m challenge tests/challenges/test_challenge_2_routing.py",
  },
  {
    number: "03",
    time: "10 min",
    title: "Pause and resume",
    concept: "Human input is part of graph execution.",
    prompt:
      "Use LangGraph interrupt to request a missing order identifier and return the resumed value.",
    command:
      "uv run pytest -o addopts='' -m challenge tests/challenges/test_challenge_3_hitl.py",
  },
];

export default function Home() {
  return (
    <main>
      <nav className="nav-wrap" aria-label="Primary navigation">
        <a className="brand" href="#top" aria-label="SnackStack home">
          <span className="brand-mark">S</span>
          <span>SnackStack</span>
        </a>
        <div className="nav-links">
          <a href="#lab">The lab</a>
          <a href="#trace">Trace demo</a>
          <a href="https://github.com/smakubi/snack-stack">GitHub</a>
        </div>
      </nav>

      <section className="hero" id="top">
        <div className="hero-copy">
          <div className="eyebrow"><span>One hour</span> · Three agent patterns · Tests as evidence</div>
          <h1>Don&apos;t hand-code the agent. <em>Direct it.</em></h1>
          <p className="hero-lede">
            Build the missing 15% of a food-delivery agent by giving a coding agent a clear contract,
            watching the test fail, and explaining why the fix works.
          </p>
          <div className="hero-actions">
            <a className="button primary" href="#setup">Start the lab</a>
            <a className="button secondary" href="#trace">Explore a trace</a>
          </div>
          <div className="hero-proof">
            <div><strong>85%</strong><span>scaffolded</span></div>
            <div><strong>3</strong><span>focused gaps</span></div>
            <div><strong>0</strong><span>API calls in CI</span></div>
          </div>
        </div>

        <div className="architecture-card" aria-label="SnackStack architecture">
          <div className="card-label">Live architecture</div>
          <div className="input-chip">“Pizza options + track ORD-203”</div>
          <div className="connector" />
          <div className="node orchestrator-node">
            <span className="node-kicker">01 / decide</span>
            <strong>Orchestrator</strong>
            <small>structured route</small>
          </div>
          <div className="branch-lines"><span /><span /></div>
          <div className="agent-row">
            <div className="node menu-node"><span>02A</span><strong>Menu</strong><small>retrieve</small></div>
            <div className="node order-node"><span>02B</span><strong>Order</strong><small>lookup</small></div>
          </div>
          <div className="merge-lines"><span /><span /></div>
          <div className="node answer-node"><span>03 / merge</span><strong>Grounded answer</strong></div>
        </div>
      </section>

      <section className="setup-strip" id="setup">
        <div>
          <span className="section-index">00</span>
          <div><h2>Ten-minute setup</h2><p>Your key stays local. Offline checks stay free.</p></div>
        </div>
        <pre><code>git clone https://github.com/smakubi/snack-stack.git{"\n"}cd snack-stack && uv sync{"\n"}cp .env.example .env.local{"\n"}uv run pytest</code></pre>
      </section>

      <section className="lab-section" id="lab">
        <div className="section-heading">
          <div><span className="section-index">01</span><h2>The lab</h2></div>
          <p>Predict. Prompt. Prove. Explain. Move on.</p>
        </div>
        <div className="challenge-grid">
          {challenges.map((challenge) => (
            <article className="challenge-card" key={challenge.number}>
              <div className="challenge-top"><span>{challenge.number}</span><time>{challenge.time}</time></div>
              <h3>{challenge.title}</h3>
              <p className="challenge-concept">{challenge.concept}</p>
              <div className="prompt-box"><span>Agent prompt</span><p>{challenge.prompt}</p></div>
              <details>
                <summary>Focused test command</summary>
                <code>{challenge.command}</code>
              </details>
            </article>
          ))}
        </div>
      </section>

      <section className="trace-section" id="trace">
        <div className="trace-copy">
          <span className="section-index">02</span>
          <h2>See what the agent actually did.</h2>
          <p>
            A polished answer can hide a bad route or an unsafe tool call. Step through curated traces
            and connect each visible behavior to the code you tested.
          </p>
          <ul>
            <li><span>Route</span> Which specialist owns the request?</li>
            <li><span>Tool</span> Which deterministic operation ran?</li>
            <li><span>Human</span> Where did execution pause and resume?</li>
          </ul>
        </div>
        <TracePlayer />
      </section>

      <section className="rubric-section">
        <div><span className="section-index">03</span><h2>Completion means evidence.</h2></div>
        <div className="rubric-grid">
          <div><strong>Tests</strong><p>All three focused checks pass without editing the tests.</p></div>
          <div><strong>Trace</strong><p>You can explain the route, tool call, and state transition.</p></div>
          <div><strong>Judgment</strong><p>You can name one production limitation of the lab.</p></div>
        </div>
      </section>

      <footer>
        <div className="brand"><span className="brand-mark">S</span><span>SnackStack</span></div>
        <p>Layered intelligence for food — built to be understood.</p>
        <a href="https://github.com/smakubi/snack-stack">Open the repository <span aria-hidden="true">↗</span></a>
      </footer>
    </main>
  );
}

