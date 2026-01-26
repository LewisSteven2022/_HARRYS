'use client'

import { useState } from 'react'
import CreditPurchaseModal from '@/components/CreditPurchaseModal'

interface CreditPurchaseInfo {
  id: string
  packageName: string
  creditsRemaining: number
  expiresAt: string
}

interface CreditBalanceCardProps {
  totalCredits: number
  expiringCredits: number
  earliestExpiration?: Date | null
  creditPurchases: CreditPurchaseInfo[]
}

function formatExpirationDate(dateStr: string): string {
  const date = new Date(dateStr)
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

export default function CreditBalanceCard({
  totalCredits,
  expiringCredits,
  earliestExpiration,
  creditPurchases,
}: CreditBalanceCardProps) {
  const [showModal, setShowModal] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  return (
    <>
      <div className="mb-8 bg-gradient-to-r from-lime/10 to-lime/5 border border-lime/30 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm uppercase tracking-wider mb-1">
              Session Credits
            </p>
            <p className="font-display text-4xl text-lime">
              {totalCredits}
            </p>
            {expiringCredits > 0 && earliestExpiration && (
              <p className="text-yellow-400 text-sm mt-2">
                {expiringCredits} credit{expiringCredits !== 1 ? 's' : ''} expiring soon
              </p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => setShowModal(true)}
              className="btn-lime text-sm px-4 py-2"
            >
              Buy Credits
            </button>
            {creditPurchases.length > 0 && (
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="text-gray-400 text-sm hover:text-white transition-colors"
              >
                {showDetails ? 'Hide' : 'View'} Details
              </button>
            )}
          </div>
        </div>

        {/* Credit Details */}
        {showDetails && creditPurchases.length > 0 && (
          <div className="mt-6 pt-6 border-t border-lime/20">
            <p className="text-gray-400 text-xs uppercase mb-3">Your Credit Packs</p>
            <div className="space-y-2">
              {creditPurchases.map((purchase) => {
                const isExpiringSoon =
                  new Date(purchase.expiresAt) <=
                  new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

                return (
                  <div
                    key={purchase.id}
                    className="flex justify-between items-center text-sm"
                  >
                    <div>
                      <span className="text-white">{purchase.packageName}</span>
                      <span className="text-gray-500 ml-2">
                        ({purchase.creditsRemaining} remaining)
                      </span>
                    </div>
                    <span
                      className={
                        isExpiringSoon ? 'text-yellow-400' : 'text-gray-500'
                      }
                    >
                      Expires {formatExpirationDate(purchase.expiresAt)}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {totalCredits === 0 && (
          <p className="text-gray-400 text-sm mt-4">
            Buy credits in bulk to save money on your sessions!
          </p>
        )}
      </div>

      <CreditPurchaseModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  )
}
