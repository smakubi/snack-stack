import argparse
import uuid
from typing import Any

from langchain_core.runnables import RunnableConfig
from langgraph.types import Command

from snackstack.graph import build_graph
from snackstack.schemas import StackState


def run_chat(*, live: bool = False) -> None:
    graph = build_graph(live=live)
    thread_id = str(uuid.uuid4())
    print("SnackStack is ready. Type 'quit' to exit or 'reset' for a new thread.")
    while True:
        query = input("You: ").strip()
        if query.lower() in {"quit", "exit"}:
            return
        if query.lower() == "reset":
            thread_id = str(uuid.uuid4())
            print("Conversation reset.")
            continue
        config: RunnableConfig = {"configurable": {"thread_id": thread_id}}
        initial_state: StackState = {"user_query": query, "messages": []}
        result = graph.invoke(initial_state, config=config)
        snapshot = graph.get_state(config)
        if snapshot.interrupts:
            answer = input("SnackStack needs an order ID, tracking ID, or email: ").strip()
            resume_command: Command[Any] = Command(resume=answer)
            result = graph.invoke(resume_command, config=config)
        print(f"SnackStack: {result.get('final_answer', '')}")


def main() -> None:
    parser = argparse.ArgumentParser(description="SnackStack one-hour agent lab")
    parser.add_argument("command", nargs="?", default="chat", choices=["chat"])
    parser.add_argument(
        "--live",
        action="store_true",
        help="Use OpenAI structured routing and synthesis; consumes API credits.",
    )
    args = parser.parse_args()
    run_chat(live=args.live)


if __name__ == "__main__":
    main()
