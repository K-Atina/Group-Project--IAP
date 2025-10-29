<?php
// Demo page to test OAuth button functionality
session_start();

// Simulate environment variables for demo
$_ENV['GOOGLE_CLIENT_ID'] = 'demo_google_client_id';
$_ENV['MICROSOFT_CLIENT_ID'] = 'demo_microsoft_client_id';
?>
<!DOCTYPE html>
<html>
<head>
    <title>OAuth Demo - MyTikiti</title>
    <link rel="stylesheet" href="Backend/public/assets/style.css">
    <style>
        .demo-container {
            max-width: 600px;
            margin: 50px auto;
            padding: 30px;
            background: white;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        .demo-title {
            text-align: center;
            color: #2c3e50;
            margin-bottom: 30px;
        }
        .demo-note {
            background: #e8f4fd;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #0078d4;
        }
    </style>
</head>
<body>
    <div class="demo-container">
        <h1 class="demo-title">🚀 OAuth Demo - MyTikiti</h1>
        
        <div class="demo-note">
            <strong>Demo Mode:</strong> This shows how the OAuth buttons will look and behave once properly configured. Click them to see the professional loading states and interactions!
        </div>

        <form style="margin: 20px 0;">
            <input type="email" placeholder="Email Address" style="margin-bottom: 15px;">
            <div class="password-input-wrapper" style="margin-bottom: 15px;">
                <input type="password" placeholder="Password">
                <span class="password-toggle-btn">👀</span>
            </div>
            <button type="button" class="btn" style="margin-bottom: 20px;">Traditional Login</button>
        </form>

        <p style="text-align:center; margin: 15px 0; color: #7f8c8d; font-weight: 500;">OR</p>

        <button class="btn btn-google" onclick="loginWithGoogle()">
            <svg width="18" height="18" viewBox="0 0 24 24" style="margin-right: 8px;">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
        </button>
        
        <button class="btn btn-microsoft" onclick="loginWithMicrosoft()">
            <svg width="18" height="18" viewBox="0 0 24 24" style="margin-right: 8px;">
                <path fill="#F25022" d="M1 1h10.5v10.5H1z"/>
                <path fill="#00A4EF" d="M12.5 1H23v10.5H12.5z"/>
                <path fill="#7FBA00" d="M1 12.5h10.5V23H1z"/>
                <path fill="#FFB900" d="M12.5 12.5H23V23H12.5z"/>
            </svg>
            Continue with Microsoft
        </button>

        <div style="text-align: center; margin-top: 30px;">
            <a href="oauth/oauth-setup-guide.php" style="color: #3498db; text-decoration: none;">
                📚 View Setup Guide
            </a>
        </div>
    </div>

    <script>
        function loginWithGoogle() {
            const btn = document.querySelector('.btn-google');
            
            // Add loading state
            btn.classList.add('loading');
            btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" style="margin-right: 8px;"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>Connecting to Google...';
            
            // Demo: show success message after 2 seconds
            setTimeout(() => {
                alert('🎉 Demo Mode: In production, this would redirect to Google OAuth!\n\nFeatures:\n✅ Professional loading animation\n✅ Secure OAuth flow\n✅ Automatic account creation\n✅ Seamless user experience');
                
                // Reset button
                btn.classList.remove('loading');
                btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" style="margin-right: 8px;"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>Continue with Google';
            }, 2000);
        }
        
        function loginWithMicrosoft() {
            const btn = document.querySelector('.btn-microsoft');
            
            // Add loading state
            btn.classList.add('loading');
            btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" style="margin-right: 8px;"><path fill="#F25022" d="M1 1h10.5v10.5H1z"/><path fill="#00A4EF" d="M12.5 1H23v10.5H12.5z"/><path fill="#7FBA00" d="M1 12.5h10.5V23H1z"/><path fill="#FFB900" d="M12.5 12.5H23V23H12.5z"/></svg>Connecting to Microsoft...';
            
            // Demo: show success message after 2 seconds
            setTimeout(() => {
                alert('🎉 Demo Mode: In production, this would redirect to Microsoft OAuth!\n\nFeatures:\n✅ Professional loading animation\n✅ Enterprise-grade security\n✅ Azure AD integration\n✅ Automatic account management');
                
                // Reset button
                btn.classList.remove('loading');
                btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" style="margin-right: 8px;"><path fill="#F25022" d="M1 1h10.5v10.5H1z"/><path fill="#00A4EF" d="M12.5 1H23v10.5H12.5z"/><path fill="#7FBA00" d="M1 12.5h10.5V23H1z"/><path fill="#FFB900" d="M12.5 12.5H23V23H12.5z"/></svg>Continue with Microsoft';
            }, 2000);
        }
    </script>
</body>
</html>