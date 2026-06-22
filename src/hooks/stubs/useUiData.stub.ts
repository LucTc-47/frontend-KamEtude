import { useMutation, useQuery, useQueryClient, type QueryKey } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import type {
  ChatMessage,
  Dispute,
  Gig,
  GigTier,
  Order,
  OrderStatus,
  ReportedContent,
  Review,
  ServiceCategory,
  VerificationRequest,
} from '@/types';

type ProfileRecord = {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  role: 'client' | 'student' | 'admin' | 'moderator';
  city?: string;
  university?: string;
  faculty?: string;
  level?: string;
  bio?: string;
  skills?: string[];
  avatar_url?: string | null;
  verified: boolean;
  banned: boolean;
  rating?: number;
  review_count?: number;
  completed_jobs?: number;
  xp?: number;
  level_badge?: string;
  created_at: string;
};

type CityRecord = {
  id: string;
  name: string;
  active: boolean;
};

type OrderWithMeta = Order & {
  delivered_at?: string;
  payment_status?: string;
  payout_status?: string;
};

export interface GigRequest {
  id: string;
  client_id: string;
  client_name: string;
  title: string;
  description: string;
  category: string | null;
  location: string | null;
  budget: number;
  deadline: string | null;
  status: string;
  accepted_proposal_id: string | null;
  created_at: string;
}

export interface RequestProposal {
  id: string;
  request_id: string;
  student_id: string;
  student_name: string;
  price: number;
  delivery_days: number;
  message: string;
  status: string;
  created_at: string;
  gig_requests?: {
    title: string;
    budget: number;
    status: string;
  };
}

const daysFromNow = (days: number) => new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
const daysAgo = (days: number) => daysFromNow(-days);

const stubTier = (name: string, price: number, deliveryDays: number): GigTier => ({
  name,
  price,
  deliveryDays,
  description: 'Offre de demonstration UI',
  features: ['Brief client', 'Livraison numerique', 'Revision incluse'],
});

const mockProfiles: ProfileRecord[] = [
  {
    user_id: 'stub-student-1',
    first_name: 'Aline',
    last_name: 'Nkem',
    email: 'aline.nkem@kametud.local',
    phone: '690000000',
    role: 'student',
    city: 'Dschang',
    university: 'Universite de Dschang',
    faculty: 'Sciences',
    level: 'Licence 3',
    bio: 'Profil de demonstration utilise tant que le backend Spring Boot est deconnecte.',
    skills: ['Design', 'Soutien scolaire', 'Redaction'],
    avatar_url: null,
    verified: true,
    banned: false,
    rating: 4.8,
    review_count: 12,
    completed_jobs: 18,
    xp: 240,
    level_badge: 'Intermediaire',
    created_at: new Date('2026-01-15').toISOString(),
  },
  {
    user_id: 'stub-client-1',
    first_name: 'Marie',
    last_name: 'Fotso',
    email: 'marie.fotso@kametud.local',
    role: 'client',
    city: 'Dschang',
    verified: false,
    banned: false,
    created_at: new Date('2026-02-10').toISOString(),
  },
  {
    user_id: 'stub-student-2',
    first_name: 'Samuel',
    last_name: 'Talla',
    email: 'samuel.talla@kametud.local',
    phone: '675123456',
    role: 'student',
    city: 'Yaoundé',
    university: 'Universite de Yaounde I',
    faculty: 'Informatique',
    level: 'Master 1',
    bio: 'Developpeur web et assistant numerique disponible pour maquettes, sites vitrines et depannage logiciel.',
    skills: ['Developpement web', 'Excel', 'Support informatique'],
    avatar_url: null,
    verified: true,
    banned: false,
    rating: 4.6,
    review_count: 8,
    completed_jobs: 11,
    xp: 180,
    level_badge: 'Intermediaire',
    created_at: new Date('2026-03-04').toISOString(),
  },
  {
    user_id: 'stub-client-2',
    first_name: 'Joel',
    last_name: 'Manga',
    email: 'joel.manga@kametud.local',
    phone: '699222111',
    role: 'client',
    city: 'Douala',
    verified: false,
    banned: false,
    created_at: new Date('2026-04-18').toISOString(),
  },
  {
    user_id: 'stub-client-banned',
    first_name: 'Carine',
    last_name: 'Essomba',
    email: 'carine.essomba@kametud.local',
    phone: '650111222',
    role: 'client',
    city: 'Bafoussam',
    verified: false,
    banned: true,
    created_at: new Date('2026-05-03').toISOString(),
  },
];

const mockCategories: ServiceCategory[] = [
  { id: 'cat-academic', name: 'Académique', icon: 'GraduationCap', active: true },
  { id: 'cat-home', name: 'Aide à domicile', icon: 'Home', active: true },
  { id: 'cat-wellness', name: 'Beauté & Bien-être', icon: 'Sparkles', active: true },
  { id: 'cat-diy', name: 'Bricolage', icon: 'Wrench', active: true },
  { id: 'cat-events', name: 'Événementiel', icon: 'PartyPopper', active: true },
  { id: 'cat-delivery', name: 'Livraison & Courses', icon: 'Truck', active: true },
  { id: 'cat-digital', name: 'Numérique', icon: 'Monitor', active: true },
];

