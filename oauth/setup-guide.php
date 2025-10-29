<!DOCTYPE html>
<html>
<head>
    <title>Easy Google Setup - MyTikiti</title>
    <style>
        body {
            font-family: 'Segoe UI', sans-serif;
            max-width: 700px;
            margin: 0 auto;
            padding: 20px;
            background: #f0f2f5;
        }
        .card {
            background: white;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            margin: 20px 0;
        }
        h1 {
            color: #1a73e8;
            text-align: center;
        }
        .step {
            background: #e8f0fe;
            padding: 20px;
            margin: 15px 0;
            border-radius: 8px;
            border-left: 4px solid #1a73e8;
        }
        .code-box {
            background: #263238;
            color: #fff;
            padding: 15px;
            border-radius: 6px;
            font-family: monospace;
            margin: 10px 0;
            overflow-x: auto;
        }
        .btn {
            background: #1a73e8;
            color: white;
            padding: 12px 20px;
            text-decoration: none;
            border-radius: 6px;
            display: inline-block;
            margin: 10px 5px;
        }
        .success {
            background: #e8f5e8;
            color: #2e7d32;
            padding: 15px;
            border-radius: 6px;
            margin: 15px 0;
        }
    </style>
</head>
<body>
    <div class="card">
        <h1>🚀 Google Login Setup</h1>
        
        <div class="success">
            <strong>What happens:</strong> User clicks Google button → Opens Google in Chrome → Select account → Automatic login/signup
        </div>

        <div style="background: #fff3cd; color: #856404; padding: 15px; border-radius: 6px; margin: 15px 0;">
            <strong>⚠️ Getting 400 Error?</strong> This happens when using placeholder credentials. Follow the steps below to add real Google credentials and fix the error.
        </div>

        <div class="step">
            <h3>📝 Step 1: Get Google Credentials</h3>
            <p>Go to Google Cloud Console:</p>
            <a href="https://console.developers.google.com/" target="_blank" class="btn">Open Google Console</a>
            <ol>
                <li>Create new project or select existing</li>
                <li>Enable Google+ API</li>
                <li>Go to "Credentials" → "Create OAuth 2.0 Client ID"</li>
                <li>Set redirect URI: <code>http://localhost:8000/oauth/google-callback.php</code></li>
                <li>Copy your Client ID and Client Secret</li>
            </ol>
        </div>

        <div class="step">
            <h3>⚙️ Step 2: Update Files</h3>
            <p>Replace the placeholder values in these files:</p>
            
            <h4>File: oauth/google-redirect.php</h4>
            <div class="code-box">
$google_client_id = "your_real_client_id_here";
            </div>

            <h4>File: oauth/google-callback.php</h4>
            <div class="code-box">
$google_client_id = "your_real_client_id_here";
$google_client_secret = "your_real_client_secret_here";
            </div>
        </div>

        <div class="step">
            <h3>✅ Step 3: Test It!</h3>
            <p>Click Google button on login page → Should open Google → Select account → Auto login</p>
            <a href="../login.php" class="btn">Test Login Page</a>
            <a href="../signup.php" class="btn">Test Signup Page</a>
        </div>

        <div class="success">
            <strong>🎉 That's it!</strong> Your Google login now works like any professional website. Users click, choose their Google account, and they're instantly signed up and logged in.
        </div>
    </div>
</body>
</html>