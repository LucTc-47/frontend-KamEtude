
-- Role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- User roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function for role checks
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  first_name TEXT NOT NULL DEFAULT '',
  last_name TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  phone TEXT DEFAULT '',
  role TEXT NOT NULL DEFAULT 'client',
  city TEXT DEFAULT '',
  avatar_url TEXT,
  verified BOOLEAN DEFAULT FALSE,
  banned BOOLEAN DEFAULT FALSE,
  university TEXT,
  faculty TEXT,
  level TEXT,
  bio TEXT,
  skills TEXT[] DEFAULT '{}',
  level_badge TEXT DEFAULT 'Débutant',
  xp INTEGER DEFAULT 0,
  next_level_xp INTEGER DEFAULT 100,
  completed_jobs INTEGER DEFAULT 0,
  rating NUMERIC(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  response_time TEXT,
  gps_lat DOUBLE PRECISION,
  gps_lng DOUBLE PRECISION,
  availability TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profiles viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Categories
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT '📦',
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categories viewable by everyone" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admins manage categories" ON public.categories FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Cities
CREATE TABLE public.cities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Cities viewable by everyone" ON public.cities FOR SELECT USING (true);
CREATE POLICY "Admins manage cities" ON public.cities FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Gigs
CREATE TABLE public.gigs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  location TEXT,
  rating NUMERIC(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  order_count INTEGER DEFAULT 0,
  badge TEXT,
  images TEXT[] DEFAULT '{}',
  active BOOLEAN DEFAULT TRUE,
  gps_lat DOUBLE PRECISION,
  gps_lng DOUBLE PRECISION,
  tier_basique JSONB NOT NULL DEFAULT '{"name":"Basique","price":0,"description":"","deliveryDays":1,"features":[]}',
  tier_standard JSONB NOT NULL DEFAULT '{"name":"Standard","price":0,"description":"","deliveryDays":3,"features":[]}',
  tier_premium JSONB NOT NULL DEFAULT '{"name":"Premium","price":0,"description":"","deliveryDays":7,"features":[]}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.gigs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Active gigs viewable by everyone" ON public.gigs FOR SELECT USING (true);
CREATE POLICY "Students manage own gigs" ON public.gigs FOR INSERT WITH CHECK (auth.uid() = student_id);
CREATE POLICY "Students update own gigs" ON public.gigs FOR UPDATE USING (auth.uid() = student_id);
CREATE POLICY "Students delete own gigs" ON public.gigs FOR DELETE USING (auth.uid() = student_id);

-- Orders
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gig_id UUID REFERENCES public.gigs(id) NOT NULL,
  gig_title TEXT NOT NULL,
  client_id UUID REFERENCES auth.users(id) NOT NULL,
  client_name TEXT NOT NULL DEFAULT '',
  student_id UUID REFERENCES auth.users(id) NOT NULL,
  student_name TEXT NOT NULL DEFAULT '',
  tier TEXT NOT NULL DEFAULT 'basique',
  description TEXT,
  budget NUMERIC(12,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending',
  revisions_left INTEGER DEFAULT 2,
  delivery_date TIMESTAMPTZ,
  escrow_amount NUMERIC(12,2) DEFAULT 0,
  payment_method TEXT DEFAULT 'mobile_money',
  deliverable_url TEXT,
  deliverable_note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Order participants can view" ON public.orders FOR SELECT USING (auth.uid() = client_id OR auth.uid() = student_id OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator'));
CREATE POLICY "Clients create orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = client_id);
CREATE POLICY "Participants update orders" ON public.orders FOR UPDATE USING (auth.uid() = client_id OR auth.uid() = student_id OR public.has_role(auth.uid(), 'moderator'));

-- Chat messages
CREATE TABLE public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES auth.users(id) NOT NULL,
  sender_name TEXT NOT NULL DEFAULT '',
  content TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'text',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Order participants can view messages" ON public.chat_messages FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.orders WHERE orders.id = chat_messages.order_id AND (orders.client_id = auth.uid() OR orders.student_id = auth.uid()))
  OR public.has_role(auth.uid(), 'moderator')
);
CREATE POLICY "Order participants can send messages" ON public.chat_messages FOR INSERT WITH CHECK (
  auth.uid() = sender_id AND EXISTS (SELECT 1 FROM public.orders WHERE orders.id = chat_messages.order_id AND (orders.client_id = auth.uid() OR orders.student_id = auth.uid()))
);

-- Reviews
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) NOT NULL,
  gig_id UUID REFERENCES public.gigs(id) NOT NULL,
  reviewer_id UUID REFERENCES auth.users(id) NOT NULL,
  reviewer_name TEXT NOT NULL DEFAULT '',
  student_id UUID REFERENCES auth.users(id) NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  text TEXT,
  reported BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Reviews viewable by everyone" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Authenticated users create reviews" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = reviewer_id);
