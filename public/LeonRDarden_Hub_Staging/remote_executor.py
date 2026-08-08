import os
import time
import subprocess
import json
import pyautogui

# ATLAS CORE: Remote Executor (The Hands)
# This script listens for remote payloads via the Switchboard and executes OS-level macros.

COMMAND_LOG = r'C:\Users\Leonr\projects\arch-tool\public\LeonRDarden_Hub_Staging\remote_executions.log'

def log_execution(command, status):
    timestamp = time.strftime("%Y-%m-%d %H:%M:%S")
    with open(COMMAND_LOG, 'a') as f:
        f.write(f"[{timestamp}] CMD: {command} | STATUS: {status}\n")

def execute_macro(action_type, params):
    """Executes OS-level actions using PyAutoGUI."""
    try:
        if action_type == 'click':
            x, y = params.get('x'), params.get('y')
            if x is not None and y is not None:
                pyautogui.click(x, y)
                return True
        elif action_type == 'type':
            text = params.get('text')
            if text:
                pyautogui.write(text, interval=0.1)
                return True
        elif action_type == 'hotkey':
            keys = params.get('keys', [])
            if keys:
                pyautogui.hotkey(*keys)
                return True
        return False
    except Exception as e:
        print(f"[ERROR] Macro Execution: {e}")
        return False

def listen_for_remote():
    """Placeholder for Cloud-to-Edge payload listener."""
    print("=== [ATLAS] REMOTE EXECUTOR ACTIVE ===")
    print("[*] Listening for vision-anchored payloads...")
    
    # In a real scenario, this would be a Flask/FastAPI endpoint or 
    # a long-polling bridge to Slack/Discord.
    
    while True:
        # Check for mock payload in staging for testing
        mock_payload = r'C:\Users\Leonr\projects\arch-tool\public\LeonRDarden_Hub_Staging\remote_trigger.json'
        if os.path.exists(mock_payload):
            try:
                with open(mock_payload, 'r') as f:
                    data = json.load(f)
                
                action = data.get('action')
                params = data.get('params', {})
                
                print(f"\n[ATLAS CORE] Remote Trigger Detected: {action.upper()}")
                if execute_macro(action, params):
                    print(f"[+] SUCCESS: Macro {action} executed.")
                    log_execution(action, "SUCCESS")
                else:
                    print(f"[-] FAILED: Macro {action} failed.")
                    log_execution(action, "FAILED")
                
                # Consume payload
                os.remove(mock_payload)
            except Exception as e:
                print(f"[ERROR] Payload processing: {e}")
        
        time.sleep(2)

if __name__ == "__main__":
    listen_for_remote()
