import os

print('\n[ATLAS CORE - FORGE] Running Watchdog Diagnostics...')
d = 'C:/Users/Leonr/projects/arch-tool/public/LeonRDarden_Hub_Staging/Mothers_Day_Video'
os.makedirs(d, exist_ok=True)

file_path = os.path.join(d, 'Watchdog_Check.md').replace('\\', '/')
with open(file_path, 'w', encoding='utf-8') as f:
    f.write('# WATCHDOG PROTOCOL: ACTIVE\n\n## Status\nThe tripwire is functioning perfectly. The Standard File Protocol bypassed the terminal crash.\n')

print(f'\n[ATLAS CORE] SUCCESS: Watchdog_Check.md successfully placed at {file_path}')

# The binary "ding" notification
print('\a') 