const mockCities: CityRecord[] = [
  { id: 'city-bafoussam', name: 'Bafoussam', active: true },
  { id: 'city-bamenda', name: 'Bamenda', active: true },
  { id: 'city-bertoua', name: 'Bertoua', active: true },
  { id: 'city-buea', name: 'Buea', active: true },
  { id: 'city-douala', name: 'Douala', active: true },
  { id: 'city-dschang', name: 'Dschang', active: true },
  { id: 'city-ebolowa', name: 'Ebolowa', active: true },
  { id: 'city-garoua', name: 'Garoua', active: true },
  { id: 'city-kribi', name: 'Kribi', active: true },
  { id: 'city-maroua', name: 'Maroua', active: true },
  { id: 'city-ngaoundere', name: 'Ngaoundéré', active: true },
  { id: 'city-yaounde', name: 'Yaoundé', active: true },
];

const mockGigs: Gig[] = [
  {
    id: 'stub-gig-1',
    studentId: 'stub-student-1',
    studentName: 'Aline Nkem',
    studentRating: 4.8,
    title: 'Soutien scolaire et correction de devoirs',
    description: 'Mock UI: service exemple en attente de connexion Spring Boot.',
    category: 'Académique',
    location: 'Dschang',
    rating: 4.8,
    reviewCount: 12,
    orderCount: 18,
    badge: 'Verifie',
    images: [],
    active: true,
    published: true,
    gpsLocation: { lat: 5.445, lng: 10.067 },
    tiers: {
      basique: stubTier('Basique', 5000, 2),
      standard: stubTier('Standard', 10000, 4),
      premium: stubTier('Premium', 18000, 7),
    },
  },
  {
    id: 'stub-gig-2',
    studentId: 'stub-student-2',
    studentName: 'Samuel Talla',
    studentRating: 4.6,
    title: 'Creation de site vitrine React',
    description: 'Landing page responsive, formulaire de contact et mise en ligne guidee pour petites activites.',
    category: 'Numérique',
    location: 'Yaoundé',
    rating: 4.6,
    reviewCount: 8,
    orderCount: 11,
    badge: 'Verifie',
    images: [],
    active: true,
    published: true,
    gpsLocation: { lat: 3.8667, lng: 11.5167 },
    tiers: {
      basique: stubTier('Audit', 12000, 2),
      standard: stubTier('Site simple', 45000, 5),
      premium: stubTier('Site complet', 85000, 10),
    },
  },
  {
    id: 'stub-gig-3',
    studentId: 'stub-student-1',
    studentName: 'Aline Nkem',
    studentRating: 4.8,
    title: 'Aide a domicile et courses',
    description: 'Courses rapides, rangement leger et aide ponctuelle autour du campus.',
    category: 'Aide à domicile',
    location: 'Dschang',
    rating: 4.7,
    reviewCount: 5,
    orderCount: 9,
    badge: 'Rapide',
    images: [],
    active: true,
    published: true,
    gpsLocation: { lat: 5.447, lng: 10.071 },
    tiers: {
      basique: stubTier('Course simple', 3000, 1),
      standard: stubTier('Demi-journee', 8000, 1),
      premium: stubTier('Journee complete', 15000, 2),
    },
  },
  {
    id: 'stub-gig-4',
    studentId: 'stub-student-2',
    studentName: 'Samuel Talla',
    studentRating: 4.6,
    title: 'Depannage ordinateur et installation logiciels',
    description: 'Nettoyage, installation bureautique, sauvegarde et configuration de base.',
    category: 'Bricolage',
    location: 'Douala',
    rating: 4.5,
    reviewCount: 6,
    orderCount: 7,
    badge: 'Expert',
    images: [],
    active: true,
    published: true,
    gpsLocation: { lat: 4.0511, lng: 9.7679 },
    tiers: {
      basique: stubTier('Diagnostic', 7000, 1),
      standard: stubTier('Intervention', 18000, 2),
      premium: stubTier('Pack complet', 32000, 3),
    },
  },
  {
    id: 'stub-gig-5',
    studentId: 'stub-student-1',
    studentName: 'Aline Nkem',
    studentRating: 4.8,
    title: 'Decoration simple pour anniversaire',
    description: 'Decoration de petite salle, table principale et coordination du materiel.',
    category: 'Événementiel',
    location: 'Bafoussam',
    rating: 4.9,
    reviewCount: 4,
    orderCount: 6,
    badge: 'Coup de coeur',
    images: [],
    active: true,
    published: false,
    gpsLocation: { lat: 5.4781, lng: 10.4176 },
    tiers: {
      basique: stubTier('Coin photo', 10000, 2),
      standard: stubTier('Salle simple', 25000, 4),
      premium: stubTier('Pack complet', 45000, 6),
    },
  },
];

