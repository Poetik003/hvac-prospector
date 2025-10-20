#!/usr/bin/env python3
import http.server
import socketserver
import sys
import os

# Change to the webapp directory
os.chdir('/home/user/webapp')

PORT = 8080
Handler = http.server.SimpleHTTPRequestHandler

class QuietHTTPRequestHandler(Handler):
    def log_message(self, format, *args):
        # Override to provide more informative logging
        sys.stdout.write(f"[{self.log_date_time_string()}] {format % args}\n")
        sys.stdout.flush()

if __name__ == "__main__":
    with socketserver.TCPServer(("0.0.0.0", PORT), QuietHTTPRequestHandler) as httpd:
        print(f"ProSpector Pro server running on port {PORT}")
        print(f"Access the app at: http://localhost:{PORT}/Index.html")
        print(f"Serving directory: {os.getcwd()}")
        sys.stdout.flush()
        httpd.serve_forever()