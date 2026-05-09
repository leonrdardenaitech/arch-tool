import json
import os

print("\n[ATLAS CORE] Welcome back, Director.")
token = input("Paste your Zapier MCP Token URL here: ")
conf = r'C:\Users\Leonr\projects\arch-tool\public\LeonRDarden_Hub_Staging\Atlas_MCP_Server\mcp_config.json'

if os.path.exists(conf):
    try:
        with open(conf, 'r') as f:
            data = json.load(f)
        
        data['mcpServers']['zapier-agent'] = {
            'command': 'npx',
            'args': ['-y', '@zapier/mcp'],
            'env': {'ZAPIER_TOOL_URL': token}
        }
        
        with open(conf, 'w') as f:
            json.dump(data, f, indent=2)
            
        print("\n[ATLAS CORE] SUCCESS! Zapier MCP linked to 8,000+ apps.")
    except Exception as e:
        print(f"\n[ATLAS CORE] Error processing config: {e}")
else:
    print("\n[ATLAS CORE] Error: mcp_config.json not found.")
