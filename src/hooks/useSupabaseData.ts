import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { Gig, GigTier, Order, OrderStatus, ChatMessage, Review, Dispute } from '@/types';

// ─── Helper: DB row → Gig ───
function rowToGig(r: any): Gig {
  const profileName = r.profiles ? `${r.profiles.first_name} ${r.profiles.last_name}`.trim() : '';
  return {
    id: r.id,
    studentId: r.student_id,
    studentName: profileName || 'Étudiant',
    studentRating: r.rating || 0,
    title: r.title,
    description: r.description || '',
    category: r.category || '',
    location: r.location || '',
    rating: Number(r.rating) || 0,
    reviewCount: r.review_count || 0,
    orderCount: r.order_count || 0,
    badge: r.badge || 'Nouveau',
    images: r.images || [],
    active: r.active ?? true,
    gpsLocation: r.gps_lat && r.gps_lng ? { lat: r.gps_lat, lng: r.gps_lng } : undefined,
    tiers: {
      basique: r.tier_basique as GigTier,
      standard: r.tier_standard as GigTier,
      premium: r.tier_premium as GigTier,
    },
  };
}

// ─── GIGS ───
export function useGigs() {
  return useQuery({
    queryKey: ['gigs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gigs')
        .select('*')
        .eq('active', true);
      if (error) return [];
      return (data || []).map(rowToGig);
    },
  });
}

export function useGigById(id: string | undefined) {
  // Skip query for non-UUID mock IDs
  const isUUID = !!id && /^[0-9a-f]{8}-[0-9a-f]{4}-/i.test(id);
  return useQuery({
    queryKey: ['gig', id],
    enabled: isUUID,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gigs')
        .select('*')
        .eq('id', id!)
        .single();
      if (error) return null;
      return rowToGig(data);
    },
  });
}

export function useMyGigs() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['my-gigs', user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gigs')
        .select('*')
        .eq('student_id', user!.id);
      if (error) return [];
      return (data || []).map(rowToGig);
    },
  });
}

export function useCreateGig() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (gig: {
      title: string; description: string; category: string; location: string;
      tier_basique: any; tier_standard: any; tier_premium: any;
      images?: string[];
    }) => {
      const { error } = await supabase.from('gigs').insert({
        student_id: user!.id,
        title: gig.title,
        description: gig.description,
        category: gig.category,
        location: gig.location,
        tier_basique: gig.tier_basique,
        tier_standard: gig.tier_standard,
        tier_premium: gig.tier_premium,
        images: gig.images || [],
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['my-gigs'] });
      qc.invalidateQueries({ queryKey: ['gigs'] });
    },
  });
}

export function useToggleGig() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
      const { error } = await supabase.from('gigs').update({ active }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['my-gigs'] }),
  });
}

export function useDeleteGig() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('gigs').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['my-gigs'] }),
  });
}

// ─── ORDERS ───
function rowToOrder(r: any): Order {
  return {
    id: r.id,
    gigId: r.gig_id,
    gigTitle: r.gig_title,
    clientId: r.client_id,
    clientName: r.client_name,
    studentId: r.student_id,
    studentName: r.student_name,
    tier: r.tier as 'basique' | 'standard' | 'premium',
    description: r.description || '',
    budget: Number(r.budget),
    status: r.status as OrderStatus,
    revisionsLeft: r.revisions_left ?? 2,
    deliveryDate: r.delivery_date || '',
    createdAt: r.created_at,
    escrowAmount: Number(r.escrow_amount),
    paymentMethod: r.payment_method || '',
    deliverableUrl: r.deliverable_url || undefined,
    deliverableNote: r.deliverable_note || undefined,
  };
}

export function useMyOrders() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['my-orders', user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('client_id', user!.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []).map(rowToOrder);
    },
  });
}

export function useMyMissions() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['my-missions', user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('student_id', user!.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []).map(rowToOrder);
    },
  });
}

