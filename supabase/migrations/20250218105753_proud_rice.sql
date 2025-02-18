/*
  # Initial schema for rental manager

  1. Tables
    - properties
      - id (uuid, primary key)
      - name (text)
      - address (text)
      - type (text)
      - bedrooms (integer)
      - bathrooms (numeric)
      - rent (numeric)
      - status (text)
      - image_url (text)
      - last_payment_date (timestamptz)
      - created_at (timestamptz)
      - updated_at (timestamptz)
      - user_id (uuid, foreign key)

    - tenants
      - id (uuid, primary key)
      - name (text)
      - email (text)
      - phone (text)
      - lease_start (date)
      - lease_end (date)
      - property_id (uuid, foreign key)
      - created_at (timestamptz)
      - updated_at (timestamptz)
      - user_id (uuid, foreign key)

    - maintenance_requests
      - id (uuid, primary key)
      - property_id (uuid, foreign key)
      - description (text)
      - status (text)
      - priority (text)
      - created_at (timestamptz)
      - updated_at (timestamptz)
      - user_id (uuid, foreign key)

    - documents
      - id (uuid, primary key)
      - title (text)
      - type (text)
      - property_id (uuid, foreign key)
      - tenant_id (uuid, foreign key)
      - file_url (text)
      - status (text)
      - tags (text[])
      - uploaded_at (timestamptz)
      - created_at (timestamptz)
      - updated_at (timestamptz)
      - user_id (uuid, foreign key)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Create enum types
CREATE TYPE property_type AS ENUM ('apartment', 'house', 'condo');
CREATE TYPE property_status AS ENUM ('available', 'rented', 'maintenance');
CREATE TYPE maintenance_status AS ENUM ('pending', 'in-progress', 'completed');
CREATE TYPE maintenance_priority AS ENUM ('low', 'medium', 'high');
CREATE TYPE document_type AS ENUM ('lease', 'contract', 'maintenance', 'invoice', 'other');
CREATE TYPE document_status AS ENUM ('active', 'archived');

-- Create properties table
CREATE TABLE properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text NOT NULL,
  type property_type NOT NULL,
  bedrooms integer NOT NULL,
  bathrooms numeric NOT NULL,
  rent numeric NOT NULL,
  status property_status NOT NULL DEFAULT 'available',
  image_url text NOT NULL,
  last_payment_date timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create tenants table
CREATE TABLE tenants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  lease_start date NOT NULL,
  lease_end date NOT NULL,
  property_id uuid REFERENCES properties(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create maintenance_requests table
CREATE TABLE maintenance_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  description text NOT NULL,
  status maintenance_status NOT NULL DEFAULT 'pending',
  priority maintenance_priority NOT NULL DEFAULT 'medium',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create documents table
CREATE TABLE documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  type document_type NOT NULL,
  property_id uuid REFERENCES properties(id) ON DELETE SET NULL,
  tenant_id uuid REFERENCES tenants(id) ON DELETE SET NULL,
  file_url text NOT NULL,
  status document_status NOT NULL DEFAULT 'active',
  tags text[] DEFAULT ARRAY[]::text[],
  uploaded_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Enable Row Level Security
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their own properties"
  ON properties
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their own tenants"
  ON tenants
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their own maintenance requests"
  ON maintenance_requests
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their own documents"
  ON documents
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON properties
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_tenants_updated_at
  BEFORE UPDATE ON tenants
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_maintenance_requests_updated_at
  BEFORE UPDATE ON maintenance_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_documents_updated_at
  BEFORE UPDATE ON documents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();