'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/app/components/layout/DashboardLayout';
import Card from '@/app/components/ui/Card';
import { getApiUsage } from '@/app/services/api';
import { APIUsageResponse } from '@/app/types';
import { ChartBarIcon, DocumentTextIcon, PhotoIcon } from '@heroicons/react/24/outline';

export default function UsagePage() {
  const [usage, setUsage] = useState<APIUsageResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsage();
  }, []);

  const fetchUsage = async () => {
    try {
      setLoading(true);
      const data = await getApiUsage();
      setUsage(data);
    } catch (error) {
      console.error('Error fetching usage:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      name: 'Total Tokens',
      value: usage?.summary.totalTokens.toLocaleString() || '0',
      icon: DocumentTextIcon,
      change: '+4.75%',
      changeType: 'positive',
    },
    {
      name: 'Total Images',
      value: usage?.summary.totalImages.toLocaleString() || '0',
      icon: PhotoIcon,
      change: '+54.02%',
      changeType: 'positive',
    },
    {
      name: 'Successful Requests',
      value: usage?.summary.successfulRequests.toLocaleString() || '0',
      icon: ChartBarIcon,
      change: '-1.39%',
      changeType: 'negative',
    },
  ];

  return (
    <DashboardLayout title="Usage Statistics">
      <div className="max-w-7xl mx-auto pb-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat) => (
            <Card key={stat.name}>
              <div className="relative pt-2 px-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <stat.icon className="h-6 w-6 text-gray-400" aria-hidden="true" />
                  </div>
                  <div className="ml-3 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">{stat.value}</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-6">
          <Card title="Usage by Endpoint">
            {loading ? (
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-2/3"></div>
              </div>
            ) : usage?.byEndpoint && usage.byEndpoint.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Endpoint
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Requests
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Tokens
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Images
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {usage.byEndpoint.map((endpoint) => (
                      <tr key={endpoint._id}>
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
            ) : (
              <div className="text-center py-6 text-gray-500">
                No usage data available
              </div>
            )}
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
} 