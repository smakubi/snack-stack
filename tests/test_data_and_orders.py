from snackstack.data import MENU, ORDERS
from snackstack.orders import extract_identifier, find_order


def test_catalog_and_order_fixture_sizes() -> None:
    assert len(MENU) == 8
    assert len(ORDERS) == 5


def test_extracts_supported_order_identifiers() -> None:
    assert extract_identifier("Track ORD-201") == "ORD-201"
    assert extract_identifier("Where is ss202trk?") == "SS202TRK"
    assert extract_identifier("Use priya@example.com") == "priya@example.com"


def test_finds_order_by_each_identifier_type() -> None:
    assert find_order("ORD-201")["item_name"] == "Butter Chicken"  # type: ignore[index]
    assert find_order("SS203TRK")["status"] == "Preparing"  # type: ignore[index]
    assert find_order("kavya@example.com")["order_id"] == "ORD-205"  # type: ignore[index]


def test_unknown_order_returns_none() -> None:
    assert find_order("ORD-999") is None
