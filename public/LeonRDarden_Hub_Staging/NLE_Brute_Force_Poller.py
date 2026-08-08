import os, time, shutil

drop_zone = r'C:\Users\Leonr\projects\arch-tool\public\LeonRDarden_Hub_Staging\NLE_Drop_Zone'
archive_zone = os.path.join(drop_zone, 'Processed_Archive')

os.makedirs(drop_zone, exist_ok=True)
os.makedirs(archive_zone, exist_ok=True)

print("==========================================")
print("[ATLAS CORE] BRUTE FORCE POLLING ACTIVE")
print("==========================================")
print(f"Patrolling Drop Zone every 2 seconds: {drop_zone}")

try:
    while True:
        for filename in os.listdir(drop_zone):
            if filename.endswith(".json"):
                filepath = os.path.join(drop_zone, filename)
                archive_path = os.path.join(archive_zone, filename)
                
                # Prevent processing incomplete files by checking size stability
                try:
                    initial_size = os.path.getsize(filepath)
                    time.sleep(0.5)
                    if initial_size != os.path.getsize(filepath):
                        continue
                        
                    print(f"\n[ATLAS CORE] Target Acquired: {filename}")
                    print("[ATLAS CORE] Bypassing UI. Headless execution protocol triggered...")
                    
                    # Execute NLE Logic here (simulated for now)
                    
                    # Move to archive to prevent infinite loop
                    shutil.move(filepath, archive_path)
                    print(f"[ATLAS CORE] Task complete. {filename} archived.")
                except Exception as e:
                    print(f"[ERROR] Failed to process {filename}: {e}")
        
        time.sleep(2)
except KeyboardInterrupt:
    print("\n[ATLAS CORE] Poller Offline.")
