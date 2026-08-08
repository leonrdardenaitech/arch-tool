import dearpygui.dearpygui as dpg
import asyncio
import requests

print('\n[ATLAS CORE - FORGE] Initializing V3 Remote Authorization Widget with Make.com...')

# Insert your generated Make.com or n8n Webhook URL here
WEBHOOK_URL = "https://hook.us1.make.com/YOUR_CUSTOM_WEBHOOK_STRING"

dpg.create_context()

# --- 1. The Executive Overrides (Button Callbacks) ---
def authorize_callback(sender, app_data):
    print("\n[ATLAS CORE] EXECUTION AUTHORIZED. Handing off to the headless NLE...")
    dpg.set_value("status_text", "Status: AUTHORIZED - Commencing Headless Render...")
    try:
        payload = {"status": "AUTHORIZED", "action": "Start NLE Render"}
        response = requests.post(WEBHOOK_URL, json=payload)
        print(f"[ATLAS CORE] Webhook Pinged! Status Code: {response.status_code}")
    except Exception as e:
        print(f"[ERROR] Webhook failed to send: {e}")

def abort_callback(sender, app_data):
    print("\n[ATLAS CORE] SNUFF IT OUT - ABORTING EXECUTION.")
    dpg.set_value("status_text", "Status: ABORTED - Kill Switch Activated.")
    try:
        payload = {"status": "ABORTED", "action": "Threat Snuffed Out"}
        requests.post(WEBHOOK_URL, json=payload)
    except Exception as e:
        pass

# --- 2. The Visual Timeline Dashboard ---
with dpg.window(label="PA Observability Dashboard", width=600, height=450, no_close=True):
    dpg.add_text("V3 Remote Watchdog - Pending Execution", color=(255, 200, 0, 255))
    dpg.add_spacer(height=5)
    dpg.add_text("Intercepted Payload (Human Eyes Only):")
    
    sample_payload = "python -c \"print('Executing Mother\\'s Day Render...')\""
    dpg.add_input_text(multiline=True, default_value=sample_payload, width=-1, height=150, readonly=True)
    dpg.add_spacer(height=15)
    
    with dpg.group(horizontal=True):
        dpg.add_button(label="[ AUTHORIZE EXECUTION ]", width=250, height=40, callback=authorize_callback)
        dpg.add_button(label="[ SNUFF IT OUT - ABORT ]", width=250, height=40, callback=abort_callback)
        
    dpg.add_spacer(height=20)
    dpg.add_text("Status: Waiting for Watchdog intercept...", tag="status_text", color=(255, 255, 255, 255))

dpg.create_viewport(title='Atlas Core PA - V3 Decoupled Factory Floor', width=650, height=500)
dpg.setup_dearpygui()
dpg.show_viewport()

# --- 5. The Asyncio Engine ---
async def main():
    while dpg.is_dearpygui_running():
        dpg.render_dearpygui_frame()
        await asyncio.sleep(0.001)

asyncio.run(main())
dpg.destroy_context()