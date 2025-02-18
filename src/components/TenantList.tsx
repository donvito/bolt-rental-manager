import React from 'react';
import { Mail, Phone, Calendar } from 'lucide-react';
import { Tenant, Property } from '../types';

interface TenantListProps {
  tenants: Tenant[];
  properties: Property[];
}

export function TenantList({ tenants, properties }: TenantListProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="divide-y divide-gray-200">
        {tenants.map((tenant) => {
          const property = properties.find((p) => p.id === tenant.property_id);
          return (
            <div key={tenant.id} className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-md font-medium text-gray-900">
                  {tenant.name}
                </h3>
                <span className="text-sm text-gray-600">{property?.name}</span>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <p className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  {tenant.email}
                </p>
                <p className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  {tenant.phone}
                </p>
                <p className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  {new Date(tenant.lease_start).toLocaleDateString()} -{' '}
                  {new Date(tenant.lease_end).toLocaleDateString()}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}