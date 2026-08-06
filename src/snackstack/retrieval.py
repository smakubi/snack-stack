from snackstack.data import MENU, MenuItem
from snackstack.schemas import MenuSearchInput


def search_menu(filters: MenuSearchInput) -> list[MenuItem]:
    """Challenge 1: apply metadata constraints before semantic ranking.

    The starter intentionally returns every available item. Ask your coding agent
    to implement cuisine, category, maximum price, and dietary-tag filtering.
    """
    items = [item for item in MENU if item["available"] or not filters.available_only]
    return items


def format_menu(items: list[MenuItem]) -> str:
    if not items:
        return "I could not find a matching available item."
    return "\n".join(
        f"- {item['name']} — ₹{item['price']} ({item['cuisine']}, {item['rating']}/5)"
        for item in sorted(items, key=lambda item: (-item["rating"], item["price"]))
    )
