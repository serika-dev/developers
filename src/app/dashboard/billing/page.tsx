'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/app/components/layout/DashboardLayout';
import Card from '@/app/components/ui/Card';
import { getApiUsage, getCurrentUser } from '@/app/services/api';
import { APIUsageResponse, User } from '@/app/types';

export default function BillingPage() {
  const [usage, setUsage] = useState<APIUsageResponse | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usageData, userData] = await Promise.all([
          getApiUsage(),
          getCurrentUser()
        ]);
        setUsage(usageData);
        setUser(userData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <DashboardLayout title="API Usage & Billing">
      <div className="max-w-7xl mx-auto pb-6">
        <div className="grid grid-cols-1 gap-6">
          {/* Billing Status */}
          <Card title="Billing Status">
            {loading ? (
              <div className="animate-pulse space-y-4 p-4">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ) : (
              <div className="p-4">
                <div className="flex items-center mb-4">
                  <div className={`h-3 w-3 rounded-full mr-2 ${user?.apiSubscriptionStatus === 'active' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                  <p className="text-lg font-medium">
                    {user?.apiSubscriptionStatus === 'active' 
                      ? 'Your billing is active and ready to use' 
                      : 'You have usage-based billing enabled'}
                  </p>
                </div>
                {user?.lastAPIPaymentDate && (
                  <p className="text-sm text-gray-600">
                    Last payment: {new Date(user.lastAPIPaymentDate).toLocaleDateString()}
                    {user.lastAPIPaymentStatus && ` (${user.lastAPIPaymentStatus})`}
                  </p>
                )}
                {user?.apiSubscriptionPeriodEnd && (
                  <p className="text-sm text-gray-600">
                    Next billing cycle: {new Date(user.apiSubscriptionPeriodEnd).toLocaleDateString()}
                  </p>
                )}
              </div>
            )}
          </Card>

          {/* Current Usage */}
          <Card title="Current Usage">
            {loading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500">Total Tokens</h3>
                  <p className="mt-2 text-3xl font-semibold text-gray-900">
                    {usage?.summary.totalTokens.toLocaleString()}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    $0.002 per 1K tokens
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500">Total Images</h3>
                  <p className="mt-2 text-3xl font-semibold text-gray-900">
                    {usage?.summary.totalImages.toLocaleString()}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    $0.02 per image
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500">Estimated Cost</h3>
                  <p className="mt-2 text-3xl font-semibold text-gray-900">
                    ${((usage?.summary.totalTokens || 0) * 0.002 / 1000 + (usage?.summary.totalImages || 0) * 0.02).toFixed(2)}
                  </p>
                </div>
              </div>
            )}
          </Card>

          {/* Usage By Endpoint */}
          <Card title="Usage By Endpoint">
            {loading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Endpoint
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Requests
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tokens
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Images
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {usage?.byEndpoint.map((endpoint, i) => (
                      <tr key={i}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {endpoint._id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {endpoint.totalRequests.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {endpoint.totalTokens.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {endpoint.totalImages.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>

          {/* Billing Information */}
          <Card title="Billing Information">
            <div className="prose max-w-none p-6">
              <p>
                Our API uses a simple pay-as-you-go pricing model with no minimum fees or subscriptions:
              </p>
              <ul>
                <li><strong>$0.002 per 1,000 tokens</strong> for text generation</li>
                <li><strong>$0.02 per image</strong> for image generation</li>
                <li>Only pay for what you use</li>
                <li>Billing cycle: Monthly</li>
              </ul>
              <p className="text-sm text-gray-600">
                For billing inquiries, please contact <a href="mailto:support@serika.dev" className="text-indigo-600 hover:text-indigo-800">support@serika.dev</a>
              </p>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
} 