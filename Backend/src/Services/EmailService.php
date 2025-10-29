<?php
// Backend/src/Services/EmailService.php

require_once __DIR__ . '/../../../vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

class EmailService {
    private $mailer;
    private $fromEmail;
    private $fromName;
    
    // Email credentials loaded from environment variables
    private $gmailUsername;
    private $gmailPassword;
    
    public function __construct() {
        // Load environment variables
        $this->loadEnvVariables();
        
        $this->mailer = new PHPMailer(true);
        $this->fromEmail = $this->gmailUsername;
        $this->fromName = "MyTikiti Platform";
        
        $this->configureSMTP();
    }

    private function loadEnvVariables() {
        $envFile = __DIR__ . '/../../../.env';
        if (file_exists($envFile)) {
            $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
            foreach ($lines as $line) {
                if (strpos($line, '#') === 0) continue; // Skip comments
                list($key, $value) = explode('=', $line, 2);
                $_ENV[trim($key)] = trim($value);
            }
        }
        
        // Set Gmail credentials from environment variables
        $this->gmailUsername = $_ENV['GMAIL_USERNAME'] ?? '';
        $this->gmailPassword = $_ENV['GMAIL_PASSWORD'] ?? '';
        
        if (empty($this->gmailUsername) || empty($this->gmailPassword)) {
            throw new Exception("Gmail credentials not found in environment variables");
        }
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

    private function getBaseUrl() {
        $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? "https" : "http";
        $host = $_SERVER['HTTP_HOST']; // localhost or domain
        $projectFolder = "/IAP_Project"; // adjust if your folder name changes
        return $protocol . "://" . $host . $projectFolder;
    
    }

    public function sendVerificationEmail($userEmail, $userName, $verificationToken) {
        try {
            $this->mailer->clearAddresses();
            $this->mailer->addAddress($userEmail, $userName);

            $verificationLink = $this->getBaseUrl() . "/verify.php?token=" . $verificationToken;

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
    
    public function sendPasswordResetOTP($userEmail, $userName, $otp) {
        try {
            $this->mailer->clearAddresses();
            $this->mailer->addAddress($userEmail, $userName);

            $this->mailer->isHTML(true);
            $this->mailer->Subject = 'Password Reset OTP - MyTikiti';
            $this->mailer->Body = "
            <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>
                <div style='background: #e74c3c; color: white; padding: 20px; text-align: center;'>
                    <h1>Password Reset Request</h1>
                </div>
                <div style='padding: 30px; background: #f9f9f9;'>
                    <h2>Hello " . htmlspecialchars($userName) . "!</h2>
                    <p>You requested to reset your password for your MyTikiti account.</p>
                    
                    <div style='text-align: center; margin: 30px 0;'>
                        <div style='background: #2c3e50; color: white; padding: 20px; border-radius: 10px; font-size: 32px; font-weight: bold; letter-spacing: 5px; display: inline-block;'>
                            " . $otp . "
                        </div>
                    </div>
                    
                    <p><strong>Your OTP Code:</strong> " . $otp . "</p>
                    <p>Enter this code on the password reset page to continue.</p>
                    
                    <p><strong>Important:</strong></p>
                    <ul>
                        <li>This OTP expires in 15 minutes</li>
                        <li>Don't share this code with anyone</li>
                        <li>If you didn't request this reset, ignore this email</li>
                    </ul>
                </div>
                <div style='text-align: center; padding: 20px; font-size: 12px; color: #666;'>
                    &copy; 2025 MyTikiti Platform. All rights reserved.
                </div>
            </div>";

            $this->mailer->send();
            return true;
        } catch (Exception $e) {
            error_log("OTP Email failed: " . $e->getMessage());
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