const mockRequests: GigRequest[] = [
  {
    id: 'stub-request-1',
    client_id: 'stub-client-1',
    client_name: 'Marie Fotso',
    title: 'Besoin d aide pour un rapport',
    description: 'Mock UI: demande exemple en attente de connexion Spring Boot.',
    category: 'Académique',
    location: 'Dschang',
    budget: 15000,
    deadline: daysFromNow(7),
    status: 'open',
    accepted_proposal_id: null,
    created_at: daysAgo(1),
  },
  {
    id: 'stub-request-2',
    client_id: 'stub-client-2',
    client_name: 'Joel Manga',
    title: 'Creation d une affiche pour un tournoi',
    description: 'Besoin d une affiche carree pour WhatsApp et Facebook, avec deux propositions de couleurs.',
    category: 'Numérique',
    location: 'Douala',
    budget: 18000,
    deadline: daysFromNow(5),
    status: 'open',
    accepted_proposal_id: null,
    created_at: daysAgo(2),
  },
  {
    id: 'stub-request-3',
    client_id: 'stub-client-1',
    client_name: 'Marie Fotso',
    title: 'Aide pour demenagement de chambre',
    description: 'Transport de cartons entre deux logements et aide au rangement pendant une demi-journee.',
    category: 'Aide à domicile',
    location: 'Dschang',
    budget: 22000,
    deadline: daysFromNow(3),
    status: 'assigned',
    accepted_proposal_id: 'stub-proposal-2',
    created_at: daysAgo(5),
  },
  {
    id: 'stub-request-4',
    client_id: 'stub-client-2',
    client_name: 'Joel Manga',
    title: 'Photographe pour petit anniversaire',
    description: 'Couverture photo de deux heures et livraison de 30 photos retouchees.',
    category: 'Événementiel',
    location: 'Yaoundé',
    budget: 35000,
    deadline: daysFromNow(10),
    status: 'open',
    accepted_proposal_id: null,
    created_at: daysAgo(3),
  },
];

const mockProposals: RequestProposal[] = [
  {
    id: 'stub-proposal-1',
    request_id: 'stub-request-1',
    student_id: 'stub-student-1',
    student_name: 'Aline Nkem',
    price: 14000,
    delivery_days: 4,
    message: 'Je peux relire, corriger la structure et mettre en forme le rapport avec une synthese claire.',
    status: 'pending',
    created_at: daysAgo(1),
    gig_requests: { title: 'Besoin d aide pour un rapport', budget: 15000, status: 'open' },
  },
  {
    id: 'stub-proposal-2',
    request_id: 'stub-request-3',
    student_id: 'stub-student-1',
    student_name: 'Aline Nkem',
    price: 20000,
    delivery_days: 1,
    message: 'Disponible samedi matin avec un camarade pour accelerer le rangement.',
    status: 'accepted',
    created_at: daysAgo(4),
    gig_requests: { title: 'Aide pour demenagement de chambre', budget: 22000, status: 'assigned' },
  },
  {
    id: 'stub-proposal-3',
    request_id: 'stub-request-2',
    student_id: 'stub-student-2',
    student_name: 'Samuel Talla',
    price: 16000,
    delivery_days: 2,
    message: 'Je peux proposer deux directions graphiques et livrer les fichiers PNG et PDF.',
    status: 'pending',
    created_at: daysAgo(2),
    gig_requests: { title: 'Creation d une affiche pour un tournoi', budget: 18000, status: 'open' },
  },
  {
    id: 'stub-proposal-4',
    request_id: 'stub-request-4',
    student_id: 'stub-student-1',
    student_name: 'Aline Nkem',
    price: 38000,
    delivery_days: 5,
    message: 'Je peux aider pour la coordination et recommander un photographe etudiant.',
    status: 'rejected',
    created_at: daysAgo(2),
    gig_requests: { title: 'Photographe pour petit anniversaire', budget: 35000, status: 'open' },
  },
];

