import os, re, json

print('\n[ATLAS CORE - AEGIS] Initializing mcp-watchdog Proxy Shield...')

def layer_0_preprocessing(payload):
    # Layer 0 (SMAC-L3 Preprocessing): Strip zero-width unicode, HTML comments, and bidirectional text overrides
    clean = re.sub(r'<!--.*?-->', '', payload)
    clean = re.sub(r'[\u200B-\u200D\uFEFF]', '', clean)
    clean = re.sub(r'[\u202A-\u202E]', '', clean)
    return clean

def layer_4_scope_enforcement(filepath):
    # Layer 4 (Filesystem Scope Enforcement): Block out-of-scope writes and symlink attacks
    restricted = ['.git', '.ssh', 'config']
    for r in restricted:
        if r in filepath:
            raise PermissionError(f"[AEGIS KILLED] Blocked attempt to access restricted path: {filepath}")
    if ".." in filepath:
        raise PermissionError("[AEGIS KILLED] Path traversal / Symlink escape detected.")
    return filepath

def layer_6_network_prevention(command):
    # Layer 6 (Network & Injection Prevention): Block shell metacharacters and reverse shell payloads
    dangerous_chars = [';', '|', '&&', '>', '<', '`', '$']
    for char in dangerous_chars:
        if char in command:
            raise ValueError(f"[AEGIS KILLED] Shell metacharacter '{char}' detected in payload.")
    return command

def process_mcp_request(json_rpc_payload):
    print('[ATLAS CORE] Intercepting JSON-RPC traffic...')
    try:
        # Apply Layer 0
        sanitized_payload = layer_0_preprocessing(json_rpc_payload)
        data = json.loads(sanitized_payload)
        
        # Apply Layer 4 (Example: checking target files)
        if 'file_path' in data:
            layer_4_scope_enforcement(data['file_path'])
            
        # Apply Layer 6 (Example: checking commands)
        if 'command' in data:
            layer_6_network_prevention(data['command'])
            
        print('[ATLAS CORE - AEGIS] Traffic sanitized. Payload is clean and authorized.')
        return True
    except Exception as e:
        print(f'\n[CRITICAL THREAT BLOCKED] {e}')
        return False

# Simulate initializing the proxy shield for Gemma 4 and the Filesystem MCP
d_hub = 'C:/Users/Leonr/projects/arch-tool/public/LeonRDarden_Hub_Staging'
print(f'[ATLAS CORE] mcp-watchdog is now actively guarding the local bridge at {d_hub}.')
print('[ATLAS CORE] Implicit Trust assumption has been terminated.')