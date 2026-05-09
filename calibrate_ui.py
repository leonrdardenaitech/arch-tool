import os

q = r'C:\Users\Leonr\projects\arch-tool\public\dispatch_queue.md'
if os.path.exists(q):
    open(q, 'w').close()

d = r'C:\Users\Leonr\projects\arch-tool\public\LeonRDarden_Hub_Staging'
os.makedirs(d, exist_ok=True)

config = """# UI CALIBRATION: 10-NODE ARRAY

## UI LOGIC
- MAX_NODES: 10
- LAUNCH_BUTTON_ACTION: Modal iFrame (Opens linked slide.html within the same CD preview window).

## SPECIFIC NODE ROUTING
- **Node 09:** Image-Driven Gallery (Visual Focus).
- **Node 10:** Local AI Copilot (Security Gateway Active. Required Access Code: "Hire Leon").

## RESILIENCE PROTOCOL
- execution_watcher.py must implement idempotent state tracking to prevent ghost-queue execution post-crash."""

with open(os.path.join(d, 'Portfolio_Calibration.md'), 'w', encoding='utf-8') as f:
    f.write(config)

print('\n[ATLAS CORE] Critical Desync Resolved. Ghost queue completely purged. CLI halted. 10-Node UI Calibration and "Hire Leon" gateway staged.')