const mockOrders: OrderWithMeta[] = [
  {
    id: 'stub-order-1',
    gigId: 'stub-gig-1',
    gigTitle: 'Soutien scolaire et correction de devoirs',
    clientId: 'stub-client-1',
    clientName: 'Marie Fotso',
    studentId: 'stub-student-1',
    studentName: 'Aline Nkem',
    tier: 'standard',
    description: 'Correction d un rapport de 12 pages avec bibliographie et reformulation des introductions.',
    budget: 10000,
    status: 'pending',
    revisionsLeft: 2,
    deliveryDate: daysFromNow(4),
    createdAt: daysAgo(1),
    escrowAmount: 10000,
    paymentMethod: 'mtn',
    payment_status: 'pending',
    payout_status: 'not_started',
  },
  {
    id: 'stub-order-2',
    gigId: 'stub-gig-2',
    gigTitle: 'Creation de site vitrine React',
    clientId: 'stub-client-2',
    clientName: 'Joel Manga',
    studentId: 'stub-student-2',
    studentName: 'Samuel Talla',
    tier: 'standard',
    description: 'Page de presentation pour un petit commerce avec section services, contact et WhatsApp.',
    budget: 45000,
    status: 'in_progress',
    revisionsLeft: 2,
    deliveryDate: daysFromNow(6),
    createdAt: daysAgo(3),
    escrowAmount: 45000,
    paymentMethod: 'orange',
    payment_status: 'paid',
    payout_status: 'pending',
  },
  {
    id: 'stub-order-3',
    gigId: 'stub-gig-1',
    gigTitle: 'Soutien scolaire et correction de devoirs',
    clientId: 'stub-client-2',
    clientName: 'Joel Manga',
    studentId: 'stub-student-1',
    studentName: 'Aline Nkem',
    tier: 'premium',
    description: 'Preparation d une presentation orale et correction des slides.',
    budget: 18000,
    status: 'delivered',
    revisionsLeft: 1,
    deliveryDate: daysAgo(1),
    createdAt: daysAgo(7),
    escrowAmount: 18000,
    paymentMethod: 'mtn',
    deliverableUrl: '/placeholder.svg',
    deliverableNote: 'Slides corriges, notes de presentation ajoutees et conseils de prise de parole inclus.',
    delivered_at: daysAgo(4),
    payment_status: 'paid',
    payout_status: 'pending',
  },
  {
    id: 'stub-order-4',
    gigId: 'stub-gig-3',
    gigTitle: 'Aide a domicile et courses',
    clientId: 'stub-client-1',
    clientName: 'Marie Fotso',
    studentId: 'stub-student-1',
    studentName: 'Aline Nkem',
    tier: 'basique',
    description: 'Courses urgentes au marche et livraison a la cite universitaire.',
    budget: 3000,
    status: 'completed',
    revisionsLeft: 0,
    deliveryDate: daysAgo(8),
    createdAt: daysAgo(10),
    escrowAmount: 3000,
    paymentMethod: 'mtn',
    deliverableNote: 'Courses livrees et confirmees par le client.',
    delivered_at: daysAgo(8),
    payment_status: 'paid',
    payout_status: 'paid',
  },
  {
    id: 'stub-order-5',
    gigId: 'stub-gig-4',
    gigTitle: 'Depannage ordinateur et installation logiciels',
    clientId: 'stub-client-1',
    clientName: 'Marie Fotso',
    studentId: 'stub-student-2',
    studentName: 'Samuel Talla',
    tier: 'standard',
    description: 'Ordinateur lent, installation bureautique et sauvegarde des fichiers cours.',
    budget: 18000,
    status: 'disputed',
    revisionsLeft: 1,
    deliveryDate: daysAgo(2),
    createdAt: daysAgo(6),
    escrowAmount: 18000,
    paymentMethod: 'orange',
    deliverableNote: 'Intervention terminee mais le client signale encore un probleme de demarrage.',
    delivered_at: daysAgo(2),
    payment_status: 'paid',
    payout_status: 'blocked',
  },
  {
    id: 'stub-order-6',
    gigId: 'stub-gig-5',
    gigTitle: 'Decoration simple pour anniversaire',
    clientId: 'stub-client-2',
    clientName: 'Joel Manga',
    studentId: 'stub-student-1',
    studentName: 'Aline Nkem',
    tier: 'basique',
    description: 'Preparation d un coin photo pour anniversaire familial.',
    budget: 10000,
    status: 'cancelled',
    revisionsLeft: 2,
    deliveryDate: daysFromNow(2),
    createdAt: daysAgo(2),
    escrowAmount: 0,
    paymentMethod: 'mtn',
    payment_status: 'cancelled',
    payout_status: 'not_started',
  },
];

const mockMessages: ChatMessage[] = [
  {
    id: 'stub-msg-1',
    orderId: 'stub-order-2',
    senderId: 'stub-client-2',
    senderName: 'Joel Manga',
    content: 'Bonjour Samuel, je veux une page simple avec les couleurs vert et blanc.',
    timestamp: daysAgo(3),
    type: 'text',
  },
  {
    id: 'stub-msg-2',
    orderId: 'stub-order-2',
    senderId: 'stub-student-2',
    senderName: 'Samuel Talla',
    content: 'Bien recu. Je commence par une maquette et je vous envoie un lien de preview ce soir.',
    timestamp: daysAgo(2),
    type: 'text',
  },
  {
    id: 'stub-msg-3',
    orderId: 'stub-order-3',
    senderId: 'system',
    senderName: 'KamEtud',
    content: 'Le livrable a ete depose. Le client peut valider ou demander une revision.',
    timestamp: daysAgo(1),
    type: 'system',
  },
  {
    id: 'stub-msg-4',
    orderId: 'stub-order-5',
    senderId: 'stub-client-1',
    senderName: 'Marie Fotso',
    content: 'Le PC redemarre encore tout seul. Je pense qu il faut revoir la configuration.',
    timestamp: daysAgo(1),
    type: 'text',
  },
  {
    id: 'stub-msg-5',
    orderId: 'stub-order-5',
    senderId: 'stub-student-2',
    senderName: 'Samuel Talla',
    content: 'Je peux refaire un diagnostic et joindre les captures au moderateur.',
    timestamp: daysAgo(1),
    type: 'text',
  },
];

const mockReviews: Review[] = [
  {
    id: 'stub-review-1',
    orderId: 'stub-order-4',
    gigId: 'stub-gig-3',
    reviewerId: 'stub-client-1',
    reviewerName: 'Marie Fotso',
    studentId: 'stub-student-1',
    rating: 5,
    text: 'Tres ponctuelle, communication claire et service rendu sans stress.',
    date: daysAgo(8),
    reported: false,
  },
  {
    id: 'stub-review-2',
    orderId: 'stub-order-7',
    gigId: 'stub-gig-1',
    reviewerId: 'stub-client-2',
    reviewerName: 'Joel Manga',
    studentId: 'stub-student-1',
    rating: 4,
    text: 'Bon travail de correction, avec des remarques utiles pour ameliorer le fond.',
    date: daysAgo(15),
    reported: false,
  },
  {
    id: 'stub-review-3',
    orderId: 'stub-order-8',
    gigId: 'stub-gig-2',
    reviewerId: 'stub-client-1',
    reviewerName: 'Marie Fotso',
    studentId: 'stub-student-2',
    rating: 5,
    text: 'Samuel a livre une maquette propre et a explique comment modifier le contenu.',
    date: daysAgo(12),
    reported: false,
  },
];

