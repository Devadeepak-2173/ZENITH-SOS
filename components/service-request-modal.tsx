"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useWeb3 } from "@/components/web3-provider"
import { WalletIcon, ShieldCheckIcon, ClockIcon } from "@/components/icons"

interface ServiceRequestModalProps {
  isOpen: boolean
  onClose: () => void
  mechanicId: string
  mechanicName: string
  userLocation: { lat: number; lng: number } | null
}

export function ServiceRequestModal({
  isOpen,
  onClose,
  mechanicId,
  mechanicName,
  userLocation,
}: ServiceRequestModalProps) {
  const { smartContract, isConnected, userAddress, pendingTransactions } = useWeb3()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [serviceType, setServiceType] = useState<"emergency" | "regular" | "towing">("regular")
  const [description, setDescription] = useState("")
  const [estimatedCost, setEstimatedCost] = useState("")
  const [urgency, setUrgency] = useState<"low" | "medium" | "high">("medium")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isConnected || !userAddress || !userLocation) return

    setIsSubmitting(true)
    try {
      const requestId = await smartContract.createServiceRequest({
        userId: userAddress,
        mechanicId,
        serviceType,
        location: userLocation,
        description,
        estimatedCost,
      })

      console.log("Service request created:", requestId)
      onClose()

      // Reset form
      setDescription("")
      setEstimatedCost("")
      setServiceType("regular")
      setUrgency("medium")
    } catch (error) {
      console.error("Failed to create service request:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getServiceTypeInfo = (type: string) => {
    switch (type) {
      case "emergency":
        return { color: "destructive", description: "Immediate roadside assistance needed" }
      case "towing":
        return { color: "secondary", description: "Vehicle towing service required" }
      default:
        return { color: "outline", description: "Standard repair or maintenance service" }
    }
  }

  const getEstimatedGasFee = () => {
    // Mock gas fee calculation
    const baseFee = serviceType === "emergency" ? 0.002 : 0.001
    return `${baseFee} ETH`
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Service Request</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Service Provider Info */}
          <div className="p-3 bg-card rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheckIcon className="w-4 h-4 text-green-500" />
              <span className="font-medium">Service Provider</span>
            </div>
            <p className="text-sm text-muted-foreground">{mechanicName}</p>
            <p className="text-xs text-muted-foreground">ID: {mechanicId.slice(0, 10)}...</p>
          </div>

          {/* Service Type */}
          <div className="space-y-2">
            <Label htmlFor="serviceType">Service Type</Label>
            <Select value={serviceType} onValueChange={(value: any) => setServiceType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="regular">Regular Service</SelectItem>
                <SelectItem value="emergency">Emergency Service</SelectItem>
                <SelectItem value="towing">Towing Service</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2">
              <Badge variant={getServiceTypeInfo(serviceType).color as any} className="text-xs">
                {serviceType.charAt(0).toUpperCase() + serviceType.slice(1)}
              </Badge>
              <span className="text-xs text-muted-foreground">{getServiceTypeInfo(serviceType).description}</span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Problem Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the issue with your vehicle..."
              className="min-h-[80px]"
              required
            />
          </div>

          {/* Urgency Level */}
          <div className="space-y-2">
            <Label htmlFor="urgency">Urgency Level</Label>
            <Select value={urgency} onValueChange={(value: any) => setUrgency(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low - Can wait</SelectItem>
                <SelectItem value="medium">Medium - Within hours</SelectItem>
                <SelectItem value="high">High - Immediate attention</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Estimated Cost */}
          <div className="space-y-2">
            <Label htmlFor="estimatedCost">Estimated Cost (ETH)</Label>
            <Input
              id="estimatedCost"
              type="number"
              step="0.001"
              value={estimatedCost}
              onChange={(e) => setEstimatedCost(e.target.value)}
              placeholder="0.05"
              required
            />
            <p className="text-xs text-muted-foreground">This amount will be held in escrow until service completion</p>
          </div>

          <Separator />

          {/* Smart Contract Details */}
          <div className="space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <WalletIcon className="w-4 h-4" />
              Smart Contract Details
            </h4>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Service Amount:</span>
                <span className="font-medium">{estimatedCost || "0"} ETH</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Gas Fee (Est.):</span>
                <span className="font-medium">{getEstimatedGasFee()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Escrow Protection:</span>
                <span className="text-green-600 font-medium">✓ Enabled</span>
              </div>
            </div>

            <div className="p-2 bg-muted rounded text-xs text-muted-foreground">
              <div className="flex items-center gap-1 mb-1">
                <ClockIcon className="w-3 h-3" />
                <span className="font-medium">How it works:</span>
              </div>
              <ul className="space-y-1 ml-4">
                <li>• Payment is held in smart contract escrow</li>
                <li>• Mechanic receives payment after service completion</li>
                <li>• Dispute resolution available if needed</li>
                <li>• All transactions recorded on blockchain</li>
              </ul>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button
              type="submit"
              disabled={!isConnected || isSubmitting || !description || !estimatedCost}
              className="flex-1"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  Creating Request...
                </div>
              ) : (
                "Create Service Request"
              )}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>

          {/* Pending Transactions */}
          {pendingTransactions.length > 0 && (
            <div className="p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
              <p className="font-medium text-yellow-800">Pending Transactions:</p>
              {pendingTransactions.map((tx) => (
                <p key={tx} className="text-yellow-700 font-mono">
                  {tx.slice(0, 10)}...{tx.slice(-6)}
                </p>
              ))}
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  )
}
