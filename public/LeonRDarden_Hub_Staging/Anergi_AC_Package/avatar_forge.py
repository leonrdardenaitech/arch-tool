import os, glob, subprocess, shutil
import imageio_ffmpeg

print('\n[ATLAS CORE - FORGE] Initializing Avatar Master Protocol...')
exe = imageio_ffmpeg.get_ffmpeg_exe()

d_down = 'C:/Users/Leonr/Downloads'
d_hub = 'C:/Users/Leonr/projects/arch-tool/public/LeonRDarden_Hub_Staging/Anergi_AC_Package'
d_vid = os.path.join(d_hub, 'video').replace('\\', '/')

# 1. Target the Audio File
target_audio = os.path.join(d_vid, 'ac_overview.wav').replace('\\', '/')
if not os.path.exists(target_audio):
    print(f'\n[ERROR] Audio not found at {target_audio}')
    exit()
print(f'[ATLAS CORE] Audio Track Locked: {os.path.basename(target_audio)}')

# 2. Intake and Sort Video Clips from Downloads
down_mp4s = glob.glob(os.path.join(d_down, '*.mp4'))
if not down_mp4s:
    print(f'\n[ERROR] No MP4 files found in {d_down}.')
    exit()

# Isolate introEX.mp4
anchor_file = os.path.join(d_down, 'introEX.mp4').replace('\\', '/')
other_files = [f.replace('\\', '/') for f in down_mp4s if os.path.basename(f).lower() != 'introex.mp4']

# Sort remaining files chronologically
other_files.sort(key=os.path.getmtime)

if os.path.exists(anchor_file):
    print(f'[ATLAS CORE] Anchor clip found: introEX.mp4. Forcing to Index 0.')
    final_order = [anchor_file] + other_files
else:
    print(f'[ERROR] Anchor clip introEX.mp4 not found in {d_down}! Proceeding with chronological sort.')
    final_order = other_files

print(f'[ATLAS CORE] Moving and renaming {len(final_order)} clips to Staging Hub...')

video_files = []
for index, old_path in enumerate(final_order, start=1):
    # Prefixing with 'avatar_' to prevent any file overwriting
    new_filename = f"avatar_{index:05d}.mp4"
    new_path = os.path.join(d_vid, new_filename).replace('\\', '/')
    shutil.move(old_path, new_path)
    video_files.append(new_path)

# 3. Build the Video Manifest
list_vid = os.path.join(d_hub, 'avatar_video_list.txt').replace('\\', '/')
with open(list_vid, 'w', encoding='utf-8') as f:
    for vid in video_files:
        f.write(f"file '{vid}'\n")

# Unique output name to prevent overwriting the movie file
out_final = os.path.join(d_hub, 'Anergi_AC_Avatar_Masterpiece.mp4').replace('\\', '/')

print('[ATLAS CORE] Applying V16/V17 Protocols: Infinite Loop, Watermark Eraser, and Audio Sync...')

# 4. The FFmpeg Weld
res = subprocess.run([
    exe, '-y', 
    '-stream_loop', '-1', '-f', 'concat', '-safe', '0', '-i', list_vid, 
    '-i', target_audio, 
    '-filter_complex', '[0:v]crop=iw:ih-100:0:0[v]', 
    '-map', '[v]', '-map', '1:a:0', 
    '-c:v', 'libx264', '-preset', 'fast', '-crf', '18', 
    '-c:a', 'aac', '-b:a', '256k', 
    '-shortest', 
    out_final
], capture_output=True, text=True)

if res.returncode == 0:
    print('\n[ATLAS CORE] SUCCESS: Avatar Masterpiece is LOCKED! Watermark gone, video looped, audio synced.')
    os.startfile(d_hub)
else:
    print(f'\n[ERROR] Weld Failed: {res.stderr}')