<?php
// Backend/src/Services/EmailService.php

require_once __DIR__ . '/../../../../vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

class EmailService {
    private $mailer;
    private $fromEmail;
    private $fromName;
    
    // REPLACE THESE WITH YOUR ACTUAL GMAIL DETAILS
    private $gmailUsername = "";        // Your Gmail address
    private $gmailPassword = "";   // Your Gmail App Password
    
    public function __construct() {
        $this->mailer = new PHPMailer(true);
        $this->fromEmail = $this->gmailUsername;
        $this->fromName = "MyTikiti Platform";
        
        $this->configureSMTP();
    }

    private function configureSMTP() {
        try {
            $this->mailer->isSMTP();
            $this->mailer->Host       = 'smtp.gmail.com';
            $this->mailer->SMTPAuth   = true;
            $this->mailer->Username   = $this->gmailUsername;
            $this->mailer->Password   = $this->gmailPassword;
            $this->mailer->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
            $this->mailer->Port       = 587;
            $this->mailer->setFrom($this->fromEmail, $this->fromName);
        } catch (Exception $e) {
            error_log("Gmail SMTP error: " . $e->getMessage());
        }
    }

    public function sendVerificationEmail($userEmail, $userName, $verificationToken) {
        try {
            $this->mailer->clearAddresses();
            $this->mailer->addAddress($userEmail, $userName);

            $verificationLink = "http://localhost:8000/verify.php?token=" . $verificationToken;
            
            $this->mailer->isHTML(true);
            $this->mailer->Subject = 'Verify Your MyTikiti Account';
            $this->mailer->Body = "
            <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>
                <div style='background: #e67e22; color: white; padding: 20px; text-align: center;'>
                    <h1>Welcome to MyTikiti!</h1>
                </div>
                <div style='padding: 30px; background: #f9f9f9;'>
                    <h2>Hello " . htmlspecialchars($userName) . "!</h2>
                    <p>Thank you for signing up with MyTikiti. Please verify your email address to complete your registration.</p>
                    
                    <p style='text-align: center;'>
                        <a href='" . $verificationLink . "' style='background: #e67e22; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;'>Verify My Email</a>
                    </p>
                    
                    <p>If the button doesn't work, copy and paste this link:</p>
                    <p style='background: #eee; padding: 10px; word-break: break-all;'>" . $verificationLink . "</p>
                    
                    <p><strong>Important:</strong> This link expires in 24 hours.</p>
                </div>
                <div style='text-align: center; padding: 20px; font-size: 12px; color: #666;'>
                    &copy; 2025 MyTikiti Platform. All rights reserved.
                </div>
            </div>";

            $this->mailer->send();
            return true;
        } catch (Exception $e) {
            error_log("Email failed: " . $e->getMessage());
            return false;
        }
    }
    
    public function testConnection() {
        try {
            $this->mailer->smtpConnect();
            $this->mailer->smtpClose();
            return true;
        } catch (Exception $e) {
            error_log("Gmail connection test failed: " . $e->getMessage());
            return false;
        }
    }
}
?>