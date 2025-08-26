"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface ServiceRequest {
  id: string
  userId: string
  mechanicId: string
  serviceType: "emergency" | "regular" | "towing"
  location: { lat: number; lng: number }
  description: string
  estimatedCost: string
  status: "pending" | "accepted" | "in_progress" | "completed" | "disputed"
  createdAt: Date
  contractAddress?: string
  escrowAmount?: string
}

interface SmartContractService {
  createServiceRequest: (request: Omit<ServiceRequest, "id" | "createdAt" | "status">) => Promise<string>
  acceptServiceRequest: (requestId: string) => Promise<string>
  completeService: (requestId: string, rating: number) => Promise<string>
  releasePayment: (requestId: string) => Promise<string>
  disputeService: (requestId: string, reason: string) => Promise<string>
  getServiceHistory: (address: string) => Promise<ServiceRequest[]>
  getReputationScore: (address: string) => Promise<number>
}

interface Web3ContextType {
  isConnected: boolean
  userAddress: string | null
  networkId: number | null
  balance: string | null
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
  switchNetwork: (networkId: number) => Promise<void>
  signMessage: (message: string) => Promise<string>
  sendTransaction: (to: string, amount: string) => Promise<string>
  smartContract: SmartContractService
  serviceRequests: ServiceRequest[]
  pendingTransactions: string[]
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined)

