import os
import time
import subprocess

# ATLAS CORE: NLM Ingestion Engine
# This script monitors the Gemma 4 Ingestion Dock and pushes new data to the Master Brain.

DOCK_DIR = r'C:\Users\Leonr\projects\arch-tool\public\LeonRDarden_Hub_Staging\NLM_Ingestion_Dock'
NOTEBOOK_ID = '53fc92d9-bbec-4032-aa3d-32b4f50a1558'
INGESTED_LOG = os.path.join(DOCK_DIR, '.ingested_history.log')

def get_ingested_files():
    if not os.path.exists(INGESTED_LOG): return set()
    with open(INGESTED_LOG, 'r') as f:
        return set(line.strip() for f in f.readlines())

def mark_ingested(filename):
    with open(INGESTED_LOG, 'a') as f:
        f.write(f"{filename}\n")

def check_auth():
    try:
        res = subprocess.run(['nlm', 'login', '--check'], capture_output=True, text=True)
        return "✓" in res.stdout
    except:
        return False

def ingest_dock():
    if not os.path.exists(DOCK_DIR):
        print(f"[ERROR] Ingestion Dock missing: {DOCK_DIR}")
        return

    if not check_auth():
        print("[IDLE] NotebookLM Auth Expired. Awaiting Director login...")
        return

    files = [f for f in os.listdir(DOCK_DIR) if f.endswith(('.md', '.txt')) and not f.startswith('.')]
    ingested = get_ingested_files()
    
    new_files = [f for f in files if f not in ingested]
    
    if not new_files:
        return

    print(f"\n[ATLAS CORE] New data detected in Ingestion Dock: {len(new_files)} items.")
    
    for f in new_files:
        path = os.path.join(DOCK_DIR, f)
        print(f"[*] Ingesting: {f} -> Atlas Brain...")
        
        # Using nlm CLI for direct ingestion
        cmd = f'nlm source add {NOTEBOOK_ID} --file "{path}"'
        res = subprocess.run(cmd, shell=True, capture_output=True, text=True)
        
        if res.returncode == 0:
            print(f"[+] SUCCESS: {f} integrated.")
            mark_ingested(f)
        else:
            print(f"[-] FAILED: {f}. Error: {res.stderr.strip()}")

def main():
    print("=== [ATLAS] NLM INGESTION ENGINE ACTIVE ===")
    print(f"[*] Monitoring Dock: {DOCK_DIR}")
    print(f"[*] Target Notebook: {NOTEBOOK_ID}")
    
    while True:
        try:
            ingest_dock()
        except Exception as e:
            print(f"\n[ERROR] Ingestion Loop: {e}")
        
        time.sleep(10) # 10s intervals for sync

if __name__ == "__main__":
    main()
