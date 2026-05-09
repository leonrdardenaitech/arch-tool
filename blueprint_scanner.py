import time
import subprocess
import os
import sys

# === CONFIGURATION ===
# The "Atlas" Notebook ID (Broadcast Hub)
ATLAS_ID = "53fc92d9-bbec-4032-aa3d-32b4f50a1558"
POLL_INTERVAL = 30  # Increased responsiveness: 30 seconds
# Path to your existing Boardroom Loop script
LOOP_SCRIPT = r"G:\Coach_Scripts\boardroom_loop.py"

def get_latest_intent():
    """Queries the Atlas notebook for the most recent broadcasted intent."""
    print(f"[{time.strftime('%H:%M:%S')}] SCANNER: Checking Atlas for new blueprints...")
    
    # We look specifically for the ###DRAFT### tag in the Atlas brain
    query = "What is the most recent intent tagged with ###DRAFT###? Return ONLY the intent text after the tag. If none exists, say 'NONE'."
    
    try:
        # Using nlm CLI for direct polling
        cmd = ["nlm", "notebook", "query", ATLAS_ID, query]
        result = subprocess.run(cmd, capture_output=True, text=True, check=True)
        output = result.stdout
        
        # Parse the 'answer' from the output
        # The output looks like: value: {'answer': '...', ...}
        import re
        match = re.search(r"'answer':\s*'(.*?)'", output, re.DOTALL)
        if not match:
            # Try double quotes if single quotes aren't used
            match = re.search(r'"answer":\s*"(.*?)"', output, re.DOTALL)
            
        if match:
            intent = match.group(1).encode().decode('unicode_escape')
            if "NONE" not in intent.upper():
                return intent
        return None
    except Exception as e:
        print(f"!! SCANNER ERROR: {e}")
        return None

QUEUE_FILE = r'C:\Users\Leonr\projects\arch-tool\public\dispatch_queue.md'

def execute_intent(intent):
    """Dispatches the intent to the Execution Watchdog via the dispatch queue."""
    print(f"[*] SCANNER: Blueprint found! Filing to Dispatch Queue...")
    try:
        # Wrap the intent in the [EXECUTE] trigger for the Watchdog
        # We trigger the boardroom_loop.py script with the intent as an argument
        command = f'[EXECUTE]python "{LOOP_SCRIPT}" "{intent}"'
        
        with open(QUEUE_FILE, 'a') as f:
            f.write(f"\n{command}\n")
        
        print(f"[+] SCANNER: Dispatch filed. Awaiting Watchdog processing.")
    except Exception as e:
        print(f"!! DISPATCH ERROR: {e}")

def main():
    print(f"=== BLUEPRINT SCANNER ACTIVE ===")
    print(f"Monitoring Hub: Atlas ({ATLAS_ID})")
    print(f"Poll Rate: Every {POLL_INTERVAL}s")
    
    last_processed = ""
    
    while True:
        current_intent = get_latest_intent()
        
        if current_intent and current_intent != last_processed:
            execute_intent(current_intent)
            last_processed = current_intent
        else:
            print(f"[-] No new blueprints found.")
            
        time.sleep(POLL_INTERVAL)

if __name__ == "__main__":
    main()
