export type UserRole = 'client' | 'student' | 'admin' | 'moderator';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: UserRole;
  city: string;
  avatar?: string;
  verified: boolean;
  banned: boolean;
  createdAt: string;
}

export interface StudentProfile extends User {
  role: 'student';
  university: string;
  faculty: string;
  level: string;
  bio: string;
  skills: string[];
  levelBadge: 'Débutant' | 'Intermédiaire' | 'Avancé' | 'Expert';
  xp: number;
  nextLevelXp: number;
  completedJobs: number;
  rating: number;
  reviewCount: number;
  responseTime: string;
  memberSince: string;
  gpsLocation?: { lat: number; lng: number };
  availability: string[];
  portfolio: PortfolioItem[];
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  link?: string;
}

export interface GigTier {
  name: string;
  price: number;
  description: string;
  deliveryDays: number;
  features: string[];
}

export interface Gig {
  id: string;
  studentId: string;
  studentName: string;
  studentRating: number;
  title: string;
  description: string;
  category: string;
  tiers: {
    basique: GigTier;
    standard: GigTier;
    premium: GigTier;
  };
  location: string;
  rating: number;
  reviewCount: number;
  orderCount: number;
  badge: string;
  images: string[];
  active: boolean;
  published?: boolean;
  gpsLocation?: { lat: number; lng: number };
}

export type OrderStatus =
  | 'pending'
  | 'accepted'
  | 'in_progress'
  | 'delivered'
  | 'revision_requested'
  | 'completed'
  | 'disputed'
  | 'cancelled'
  | 'refunded';

export interface Order {
  id: string;
  gigId: string;
  gigTitle: string;
  clientId: string;
  clientName: string;
  studentId: string;
  studentName: string;
  tier: 'basique' | 'standard' | 'premium';
  description: string;
  budget: number;
  status: OrderStatus;
  revisionsLeft: number;
  deliveryDate: string;
  createdAt: string;
  escrowAmount: number;
  paymentMethod: string;
  deliverableUrl?: string;
  deliverableNote?: string;
}

export interface ChatMessage {
  id: string;
  orderId: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  type: 'text' | 'file' | 'system';
}

export interface Review {
  id: string;
  orderId: string;
  gigId: string;
  reviewerId: string;
  reviewerName: string;
  studentId: string;
  rating: number;
  text: string;
  date: string;
  reported: boolean;
}

export interface Dispute {
  id: string;
  orderId: string;
  gigTitle: string;
  clientId: string;
  clientName: string;
  clientStatement: string;
  studentId: string;
  studentName: string;
  studentStatement: string;
  status: 'open' | 'under_review' | 'resolved_client' | 'resolved_student';
  moderatorId?: string;
  moderatorNote?: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface VerificationRequest {
  id: string;
  studentId: string;
  studentName: string;
  email: string;
  university: string;
  idType: string;
  idFileUrl: string;
  studentCardUrl: string;
  selfieUrl: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
}

export interface ReportedContent {
  id: string;
  type: 'gig' | 'review' | 'user';
  title: string;
  reporter: string;
  reason: string;
  date: string;
  status: 'pending' | 'resolved' | 'dismissed';
}

export interface ServiceCategory {
  id: string;
  name: string;
  icon: string;
  active: boolean;
}
