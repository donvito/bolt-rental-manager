export interface Property {
  id: string;
  name: string;
  address: string;
  type: 'apartment' | 'house' | 'condo';
  bedrooms: number;
  bathrooms: number;
  rent: number;
  status: 'available' | 'rented' | 'maintenance';
  last_payment_date?: string;
  maintenance_requests?: MaintenanceRequest[];
}

export interface MaintenanceRequest {
  id: string;
  property_id: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  created_at: string;
  updated_at: string;
}

export interface Tenant {
  id: string;
  name: string;
  email: string;
  phone: string;
  lease_start: string;
  lease_end: string;
  property_id: string;
}

export interface Document {
  id: string;
  title: string;
  type: 'lease' | 'contract' | 'maintenance' | 'invoice' | 'other';
  property_id?: string;
  tenant_id?: string;
  file_url: string;
  uploaded_at: string;
  status: 'active' | 'archived';
  tags: string[];
}

export const MOCK_PROPERTIES: Property[] = [
  {
    id: '1',
    name: 'Sunset Apartments 3B',
    address: '123 Maple Street, Springfield, IL',
    type: 'apartment',
    bedrooms: 2,
    bathrooms: 1,
    rent: 1200,
    status: 'available',
    image_url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800',
    maintenance_requests: [],
  },
  {
    id: '2',
    name: 'Oakwood House',
    address: '456 Oak Avenue, Springfield, IL',
    type: 'house',
    bedrooms: 3,
    bathrooms: 2,
    rent: 2000,
    status: 'rented',
    image_url: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800',
    last_payment_date: '2024-02-15',
    maintenance_requests: [
      {
        id: '1',
        property_id: '2',
        description: 'Leaking faucet in master bathroom',
        status: 'pending',
        priority: 'medium',
        created_at: '2024-02-20T10:00:00Z',
        updated_at: '2024-02-20T10:00:00Z',
      }
    ],
  },
];

export const MOCK_TENANTS: Tenant[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    phone: '(555) 123-4567',
    leaseStart: '2024-01-01',
    leaseEnd: '2024-12-31',
    propertyId: '2',
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'michael.c@email.com',
    phone: '(555) 987-6543',
    leaseStart: '2024-02-01',
    leaseEnd: '2025-01-31',
    propertyId: '1',
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    email: 'emily.r@email.com',
    phone: '(555) 456-7890',
    leaseStart: '2024-03-01',
    leaseEnd: '2025-02-28',
    propertyId: '2',
  },
];

export const MOCK_DOCUMENTS: Document[] = [
  {
    id: '1',
    title: 'Lease Agreement - Oakwood House',
    type: 'lease',
    propertyId: '2',
    tenantId: '1',
    fileUrl: 'https://example.com/lease-agreement.pdf',
    uploadedAt: '2024-01-01T10:00:00Z',
    status: 'active',
    tags: ['lease', '2024'],
  },
  {
    id: '2',
    title: 'Maintenance Report - Plumbing',
    type: 'maintenance',
    propertyId: '2',
    fileUrl: 'https://example.com/maintenance-report.pdf',
    uploadedAt: '2024-02-20T15:30:00Z',
    status: 'active',
    tags: ['maintenance', 'plumbing'],
  },
  {
    id: '3',
    title: 'Insurance Policy',
    type: 'contract',
    fileUrl: 'https://example.com/insurance-policy.pdf',
    uploadedAt: '2024-01-15T09:00:00Z',
    status: 'active',
    tags: ['insurance', 'policy'],
  },
];