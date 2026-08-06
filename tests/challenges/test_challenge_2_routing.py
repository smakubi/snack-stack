import pytest

from snackstack.routing import route_query

pytestmark = pytest.mark.challenge


@pytest.mark.parametrize(
    ("query", "expected"),
    [
        ("hello", ["menu"]),
        ("show vegan dishes", ["menu"]),
        ("track ORD-201", ["order"]),
        ("where is my order?", ["order"]),
        ("pizza options and track ORD-203", ["menu", "order"]),
    ],
)
def test_routes_to_the_required_specialists(query: str, expected: list[str]) -> None:
    assert route_query(query).agents == expected
