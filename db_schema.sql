-- Enable UUID extension (optional but good practice, though we use text IDs here)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id text PRIMARY KEY,
  name text NOT NULL
);

-- 2. Services Table
CREATE TABLE IF NOT EXISTS services (
  id text PRIMARY KEY,
  name text NOT NULL,
  description text,
  price numeric NOT NULL,
  duration integer NOT NULL,
  category_id text REFERENCES categories(id),
  is_active boolean DEFAULT true
);

-- 3. Professionals Table
CREATE TABLE IF NOT EXISTS professionals (
  id text PRIMARY KEY,
  name text NOT NULL,
  role text NOT NULL,
  avatar text,
  bio text,
  services text[] -- Array of service IDs
);

-- 4. Appointments Table
CREATE TABLE IF NOT EXISTS appointments (
  id text PRIMARY KEY,
  client_name text NOT NULL,
  client_phone text NOT NULL,
  service_id text REFERENCES services(id),
  professional_id text REFERENCES professionals(id),
  date text NOT NULL, -- YYYY-MM-DD
  time text NOT NULL, -- HH:mm
  status text NOT NULL DEFAULT 'pending', -- pending, confirmed, cancelled
  reminder_sent boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now()
);

-- 5. Settings Table
CREATE TABLE IF NOT EXISTS settings (
  id text PRIMARY KEY,
  salon_name text,
  logo text,
  hero_title text,
  hero_subtitle text,
  hero_image text,
  services_title text,
  services_subtitle text,
  professionals_title text,
  professionals_subtitle text,
  about_title text,
  about_text text,
  about_image text,
  whatsapp_number text,
  address text,
  opening_hours jsonb,
  primary_color text,
  accent_color text
);

-- SEED DATA

-- Categories
INSERT INTO categories (id, name) VALUES
('cat1', 'Cabelo'),
('cat2', 'Unhas'),
('cat3', 'Maquiagem')
ON CONFLICT (id) DO NOTHING;

-- Services (Using Updated CVE Prices from db.ts)
INSERT INTO services (id, name, description, price, duration, category_id, is_active) VALUES
('srv1', 'Corte e Escova', 'Corte personalizado e finalização perfeita.', 3000, 60, 'cat1', true),
('srv2', 'Manicure Completa', 'Cuidado completo para suas mãos.', 1000, 45, 'cat2', true),
('srv3', 'Maquiagem Social', 'Para eventos especiais e festas.', 4000, 60, 'cat3', true),
('srv4', 'Hidratação Profunda', 'Recupere o brilho e maciez dos fios.', 2400, 45, 'cat1', true)
ON CONFLICT (id) DO NOTHING;

-- Professionals
INSERT INTO professionals (id, name, role, avatar, bio, services) VALUES
('pro1', 'Ana Silva', 'Hair Stylist', 'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?auto=format&fit=crop&q=80&w=400', 'Especialista em cortes modernos e coloração.', ARRAY['srv1', 'srv4']),
('pro2', 'Julia Costa', 'Nail Designer', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400', 'Apaixonada por unhas perfeitas e arte.', ARRAY['srv2']),
('pro3', 'Mariana Santos', 'Makeup Artist', 'https://images.unsplash.com/photo-1588731238444-43836afd7963?auto=format&fit=crop&q=80&w=400', 'Realçando sua beleza natural para qualquer ocasião.', ARRAY['srv3'])
ON CONFLICT (id) DO NOTHING;

-- Settings
INSERT INTO settings (
  id, salon_name, logo, hero_title, hero_subtitle, hero_image,
  services_title, services_subtitle, professionals_title, professionals_subtitle,
  about_title, about_text, about_image, whatsapp_number, address,
  opening_hours, primary_color, accent_color
) VALUES (
  'main',
  'Glow Beauty Studio',
  '✨',
  'Realce sua Beleza Natural',
  'Agende seu momento de cuidado com os melhores profissionais da região.',
  'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=1200',
  'Serviços Exclusivos',
  'Oferecemos o que há de melhor em tratamentos de beleza, com produtos premium e técnicas modernas.',
  'Nossa Equipe',
  'Especialistas apaixonados por elevar sua autoestima e realçar sua beleza única.',
  'Conforto e Estilo em cada detalhe',
  'Focamos na sua experiência completa, desde o café até o resultado final. Nossa missão é elevar sua autoestima.',
  'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=800',
  '5511999999999',
  'Rua das Flores, 123 - Centro, São Paulo',
  '{"Segunda - Sexta": "09:00 - 19:00", "Sábado": "09:00 - 17:00", "Domingo": "Fechado"}',
  'rose-500',
  'rose-100'
)
ON CONFLICT (id) DO NOTHING;
