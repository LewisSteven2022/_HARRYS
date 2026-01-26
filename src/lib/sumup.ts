// SumUp API integration for Hosted Checkout

const SUMUP_API_URL = 'https://api.sumup.com/v0.1'

interface CreateCheckoutParams {
  amount: number
  currency?: string
  checkoutReference: string
  description?: string
  redirectUrl: string
}

interface SumUpCheckoutResponse {
  id: string
  checkout_reference: string
  amount: number
  currency: string
  status: string
  hosted_checkout_url?: string
  date: string
  description?: string
  merchant_code: string
  merchant_name: string
  transactions: Array<{
    id: string
    status: string
    amount: number
    currency: string
    payment_type: string
  }>
}

export async function createSumUpCheckout({
  amount,
  currency = 'GBP',
  checkoutReference,
  description = "Harry's PT - Session Booking",
  redirectUrl,
}: CreateCheckoutParams): Promise<SumUpCheckoutResponse> {
  const apiKey = process.env.SUMUP_API_KEY
  const merchantCode = process.env.SUMUP_MERCHANT_CODE

  if (!apiKey || !merchantCode) {
    throw new Error('SumUp credentials not configured')
  }

  const response = await fetch(`${SUMUP_API_URL}/checkouts`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount,
      currency,
      checkout_reference: checkoutReference,
      description,
      merchant_code: merchantCode,
      redirect_url: redirectUrl,
      hosted_checkout: {
        enabled: true,
      },
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    console.error('SumUp checkout creation failed:', error)
    throw new Error(`Failed to create SumUp checkout: ${response.status}`)
  }

  return response.json()
}

export async function getSumUpCheckout(checkoutId: string): Promise<SumUpCheckoutResponse> {
  const apiKey = process.env.SUMUP_API_KEY

  if (!apiKey) {
    throw new Error('SumUp API key not configured')
  }

  const response = await fetch(`${SUMUP_API_URL}/checkouts/${checkoutId}`, {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to get SumUp checkout: ${response.status}`)
  }

  return response.json()
}

export function generateCheckoutReference(): string {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 8)
  return `HPT-${timestamp}-${random}`.toUpperCase()
}
