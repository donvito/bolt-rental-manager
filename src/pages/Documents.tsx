import React, { useState, useEffect, useRef } from 'react';
import { FileText, Search, Filter, Tag, Calendar, Building2, Users, Plus, Download, Archive, Edit } from 'lucide-react';
import { Document } from '../types';
import { DocumentEditModal } from '../components/DocumentEditModal';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

export function Documents() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState<any[]>([]);
  const [tenants, setTenants] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const { data: propertiesData, error: propertiesError } = await supabase
        .from('properties')
        .select('id, name');

      if (propertiesError) throw propertiesError;

      const { data: tenantsData, error: tenantsError } = await supabase
        .from('tenants')
        .select('id, name');

      if (tenantsError) throw tenantsError;

      setDocuments(data);
      setProperties(propertiesData);
      setTenants(tenantsData);
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast.error('Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = selectedType === 'all' || doc.type === selectedType;
    return matchesSearch && matchesType;
  });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setUploading(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('No authenticated user');
      
      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${userData.user.id}/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);
      
      if (uploadError) throw uploadError;
      
      // Get the public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);

      // Insert the new document record
      const { data: newDoc, error: insertError } = await supabase
        .from('documents')
        .insert([{
          title: file.name,
          type: 'other',
          file_url: publicUrl,
          status: 'active',
          tags: [],
          user_id: userData.user.id,
          uploaded_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (insertError) throw insertError;

      toast.success('Document uploaded successfully');
      fetchDocuments();
      setSelectedDocument(newDoc);
    } catch (error) {
      console.error('Error uploading document:', error);
      toast.error('Failed to upload document');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleEditDocument = (document: Document) => {
    setSelectedDocument(document);
  };

  const handleSaveDocument = async (updatedDocument: Document) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('No authenticated user');

      const documentData = {
        ...updatedDocument,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('documents')
        .update(documentData)
        .eq('id', updatedDocument.id);

      if (error) throw error;

      toast.success('Document updated successfully');
      fetchDocuments();
      setSelectedDocument(null);
    } catch (error) {
      console.error('Error updating document:', error);
      toast.error('Failed to update document');
    }
  };

  const getPropertyName = (propertyId?: string) => {
    if (!propertyId) return null;
    return properties.find(p => p.id === propertyId)?.name;
  };

  const getTenantName = (tenantId?: string) => {
    if (!tenantId) return null;
    return tenants.find(t => t.id === tenantId)?.name;
  };

  const getTypeColor = (type: string) => {
    const colors = {
      lease: 'bg-blue-100 text-blue-800',
      contract: 'bg-purple-100 text-purple-800',
      maintenance: 'bg-yellow-100 text-yellow-800',
      invoice: 'bg-green-100 text-green-800',
      other: 'bg-gray-100 text-gray-800'
    };
    return colors[type as keyof typeof colors] || colors.other;
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Documents</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage and organize all your property-related documents in one place.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            <Plus className={`w-4 h-4 mr-2 ${uploading ? 'animate-spin' : ''}`} />
            {uploading ? 'Uploading...' : 'Upload Document'}
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
            accept=".pdf,.doc,.docx,.txt"
          />
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
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-gray-400" />
          <select
            className="rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="lease">Lease</option>
            <option value="contract">Contract</option>
            <option value="maintenance">Maintenance</option>
            <option value="invoice">Invoice</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <div className="mt-8 grid gap-6">
        {filteredDocuments.map((document) => (
          <div key={document.id} className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <FileText className="h-6 w-6 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{document.title}</h3>
                    <div className="mt-1 flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(document.type)}`}>
                        {document.type}
                      </span>
                      <span className="text-sm text-gray-500">
                        <Calendar className="inline-block w-4 h-4 mr-1" />
                        {new Date(document.uploadedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditDocument(document)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <a
                    href={document.fileUrl}
                    className="text-gray-400 hover:text-gray-500"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Download className="h-5 w-5" />
                  </a>
                  <button className="text-gray-400 hover:text-gray-500">
                    <Archive className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {document.propertyId && (
                  <div className="flex items-center text-sm text-gray-500">
                    <Building2 className="w-4 h-4 mr-2" />
                    {getPropertyName(document.propertyId)}
                  </div>
                )}
                {document.tenantId && (
                  <div className="flex items-center text-sm text-gray-500">
                    <Users className="w-4 h-4 mr-2" />
                    {getTenantName(document.tenantId)}
                  </div>
                )}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {document.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                  >
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedDocument && (
        <DocumentEditModal
          document={selectedDocument}
          onClose={() => setSelectedDocument(null)}
          onSave={handleSaveDocument}
        />
      )}
    </div>
  );
}