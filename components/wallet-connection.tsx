"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { WalletIcon, ChevronDownIcon, ExternalLinkIcon, CopyIcon, CheckIcon } from "@/components/icons"

interface WalletProvider {
  id: string
  name: string
  icon: string
  installed: boolean
}

interface UserProfile {
  address: string
  ensName?: string
  avatar?: string
  balance: string
  network: string
  reputation: number
  verificationLevel: "basic" | "verified" | "premium"
}

interface Transaction {
  id: string
  type: "payment" | "service" | "emergency"
  amount: string
  status: "pending" | "completed" | "failed"
  timestamp: Date
  description: string
}

export function WalletConnection() {
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [showWalletModal, setShowWalletModal] = useState(false)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([])
  const [copiedAddress, setCopiedAddress] = useState(false)

  const walletProviders: WalletProvider[] = [
    { id: "metamask", name: "MetaMask", icon: "🦊", installed: true },
    { id: "walletconnect", name: "WalletConnect", icon: "🔗", installed: true },
    { id: "coinbase", name: "Coinbase Wallet", icon: "🔵", installed: false },
    { id: "trust", name: "Trust Wallet", icon: "🛡️", installed: false },
  ]

  // Mock recent transactions
  useEffect(() => {
    if (isConnected) {
      setRecentTransactions([
        {
          id: "1",
          type: "service",
          amount: "0.05 ETH",
          status: "completed",
          timestamp: new Date(Date.now() - 3600000),
          description: "Mechanic Service Payment",
        },
        {
          id: "2",
          type: "emergency",
          amount: "0.01 ETH",
          status: "completed",
          timestamp: new Date(Date.now() - 7200000),
          description: "Emergency SOS Fee",
        },
      ])
    }
  }, [isConnected])

  const connectWallet = async (providerId: string) => {
    setIsConnecting(true)
    try {
      // Mock wallet connection - in real app would use Web3 provider
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const mockProfile: UserProfile = {
        address: "0x1234567890123456789012345678901234567890",
        ensName: "highway-user.eth",
        avatar: "/diverse-user-avatars.png",
        balance: "2.45 ETH",
        network: "Ethereum Mainnet",
        reputation: 4.8,
        verificationLevel: "verified",
      }

      setUserProfile(mockProfile)
      setIsConnected(true)
      setShowWalletModal(false)
    } catch (error) {
      console.error("Failed to connect wallet:", error)
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnectWallet = () => {
    setIsConnected(false)
    setUserProfile(null)
    setRecentTransactions([])
  }

  const switchNetwork = async (networkName: string) => {
    // Mock network switching
    if (userProfile) {
      setUserProfile({ ...userProfile, network: networkName })
    }
  }

  const copyAddress = async () => {
    if (userProfile?.address) {
      await navigator.clipboard.writeText(userProfile.address)
      setCopiedAddress(true)
      setTimeout(() => setCopiedAddress(false), 2000)
    }
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

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
            Verified
          </Badge>
        )
      case "premium":
        return (
          <Badge variant="default" className="text-xs bg-purple-100 text-purple-800">
            Premium
          </Badge>
        )
      default:
        return null
    }
  }

  if (isConnected && userProfile) {
    return (
      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="flex items-center gap-1">
          <div className="w-2 h-2 bg-green-500 rounded-full" />
          {userProfile.network}
        </Badge>

        <Dialog open={showProfileModal} onOpenChange={setShowProfileModal}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
              <Avatar className="w-6 h-6">
                <AvatarImage src={userProfile.avatar || "/placeholder.svg"} />
                <AvatarFallback>{userProfile.address.slice(2, 4).toUpperCase()}</AvatarFallback>
              </Avatar>
              <span>{userProfile.ensName || formatAddress(userProfile.address)}</span>
              <ChevronDownIcon className="w-3 h-3" />
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Wallet Profile</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              {/* Profile Header */}
              <div className="flex items-center gap-3">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={userProfile.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{userProfile.address.slice(2, 4).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{userProfile.ensName || "Anonymous User"}</h3>
                    {getVerificationBadge(userProfile.verificationLevel)}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{formatAddress(userProfile.address)}</span>
                    <Button variant="ghost" size="sm" onClick={copyAddress} className="h-auto p-1">
                      {copiedAddress ? (
                        <CheckIcon className="w-3 h-3 text-green-500" />
                      ) : (
                        <CopyIcon className="w-3 h-3" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Balance & Network */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Balance</p>
                  <p className="font-medium">{userProfile.balance}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Reputation</p>
                  <p className="font-medium">{userProfile.reputation}/5.0</p>
                </div>
              </div>

              {/* Network Selector */}
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Network</p>
                <div className="flex flex-wrap gap-2">
                  {["Ethereum Mainnet", "Polygon", "BSC"].map((network) => (
                    <Button
                      key={network}
                      variant={userProfile.network === network ? "default" : "outline"}
                      size="sm"
                      onClick={() => switchNetwork(network)}
                    >
                      {network}
                    </Button>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Recent Transactions */}
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Recent Transactions</p>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {recentTransactions.map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                      <div className="flex-1">
                        <p className="text-sm font-medium">{tx.description}</p>
                        <p className="text-xs text-muted-foreground">{tx.timestamp.toLocaleTimeString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{tx.amount}</p>
                        <Badge variant={tx.status === "completed" ? "secondary" : "outline"} className="text-xs">
                          {tx.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Actions */}
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  <ExternalLinkIcon className="w-4 h-4 mr-2" />
                  View on Explorer
                </Button>
                <Button variant="outline" size="sm" onClick={disconnectWallet}>
                  Disconnect
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  return (
    <Dialog open={showWalletModal} onOpenChange={setShowWalletModal}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <WalletIcon className="w-4 h-4 mr-2" />
          Connect Wallet
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Connect Your Wallet</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Connect your Web3 wallet to access decentralized features, secure payments, and verified identity.
          </p>

          <div className="space-y-2">
            {walletProviders.map((provider) => (
              <Button
                key={provider.id}
                variant="outline"
                className="w-full justify-start h-auto p-4 bg-transparent"
                onClick={() => connectWallet(provider.id)}
                disabled={!provider.installed || isConnecting}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{provider.icon}</span>
                  <div className="text-left">
                    <p className="font-medium">{provider.name}</p>
                    {!provider.installed && <p className="text-xs text-muted-foreground">Not installed</p>}
                  </div>
                </div>
                {isConnecting && provider.id === "metamask" && (
                  <div className="ml-auto">
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </Button>
            ))}
          </div>

          <div className="text-xs text-muted-foreground space-y-1">
            <p>• Secure decentralized identity verification</p>
            <p>• Transparent on-chain service payments</p>
            <p>• Reputation system and service history</p>
            <p>• Emergency service smart contracts</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
