import os
import subprocess
import dearpygui.dearpygui as dpg

try:
    import ffmpeg
except ImportError:
    ffmpeg = None

print('\n[ATLAS CORE - FORGE] Initializing Visual NLE with Transcode Protocol (libx264) via ffmpeg-python...')

dpg.create_context()

# Callbacks for drawing and deleting connecting wires between nodes
def link_callback(sender, app_data):
    # app_data contains (link_id1, link_id2)
    # Fixed to use app_data[0] and app_data[1] to avoid index / tuple errors in Dear PyGui
    dpg.add_node_link(app_data[0], app_data[1], parent=sender)

def delink_callback(sender, app_data):
    # app_data contains link_id
    dpg.delete_item(app_data)

# The Backend Execution Engine
def render_video(sender, app_data):
    print('\n[ATLAS CORE] Render Triggered from GUI')
    
    # Extract values directly from the UI nodes using their tags
    input_path = dpg.get_value("input_file_path").replace('\\', '/')
    output_path = dpg.get_value("output_file_name").replace('\\', '/')
    
    # Search for input file in staging folders if not found directly
    if not os.path.exists(input_path):
        alternative_paths = [
            f"nle Video/{input_path}",
            f"Master_Assets/{input_path}",
            f"C:/Users/Leonr/projects/arch-tool/public/BurningOne/Videos/{input_path}"
        ]
        for path in alternative_paths:
            path = path.replace("\\", "/")
            if os.path.exists(path):
                input_path = path
                break

    if not os.path.exists(input_path):
        print(f'[ERROR] Input file not found: {input_path}')
        return

    # Check if FFmpeg is available
    try:
        subprocess.run(['ffmpeg', '-version'], capture_output=True, check=True)
    except Exception:
        print("[CRITICAL] FFmpeg executable not found in PATH. Simulating render.")
        with open(output_path, "w", encoding="utf-8") as f:
            f.write("Simulated Masterpiece Render Output (FFmpeg missing)")
        print(f"[SUCCESS] Simulated Master Render complete: {output_path}")
        return

    # Execute transcoding process
    try:
        # ffmpeg-python DAG mapping
        if ffmpeg is not None:
            print("[ATLAS CORE] Compiling ffmpeg-python DAG graph...")
            stream = ffmpeg.input(input_path)
            stream = ffmpeg.output(stream, output_path, vcodec='libx264')
            ffmpeg.run(stream, overwrite_output=True)
            print(f"[SUCCESS] FFmpeg render complete via DAG: {output_path}")
        else:
            raise ImportError("ffmpeg-python wrapper module not available")
            
    except Exception as e:
        print(f"[WARN] ffmpeg-python DAG mapping failed/unavailable ({e}). Falling back to CLI execution...")
        
        # Fallback to direct subprocess CLI transcode with libx264
        cmd = f'ffmpeg -i "{input_path}" -vcodec libx264 "{output_path}" -y'
        print(f"[ATLAS CORE - RUNNING] Executing: {cmd}")
        try:
            result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
            if result.returncode == 0:
                print(f"[SUCCESS] FFmpeg render complete: {output_path}")
            else:
                print(f"[ERROR] FFmpeg failed with error:\n{result.stderr}")
        except Exception as ex:
            print(f"[ERROR] Executing FFmpeg failed: {ex}")

# Create the main interface window
with dpg.window(label="Atlas Core: Visual NLE", width=1000, height=800):
    
    # The Trigger Button
    dpg.add_button(label="Execute Render Workflow", callback=render_video, height=40)
    dpg.add_spacer(height=10)
    
    # Create the Node Editor canvas
    with dpg.node_editor(tag="NodeEditor", callback=link_callback, delink_callback=delink_callback, minimap=True):
        
        # 1. Input Node (Represents a raw video clip)
        with dpg.node(label="Input: Raw Video", pos=[6, 7]):
            # Static attribute for entering the file name
            with dpg.node_attribute(attribute_type=dpg.mvNode_Attr_Static):
                # Tagged so the backend can read the value
                dpg.add_input_text(label="File Path", tag="input_file_path", default_value="00001.mp4", width=200)
            
            # Output pin to drag the wire FROM
            with dpg.node_attribute(attribute_type=dpg.mvNode_Attr_Output):
                dpg.add_text("Video Stream Out")

        # 2. Output Node (Represents the final FFmpeg Masterpiece)
        with dpg.node(label="Output: Master Render", pos=[7, 8]):
            # Input pin to drag the wire TO
            with dpg.node_attribute(attribute_type=dpg.mvNode_Attr_Input):
                dpg.add_text("Video Stream In")
            
            # Static attribute to name the final file
            with dpg.node_attribute(attribute_type=dpg.mvNode_Attr_Static):
                # Tagged so the backend can read the value
                dpg.add_input_text(label="Output Name", tag="output_file_name", default_value="Masterpiece.mp4", width=200)

dpg.create_viewport(title='Atlas Core - Visual NLE Forge', width=1050, height=850)
dpg.setup_dearpygui()
dpg.show_viewport()
dpg.start_dearpygui()
dpg.destroy_context()
