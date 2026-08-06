import pytest

import snackstack.orders as order_module

pytestmark = pytest.mark.challenge


def test_request_identifier_uses_interrupt(monkeypatch: pytest.MonkeyPatch) -> None:
    captured: dict[str, object] = {}

    def fake_interrupt(payload: object) -> str:
        captured["payload"] = payload
        return "ORD-201"

    monkeypatch.setattr(order_module, "interrupt", fake_interrupt)
    assert order_module.request_identifier() == "ORD-201"
    assert captured["payload"] == {"prompt": "Please provide an order ID, tracking ID, or email."}
