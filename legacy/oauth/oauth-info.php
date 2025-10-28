<?php
// oauth/oauth-info.php
// Information page about OAuth implementation

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OAuth Integration - MyTikiti</title>
    <link rel="stylesheet" href="../Backend/public/assets/style.css">
    <style>
        .oauth-info {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: white;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .provider-card {
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 20px;
            margin: 15px 0;
            background: #f9f9fa;
        }
        .provider-header {
            display: flex;
            align-items: center;
            margin-bottom: 15px;
        }
        .provider-header svg {
            margin-right: 10px;
        }
        .code-block {
            background: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 4px;
            padding: 15px;
            margin: 10px 0;
            overflow-x: auto;
        }
        .step {
            background: #e8f4fd;
            border-left: 4px solid #0078d4;
            padding: 15px;
            margin: 10px 0;
        }
    </style>
</head>
<body>
    <nav class="navbar">
        <div class="logo"><strong>MyTikiti</strong></div>
        <ul>
            <li><a href="../index.php">Home</a></li>
            <li><a href="../login.php">Login</a></li>
            <li><a href="../signup.php">Sign Up</a></li>
        </ul>
    </nav>

    <section class="hero">
        <div class="oauth-info">
            <h1>🔐 OAuth Integration Guide</h1>
            <p>This page shows how to implement Google and Microsoft OAuth authentication for your MyTikiti platform.</p>

            <div class="provider-card">
                <div class="provider-header">
                    <svg width="24" height="24" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <h3>Google OAuth 2.0 Setup</h3>
                </div>

                <div class="step">
                    <h4>Step 1: Create Google Cloud Project</h4>
                    <p>1. Go to <a href="https://console.cloud.google.com/" target="_blank">Google Cloud Console</a></p>
                    <p>2. Create a new project or select existing one</p>
                    <p>3. Enable the Google+ API</p>
                </div>

                <div class="step">
                    <h4>Step 2: Configure OAuth Consent Screen</h4>
                    <p>1. Go to APIs & Services → OAuth consent screen</p>
                    <p>2. Fill in application name, authorized domains</p>
                    <p>3. Add scopes: email, profile, openid</p>
                </div>

                <div class="step">
                    <h4>Step 3: Create OAuth 2.0 Credentials</h4>
                    <p>1. Go to APIs & Services → Credentials</p>
                    <p>2. Create OAuth 2.0 Client ID</p>
                    <p>3. Set authorized redirect URI: <code>http://localhost:8000/oauth/google-callback.php</code></p>
                </div>

                <div class="step">
                    <h4>Step 4: Add to .env file</h4>
                    <div class="code-block">
# Google OAuth<br>
GOOGLE_CLIENT_ID=your-google-client-id<br>
GOOGLE_CLIENT_SECRET=your-google-client-secret<br>
GOOGLE_REDIRECT_URI=http://localhost:8000/oauth/google-callback.php
                    </div>
                </div>
            </div>

            <div class="provider-card">
                <div class="provider-header">
                    <svg width="24" height="24" viewBox="0 0 24 24">
                        <path fill="#F25022" d="M1 1h10.5v10.5H1z"/>
                        <path fill="#00A4EF" d="M12.5 1H23v10.5H12.5z"/>
                        <path fill="#7FBA00" d="M1 12.5h10.5V23H1z"/>
                        <path fill="#FFB900" d="M12.5 12.5H23V23H12.5z"/>
                    </svg>
                    <h3>Microsoft OAuth 2.0 Setup</h3>
                </div>

                <div class="step">
                    <h4>Step 1: Register App in Azure</h4>
                    <p>1. Go to <a href="https://portal.azure.com/" target="_blank">Azure Portal</a></p>
                    <p>2. Navigate to Azure Active Directory → App registrations</p>
                    <p>3. Click "New registration"</p>
                </div>

                <div class="step">
                    <h4>Step 2: Configure Application</h4>
                    <p>1. Set name: "MyTikiti Platform"</p>
                    <p>2. Set redirect URI: <code>http://localhost:8000/oauth/microsoft-callback.php</code></p>
                    <p>3. Choose "Accounts in any organizational directory and personal Microsoft accounts"</p>
                </div>

                <div class="step">
                    <h4>Step 3: Create Client Secret</h4>
                    <p>1. Go to Certificates & secrets</p>
                    <p>2. Create new client secret</p>
                    <p>3. Copy the secret value (it won't be shown again)</p>
                </div>

                <div class="step">
                    <h4>Step 4: Add to .env file</h4>
                    <div class="code-block">
# Microsoft OAuth<br>
MICROSOFT_CLIENT_ID=your-microsoft-client-id<br>
MICROSOFT_CLIENT_SECRET=your-microsoft-client-secret<br>
MICROSOFT_REDIRECT_URI=http://localhost:8000/oauth/microsoft-callback.php
                    </div>
                </div>
            </div>

            <h3>📦 Required Libraries</h3>
            <p>Install OAuth libraries via Composer:</p>
            <div class="code-block">
composer require league/oauth2-google<br>
composer require league/oauth2-client<br>
composer require thenetworg/oauth2-azure
            </div>

            <h3>🔧 Implementation Files Needed</h3>
            <ul>
                <li><code>oauth/google-login.php</code> - Google OAuth initiation</li>
                <li><code>oauth/google-callback.php</code> - Google OAuth callback handler</li>
                <li><code>oauth/microsoft-login.php</code> - Microsoft OAuth initiation</li>
                <li><code>oauth/microsoft-callback.php</code> - Microsoft OAuth callback handler</li>
                <li><code>Backend/src/Services/OAuthService.php</code> - OAuth service class</li>
            </ul>

            <div style="background: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <h4>⚠️ Current Status</h4>
                <p>The OAuth buttons are currently placeholders. To implement full OAuth functionality:</p>
                <ol>
                    <li>Follow the setup steps above</li>
                    <li>Install the required Composer packages</li>
                    <li>Create the OAuth handler files</li>
                    <li>Update the JavaScript functions to redirect to actual OAuth URLs</li>
                </ol>
            </div>

            <p style="text-align: center; margin-top: 30px;">
                <a href="../login.php" class="btn">← Back to Login</a>
                <a href="../signup.php" class="btn" style="margin-left: 10px;">Go to Sign Up</a>
            </p>
        </div>
    </section>
</body>
</html>