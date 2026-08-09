import dearpygui.dearpygui as dpg
import asyncio

print('\n[ATLAS CORE - FORGE] Initializing V2 Visual Authorization Widget...')

dpg.create_context()

# --- 1. The Executive Overrides (Button Callbacks) ---
def authorize_callback(sender, app_data):
    print("\n[ATLAS CORE] EXECUTION AUTHORIZED. Handing off to the headless NLE...")
    dpg.set_value("status_text", "Status: AUTHORIZED - Commencing Headless Render...")
    # In the full build, this will trigger the NLE's exact Python/FFmpeg script

def abort_callback(sender, app_data):
    # This acts as your physical terminal Kill Switch
    print("\n[ATLAS CORE] SNUFF IT OUT - ABORTING EXECUTION.")
    dpg.set_value("status_text", "Status: ABORTED - Kill Switch Activated.")

# --- 2. The Visual Timeline Dashboard ---
with dpg.window(label="PA Observability Dashboard", width=600, height=450, no_close=True):
    # FIX: Explicitly added the Yellow RGBA tuple so the script does not crash
    dpg.add_text("V2 Intercept Watchdog - Pending Execution", color=(255, 200, 0, 255))
    dpg.add_spacer(height=5)
    
    # 3. "Human Eyes" Observability Display
    dpg.add_text("Intercepted Payload (Human Eyes Only):")
    sample_payload = "python -c \"print('Executing Anergi VIP HeyGen Render...')\""
    
    # This multiline input acts as your terminal log so you can verify the AI's exact code
    dpg.add_input_text(multiline=True, default_value=sample_payload, width=-1, height=150, readonly=True)
    
    dpg.add_spacer(height=15)
    
    # 4. The Authorization Gate
    with dpg.group(horizontal=True):
        dpg.add_button(label="[ AUTHORIZE EXECUTION ]", width=250, height=40, callback=authorize_callback)
        dpg.add_button(label="[ SNUFF IT OUT - ABORT ]", width=250, height=40, callback=abort_callback)
        
    dpg.add_spacer(height=20)
    # FIX: Explicitly added the White RGBA tuple
    dpg.add_text("Status: Waiting for Watchdog intercept...", tag="status_text", color=(255, 255, 255, 255))

# Configure the Viewport
dpg.create_viewport(title='Atlas Core PA - Decoupled Factory Floor', width=650, height=500)
dpg.setup_dearpygui()
dpg.show_viewport()

# --- 5. The Asyncio Engine ---
async def main():
    while dpg.is_dearpygui_running():
        # Render the UI frame smoothly
        dpg.render_dearpygui_frame()
        # Yield control back to the event loop
        await asyncio.sleep(0.001)

# Ignite the asynchronous factory floor
asyncio.run(main())
dpg.destroy_context()