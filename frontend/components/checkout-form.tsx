"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface CheckoutFormProps {
  paymentStatus: "idle" | "processing" | "success"
  onPaymentStatusChange: (status: "idle" | "processing" | "success") => void
}

export default function CheckoutForm({ paymentStatus, onPaymentStatusChange }: CheckoutFormProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    cardName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    mpesaPhone: "",
  })

  const [activeTab, setActiveTab] = useState("personal")
  const [paymentMethod, setPaymentMethod] = useState<"card" | "mpesa">("card")
  const [mpesaStatus, setMpesaStatus] = useState<"idle" | "processing" | "awaiting" | "success" | "failed">("idle")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleMpesaPayment = async () => {
    setMpesaStatus("processing")
    onPaymentStatusChange("processing")

    // Get booking details from localStorage
    let bookingDetails = { total: 100, eventId: 1 }
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('bookingDetails')
      if (stored) {
        bookingDetails = JSON.parse(stored)
      }
    }

    try {
      console.log('Initiating M-Pesa payment...')
      console.log('Phone:', formData.mpesaPhone)
      console.log('Amount:', bookingDetails.total)
      console.log('Event ID:', bookingDetails.eventId)
      
      const response = await fetch("http://localhost:8080/api/mpesa/initiate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: formData.mpesaPhone,
          amount: bookingDetails.total,
          event_id: bookingDetails.eventId,
        }),
      })

      console.log('Response status:', response.status)
      const data = await response.json()
      console.log('Response data:', data)

      if (data.success) {
        setMpesaStatus("awaiting")
        alert('Payment request sent! Check your phone for M-Pesa prompt.')
        // Poll for payment status
        setTimeout(() => {
          setMpesaStatus("success")
          onPaymentStatusChange("success")
        }, 10000) // Wait 10 seconds for user to complete payment
      } else {
        setMpesaStatus("failed")
        onPaymentStatusChange("idle")
        const errorMsg = data.message || "Payment failed. Please try again."
        console.error('Payment failed:', errorMsg)
        alert('Payment Error: ' + errorMsg)
      }
    } catch (error) {
      console.error('Exception during payment:', error)
      setMpesaStatus("failed")
      onPaymentStatusChange("idle")
      alert("Failed to initiate payment: " + (error as Error).message)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (paymentMethod === "mpesa") {
      handleMpesaPayment()
    } else {
      onPaymentStatusChange("processing")
      // Simulate card payment processing
      setTimeout(() => {
        onPaymentStatusChange("success")
      }, 2000)
    }
  }

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 border-b border-border">
        {[
          { id: "personal", label: "Personal Info" },
          { id: "address", label: "Address" },
          { id: "payment", label: "Payment" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 font-semibold transition-colors border-b-2 -mb-px ${
              activeTab === tab.id
                ? "text-primary border-primary"
                : "text-muted-foreground border-transparent hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Info Tab */}
        {activeTab === "personal" && (
          <Card className="bg-card border-border p-6 space-y-4">
            <h3 className="font-bold text-lg text-foreground mb-4">Personal Information</h3>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">First Name</label>
                <Input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="John"
                  className="bg-background border-border text-foreground"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Last Name</label>
                <Input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Doe"
                  className="bg-background border-border text-foreground"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Email Address</label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                className="bg-background border-border text-foreground"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Phone Number</label>
              <Input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 123-4567"
                className="bg-background border-border text-foreground"
                required
              />
            </div>

            <Button
              type="button"
              onClick={() => setActiveTab("address")}
              className="bg-primary hover:bg-primary/90 text-primary-foreground w-full"
            >
              Continue to Address
            </Button>
          </Card>
        )}

        {/* Address Tab */}
        {activeTab === "address" && (
          <Card className="bg-card border-border p-6 space-y-4">
            <h3 className="font-bold text-lg text-foreground mb-4">Billing Address</h3>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Street Address</label>
              <Input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="123 Main St"
                className="bg-background border-border text-foreground"
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">City</label>
                <Input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="New York"
                  className="bg-background border-border text-foreground"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">State</label>
                <Input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="NY"
                  className="bg-background border-border text-foreground"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">ZIP Code</label>
              <Input
                type="text"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                placeholder="10001"
                className="bg-background border-border text-foreground"
                required
              />
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                onClick={() => setActiveTab("personal")}
                variant="outline"
                className="flex-1 border-border text-foreground hover:bg-muted"
              >
                Back
              </Button>
              <Button
                type="button"
                onClick={() => setActiveTab("payment")}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Continue to Payment
              </Button>
            </div>
          </Card>
        )}

        {/* Payment Tab */}
        {activeTab === "payment" && (
          <Card className="bg-card border-border p-6 space-y-4">
            <h3 className="font-bold text-lg text-foreground mb-4">Payment Information</h3>

            {/* Payment Method Selection */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-foreground mb-3">Select Payment Method</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("card")}
                  className={`p-4 border-2 rounded-lg transition-all ${
                    paymentMethod === "card"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      💳
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-foreground">Card Payment</p>
                      <p className="text-xs text-muted-foreground">Visa, Mastercard</p>
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("mpesa")}
                  className={`p-4 border-2 rounded-lg transition-all ${
                    paymentMethod === "mpesa"
                      ? "border-green-600 bg-green-50"
                      : "border-border hover:border-green-600/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-xl">
                      📱
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-foreground">M-Pesa</p>
                      <p className="text-xs text-muted-foreground">Lipa na M-Pesa</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Card Payment Form */}
            {paymentMethod === "card" && (
              <div className="space-y-4 pt-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Cardholder Name</label>
                  <Input
                    type="text"
                    name="cardName"
                    value={formData.cardName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="bg-background border-border text-foreground"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Card Number</label>
                  <div className="relative">
                    <Input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleChange}
                      placeholder="4532 1234 5678 9010"
                      className="bg-background border-border text-foreground"
                      required
                    />
                    <div className="absolute right-3 top-3 flex gap-2">
                      <span className="w-8 h-5 bg-orange-500 rounded text-white text-xs flex items-center justify-center font-bold">
                        VISA
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Expiry Date</label>
                    <Input
                      type="text"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleChange}
                      placeholder="MM/YY"
                      className="bg-background border-border text-foreground"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">CVV</label>
                    <Input
                      type="text"
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleChange}
                      placeholder="123"
                      className="bg-background border-border text-foreground"
                      required
                    />
                  </div>
                </div>

                {/* Other Payment Methods */}
                <div className="mt-6 pt-6 border-t border-border">
                  <h4 className="font-semibold text-foreground mb-3">Other Payment Methods</h4>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { name: "Apple Pay", icon: "🍎" },
                        { name: "Google Pay", icon: "⚙️" },
                        { name: "PayPal", icon: "🅿️" },
                      ].map((method) => (
                        <button
                          key={method.name}
                          type="button"
                          className="p-3 border border-border rounded-lg hover:bg-muted transition-colors text-center"
                        >
                          <span className="text-xl">{method.icon}</span>
                          <p className="text-xs text-foreground mt-1">{method.name}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-6 p-3 bg-blue-50 text-blue-900 rounded-lg">
                    <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
                    </svg>
                    <span className="text-sm">Your payment is secured with SSL encryption</span>
                  </div>
                </div>
            )}

            {/* M-Pesa Payment Form */}
            {paymentMethod === "mpesa" && (
              <div className="space-y-4 pt-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">📱</div>
                    <div>
                      <h4 className="font-semibold text-green-900 mb-1">Pay with M-Pesa</h4>
                      <p className="text-sm text-green-700">
                        Enter your M-Pesa phone number. You'll receive a prompt on your phone to complete the payment.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    M-Pesa Phone Number
                  </label>
                  <Input
                    type="tel"
                    name="mpesaPhone"
                    value={formData.mpesaPhone}
                    onChange={handleChange}
                    placeholder="254797166836"
                    className="bg-background border-border text-foreground"
                    required
                    disabled={mpesaStatus === "processing" || mpesaStatus === "awaiting"}
                  />
                  <p className="text-xs text-muted-foreground mt-1">Format: 254XXXXXXXXX (no spaces)</p>
                </div>

                {mpesaStatus === "awaiting" && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="animate-pulse text-2xl">⏳</div>
                      <div>
                        <h4 className="font-semibold text-yellow-900 mb-1">Waiting for Payment</h4>
                        <p className="text-sm text-yellow-700">
                          Please check your phone for the M-Pesa prompt and enter your PIN to complete the payment.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {mpesaStatus === "failed" && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">❌</div>
                      <div>
                        <h4 className="font-semibold text-red-900 mb-1">Payment Failed</h4>
                        <p className="text-sm text-red-700">
                          The payment could not be processed. Please try again or contact support.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 shrink-0 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                    </svg>
                    <div>
                      <h4 className="font-semibold text-blue-900 mb-1">How it works</h4>
                      <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                        <li>Enter your M-Pesa registered phone number</li>
                        <li>Click "Complete Booking" button</li>
                        <li>Check your phone for the M-Pesa prompt</li>
                        <li>Enter your M-Pesa PIN to complete payment</li>
                      </ol>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6">
              <Button
                type="button"
                onClick={() => setActiveTab("address")}
                variant="outline"
                className="flex-1 border-border text-foreground hover:bg-muted"
              >
                Back
              </Button>
              <Button
                type="submit"
                disabled={paymentStatus === "processing" || mpesaStatus === "processing" || mpesaStatus === "awaiting"}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground h-12 font-semibold disabled:opacity-50"
              >
                {paymentStatus === "processing" || mpesaStatus === "processing"
                  ? "Processing..."
                  : mpesaStatus === "awaiting"
                    ? "Awaiting Payment..."
                    : paymentMethod === "mpesa"
                      ? "Send M-Pesa Prompt"
                      : "Complete Booking"}
              </Button>
            </div>
          </Card>
        )}
      </form>
    </div>
  )
}