const mockDisputes: Dispute[] = [
  {
    id: 'stub-dispute-1',
    orderId: 'stub-order-5',
    gigTitle: 'Depannage ordinateur et installation logiciels',
    clientId: 'stub-client-1',
    clientName: 'Marie Fotso',
    clientStatement: 'Le probleme de redemarrage persiste apres l intervention.',
    studentId: 'stub-student-2',
    studentName: 'Samuel Talla',
    studentStatement: 'J ai termine la configuration demandee, mais le disque semble defectueux.',
    status: 'open',
    createdAt: daysAgo(1),
  },
  {
    id: 'stub-dispute-2',
    orderId: 'stub-order-9',
    gigTitle: 'Correction de memoire',
    clientId: 'stub-client-2',
    clientName: 'Joel Manga',
    clientStatement: 'Le document final ne respecte pas toutes les consignes.',
    studentId: 'stub-student-1',
    studentName: 'Aline Nkem',
    studentStatement: 'Les consignes ajoutees apres validation initiale changent le perimetre.',
    status: 'under_review',
    createdAt: daysAgo(3),
  },
  {
    id: 'stub-dispute-3',
    orderId: 'stub-order-10',
    gigTitle: 'Aide a domicile et courses',
    clientId: 'stub-client-1',
    clientName: 'Marie Fotso',
    clientStatement: 'Une partie des courses etait manquante.',
    studentId: 'stub-student-1',
    studentName: 'Aline Nkem',
    studentStatement: 'Le produit manquant etait indisponible et le client a ete rembourse.',
    status: 'resolved_client',
    moderatorId: 'stub-moderator-1',
    moderatorNote: 'Remboursement partiel valide apres verification des messages.',
    createdAt: daysAgo(12),
    resolvedAt: daysAgo(10),
  },
];

const mockVerificationRequests: any[] = [
  {
    id: 'stub-verification-1',
    student_id: 'stub-student-2',
    studentId: 'stub-student-2',
    student_name: 'Samuel Talla',
    studentName: 'Samuel Talla',
    email: 'samuel.talla@kametud.local',
    university: 'Universite de Yaounde I',
    id_type: 'CNI',
    idType: 'CNI',
    id_file_url: '/placeholder.svg',
    idFileUrl: '/placeholder.svg',
    student_card_url: '/placeholder.svg',
    studentCardUrl: '/placeholder.svg',
    selfie_url: '/placeholder.svg',
    selfieUrl: '/placeholder.svg',
    status: 'pending',
    submitted_at: daysAgo(1),
    submittedAt: daysAgo(1),
  },
  {
    id: 'stub-verification-2',
    student_id: 'stub-student-1',
    studentId: 'stub-student-1',
    student_name: 'Aline Nkem',
    studentName: 'Aline Nkem',
    email: 'aline.nkem@kametud.local',
    university: 'Universite de Dschang',
    id_type: 'Passeport',
    idType: 'Passeport',
    id_file_url: '/placeholder.svg',
    idFileUrl: '/placeholder.svg',
    student_card_url: '/placeholder.svg',
    studentCardUrl: '/placeholder.svg',
    selfie_url: '/placeholder.svg',
    selfieUrl: '/placeholder.svg',
    status: 'approved',
    submitted_at: daysAgo(20),
    submittedAt: daysAgo(20),
  },
  {
    id: 'stub-verification-3',
    student_id: 'stub-student-3',
    studentId: 'stub-student-3',
    student_name: 'Nadia Mefire',
    studentName: 'Nadia Mefire',
    email: 'nadia.mefire@kametud.local',
    university: 'Universite de Douala',
    id_type: 'CNI',
    idType: 'CNI',
    id_file_url: '/placeholder.svg',
    idFileUrl: '/placeholder.svg',
    student_card_url: '/placeholder.svg',
    studentCardUrl: '/placeholder.svg',
    selfie_url: '/placeholder.svg',
    selfieUrl: '/placeholder.svg',
    status: 'rejected',
    submitted_at: daysAgo(6),
    submittedAt: daysAgo(6),
  },
];

const mockReportedContent: any[] = [
  {
    id: 'stub-report-1',
    type: 'review',
    title: 'Avis signale sur depannage ordinateur',
    reporter: 'Marie Fotso',
    reason: 'Langage agressif dans la reponse',
    date: daysAgo(2),
    status: 'pending',
    text: 'Le prestataire ne repond plus depuis la livraison.',
    rating: 2,
    reviewer_name: 'Marie Fotso',
  },
  {
    id: 'stub-report-2',
    type: 'gig',
    title: 'Service numerique a verifier',
    reporter: 'Joel Manga',
    reason: 'Description potentiellement trompeuse',
    date: daysAgo(5),
    status: 'pending',
    text: 'Le service promet une livraison trop rapide pour le volume annonce.',
    rating: 3,
    reviewer_name: 'Joel Manga',
  },
];

