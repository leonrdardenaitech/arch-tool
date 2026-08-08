import os, glob, subprocess
import imageio_ffmpeg

print('\n[ATLAS CORE - FORGE] Initializing Absolute Hub Protocol...')
exe = imageio_ffmpeg.get_ffmpeg_exe()

d_hub = 'C:/Users/Leonr/projects/arch-tool/public/LeonRDarden_Hub_Staging/Anergi_AC_Package'
d_vid = os.path.join(d_hub, 'video').replace('\\', '/')

# 1. Sweep for the Audio File specifically inside the /video folder
audio_files = glob.glob(os.path.join(d_vid, '*.mp3')) + glob.glob(os.path.join(d_vid, '*.wav'))

if not audio_files:
    print(f'\n[ERROR] No audio file found in {d_vid}. Ensure your track is there!')
    exit()

# V3 Ghost Patch: Target lock the first audio file found
target_audio = None
for f in audio_files:
    target_audio = f.replace('\\', '/')
    break

print(f'[ATLAS CORE] Audio Track Locked: {os.path.basename(target_audio)}')

# 2. Sweep for the Video Clips inside the /video folder
video_files = sorted(glob.glob(os.path.join(d_vid, '*.mp4')))

if not video_files:
    print(f'[ERROR] No video clips found in {d_vid}.')
    exit()

print(f'[ATLAS CORE] Visual Tracks Locked: {len(video_files)} clips found.')

# Build the Video Manifest
list_vid = os.path.join(d_hub, 'video_list.txt').replace('\\', '/')
with open(list_vid, 'w', encoding='utf-8') as f:
    for vid in video_files:
        f.write(f"file '{vid.replace(os.sep, '/')}'\n")

# The final masterpiece will be dropped into the main Anergi_AC_Package folder
out_final = os.path.join(d_hub, 'Anergi_AC_Masterpiece_Final.mp4').replace('\\', '/')

print('[ATLAS CORE] Executing "One-Shot" Forge from the /video Hub...')
print('[ATLAS CORE] Stitching clips, cropping watermark, slowing to 1.5x, and welding audio...')

# 3. The One-Shot FFmpeg Execution
res = subprocess.run([
    exe, '-y', 
    '-f', 'concat', '-safe', '0', '-i', list_vid, 
    '-i', target_audio, 
    '-filter_complex', '[0:v]crop=iw:ih-100:0:0,setpts=1.5*PTS[v]', 
    '-map', '[v]', '-map', '1:a:0', 
    '-c:v', 'libx264', '-preset', 'fast', '-crf', '18', 
    '-c:a', 'aac', '-b:a', '256k', 
    '-shortest', 
    out_final
], capture_output=True, text=True)

if res.returncode == 0:
    print('\n[ATLAS CORE] SUCCESS: Masterpiece is LOCKED! Watermark gone, video slowed, audio synced.')
    os.startfile(d_hub)
else:
    print(f'\n[ERROR] Weld Failed: {res.stderr}')