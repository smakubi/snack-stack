# Challenge Guide

## Challenge 1 — Retrieval

- Target: `src/snackstack/retrieval.py`
- Test: `uv run pytest -o addopts='' -m challenge tests/challenges/test_challenge_1_retrieval.py`
- Prompt: "Implement metadata filtering before semantic ranking. Preserve availability filtering and make every optional constraint composable."
- Reflect: Why should price filtering not be delegated to vector similarity?
- Reflect: Which test would catch an unavailable dish leaking into results?

## Challenge 2 — Routing

- Target: `src/snackstack/routing.py`
- Test: `uv run pytest -o addopts='' -m challenge tests/challenges/test_challenge_2_routing.py`
- Prompt: "Implement an explainable router that selects menu, order, or both. Keep greetings on menu and return a useful reason."
- Reflect: What makes a combined request different from an ambiguous request?
- Reflect: When would structured LLM routing be worth the extra latency?

## Challenge 3 — Human in the Loop

- Target: `src/snackstack/orders.py`
- Test: `uv run pytest -o addopts='' -m challenge tests/challenges/test_challenge_3_hitl.py`
- Prompt: "Use LangGraph interrupt to request a missing order identifier and return the resumed value. Keep the payload JSON-serializable."
- Reflect: Why does an interrupt require checkpointing and a thread ID?
- Reflect: Which side effects would be unsafe immediately before an interrupt?

