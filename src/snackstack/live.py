from functools import lru_cache
from typing import cast

from langchain_core.messages import HumanMessage, SystemMessage
from langchain_openai import ChatOpenAI
from pydantic import SecretStr

from snackstack.config import get_settings
from snackstack.schemas import RouteDecision


@lru_cache
def get_chat_model() -> ChatOpenAI:
    settings = get_settings()
    if not settings.openai_api_key:
        raise RuntimeError("OPENAI_API_KEY is required for live mode")
    return ChatOpenAI(model=settings.model, api_key=SecretStr(settings.openai_api_key))


def route_query_live(query: str) -> RouteDecision:
    router = get_chat_model().with_structured_output(RouteDecision)
    result = router.invoke(
        [
            SystemMessage(
                content=(
                    "Route food, menu, and greeting requests to menu. Route order tracking "
                    "requests to order. Select both for genuinely combined requests."
                )
            ),
            HumanMessage(content=query),
        ]
    )
    return cast(RouteDecision, result)


def synthesize_live(menu_response: str, order_response: str) -> str:
    grounded = "\n\n".join(part for part in (menu_response, order_response) if part)
    response = get_chat_model().invoke(
        [
            SystemMessage(
                content=(
                    "Turn the supplied grounded SnackStack results into one concise, friendly "
                    "answer. Do not add dishes, prices, order details, or claims."
                )
            ),
            HumanMessage(content=grounded),
        ]
    )
    return str(response.content)
