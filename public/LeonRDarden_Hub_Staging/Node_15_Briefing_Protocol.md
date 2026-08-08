# ATLAS CORE: Node 15 - Boardroom Briefing Protocol

## 1. Objective: Real-Time Operational Context
- **Role:** Executive Command Center Gateway.
- **Goal:** To provide the Director with an immediate audio-visual briefing upon system initialization.
- **Hardware:** Local system speakers (Piper TTS) + G:\Boardroom_Assets display.

## 2. The Briefing Logic (Automation)
### Phase 1: Geo-Awareness
- **Trigger:** System Awake.
- **Tool:** IP-API locator.
- **Action:** Detect current city/state and local time.
- **Sample Output:** "Good morning, Director. System active in Lithonia, Georgia. Current time is 09:14 AM."

### Phase 2: Pipeline State Audit
- **Trigger:** Handshake Success.
- **Tool:** Atlas Brain (Gemini).
- **Action:** Scan `Project_Status_Audit.md` for current blockers.
- **Sample Output:** "You have one critical blocker: FFmpeg is missing from the environment PATH. The Lofi Assembly is currently stalled."

### Phase 3: Creative Fuel Injection
- **Trigger:** Briefing Finalization.
- **Tool:** Lore Database (Fried Brains / Burn-1).
- **Action:** Retrieve the next scene in the generation queue.
- **Sample Output:** "Creative queue is primed. Scene 01 of Fried Brains is locked and awaiting your generation sprint."

## 3. The Voice: Piper Engine (The Mouth)
- **Model:** `en_US-lessac-medium.onnx`
- **Configuration:** 
  - `Rate:` 170
  - `Pitch:` High-fidelity, authoritative but calm.
- **Protocol:** `Speak_Text(briefing_payload)`

*STATUS: Node 15 Briefing Protocol Locked. Executive Command Center is fully provisioned.*
