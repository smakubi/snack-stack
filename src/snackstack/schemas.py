from typing import Annotated, Literal, TypedDict

from langchain_core.messages import AnyMessage
from langgraph.graph.message import add_messages
from pydantic import BaseModel, Field

AgentName = Literal["menu", "order"]


class RouteDecision(BaseModel):
    agents: list[AgentName] = Field(min_length=1)
    reason: str = Field(min_length=3, max_length=160)


class MenuSearchInput(BaseModel):
    query: str
    cuisine: str | None = None
    category: str | None = None
    max_price: int | None = Field(default=None, ge=0)
    dietary_tag: str | None = None
    available_only: bool = True


class StackState(TypedDict, total=False):
    messages: Annotated[list[AnyMessage], add_messages]
    user_query: str
    route: RouteDecision
    menu_response: str
    order_response: str
    final_answer: str


class ChatRequest(BaseModel):
    message: str
    thread_id: str = "workshop"


class ResumeRequest(BaseModel):
    value: str
    thread_id: str = "workshop"


class ChatResponse(BaseModel):
    status: Literal["complete", "interrupted"]
    answer: str | None = None
    prompt: str | None = None
    route: list[AgentName] = Field(default_factory=list)
