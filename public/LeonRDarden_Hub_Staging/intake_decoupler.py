mport os, glob, subprocess, shutil
import imageio_ffmpeg

print('\n[ATLAS CORE - FORGE] Initializing MP3 Intake & Multiplexer Protocol...')
exe = imageio_ffmpeg.get_ffmpeg_exe()

d_down = 'C:/Users/Leonr/Downloads'
d_hub = 'C:/Users/Leonr/projects/arch-tool/public/LeonRDarden_Hub_Staging/Anergi_AC_Package'
d_vid = os.path.join(d_hub, 'video').replace('\\', '/')

# 1. Sweep Downloads exclusively for the new MP3
down_mp3s = glob.glob(os.path.join(d_down, '*.mp3'))

if not down_mp3s:
    print(f'\n[ERROR] No MP3 found in {d_down}. Ensure your 30-second audio track is there!')
    exit()

# 2. V3 Ghost Patch: Extract the audio string without using vulnerable square brackets
target_mp3 = None
for f in down_mp3s:
    target_mp3 = f.replace('\\', '/')
    break

new_audio_path = os.path.join(d_hub, os.path.basename(target_mp3)).replace('\\', '/')

print(f'[ATLAS CORE] Target Locked in Downloads: {os.path.basename(target_mp3)}')
print('[ATLAS CORE] Moving MP3 to Staging Hub...')

# Move the MP3 to the Hub
try:
    shutil.move(target_mp3, new_audio_path)
    print('[ATLAS CORE] SUCCESS: MP3 moved. Downloads folder is clean!')
except Exception as e:
    print(f'[ERROR] Could not move the file: {e}')
    exit()

# 3. Sweep for the 4 Video Clips
video_files = sorted(glob.glob(os.path.join(d_vid, '*.mp4')))

if not video_files:
    print('[ERROR] No video clips found in the /video folder.')
    exit()

# Build the Video Manifest
list_vid = os.path.join(d_hub, 'video_list.txt').replace('\\', '/')
with open(list_vid, 'w', encoding='utf-8') as f:
    for vid in video_files:
        f.write(f"file '{vid.replace(os.sep, '/')}'\n")

out_final = os.path.join(d_hub, 'Anergi_AC_Masterpiece.mp4').replace('\\', '/')

print('[ATLAS CORE] Applying V16 & V17 Protocols: Re-encoding video and mapping 30-second audio...')
print('[ATLAS CORE] The 4 clips will loop infinitely and cut perfectly when the audio finishes.')

# 4. The FFmpeg Weld (Looping Video + Shortest Cut)
res = subprocess.run([
    exe, '-y', 
    '-stream_loop', '-1', '-f', 'concat', '-safe', '0', '-i', list_vid, 
    '-i', new_audio_path, 
    '-map', '0:v:0', '-map', '1:a:0', 
    '-c:v', 'libx264', '-preset', 'fast', '-crf', '18', 
    '-c:a', 'aac', '-b:a', '256k', 
    '-shortest', 
    out_final
], capture_output=True, text=True)

if res.returncode == 0:
    print('\n[ATLAS CORE] SUCCESS: AC Skeleton & 30-Second Audio are LOCKED!')
    os.startfile(d_hub)
else:
    print(f'\n[ERROR] Weld Failed: {res.stderr}')