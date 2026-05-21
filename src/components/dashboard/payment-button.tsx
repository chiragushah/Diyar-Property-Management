"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CreditCard, Loader2 } from "lucide-react"
import { processInvoicePayment } from "@/lib/actions/invoices"

export function PaymentButton({ invoiceId }: { invoiceId: string }) {
  const [loading, setLoading] = useState(false)

  const handlePayment = async () => {
    setLoading(true)
    try {
      await processInvoicePayment(invoiceId)
    } catch (error) {
      console.error("Payment failed", error)
      alert("Payment failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      size="sm"
      variant="outline"
      className="text-blue-600 border-blue-200 hover:bg-blue-50"
      onClick={handlePayment}
      disabled={loading}
    >
      {loading ? (
        <Loader2 className="w-3 h-3 mr-1 animate-spin" />
      ) : (
        <CreditCard className="w-3 h-3 mr-1" />
      )}
      Pay Now
    </Button>
  )
}