function useStubQuery<T>(queryKey: QueryKey, data: T, enabled = true) {
  return useQuery<T>({
    queryKey,
    enabled,
    staleTime: Infinity,
    queryFn: async () => data,
  });
}

function useStubMutation<TVariables, TResult = void>(
  todo: string,
  result?: (variables: TVariables) => TResult | Promise<TResult>,
  invalidateKeys: QueryKey[] = [],
) {
  const qc = useQueryClient();
  return useMutation<TResult, Error, TVariables>({
    mutationFn: async (variables) => {
      console.warn(todo, variables);
      if (result) return result(variables);
      return undefined as TResult;
    },
    onSuccess: () => {
      invalidateKeys.forEach(queryKey => qc.invalidateQueries({ queryKey }));
    },
  });
}

// TODO(backend): reconnecter la liste des gigs actifs via Spring Boot (GET /gigs avec filtres categorie/ville).
export function useGigs() {
  return useStubQuery<Gig[]>(['gigs'], mockGigs);
}

// TODO(backend): reconnecter le detail d'un gig via Spring Boot (GET /gigs/{id}).
export function useGigById(id: string | undefined) {
  return useStubQuery<Gig | null>(['gig', id], mockGigs.find(g => g.id === id) || mockGigs[0] || null, !!id);
}

// TODO(backend): reconnecter les gigs de l'etudiant connecte via Spring Boot (GET /students/me/gigs).
export function useMyGigs() {
  const { user } = useAuth();
  const data = user?.role === 'student' ? mockGigs : [];
  return useStubQuery<Gig[]>(['my-gigs', user?.id], data, !!user);
}

// TODO(backend): reconnecter la creation de gig via Spring Boot (POST /gigs).
export function useCreateGig() {
  return useStubMutation<{
    title: string; description: string; category: string; location: string;
    tier_basique: GigTier; tier_standard: GigTier; tier_premium: GigTier;
    images?: string[]; published?: boolean;
  }>('TODO(backend): creer un gig via Spring Boot', undefined, [['my-gigs'], ['gigs']]);
}

// TODO(backend): reconnecter la publication/depublication de gig via Spring Boot (PATCH /gigs/{id}/publication).
export function usePublishGig() {
  return useStubMutation<{ id: string; published: boolean }>('TODO(backend): publier ou retirer un gig via Spring Boot', undefined, [['my-gigs'], ['gigs']]);
}

// TODO(backend): reconnecter l'activation/desactivation de gig via Spring Boot (PATCH /gigs/{id}/status).
export function useToggleGig() {
  return useStubMutation<{ id: string; active: boolean }>('TODO(backend): activer ou desactiver un gig via Spring Boot', undefined, [['my-gigs']]);
}

// TODO(backend): reconnecter la suppression de gig via Spring Boot (DELETE /gigs/{id}).
export function useDeleteGig() {
  return useStubMutation<string>('TODO(backend): supprimer un gig via Spring Boot', undefined, [['my-gigs']]);
}

// TODO(backend): reconnecter les commandes client via Spring Boot (GET /orders?role=client).
export function useMyOrders() {
  const { user } = useAuth();
  return useStubQuery<OrderWithMeta[]>(['my-orders', user?.id], mockOrders, !!user);
}

// TODO(backend): reconnecter les missions etudiant via Spring Boot (GET /orders?role=student).
export function useMyMissions() {
  const { user } = useAuth();
  return useStubQuery<OrderWithMeta[]>(['my-missions', user?.id], mockOrders, !!user);
}

// TODO(backend): reconnecter la creation de commande via Spring Boot (POST /orders).
export function useCreateOrder() {
  const { user } = useAuth();
  return useStubMutation<{
    gig_id: string; gig_title: string; student_id: string; student_name: string;
    tier: string; description: string; budget: number;
    payment_method: string; delivery_date?: string;
  }, OrderWithMeta>(
    'TODO(backend): creer une commande via Spring Boot',
    order => ({
      id: `stub-order-${Date.now()}`,
      gigId: order.gig_id,
      gigTitle: order.gig_title,
      clientId: user?.id || 'stub-client',
      clientName: user ? `${user.firstName} ${user.lastName}`.trim() : 'Client demo',
      studentId: order.student_id,
      studentName: order.student_name,
      tier: order.tier as 'basique' | 'standard' | 'premium',
      description: order.description,
      budget: order.budget,
      status: 'pending',
      revisionsLeft: 2,
      deliveryDate: order.delivery_date || new Date().toISOString(),
      createdAt: new Date().toISOString(),
      escrowAmount: order.budget,
      paymentMethod: order.payment_method,
    }),
    [['my-orders']],
  );
}

// TODO(backend): reconnecter la mise a jour de statut/livrable de commande via Spring Boot (PATCH /orders/{id}).
export function useUpdateOrder() {
  return useStubMutation<{
    id: string; status?: string; deliverable_url?: string; deliverable_note?: string; revisions_left?: number;
  }>('TODO(backend): mettre a jour une commande via Spring Boot', undefined, [['my-orders'], ['my-missions'], ['all-orders']]);
}

// TODO(backend): reconnecter les messages d'une commande via Spring Boot (GET /orders/{id}/messages).
export function useChatMessages(orderId: string | null) {
  return useStubQuery<ChatMessage[]>(['chat', orderId], mockMessages.filter(message => message.orderId === orderId), !!orderId);
}

