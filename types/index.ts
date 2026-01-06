// TypeScript types for DIYTutor application

export type UserPlan = "free" | "pro"

export type ProjectStatus = "generating" | "complete" | "failed"

export type ProjectDifficulty = "beginner" | "intermediate" | "advanced"

export interface User {
  id: string
  email: string
  displayName: string
  plan: UserPlan
  stripeCustomerId: string | null
  projectsUsedThisMonth: number
  billingCycleReset: Date
  createdAt: Date
}

export interface Material {
  name: string
  quantity: string
  estimatedCost: string
  link?: string
}

export interface Tool {
  name: string
  required: boolean
}

export interface ProjectStep {
  stepNumber: number
  title: string
  description: string
  tips?: string
}

export interface ProjectInstructions {
  overview: string
  timeEstimate: string
  difficulty: ProjectDifficulty
  materials: Material[]
  tools: Tool[]
  steps: ProjectStep[]
}

export interface Project {
  id: string
  userId: string
  title: string
  description: string // user's original input
  instructions: ProjectInstructions
  status: ProjectStatus
  createdAt: Date
  updatedAt: Date
}

export interface DemoBooking {
  id: string
  name: string
  email: string
  phone?: string
  datetime?: Date
  status: "pending" | "contacted" | "completed" | "cancelled"
  createdAt: Date
}

export interface Subscription {
  id: string
  userId: string
  stripeCustomerId: string
  stripeSubscriptionId: string
  status: "active" | "canceled" | "past_due" | "unpaid"
  currentPeriodEnd: Date
  createdAt: Date
}

// Form types
export interface SignUpData {
  email: string
  password: string
  displayName: string
}

export interface SignInData {
  email: string
  password: string
}

export interface GenerateProjectData {
  description: string
}

// API Response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

export interface GenerateResponse {
  projectId: string
  title: string
  instructions: ProjectInstructions
}
