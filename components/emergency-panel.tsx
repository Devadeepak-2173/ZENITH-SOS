"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AlertTriangleIcon, PhoneIcon, CheckCircleIcon, ClockIcon, LocationIcon } from "@/components/icons"

interface EmergencyState {
  isActive: boolean
  startTime: Date | null
  emergencyId: string | null
  contactedServices: string[]
  locationShared: boolean
}

interface EmergencyContact {
  id: string
  name: string
  phone: string
  type: "family" | "friend" | "insurance" | "emergency"
}

interface EmergencyPanelProps {
  emergencyState: EmergencyState
  emergencyContacts: EmergencyContact[]
  userLocation: { lat: number; lng: number } | null
  onEndEmergency: () => void
}

export function EmergencyPanel({
  emergencyState,
  emergencyContacts,
  userLocation,
  onEndEmergency,
}: EmergencyPanelProps) {
  const [elapsedTime, setElapsedTime] = useState(0)
  const [emergencyProgress, setEmergencyProgress] = useState(0)

  useEffect(() => {
    if (emergencyState.isActive && emergencyState.startTime) {
      const interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - emergencyState.startTime!.getTime()) / 1000)
        setElapsedTime(elapsed)
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [emergencyState.isActive, emergencyState.startTime])

  useEffect(() => {
    // Calculate progress based on completed services
    const totalServices = 4 // mechanics, contacts, blockchain, location
    const completedServices = emergencyState.contactedServices.length + (emergencyState.locationShared ? 1 : 0)
    setEmergencyProgress((completedServices / totalServices) * 100)
  }, [emergencyState.contactedServices, emergencyState.locationShared])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleContactCall = (phone: string) => {
    window.open(`tel:${phone}`, "_self")
  }

  return (
    <Card className="border-destructive bg-destructive/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-destructive">
          <AlertTriangleIcon className="w-5 h-5" />
          Emergency Response Active
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Emergency Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-destructive">{formatTime(elapsedTime)}</div>
            <p className="text-sm text-muted-foreground">Time Elapsed</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{Math.round(emergencyProgress)}%</div>
            <p className="text-sm text-muted-foreground">Services Contacted</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent">3</div>
            <p className="text-sm text-muted-foreground">Mechanics Alerted</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Emergency Response Progress</span>
            <span>{Math.round(emergencyProgress)}%</span>
          </div>
          <Progress value={emergencyProgress} className="h-2" />
        </div>

        {/* Service Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <h4 className="font-medium">Service Status</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                {emergencyState.locationShared ? (
                  <CheckCircleIcon className="w-4 h-4 text-green-500" />
                ) : (
                  <ClockIcon className="w-4 h-4 text-yellow-500" />
                )}
                <span>Location Shared</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                {emergencyState.contactedServices.includes("mechanics") ? (
                  <CheckCircleIcon className="w-4 h-4 text-green-500" />
                ) : (
                  <ClockIcon className="w-4 h-4 text-yellow-500" />
                )}
                <span>Mechanics Alerted</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                {emergencyState.contactedServices.includes("contacts") ? (
                  <CheckCircleIcon className="w-4 h-4 text-green-500" />
                ) : (
                  <ClockIcon className="w-4 h-4 text-yellow-500" />
                )}
                <span>Emergency Contacts Notified</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                {emergencyState.contactedServices.includes("blockchain") ? (
                  <CheckCircleIcon className="w-4 h-4 text-green-500" />
                ) : (
                  <ClockIcon className="w-4 h-4 text-yellow-500" />
                )}
                <span>Blockchain Record Created</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium">Emergency Contacts</h4>
            <div className="space-y-2">
              {emergencyContacts.map((contact) => (
                <div key={contact.id} className="flex items-center justify-between p-2 bg-card rounded-lg">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {contact.type}
                    </Badge>
                    <span className="text-sm font-medium">{contact.name}</span>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => handleContactCall(contact.phone)}>
                    <PhoneIcon className="w-3 h-3 mr-1" />
                    Call
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Location Info */}
        {userLocation && (
          <div className="p-3 bg-card rounded-lg">
            <div className="flex items-center gap-2 text-sm">
              <LocationIcon className="w-4 h-4" />
              <span className="font-medium">Current Location:</span>
              <span className="text-muted-foreground">
                {userLocation.lat.toFixed(6)}, {userLocation.lng.toFixed(6)}
              </span>
            </div>
          </div>
        )}

        {/* Emergency Actions */}
        <div className="flex gap-2 pt-4 border-t">
          <Button variant="destructive" size="sm" onClick={() => handleContactCall("112")}>
            <PhoneIcon className="w-4 h-4 mr-2" />
            Call Emergency Services
          </Button>
          <Button variant="outline" size="sm" onClick={onEndEmergency}>
            End Emergency
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
