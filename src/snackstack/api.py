from typing import Any

from fastapi import FastAPI
from langchain_core.runnables import RunnableConfig
from langgraph.types import Command

from snackstack.graph import build_graph
from snackstack.schemas import ChatRequest, ChatResponse, ResumeRequest, StackState

app = FastAPI(title="SnackStack Lab API", version="0.1.0")
graph = build_graph()


@app.get("/api/health")
def health() -> dict[str, str]:
    return {"status": "ok", "mode": "learner-scaffold"}


@app.post("/api/chat", response_model=ChatResponse)
def chat(request: ChatRequest) -> ChatResponse:
    config: RunnableConfig = {"configurable": {"thread_id": request.thread_id}}
    initial_state: StackState = {"user_query": request.message, "messages": []}
    result = graph.invoke(initial_state, config=config)
    snapshot = graph.get_state(config)
    if snapshot.interrupts:
        payload = snapshot.interrupts[0].value
        prompt = (
            payload.get("prompt", "Please provide the missing information.")
            if isinstance(payload, dict)
            else str(payload)
        )
        return ChatResponse(status="interrupted", prompt=prompt)
    route = result.get("route")
    return ChatResponse(
        status="complete",
        answer=result.get("final_answer", ""),
        route=route.agents if route else [],
    )


@app.post("/api/chat/resume", response_model=ChatResponse)
def resume(request: ResumeRequest) -> ChatResponse:
    config: RunnableConfig = {"configurable": {"thread_id": request.thread_id}}
    resume_command: Command[Any] = Command(resume=request.value)
    result = graph.invoke(resume_command, config=config)
    route = result.get("route")
    return ChatResponse(
        status="complete",
        answer=result.get("final_answer", ""),
        route=route.agents if route else [],
    )
