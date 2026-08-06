import pytest
from pydantic import ValidationError

from snackstack.schemas import RouteDecision


def test_route_decision_accepts_one_or_both_agents() -> None:
    assert RouteDecision(agents=["menu"], reason="Greeting").agents == ["menu"]
    assert RouteDecision(agents=["menu", "order"], reason="Combined request").agents == [
        "menu",
        "order",
    ]


def test_route_decision_rejects_unknown_agent() -> None:
    with pytest.raises(ValidationError):
        RouteDecision.model_validate({"agents": ["billing"], "reason": "Wrong specialist"})
