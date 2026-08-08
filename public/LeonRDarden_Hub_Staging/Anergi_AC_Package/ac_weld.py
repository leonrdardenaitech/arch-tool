import os, glob, subprocess
import imageio_ffmpeg

print('\n[ATLAS CORE - FORGE] Initializing AC Package Multiplexer (V2 Ghost Patch)...')
exe = imageio_ffmpeg.get_ffmpeg_exe()

d_hub = 'C:/Users/Leonr/projects/arch-tool/public/LeonRDarden_Hub_Staging/Anergi_AC_Package'
d_vid = os.path.join(d_hub, 'video').replace('\\', '/')

# 1. Sweep for Video and Audio Assets
video_files = sorted(glob.glob(os.path.join(d_vid, '*.mp4')))
audio_files = glob.glob(os.path.join(d_hub, '*.mp3')) + glob.glob(os.path.join(d_hub, '*.wav'))

if not video_files:
    print('[ERROR] No video clips found in the /video folder.')
    exit()
if not audio_files:
    print('[ERROR] No audio file found. Drop the downloaded NLM Audio Overview into the Anergi_AC_Package folder!')
    exit()

# 2. V2 Ghost Patch: Extract the string without using vulnerable square brackets
ac_audio = None
for f in audio_files:
    ac_audio = f.replace('\\', '/')
    break

print(f'[ATLAS CORE] Audio Track Locked: {os.path.basename(ac_audio)}')

# 3. Build the Video Manifest
list_vid = os.path.join(d_hub, 'video_list.txt').replace('\\', '/')
with open(list_vid, 'w', encoding='utf-8') as f:
    for vid in video_files:
        f.write(f"file '{vid.replace(os.sep, '/')}'\n")

out_final = os.path.join(d_hub, 'Anergi_AC_Masterpiece.mp4').replace('\\', '/')

print('[ATLAS CORE] Applying V16 & V17 Protocols: Re-encoding video and mapping audio...')
print('[ATLAS CORE] Visual skeleton will loop infinitely and cut perfectly when the audio finishes.')

# 4. The FFmpeg Weld (Looping Video + Shortest Cut)
res = subprocess.run([
    exe, '-y', 
    '-stream_loop', '-1', '-f', 'concat', '-safe', '0', '-i', list_vid, 
    '-i', ac_audio, 
    '-map', '0:v:0', '-map', '1:a:0', 
    '-c:v', 'libx264', '-preset', 'fast', '-crf', '18', 
    '-c:a', 'aac', '-b:a', '256k', 
    '-shortest', 
    out_final
], capture_output=True, text=True)

if res.returncode == 0:
    print('\n[ATLAS CORE] SUCCESS: AC Skeleton & Audio Overview are LOCKED!')
    os.startfile(d_hub)
else:
    print(f'\n[ERROR] Weld Failed: {res.stderr}')