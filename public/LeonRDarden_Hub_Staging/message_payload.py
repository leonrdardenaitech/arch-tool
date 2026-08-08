import os
import winsound

print('\n[ATLAS CORE - FORGE] Processing Message Payload...')

# Define the staging directory using forward slashes
d_hub = 'C:/Users/Leonr/projects/arch-tool/public/LeonRDarden_Hub_Staging'
os.makedirs(d_hub, exist_ok=True)

# Define the target file
file_path = os.path.join(d_hub, 'Message_Body.md').replace('\\', '/')

# The Message or Body to drop
content = "# SECURE MESSAGE PROTOCOL\n\n## Status\nThe payload was executed successfully. The local bridge is fully operational."

# Write the file securely
with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print(f'[ATLAS CORE] SUCCESS: Message body dropped securely at {file_path}')

# [FORGE PATCH] The Guaranteed Ding: Bypassing the terminal mute using native Windows sound
# This triggers a 1000Hz tone for 500 milliseconds
winsound.Beep(1000, 500) 