export function useCreateOrder() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (order: {
      gig_id: string; gig_title: string; student_id: string; student_name: string;
      tier: string; description: string; budget: number;
      payment_method: string; delivery_date?: string;
    }) => {
      const { error } = await supabase.from('orders').insert({
        ...order,
        client_id: user!.id,
        client_name: `${user!.firstName} ${user!.lastName}`.trim(),
        escrow_amount: order.budget,
        status: 'pending',
      });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['my-orders'] }),
  });
}

export function useUpdateOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status, deliverable_url, deliverable_note, revisions_left }: {
      id: string; status?: string; deliverable_url?: string; deliverable_note?: string; revisions_left?: number;
    }) => {
      const u: any = {};
      if (status !== undefined) u.status = status;
      if (deliverable_url !== undefined) u.deliverable_url = deliverable_url;
      if (deliverable_note !== undefined) u.deliverable_note = deliverable_note;
      if (revisions_left !== undefined) u.revisions_left = revisions_left;
      const { error } = await supabase.from('orders').update(u).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['my-orders'] });
      qc.invalidateQueries({ queryKey: ['my-missions'] });
    },
  });
}

// ─── CHAT ───
export function useChatMessages(orderId: string | null) {
  return useQuery({
    queryKey: ['chat', orderId],
    enabled: !!orderId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('order_id', orderId!)
        .order('created_at', { ascending: true });
      if (error) throw error;
      return (data || []).map((m: any): ChatMessage => ({
        id: m.id, orderId: m.order_id, senderId: m.sender_id,
        senderName: m.sender_name, content: m.content,
        timestamp: m.created_at, type: m.type as 'text' | 'file' | 'system',
      }));
    },
  });
}

export function useSendMessage() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async ({ orderId, content }: { orderId: string; content: string }) => {
      const { error } = await supabase.from('chat_messages').insert({
        order_id: orderId,
        sender_id: user!.id,
        sender_name: `${user!.firstName} ${user!.lastName}`.trim(),
        content,
        type: 'text',
      });
      if (error) throw error;
    },
    onSuccess: (_, vars) => qc.invalidateQueries({ queryKey: ['chat', vars.orderId] }),
  });
}

// ─── REVIEWS ───
export function useReviewsByStudent(studentId: string | undefined) {
  return useQuery({
    queryKey: ['reviews', studentId],
    enabled: !!studentId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('student_id', studentId!)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []).map((r: any): Review => ({
        id: r.id, orderId: r.order_id, gigId: r.gig_id,
        reviewerId: r.reviewer_id, reviewerName: r.reviewer_name,
        studentId: r.student_id, rating: r.rating,
        text: r.text || '', date: r.created_at, reported: r.reported,
      }));
    },
  });
}

export function useCreateReview() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (review: { orderId: string; gigId: string; studentId: string; rating: number; text: string }) => {
      const { error } = await supabase.from('reviews').insert({
        order_id: review.orderId,
        gig_id: review.gigId,
        reviewer_id: user!.id,
        reviewer_name: `${user!.firstName} ${user!.lastName}`.trim(),
        student_id: review.studentId,
        rating: review.rating,
        text: review.text,
      });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['reviews'] }),
  });
}

// ─── DISPUTES ───
export function useDisputes() {
  return useQuery({
    queryKey: ['disputes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('disputes')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []).map((d: any): Dispute => ({
        id: d.id, orderId: d.order_id, gigTitle: d.gig_title || '',
        clientId: d.client_id, clientName: d.client_name || '',
        clientStatement: d.client_statement || '',
        studentId: d.student_id, studentName: d.student_name || '',
        studentStatement: d.student_statement || '',
        status: d.status, moderatorId: d.moderator_id,
        moderatorNote: d.moderator_note, createdAt: d.created_at,
        resolvedAt: d.resolved_at,
      }));
    },
  });
}

export function useUpdateDispute() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status, moderator_id, moderator_note, resolved_at }: {
      id: string; status?: string; moderator_id?: string; moderator_note?: string; resolved_at?: string;
    }) => {
      const u: any = {};
      if (status !== undefined) u.status = status;
      if (moderator_id !== undefined) u.moderator_id = moderator_id;
      if (moderator_note !== undefined) u.moderator_note = moderator_note;
      if (resolved_at !== undefined) u.resolved_at = resolved_at;
      const { error } = await supabase.from('disputes').update(u).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['disputes'] }),
  });
}

