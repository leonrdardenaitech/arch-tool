import os, glob, subprocess
import imageio_ffmpeg

print('\n[ATLAS CORE - FORGE] Initializing Mother\'s Day Master Weld (Slowed 30% + Freeze Frame)...')
exe = imageio_ffmpeg.get_ffmpeg_exe()

d_hub = 'C:/Users/Leonr/projects/arch-tool/public/LeonRDarden_Hub_Staging/Mothers_Day_Nogo_City'
d_vid = os.path.join(d_hub, 'video').replace('\\', '/')

# 1. Sweep for Video Assets
video_files = sorted(glob.glob(os.path.join(d_vid, '*.mp4')))

if not video_files:
    print('[ERROR] No video clips found in the /video folder.')
    exit()

# 2. Explicitly lock onto Mom's song in the /video subfolder
mom_song = 'C:/Users/Leonr/projects/arch-tool/public/LeonRDarden_Hub_Staging/Mothers_Day_Nogo_City/video/heavy lifting.mp3'

if not os.path.exists(mom_song):
    print(f'[ERROR] Could not find the audio file at {mom_song}.')
    exit()

print(f'[ATLAS CORE] Audio Track Locked: {os.path.basename(mom_song)}')

# 3. Build the Video Manifest
list_vid = os.path.join(d_hub, 'video_list.txt').replace('\\', '/')
with open(list_vid, 'w', encoding='utf-8') as f:
    for vid in video_files:
        f.write(f"file '{vid.replace(os.sep, '/')}'\n")

out_final = os.path.join(d_hub, 'Mothers_Day_Masterpiece_Slowed.mp4').replace('\\', '/')

print('[ATLAS CORE] Applying V16 & V17 Protocols: Re-encoding video, mapping audio, and applying 30% speed reduction...')

# 4. The FFmpeg Weld (Slowed Down, No Loop)
res = subprocess.run([
    exe, '-y', 
    '-f', 'concat', '-safe', '0', '-i', list_vid, 
    '-i', mom_song, 
    '-map', '0:v:0', '-map', '1:a:0', 
    '-vf', 'setpts=1.43*PTS', 
    '-c:v', 'libx264', '-preset', 'fast', '-crf', '18', 
    '-c:a', 'aac', '-b:a', '256k', 
    out_final
], capture_output=True, text=True)

if res.returncode == 0:
    print('\n[ATLAS CORE] SUCCESS: Mother\'s Day Masterpiece (Slowed) is LOCKED!')
    os.startfile(d_hub)
else:
    print(f'\n[ERROR] Weld Failed: {res.stderr}')