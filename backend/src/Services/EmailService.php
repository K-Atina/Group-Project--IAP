<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

class EmailService {
    private $mailer;
    private $fromEmail = 'vanessagikebe@gmail.com';
    private $fromName = 'MyTikiti Platform';
    
    public function __construct() {
        // PHPMailer will be included when needed
    }
    
    private function getMailer() {
        // Check if PHPMailer is available
        if (!class_exists('PHPMailer\PHPMailer\PHPMailer')) {
            error_log("PHPMailer not available - emails will be logged only");
            return null;
        }
        
        $mail = new PHPMailer(true);
        
        try {
            // Server settings
            $mail->isSMTP();
            $mail->Host       = 'smtp.gmail.com';
            $mail->SMTPAuth   = true;
            $mail->Username   = 'vanessagikebe@gmail.com';
            $mail->Password   = 'fhor isxl kenb gtsq';
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
            $mail->Port       = 587;
            
            $mail->setFrom($this->fromEmail, $this->fromName);
            
            return $mail;
        } catch (Exception $e) {
            error_log("Email configuration error: " . $e->getMessage());
            return null;
        }
    }
    
    public function sendVerificationEmail($email, $token, $userName) {
        $mail = $this->getMailer();
        
        if (!$mail) {
            error_log("Verification email would be sent to: $email");
            return true; // Return true for development
        }
        
        try {
            $mail->addAddress($email, $userName);
            $mail->isHTML(true);
            $mail->Subject = 'Verify Your Email - MyTikiti';
            
            $verificationLink = "http://localhost:3000/verify?token=$token";
            
            $mail->Body = "
                <html>
                <body style='font-family: Arial, sans-serif;'>
                    <h2>Welcome to MyTikiti, $userName!</h2>
                    <p>Thank you for registering. Please verify your email address by clicking the link below:</p>
                    <p><a href='$verificationLink' style='background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;'>Verify Email</a></p>
                    <p>Or copy and paste this link into your browser:</p>
                    <p>$verificationLink</p>
                    <p>This link will expire in 24 hours.</p>
                    <br>
                    <p>Best regards,<br>The MyTikiti Team</p>
                </body>
                </html>
            ";
            
            $mail->AltBody = "Welcome to MyTikiti, $userName! Please verify your email by visiting: $verificationLink";
            
            $mail->send();
            return true;
        } catch (Exception $e) {
            error_log("Email send error: " . $mail->ErrorInfo);
            return false;
        }
    }
    
    public function sendPasswordResetEmail($email, $token, $userName) {
        $mail = $this->getMailer();
        
        if (!$mail) {
            error_log("Password reset email would be sent to: $email");
            return true;
        }
        
        try {
            $mail->addAddress($email, $userName);
            $mail->isHTML(true);
            $mail->Subject = 'Password Reset Request - MyTikiti';
            
            $resetLink = "http://localhost:3000/reset-password?token=$token";
            
            $mail->Body = "
                <html>
                <body style='font-family: Arial, sans-serif;'>
                    <h2>Password Reset Request</h2>
                    <p>Hello $userName,</p>
                    <p>We received a request to reset your password. Click the link below to reset it:</p>
                    <p><a href='$resetLink' style='background-color: #2196F3; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;'>Reset Password</a></p>
                    <p>Or copy and paste this link into your browser:</p>
                    <p>$resetLink</p>
                    <p>This link will expire in 1 hour.</p>
                    <p>If you didn't request this, please ignore this email.</p>
                    <br>
                    <p>Best regards,<br>The MyTikiti Team</p>
                </body>
                </html>
            ";
            
            $mail->AltBody = "Password reset link: $resetLink";
            
            $mail->send();
            return true;
        } catch (Exception $e) {
            error_log("Email send error: " . $mail->ErrorInfo);
            return false;
        }
    }
}

?>
