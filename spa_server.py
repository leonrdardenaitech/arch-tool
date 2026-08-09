import os 
from http.server import SimpleHTTPRequestHandler, HTTPServer 
class SPAHandler(SimpleHTTPRequestHandler): 
    def do_GET(self): 
        if not os.path.exists(self.translate_path(self.path)): 
            self.path = '/index.html' 
        return super().do_GET() 
HTTPServer(('', 8999), SPAHandler).serve_forever() 
