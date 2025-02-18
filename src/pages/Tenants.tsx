import React, { useState, useEffect } from 'react';
import { Users, Search, SlidersHorizontal, Mail, Phone, Calendar, Building2, Edit, PlusCircle, Trash2 } from 'lucide-react';
import { Tenant } from '../types';
import { TenantEditModal } from '../components/TenantEditModal';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

export function Tenants() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);
  const [deletingTenant, setDeletingTenant] = useState<Tenant | null>(null);

  const handleAddTenant = async () => {
    const newTenant = {
      name: '',
      email: '',
      phone: '',
      lease_start: new Date().toISOString().split('T')[0],
      lease_end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      property_id: '',
    };
    setSelectedTenant(newTenant as Tenant);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: tenantsData, error: tenantsError } = await supabase
        .from('tenants')
        .select('*')
        .order('created_at', { ascending: false });

      if (tenantsError) throw tenantsError;

      const { data: propertiesData, error: propertiesError } = await supabase
        .from('properties')
        .select('id, name');

      if (propertiesError) throw propertiesError;

      setTenants(tenantsData);
      setProperties(propertiesData);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load tenants');
    } finally {
      setLoading(false);
    }
  };

  const filteredTenants = tenants.filter(tenant =>
    tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditTenant = (tenant: Tenant) => {
    setSelectedTenant(tenant);
  };

  const handleDeleteClick = (tenant: Tenant) => {
    setDeletingTenant(tenant);
  };

  const handleConfirmDelete = async () => {
    if (!deletingTenant) return;

    try {
      const { error } = await supabase
        .from('tenants')
        .delete()
        .eq('id', deletingTenant.id);

      if (error) throw error;

      toast.success('Tenant deleted successfully');
      fetchData();
    } catch (error) {
      console.error('Error deleting tenant:', error);
      toast.error('Failed to delete tenant');
    } finally {
      setDeletingTenant(null);
    }
  };

  const handleSaveTenant = async (updatedTenant: Tenant) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('No authenticated user');

      let error;
      if (updatedTenant.id) {
        // Update existing tenant
        const tenantData = {
          ...updatedTenant,
          user_id: userData.user.id,
          updated_at: new Date().toISOString()
        };

        const { error: updateError } = await supabase
          .from('tenants')
          .update(tenantData)
          .eq('id', updatedTenant.id);
        error = updateError;
      } else {
        // Create new tenant
        const { id, created_at, updated_at, ...newTenantData } = updatedTenant;
        const { error: insertError } = await supabase
          .from('tenants')
          .insert([{
            ...newTenantData,
            user_id: userData.user.id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }]);
        error = insertError;
      }

      if (error) throw error;

      toast.success(updatedTenant.id ? 'Tenant updated successfully' : 'Tenant added successfully');
      fetchData();
      setSelectedTenant(null);
    } catch (error) {
      console.error('Error saving tenant:', error);
      toast.error('Failed to save tenant');
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
          <h1 className="text-2xl font-semibold text-gray-900">Tenants</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage your tenants, view lease details, and track contact information.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            onClick={handleAddTenant}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Add tenant
          </button>
        </div>
      </div>

      <div className="mt-8">
        <div className="relative flex-grow max-w-lg mb-6">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full rounded-md border-gray-300 pl-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Search tenants..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTenants.map((tenant) => {
            const property = properties.find(p => p.id === tenant.property_id);
            return (
              <div key={tenant.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{tenant.name}</h3>
                      <p className="text-sm text-gray-500 flex items-center mt-1">
                        <Building2 className="w-4 h-4 mr-1" />
                        {property?.name}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditTenant(tenant)}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(tenant)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="text-sm text-gray-600">
                      <Calendar className="w-4 h-4 inline-block mr-2" />
                      <div className="ml-6 space-y-1">
                        <div>Start: {new Date(tenant.lease_start).toLocaleDateString()}</div>
                        <div>End: {new Date(tenant.lease_end).toLocaleDateString()}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedTenant && (
        <TenantEditModal
          tenant={selectedTenant}
          onClose={() => setSelectedTenant(null)}
          onSave={handleSaveTenant}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deletingTenant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Delete Tenant</h3>
            <p className="text-sm text-gray-500 mb-4">
              Are you sure you want to delete {deletingTenant.name}? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setDeletingTenant(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}