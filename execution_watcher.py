import os
import time
import subprocess
import hashlib
import pyperclip
from datetime import datetime

# === CONFIGURATION ===
QUEUE_FILE = r'C:\Users\Leonr\projects\arch-tool\public\dispatch_queue.md'
LOG_FILE = r'C:\Users\Leonr\projects\arch-tool\public\completed_tasks.log'
POLL_INTERVAL = 1 # High-speed polling
LOOP_SCRIPT = r"G:\Coach_Scripts\boardroom_loop.py"

def get_task_hash(task_line):
    return hashlib.sha256(task_line.strip().encode('utf-8')).hexdigest()

def is_task_completed(task_hash):
    if not os.path.exists(LOG_FILE): return False
    with open(LOG_FILE, 'r') as f:
        return task_hash in f.read()

def mark_task_completed(task_hash, command):
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    with open(LOG_FILE, 'a') as f:
        f.write(f"{task_hash} | {timestamp} | {command}\n")

def execute_command(cmd, task_hash):
    print(f"[{datetime.now().strftime('%H:%M:%S')}] ATLAS: Executing Trigger...")
    print(f"[*] Executing: {cmd[:100]}...")
    try:
        # Direct execution
        process = subprocess.Popen(cmd, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        stdout, stderr = process.communicate()
        
        if process.returncode == 0:
            print(f"[+] SUCCESS: {stdout.strip()}")
            mark_task_completed(task_hash, cmd)
            return True
        else:
            print(f"[-] FAILED (Code {process.returncode}): {stderr.strip()}")
            return False
    except Exception as e:
        print(f"!! SYSTEM CRITICAL ERROR: {e}")
        return False

def process_clipboard():
    """Manual Bridge: If user copies '###DRAFT###' or '[BROADCAST]', it triggers immediately."""
    try:
        # Get raw clipboard content
        raw_text = pyperclip.paste()
        if not raw_text: return
        
        text = raw_text.strip()
        
        # Support both tags for maximum flexibility
        if text.startswith("###DRAFT###") or text.startswith("[BROADCAST]") or text.startswith("!!!"):
            force_retry = text.startswith("!!!")
            clean_text = text[3:] if force_retry else text
            
            task_hash = get_task_hash(clean_text)
            if force_retry or not is_task_completed(task_hash):
                print(f"[*] CLIPBOARD PULSE DETECTED (Len: {len(text)})")
                if force_retry: print("[!] Force Retry Active.")
                
                # Strip whichever tag is present and clean closing tags
                clean_intent = clean_text.replace("###DRAFT###", "").replace("[BROADCAST]", "").strip()
                clean_intent = clean_intent.replace("[/BROADCAST]", "").replace("[/EXECUTE]", "").strip()
                
                # Check if it's a raw command or needs to be wrapped for the loop script
                if clean_intent.startswith("python"):
                    cmd = clean_intent
                else:
                    cmd = f'python "{LOOP_SCRIPT}" "{clean_intent}"'
                
                success = execute_command(cmd, task_hash)
                
                # ONLY clear clipboard if it worked, so user can try again if it failed
                if success:
                    pyperclip.copy("")
                    print("[*] Clipboard cleared.")
            else:
                # To prevent spamming the console for already processed clipboard
                pass
    except Exception as e:
        # print(f"Clipboard Error: {e}")
        pass

def process_queue():
    if not os.path.exists(QUEUE_FILE) or os.path.getsize(QUEUE_FILE) == 0:
        return

    with open(QUEUE_FILE, 'r') as f:
        lines = f.readlines()

    new_queue = []
    executed_any = False

    for line in lines:
        clean_line = line.strip()
        if not clean_line: continue
        
        if clean_line.startswith('[EXECUTE]') or clean_line.startswith('[BROADCAST]'):
            cmd = clean_line.replace('[EXECUTE]', '').replace('[/EXECUTE]', '')
            cmd = cmd.replace('[BROADCAST]', '').replace('[/BROADCAST]', '').strip()
            
            if not cmd: continue

            task_hash = get_task_hash(clean_line)
            if not is_task_completed(task_hash):
                if execute_command(cmd, task_hash):
                    executed_any = True
                else:
                    # Keep failed commands in queue? No, log prevents loop, but let's keep it clean
                    executed_any = True 
            else:
                executed_any = True # Already done, remove from queue
        else:
            new_queue.append(line)

    if executed_any:
        with open(QUEUE_FILE, 'w') as f:
            f.writelines(new_queue)

def main():
    print(f"=== [ATLAS] ULTIMATE PULSE WATCHDOG V2 ===")
    print(f"[*] Monitoring Queue: {QUEUE_FILE}")
    print(f"[*] Monitoring Clipboard: Active")
    
    if not os.path.exists(LOG_FILE):
        with open(LOG_FILE, 'w') as f:
            f.write("# Atlas Pulse Log\n")

    while True:
        try:
            process_queue()
            process_clipboard()
        except Exception as e:
            print(f"!! Main Loop Error: {e}")
        time.sleep(POLL_INTERVAL)

if __name__ == "__main__":
    main()
