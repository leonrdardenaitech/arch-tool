import os
import glob
import shutil

print('\n[ATLAS CORE - FORGE] Initializing V3 Custom Sort & Fetcher...')

d_down = 'C:/Users/Leonr/Downloads'
d_dest = 'C:/Users/Leonr/projects/arch-tool/public/LeonRDarden_Hub_Staging/Mothers_Day_Nogo_City/video'
os.makedirs(d_dest, exist_ok=True)

# 1. Sweep Downloads
files = glob.glob(os.path.join(d_down, '*.mp4'))

if not files:
    print(f'\n[ERROR] No MP4 files found in {d_down}.')
else:
    # 2. Sort chronologically by download time
    files.sort(key=os.path.getmtime)
    
    # 3. Handle the "Kink" (Extract the last 4 clips)
    if len(files) > 4:
        last_four = files[-4:]
        main_files = files[:-4]
        
        # 4. Find the anchor clip
        anchor_idx = -1
        for i, f in enumerate(main_files):
            if '86bcdbdc-9533-44f2-8a5a-fa81fbf6f565' in os.path.basename(f):
                anchor_idx = i
                break
        
        if anchor_idx != -1:
            print('\n[ATLAS CORE] Anchor clip found! Re-routing the last 4 clips directly behind it...')
            # Insert the 4 clips immediately after the anchor
            final_order = main_files[:anchor_idx+1] + last_four + main_files[anchor_idx+1:]
        else:
            print('\n[ERROR] Could not find the anchor clip! Proceeding with standard chronological sort...')
            final_order = files
    else:
        final_order = files
        
    print(f'\n[ATLAS CORE] Moving and renaming {len(final_order)} clips with Executive Override...')
    
    # 5. Move and rename sequentially
    for index, old_path in enumerate(final_order, start=1):
        new_filename = f"{index:05d}.mp4"
        new_path = os.path.join(d_dest, new_filename).replace('\\', '/')
        shutil.move(old_path, new_path)
        print(f" -> Extracted & Renamed: {os.path.basename(old_path)} to {new_filename}")
            
    print('\n[ATLAS CORE] SUCCESS: All files customized, sequenced, and locked in the NLE pipeline!')