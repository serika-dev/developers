'use client';

import React, { useEffect, useState } from 'react';
import { 
  getApiKeys, 
  createApiKey, 
  deleteApiKey, 
  enableApiKey, 
  disableApiKey, 
  regenerateApiKey,
  updateApiKeyPermissions,
} from '@/app/services/api';
import DashboardLayout from '@/app/components/layout/DashboardLayout';
import Card from '@/app/components/ui/Card';
import { APIKey } from '@/app/types';
import { 
  KeyIcon, 
  TrashIcon, 
  PencilIcon, 
  ClipboardIcon, 
  EyeIcon, 
  EyeSlashIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import { Toaster, toast } from 'sonner';

export default function ApiKeysPage() {
  const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [newKeyName, setNewKeyName] = useState('');
  const [showingKey, setShowingKey] = useState<string | null>(null);
  const [editingPermissions, setEditingPermissions] = useState<string | null>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const permissionOptions = [
    { id: 'image_generation', name: 'Image Generation' },
    { id: 'text_generation', name: 'Text Generation' },
    { id: 'user_info', name: 'User Information' },
    { id: 'character_info', name: 'Character Information' },
  ];

  const fetchApiKeys = async () => {
    try {
      setLoading(true);
      const data = await getApiKeys();
      setApiKeys(data);
    } catch (error) {
      console.error('Error fetching API keys:', error);
      toast.error('Failed to fetch API keys');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApiKeys();
  }, []);

  const handleCreateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) {
      toast.error('Please enter a name for the API key');
      return;
    }

    try {
      const newKey = await createApiKey(newKeyName.trim());
      setApiKeys([newKey, ...apiKeys]);
      setNewKeyName('');
      setShowingKey(newKey._id);
      toast.success('API key created successfully');
    } catch (error) {
      console.error('Error creating API key:', error);
      toast.error('Failed to create API key');
    }
  };

  const handleDeleteKey = async (id: string) => {
    if (!confirm('Are you sure you want to delete this API key? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteApiKey(id);
      setApiKeys(apiKeys.filter(key => key._id !== id));
      toast.success('API key deleted successfully');
    } catch (error) {
      console.error('Error deleting API key:', error);
      toast.error('Failed to delete API key');
    }
  };

  const handleToggleKeyActive = async (id: string, currentlyActive: boolean) => {
    try {
      if (currentlyActive) {
        await disableApiKey(id);
        toast.success('API key disabled');
      } else {
        await enableApiKey(id);
        toast.success('API key enabled');
      }
      fetchApiKeys(); // Refresh the list
    } catch (error) {
      console.error('Error toggling API key state:', error);
      toast.error('Failed to update API key state');
    }
  };

  const handleRegenerateKey = async (id: string) => {
    if (!confirm('Are you sure you want to regenerate this API key? The old key will no longer work.')) {
      return;
    }

    try {
      const regeneratedKey = await regenerateApiKey(id);
      setApiKeys(apiKeys.map(key => (key._id === id ? regeneratedKey : key)));
      setShowingKey(id);
      toast.success('API key regenerated successfully');
    } catch (error) {
      console.error('Error regenerating API key:', error);
      toast.error('Failed to regenerate API key');
    }
  };

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast.success('API key copied to clipboard');
  };

  const handleEditPermissions = (key: APIKey) => {
    setEditingPermissions(key._id);
    setSelectedPermissions(key.permissions);
  };

  const handleSavePermissions = async () => {
    if (!editingPermissions) return;

    try {
      await updateApiKeyPermissions(editingPermissions, selectedPermissions);
      setApiKeys(
        apiKeys.map(key => 
          key._id === editingPermissions 
            ? { ...key, permissions: selectedPermissions } 
            : key
        )
      );
      setEditingPermissions(null);
      toast.success('Permissions updated successfully');
    } catch (error) {
      console.error('Error updating permissions:', error);
      toast.error('Failed to update permissions');
    }
  };

  const handleTogglePermission = (permission: string) => {
    if (selectedPermissions.includes(permission)) {
      setSelectedPermissions(selectedPermissions.filter(p => p !== permission));
    } else {
      setSelectedPermissions([...selectedPermissions, permission]);
    }
  };

  return (
    <DashboardLayout title="API Keys">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto pb-6">
        <Card title="Create New API Key">
          <form onSubmit={handleCreateKey} className="space-y-4">
            <div>
              <label htmlFor="key-name" className="block text-sm font-medium text-gray-700">
                Key Name
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <div className="relative flex items-stretch flex-grow focus-within:z-10">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <KeyIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    type="text"
                    name="key-name"
                    id="key-name"
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-md pl-10 sm:text-sm border-gray-300"
                    placeholder="My API Key"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Create
                </button>
              </div>
            </div>
          </form>
        </Card>

        <div className="mt-6">
          <Card title="Your API Keys">
            {loading ? (
              <div className="text-center py-10">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
                <p className="mt-2 text-gray-500">Loading your API keys...</p>
              </div>
            ) : apiKeys.length === 0 ? (
              <div className="text-center py-10">
                <KeyIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-semibold text-gray-900">No API keys</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by creating a new API key.</p>
              </div>
            ) : (
              <div className="flow-root">
                <ul className="divide-y divide-gray-200">
                  {apiKeys.map((key) => (
                    <li key={key._id} className="py-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-sm font-medium text-gray-900">{key.name}</h3>
                            <p className="text-xs text-gray-500">
                              Created on {new Date(key.createdAt).toLocaleDateString()}
                              {key.lastUsed && ` • Last used on ${new Date(key.lastUsed).toLocaleDateString()}`}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleToggleKeyActive(key._id, key.active)}
                              className={`p-1 rounded-md ${
                                key.active
                                  ? 'text-green-600 hover:text-green-700 hover:bg-green-100'
                                  : 'text-red-600 hover:text-red-700 hover:bg-red-100'
                              }`}
                              title={key.active ? 'Disable key' : 'Enable key'}
                            >
                              {key.active ? (
                                <EyeIcon className="h-5 w-5" />
                              ) : (
                                <EyeSlashIcon className="h-5 w-5" />
                              )}
                            </button>
                            <button
                              onClick={() => handleEditPermissions(key)}
                              className="p-1 rounded-md text-gray-600 hover:text-gray-700 hover:bg-gray-100"
                              title="Edit permissions"
                            >
                              <PencilIcon className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleRegenerateKey(key._id)}
                              className="p-1 rounded-md text-indigo-600 hover:text-indigo-700 hover:bg-indigo-100"
                              title="Regenerate key"
                            >
                              <ArrowPathIcon className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleDeleteKey(key._id)}
                              className="p-1 rounded-md text-red-600 hover:text-red-700 hover:bg-red-100"
                              title="Delete key"
                            >
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          </div>
                        </div>

                        {/* Permissions */}
                        {editingPermissions === key._id ? (
                          <div className="bg-gray-50 p-3 rounded-md">
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Edit Permissions</h4>
                            <div className="space-y-2">
                              {permissionOptions.map((option) => (
                                <div key={option.id} className="flex items-center">
                                  <input
                                    id={`permission-${option.id}`}
                                    type="checkbox"
                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                    checked={selectedPermissions.includes(option.id)}
                                    onChange={() => handleTogglePermission(option.id)}
                                  />
                                  <label
                                    htmlFor={`permission-${option.id}`}
                                    className="ml-2 block text-sm text-gray-900"
                                  >
                                    {option.name}
                                  </label>
                                </div>
                              ))}
                            </div>
                            <div className="mt-3 flex justify-end space-x-2">
                              <button
                                type="button"
                                onClick={() => setEditingPermissions(null)}
                                className="px-3 py-1 text-sm text-gray-700 hover:text-gray-900 border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                onClick={handleSavePermissions}
                                className="px-3 py-1 text-sm text-white bg-indigo-600 hover:bg-indigo-700 border border-transparent rounded-md shadow-sm"
                              >
                                Save
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-wrap gap-1">
                            {key.permissions.map((permission) => (
                              <span
                                key={permission}
                                className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-indigo-100 text-indigo-800"
                              >
                                {permission.replace('_', ' ')}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Display key value if it's a new key or just regenerated */}
                        {(showingKey === key._id && key.key) && (
                          <div className="bg-gray-50 p-3 rounded-md">
                            <div className="flex items-center justify-between">
                              <div className="text-sm text-gray-900 font-mono overflow-x-auto max-w-lg">
                                {key.key}
                              </div>
                              <button
                                onClick={() => handleCopyKey(key.key!)}
                                className="p-1 rounded-md text-gray-600 hover:text-gray-700 hover:bg-gray-100"
                                title="Copy to clipboard"
                              >
                                <ClipboardIcon className="h-5 w-5" />
                              </button>
                            </div>
                            <p className="mt-1 text-xs text-red-600">
                              Make sure to copy this key now. You won&apos;t be able to see it again!
                            </p>
                          </div>
                        )}

                        <div className="flex items-center text-sm">
                          <div className="text-gray-500">
                            <span className="font-medium text-gray-900">{(key.totalTokens || 0).toLocaleString()}</span>{' '}
                            tokens used
                            {(key.totalImages || 0) > 0 && (
                              <> • <span className="font-medium text-gray-900">{(key.totalImages || 0).toLocaleString()}</span> images generated</>
                            )}
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
} 