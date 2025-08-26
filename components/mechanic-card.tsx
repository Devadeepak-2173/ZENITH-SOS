"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { ServiceRequestModal } from "@/components/service-request-modal"
import { useWeb3 } from "@/components/web3-provider"
import {
  LocationIcon,
  PhoneIcon,
  StarIcon,
  ClockIcon,
  ShieldCheckIcon,
  TruckIcon,
  WalletIcon,
  CheckCircleIcon,
  AlertCircleIcon,
} from "@/components/icons"

interface Mechanic {
  id: string
  name: string
  rating: number
  distance: number
  estimatedTime: string
  phone: string
  verified: boolean
  specialties: string[]
  location: { lat: number; lng: number }
  verificationLevel: "basic" | "verified" | "premium"
  certifications: string[]
  experienceYears: number
  completedJobs: number
  responseTime: string
  availability: "available" | "busy" | "offline"
  profileImage?: string
  businessLicense?: string
  backgroundCheck: "pending" | "verified" | "failed"
  insuranceVerified: boolean
  walletAddress?: string
  onChainReputation: number
  lastActive: Date
  serviceHistory: {
    totalServices: number
    emergencyServices: number
    successRate: number
  }
}

interface MechanicCardProps {
  mechanic: Mechanic
  onCall: (phone: string) => void
  isEmergency: boolean
}