// ─── VERIFICATION REQUESTS ───
export function useVerificationRequests() {
  return useQuery({
    queryKey: ['verifications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('verification_requests')
        .select('*')
        .order('submitted_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });
}

export function useUpdateVerification() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from('verification_requests').update({ status }).eq('id', id);
      if (error) throw error;
      // If approved, also mark student profile as verified
      if (status === 'approved') {
        const { data } = await supabase.from('verification_requests').select('student_id').eq('id', id).single();
        if (data) {
          await supabase.from('profiles').update({ verified: true }).eq('user_id', data.student_id);
        }
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['verifications'] }),
  });
}

export function useCreateVerification() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (req: {
      university: string; id_type: string;
      id_file_url: string; student_card_url: string; selfie_url: string;
    }) => {
      const { error } = await supabase.from('verification_requests').insert({
        student_id: user!.id,
        student_name: `${user!.firstName} ${user!.lastName}`.trim(),
        email: user!.email,
        ...req,
      });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['verifications'] }),
  });
}

// ─── CATEGORIES & CITIES ───
export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase.from('categories').select('*').order('name');
      if (error) throw error;
      return data || [];
    },
  });
}

export function useCities() {
  return useQuery({
    queryKey: ['cities'],
    queryFn: async () => {
      const { data, error } = await supabase.from('cities').select('*').eq('active', true).order('name');
      if (error) throw error;
      return data || [];
    },
  });
}

// ─── PROFILES ───
export function useProfile(userId: string | undefined) {
  return useQuery({
    queryKey: ['profile', userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId!)
        .single();
      if (error) throw error;
      return data;
    },
  });
}

export function useAllProfiles() {
  return useQuery({
    queryKey: ['all-profiles'],
    queryFn: async () => {
      const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });
}

export function useAllOrders() {
  return useQuery({
    queryKey: ['all-orders'],
    queryFn: async () => {
      const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []).map(rowToOrder);
    },
  });
}

// ─── REPORTED CONTENT ───
export function useReportedContent() {
  return useQuery({
    queryKey: ['reported-content'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('reported', true);
      if (error) throw error;
      return data || [];
    },
  });
}

// ─── ADMIN: CATEGORIES MUTATIONS ───
export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (name: string) => {
      const { error } = await supabase.from('categories').insert({ name });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['categories'] }),
  });
}

export function useToggleCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
      const { error } = await supabase.from('categories').update({ active }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['categories'] }),
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['categories'] }),
  });
}

// ─── ADMIN: CITIES MUTATIONS ───
export function useCreateCity() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (name: string) => {
      const { error } = await supabase.from('cities').insert({ name });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['cities'] }),
  });
}

export function useDeleteCity() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('cities').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['cities'] }),
  });
}

// ─── ADMIN: USER MANAGEMENT ───
export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, updates }: { userId: string; updates: { banned?: boolean; verified?: boolean } }) => {
      const { error } = await supabase.from('profiles').update(updates).eq('user_id', userId);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['all-profiles'] }),
  });
}

// ─── ADMIN: ALL CITIES (including inactive) ───
export function useAllCities() {
  return useQuery({
    queryKey: ['all-cities'],
    queryFn: async () => {
      const { data, error } = await supabase.from('cities').select('*').order('name');
      if (error) throw error;
      return data || [];
    },
  });
}

// ─── FILE UPLOAD ───
export async function uploadFile(bucket: string, path: string, file: File) {
  const { data, error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true });
  if (error) throw error;
  const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(data.path);
  return urlData.publicUrl;
}

// ─── REALTIME CHAT SUBSCRIPTION ───
export function subscribeToChatMessages(orderId: string, callback: (msg: any) => void) {
  const channel = supabase
    .channel(`chat-${orderId}`)
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'chat_messages',
      filter: `order_id=eq.${orderId}`,
    }, (payload) => callback(payload.new))
    .subscribe();
  return () => { supabase.removeChannel(channel); };
}