export function Web3Provider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false)
  const [userAddress, setUserAddress] = useState<string | null>(null)
  const [networkId, setNetworkId] = useState<number | null>(null)
  const [balance, setBalance] = useState<string | null>(null)
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([])
  const [pendingTransactions, setPendingTransactions] = useState<string[]>([])

  const connectWallet = async () => {
    try {
      // Mock wallet connection
      setIsConnected(true)
      setUserAddress("0x1234567890123456789012345678901234567890")
      setNetworkId(1) // Ethereum mainnet
      setBalance("2.45")

      await loadServiceHistory("0x1234567890123456789012345678901234567890")
    } catch (error) {
      console.error("Failed to connect wallet:", error)
    }
  }

  const disconnectWallet = () => {
    setIsConnected(false)
    setUserAddress(null)
    setNetworkId(null)
    setBalance(null)
    setServiceRequests([])
    setPendingTransactions([])
  }

  const switchNetwork = async (targetNetworkId: number) => {
    try {
      // Mock network switching
      setNetworkId(targetNetworkId)
    } catch (error) {
      console.error("Failed to switch network:", error)
    }
  }

  const signMessage = async (message: string): Promise<string> => {
    // Mock message signing
    return `0x${"a".repeat(130)}` // Mock signature
  }

  const sendTransaction = async (to: string, amount: string): Promise<string> => {
    // Mock transaction sending
    const txHash = `0x${"b".repeat(64)}` // Mock transaction hash
    setPendingTransactions((prev) => [...prev, txHash])

    // Simulate transaction confirmation
    setTimeout(() => {
      setPendingTransactions((prev) => prev.filter((tx) => tx !== txHash))
    }, 3000)

    return txHash
  }

  const loadServiceHistory = async (address: string) => {
    // Mock loading service history from blockchain
    const mockHistory: ServiceRequest[] = [
      {
        id: "req_001",
        userId: address,
        mechanicId: "0xmechanic123",
        serviceType: "emergency",
        location: { lat: 28.6139, lng: 77.209 },
        description: "Engine breakdown on NH-1",
        estimatedCost: "0.05 ETH",
        status: "completed",
        createdAt: new Date(Date.now() - 86400000), // 1 day ago
        contractAddress: "0xcontract123",
        escrowAmount: "0.05",
      },
      {
        id: "req_002",
        userId: address,
        mechanicId: "0xmechanic456",
        serviceType: "regular",
        location: { lat: 28.6129, lng: 77.208 },
        description: "Tire replacement",
        estimatedCost: "0.03 ETH",
        status: "in_progress",
        createdAt: new Date(Date.now() - 3600000), // 1 hour ago
        contractAddress: "0xcontract456",
        escrowAmount: "0.03",
      },
    ]
    setServiceRequests(mockHistory)
  }

  const createServiceRequest = async (
    request: Omit<ServiceRequest, "id" | "createdAt" | "status">,
  ): Promise<string> => {
    try {
      // Mock smart contract deployment
      const requestId = `req_${Date.now()}`
      const contractAddress = `0xcontract_${Date.now()}`

      const newRequest: ServiceRequest = {
        ...request,
        id: requestId,
        status: "pending",
        createdAt: new Date(),
        contractAddress,
      }

      setServiceRequests((prev) => [...prev, newRequest])

      // Mock transaction for contract deployment
      const txHash = await sendTransaction(contractAddress, request.estimatedCost)

      console.log(`Service request created: ${requestId}, Contract: ${contractAddress}, Tx: ${txHash}`)
      return requestId
    } catch (error) {
      console.error("Failed to create service request:", error)
      throw error
    }
  }

  const acceptServiceRequest = async (requestId: string): Promise<string> => {
    try {
      // Mock accepting service request
      setServiceRequests((prev) =>
        prev.map((req) => (req.id === requestId ? { ...req, status: "accepted" as const } : req)),
      )

      const txHash = `0xaccept_${Date.now()}`
      setPendingTransactions((prev) => [...prev, txHash])

      setTimeout(() => {
        setPendingTransactions((prev) => prev.filter((tx) => tx !== txHash))
        setServiceRequests((prev) =>
          prev.map((req) => (req.id === requestId ? { ...req, status: "in_progress" as const } : req)),
        )
      }, 2000)

      console.log(`Service request accepted: ${requestId}, Tx: ${txHash}`)
      return txHash
    } catch (error) {
      console.error("Failed to accept service request:", error)
      throw error
    }
  }

  const completeService = async (requestId: string, rating: number): Promise<string> => {
    try {
      // Mock completing service with rating
      const txHash = `0xcomplete_${Date.now()}`
      setPendingTransactions((prev) => [...prev, txHash])

      setTimeout(() => {
        setPendingTransactions((prev) => prev.filter((tx) => tx !== txHash))
        setServiceRequests((prev) =>
          prev.map((req) => (req.id === requestId ? { ...req, status: "completed" as const } : req)),
        )
      }, 2000)

      console.log(`Service completed: ${requestId}, Rating: ${rating}, Tx: ${txHash}`)
      return txHash
    } catch (error) {
      console.error("Failed to complete service:", error)
      throw error
    }
  }

  const releasePayment = async (requestId: string): Promise<string> => {
    try {
      // Mock releasing escrowed payment
      const request = serviceRequests.find((req) => req.id === requestId)
      if (!request) throw new Error("Service request not found")

      const txHash = await sendTransaction(request.mechanicId, request.escrowAmount || "0")

      console.log(`Payment released: ${requestId}, Amount: ${request.escrowAmount}, Tx: ${txHash}`)
      return txHash
    } catch (error) {
      console.error("Failed to release payment:", error)
      throw error
    }
  }

  const disputeService = async (requestId: string, reason: string): Promise<string> => {
    try {
      // Mock creating dispute
      setServiceRequests((prev) =>
        prev.map((req) => (req.id === requestId ? { ...req, status: "disputed" as const } : req)),
      )

      const txHash = `0xdispute_${Date.now()}`
      setPendingTransactions((prev) => [...prev, txHash])

      setTimeout(() => {
        setPendingTransactions((prev) => prev.filter((tx) => tx !== txHash))
      }, 2000)

      console.log(`Dispute created: ${requestId}, Reason: ${reason}, Tx: ${txHash}`)
      return txHash
    } catch (error) {
      console.error("Failed to create dispute:", error)
      throw error
    }
  }

  const getServiceHistory = async (address: string): Promise<ServiceRequest[]> => {
    // Mock getting service history from blockchain
    return serviceRequests.filter((req) => req.userId === address || req.mechanicId === address)
  }

  const getReputationScore = async (address: string): Promise<number> => {
    // Mock calculating reputation score from on-chain data
    const userServices = serviceRequests.filter((req) => req.mechanicId === address && req.status === "completed")
    if (userServices.length === 0) return 0

    // Mock reputation calculation
    return 4.5 + Math.random() * 0.5 // Random score between 4.5-5.0
  }

  const smartContract: SmartContractService = {
    createServiceRequest,
    acceptServiceRequest,
    completeService,
    releasePayment,
    disputeService,
    getServiceHistory,
    getReputationScore,
  }

  const value: Web3ContextType = {
    isConnected,
    userAddress,
    networkId,
    balance,
    connectWallet,
    disconnectWallet,
    switchNetwork,
    signMessage,
    sendTransaction,
    smartContract,
    serviceRequests,
    pendingTransactions,
  }

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>
}

export function useWeb3() {
  const context = useContext(Web3Context)
  if (context === undefined) {
    throw new Error("useWeb3 must be used within a Web3Provider")
  }
  return context
}

export type { ServiceRequest, SmartContractService }
