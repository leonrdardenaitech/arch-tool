import os, subprocess
import imageio_ffmpeg

print('\n[ATLAS CORE] Initializing V18 Missing Link Protocol...')
exe = imageio_ffmpeg.get_ffmpeg_exe()

d4 = 'C:/Users/Leonr/projects/burningonevideos/video/firstProject/00004folder'

# The 8 core segue clips
c1 = os.path.join(d4, 'introbag1.mp4').replace('\\', '/')
c2 = os.path.join(d4, 'goinginbag2.mp4').replace('\\', '/')
c3 = os.path.join(d4, 'carridingpass3.mp4').replace('\\', '/')
c4 = os.path.join(d4, 'pulloutcell4.mp4').replace('\\', '/')
c5 = os.path.join(d4, 'peopleinwidow5.mp4').replace('\\', '/')
c6 = os.path.join(d4, 'cellphonepocket6.mp4').replace('\\', '/')
c7 = os.path.join(d4, 'bringfood7.mp4').replace('\\', '/')
c8 = os.path.join(d4, 'eating8.mp4').replace('\\', '/')

# 1. Forge 00004a_4clip.mp4
txt_4a = os.path.join(d4, 'list_4a.txt').replace('\\', '/')
with open(txt_4a, 'w') as f:
    for clip in (c1, c2, c3, c4): f.write(f"file '{clip}'\n")
out_4a = os.path.join(d4, '00004a_4clip.mp4').replace('\\', '/')
print('[ATLAS CORE] Verifying/Forging 00004a_4clip.mp4...')
subprocess.run([exe, '-y', '-f', 'concat', '-safe', '0', '-i', txt_4a, '-c', 'copy', out_4a], capture_output=True)

# 2. Forge 00004_8clip.mp4
txt_8 = os.path.join(d4, 'list_8.txt').replace('\\', '/')
with open(txt_8, 'w') as f:
    for clip in (c1, c2, c3, c4, c5, c6, c7, c8): f.write(f"file '{clip}'\n")
out_8 = os.path.join(d4, '00004_8clip.mp4').replace('\\', '/')
print('[ATLAS CORE] Forging the missing 00004_8clip.mp4 buffer...')
res = subprocess.run([exe, '-y', '-f', 'concat', '-safe', '0', '-i', txt_8, '-c', 'copy', out_8], capture_output=True, text=True)

if res.returncode == 0:
    print('\n[ATLAS CORE] SUCCESS: Missing files forged!')
    print('[ATLAS CORE] You are now cleared to run v17_reencode.py again.')
else:
    print(f'\n[ERROR] {res.stderr}')