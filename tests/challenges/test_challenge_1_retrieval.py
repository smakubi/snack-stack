import pytest

from snackstack.retrieval import search_menu
from snackstack.schemas import MenuSearchInput

pytestmark = pytest.mark.challenge


def test_filters_vegan_available_items() -> None:
    results = search_menu(MenuSearchInput(query="vegan", dietary_tag="vegan"))
    assert {item["name"] for item in results} == {
        "Vegan Pasta Primavera",
        "Vegan Buddha Bowl",
    }


def test_filters_indian_mains_under_300() -> None:
    results = search_menu(
        MenuSearchInput(
            query="Indian mains under 300", cuisine="Indian", category="main", max_price=300
        )
    )
    assert [item["name"] for item in results] == ["Paneer Tikka"]
