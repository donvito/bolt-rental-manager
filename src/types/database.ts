export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      properties: {
        Row: {
          id: string
          name: string
          address: string
          type: 'apartment' | 'house' | 'condo'
          bedrooms: number
          bathrooms: number
          rent: number
          status: 'available' | 'rented' | 'maintenance'
          image_url: string
          last_payment_date: string | null
          created_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          id?: string
          name: string
          address: string
          type: 'apartment' | 'house' | 'condo'
          bedrooms: number
          bathrooms: number
          rent: number
          status?: 'available' | 'rented' | 'maintenance'
          image_url: string
          last_payment_date?: string | null
          created_at?: string
          updated_at?: string
          user_id?: string
        }
        Update: {
          id?: string
          name?: string
          address?: string
          type?: 'apartment' | 'house' | 'condo'
          bedrooms?: number
          bathrooms?: number
          rent?: number
          status?: 'available' | 'rented' | 'maintenance'
          image_url?: string
          last_payment_date?: string | null
          created_at?: string
          updated_at?: string
          user_id?: string
        }
      }
      tenants: {
        Row: {
          id: string
          name: string
          email: string
          phone: string
          lease_start: string
          lease_end: string
          property_id: string | null
          created_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone: string
          lease_start: string
          lease_end: string
          property_id?: string | null
          created_at?: string
          updated_at?: string
          user_id?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string
          lease_start?: string
          lease_end?: string
          property_id?: string | null
          created_at?: string
          updated_at?: string
          user_id?: string
        }
      }
      maintenance_requests: {
        Row: {
          id: string
          property_id: string
          description: string
          status: 'pending' | 'in-progress' | 'completed'
          priority: 'low' | 'medium' | 'high'
          created_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          id?: string
          property_id: string
          description: string
          status?: 'pending' | 'in-progress' | 'completed'
          priority?: 'low' | 'medium' | 'high'
          created_at?: string
          updated_at?: string
          user_id?: string
        }
        Update: {
          id?: string
          property_id?: string
          description?: string
          status?: 'pending' | 'in-progress' | 'completed'
          priority?: 'low' | 'medium' | 'high'
          created_at?: string
          updated_at?: string
          user_id?: string
        }
      }
      documents: {
        Row: {
          id: string
          title: string
          type: 'lease' | 'contract' | 'maintenance' | 'invoice' | 'other'
          property_id: string | null
          tenant_id: string | null
          file_url: string
          status: 'active' | 'archived'
          tags: string[]
          uploaded_at: string
          created_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          id?: string
          title: string
          type: 'lease' | 'contract' | 'maintenance' | 'invoice' | 'other'
          property_id?: string | null
          tenant_id?: string | null
          file_url: string
          status?: 'active' | 'archived'
          tags?: string[]
          uploaded_at?: string
          created_at?: string
          updated_at?: string
          user_id?: string
        }
        Update: {
          id?: string
          title?: string
          type?: 'lease' | 'contract' | 'maintenance' | 'invoice' | 'other'
          property_id?: string | null
          tenant_id?: string | null
          file_url?: string
          status?: 'active' | 'archived'
          tags?: string[]
          uploaded_at?: string
          created_at?: string
          updated_at?: string
          user_id?: string
        }
      }
    }
    Functions: {
      initialize_user_data: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
  }
}