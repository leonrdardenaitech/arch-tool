# WaveSync 🌊: Acoustic-Immune Edge Control

**Touchless media control for the messy, the loud, and the busy.**

WaveSync is a localized, edge-computing utility designed to replace high-friction touch interfaces and cloud-dependent voice assistants. By repurposing a smartphone's hardware proximity sensor as an invisible tripwire, it allows users to control smart displays (Roku, Chromecast) via macro-gestures.

## 💡 The "Curb Cut" Problem & Solution
Standard interfaces fail in extreme physical environments:
*   **Acoustic Interference:** Voice assistants (Siri, Google) cannot process wake words over blenders, engines, or loud crowds.
*   **Micro-Dexterity Constraints:** Touchscreens require clean hands and fine motor control, alienating users with mobility limitations or those with messy hands.

**The Solution:** WaveSync utilizes localized sensor fusion. By mapping simple hand hovers to local Wi-Fi API payloads, the app provides instant, zero-latency screen control that is immune to ambient noise and requires zero physical precision.

## 🏗️ Technical Architecture
*   **Hardware Sensor Debouncing:** Custom logic layer with 500ms cooldown to prevent cascading network errors from sensor "flutter."
*   **Zero-Configuration Networking (mDNS):** Asynchronously scans local Wi-Fi for Cast-enabled devices via Android's `NsdManager`.
*   **Strategy Pattern for Multi-Protocol Routing:** Decoupled architecture to handle Roku (REST) and Google Cast (JSON/WebSockets) seamlessly.
*   **Battery-Preserving Foreground Service:** Optimized polling (`SENSOR_DELAY_NORMAL`) to maintain background functionality without CPU wakelock.

---

## 🏗️ Tech Stack
*   **Language:** Kotlin
*   **UI Framework:** Jetpack Compose (MVVM Architecture)
*   **Hardware APIs:** `SensorManager` (Proximity)
*   **Network:** `NsdManager` (mDNS), `HttpURLConnection`, WebSockets
*   **Concurrency:** Kotlin Coroutines & `StateFlow`
