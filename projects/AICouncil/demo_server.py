#!/usr/bin/env python3
"""
AICouncil Command Center - Demo Web Server
Serves a functional Command Center UI demo on localhost:8080
"""

import json
import mimetypes
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
from datetime import datetime

# HTML for Command Center Dashboard
COMMAND_CENTER_HTML = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AICouncil Command Center</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: #0f172a;
            color: #e2e8f0;
            line-height: 1.6;
        }
        .container { display: grid; grid-template-columns: 250px 1fr; height: 100vh; }
        
        /* Sidebar */
        .sidebar {
            background: #1e293b;
            border-right: 1px solid #334155;
            padding: 20px;
            overflow-y: auto;
        }
        .sidebar h1 { font-size: 18px; margin-bottom: 30px; color: #60a5fa; }
        .sidebar a {
            display: block;
            padding: 12px 15px;
            margin-bottom: 8px;
            border-radius: 6px;
            color: #cbd5e1;
            text-decoration: none;
            cursor: pointer;
            transition: all 0.2s;
        }
        .sidebar a:hover, .sidebar a.active {
            background: #334155;
            color: #60a5fa;
        }
        .sidebar a::before {
            margin-right: 10px;
            font-weight: bold;
        }
        
        /* Main Content */
        .main { display: flex; flex-direction: column; }
        .header {
            background: #1e293b;
            border-bottom: 1px solid #334155;
            padding: 20px 30px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .header h2 { color: #60a5fa; }
        .status-badge {
            background: #10b981;
            color: white;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 12px;
        }
        .content {
            flex: 1;
            padding: 30px;
            overflow-y: auto;
        }
        
        /* Cards */
        .card {
            background: #1e293b;
            border: 1px solid #334155;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 20px;
        }
        .card h3 { color: #60a5fa; margin-bottom: 15px; }
        
        /* Stats Grid */
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .stat-box {
            background: #334155;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
        }
        .stat-box .value { font-size: 28px; color: #60a5fa; font-weight: bold; }
        .stat-box .label { color: #94a3b8; font-size: 12px; margin-top: 5px; }
        
        /* Tables */
        table {
            width: 100%;
            border-collapse: collapse;
        }
        th {
            background: #0f172a;
            padding: 12px;
            text-align: left;
            color: #94a3b8;
            font-weight: 600;
            border-bottom: 1px solid #334155;
        }
        td {
            padding: 12px;
            border-bottom: 1px solid #334155;
        }
        tr:hover { background: #0f172a; }
        
        /* Buttons */
        .btn {
            background: #60a5fa;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 12px;
            transition: all 0.2s;
        }
        .btn:hover { background: #3b82f6; }
        .btn-small { padding: 5px 10px; font-size: 11px; }
        
        .success { color: #10b981; }
        .warning { color: #f59e0b; }
        .error { color: #ef4444; }
        
        .endpoint {
            background: #0f172a;
            padding: 12px;
            margin: 10px 0;
            border-left: 3px solid #60a5fa;
            border-radius: 4px;
            font-family: monospace;
            font-size: 12px;
        }
        .endpoint .method {
            display: inline-block;
            background: #334155;
            padding: 2px 6px;
            border-radius: 3px;
            margin-right: 10px;
        }
        
        .metric-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #334155;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Sidebar -->
        <div class="sidebar">
            <h1>⚡ AICouncil</h1>
            <a href="#" class="nav-item active" onclick="showSection('overview')">📊 Overview</a>
            <a href="#" class="nav-item" onclick="showSection('council')">🤝 Council Ops</a>
            <a href="#" class="nav-item" onclick="showSection('rag')">📚 RAG Manager</a>
            <a href="#" class="nav-item" onclick="showSection('agents')">🤖 Agents</a>
            <a href="#" class="nav-item" onclick="showSection('users')">👥 Users</a>
            <a href="#" class="nav-item" onclick="showSection('analytics')">📈 Analytics</a>
            <a href="#" class="nav-item" onclick="showSection('audit')">🔍 Audit</a>
            <a href="#" class="nav-item" onclick="showSection('system')">⚙️ System</a>
        </div>
        
        <!-- Main Content -->
        <div class="main">
            <!-- Header -->
            <div class="header">
                <h2>Command Center Dashboard</h2>
                <span class="status-badge">✓ All Systems Operational</span>
            </div>
            
            <!-- Content -->
            <div class="content">
                <!-- Overview Section -->
                <div id="overview-section" class="section">
                    <h2 style="margin-bottom: 20px; color: #60a5fa;">System Overview</h2>
                    
                    <div class="stats-grid">
                        <div class="stat-box">
                            <div class="value">106</div>
                            <div class="label">API Endpoints</div>
                        </div>
                        <div class="stat-box">
                            <div class="value">9</div>
                            <div class="label">Docker Services</div>
                        </div>
                        <div class="stat-box">
                            <div class="value">100%</div>
                            <div class="label">System Health</div>
                        </div>
                        <div class="stat-box">
                            <div class="value">1.2s</div>
                            <div class="label">Avg Response Time</div>
                        </div>
                    </div>
                    
                    <div class="card">
                        <h3>System Status</h3>
                        <div class="metric-row">
                            <span>Council API (8000)</span>
                            <span class="success">✓ Active</span>
                        </div>
                        <div class="metric-row">
                            <span>Commander API (8001)</span>
                            <span class="success">✓ Active</span>
                        </div>
                        <div class="metric-row">
                            <span>PostgreSQL (5432)</span>
                            <span class="success">✓ Connected</span>
                        </div>
                        <div class="metric-row">
                            <span>Redis (6379)</span>
                            <span class="success">✓ Connected</span>
                        </div>
                        <div class="metric-row">
                            <span>Chroma Vector DB (8003)</span>
                            <span class="success">✓ Healthy</span>
                        </div>
                    </div>
                    
                    <div class="card">
                        <h3>Quick Stats</h3>
                        <div class="metric-row">
                            <span>Total Deliberations</span>
                            <span style="color: #60a5fa;">1,247</span>
                        </div>
                        <div class="metric-row">
                            <span>Average Consensus</span>
                            <span style="color: #60a5fa;">75.3%</span>
                        </div>
                        <div class="metric-row">
                            <span>Active Users</span>
                            <span style="color: #60a5fa;">42</span>
                        </div>
                        <div class="metric-row">
                            <span>Documents in RAG</span>
                            <span style="color: #60a5fa;">234</span>
                        </div>
                    </div>
                </div>
                
                <!-- Council Section -->
                <div id="council-section" class="section" style="display: none;">
                    <h2 style="margin-bottom: 20px; color: #60a5fa;">Council Operations</h2>
                    <div class="card">
                        <h3>20 Endpoints Available</h3>
                        <div class="endpoint">
                            <span class="method">POST</span>/api/commander/council/deliberate
                        </div>
                        <div class="endpoint">
                            <span class="method">GET</span>/api/commander/council/sessions
                        </div>
                        <div class="endpoint">
                            <span class="method">PATCH</span>/api/commander/council/session/{id}/pause
                        </div>
                        <div class="endpoint">
                            <span class="method">GET</span>/api/commander/council/agents
                        </div>
                        <div class="endpoint">
                            <span class="method">POST</span>/api/commander/council/consensus/recompute
                        </div>
                    </div>
                    <div class="card">
                        <h3>Recent Deliberations</h3>
                        <table>
                            <thead>
                                <tr><th>Question</th><th>Agents</th><th>Consensus</th><th>Status</th></tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>What is wisdom?</td>
                                    <td>3</td>
                                    <td>78%</td>
                                    <td><span class="success">✓ Complete</span></td>
                                </tr>
                                <tr>
                                    <td>How do we achieve consensus?</td>
                                    <td>5</td>
                                    <td>72%</td>
                                    <td><span class="success">✓ Complete</span></td>
                                </tr>
                                <tr>
                                    <td>What matters most?</td>
                                    <td>4</td>
                                    <td>85%</td>
                                    <td><span class="success">✓ Complete</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                
                <!-- RAG Section -->
                <div id="rag-section" class="section" style="display: none;">
                    <h2 style="margin-bottom: 20px; color: #60a5fa;">RAG Management</h2>
                    <div class="card">
                        <h3>18 Endpoints Available</h3>
                        <div class="endpoint">
                            <span class="method">POST</span>/api/commander/rag/documents
                        </div>
                        <div class="endpoint">
                            <span class="method">GET</span>/api/commander/rag/documents
                        </div>
                        <div class="endpoint">
                            <span class="method">POST</span>/api/commander/rag/search
                        </div>
                        <div class="endpoint">
                            <span class="method">POST</span>/api/commander/rag/collections
                        </div>
                    </div>
                    <div class="card">
                        <h3>Document Collections</h3>
                        <table>
                            <thead>
                                <tr><th>Collection</th><th>Documents</th><th>Indexed</th></tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>documents_default</td>
                                    <td>45</td>
                                    <td><span class="success">✓</span></td>
                                </tr>
                                <tr>
                                    <td>code_samples</td>
                                    <td>12</td>
                                    <td><span class="success">✓</span></td>
                                </tr>
                                <tr>
                                    <td>policies</td>
                                    <td>8</td>
                                    <td><span class="success">✓</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                
                <!-- Agents Section -->
                <div id="agents-section" class="section" style="display: none;">
                    <h2 style="margin-bottom: 20px; color: #60a5fa;">Agent Marketplace</h2>
                    <div class="card">
                        <h3>13 Endpoints Available</h3>
                        <p>Create, clone, publish, and manage custom agents and workflows.</p>
                    </div>
                    <div class="card">
                        <h3>Active Agents</h3>
                        <table>
                            <thead>
                                <tr><th>Agent</th><th>Model</th><th>Performance</th><th>Status</th></tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Analyst</td>
                                    <td>GPT-4</td>
                                    <td>92%</td>
                                    <td><span class="success">✓ Enabled</span></td>
                                </tr>
                                <tr>
                                    <td>Synthesizer</td>
                                    <td>Claude</td>
                                    <td>88%</td>
                                    <td><span class="success">✓ Enabled</span></td>
                                </tr>
                                <tr>
                                    <td>Critic</td>
                                    <td>Llama 2</td>
                                    <td>85%</td>
                                    <td><span class="success">✓ Enabled</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                
                <!-- Users Section -->
                <div id="users-section" class="section" style="display: none;">
                    <h2 style="margin-bottom: 20px; color: #60a5fa;">User Management</h2>
                    <div class="card">
                        <h3>13 Endpoints Available</h3>
                        <p>Manage users, tenants, roles, and data residency.</p>
                    </div>
                    <div class="card">
                        <h3>Users & Tenants</h3>
                        <table>
                            <thead>
                                <tr><th>User</th><th>Tenant</th><th>Role</th><th>Status</th></tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>alice@aicouncil.dev</td>
                                    <td>ACME Corp</td>
                                    <td>Admin</td>
                                    <td><span class="success">✓ Active</span></td>
                                </tr>
                                <tr>
                                    <td>bob@aicouncil.dev</td>
                                    <td>TechCorp</td>
                                    <td>User</td>
                                    <td><span class="success">✓ Active</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                
                <!-- Analytics Section -->
                <div id="analytics-section" class="section" style="display: none;">
                    <h2 style="margin-bottom: 20px; color: #60a5fa;">Analytics & Reports</h2>
                    <div class="card">
                        <h3>14 Endpoints Available</h3>
                        <p>Consensus trends, agent ranking, cost tracking, usage analytics.</p>
                    </div>
                    <div class="card">
                        <h3>Consensus Trends (Last 30 Days)</h3>
                        <div class="metric-row">
                            <span>2025-12-03</span>
                            <span style="color: #60a5fa;">75.5% (12 sessions)</span>
                        </div>
                        <div class="metric-row">
                            <span>2025-12-02</span>
                            <span style="color: #60a5fa;">72.3% (10 sessions)</span>
                        </div>
                        <div class="metric-row">
                            <span>2025-12-01</span>
                            <span style="color: #60a5fa;">78.1% (15 sessions)</span>
                        </div>
                        <div class="metric-row">
                            <span>Average</span>
                            <span style="color: #10b981; font-weight: bold;">75.3%</span>
                        </div>
                    </div>
                </div>
                
                <!-- Audit Section -->
                <div id="audit-section" class="section" style="display: none;">
                    <h2 style="margin-bottom: 20px; color: #60a5fa;">Audit & Compliance</h2>
                    <div class="card">
                        <h3>11 Endpoints Available</h3>
                        <p>Comprehensive audit logging, GDPR compliance, data deletion.</p>
                    </div>
                    <div class="card">
                        <h3>Recent Audit Logs</h3>
                        <table>
                            <thead>
                                <tr><th>Timestamp</th><th>Actor</th><th>Action</th><th>Resource</th></tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>2025-12-03 15:42:06</td>
                                    <td>api</td>
                                    <td>create_deliberation</td>
                                    <td>session_1</td>
                                </tr>
                                <tr>
                                    <td>2025-12-03 15:41:23</td>
                                    <td>user_123</td>
                                    <td>upload_document</td>
                                    <td>doc_456</td>
                                </tr>
                                <tr>
                                    <td>2025-12-03 15:40:15</td>
                                    <td>admin</td>
                                    <td>create_user</td>
                                    <td>user_789</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                
                <!-- System Section -->
                <div id="system-section" class="section" style="display: none;">
                    <h2 style="margin-bottom: 20px; color: #60a5fa;">System Administration</h2>
                    <div class="card">
                        <h3>12 Endpoints Available</h3>
                        <p>Health monitoring, backups, migrations, resource usage.</p>
                    </div>
                    <div class="card">
                        <h3>System Health</h3>
                        <div class="metric-row">
                            <span>CPU Usage</span>
                            <span style="color: #60a5fa;">12.5%</span>
                        </div>
                        <div class="metric-row">
                            <span>Memory Usage</span>
                            <span style="color: #60a5fa;">35.2%</span>
                        </div>
                        <div class="metric-row">
                            <span>Disk Usage</span>
                            <span style="color: #60a5fa;">48.7%</span>
                        </div>
                        <div class="metric-row">
                            <span>Uptime</span>
                            <span style="color: #10b981;">3,600 seconds</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <script>
        function showSection(sectionName) {
            // Hide all sections
            document.querySelectorAll('.section').forEach(s => s.style.display = 'none');
            // Show selected section
            document.getElementById(sectionName + '-section').style.display = 'block';
            
            // Update active nav
            document.querySelectorAll('.nav-item').forEach(item => {
                item.classList.remove('active');
            });
            event.target.classList.add('active');
            event.preventDefault();
        }
    </script>
</body>
</html>
"""

class DemoHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        path = urlparse(self.path).path
        
        if path == '/' or path == '/command-center':
            self.send_response(200)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            self.wfile.write(COMMAND_CENTER_HTML.encode())
        
        elif path.startswith('/api/'):
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            response = {"status": "ok", "message": "API endpoint", "path": path}
            self.wfile.write(json.dumps(response).encode())
        
        else:
            self.send_response(404)
            self.end_headers()
    
    def log_message(self, format, *args):
        # Quiet logging
        pass

def main():
    print("\n" + "="*70)
    print("AICouncil Command Center - Demo Server")
    print("="*70)
    print("\n✅ Starting demo server on http://localhost:8080")
    print("\n📱 Open in browser:")
    print("   http://localhost:8080/command-center")
    print("\n🛑 To stop: Press Ctrl+C")
    print("\n" + "="*70 + "\n")
    
    try:
        server = HTTPServer(('localhost', 8080), DemoHandler)
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n\n✓ Server stopped")
        print("="*70 + "\n")

if __name__ == '__main__':
    main()
