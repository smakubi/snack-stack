from langgraph.checkpoint.memory import InMemorySaver
from langgraph.graph import END, START, StateGraph
from langgraph.graph.state import CompiledStateGraph
from langgraph.types import Command

from snackstack.orders import extract_identifier, find_order, format_order, request_identifier
from snackstack.retrieval import format_menu, search_menu
from snackstack.routing import route_query
from snackstack.schemas import MenuSearchInput, StackState


def orchestrator_node(state: StackState, *, live: bool = False) -> StackState:
    if live:
        from snackstack.live import route_query_live

        return {"route": route_query_live(state["user_query"])}
    return {"route": route_query(state["user_query"])}


def menu_node(state: StackState) -> StackState:
    query = state["user_query"]
    lowered = query.lower()
    filters = MenuSearchInput(
        query=query,
        cuisine=next(
            (
                cuisine
                for cuisine in ("Indian", "Italian", "American", "Fusion")
                if cuisine.lower() in lowered
            ),
            None,
        ),
        category="main" if "main" in lowered or "food" in lowered else None,
        max_price=300 if "under 300" in lowered else None,
        dietary_tag="vegan" if "vegan" in lowered else None,
    )
    return {"menu_response": format_menu(search_menu(filters))}


def order_node(state: StackState) -> StackState:
    identifier = extract_identifier(state["user_query"]) or request_identifier()
    return {"order_response": format_order(find_order(identifier))}


def synthesize_node(state: StackState, *, live: bool = False) -> StackState:
    parts = [state.get("menu_response", ""), state.get("order_response", "")]
    if live:
        from snackstack.live import synthesize_live

        return {"final_answer": synthesize_live(*parts)}
    return {"final_answer": "\n\n".join(part for part in parts if part)}


def choose_next(state: StackState) -> str:
    agents = state["route"].agents
    if agents == ["order"]:
        return "order"
    if agents == ["menu"]:
        return "menu"
    return "menu_then_order"


def menu_then_order_node(state: StackState) -> Command[str]:
    menu_update = menu_node(state)
    return Command(update=menu_update, goto="order")


def build_graph(
    *, live: bool = False
) -> CompiledStateGraph[StackState, None, StackState, StackState]:
    builder = StateGraph(StackState)
    builder.add_node("orchestrator", lambda state: orchestrator_node(state, live=live))
    builder.add_node("menu", menu_node)
    builder.add_node("order", order_node)
    builder.add_node("menu_then_order", menu_then_order_node)
    builder.add_node("synthesize", lambda state: synthesize_node(state, live=live))
    builder.add_edge(START, "orchestrator")
    builder.add_conditional_edges("orchestrator", choose_next)
    builder.add_edge("menu", "synthesize")
    builder.add_edge("order", "synthesize")
    builder.add_edge("synthesize", END)
    return builder.compile(checkpointer=InMemorySaver())
