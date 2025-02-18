import React, { useState, useEffect } from 'react';
import { Building2, Users, DollarSign, Wrench, TrendingUp, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { PropertyCard } from '../components/PropertyCard';
import { TenantList } from '../components/TenantList';
import { PropertyEditModal } from '../components/PropertyEditModal';
import { Property } from '../types';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

export function Dashboard() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [tenants, setTenants] = useState<any[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: propertiesData, error: propertiesError } = await supabase
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
        `);

      if (propertiesError) throw propertiesError;

      const { data: tenantsData, error: tenantsError } = await supabase
        .from('tenants')
        .select('*');

      if (tenantsError) throw tenantsError;

      setProperties(propertiesData);
      setTenants(tenantsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const totalRent = properties.reduce((sum, prop) => sum + prop.rent, 0);
  const occupiedProperties = properties.filter(p => p.status === 'rented').length;
  const occupancyRate = (occupiedProperties / properties.length) * 100;
  const maintenanceCount = properties.reduce(
    (sum, prop) => sum + (prop.maintenance_requests?.length || 0),
    0
  );
  const urgentMaintenanceCount = properties.reduce(
    (sum, prop) => sum + (prop.maintenance_requests?.filter(r => r.priority === 'high')?.length || 0),
    0
  );

  const handleEditProperty = (property: Property) => {
    setSelectedProperty(property);
  };

  const handleSaveProperty = async (updatedProperty: Property) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('No authenticated user');

      const propertyData = {
        ...updatedProperty,
        user_id: userData.user.id
      };

      // Remove fields not in the database schema
      delete (propertyData as any).maintenance_requests;

      const { error } = await supabase
        .from('properties')
        .update(propertyData)
        .eq('id', updatedProperty.id);

      if (error) throw error;

      toast.success('Property updated successfully');
      fetchData();
      setSelectedProperty(null);
    } catch (error) {
      console.error('Error updating property:', error);
      toast.error('Failed to update property');
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
    <div className="px-4 py-6 sm:px-6 lg:px-8 space-y-8">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="stat-card bg-gradient-to-br from-indigo-500 to-indigo-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-100">Total Properties</p>
              <h3 className="text-3xl font-bold mt-2">{properties.length}</h3>
            </div>
            <div className="bg-white/20 p-3 rounded-full">
              <Building2 className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-indigo-100">
            <TrendingUp className="h-4 w-4 mr-1" />
            <span className="text-sm">
              {occupancyRate.toFixed(1)}% occupied
            </span>
          </div>
        </div>

        <div className="stat-card bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Monthly Revenue</p>
              <h3 className="text-3xl font-bold mt-2">${totalRent.toLocaleString()}</h3>
            </div>
            <div className="bg-white/20 p-3 rounded-full">
              <DollarSign className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-green-100">
            <CheckCircle2 className="h-4 w-4 mr-1" />
            <span className="text-sm">
              {occupiedProperties} paying tenants
            </span>
          </div>
        </div>

        <div className="stat-card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Active Tenants</p>
              <h3 className="text-3xl font-bold mt-2">{occupiedProperties}</h3>
            </div>
            <div className="bg-white/20 p-3 rounded-full">
              <Users className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-blue-100">
            <Clock className="h-4 w-4 mr-1" />
            <span className="text-sm">
              {properties.length - occupiedProperties} units available
            </span>
          </div>
        </div>

        <div className="stat-card bg-gradient-to-br from-amber-500 to-amber-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-100">Maintenance</p>
              <h3 className="text-3xl font-bold mt-2">{maintenanceCount}</h3>
            </div>
            <div className="bg-white/20 p-3 rounded-full">
              <Wrench className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-amber-100">
            <AlertTriangle className="h-4 w-4 mr-1" />
            <span className="text-sm">
              {urgentMaintenanceCount} urgent requests
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Building2 className="w-7 h-7 text-indigo-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900">Recent Properties</h2>
            </div>
            <span className="text-sm text-gray-500">
              Showing {Math.min(4, properties.length)} of {properties.length}
            </span>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {properties.slice(0, 4).map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onEdit={handleEditProperty}
              />
            ))}
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Users className="w-7 h-7 text-indigo-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900">Current Tenants</h2>
            </div>
            <span className="text-sm text-gray-500">
              {tenants.length} total tenants
            </span>
          </div>
          <TenantList tenants={tenants} properties={properties} />
        </div>
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