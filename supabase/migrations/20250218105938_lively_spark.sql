/*
  # Seed data for rental manager

  This migration adds sample data for testing and development.
  The data is inserted using a function to ensure proper user_id handling.
*/

-- Create a function to insert sample data for a specific user
CREATE OR REPLACE FUNCTION insert_sample_data_for_user(user_uuid uuid)
RETURNS void AS $$
DECLARE
  property_id_1 uuid;
  property_id_2 uuid;
  tenant_id uuid;
BEGIN
  -- Insert sample properties
  INSERT INTO properties (
    id,
    name,
    address,
    type,
    bedrooms,
    bathrooms,
    rent,
    status,
    image_url,
    user_id
  ) VALUES (
    gen_random_uuid(),
    'Sunset Apartments 3B',
    '123 Maple Street, Springfield, IL',
    'apartment',
    2,
    1,
    1200,
    'available',
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800',
    user_uuid
  ) RETURNING id INTO property_id_1;

  INSERT INTO properties (
    id,
    name,
    address,
    type,
    bedrooms,
    bathrooms,
    rent,
    status,
    image_url,
    user_id
  ) VALUES (
    gen_random_uuid(),
    'Oakwood House',
    '456 Oak Avenue, Springfield, IL',
    'house',
    3,
    2,
    2000,
    'rented',
    'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800',
    user_uuid
  ) RETURNING id INTO property_id_2;

  -- Insert sample tenant
  INSERT INTO tenants (
    id,
    name,
    email,
    phone,
    lease_start,
    lease_end,
    property_id,
    user_id
  ) VALUES (
    gen_random_uuid(),
    'Sarah Johnson',
    'sarah.j@email.com',
    '(555) 123-4567',
    '2024-01-01',
    '2024-12-31',
    property_id_2,
    user_uuid
  ) RETURNING id INTO tenant_id;

  -- Insert sample maintenance request
  INSERT INTO maintenance_requests (
    id,
    property_id,
    description,
    status,
    priority,
    user_id
  ) VALUES (
    gen_random_uuid(),
    property_id_2,
    'Leaking faucet in master bathroom',
    'pending',
    'medium',
    user_uuid
  );

  -- Insert sample document
  INSERT INTO documents (
    id,
    title,
    type,
    property_id,
    tenant_id,
    file_url,
    status,
    tags,
    user_id
  ) VALUES (
    gen_random_uuid(),
    'Lease Agreement - Oakwood House',
    'lease',
    property_id_2,
    tenant_id,
    'https://example.com/lease-agreement.pdf',
    'active',
    ARRAY['lease', '2024'],
    user_uuid
  );
END;
$$ LANGUAGE plpgsql;

-- Create a secure function that can be called by the authenticated user
CREATE OR REPLACE FUNCTION initialize_user_data()
RETURNS void AS $$
BEGIN
  -- Call the sample data insertion function with the current user's ID
  PERFORM insert_sample_data_for_user(auth.uid());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;