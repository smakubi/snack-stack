# SnackStack

SnackStack is a one-hour, coding-agent-guided lab for learning the parts of an agent system that matter: retrieval constraints, specialist routing, and resumable human input.

## Try the visual agent

Open [the deployed SnackStack Agent Lab](https://portal-eta-teal-87.vercel.app/#agent) to type or speak a request and optionally hear the answer read aloud. The public playground mirrors the workshop's menu, order, routing, and human-input patterns with deterministic local data, so it requires no API key and creates no model spend. Open **View agent evidence** under a reply to inspect its route and tool steps.

Voice input uses the browser's speech-recognition API and works best in current Chrome, Edge, or Safari. Grant microphone permission when prompted. The speaker button controls spoken answers.

## What learners build

The repository is intentionally about 85% complete. A coding agent helps finish three small gaps while focused tests make the behavior visible.

1. Filter menu retrieval by cuisine, category, price, dietary tag, and availability.
2. Route a query to the menu agent, order agent, or both.
3. Pause the graph for a missing order identifier and resume safely.

## Ten-minute setup

```bash
git clone https://github.com/smakubi/snack-stack.git
cd snack-stack
cp .env.example .env.local
uv sync
uv run pytest
```

Add your own `OPENAI_API_KEY` to `.env.local` only when you want to run live exercises. Offline tests do not need a key.

Start the CLI:

```bash
uv run snackstack chat
```

After adding your own key, opt into model-backed structured routing and synthesis:

```bash
uv run snackstack chat --live
```

When `LANGSMITH_TRACING=true` and `LANGSMITH_API_KEY` are present, those live calls appear in the `snackstack-lab` tracing project.

Start the API:

```bash
uv run uvicorn snackstack.api:app --reload
```

## One-hour schedule

| Time | Activity |
| --- | --- |
| 0–10 | Setup, smoke test, architecture |
| 10–25 | Challenge 1: retrieval constraints |
| 25–40 | Challenge 2: specialist routing |
| 40–50 | Challenge 3: interrupt and resume |
| 50–60 | Scenario run, trace review, production limits |

Open `.agents/skills/snackstack-coach/references/challenges.md` for the prompts, commands, and reflection questions. In Codex, invoke `$snackstack-coach` directly.

## Test commands

```bash
# Offline checks used by CI
uv run pytest

# A focused learner challenge
uv run pytest -o addopts='' -m challenge tests/challenges/test_challenge_1_retrieval.py

# Formatting and typing
uv run ruff check .
uv run mypy
```

## Development-only choices

The lab uses `InMemorySaver`, so conversation state disappears when the process restarts. Production systems need a persistent checkpointer, secret management, rate limits, privacy controls, and monitored evaluations. Those topics are discussed in the workshop but intentionally not implemented in this one-hour version.
