-- Create role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  UNIQUE (user_id, role)
);

-- Create product categories enum
CREATE TYPE public.product_category AS ENUM ('streaming', 'editing', 'digital_tools');

-- Create products table
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  description TEXT,
  short_description TEXT,
  category product_category NOT NULL DEFAULT 'streaming',
  image_url TEXT,
  duration TEXT,
  benefits TEXT[],
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order status enum
CREATE TYPE public.order_status AS ENUM ('pending', 'processing', 'completed', 'cancelled');

-- Create orders table
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  status order_status NOT NULL DEFAULT 'pending',
  total_price DECIMAL(10,2) NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- User roles policies
CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Products policies (public read, admin write)
CREATE POLICY "Anyone can view products"
  ON public.products FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage products"
  ON public.products FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Orders policies
CREATE POLICY "Users can view own orders"
  ON public.orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own orders"
  ON public.orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all orders"
  ON public.orders FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update all orders"
  ON public.orders FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete orders"
  ON public.orders FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.email
  );
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;

-- Trigger for new user
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample products
INSERT INTO public.products (name, price, description, short_description, category, duration, benefits, is_featured) VALUES
('Netflix Pro', 49000, 'Netflix Pro adalah layanan streaming premium yang memberikan akses penuh ke ribuan film dan series tanpa batas. Cocok untuk kamu yang ingin hiburan berkualitas dengan harga hemat. Nikmati konten eksklusif Netflix Original, film blockbuster terbaru, dan series yang sedang trending. Streaming tanpa iklan dengan kualitas hingga 4K Ultra HD.', 'Akses penuh Netflix Premium dengan harga terjangkau', 'streaming', '1 Bulan', ARRAY['Akses semua konten Netflix', 'Kualitas 4K Ultra HD', 'Tanpa iklan', 'Multi-device support', 'Garansi full periode'], true),
('CapCut Pro', 35000, 'CapCut Pro memberikan akses ke semua fitur premium editor video terpopuler. Unlock semua efek, filter, musik, dan template premium untuk membuat konten yang lebih profesional. Perfect untuk content creator, editor video, dan siapa saja yang ingin membuat video berkualitas tinggi.', 'Unlock semua fitur premium CapCut', 'editing', '1 Bulan', ARRAY['Akses semua efek premium', 'Template eksklusif', 'Musik tanpa watermark', 'Export kualitas tinggi', 'Cloud storage'], true),
('Spotify Premium', 25000, 'Nikmati musik tanpa batas dengan Spotify Premium. Streaming jutaan lagu tanpa iklan, download untuk offline listening, dan kualitas audio terbaik. Perfect untuk music lovers yang ingin pengalaman mendengarkan musik tanpa gangguan.', 'Musik tanpa batas, tanpa iklan', 'streaming', '1 Bulan', ARRAY['Streaming tanpa iklan', 'Download offline', 'Audio berkualitas tinggi', 'Skip unlimited', 'Lirik real-time'], false),
('Canva Pro', 45000, 'Canva Pro memberikan akses ke jutaan template premium, elemen desain, dan fitur advanced untuk membuat desain profesional. Cocok untuk designer, marketer, dan entrepreneur yang ingin membuat visual stunning.', 'Desain profesional dalam hitungan menit', 'editing', '1 Bulan', ARRAY['Jutaan template premium', 'Brand kit', 'Magic resize', 'Background remover', 'Content planner'], false);