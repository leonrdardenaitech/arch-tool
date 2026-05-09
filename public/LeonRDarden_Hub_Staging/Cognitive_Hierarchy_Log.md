# ATLAS CORE: Cognitive Hierarchy

## 1. The Hands (Deterministic CLI)
- Components: execution_watcher.py, Docker endpoints, local Python scripts.
- Function: Operates on rigid, hardcoded loops. Incapable of contextual reasoning. Will execute until a programmed stopping condition is met or a crash occurs.

## 2. The Brain (Atlas/Gemini)
- Components: LLM Control Plane, Agentic Reasoning, MCP Routing.
- Function: Utilizes contextual awareness and Thinking Mode to read the Director's intent, act as a circuit breaker for failed local loops, and dynamically shift production priorities.