export function MechanicCard({ mechanic, onCall, isEmergency }: MechanicCardProps) {
  const [showDetails, setShowDetails] = useState(false)
  const [showServiceRequest, setShowServiceRequest] = useState(false)
  const { isConnected, userLocation } = useWeb3()

  const getVerificationBadge = (level: string) => {
    switch (level) {
      case "basic":
        return (
          <Badge variant="outline" className="text-xs">
            Basic
          </Badge>
        )
      case "verified":
        return (
          <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
            <ShieldCheckIcon className="w-3 h-3 mr-1" />
            Verified
          </Badge>
        )
      case "premium":
        return (
          <Badge variant="default" className="text-xs bg-purple-100 text-purple-800">
            <ShieldCheckIcon className="w-3 h-3 mr-1" />
            Premium
          </Badge>
        )
      default:
        return null
    }
  }

  const getAvailabilityBadge = (availability: string) => {
    switch (availability) {
      case "available":
        return (
          <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
            Available
          </Badge>
        )
      case "busy":
        return (
          <Badge variant="outline" className="text-xs bg-yellow-100 text-yellow-800">
            Busy
          </Badge>
        )
      case "offline":
        return (
          <Badge variant="outline" className="text-xs bg-gray-100 text-gray-800">
            Offline
          </Badge>
        )
      default:
        return null
    }
  }

  const formatLastActive = (date: Date) => {
    const minutes = Math.floor((Date.now() - date.getTime()) / 60000)
    if (minutes < 1) return "Active now"
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
  }

  return (
    <>
      <Card className={`hover:shadow-md transition-shadow ${isEmergency ? "border-destructive" : ""}`}>
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={mechanic.profileImage || "/placeholder.svg"} />
                  <AvatarFallback>
                    {mechanic.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-medium">{mechanic.name}</h4>
                    {getVerificationBadge(mechanic.verificationLevel)}
                    {getAvailabilityBadge(mechanic.availability)}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                    <span className="flex items-center gap-1">
                      <StarIcon className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      {mechanic.rating}
                    </span>
                    <span>{mechanic.experienceYears}y exp</span>
                    <span>{mechanic.completedJobs} jobs</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Button
                  size="sm"
                  onClick={() => onCall(mechanic.phone)}
                  className="shrink-0"
                  disabled={mechanic.availability === "offline"}
                >
                  <PhoneIcon className="w-4 h-4 mr-1" />
                  Call
                </Button>
                {isConnected && mechanic.walletAddress && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowServiceRequest(true)}
                    className="shrink-0"
                    disabled={mechanic.availability === "offline"}
                  >
                    <WalletIcon className="w-4 h-4 mr-1" />
                    Request
                  </Button>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <LocationIcon className="w-4 h-4" />
                {mechanic.distance} km
              </span>
              <span className="flex items-center gap-1">
                <ClockIcon className="w-4 h-4" />
                {mechanic.estimatedTime}
              </span>
              <span className="flex items-center gap-1">
                <TruckIcon className="w-4 h-4" />
                {mechanic.responseTime}
              </span>
            </div>

            <div className="flex flex-wrap gap-1">
              {mechanic.specialties.slice(0, 3).map((specialty) => (
                <Badge key={specialty} variant="outline" className="text-xs">
                  {specialty}
                </Badge>
              ))}
              {mechanic.specialties.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{mechanic.specialties.length - 3} more
                </Badge>
              )}
            </div>

            <div className="flex items-center justify-between pt-2 border-t">
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                {mechanic.backgroundCheck === "verified" && (
                  <span className="flex items-center gap-1 text-green-600">
                    <CheckCircleIcon className="w-3 h-3" />
                    Background
                  </span>
                )}
                {mechanic.insuranceVerified && (
                  <span className="flex items-center gap-1 text-green-600">
                    <CheckCircleIcon className="w-3 h-3" />
                    Insured
                  </span>
                )}
                {mechanic.walletAddress && (
                  <span className="flex items-center gap-1 text-blue-600">
                    <WalletIcon className="w-3 h-3" />
                    Web3
                  </span>
                )}
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowDetails(true)}>
                View Details
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Mechanic Profile</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={mechanic.profileImage || "/placeholder.svg"} />
                <AvatarFallback>
                  {mechanic.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <h3 className="text-xl font-semibold">{mechanic.name}</h3>
                  {getVerificationBadge(mechanic.verificationLevel)}
                  {getAvailabilityBadge(mechanic.availability)}
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Experience:</span>
                    <span className="ml-2 font-medium">{mechanic.experienceYears} years</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Last Active:</span>
                    <span className="ml-2 font-medium">{formatLastActive(mechanic.lastActive)}</span>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <h4 className="font-medium">Verification Status</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  {mechanic.backgroundCheck === "verified" ? (
                    <CheckCircleIcon className="w-4 h-4 text-green-500" />
                  ) : (
                    <AlertCircleIcon className="w-4 h-4 text-yellow-500" />
                  )}
                  <span className="text-sm">Background Check</span>
                </div>
                <div className="flex items-center gap-2">
                  {mechanic.insuranceVerified ? (
                    <CheckCircleIcon className="w-4 h-4 text-green-500" />
                  ) : (
                    <AlertCircleIcon className="w-4 h-4 text-red-500" />
                  )}
                  <span className="text-sm">Insurance Verified</span>
                </div>
                <div className="flex items-center gap-2">
                  {mechanic.businessLicense ? (
                    <CheckCircleIcon className="w-4 h-4 text-green-500" />
                  ) : (
                    <AlertCircleIcon className="w-4 h-4 text-red-500" />
                  )}
                  <span className="text-sm">Business License</span>
                </div>
                <div className="flex items-center gap-2">
                  {mechanic.walletAddress ? (
                    <CheckCircleIcon className="w-4 h-4 text-green-500" />
                  ) : (
                    <AlertCircleIcon className="w-4 h-4 text-gray-400" />
                  )}
                  <span className="text-sm">Web3 Verified</span>
                </div>
              </div>
              {mechanic.businessLicense && (
                <p className="text-xs text-muted-foreground">License: {mechanic.businessLicense}</p>
              )}
            </div>

            <Separator />

            <div className="space-y-3">
              <h4 className="font-medium">Performance Metrics</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Success Rate</span>
                    <span>{mechanic.serviceHistory.successRate}%</span>
                  </div>
                  <Progress value={mechanic.serviceHistory.successRate} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>On-Chain Reputation</span>
                    <span>{mechanic.onChainReputation}/5.0</span>
                  </div>
                  <Progress value={(mechanic.onChainReputation / 5) * 100} className="h-2" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-primary">{mechanic.serviceHistory.totalServices}</p>
                  <p className="text-xs text-muted-foreground">Total Services</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-destructive">{mechanic.serviceHistory.emergencyServices}</p>
                  <p className="text-xs text-muted-foreground">Emergency Services</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-accent">{mechanic.responseTime}</p>
                  <p className="text-xs text-muted-foreground">Avg Response</p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <h4 className="font-medium">Certifications & Specialties</h4>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Certifications:</p>
                  <div className="flex flex-wrap gap-1">
                    {mechanic.certifications.map((cert) => (
                      <Badge key={cert} variant="secondary" className="text-xs">
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Specialties:</p>
                  <div className="flex flex-wrap gap-1">
                    {mechanic.specialties.map((specialty) => (
                      <Badge key={specialty} variant="outline" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {mechanic.walletAddress && (
              <>
                <Separator />
                <div className="space-y-3">
                  <h4 className="font-medium">Web3 Profile</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <WalletIcon className="w-4 h-4" />
                      <span className="text-muted-foreground">Wallet:</span>
                      <code className="text-xs bg-muted px-2 py-1 rounded">
                        {mechanic.walletAddress.slice(0, 6)}...{mechanic.walletAddress.slice(-4)}
                      </code>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <StarIcon className="w-4 h-4" />
                      <span className="text-muted-foreground">On-Chain Reputation:</span>
                      <span className="font-medium">{mechanic.onChainReputation}/5.0</span>
                    </div>
                  </div>
                </div>
              </>
            )}

            <Separator />

            <div className="flex gap-2">
              <Button onClick={() => onCall(mechanic.phone)} className="flex-1">
                <PhoneIcon className="w-4 h-4 mr-2" />
                Call {mechanic.name}
              </Button>
              {isConnected && mechanic.walletAddress && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowDetails(false)
                    setShowServiceRequest(true)
                  }}
                >
                  <WalletIcon className="w-4 h-4 mr-2" />
                  Create Request
                </Button>
              )}
              <Button variant="outline" onClick={() => setShowDetails(false)}>
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ServiceRequestModal
        isOpen={showServiceRequest}
        onClose={() => setShowServiceRequest(false)}
        mechanicId={mechanic.walletAddress || mechanic.id}
        mechanicName={mechanic.name}
        userLocation={userLocation}
      />
    </>
  )
}
