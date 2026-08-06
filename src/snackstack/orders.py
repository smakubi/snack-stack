import re

from langgraph.types import interrupt

from snackstack.data import ORDERS, Order

ORDER_ID = re.compile(r"\bORD-\d{3}\b", re.IGNORECASE)
TRACKING_ID = re.compile(r"\bSS\d{3}TRK\b", re.IGNORECASE)
EMAIL = re.compile(r"[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}", re.IGNORECASE)


def extract_identifier(query: str) -> str | None:
    for pattern in (ORDER_ID, TRACKING_ID, EMAIL):
        if match := pattern.search(query):
            return match.group(0).upper() if "@" not in match.group(0) else match.group(0).lower()
    return None


def request_identifier() -> str:
    """Challenge 3: pause execution and return the resumed identifier.

    Replace the starter placeholder with LangGraph's interrupt primitive.
    """
    return ""


def find_order(identifier: str) -> Order | None:
    normalized = identifier.strip()
    for order in ORDERS.values():
        if normalized.upper() in {order["order_id"], order["tracking_id"]}:
            return order
        if normalized.lower() == order["customer_email"].lower():
            return order
    return None


def format_order(order: Order | None) -> str:
    if order is None:
        return "I could not find an order with that identifier."
    return (
        f"{order['order_id']} for {order['item_name']} is {order['status']}. "
        f"Estimated delivery: {order['estimated_delivery']}."
    )


def reference_request_identifier() -> str:
    """Instructor helper used only to explain the intended primitive."""
    return str(interrupt({"prompt": "Please provide an order ID, tracking ID, or email."}))
