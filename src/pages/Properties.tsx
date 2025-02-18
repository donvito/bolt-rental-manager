import React, { useState, useEffect } from 'react';
import { Building2, Search, SlidersHorizontal } from 'lucide-react';
import { PropertyCard } from '../components/PropertyCard';
import { PropertyEditModal } from '../components/PropertyEditModal';
import { Property } from '../types';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

export function Properties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          maintenance_requests (
            id,
            description,
            status,
            priority,
            created_at,
            updated_at
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setProperties(data);
    } catch (error) {
      console.error('Error fetching properties:', error);
      toast.error('Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || property.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleEditProperty = (property: Property) => {
    setSelectedProperty(property);
  };

  const handleSaveProperty = async (updatedProperty: Property) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('No authenticated user');

      const propertyData = {
        ...updatedProperty,
        user_id: userData.user.id,
        updated_at: new Date().toISOString()
      };

      // Remove any fields not in the database schema
      delete (propertyData as any).maintenance_requests;

      const { error } = await supabase
        .from('properties')
        .update(propertyData)
        .eq('id', updatedProperty.id);

      if (error) throw error;

      toast.success('Property updated successfully');
      fetchProperties();
      setSelectedProperty(null);
    } catch (error) {
      console.error('Error updating property:', error);
      toast.error('Failed to update property');
    }
  };

  const handleAddProperty = async () => {
    const newProperty = {
      name: 'New Property',
      address: '',
      type: 'apartment' as const,
      bedrooms: 1,
      bathrooms: 1,
      rent: 0,
      status: 'available' as const,
      image_url: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800',
      last_payment_date: null
    };

    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('No authenticated user');

      const { data, error } = await supabase
        .from('properties')
        .insert([{ ...newProperty, user_id: userData.user.id }])
        .select('*').single();

      if (error) throw error;

      toast.success('Property created successfully');
      setSelectedProperty(data);
      fetchProperties();
    } catch (error) {
      console.error('Error creating property:', error);
      toast.error('Failed to create property');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Properties</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage your rental properties, view details, and track maintenance requests.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            onClick={handleAddProperty}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            Add property
          </button>
        </div>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full rounded-md border-gray-300 pl-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Search properties..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5 text-gray-400" />
          <select
            className="rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="rented">Rented</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredProperties.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            onEdit={handleEditProperty}
          />
        ))}
      </div>

      {selectedProperty && (
        <PropertyEditModal
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
          onSave={handleSaveProperty}
        />
      )}
    </div>
  );
}