"use client"

import { useEffect, useRef, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { LocationIcon, TruckIcon, NavigationIcon } from "@/components/icons"

interface Mechanic {
  id: string
  name: string
  location: { lat: number; lng: number }
  verified: boolean
  availability: "available" | "busy" | "offline"
  isEnRoute?: boolean
  estimatedArrival?: Date
  currentSpeed?: number
}

interface MapComponentProps {
  userLocation: { lat: number; lng: number } | null
  mechanics: Mechanic[]
  isEmergency: boolean
  activeServiceId?: string
  onMechanicSelect?: (mechanicId: string) => void
}

interface LiveUpdate {
  id: string
  type: "location" | "status" | "eta" | "message"
  timestamp: Date
  data: any
}

export function MapComponent({
  userLocation,
  mechanics,
  isEmergency,
  activeServiceId,
  onMechanicSelect,
}: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [liveUpdates, setLiveUpdates] = useState<LiveUpdate[]>([])
  const [mechanicLocations, setMechanicLocations] = useState<Map<string, { lat: number; lng: number }>>(new Map())
  const [routeData, setRouteData] = useState<{
    distance: string
    duration: string
    polyline?: string
    highway?: string
    landmarks?: string[]
  } | null>(null)
  const [isTrackingActive, setIsTrackingActive] = useState(false)

  const getDetailedLocationInfo = (mechanic: any) => {
    const locationData = {
      "1": {
        highway: "National Highway 1 (Grand Trunk Road)",
        state: "Punjab State",
        city: "Ludhiana, Punjab",
        landmarks: ["Punjab Agricultural University", "Ludhiana Railway Junction", "Guru Nanak Stadium"],
        coordinates: { lat: 30.901, lng: 75.8573 },
        nearbyTolls: ["Ludhiana Toll Plaza", "Jalandhar Toll Plaza"],
        fuelStations: ["HP Petrol Pump - GT Road", "IOCL Station - Ferozepur Road"],
        route: "New Delhi → Panipat → Karnal → Ludhiana → Jalandhar → Amritsar",
        stateInfo: "Punjab - Land of Five Rivers, Agricultural Hub of India",
        districtHQ: "Ludhiana District Headquarters",
      },
      "2": {
        highway: "National Highway 8 (Delhi-Mumbai Highway)",
        state: "Rajasthan State",
        city: "Jaipur, Rajasthan",
        landmarks: ["Hawa Mahal", "City Palace", "Amber Fort", "Jaipur International Airport"],
        coordinates: { lat: 26.9124, lng: 75.7873 },
        nearbyTolls: ["Jaipur Toll Plaza", "Ajmer Road Toll Plaza"],
        fuelStations: ["Reliance Petrol Pump - Tonk Road", "Shell Station - Ajmer Road"],
        route: "New Delhi → Gurgaon → Rewari → Jaipur → Ajmer → Udaipur → Ahmedabad → Mumbai",
        stateInfo: "Rajasthan - Land of Kings, Desert State with Rich Heritage",
        districtHQ: "Jaipur District Headquarters (Pink City)",
      },
      "3": {
        highway: "National Highway 2 (Delhi-Kolkata Highway)",
        state: "Uttar Pradesh State",
        city: "Agra, Uttar Pradesh",
        landmarks: ["Taj Mahal", "Agra Fort", "Fatehpur Sikri", "Agra Cantonment"],
        coordinates: { lat: 27.1767, lng: 78.0081 },
        nearbyTolls: ["Agra Toll Plaza", "Mathura Toll Plaza"],
        fuelStations: ["BPCL Station - Delhi Gate", "HP Petrol Pump - Fatehabad Road"],
        route: "New Delhi → Faridabad → Mathura → Agra → Kanpur → Allahabad → Varanasi → Kolkata",
        stateInfo: "Uttar Pradesh - Most Populous State, Heart of Hindi Belt",
        districtHQ: "Agra District Headquarters (City of Taj)",
      },
      "4": {
        highway: "National Highway 48 (Delhi-Mumbai Expressway)",
        state: "Haryana State",
        city: "Rewari, Haryana",
        landmarks: ["Rewari Railway Junction", "Dharuhera Industrial Area", "Rewari Steam Locomotive Museum"],
        coordinates: { lat: 28.1989, lng: 76.6173 },
        nearbyTolls: ["Rewari Toll Plaza", "Dharuhera Toll Plaza"],
        fuelStations: ["IOCL Station - Delhi Road", "Essar Petrol Pump - Jaipur Road"],
        route: "New Delhi → Gurgaon → Rewari → Jaipur → Udaipur → Ahmedabad → Vadodara → Mumbai",
        stateInfo: "Haryana - Granary of India, Industrial Hub of North India",
        districtHQ: "Rewari District Headquarters",
      },
      "5": {
        highway: "National Highway 19 (Delhi-Kolkata via Agra)",
        state: "Delhi (National Capital Territory)",
        city: "New Delhi",
        landmarks: ["India Gate", "Red Fort", "Lotus Temple", "Akshardham Temple"],
        coordinates: { lat: 28.6129, lng: 77.2295 },
        nearbyTolls: ["DND Flyway Toll", "Yamuna Expressway Toll"],
        fuelStations: ["HP Station - Ring Road", "BPCL Pump - Outer Ring Road"],
        route: "New Delhi → Faridabad → Mathura → Agra → Kanpur → Allahabad → Varanasi → Kolkata",
        stateInfo: "Delhi NCT - National Capital Territory, Political Center of India",
        districtHQ: "New Delhi Municipal Corporation",
      },
      "6": {
        highway: "National Highway 1 (Amritsar-Delhi Highway)",
        state: "Punjab State",
        city: "Ludhiana, Punjab",
        landmarks: ["Golden Temple Road", "Punjab Agricultural University", "Guru Gobind Singh Stadium"],
        coordinates: { lat: 30.901, lng: 75.8573 },
        nearbyTolls: ["Ludhiana Toll Plaza", "Phagwara Toll Plaza"],
        fuelStations: ["HP Petrol Pump - GT Road", "Shell Station - Ferozepur Road"],
        route: "Amritsar → Jalandhar → Ludhiana → Ambala → Panipat → New Delhi",
        stateInfo: "Punjab - Sikh Heritage State, Agricultural Powerhouse",
        districtHQ: "Ludhiana District (Industrial Capital of Punjab)",
      },
      "7": {
        highway: "National Highway 8 (Jaipur-Delhi Highway)",
        state: "Rajasthan State",
        city: "Jaipur, Rajasthan",
        landmarks: ["Jaipur Airport", "Sanganer", "Bagru", "Chomu"],
        coordinates: { lat: 26.9124, lng: 75.7873 },
        nearbyTolls: ["Jaipur Toll Plaza", "Shahpura Toll Plaza"],
        fuelStations: ["Reliance Station - Delhi Road", "IOCL Pump - Sikar Road"],
        route: "Jaipur → Alwar → Rewari → Gurgaon → New Delhi",
        stateInfo: "Rajasthan - Desert State, Royal Heritage and Forts",
        districtHQ: "Jaipur District (State Capital - Pink City)",
      },
      "8": {
        highway: "National Highway 2 (Grand Trunk Road - Agra Section)",
        state: "Uttar Pradesh State",
        city: "Agra, Uttar Pradesh",
        landmarks: ["Taj Mahal", "Agra Fort", "Mehtab Bagh", "Sikandra"],
        coordinates: { lat: 27.1767, lng: 78.0081 },
        nearbyTolls: ["Agra Toll Plaza", "Firozabad Toll Plaza"],
        fuelStations: ["BPCL Station - Mathura Road", "HP Pump - Gwalior Road"],
        route: "Agra → Firozabad → Etawah → Kanpur → Allahabad → Varanasi",
        stateInfo: "Uttar Pradesh - Cultural Heart of India, Mughal Heritage",
        districtHQ: "Agra District (UNESCO World Heritage City)",
      },
    }
    return (
      locationData[mechanic.id as keyof typeof locationData] || {
        highway: "Local State Highway",
        state: "Unknown State",
        city: "Unknown Location",
        landmarks: [],
        coordinates: mechanic.location,
        nearbyTolls: [],
        fuelStations: [],
        route: "Local City Area",
        stateInfo: "Regional Area",
        districtHQ: "Local Administration",
      }
    )
  }

  useEffect(() => {
    if (!isEmergency && !activeServiceId) return

    setIsTrackingActive(true)

    // Initialize mechanic locations
    const initialLocations = new Map()
    mechanics.forEach((mechanic) => {
      initialLocations.set(mechanic.id, mechanic.location)
    })
    setMechanicLocations(initialLocations)

    // Simulate real-time updates
    const interval = setInterval(() => {
      // Simulate mechanic movement
      setMechanicLocations((prev) => {
        const updated = new Map(prev)
        mechanics.forEach((mechanic) => {
          if (mechanic.isEnRoute && userLocation) {
            const current = updated.get(mechanic.id) || mechanic.location
            // Simulate movement towards user location
            const deltaLat = (userLocation.lat - current.lat) * 0.01
            const deltaLng = (userLocation.lng - current.lng) * 0.01
            updated.set(mechanic.id, {
              lat: current.lat + deltaLat,
              lng: current.lng + deltaLng,
            })
          }
        })
        return updated
      })

      // Add live update
      const update: LiveUpdate = {
        id: `update_${Date.now()}`,
        type: "location",
        timestamp: new Date(),
        data: { message: "Mechanic location updated" },
      }
      setLiveUpdates((prev) => [update, ...prev.slice(0, 9)]) // Keep last 10 updates

      // Update ETA
      if (Math.random() > 0.7) {
        const etaUpdate: LiveUpdate = {
          id: `eta_${Date.now()}`,
          type: "eta",
          timestamp: new Date(),
          data: {
            newEta: new Date(Date.now() + Math.random() * 1800000), // Random ETA within 30 mins
            message: "ETA updated based on traffic conditions",
          },
        }
        setLiveUpdates((prev) => [etaUpdate, ...prev.slice(0, 9)])
      }
    }, 3000) // Update every 3 seconds

    return () => {
      clearInterval(interval)
      setIsTrackingActive(false)
    }
  }, [isEmergency, activeServiceId, mechanics, userLocation])

  useEffect(() => {
    if (userLocation && mechanics.length > 0 && (isEmergency || activeServiceId)) {
      const nearestMechanic = mechanics[0]
      const locationInfo = getDetailedLocationInfo(nearestMechanic)
      const distance = calculateDistance(userLocation, nearestMechanic.location)
      const duration = Math.round(distance * 2) // Rough estimate: 2 minutes per km

      setRouteData({
        distance: `${distance.toFixed(1)} km`,
        duration: `${duration} mins`,
        highway: locationInfo.highway,
        landmarks: locationInfo.landmarks,
        polyline: "mock_polyline_data",
      })
    }
  }, [userLocation, mechanics, isEmergency, activeServiceId])

  const calculateDistance = (point1: { lat: number; lng: number }, point2: { lat: number; lng: number }) => {
    const R = 6371 // Earth's radius in km
    const dLat = ((point2.lat - point1.lat) * Math.PI) / 180
    const dLng = ((point2.lng - point1.lng) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((point1.lat * Math.PI) / 180) *
        Math.cos((point2.lat * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
    if (seconds < 60) return `${seconds}s ago`
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    return `${Math.floor(minutes / 60)}h ago`
  }

  const getUpdateIcon = (type: string) => {
    switch (type) {
      case "location":
        return <LocationIcon className="w-3 h-3" />
      case "eta":
        return <TruckIcon className="w-3 h-3" />
      case "status":
        return <NavigationIcon className="w-3 h-3" />
      default:
        return <LocationIcon className="w-3 h-3" />
    }
  }

  const getHighwayInfo = (mechanic: any) => {
    const locationInfo = getDetailedLocationInfo(mechanic)
    return {
      highway: locationInfo.highway,
      route: locationInfo.route,
      city: locationInfo.city,
      landmarks: locationInfo.landmarks,
    }
  }

  return (
    <div className="relative">
      {!userLocation && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            📍 Location access denied. Using default Delhi location (National Capital Territory).
            <button onClick={() => window.location.reload()} className="ml-2 underline hover:no-underline">
              Enable location for better results
            </button>
          </p>
        </div>
      )}

      <div
        ref={mapRef}
        className="w-full h-96 bg-muted rounded-lg flex items-center justify-center relative overflow-hidden"
        style={{
          backgroundImage: `url('/india-highway-detailed-map.png')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />

        {/* User Location Marker */}
        {userLocation && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center animate-pulse ${
                isEmergency ? "bg-destructive" : "bg-primary"
              }`}
            >
              <div className="w-3 h-3 bg-primary-foreground rounded-full" />
            </div>
            <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-xs font-medium whitespace-nowrap bg-background/90 px-2 py-1 rounded shadow-md">
              <div className="text-center">
                <div className="font-semibold">Your Location</div>
                <div className="text-muted-foreground">New Delhi, NCT</div>
                <div className="text-xs text-muted-foreground">
                  {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
                </div>
              </div>
            </div>
            {isEmergency && (
              <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 text-xs text-destructive font-medium animate-pulse">
                🚨 Emergency Mode Active
              </div>
            )}
          </div>
        )}

        {/* Mechanic Markers with Enhanced Details */}
        {mechanics.map((mechanic, index) => {
          const position = mechanicLocations.get(mechanic.id) || mechanic.location
          const positionStyle = {
            top: `${20 + index * 12}%`,
            left: `${25 + index * 15}%`,
          }

          const locationInfo = getDetailedLocationInfo(mechanic)

          return (
            <div
              key={mechanic.id}
              className="absolute z-10 cursor-pointer group"
              style={positionStyle}
              onClick={() => onMechanicSelect?.(mechanic.id)}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-lg ${
                  mechanic.isEnRoute
                    ? "bg-accent animate-bounce"
                    : mechanic.availability === "available"
                      ? "bg-green-500"
                      : "bg-yellow-500"
                }`}
              >
                <TruckIcon className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -bottom-32 left-1/2 transform -translate-x-1/2 w-80 text-xs font-medium bg-background/95 border rounded-lg shadow-lg p-4 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                <div className="space-y-2">
                  <div className="font-semibold text-primary text-sm">{locationInfo.highway}</div>
                  <div className="text-foreground font-medium">{locationInfo.city}</div>
                  <div className="text-blue-600 text-xs">{locationInfo.stateInfo}</div>
                  <div className="text-muted-foreground text-xs">{mechanic.name.split(" - ")[0]}</div>

                  {locationInfo.landmarks.length > 0 && (
                    <div className="border-t pt-2">
                      <div className="text-xs font-medium text-foreground mb-1">Nearby Landmarks:</div>
                      <div className="text-xs text-muted-foreground">
                        {locationInfo.landmarks.slice(0, 3).join(" • ")}
                      </div>
                    </div>
                  )}

                  <div className="border-t pt-2">
                    <div className="text-xs font-medium text-foreground mb-1">Route Information:</div>
                    <div className="text-xs text-muted-foreground">{locationInfo.route}</div>
                  </div>

                  <div className="border-t pt-2 flex justify-between">
                    <div className="text-xs text-green-600">
                      📍 {position.lat.toFixed(4)}, {position.lng.toFixed(4)}
                    </div>
                    <div className="text-xs text-blue-600">🏛️ {locationInfo.districtHQ}</div>
                  </div>
                </div>
              </div>
              {mechanic.isEnRoute && (
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-medium whitespace-nowrap">
                  🚛 En Route
                </div>
              )}
            </div>
          )
        })}

        {/* Route Line Simulation */}
        {routeData && isTrackingActive && (
          <div className="absolute inset-0 pointer-events-none">
            <svg className="w-full h-full">
              <path
                d="M 50% 50% Q 40% 30% 30% 25%"
                stroke="#ec4899"
                strokeWidth="3"
                fill="none"
                strokeDasharray="5,5"
                className="animate-pulse"
              />
            </svg>
          </div>
        )}

        {/* Tracking Status Overlay */}
        {isTrackingActive && (
          <div className="absolute top-4 left-4 z-20">
            <Badge variant="secondary" className="bg-green-100 text-green-800 animate-pulse">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
              Live Tracking Active
            </Badge>
          </div>
        )}
      </div>

      {/* Real-time Updates Panel */}
      {isTrackingActive && (
        <Card className="mt-4">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium flex items-center gap-2">
                <NavigationIcon className="w-4 h-4" />
                Live Updates
              </h4>
              {routeData && (
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="font-medium text-primary">{routeData.highway}</span>
                  <span>📏 {routeData.distance}</span>
                  <span>⏱️ {routeData.duration}</span>
                  {routeData.landmarks && routeData.landmarks.length > 0 && (
                    <span className="text-xs">via {routeData.landmarks[0]}</span>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-2 max-h-32 overflow-y-auto">
              {liveUpdates.length === 0 ? (
                <p className="text-sm text-muted-foreground">Waiting for updates...</p>
              ) : (
                liveUpdates.map((update) => (
                  <div key={update.id} className="flex items-start gap-2 text-sm">
                    <div className="mt-1 text-muted-foreground">{getUpdateIcon(update.type)}</div>
                    <div className="flex-1">
                      <p className="text-foreground">{update.data.message}</p>
                      <p className="text-xs text-muted-foreground">{formatTimeAgo(update.timestamp)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
