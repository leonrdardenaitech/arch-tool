# ATLAS CORE: The Vision-Macro Pipeline

## The Evolution of the Macro
Transitioning from primitive, fixed-coordinate macros to dynamic, vision-anchored AI agents.

## Architecture: Cloud-to-Edge Tunneling
1. **The Remote Trigger:** A cloud agent receives an intent (e.g., from the Director\'s mobile device) and sends a secure webhook payload.
2. **The Secure Bridge:** A tunnel (Ngrok/Cloudflare) routes the payload through the firewall to the local Switchboard.
3. **The Local Executor (Hands & Eyes):**
   - **Action:** Python (PyAutoGUI) executes OS-level clicks and keystrokes.
   - **Visual Anchoring:** Gemma 4 (E2B/E4B) uses native vision to "see" the screen, providing dynamic coordinates for the macro to ensure total resilience against UI changes.
   - **Voice Feedback:** The local TTS engine provides real-time audio confirmation of task execution.

*STATUS: Lane selected. The Master Brain is aligned with the Director.*