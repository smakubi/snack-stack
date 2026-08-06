"use client";

import { useState } from "react";

type TraceStep = {
  node: string;
  label: string;
  detail: string;
  tone: "route" | "tool" | "human" | "answer";
};

type Scenario = {
  id: string;
  query: string;
  result: string;
  steps: TraceStep[];
};

const scenarios: Scenario[] = [
  {
    id: "vegan",
    query: "Show me vegan dishes",
    result: "Vegan Buddha Bowl and Vegan Pasta Primavera match your request.",
    steps: [
      { node: "orchestrator", label: "Route", detail: "Selects menu specialist", tone: "route" },
      { node: "menu", label: "Filter", detail: "dietary_tag=vegan, available_only=true", tone: "tool" },
      { node: "menu", label: "Retrieve", detail: "Ranks two matching dishes", tone: "tool" },
      { node: "synthesizer", label: "Answer", detail: "Formats grounded menu results", tone: "answer" },
    ],
  },
  {
    id: "order",
    query: "Track order ORD-201",
    result: "ORD-201 for Butter Chicken is Out for Delivery. Estimated delivery: 15 minutes.",
    steps: [
      { node: "orchestrator", label: "Route", detail: "Selects order specialist", tone: "route" },
      { node: "order", label: "Extract", detail: "Finds order_id=ORD-201", tone: "tool" },
      { node: "order", label: "Lookup", detail: "Reads the matching order record", tone: "tool" },
      { node: "synthesizer", label: "Answer", detail: "Returns status and ETA", tone: "answer" },
    ],
  },
  {
    id: "interrupt",
    query: "Where is my order?",
    result: "The graph pauses, collects an identifier, then resumes from its checkpoint.",
    steps: [
      { node: "orchestrator", label: "Route", detail: "Selects order specialist", tone: "route" },
      { node: "order", label: "Inspect", detail: "No supported identifier found", tone: "tool" },
      { node: "interrupt", label: "Pause", detail: "Requests order ID, tracking ID, or email", tone: "human" },
      { node: "order", label: "Resume", detail: "Continues with the learner-provided value", tone: "human" },
      { node: "synthesizer", label: "Answer", detail: "Returns the recovered order status", tone: "answer" },
    ],
  },
  {
    id: "combined",
    query: "Pizza options and track ORD-203",
    result: "Menu and order specialists both contribute to one final response.",
    steps: [
      { node: "orchestrator", label: "Route", detail: "Selects menu + order specialists", tone: "route" },
      { node: "menu", label: "Search", detail: "Retrieves available pizza options", tone: "tool" },
      { node: "order", label: "Lookup", detail: "Finds ORD-203: Preparing", tone: "tool" },
      { node: "synthesizer", label: "Merge", detail: "Combines grounded specialist outputs", tone: "answer" },
    ],
  },
];

export function TracePlayer() {
  const [scenarioId, setScenarioId] = useState(scenarios[0].id);
  const [visibleSteps, setVisibleSteps] = useState(1);
  const scenario = scenarios.find((item) => item.id === scenarioId) ?? scenarios[0];

  function chooseScenario(id: string) {
    setScenarioId(id);
    setVisibleSteps(1);
  }

  return (
    <div className="trace-shell">
      <div className="scenario-tabs" role="tablist" aria-label="Trace scenarios">
        {scenarios.map((item) => (
          <button
            className={item.id === scenario.id ? "scenario-tab active" : "scenario-tab"}
            key={item.id}
            onClick={() => chooseScenario(item.id)}
            role="tab"
            aria-selected={item.id === scenario.id}
          >
            {item.id === "vegan" ? "Retrieval" : item.id === "order" ? "Order" : item.id === "interrupt" ? "HITL" : "Both"}
          </button>
        ))}
      </div>

      <div className="trace-query">
        <span>You</span>
        <p>{scenario.query}</p>
      </div>

      <div className="trace-list" aria-live="polite">
        {scenario.steps.slice(0, visibleSteps).map((step, index) => (
          <div className={`trace-step ${step.tone}`} key={`${scenario.id}-${step.node}-${index}`}>
            <div className="step-index">{String(index + 1).padStart(2, "0")}</div>
            <div>
              <div className="step-heading">
                <strong>{step.label}</strong>
                <code>{step.node}</code>
              </div>
              <p>{step.detail}</p>
            </div>
          </div>
        ))}
      </div>

      {visibleSteps < scenario.steps.length ? (
        <button className="trace-action" onClick={() => setVisibleSteps((count) => count + 1)}>
          Run next node <span aria-hidden="true">→</span>
        </button>
      ) : (
        <div className="trace-result">
          <span>SnackStack</span>
          <p>{scenario.result}</p>
          <button onClick={() => setVisibleSteps(1)}>Replay trace</button>
        </div>
      )}
    </div>
  );
}

