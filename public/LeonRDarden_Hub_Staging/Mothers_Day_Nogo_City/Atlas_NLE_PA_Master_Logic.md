# ATLAS CORE: NLE & PA MASTER ARCHITECTURE
*(Dedicated Video Pipeline Knowledge Base)*

## 1. The PA (The Guard / Bastion Host)
- **The Local Router:** A single local Express or Python server acts as the exclusive API gateway. The cloud agent sends instructions in, and the local pipeline sends data out [1].
- **The "Snuff It Out" Kill Switch:** If an agent gets caught in a loop or hallucinates, the Director can sever the cloud bridge instantly via a terminal (Ctrl+C) [2].
- **Terminal Logging (Human Eyes):** All outbound cloud payloads are intercepted and printed to the terminal in plain English before execution to maintain strict observability [3].

## 2. The NLE (Visual Muscle & Coordinate Engine)
- **Absolute Coordinates:** The video canvas operates on a strict X,Y grid, allowing AI to manipulate layers programmatically without visual drag-and-drop [4, 6].
- **Media Processing:** The system physically detaches audio from video, creating two separate, independently editable tracks [7].
- **Smart Formatting:** The pipeline supports time-remapping, auto-cropping (Landscape 16:9 to Portrait 9:16), and dynamic Z-Index layering [7, 8].

## 3. The New Logic (Debugged Pipeline Fixes)
During the latest generation sprints, the following hard-coded fixes were established to prevent pipeline failures:
- **Defeating Video Freezes (V17 Protocol):** Never use the `-c copy` command when stitching generated AI clips with different timebases. Force FFmpeg to recalculate frames using `-c:v libx264`.
- **Defeating Silent Audio Bugs (V16 Protocol):** When a video file has an empty/silent audio track, explicitly force channel mapping (`-map 0:v:0` and `-map 1:a:0`) to delete the silence and weld the new audio track over the visual.
- **The Watermark Eraser:** Use coordinate video filtering (`-vf crop=iw:ih-100:0:0`) to mathematically slice native AI watermarks off the bottom of the canvas.
