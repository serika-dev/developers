export interface APIKey {
  _id: string;
  name: string;
  createdAt: string;
  lastUsed?: string;
  permissions: string[];
  active: boolean;
  totalTokens: number;
  totalImages: number;
  hasBillingSetup: boolean;
  key?: string; // Only included when first created or regenerated
}

export interface APIUsageSummary {
  totalTokens: number;
  totalImages: number;
  successfulRequests: number;
  failedRequests: number;
}

export interface EndpointUsage {
  _id: string;
  totalRequests: number;
  totalTokens: number;
  totalImages: number;
}

export interface APIUsageResponse {
  summary: {
    totalTokens: number;
    totalImages: number;
    totalCost: number;
    pricing: {
      tokens: number;
      images: number;
    };
  };
  byEndpoint: Array<{
    _id: string;
    totalRequests: number;
    totalTokens: number;
    totalImages: number;
    totalCost: number;
  }>;
}

export interface GenerationRequest {
  messages: { role: string; content: string }[];
  model?: string;
  stream?: boolean;
  character_id?: string;
  temperature?: number;
  system_prompt?: string;
}

export interface ImageGenerationRequest {
  prompt: string;
  model?: string;
  size?: string;
  negative_prompt?: string;
  steps?: number;
  scale?: number;
  sampler?: string;
  seed?: number;
}

export interface Model {
  id: string;
  object: string;
  created: number;
  owned_by: string;
  root: string;
  parent: null;
  description: string;
  max_tokens?: number;
}

export interface ModelsResponse {
  object: string;
  data: Model[];
}

export interface Character {
  id: string;
  name: string;
  description: string;
  avatar: string;
  creator: string;
  createdOn: string;
  tags: string[];
  isNSFW: boolean;
}

export interface User {
  _id: string;
  username: string;
  email: string;
  avatar: string;
  banner: string;
  joinDate: string;
  ips: {
    address: string;
    createdAt: string;
  }[];
  stripeCustomerId?: string;
  isVerified: boolean;
  messageCount?: {
    count: number;
    total: number;
    lastReset: string;
  };
  imageCount?: {
    count: number;
    total: number;
    lastReset: string;
  };
  lastPaymentDate?: string;
  lastPaymentStatus?: string;
  followers: Array<{
    followerUserID: {
      _id: string;
      username: string;
    };
  }>;
  following: Array<{
    followingUserID: {
      _id: string;
      username: string;
    };
  }>;
  ageVerification?: {
    isVerified: boolean;
    dateOfBirth: string;
    verifiedAt: string;
  };
  preferences?: {
    showNSFW: boolean;
  };
  isPremium: boolean;
  subscriptionStatus?: string;
  subscriptionId?: string;
  subscriptionPlan?: string;
  subscriptionPeriodEnd?: string;
  apiSubscriptionId?: string;
  apiSubscriptionPeriodEnd?: string;
  apiSubscriptionStatus?: string;
  lastAPIPaymentDate?: string;
  lastAPIPaymentStatus?: string;
} 