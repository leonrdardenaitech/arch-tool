# ATLAS CORE: MCP Router
import sys

def route_intent(intent):
    if 'qr' in intent.lower():
        return 'Routing to QR MCP...'
    if 'voice' in intent.lower():
        return 'Routing to Voice MCP...'
    return 'Intent unrecognized. Defaulting to Master Brain.'

if __name__ == '__main__':
    print(route_intent(sys.argv[1] if len(sys.argv) > 1 else ''))
