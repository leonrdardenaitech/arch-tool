import os
import glob
import shutil

print('\n[ATLAS CORE - FORGE] Initializing AC Skeleton Fetcher...')

d_down = 'C:/Users/Leonr/Downloads'
d_dest = 'C:/Users/Leonr/projects/arch-tool/public/LeonRDarden_Hub_Staging/Anergi_AC_Package/video'
os.makedirs(d_dest, exist_ok=True)

# 1. Sweep Downloads for all MP4s
all_files = glob.glob(os.path.join(d_down, '*.mp4'))

if not all_files:
    print(f'\n[ERROR] No MP4 files found in {d_down}.')
    exit()

# 2. Target Lock: Isolate introEX.mp4
anchor_file = os.path.join(d_down, 'introEX.mp4').replace('\\', '/')

# Filter out the anchor from the main list so it isn't duplicated
other_files = [f.replace('\\', '/') for f in all_files if os.path.basename(f).lower() != 'introex.mp4']

# 3. Sort the remaining files chronologically by download time
other_files.sort(key=os.path.getmtime)

# 4. Weld the array: Anchor first, followed by chronological clips
if os.path.exists(anchor_file):
    print(f'\n[ATLAS CORE] Anchor clip found: introEX.mp4. Forcing to Index 0.')
    final_order = [anchor_file] + other_files
else:
    print(f'\n[ERROR] Anchor clip introEX.mp4 not found in {d_down}! Proceeding with standard chronological sort.')
    final_order = other_files

print(f'\n[ATLAS CORE] Moving and renaming {len(final_order)} clips...')

# 5. Extract and rename sequentially
for index, old_path in enumerate(final_order, start=1):
    new_filename = f"{index:05d}.mp4"
    new_path = os.path.join(d_dest, new_filename).replace('\\', '/')
    shutil.move(old_path, new_path)
    print(f" -> Extracted & Renamed: {os.path.basename(old_path)} to {new_filename}")

print('\n[ATLAS CORE] SUCCESS: AC Skeleton sequence locked! Ready for the NLM Audio Overview.')