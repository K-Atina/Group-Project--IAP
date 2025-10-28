<?php
// Demo Google redirect - shows what happens without real credentials
?>
<!DOCTYPE html>
<html>
<head>
    <title>Google Login Demo - MyTikiti</title>
    <style>
        body {
            font-family: 'Segoe UI', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0;
        }
        .demo-container {
            background: white;
            padding: 40px;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            text-align: center;
            max-width: 500px;
            width: 90%;
        }
        h1 {
            color: #2c3e50;
            margin-bottom: 20px;
        }
        .demo-box {
            background: #f8f9fa;
            padding: 25px;
            border-radius: 10px;
            margin: 20px 0;
            border-left: 5px solid #4285f4;
        }
        .google-mockup {
            background: #4285f4;
            color: white;
            padding: 15px 30px;
            border-radius: 8px;
            margin: 20px 0;
            font-size: 18px;
        }
        .btn {
            background: #4285f4;
            color: white;
            padding: 12px 24px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 16px;
            margin: 10px;
            text-decoration: none;
            display: inline-block;
        }
        .btn:hover {
            background: #3367d6;
        }
        .steps {
            text-align: left;
            margin: 20px 0;
        }
        .steps li {
            margin: 10px 0;
            padding: 8px 0;
        }
    </style>
</head>
<body>
    <div class="demo-container">
        <h1>🚀 Google Login Demo</h1>
        
        <div class="demo-box">
            <h3>This is what happens when you click "Continue with Google":</h3>
            <div class="steps">
                <ol>
                    <li>✅ Browser redirects to Google</li>
                    <li>🌐 Google login page opens in Chrome</li>
                    <li>👤 You select your Google account</li>
                    <li>🔐 Google asks "Allow MyTikiti to access your profile?"</li>
                    <li>✅ You click "Allow"</li>
                    <li>🏠 Back to MyTikiti dashboard - logged in!</li>
                </ol>
            </div>
        </div>

        <div class="google-mockup">
            🔐 Google Account Selection
            <br>
            <small style="opacity: 0.9;">Choose your Google account to continue to MyTikiti</small>
        </div>

        <button class="btn" onclick="simulateGoogleLogin()">
            🎯 Simulate Google Login Flow
        </button>

        <div style="margin-top: 30px;">
            <a href="../login.php" class="btn" style="background: #6c757d;">← Back to Login</a>
            <a href="setup-guide.php" class="btn" style="background: #28a745;">Setup Guide →</a>
        </div>

        <div style="margin-top: 20px; font-size: 14px; color: #666;">
            <strong>Note:</strong> To enable real Google login, just add your Google Client ID to the setup files.
        </div>
    </div>

    <script>
        function simulateGoogleLogin() {
            // Show step-by-step simulation
            const steps = [
                "🌐 Opening Google login page...",
                "👤 Google: Choose your account",
                "🔐 Google: Allow MyTikiti to access your profile?",
                "✅ You clicked 'Allow'",
                "🏠 Redirecting to dashboard..."
            ];

            let currentStep = 0;
            const button = document.querySelector('button');
            
            function showNextStep() {
                if (currentStep < steps.length) {
                    button.textContent = steps[currentStep];
                    button.style.background = '#28a745';
                    currentStep++;
                    setTimeout(showNextStep, 1500);
                } else {
                    // Simulate successful login
                    alert('🎉 Success! In real implementation:\n\n' +
                          '✅ Account created automatically\n' +
                          '✅ User logged in\n' +
                          '✅ Redirected to dashboard\n\n' +
                          'This is exactly how Google login works on any professional website!');
                    
                    if (confirm('Go to dashboard as demo user?')) {
                        window.location.href = '../dashboard.php';
                    } else {
                        // Reset button
                        button.textContent = '🎯 Simulate Google Login Flow';
                        button.style.background = '#4285f4';
                        currentStep = 0;
                    }
                }
            }
            
            showNextStep();
        }
    </script>
</body>
</html>