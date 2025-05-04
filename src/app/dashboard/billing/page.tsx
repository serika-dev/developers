'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/app/components/layout/DashboardLayout';
import Card from '@/app/components/ui/Card';
import { getApiUsage, getCurrentUser, setupBilling } from '@/app/services/api';
import { APIUsageResponse, User } from '@/app/types';
import { Toaster, toast } from 'sonner';

export default function BillingPage() {
  const [usage, setUsage] = useState<APIUsageResponse | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [settingUpBilling, setSettingUpBilling] = useState(false);

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
        toast.error('Failed to fetch billing data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSetupBilling = async () => {
    try {
      setSettingUpBilling(true);
      if (user?.isPremium && user?.subscriptionStatus === 'active') {
        toast.error('You already have an active Serika+ subscription. Please contact support to set up API billing.');
        return;
      }
      const response = await setupBilling();
      if ('url' in response) {
        window.location.href = response.url;
      }
    } catch (error) {
      console.error('Error setting up billing:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to set up billing');
    } finally {
      setSettingUpBilling(false);
    }
  };

  const calculateCost = (tokens: number, images: number) => {
    const tokenCost = tokens * 0.00007; // €0.00007 per token
    const imageCost = images * 0.02; // €0.02 per image
    return tokenCost + imageCost;
  };

  return (
    <DashboardLayout title="Billing">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto pb-6">
        <div className="grid grid-cols-1 gap-6">
          <Card title="Current Plan">
            <div className="space-y-4">
              {loading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              ) : user?.hasAPISubscription ? (
                <div className="bg-green-50 dark:bg-green-900 p-4 rounded-md">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-green-800 dark:text-green-200">
                        Active API Subscription
                      </h3>
                      <div className="mt-2 text-sm text-green-700 dark:text-green-300">
                        <p>Your API subscription is active until {new Date(user.apiSubscriptionPeriodEnd!).toLocaleDateString()}</p>
                        <p>Last payment: {new Date(user.lastAPIPaymentDate!).toLocaleDateString()} ({user.lastAPIPaymentStatus})</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : user?.isPremium && user?.subscriptionStatus === 'active' ? (
                <div className="bg-yellow-50 dark:bg-yellow-900/50 p-4 rounded-md">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                        Serika+ Subscriber
                      </h3>
                      <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                        <p>You have an active Serika+ subscription. To use the API, please contact support to set up API billing.</p>
                        <a
                          href="mailto:support@serika.dev"
                          className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                        >
                          Contact Support
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-yellow-50 dark:bg-yellow-900/50 p-4 rounded-md">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                        No Active API Subscription
                      </h3>
                      <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                        <p>You need to set up billing to use the API.</p>
                        <button
                          onClick={handleSetupBilling}
                          disabled={settingUpBilling}
                          className={`mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 ${settingUpBilling ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          {settingUpBilling ? 'Setting up...' : 'Set up billing'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>

          <Card title="Usage & Costs">
            {loading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            ) : usage ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Period Usage</h4>
                    <div className="mt-2">
                      <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                        {usage.summary.totalTokens.toLocaleString()} tokens
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {usage.summary.totalImages.toLocaleString()} images
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Estimated Cost</h4>
                    <div className="mt-2">
                      <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                        €{calculateCost(usage.summary.totalTokens, usage.summary.totalImages).toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Based on current usage
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">Usage by Endpoint</h4>
                  <div className="space-y-4">
                    {usage.byEndpoint.map((endpoint) => (
                      <div key={endpoint._id} className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{endpoint._id}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {endpoint.totalTokens.toLocaleString()} tokens • {endpoint.totalImages.toLocaleString()} images
                          </p>
                        </div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          €{calculateCost(endpoint.totalTokens, endpoint.totalImages).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                No usage data available
              </div>
            )}
          </Card>

          <Card title="Pricing">
            <div className="prose max-w-none dark:prose-invert">
              <h3>Token Usage</h3>
              <p>€0.00007 per token</p>

              <h3>Image Generation</h3>
              <p>€0.02 per image</p>

              <h3>Additional Information</h3>
              <ul>
                <li>Billing is based on actual usage</li>
                <li>Charges are calculated at the end of each billing period</li>
                <li>You can monitor your usage in real-time on this page</li>
              </ul>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
} 