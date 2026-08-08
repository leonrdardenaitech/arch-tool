# ATLAS CORE: Hardware Sterilization & OS Flash Protocol

## 1. Safety Mandate: The Zero-SIM Rule
- **Directive:** Under no circumstances should an active SIM card be inserted into the device prior to sterilization.
- **Risk:** Bloatware/Spyware "dialing home" or exfiltrating local telemetry before the firewall is established.
- **Status:** RESTRICTED.

## 2. Sterilization Sequence (The Clean Slate)
### Step 1: Physical Disconnect
- Remove all external memory cards and SIM cards.
- Disable all automatic cloud-backups (Google/Samsung/Apple) during the initial OOBE.

### Step 2: Bootloader Unlock & Flash
- **Goal:** Replace the compromised vendor OS with a verified Open-Source build (e.g., LineageOS, GrapheneOS).
- **Procedure:**
  1. Boot to Fastboot mode.
  2. Execute `fastboot oem unlock` (where applicable).
  3. Flash verified clean system images.
  4. Perform a factory wipe (`Wipe Data / Factory Reset`) to ensure zero persistence of old vendor code.

### Step 3: Local-Only Provisioning
- Initialize the device without a network connection.
- Sideload only necessary technical apps via ADB.

## 3. Node 12 Extension: The On-The-Go Agent
Once sterilized, the device will be provisioned as a "Mobile Sensor Array" utilizing:
- **Local Browser Models:** (Transformers.js) for speech-to-text without cloud round-trips.
- **WebGPU Acceleration:** For real-time visual anchoring.
- **Secure Tunneling:** Zero data persistence beyond the local encrypted partition.

*STATUS: Sterilization Protocol Finalized. Awaiting Director's hardware execution.*
