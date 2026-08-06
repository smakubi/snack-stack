from snackstack.schemas import RouteDecision


def route_query(query: str) -> RouteDecision:
    """Challenge 2: select menu, order, or both specialists.

    The starter deliberately routes everything to menu. Implement a small,
    explainable baseline before comparing it with structured LLM routing.
    """
    return RouteDecision(agents=["menu"], reason="Starter route for the workshop")
