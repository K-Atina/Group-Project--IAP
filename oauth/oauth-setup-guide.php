<!DOCTYPE html>
<html>
<head>
    <title>OAuth Setup Information - MyTikiti</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }
        .container {
            background: white;
            padding: 40px;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        .header {
            text-align: center;
            margin-bottom: 40px;
        }
        h1 {
            color: #2c3e50;
            font-size: 2.5rem;
            margin-bottom: 10px;
        }
        .subtitle {
            color: #7f8c8d;
            font-size: 1.2rem;
            margin-bottom: 30px;
        }
        h2 {
            color: #34495e;
            margin-top: 40px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .provider-section {
            background: #f8f9fa;
            border-radius: 10px;
            padding: 25px;
            margin: 20px 0;
            border-left: 5px solid #3498db;
        }
        .google-section {
            border-left-color: #4285f4;
        }
        .microsoft-section {
            border-left-color: #0078d4;
        }
        .step {
            background: white;
            padding: 20px;
            margin: 15px 0;
            border-radius: 8px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            transition: transform 0.2s ease;
        }
        .step:hover {
            transform: translateY(-2px);
        }
        .step-number {
            background: #3498db;
            color: white;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            margin-right: 15px;
            font-weight: bold;
        }
        .code {
            background: #2c3e50;
            color: #ecf0f1;
            padding: 20px;
            border-radius: 8px;
            font-family: 'Consolas', 'Monaco', monospace;
            overflow-x: auto;
            margin: 15px 0;
            border: 1px solid #34495e;
        }
        .warning {
            background: linear-gradient(45deg, #fff3cd, #ffeaa7);
            color: #856404;
            padding: 20px;
            border-radius: 8px;
            margin: 15px 0;
            border-left: 5px solid #ffc107;
        }
        .success {
            background: linear-gradient(45deg, #d4edda, #c3e6cb);
            color: #155724;
            padding: 20px;
            border-radius: 8px;
            margin: 15px 0;
            border-left: 5px solid #28a745;
        }
        .info {
            background: linear-gradient(45deg, #d1ecf1, #b8daff);
            color: #0c5460;
            padding: 20px;
            border-radius: 8px;
            margin: 15px 0;
            border-left: 5px solid #17a2b8;
        }
        .btn {
            display: inline-block;
            padding: 12px 24px;
            background: #3498db;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            transition: background 0.3s;
            margin: 5px;
        }
        .btn:hover {
            background: #2980b9;
        }
        .btn-google {
            background: #4285f4;
        }
        .btn-google:hover {
            background: #3367d6;
        }
        .btn-microsoft {
            background: #0078d4;
        }
        .btn-microsoft:hover {
            background: #106ebe;
        }
        .grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin: 20px 0;
        }
        @media (max-width: 768px) {
            .grid {
                grid-template-columns: 1fr;
            }
        }
        .status-indicator {
            display: inline-block;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            margin-right: 8px;
        }
        .status-configured {
            background: #28a745;
        }
        .status-not-configured {
            background: #dc3545;
        }
        .config-status {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 10px;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔐 OAuth Integration Setup</h1>
            <p class="subtitle">Professional Authentication for MyTikiti Platform</p>
        </div>

        <div class="config-status">
            <h3>🚀 Current Configuration Status</h3>
            <div>
                <span class="status-indicator <?php echo (!empty($_ENV['GOOGLE_CLIENT_ID']) && $_ENV['GOOGLE_CLIENT_ID'] !== 'your_google_client_id_here') ? 'status-configured' : 'status-not-configured'; ?>"></span>
                <strong>Google OAuth:</strong> <?php echo (!empty($_ENV['GOOGLE_CLIENT_ID']) && $_ENV['GOOGLE_CLIENT_ID'] !== 'your_google_client_id_here') ? 'Configured' : 'Not Configured'; ?>
            </div>
            <div style="margin-top: 10px;">
                <span class="status-indicator <?php echo (!empty($_ENV['MICROSOFT_CLIENT_ID']) && $_ENV['MICROSOFT_CLIENT_ID'] !== 'your_microsoft_client_id_here') ? 'status-configured' : 'status-not-configured'; ?>"></span>
                <strong>Microsoft OAuth:</strong> <?php echo (!empty($_ENV['MICROSOFT_CLIENT_ID']) && $_ENV['MICROSOFT_CLIENT_ID'] !== 'your_microsoft_client_id_here') ? 'Configured' : 'Not Configured'; ?>
            </div>
        </div>
        
        <div class="warning">
            <strong>⚠️ Important:</strong> Professional OAuth integration requires proper setup with Google and Microsoft developer consoles. This enables secure, seamless authentication for your users.
        </div>

        <div class="grid">
            <div class="provider-section google-section">
                <h2>🎯 Google OAuth Setup</h2>
                
                <div class="step">
                    <span class="step-number">1</span>
                    <strong>Google Cloud Console:</strong> Visit <a href="https://console.developers.google.com/" target="_blank" class="btn btn-google">Google Cloud Console</a>
                </div>
                
                <div class="step">
                    <span class="step-number">2</span>
                    <strong>Create Project:</strong> Create a new project or select existing one for MyTikiti
                </div>
                
                <div class="step">
                    <span class="step-number">3</span>
                    <strong>Enable APIs:</strong> Enable Google+ API and Google Identity Services
                </div>
                
                <div class="step">
                    <span class="step-number">4</span>
                    <strong>OAuth Credentials:</strong> Create OAuth 2.0 Client IDs in Credentials section
                </div>
                
                <div class="step">
                    <span class="step-number">5</span>
                    <strong>Redirect URI:</strong> Add this exact URL:
                    <div class="code">http://localhost:8000/oauth/google-login.php</div>
                </div>
            </div>

            <div class="provider-section microsoft-section">
                <h2>🏢 Microsoft OAuth Setup</h2>
                
                <div class="step">
                    <span class="step-number">1</span>
                    <strong>Azure Portal:</strong> Visit <a href="https://portal.azure.com/" target="_blank" class="btn btn-microsoft">Azure Portal</a>
                </div>
                
                <div class="step">
                    <span class="step-number">2</span>
                    <strong>App Registration:</strong> Navigate to Azure Active Directory → App registrations
                </div>
                
                <div class="step">
                    <span class="step-number">3</span>
                    <strong>New Registration:</strong> Click "New registration" and configure MyTikiti app
                </div>
                
                <div class="step">
                    <span class="step-number">4</span>
                    <strong>Redirect URI:</strong> Set Web platform redirect URI:
                    <div class="code">http://localhost:8000/oauth/microsoft-login.php</div>
                </div>
                
                <div class="step">
                    <span class="step-number">5</span>
                    <strong>Permissions:</strong> Add Microsoft Graph permissions for User.Read, email, profile
                </div>
            </div>
        </div>

        <div class="info">
            <h3>🔧 Environment Configuration</h3>
            <p>Create or update your <strong>.env</strong> file in the project root with your OAuth credentials:</p>
        </div>
        
        <div class="code">
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_actual_google_client_id_here
GOOGLE_CLIENT_SECRET=your_actual_google_client_secret_here

# Microsoft OAuth Configuration  
MICROSOFT_CLIENT_ID=your_actual_microsoft_client_id_here
MICROSOFT_CLIENT_SECRET=your_actual_microsoft_client_secret_here

# Email Configuration (existing)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your_email@gmail.com
SMTP_PASSWORD=your_app_password
SMTP_FROM=your_email@gmail.com
        </div>

        <div class="success">
            <h3>✅ Post-Setup Benefits</h3>
            <ul>
                <li><strong>Seamless Authentication:</strong> Users can sign in with one click</li>
                <li><strong>Enhanced Security:</strong> No password storage for OAuth users</li>
                <li><strong>Professional Experience:</strong> Enterprise-grade authentication</li>
                <li><strong>Automatic Account Creation:</strong> New users are registered automatically</li>
                <li><strong>Email Verification Skip:</strong> OAuth providers handle email verification</li>
            </ul>
        </div>

        <div class="provider-section">
            <h2>🧪 Testing Your OAuth Setup</h2>
            
            <div class="step">
                <span class="step-number">1</span>
                <strong>Environment Check:</strong> Ensure your .env file contains valid OAuth credentials
            </div>
            
            <div class="step">
                <span class="step-number">2</span>
                <strong>Button Test:</strong> Try OAuth buttons on login/signup pages
            </div>
            
            <div class="step">
                <span class="step-number">3</span>
                <strong>Flow Verification:</strong> Complete the OAuth flow and verify automatic login
            </div>
            
            <div class="step">
                <span class="step-number">4</span>
                <strong>Account Creation:</strong> Test with new accounts to verify auto-registration
            </div>
        </div>

        <div class="warning">
            <h3>🔒 Security Best Practices</h3>
            <ul>
                <li><strong>Environment Variables:</strong> Never commit .env files to version control</li>
                <li><strong>HTTPS in Production:</strong> Use HTTPS URLs for production redirect URIs</li>
                <li><strong>Scope Limitation:</strong> Only request necessary OAuth scopes</li>
                <li><strong>Token Management:</strong> Implement proper token refresh logic if needed</li>
            </ul>
        </div>

        <div style="text-align: center; margin-top: 40px;">
            <a href="../login.php" class="btn">← Back to Login</a>
            <a href="../signup.php" class="btn">Go to Signup →</a>
        </div>
    </div>
</body>
</html>