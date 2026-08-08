import os

print('\n[ATLAS CORE - FORGE] Expanding Nogo City Infrastructure...')

# Define the root and the new video sub-directory
base_dir = 'C:/Users/Leonr/projects/arch-tool/public/LeonRDarden_Hub_Staging/Mothers_Day_Nogo_City'
video_dir = os.path.join(base_dir, 'video').replace('\\', '/')

# Build the directory
os.makedirs(video_dir, exist_ok=True)

print(f'[ATLAS CORE] SUCCESS: The /video staging hub has been physically constructed at {video_dir}')
# The binary "ding" notification to confirm execution
print('\a')