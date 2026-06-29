-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: members
CREATE TABLE IF NOT EXISTS members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_number TEXT UNIQUE NOT NULL,
  membership_id TEXT UNIQUE,
  full_name TEXT NOT NULL,
  mobile TEXT UNIQUE NOT NULL,
  email TEXT,
  dob DATE NOT NULL,
  gender TEXT NOT NULL,
  epic_number TEXT UNIQUE NOT NULL,
  district TEXT NOT NULL,
  constituency TEXT NOT NULL,
  taluk TEXT NOT NULL,
  village TEXT NOT NULL,
  address TEXT NOT NULL,
  reason TEXT,
  photo_url TEXT,
  voter_front_url TEXT,
  voter_back_url TEXT,
  status TEXT DEFAULT 'Pending Approval', -- Pending Approval, Approved, Rejected
  approved_at TIMESTAMP WITH TIME ZONE,
  rejected_reason TEXT,
  qr_code_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: admins
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY, -- Links to auth.users.id
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: settings
CREATE TABLE IF NOT EXISTS settings (
  id INT PRIMARY KEY DEFAULT 1,
  logo_url TEXT,
  card_background TEXT,
  president_signature TEXT,
  organization_name TEXT DEFAULT 'OMK Tamil Nadu',
  website TEXT DEFAULT 'https://omktamilnadu.org',
  phone TEXT,
  footer_text TEXT DEFAULT '© OMK Tamil Nadu. All rights reserved.',
  president_name TEXT,
  address TEXT,
  facebook_url TEXT,
  twitter_url TEXT,
  instagram_url TEXT,
  youtube_url TEXT,
  registrations_enabled BOOLEAN DEFAULT true,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default settings row
INSERT INTO settings (id, organization_name) VALUES (1, 'OMK Tamil Nadu') ON CONFLICT (id) DO NOTHING;

-- RLS (Row Level Security) Configuration
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Allow public to INSERT into members (for registration)
CREATE POLICY "Allow public insert to members" ON members
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Allow public to SELECT approved members (for QR code verification)
CREATE POLICY "Allow public select approved members" ON members
  FOR SELECT
  TO public
  USING (status = 'Approved' OR status = 'Pending Approval'); -- For Success page checking by ID

-- Allow authenticated users (admins) all access to members
CREATE POLICY "Allow authenticated full access to members" ON members
  FOR ALL
  TO authenticated
  USING (true);

-- Allow public to SELECT settings
CREATE POLICY "Allow public select settings" ON settings
  FOR SELECT
  TO public
  USING (true);

-- Allow authenticated users to UPDATE settings
CREATE POLICY "Allow authenticated update settings" ON settings
  FOR UPDATE
  TO authenticated
  USING (true);

-- Storage: Create bucket for member documents
INSERT INTO storage.buckets (id, name, public) 
VALUES ('member_documents', 'member_documents', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies
-- Allow public to upload images (Insert)
CREATE POLICY "Allow public uploads" ON storage.objects
  FOR INSERT
  TO public
  WITH CHECK (bucket_id = 'member_documents');

-- Allow public to read images (so they can be displayed in admin dashboard/PDFs)
CREATE POLICY "Allow public read" ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'member_documents');

-- Allow authenticated users to manage images
CREATE POLICY "Allow admin manage images" ON storage.objects
  FOR ALL
  TO authenticated
  USING (bucket_id = 'member_documents');

-- --- PATCH SCRIPT ---
-- Run this in your Supabase SQL Editor to update the existing settings table
ALTER TABLE settings 
ADD COLUMN IF NOT EXISTS president_name TEXT,
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS facebook_url TEXT,
ADD COLUMN IF NOT EXISTS twitter_url TEXT,
ADD COLUMN IF NOT EXISTS instagram_url TEXT,
ADD COLUMN IF NOT EXISTS youtube_url TEXT,
ADD COLUMN IF NOT EXISTS registrations_enabled BOOLEAN DEFAULT true;

-- Table: audit_logs
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_email TEXT NOT NULL,
  action_type TEXT NOT NULL,
  description TEXT NOT NULL,
  target_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Allow public to insert audit logs (for demo/local without auth)
CREATE POLICY "Allow public insert to audit_logs" ON audit_logs
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Allow public to select audit logs (for demo/local without auth)
CREATE POLICY "Allow public select audit_logs" ON audit_logs
  FOR SELECT
  TO public
  USING (true);

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- --- SECURITY & SCALE PATCH ---
-- 1. High Concurrency Optimizations
CREATE INDEX IF NOT EXISTS idx_members_status ON members(status);
CREATE INDEX IF NOT EXISTS idx_members_membership_id ON members(membership_id);
CREATE INDEX IF NOT EXISTS idx_members_application_number ON members(application_number);

-- 2. Security Hardening: Drop the public SELECT policy to prevent data scraping
DROP POLICY IF EXISTS "Allow public select approved members" ON members;

-- 3. Secure RPC for ID Card Verification (Bypasses RLS safely for exact matches)
CREATE OR REPLACE FUNCTION get_member_by_id(p_id TEXT)
RETURNS SETOF members
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT * FROM members 
  WHERE membership_id = p_id OR application_number = p_id;
$$;

