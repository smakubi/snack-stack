import os

import pytest

from snackstack.config import get_settings

pytestmark = pytest.mark.live


@pytest.mark.skipif(not os.getenv("OPENAI_API_KEY"), reason="OPENAI_API_KEY is required")
def test_live_configuration_is_ready() -> None:
    settings = get_settings()
    assert settings.openai_api_key
    assert settings.model
