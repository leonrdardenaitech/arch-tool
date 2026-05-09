# ATLAS CORE: V3 Master Brain Architecture

## 1. The Brain & Guardrails (Control Plane)
- **Framework:** gemini-clicustom commands (.toml) and Cordum-inspired Safety Kernel.
- **Guardrails:** Native!{...}shell block parsing triggers a strict confirmation dialog before any OS command executes, preventing rogue injections.

## 2. The Mouth (Voice Interface)
- **Module:**pyttsx3
- **Function:** Python 3 offline text-to-speech library. Works with zero network delay to give Atlas a literal voice.

## 3. The Arms & Legs (Action Arm)
- **Arms (Web):** Gemma 4 WebGPU Browser Agent (Autonomous Web Clipper).
- **Legs (Local):** Python watchdogto monitor the file system andsubprocess to move assets.
