'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getApiKeys, getApiUsage } from '../services/api';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import { APIKey, APIUsageResponse } from '../types';
import { KeyIcon, ChartBarIcon, BeakerIcon, DocumentTextIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

export default function Dashboard() {
  const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
  const [usage, setUsage] = useState<APIUsageResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [keysData, usageData] = await Promise.all([
          getApiKeys(),
          getApiUsage(),
        ]);
        setApiKeys(keysData);
        setUsage(usageData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const quickLinks = [
    {
      name: 'API Keys',
      description: 'Create and manage your API keys',
      icon: KeyIcon,
      href: '/dashboard/api-keys',
      color: 'bg-blue-500',
    },
    {
      name: 'Usage Stats',
      description: 'Monitor your API usage and costs',
      icon: ChartBarIcon,
      href: '/dashboard/billing',
      color: 'bg-green-500',
    },
    {
      name: 'Playground',
      description: 'Test and experiment with the API',
      icon: BeakerIcon,
      href: '/dashboard/playground',
      color: 'bg-purple-500',
    },
    {
      name: 'Documentation',
      description: 'Learn how to integrate the API',
      icon: DocumentTextIcon,
      href: '/dashboard/docs',
      color: 'bg-yellow-500',
    },
  ];

  return (
    <DashboardLayout title="Dashboard">
      <div className="grid grid-cols-1 gap-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {quickLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="block group"
            >
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="p-5">
                  <div className={`inline-flex rounded-md p-3 ring-4 ring-opacity-30 ${link.color} ring-${link.color}`}>
                    <link.icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">{link.name}</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{link.description}</p>
                  <div className="mt-4 flex items-center text-sm font-medium text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-800 dark:group-hover:text-indigo-300">
                    <span>View details</span>
                    <ArrowRightIcon className="ml-1 h-4 w-4" aria-hidden="true" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card title="Recent API Keys">
            {loading ? (
              <div className="py-10 text-center text-gray-500 dark:text-gray-400">Loading...</div>
            ) : apiKeys.length > 0 ? (
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {apiKeys.slice(0, 5).map((key) => (
                  <li key={key._id} className="py-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{key.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Created {new Date(key.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center">
                        {key.active ? (
                          <span className="px-2.5 py-0.5 text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full">
                            Active
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 text-xs font-medium bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-full">
                            Inactive
                          </span>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="py-10 text-center text-gray-500 dark:text-gray-400">
                <p>No API keys found</p>
                <Link href="/dashboard/api-keys" className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  Create your first API key
                </Link>
              </div>
            )}
            {apiKeys.length > 0 && (
              <div className="mt-4">
                <Link href="/dashboard/api-keys" className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300">
                  View all API keys →
                </Link>
              </div>
            )}
          </Card>

          <Card title="Usage Statistics">
            {loading ? (
              <div className="py-10 text-center text-gray-500 dark:text-gray-400">Loading...</div>
            ) : usage ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Tokens</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">{usage.summary.totalTokens.toLocaleString()}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">€{(usage.summary.pricing.tokens * usage.summary.totalTokens).toFixed(2)}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Images</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">{usage.summary.totalImages.toLocaleString()}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">€{(usage.summary.pricing.images * usage.summary.totalImages).toFixed(2)}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <Link href="/dashboard/billing" className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300">
                    View detailed usage statistics →
                  </Link>
                </div>
              </div>
            ) : (
              <div className="py-10 text-center text-gray-500 dark:text-gray-400">
                <p>No usage data available</p>
                <Link href="/dashboard/playground" className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  Try the API in playground
                </Link>
              </div>
            )}
          </Card>
        </div>

        <Card title="Getting Started">
          <div className="prose max-w-none">
            <p className="text-gray-900 dark:text-white">
              Welcome to the Serika.dev API Developer Portal. Here you can manage your API keys,
              monitor usage, and explore our API capabilities.
            </p>
            <h3 className="text-gray-900 dark:text-white">Quick Start</h3>
            <ol className="text-gray-900 dark:text-white">
              <li>
                <Link href="/dashboard/api-keys" className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300">
                  Create an API key
                </Link>{' '}
                to authenticate your requests
              </li>
              <li>
                <Link href="/dashboard/playground" className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300">
                  Try the API in the playground
                </Link>{' '}
                to see how it works
              </li>
              <li>
                <Link href="/dashboard/docs" className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300">
                  Read the documentation
                </Link>{' '}
                to learn about all available endpoints
              </li>
              <li>
                <Link href="/dashboard/examples" className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300">
                  View code examples
                </Link>{' '}
                to integrate the API into your applications
              </li>
            </ol>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
} 