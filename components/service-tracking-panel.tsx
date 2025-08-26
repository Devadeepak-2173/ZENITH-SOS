"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  ClockIcon,
  LocationIcon,
  PhoneIcon,
  MessageCircleIcon,
  CheckCircleIcon,
  TruckIcon,
  WrenchIcon,
} from "@/components/icons"

interface ServiceStatus {
  id: string
  status: "requested" | "accepted" | "en_route" | "arrived" | "in_progress" | "completed"
  mechanicId: string
  mechanicName: string
  mechanicPhone: string
  mechanicImage?: string
  estimatedArrival: Date
  actualArrival?: Date
  serviceStarted?: Date
  serviceCompleted?: Date
  currentLocation?: { lat: number; lng: number }
  distance: number
  updates: ServiceUpdate[]
}

interface ServiceUpdate {
  id: string
  timestamp: Date
  type: "status" | "location" | "message" | "eta"
  message: string
  data?: any
}

interface ServiceTrackingPanelProps {
  serviceId: string
  onEndTracking: () => void
  onContactMechanic: (phone: string) => void
}

export function ServiceTrackingPanel({ serviceId, onEndTracking, onContactMechanic }: ServiceTrackingPanelProps) {
  const [serviceStatus, setServiceStatus] = useState<ServiceStatus>({
    id: serviceId,
    status: "accepted",
    mechanicId: "mech_001",
    mechanicName: "Rajesh Auto Service",
    mechanicPhone: "+91 98765 43210",
    mechanicImage: "/mechanic-profiles.png",
    estimatedArrival: new Date(Date.now() + 900000), // 15 minutes from now
    currentLocation: { lat: 28.6129, lng: 77.208 },
    distance: 2.3,
    updates: [],
  })

  const [progress, setProgress] = useState(0)
  const [timeElapsed, setTimeElapsed] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeElapsed((prev) => prev + 1)

      // Simulate service progression
      setServiceStatus((prev) => {
        const newUpdates = [...prev.updates]

        // Add random updates
        if (Math.random() > 0.8) {
          const updateTypes = ["location", "message", "eta"]
          const randomType = updateTypes[Math.floor(Math.random() * updateTypes.length)]

          let message = ""
          switch (randomType) {
            case "location":
              message = "Mechanic location updated - getting closer"
              break
            case "message":
              message = "Traffic is light, arriving on schedule"
              break
            case "eta":
              message = "ETA updated based on current conditions"
              break
          }

          newUpdates.unshift({
            id: `update_${Date.now()}`,
            timestamp: new Date(),
            type: randomType as any,
            message,
          })
        }

        // Simulate status progression
        let newStatus = prev.status
        if (timeElapsed > 30 && prev.status === "accepted") {
          newStatus = "en_route"
          newUpdates.unshift({
            id: `status_${Date.now()}`,
            timestamp: new Date(),
            type: "status",
            message: "Mechanic is now en route to your location",
          })
        } else if (timeElapsed > 60 && prev.status === "en_route") {
          newStatus = "arrived"
          newUpdates.unshift({
            id: `status_${Date.now()}`,
            timestamp: new Date(),
            type: "status",
            message: "Mechanic has arrived at your location",
          })
        } else if (timeElapsed > 90 && prev.status === "arrived") {
          newStatus = "in_progress"
          newUpdates.unshift({
            id: `status_${Date.now()}`,
            timestamp: new Date(),
            type: "status",
            message: "Service work has begun",
          })
        }

        return {
          ...prev,
          status: newStatus,
          updates: newUpdates.slice(0, 10), // Keep last 10 updates
          distance: Math.max(0.1, prev.distance - 0.05), // Simulate getting closer
        }
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [timeElapsed])

  useEffect(() => {
    const statusProgress = {
      requested: 10,
      accepted: 25,
      en_route: 50,
      arrived: 75,
      in_progress: 90,
      completed: 100,
    }
    setProgress(statusProgress[serviceStatus.status])
  }, [serviceStatus.status])

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      requested: { color: "outline", text: "Requested" },
      accepted: { color: "secondary", text: "Accepted" },
      en_route: { color: "default", text: "En Route" },
      arrived: { color: "secondary", text: "Arrived" },
      in_progress: { color: "default", text: "In Progress" },
      completed: { color: "secondary", text: "Completed" },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.requested

    return (
      <Badge variant={config.color as any} className="text-xs">
        {config.text}
      </Badge>
    )
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "accepted":
        return <CheckCircleIcon className="w-4 h-4 text-green-500" />
      case "en_route":
        return <TruckIcon className="w-4 h-4 text-blue-500" />
      case "arrived":
        return <LocationIcon className="w-4 h-4 text-purple-500" />
      case "in_progress":
        return <WrenchIcon className="w-4 h-4 text-orange-500" />
      case "completed":
        return <CheckCircleIcon className="w-4 h-4 text-green-500" />
      default:
        return <ClockIcon className="w-4 h-4 text-gray-500" />
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const formatETA = (date: Date) => {
    const minutes = Math.floor((date.getTime() - Date.now()) / 60000)
    if (minutes <= 0) return "Arriving now"
    if (minutes < 60) return `${minutes} mins`
    return `${Math.floor(minutes / 60)}h ${minutes % 60}m`
  }

  return (
    <Card className="border-primary">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            {getStatusIcon(serviceStatus.status)}
            Service Tracking
          </span>
          {getStatusBadge(serviceStatus.status)}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Service Progress</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Mechanic Info */}
        <div className="flex items-center gap-3">
          <Avatar className="w-12 h-12">
            <AvatarImage src={serviceStatus.mechanicImage || "/placeholder.svg"} />
            <AvatarFallback>
              {serviceStatus.mechanicName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h4 className="font-medium">{serviceStatus.mechanicName}</h4>
            <p className="text-sm text-muted-foreground">Your assigned mechanic</p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => onContactMechanic(serviceStatus.mechanicPhone)}>
              <PhoneIcon className="w-4 h-4 mr-1" />
              Call
            </Button>
            <Button size="sm" variant="outline">
              <MessageCircleIcon className="w-4 h-4 mr-1" />
              Chat
            </Button>
          </div>
        </div>

        <Separator />

        {/* Live Stats */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-primary">{formatTime(timeElapsed)}</p>
            <p className="text-xs text-muted-foreground">Time Elapsed</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-accent">{serviceStatus.distance.toFixed(1)} km</p>
            <p className="text-xs text-muted-foreground">Distance</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-secondary-foreground">
              {serviceStatus.status === "arrived" || serviceStatus.status === "in_progress"
                ? "Arrived"
                : formatETA(serviceStatus.estimatedArrival)}
            </p>
            <p className="text-xs text-muted-foreground">ETA</p>
          </div>
        </div>

        <Separator />

        {/* Live Updates */}
        <div className="space-y-3">
          <h4 className="font-medium">Live Updates</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {serviceStatus.updates.length === 0 ? (
              <p className="text-sm text-muted-foreground">Waiting for updates...</p>
            ) : (
              serviceStatus.updates.map((update) => (
                <div key={update.id} className="flex items-start gap-2 text-sm">
                  <div className="mt-1">{getStatusIcon(update.type)}</div>
                  <div className="flex-1">
                    <p className="text-foreground">{update.message}</p>
                    <p className="text-xs text-muted-foreground">{update.timestamp.toLocaleTimeString()}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-4 border-t">
          {serviceStatus.status === "completed" ? (
            <Button onClick={onEndTracking} className="flex-1">
              Complete Service
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={() => onContactMechanic(serviceStatus.mechanicPhone)}
                className="flex-1"
              >
                <PhoneIcon className="w-4 h-4 mr-2" />
                Contact Mechanic
              </Button>
              <Button variant="outline" onClick={onEndTracking}>
                Cancel Service
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
