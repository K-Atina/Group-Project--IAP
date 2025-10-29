<!DOCTYPE html>
<html>
<head>
    <title>Simple Google Setup - MyTikiti</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: #f5f5f5;
        }
        .container {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #2c3e50;
            text-align: center;
        }
        .step {
            background: #e8f4fd;
            padding: 20px;
            margin: 15px 0;
            border-radius: 8px;
            border-left: 4px solid #4285f4;
        }
        .code {
            background: #2c3e50;
            color: white;
            padding: 15px;
            border-radius: 5px;
            font-family: monospace;
            margin: 10px 0;
        }
        .btn {
            display: inline-block;
            background: #4285f4;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            margin: 10px;
        }
        .success {
            background: #d4edda;
            color: #155724;
            padding: 15px;
            border-radius: 5px;
            margin: 15px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 Simple Google Signup Setup</h1>
        
        <div class="success">
            <strong>✅ Super Simple:</strong> Just 3 steps to enable Google signup!
        </div>

        <div class="step">
            <h3>Step 1: Go to Google Console</h3>
            <p>Visit Google Cloud Console and create a project:</p>
            <a href="https://console.developers.google.com/" target="_blank" class="btn">Open Google Console</a>
        </div>

        <div class="step">
            <h3>Step 2: Get Your Client ID</h3>
            <p>Create OAuth 2.0 credentials and copy your Client ID</p>
            <p>Set redirect URI to: <code>http://localhost:8000</code></p>
        </div>

        <div class="step">
            <h3>Step 3: Update the Code</h3>
            <p>Replace "YOUR_GOOGLE_CLIENT_ID" in <code>simple-google.php</code> with your real Client ID:</p>
            <div class="code">
data-client_id="your_real_client_id_here"
            </div>
        </div>

        <div class="success">
            <strong>🎉 That's it!</strong> Google signup will work automatically. Users click, sign in with Google, and they're registered and logged in instantly.
        </div>

        <div style="text-align: center; margin-top: 30px;">
            <a href="../login.php" class="btn">← Test Login</a>
            <a href="simple-google.php" class="btn">Test Google Signup →</a>
        </div>
    </div>
</body>
</html>