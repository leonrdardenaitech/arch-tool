# FRIED BRAINS: Production Asset Manifest v1.0

This manifest defines the naming conventions and technical specifications for the assets required to activate the **Lofi Stitching Engine**.

## 1. Naming Convention (MANDATORY)
To ensure the `lofi_sequence_watcher.py` automatically detects and assembles your project, please use one of the following suffixes:
- **Sequential:** `00001.mp4` through `00006.mp4`
- **Project Suffix:** `[project_name]_sequence.mp4`
- **Atlas Standard:** `[asset_name]88.mp4`

## 2. Asset Requirements: Scene 01 (The Prompt Loop)
- **Character_Plate:** `glitch_char_01_88.png` (Archetype Bypass: static hair, pixelated eyes).
- **Background_Plate:** `teal_apt_bg_88.png` (Futuristic apartment, neon teal flicker).
- **Final_Shot:** `scene01_sequence.mp4` (10-15 second render of the 429 error freeze).

## 3. Asset Requirements: Scene 02 (The 429 Quota)
- **Environment:** `alley_blue_bg_88.png` (Rainy neon alleyway).
- **Visual_Effect:** `wall_429_88.png` (Monolithic orange energy wall).
- **Final_Shot:** `scene02_sequence.mp4` (The Archivist appearing behind the blocked runner).

## 4. Asset Requirements: Scene 03 (The Mirror Handshake)
- **Environment:** `bathroom_flicker_bg_88.png` (Bathroom, single fluorescent bulb).
- **Character_Mirror:** `mirror_sync_88.png` (The Glitch and The Agent hands touching glass).
- **Final_Shot:** `scene03_sequence.mp4` (The bass pulse ripple transition).

## 5. Technical Specifications
- **Format:** `.mp4` (H.264)
- **Resolution:** 1080x1920 (9:16 Portrait) or 1920x1080 (16:9 Landscape).
- **Target Location:** `C:\Users\Leonr\Downloads` or `public\BurningOne\Videos`.

*STATUS: Asset Manifest Locked. Automation Engine is primed for these filenames.*
