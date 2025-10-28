<!DOCTYPE html>
<html>
<head>
    <title>Sign up with Google - MyTikiti</title>
    <script src="https://accounts.google.com/gsi/client" async defer></script>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0;
        }
        .container {
            background: white;
            padding: 40px;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            text-align: center;
            max-width: 400px;
            width: 90%;
        }
        h1 {
            color: #2c3e50;
            margin-bottom: 20px;
        }
        .google-btn {
            margin: 20px 0;
        }
        .back-link {
            margin-top: 20px;
        }
        .back-link a {
            color: #3498db;
            text-decoration: none;
        }
        .demo-note {
            background: #e8f4fd;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #0078d4;
            color: #2c3e50;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 Sign up with Google</h1>
        
        <div class="demo-note">
            <strong>Simple Setup:</strong> Click the Google button below to automatically sign up or login with your Google account. No forms, no passwords needed!
        </div>

        <div class="google-btn">
            <div id="g_id_onload"
                 data-client_id="YOUR_GOOGLE_CLIENT_ID"
                 data-context="signup"
                 data-ux_mode="popup"
                 data-callback="handleCredentialResponse"
                 data-auto_prompt="false">
            </div>
            <div class="g_id_signin"
                 data-type="standard"
                 data-shape="rectangular"
                 data-theme="outline"
                 data-text="signup_with"
                 data-size="large"
                 data-logo_alignment="left">
            </div>
        </div>

        <div style="margin: 20px 0;">
            <button onclick="demoSignup()" style="
                background: #4285f4;
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 8px;
                cursor: pointer;
                font-size: 16px;
                font-weight: 500;
            ">
                🎯 Try Demo Signup
            </button>
        </div>

        <div class="back-link">
            <a href="../login.php">← Back to Login</a> |
            <a href="../signup.php">← Back to Signup</a>
        </div>
    </div>

    <script>
        function handleCredentialResponse(response) {
            // Decode the JWT token to get user info
            const responsePayload = decodeJwtResponse(response.credential);
            
            console.log("ID: " + responsePayload.sub);
            console.log('Full Name: ' + responsePayload.name);
            console.log('Email: ' + responsePayload.email);
            
            // Create user automatically
            createUserWithGoogle(responsePayload);
        }

        function decodeJwtResponse(token) {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(jsonPayload);
        }

        function createUserWithGoogle(userInfo) {
            // Send user data to PHP backend
            fetch('google-signup-handler.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: userInfo.name,
                    email: userInfo.email,
                    google_id: userInfo.sub,
                    picture: userInfo.picture
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('✅ Successfully signed up with Google!\nWelcome ' + userInfo.name + '!');
                    window.location.href = '../dashboard.php';
                } else {
                    alert('❌ Error: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Something went wrong. Please try again.');
            });
        }

        function demoSignup() {
            // Demo function
            const demoUser = {
                name: 'John Demo User',
                email: 'demo@google.com',
                sub: 'demo123',
                picture: 'https://via.placeholder.com/100'
            };
            
            alert('🎯 Demo Mode!\n\nIn real implementation, this would:\n✅ Get your Google profile automatically\n✅ Create account instantly\n✅ Log you in\n✅ Redirect to dashboard\n\nDemo User: ' + demoUser.name);
            
            // Simulate successful signup
            setTimeout(() => {
                if (confirm('Proceed to dashboard as demo user?')) {
                    window.location.href = '../dashboard.php';
                }
            }, 1000);
        }
    </script>
</body>
</html>