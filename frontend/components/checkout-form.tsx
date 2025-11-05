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
  })

  const [activeTab, setActiveTab] = useState("personal")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onPaymentStatusChange("processing")

    // Simulate payment processing
    setTimeout(() => {
      onPaymentStatusChange("success")
    }, 2000)
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

            {/* Payment Methods */}
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
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
              </svg>
              <span className="text-sm">Your payment is secured with SSL encryption</span>
            </div>

            <div className="flex gap-3">
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
                disabled={paymentStatus === "processing"}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground h-12 font-semibold disabled:opacity-50"
              >
                {paymentStatus === "processing" ? "Processing..." : "Complete Booking"}
              </Button>
            </div>
          </Card>
        )}
      </form>
    </div>
  )
}
