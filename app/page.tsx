"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MapComponent } from "@/components/map-component"
import { SOSButton } from "@/components/sos-button"
import { WalletConnection } from "@/components/wallet-connection"
import { EmergencyPanel } from "@/components/emergency-panel"
import { MechanicCard } from "@/components/mechanic-card"
import { ServiceTrackingPanel } from "@/components/service-tracking-panel"
import { LocationIcon } from "@/components/icons"

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
  isEnRoute?: boolean
  estimatedArrival?: Date
}

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

export default function HomePage() {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [nearbyMechanics, setNearbyMechanics] = useState<Mechanic[]>([])
  const [emergencyState, setEmergencyState] = useState<EmergencyState>({
    isActive: false,
    startTime: null,
    emergencyId: null,
    contactedServices: [],
    locationShared: false,
  })
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([
    { id: "1", name: "Family Contact", phone: "+91 98765 43210", type: "family" },
    { id: "2", name: "Insurance Provider", phone: "+91 1800 123 456", type: "insurance" },
    { id: "3", name: "Emergency Services", phone: "112", type: "emergency" },
  ])
  const [activeServiceId, setActiveServiceId] = useState<string | null>(null)
  const [selectedMechanicId, setSelectedMechanicId] = useState<string | null>(null)

  useEffect(() => {
    setNearbyMechanics([
      {
        id: "1",
        name: "Rajesh Auto Service - National Highway 1 (Grand Trunk Road)",
        rating: 4.8,
        distance: 2.3,
        estimatedTime: "15 mins",
        phone: "+91 98765 43210",
        verified: true,
        specialties: ["Engine Repair", "Tire Change", "Electrical"],
        location: { lat: 29.3909, lng: 76.9635 }, // Ludhiana, Punjab State
        verificationLevel: "premium",
        certifications: ["ASE Certified", "Bosch Trained", "Government Licensed"],
        experienceYears: 12,
        completedJobs: 1247,
        responseTime: "< 5 mins",
        availability: "available",
        profileImage: "/mechanic-profiles.png",
        businessLicense: "HR-2024-AUTO-001",
        backgroundCheck: "verified",
        insuranceVerified: true,
        walletAddress: "0xabc123...def456",
        onChainReputation: 4.9,
        lastActive: new Date(Date.now() - 300000),
        serviceHistory: {
          totalServices: 1247,
          emergencyServices: 89,
          successRate: 98.5,
        },
        isEnRoute: activeServiceId === "service_001",
        estimatedArrival: activeServiceId === "service_001" ? new Date(Date.now() + 900000) : undefined,
      },
      {
        id: "2",
        name: "Highway Rescue Center - National Highway 8 (Delhi-Mumbai Highway)",
        rating: 4.6,
        distance: 3.1,
        estimatedTime: "22 mins",
        phone: "+91 87654 32109",
        verified: true,
        specialties: ["Towing", "Battery Jump", "Lockout Service"],
        location: { lat: 28.4595, lng: 77.0266 }, // Jaipur, Rajasthan State
        verificationLevel: "verified",
        certifications: ["Towing Certified", "Emergency Response"],
        experienceYears: 8,
        completedJobs: 892,
        responseTime: "< 10 mins",
        availability: "available",
        profileImage: "/mechanic-profiles.png",
        businessLicense: "HR-2024-TOW-002",
        backgroundCheck: "verified",
        insuranceVerified: true,
        walletAddress: "0xdef456...ghi789",
        onChainReputation: 4.7,
        lastActive: new Date(Date.now() - 600000),
        serviceHistory: {
          totalServices: 892,
          emergencyServices: 156,
          successRate: 96.2,
        },
      },
      {
        id: "3",
        name: "Quick Fix Motors - National Highway 2 (Delhi-Kolkata Highway)",
        rating: 4.4,
        distance: 4.7,
        estimatedTime: "28 mins",
        phone: "+91 76543 21098",
        verified: true,
        specialties: ["Brake Repair", "AC Service", "Oil Change"],
        location: { lat: 27.4924, lng: 77.6737 }, // Agra, Uttar Pradesh State
        verificationLevel: "basic",
        certifications: ["Basic Mechanic License"],
        experienceYears: 5,
        completedJobs: 423,
        responseTime: "< 15 mins",
        availability: "busy",
        profileImage: "/mechanic-profiles.png",
        businessLicense: "UP-2024-REP-003",
        backgroundCheck: "verified",
        insuranceVerified: false,
        walletAddress: "0xghi789...jkl012",
        onChainReputation: 4.3,
        lastActive: new Date(Date.now() - 1800000),
        serviceHistory: {
          totalServices: 423,
          emergencyServices: 23,
          successRate: 94.1,
        },
      },
      {
        id: "4",
        name: "Delhi-Mumbai Express Service - National Highway 48 (Western Express Highway)",
        rating: 4.7,
        distance: 5.2,
        estimatedTime: "32 mins",
        phone: "+91 99887 76655",
        verified: true,
        specialties: ["Heavy Vehicle Repair", "Truck Towing", "Diesel Engine"],
        location: { lat: 28.367, lng: 76.7794 }, // Rewari, Haryana State
        verificationLevel: "premium",
        certifications: ["Heavy Vehicle Certified", "Commercial License"],
        experienceYears: 15,
        completedJobs: 2156,
        responseTime: "< 8 mins",
        availability: "available",
        profileImage: "/mechanic-profiles.png",
        businessLicense: "HR-2024-HV-004",
        backgroundCheck: "verified",
        insuranceVerified: true,
        walletAddress: "0xjkl012...mno345",
        onChainReputation: 4.8,
        lastActive: new Date(Date.now() - 180000),
        serviceHistory: {
          totalServices: 2156,
          emergencyServices: 234,
          successRate: 97.8,
        },
      },
      {
        id: "5",
        name: "Kolkata Highway Motors - National Highway 19 (Delhi-Kolkata via Agra)",
        rating: 4.5,
        distance: 6.8,
        estimatedTime: "38 mins",
        phone: "+91 88776 65544",
        verified: true,
        specialties: ["Transmission Repair", "Clutch Service", "Radiator Fix"],
        location: { lat: 28.7041, lng: 77.1025 }, // India Gate, New Delhi
        verificationLevel: "verified",
        certifications: ["Transmission Specialist", "Cooling System Expert"],
        experienceYears: 10,
        completedJobs: 1089,
        responseTime: "< 12 mins",
        availability: "available",
        profileImage: "/mechanic-profiles.png",
        businessLicense: "DL-2024-TRANS-005",
        backgroundCheck: "verified",
        insuranceVerified: true,
        walletAddress: "0xmno345...pqr678",
        onChainReputation: 4.6,
        lastActive: new Date(Date.now() - 420000),
        serviceHistory: {
          totalServices: 1089,
          emergencyServices: 67,
          successRate: 95.7,
        },
      },
      {
        id: "6",
        name: "Punjab Auto Care - National Highway 1 (Amritsar-Delhi Highway)",
        rating: 4.9,
        distance: 8.2,
        estimatedTime: "45 mins",
        phone: "+91 98123 45678",
        verified: true,
        specialties: ["Truck Repair", "Agricultural Vehicle Service", "Heavy Machinery"],
        location: { lat: 30.901, lng: 75.8573 }, // Ludhiana, Punjab State
        verificationLevel: "premium",
        certifications: ["Heavy Vehicle Expert", "Agricultural Equipment Certified"],
        experienceYears: 18,
        completedJobs: 2890,
        responseTime: "< 6 mins",
        availability: "available",
        profileImage: "/mechanic-profiles.png",
        businessLicense: "PB-2024-AGRI-006",
        backgroundCheck: "verified",
        insuranceVerified: true,
        walletAddress: "0xpqr678...stu901",
        onChainReputation: 4.9,
        lastActive: new Date(Date.now() - 120000),
        serviceHistory: {
          totalServices: 2890,
          emergencyServices: 312,
          successRate: 99.1,
        },
      },
      {
        id: "7",
        name: "Rajasthan Desert Motors - National Highway 8 (Jaipur-Delhi Highway)",
        rating: 4.3,
        distance: 9.5,
        estimatedTime: "52 mins",
        phone: "+91 94567 89012",
        verified: true,
        specialties: ["Desert Vehicle Repair", "Cooling System", "Sand Filter Cleaning"],
        location: { lat: 26.9124, lng: 75.7873 }, // Jaipur, Rajasthan State
        verificationLevel: "verified",
        certifications: ["Desert Vehicle Specialist", "Cooling System Expert"],
        experienceYears: 14,
        completedJobs: 1567,
        responseTime: "< 10 mins",
        availability: "available",
        profileImage: "/mechanic-profiles.png",
        businessLicense: "RJ-2024-DESERT-007",
        backgroundCheck: "verified",
        insuranceVerified: true,
        walletAddress: "0xstu901...vwx234",
        onChainReputation: 4.4,
        lastActive: new Date(Date.now() - 900000),
        serviceHistory: {
          totalServices: 1567,
          emergencyServices: 89,
          successRate: 96.8,
        },
      },
      {
        id: "8",
        name: "UP Highway Service - National Highway 2 (Grand Trunk Road - Agra Section)",
        rating: 4.6,
        distance: 12.1,
        estimatedTime: "58 mins",
        phone: "+91 91234 56789",
        verified: true,
        specialties: ["Tourist Vehicle Service", "AC Repair", "Long Distance Support"],
        location: { lat: 27.1767, lng: 78.0081 }, // Agra, Uttar Pradesh State
        verificationLevel: "verified",
        certifications: ["Tourist Vehicle Certified", "AC Specialist"],
        experienceYears: 11,
        completedJobs: 1234,
        responseTime: "< 8 mins",
        availability: "busy",
        profileImage: "/mechanic-profiles.png",
        businessLicense: "UP-2024-TOUR-008",
        backgroundCheck: "verified",
        insuranceVerified: true,
        walletAddress: "0xvwx234...yza567",
        onChainReputation: 4.7,
        lastActive: new Date(Date.now() - 1200000),
        serviceHistory: {
          totalServices: 1234,
          emergencyServices: 156,
          successRate: 97.3,
        },
      },
    ])
  }, [activeServiceId])

  useEffect(() => {
    if (navigator.geolocation) {
      console.log("[v0] Requesting user location...")
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("[v0] Location obtained successfully:", position.coords.latitude, position.coords.longitude)
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        (error) => {
          console.log("[v0] Geolocation denied or failed, using default Delhi location")
          // Default to Delhi area with realistic highway coordinates
          setUserLocation({ lat: 28.6129, lng: 77.2295 }) // India Gate, New Delhi
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        },
      )
    } else {
      console.log("[v0] Geolocation not supported, using default location")
      setUserLocation({ lat: 28.6129, lng: 77.2295 })
    }
  }, [])

  const handleSOSActivation = async () => {
    const emergencyId = `sos_${Date.now()}`

    setEmergencyState({
      isActive: true,
      startTime: new Date(),
      emergencyId,
      contactedServices: [],
      locationShared: false,
    })

    setActiveServiceId("service_001")
    setSelectedMechanicId("1")

    try {
      if (userLocation) {
        await shareLocationWithServices(userLocation, emergencyId)
        setEmergencyState((prev) => ({ ...prev, locationShared: true }))
      }

      await notifyEmergencyContacts(emergencyContacts, userLocation, emergencyId)
      await alertNearbyMechanics(nearbyMechanics, userLocation, emergencyId)
      await logEmergencyOnChain(emergencyId, userLocation)

      setEmergencyState((prev) => ({
        ...prev,
        contactedServices: ["mechanics", "contacts", "blockchain"],
      }))
    } catch (error) {
      console.error("Emergency activation error:", error)
    }
  }

  const shareLocationWithServices = async (location: { lat: number; lng: number }, emergencyId: string) => {
    console.log(`Location shared: ${location.lat}, ${location.lng} for emergency ${emergencyId}`)
    return new Promise((resolve) => setTimeout(resolve, 1000))
  }

  const notifyEmergencyContacts = async (
    contacts: EmergencyContact[],
    location: { lat: number; lng: number } | null,
    emergencyId: string,
  ) => {
    console.log(`Notifying ${contacts.length} emergency contacts for ${emergencyId}`)
    return new Promise((resolve) => setTimeout(resolve, 1500))
  }

  const alertNearbyMechanics = async (
    mechanics: Mechanic[],
    location: { lat: number; lng: number } | null,
    emergencyId: string,
  ) => {
    console.log(`Alerting ${mechanics.length} nearby mechanics for ${emergencyId}`)
    return new Promise((resolve) => setTimeout(resolve, 2000))
  }

  const logEmergencyOnChain = async (emergencyId: string, location: { lat: number; lng: number } | null) => {
    console.log(`Logging emergency ${emergencyId} on blockchain`)
    return new Promise((resolve) => setTimeout(resolve, 1000))
  }

  const handleEmergencyEnd = () => {
    setEmergencyState({
      isActive: false,
      startTime: null,
      emergencyId: null,
      contactedServices: [],
      locationShared: false,
    })
    setActiveServiceId(null)
    setSelectedMechanicId(null)
  }

  const handleMechanicCall = (phone: string) => {
    window.open(`tel:${phone}`, "_self")
  }

  const handleMechanicSelect = (mechanicId: string) => {
    setSelectedMechanicId(mechanicId)
    if (!activeServiceId) {
      setActiveServiceId(`service_${Date.now()}`)
    }
  }

  const handleEndTracking = () => {
    setActiveServiceId(null)
    setSelectedMechanicId(null)
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <LocationIcon className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold text-foreground">Highway SOS Finder</h1>
          </div>
          <WalletConnection />
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {emergencyState.isActive && (
          <Card className="border-destructive bg-destructive/10">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-destructive rounded-full animate-pulse" />
                  <div>
                    <p className="text-destructive font-medium">Emergency mode activated. Help is on the way.</p>
                    <p className="text-sm text-destructive/80">Emergency ID: {emergencyState.emergencyId}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={handleEmergencyEnd}>
                  End Emergency
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {emergencyState.isActive && (
          <EmergencyPanel
            emergencyState={emergencyState}
            emergencyContacts={emergencyContacts}
            userLocation={userLocation}
            onEndEmergency={handleEmergencyEnd}
          />
        )}

        {activeServiceId && (
          <ServiceTrackingPanel
            serviceId={activeServiceId}
            onEndTracking={handleEndTracking}
            onContactMechanic={handleMechanicCall}
          />
        )}

        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-balance">Need Emergency Roadside Assistance?</h2>
          <p className="text-muted-foreground text-pretty max-w-2xl mx-auto">
            Get instant help from verified mechanics near you. Our Web3-powered platform ensures secure, transparent
            service with real-time tracking and decentralized payments.
          </p>
          <SOSButton onActivate={handleSOSActivation} isActive={emergencyState.isActive} />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <LocationIcon className="w-5 h-5" />
                  Your Location & Nearby Mechanics
                </h3>
                <MapComponent
                  userLocation={userLocation}
                  mechanics={nearbyMechanics}
                  isEmergency={emergencyState.isActive}
                  activeServiceId={activeServiceId}
                  onMechanicSelect={handleMechanicSelect}
                />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Verified Mechanics Nearby</h3>
            {nearbyMechanics.map((mechanic) => (
              <MechanicCard
                key={mechanic.id}
                mechanic={mechanic}
                onCall={handleMechanicCall}
                isEmergency={emergencyState.isActive}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
