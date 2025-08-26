"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangleIcon } from "@/components/icons"

interface SOSButtonProps {
  onActivate: () => void
  isActive: boolean
}

export function SOSButton({ onActivate, isActive }: SOSButtonProps) {
  const [isPressed, setIsPressed] = useState(false)

  const handlePress = () => {
    setIsPressed(true)
    onActivate()
    setTimeout(() => setIsPressed(false), 200)
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <Button
        onClick={handlePress}
        size="lg"
        className={`
          w-32 h-32 rounded-full text-xl font-bold transition-all duration-200
          ${isActive ? "bg-destructive hover:bg-destructive/90 animate-pulse" : "bg-primary hover:bg-primary/90"}
          ${isPressed ? "scale-95" : "scale-100"}
          shadow-lg hover:shadow-xl
        `}
      >
        <div className="flex flex-col items-center gap-2">
          <AlertTriangleIcon className="w-8 h-8" />
          <span>SOS</span>
        </div>
      </Button>

      <p className="text-sm text-muted-foreground text-center max-w-xs">
        {isActive ? "Emergency activated! Help is on the way." : "Press for immediate emergency assistance"}
      </p>
    </div>
  )
}
