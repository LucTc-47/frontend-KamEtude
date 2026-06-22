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
];

const mockCategories: ServiceCategory[] = [
  { id: 'cat-academic', name: 'Academique', icon: 'BookOpen', active: true },
  { id: 'cat-digital', name: 'Digital', icon: 'Laptop', active: true },
  { id: 'cat-home', name: 'Aide a domicile', icon: 'Home', active: true },
];

const mockCities: CityRecord[] = [
  { id: 'city-dschang', name: 'Dschang', active: true },
  { id: 'city-bafoussam', name: 'Bafoussam', active: true },
];

const mockGigs: Gig[] = [
  {
    id: 'stub-gig-1',
    studentId: 'stub-student-1',
    studentName: 'Aline Nkem',
    studentRating: 4.8,
    title: 'Soutien scolaire et correction de devoirs',
    description: 'Mock UI: service exemple en attente de connexion Spring Boot.',
    category: 'Academique',
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
];

const mockRequests: GigRequest[] = [
  {
    id: 'stub-request-1',
    client_id: 'stub-client-1',
    client_name: 'Marie Fotso',
    title: 'Besoin d aide pour un rapport',
    description: 'Mock UI: demande exemple en attente de connexion Spring Boot.',
    category: 'Academique',
    location: 'Dschang',
    budget: 15000,
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'open',
    accepted_proposal_id: null,
    created_at: new Date().toISOString(),
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
    message: 'Mock UI: proposition exemple.',
    status: 'pending',
    created_at: new Date().toISOString(),
    gig_requests: { title: 'Besoin d aide pour un rapport', budget: 15000, status: 'open' },
  },
];

const emptyOrders: OrderWithMeta[] = [];
const emptyMessages: ChatMessage[] = [];
const emptyReviews: Review[] = [];
const emptyDisputes: Dispute[] = [];
const emptyVerifications: VerificationRequest[] = [];
const emptyReportedContent: ReportedContent[] = [];

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
  return useStubQuery<OrderWithMeta[]>(['my-orders', user?.id], emptyOrders, !!user);
}

// TODO(backend): reconnecter les missions etudiant via Spring Boot (GET /orders?role=student).
export function useMyMissions() {
  const { user } = useAuth();
  return useStubQuery<OrderWithMeta[]>(['my-missions', user?.id], emptyOrders, !!user);
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
  return useStubQuery<ChatMessage[]>(['chat', orderId], emptyMessages, !!orderId);
}

// TODO(backend): reconnecter l'envoi de message via Spring Boot (POST /orders/{id}/messages).
export function useSendMessage() {
  return useStubMutation<{ orderId: string; content: string }>('TODO(backend): envoyer un message via Spring Boot', undefined, [['chat']]);
}

// TODO(backend): reconnecter les avis d'un etudiant via Spring Boot (GET /students/{id}/reviews).
export function useReviewsByStudent(studentId: string | undefined) {
  return useStubQuery<Review[]>(['reviews', studentId], emptyReviews, !!studentId);
}

// TODO(backend): reconnecter la creation d'avis via Spring Boot (POST /reviews).
export function useCreateReview() {
  return useStubMutation<{ orderId: string; gigId: string; studentId: string; rating: number; text: string }>('TODO(backend): creer un avis via Spring Boot', undefined, [['reviews']]);
}

// TODO(backend): reconnecter la liste des litiges via Spring Boot (GET /moderation/disputes).
export function useDisputes() {
  return useStubQuery<Dispute[]>(['disputes'], emptyDisputes);
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
  return useStubQuery<VerificationRequest[]>(['verifications'], emptyVerifications);
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
  return useStubQuery<OrderWithMeta[]>(['all-orders'], emptyOrders);
}

// TODO(backend): reconnecter le revenu etudiant via Spring Boot (GET /students/{id}/income).
export function useStudentIncome(studentId: string | undefined) {
  return useStubQuery<{ completed: number; pending: number; count: number }>(['student-income', studentId], { completed: 0, pending: 0, count: 0 }, !!studentId);
}

// TODO(backend): reconnecter les contenus signales via Spring Boot (GET /admin/reports).
export function useReportedContent() {
  return useStubQuery<ReportedContent[]>(['reported-content'], emptyReportedContent);
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