CREATE POLICY "Admins manage reviews" ON public.reviews FOR UPDATE USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator'));

-- Disputes
CREATE TABLE public.disputes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) NOT NULL,
  gig_title TEXT,
  client_id UUID REFERENCES auth.users(id) NOT NULL,
  client_name TEXT DEFAULT '',
  client_statement TEXT,
  student_id UUID REFERENCES auth.users(id) NOT NULL,
  student_name TEXT DEFAULT '',
  student_statement TEXT,
  status TEXT NOT NULL DEFAULT 'open',
  moderator_id UUID REFERENCES auth.users(id),
  moderator_note TEXT,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.disputes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Dispute participants can view" ON public.disputes FOR SELECT USING (auth.uid() = client_id OR auth.uid() = student_id OR public.has_role(auth.uid(), 'moderator') OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Participants create disputes" ON public.disputes FOR INSERT WITH CHECK (auth.uid() = client_id OR auth.uid() = student_id);
CREATE POLICY "Moderators update disputes" ON public.disputes FOR UPDATE USING (public.has_role(auth.uid(), 'moderator') OR public.has_role(auth.uid(), 'admin'));

-- Verification requests
CREATE TABLE public.verification_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES auth.users(id) NOT NULL,
  student_name TEXT NOT NULL DEFAULT '',
  email TEXT,
  university TEXT,
  id_type TEXT DEFAULT 'cni',
  id_file_url TEXT,
  student_card_url TEXT,
  selfie_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.verification_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Students view own requests" ON public.verification_requests FOR SELECT USING (auth.uid() = student_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Students create requests" ON public.verification_requests FOR INSERT WITH CHECK (auth.uid() = student_id);
CREATE POLICY "Admins update requests" ON public.verification_requests FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_gigs_updated_at BEFORE UPDATE ON public.gigs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, first_name, last_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Realtime for chat
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;

-- Storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('identity-documents', 'identity-documents', false);
INSERT INTO storage.buckets (id, name, public) VALUES ('portfolio', 'portfolio', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('deliverables', 'deliverables', false);

-- Storage policies
CREATE POLICY "Users upload own identity docs" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'identity-documents' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users view own identity docs" ON storage.objects FOR SELECT USING (bucket_id = 'identity-documents' AND (auth.uid()::text = (storage.foldername(name))[1] OR public.has_role(auth.uid(), 'admin')));
CREATE POLICY "Portfolio publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'portfolio');
CREATE POLICY "Users upload own portfolio" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'portfolio' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users manage own portfolio" ON storage.objects FOR UPDATE USING (bucket_id = 'portfolio' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users manage own portfolio delete" ON storage.objects FOR DELETE USING (bucket_id = 'portfolio' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Order participants view deliverables" ON storage.objects FOR SELECT USING (bucket_id = 'deliverables' AND (auth.uid()::text = (storage.foldername(name))[1] OR public.has_role(auth.uid(), 'moderator')));
CREATE POLICY "Users upload deliverables" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'deliverables' AND auth.uid()::text = (storage.foldername(name))[1]);