// TODO(backend): reconnecter l'envoi de message via Spring Boot (POST /orders/{id}/messages).
export function useSendMessage() {
  return useStubMutation<{ orderId: string; content: string }>('TODO(backend): envoyer un message via Spring Boot', undefined, [['chat']]);
}

// TODO(backend): reconnecter les avis d'un etudiant via Spring Boot (GET /students/{id}/reviews).
export function useReviewsByStudent(studentId: string | undefined) {
  const reviews = mockReviews.filter(review => review.studentId === studentId);
  return useStubQuery<Review[]>(['reviews', studentId], reviews.length ? reviews : mockReviews.filter(review => review.studentId === 'stub-student-1'), !!studentId);
}

// TODO(backend): reconnecter la creation d'avis via Spring Boot (POST /reviews).
export function useCreateReview() {
  return useStubMutation<{ orderId: string; gigId: string; studentId: string; rating: number; text: string }>('TODO(backend): creer un avis via Spring Boot', undefined, [['reviews']]);
}

// TODO(backend): reconnecter la liste des litiges via Spring Boot (GET /moderation/disputes).
export function useDisputes() {
  return useStubQuery<Dispute[]>(['disputes'], mockDisputes);
}

// TODO(backend): reconnecter l'arbitrage de litige via Spring Boot (PATCH /moderation/disputes/{id}).
export function useUpdateDispute() {
  return useStubMutation<{ id: string; status?: string; moderator_id?: string; moderator_note?: string; resolved_at?: string }>('TODO(backend): mettre a jour un litige via Spring Boot', undefined, [['disputes'], ['my-orders'], ['my-missions']]);
}

// TODO(backend): reconnecter l'ouverture de litige via Spring Boot (POST /disputes).
export function useCreateDispute() {
  return useStubMutation<{ orderId: string; gigTitle: string; studentId: string; studentName: string; clientStatement: string }>('TODO(backend): ouvrir un litige via Spring Boot', undefined, [['my-orders'], ['disputes']]);
}

// TODO(backend): reconnecter les demandes KYC via Spring Boot (GET /admin/verifications).
export function useVerificationRequests() {
  return useStubQuery<VerificationRequest[]>(['verifications'], mockVerificationRequests);
}

// TODO(backend): reconnecter l'approbation/rejet KYC via Spring Boot (PATCH /admin/verifications/{id}).
export function useUpdateVerification() {
  return useStubMutation<{ id: string; status: string }>('TODO(backend): valider ou rejeter une verification via Spring Boot', undefined, [['verifications'], ['profiles'], ['all-profiles']]);
}

// TODO(backend): reconnecter la creation de demande KYC via Spring Boot (POST /verifications).
export function useCreateVerification() {
  return useStubMutation<{
    university: string; id_type: string;
    id_file_url: string; student_card_url: string; selfie_url: string;
  }>('TODO(backend): creer une demande de verification via Spring Boot', undefined, [['verifications']]);
}

// TODO(backend): reconnecter les categories via Spring Boot (GET /categories).
export function useCategories() {
  return useStubQuery<ServiceCategory[]>(['categories'], mockCategories);
}

// TODO(backend): reconnecter les villes actives via Spring Boot (GET /cities?active=true).
export function useCities() {
  return useStubQuery<CityRecord[]>(['cities'], mockCities.filter(c => c.active));
}

// TODO(backend): reconnecter le profil public via Spring Boot (GET /profiles/{userId}).
export function useProfile(userId: string | undefined) {
  return useStubQuery<ProfileRecord | null>(['profile', userId], mockProfiles.find(p => p.user_id === userId) || mockProfiles[0] || null, !!userId);
}

// TODO(backend): reconnecter la liste des profils admin via Spring Boot (GET /admin/profiles).
export function useAllProfiles() {
  return useStubQuery<ProfileRecord[]>(['all-profiles'], mockProfiles);
}

// TODO(backend): reconnecter toutes les commandes admin via Spring Boot (GET /admin/orders).
export function useAllOrders() {
  return useStubQuery<OrderWithMeta[]>(['all-orders'], mockOrders);
}

// TODO(backend): reconnecter le revenu etudiant via Spring Boot (GET /students/{id}/income).
export function useStudentIncome(studentId: string | undefined) {
  return useStubQuery<{ completed: number; pending: number; count: number }>(
    ['student-income', studentId],
    { completed: 126000, pending: 81000, count: 7 },
    !!studentId,
  );
}

// TODO(backend): reconnecter les contenus signales via Spring Boot (GET /admin/reports).
export function useReportedContent() {
  return useStubQuery<ReportedContent[]>(['reported-content'], mockReportedContent);
}

// TODO(backend): reconnecter la creation de categorie via Spring Boot (POST /admin/categories).
export function useCreateCategory() {
  return useStubMutation<string>('TODO(backend): creer une categorie via Spring Boot', undefined, [['categories']]);
}

// TODO(backend): reconnecter l'activation de categorie via Spring Boot (PATCH /admin/categories/{id}).
export function useToggleCategory() {
  return useStubMutation<{ id: string; active: boolean }>('TODO(backend): activer/desactiver une categorie via Spring Boot', undefined, [['categories']]);
}

