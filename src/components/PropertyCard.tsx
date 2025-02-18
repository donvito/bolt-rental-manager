import React from 'react';
import { Home, Bed, Bath, DollarSign, PenTool as Tool, Calendar, Edit } from 'lucide-react';
import { Property } from '../types';

interface PropertyCardProps {
  property: Property;
  onEdit: (property: Property) => void;
}

export function PropertyCard({ property, onEdit }: PropertyCardProps) {
  const statusColors = {
    available: 'bg-green-100 text-green-800',
    rented: 'bg-blue-100 text-blue-800',
    maintenance: 'bg-yellow-100 text-yellow-800',
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img
        src={property.image_url}
        alt={property.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4 space-y-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900">{property.name}</h3>
          <button
            onClick={() => onEdit(property)}
            className="text-gray-600 hover:text-gray-900"
          >
            <Edit className="w-4 h-4" />
          </button>
        </div>
        <div className="flex justify-between items-center">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              statusColors[property.status]
            }`}
          >
            {property.status}
          </span>
          {property.last_payment_date && (
            <span className="text-sm text-gray-600 flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              Last paid: {new Date(property.last_payment_date).toLocaleDateString()}
            </span>
          )}
        </div>
        <p className="text-gray-600 text-sm mb-4 flex items-center">
          <Home className="w-4 h-4 mr-1" />
          {property.address}
        </p>
        <div className="flex justify-between items-center">
          <div className="flex space-x-4">
            <span className="flex items-center text-gray-600">
              <Bed className="w-4 h-4 mr-1" />
              {property.bedrooms}
            </span>
            <span className="flex items-center text-gray-600">
              <Bath className="w-4 h-4 mr-1" />
              {property.bathrooms}
            </span>
          </div>
          <span className="flex items-center text-gray-900 font-semibold">
            <DollarSign className="w-4 h-4" />
            {property.rent.toLocaleString()}
          </span>
        </div>
        {property.maintenance_requests && property.maintenance_requests.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center text-gray-600">
                <Tool className="w-4 h-4 mr-1" />
                Maintenance Requests
              </span>
              <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                {property.maintenance_requests.length} pending
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}