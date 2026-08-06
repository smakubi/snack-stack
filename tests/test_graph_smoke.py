from snackstack.graph import build_graph


def test_graph_compiles_and_handles_greeting() -> None:
    graph = build_graph()
    result = graph.invoke(
        {"user_query": "hello", "messages": []},
        config={"configurable": {"thread_id": "smoke"}},
    )
    assert result["route"].agents == ["menu"]
    assert "Margherita Pizza" in result["final_answer"]