// TODO(backend): reconnecter la suppression de categorie via Spring Boot (DELETE /admin/categories/{id}).
export function useDeleteCategory() {
  return useStubMutation<string>('TODO(backend): supprimer une categorie via Spring Boot', undefined, [['categories']]);
}

// TODO(backend): reconnecter la creation de ville via Spring Boot (POST /admin/cities).
export function useCreateCity() {
  return useStubMutation<string>('TODO(backend): creer une ville via Spring Boot', undefined, [['cities'], ['all-cities']]);
}

// TODO(backend): reconnecter la suppression de ville via Spring Boot (DELETE /admin/cities/{id}).
export function useDeleteCity() {
  return useStubMutation<string>('TODO(backend): supprimer une ville via Spring Boot', undefined, [['cities'], ['all-cities']]);
}

// TODO(backend): reconnecter la mise a jour de profil admin via Spring Boot (PATCH /admin/profiles/{userId}).
export function useUpdateProfile() {
  return useStubMutation<{ userId: string; updates: { banned?: boolean; verified?: boolean } }>('TODO(backend): mettre a jour un profil via Spring Boot', undefined, [['all-profiles']]);
}

// TODO(backend): reconnecter toutes les villes admin via Spring Boot (GET /admin/cities).
export function useAllCities() {
  return useStubQuery<CityRecord[]>(['all-cities'], mockCities);
}

// TODO(backend): reconnecter l'upload fichier via Spring Boot (POST /files, buckets identity-documents/avatars/deliverables).
export async function uploadFile(_bucket: string, _path: string, file: File) {
  console.warn('TODO(backend): uploader un fichier via Spring Boot', { name: file.name, size: file.size });
  return URL.createObjectURL(file);
}

// TODO(backend): reconnecter la reponse etudiant a un litige via Spring Boot (PATCH /disputes/{orderId}/student-response).
export function useRespondToDispute() {
  return useStubMutation<{ orderId: string; statement: string }>('TODO(backend): repondre a un litige via Spring Boot', undefined, [['disputes'], ['my-missions']]);
}

// TODO(backend): reconnecter l'abonnement temps reel aux litiges via Spring Boot (SSE/WebSocket moderation disputes).
export function subscribeToDisputes(_callback: () => void) {
  console.warn('TODO(backend): abonnement litiges Spring Boot non connecte');
  return () => undefined;
}

// TODO(backend): reconnecter l'abonnement temps reel au chat via Spring Boot (SSE/WebSocket order messages).
export function subscribeToChatMessages(_orderId: string, _callback: (msg: ChatMessage) => void) {
  console.warn('TODO(backend): abonnement chat Spring Boot non connecte');
  return () => undefined;
}

// TODO(backend): reconnecter les demandes ouvertes via Spring Boot (GET /requests?status=open).
export function useGigRequests() {
  return useStubQuery<GigRequest[]>(['gig-requests'], mockRequests);
}

// TODO(backend): reconnecter les demandes du client connecte via Spring Boot (GET /me/requests).
export function useMyRequests() {
  const { user } = useAuth();
  return useStubQuery<GigRequest[]>(['my-requests', user?.id], user ? mockRequests : [], !!user);
}

// TODO(backend): reconnecter la creation de demande client via Spring Boot (POST /requests).
export function useCreateGigRequest() {
  return useStubMutation<{ title: string; description: string; category: string; location: string; budget: number; deadline?: string }>('TODO(backend): creer une demande client via Spring Boot', undefined, [['gig-requests'], ['my-requests']]);
}

// TODO(backend): reconnecter l'annulation de demande client via Spring Boot (PATCH /requests/{id}/cancel).
export function useCancelGigRequest() {
  return useStubMutation<string>('TODO(backend): annuler une demande client via Spring Boot', undefined, [['gig-requests'], ['my-requests']]);
}

// TODO(backend): reconnecter les propositions d'une demande via Spring Boot (GET /requests/{id}/proposals).
export function useProposals(requestId: string | undefined) {
  return useStubQuery<RequestProposal[]>(['proposals', requestId], mockProposals.filter(p => p.request_id === requestId), !!requestId);
}

// TODO(backend): reconnecter les propositions de l'etudiant connecte via Spring Boot (GET /me/proposals).
export function useMyProposals() {
  const { user } = useAuth();
  return useStubQuery<RequestProposal[]>(['my-proposals', user?.id], user ? mockProposals : [], !!user);
}

// TODO(backend): reconnecter la creation de proposition via Spring Boot (POST /requests/{id}/proposals).
export function useCreateProposal() {
  return useStubMutation<{ request_id: string; price: number; delivery_days: number; message: string }>('TODO(backend): creer une proposition via Spring Boot', undefined, [['proposals'], ['my-proposals']]);
}

// TODO(backend): reconnecter l'acceptation de proposition via Spring Boot (POST /requests/{requestId}/proposals/{proposalId}/accept).
export function useAcceptProposal() {
  return useStubMutation<{ proposalId: string; requestId: string }>('TODO(backend): accepter une proposition et creer une commande via Spring Boot', undefined, [['proposals'], ['my-requests'], ['gig-requests'], ['my-orders'], ['my-missions']]);
}

export const __mockGigRequests = mockRequests;
