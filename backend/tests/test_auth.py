from routes.auth import verify_token


def test_verify_token_returns_none_for_invalid_token():
    assert verify_token("invalid.token.here") is None


def test_verify_token_returns_none_for_empty_string():
    assert verify_token("") is None
