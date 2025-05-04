'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/app/components/layout/DashboardLayout';
import Card from '@/app/components/ui/Card';
import { getCurrentUser, uploadAvatar } from '@/app/services/api';
import { User } from '@/app/types';
import Image from 'next/image';

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user:', error);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    try {
      setUploading(true);
      const response = await uploadAvatar(user._id, file);
      
      if (response.avatarUrl) {
        setUser(prev => prev ? { ...prev, avatar: response.avatarUrl } : null);
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
      setError('Failed to upload profile image');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Profile">
        <div className="max-w-7xl mx-auto pb-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Profile">
      <div className="max-w-7xl mx-auto pb-6">
        <div className="grid grid-cols-1 gap-6">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Profile Information */}
          <Card title="Profile Information">
            <div className="p-6">
              <div className="flex items-center space-x-6">
                <div className="relative h-32 w-32 rounded-full overflow-hidden mx-auto">
                  {user?.avatar ? (
                    <Image
                      src={user.avatar}
                      alt={user.username}
                      width={128}
                      height={128}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                      <span className="text-4xl text-gray-500">{user?.username?.[0]?.toUpperCase()}</span>
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{user?.username}</h3>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                  <p className="text-sm text-gray-500">
                    Joined {new Date(user?.joinDate || '').toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    {user?.apiSubscriptionStatus === 'active' ? 
                      <span className="text-green-600 font-medium">Active Billing Setup</span> : 
                      'No active billing setup'}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Account Settings */}
          <Card title="Account Settings">
            <div className="p-6 space-y-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={user?.username}
                  readOnly
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={user?.email}
                  readOnly
                />
              </div>
            </div>
          </Card>

          {/* API Usage */}
          <Card title="API Usage">
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500">Message Count</h4>
                  <p className="mt-2 text-3xl font-semibold text-gray-900">
                    {user?.messageCount?.total?.toLocaleString() || 0}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500">Image Count</h4>
                  <p className="mt-2 text-3xl font-semibold text-gray-900">
                    {user?.imageCount?.total?.toLocaleString() || 0}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
} 