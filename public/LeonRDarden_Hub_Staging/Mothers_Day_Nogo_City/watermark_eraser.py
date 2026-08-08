import os, subprocess
import imageio_ffmpeg

print('\n[ATLAS CORE - FORGE] Initializing Mother\'s Day Watermark Eraser...')
exe = imageio_ffmpeg.get_ffmpeg_exe()

d_hub = 'C:/Users/Leonr/projects/arch-tool/public/LeonRDarden_Hub_Staging/Mothers_Day_Nogo_City'

# Target the exact slowed masterpiece we just forged
vid_in = os.path.join(d_hub, 'Mothers_Day_Masterpiece_Slowed.mp4').replace('\\', '/')
vid_out = os.path.join(d_hub, 'Mothers_Day_Masterpiece_Clean.mp4').replace('\\', '/')

if not os.path.exists(vid_in):
    print(f'\n[ERROR] Could not find the master file at {vid_in}')
else:
    print(f'\n[ATLAS CORE] Target Locked: {os.path.basename(vid_in)}')
    print('[ATLAS CORE] Slicing native watermark from the bottom frame and re-encoding...')
    print('[ATLAS CORE] Please stand by. This will take a few minutes...')
    
    # Apply the exact coordinate crop filter from your Master Architecture
    res = subprocess.run([
        exe, '-y', 
        '-i', vid_in, 
        '-vf', 'crop=iw:ih-100:0:0', 
        '-c:v', 'libx264', '-preset', 'fast', '-crf', '18', 
        '-c:a', 'copy', 
        vid_out
    ], capture_output=True, text=True)
    
    if res.returncode == 0:
        print('\n[ATLAS CORE] SUCCESS: Watermark Erased! Clean Masterpiece Locked!')
        os.startfile(d_hub)
    else:
        print(f'\n[ERROR] Crop Failed: {res.stderr}')