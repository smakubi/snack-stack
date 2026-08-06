# SnackStack repository guidance

- Preserve the one-hour workshop shape: one active challenge at a time.
- Do not edit tests to make a challenge pass.
- Before changing challenge code, ask the learner for a one-sentence prediction.
- Run the smallest relevant test first, then the offline suite.
- Explain the evidence from the failing and passing test; do not only report success.
- Keep live model calls out of normal tests. Use fakes unless a test is marked `live`.
- Never read, print, or commit `.env.local` or API keys.
- Do not expose the instructor reference solution on the public branch.

