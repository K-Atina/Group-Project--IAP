"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { QrCode, Smartphone, Mail, Key, Shield, Check, X } from "lucide-react"

interface TwoFactorAuthProps {
  isEnabled: boolean
  onToggle: (enabled: boolean) => void
  userEmail: string
}

export default function TwoFactorAuth({ isEnabled, onToggle, userEmail }: TwoFactorAuthProps) {
  const [showSetup, setShowSetup] = useState(false)
  const [setupStep, setSetupStep] = useState<"method" | "verify" | "backup">("method")
  const [selectedMethod, setSelectedMethod] = useState<"app" | "sms" | "email">()
  const [verificationCode, setVerificationCode] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [qrCode] = useState("JBSWY3DPEHPK3PXP") // Sample TOTP secret for demo
  const [backupCodes] = useState([
    "ABC123DEF",
    "GHI456JKL", 
    "MNO789PQR",
    "STU012VWX",
    "YZA345BCD",
    "EFG678HIJ"
  ])

  const handleEnable2FA = () => {
    setShowSetup(true)
    setSetupStep("method")
  }

  const handleDisable2FA = () => {
    onToggle(false)
    setShowSetup(false)
  }

  const handleMethodSelect = (method: "app" | "sms" | "email") => {
    setSelectedMethod(method)
    setSetupStep("verify")
  }

  const handleVerification = () => {
    if (verificationCode.length === 6) {
      setSetupStep("backup")
    }
  }

  const handleComplete = () => {
    onToggle(true)
    setShowSetup(false)
    setSetupStep("method")
    setSelectedMethod(undefined)
    setVerificationCode("")
  }

  if (!showSetup) {
    return (
      <div className="bg-card rounded-lg border p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-primary" />
            <div>
              <h3 className="text-lg font-semibold">Two-Factor Authentication</h3>
              <p className="text-sm text-muted-foreground">
                Add an extra layer of security to your account
              </p>
            </div>
          </div>
          <Badge variant={isEnabled ? "default" : "secondary"}>
            {isEnabled ? "Enabled" : "Disabled"}
          </Badge>
        </div>

        {isEnabled ? (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-600" />
                <span className="text-sm text-green-700 dark:text-green-300">
                  Two-factor authentication is active on your account
                </span>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" size="sm">
                View Backup Codes
              </Button>
              <Button variant="outline" size="sm">
                Change Method
              </Button>
              <Button variant="destructive" size="sm" onClick={handleDisable2FA}>
                Disable 2FA
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-yellow-600" />
                <span className="text-sm text-yellow-700 dark:text-yellow-300">
                  Your account is not protected by two-factor authentication
                </span>
              </div>
            </div>
            <Button onClick={handleEnable2FA} className="w-full">
              Enable Two-Factor Authentication
            </Button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="bg-card rounded-lg border p-6">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="w-6 h-6 text-primary" />
        <div>
          <h3 className="text-lg font-semibold">Set Up Two-Factor Authentication</h3>
          <p className="text-sm text-muted-foreground">
            Follow the steps below to secure your account
          </p>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="flex items-center justify-between mb-8">
        {["method", "verify", "backup"].map((step, index) => (
          <div key={step} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              setupStep === step 
                ? "bg-primary text-primary-foreground" 
                : index < ["method", "verify", "backup"].indexOf(setupStep)
                  ? "bg-green-500 text-white"
                  : "bg-muted text-muted-foreground"
            }`}>
              {index < ["method", "verify", "backup"].indexOf(setupStep) ? (
                <Check className="w-4 h-4" />
              ) : (
                index + 1
              )}
            </div>
            {index < 2 && (
              <div className={`w-16 h-0.5 ${
                index < ["method", "verify", "backup"].indexOf(setupStep)
                  ? "bg-green-500"
                  : "bg-muted"
              }`} />
            )}
          </div>
        ))}
      </div>

      {setupStep === "method" && (
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold mb-4">Choose your authentication method:</h4>
            <div className="space-y-3">
              <button
                onClick={() => handleMethodSelect("app")}
                className="w-full p-4 border border-border rounded-lg hover:border-primary transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <Smartphone className="w-6 h-6 text-primary" />
                  <div>
                    <p className="font-medium">Authenticator App</p>
                    <p className="text-sm text-muted-foreground">
                      Use Google Authenticator, Authy, or similar apps (Recommended)
                    </p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleMethodSelect("sms")}
                className="w-full p-4 border border-border rounded-lg hover:border-primary transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <Smartphone className="w-6 h-6 text-primary" />
                  <div>
                    <p className="font-medium">SMS Text Message</p>
                    <p className="text-sm text-muted-foreground">
                      Receive verification codes via SMS
                    </p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleMethodSelect("email")}
                className="w-full p-4 border border-border rounded-lg hover:border-primary transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <Mail className="w-6 h-6 text-primary" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">
                      Receive verification codes via email
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {setupStep === "verify" && selectedMethod === "app" && (
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold mb-4">Set up your authenticator app:</h4>
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm mb-3">1. Download an authenticator app like Google Authenticator or Authy</p>
                <p className="text-sm mb-3">2. Scan this QR code with your app:</p>
                
                {/* QR Code placeholder */}
                <div className="flex justify-center mb-4">
                  <div className="w-48 h-48 bg-white border-2 border-border rounded-lg flex items-center justify-center">
                    <QrCode className="w-32 h-32 text-muted-foreground" />
                  </div>
                </div>
                
                <p className="text-sm mb-2">3. Or enter this code manually:</p>
                <code className="bg-background px-2 py-1 rounded text-sm font-mono">{qrCode}</code>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Enter the 6-digit code from your app:</label>
                <Input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="123456"
                  className="text-center text-lg tracking-widest font-mono"
                  maxLength={6}
                />
              </div>

              <Button 
                onClick={handleVerification}
                disabled={verificationCode.length !== 6}
                className="w-full"
              >
                Verify Code
              </Button>
            </div>
          </div>
        </div>
      )}

      {setupStep === "verify" && selectedMethod === "sms" && (
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold mb-4">Set up SMS authentication:</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Enter your phone number:</label>
                <Input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+254 700 000 000"
                />
              </div>

              <Button 
                onClick={() => setSetupStep("verify")}
                disabled={!phoneNumber}
                className="w-full"
              >
                Send Verification Code
              </Button>

              {phoneNumber && (
                <div>
                  <label className="block text-sm font-medium mb-2">Enter the code sent to your phone:</label>
                  <Input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="123456"
                    className="text-center text-lg tracking-widest font-mono"
                    maxLength={6}
                  />
                  <Button 
                    onClick={handleVerification}
                    disabled={verificationCode.length !== 6}
                    className="w-full mt-3"
                  >
                    Verify Code
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {setupStep === "verify" && selectedMethod === "email" && (
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold mb-4">Email verification:</h4>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  We've sent a verification code to: <strong>{userEmail}</strong>
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Enter the 6-digit code from your email:</label>
                <Input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="123456"
                  className="text-center text-lg tracking-widest font-mono"
                  maxLength={6}
                />
              </div>

              <Button 
                onClick={handleVerification}
                disabled={verificationCode.length !== 6}
                className="w-full"
              >
                Verify Code
              </Button>
            </div>
          </div>
        </div>
      )}

      {setupStep === "backup" && (
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold mb-4">Save your backup codes</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Store these backup codes in a safe place. You can use them to access your account if you lose your {selectedMethod === "app" ? "authenticator device" : "phone"}.
            </p>

            <div className="p-4 bg-muted rounded-lg">
              <div className="grid grid-cols-2 gap-2 font-mono text-sm">
                {backupCodes.map((code, index) => (
                  <div key={index} className="p-2 bg-background rounded border">
                    {code}
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <div className="flex items-start gap-2">
                <Shield className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-700 dark:text-yellow-300 mb-1">
                    Important Security Notice
                  </p>
                  <ul className="text-sm text-yellow-600 dark:text-yellow-400 space-y-1">
                    <li>• Each backup code can only be used once</li>
                    <li>• Store them in a secure password manager</li>
                    <li>• Don't share them with anyone</li>
                  </ul>
                </div>
              </div>
            </div>

            <Button onClick={handleComplete} className="w-full">
              Complete Setup
            </Button>
          </div>
        </div>
      )}

      <div className="flex gap-3 mt-6">
        <Button variant="outline" onClick={() => setShowSetup(false)}>
          Cancel
        </Button>
      </div>
    </div>
  )
}