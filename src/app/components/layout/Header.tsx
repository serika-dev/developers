'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BellIcon } from '@heroicons/react/24/outline';
import { logout, getCurrentUser } from '@/app/services/api';
import { useRouter } from 'next/navigation';
import { User } from '@/app/types';

export default function Header({ title }: { title: string }) {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user:', error);
        router.replace('/login');
      }
    };

    fetchUser();
  }, [router]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="bg-white shadow">
      <div className="flex justify-between items-center px-4 py-4 sm:px-6 lg:px-8">
        <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
        <div className="flex items-center space-x-4">
          <button
            type="button"
            className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <span className="sr-only">View notifications</span>
            <BellIcon className="h-6 w-6" aria-hidden="true" />
          </button>

          {/* Profile dropdown */}
          <div className="relative">
            <button
              type="button"
              className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
              id="user-menu-button"
              aria-expanded={isProfileMenuOpen}
              aria-haspopup="true"
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            >
              <span className="sr-only">Open user menu</span>
              <div className="h-8 w-8 rounded-full overflow-hidden bg-indigo-600 flex items-center justify-center text-white">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.username}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span>{user?.username?.[0]?.toUpperCase() || 'U'}</span>
                )}
              </div>
            </button>

            {isProfileMenuOpen && (
              <div
                className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="user-menu-button"
              >
                <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-200">
                  <p className="font-medium">{user?.username}</p>
                  <p className="text-gray-500 text-xs truncate">{user?.email}</p>
                </div>
                <Link
                  href="/dashboard/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  role="menuitem"
                  onClick={() => setIsProfileMenuOpen(false)}
                >
                  Your Profile
                </Link>
                <Link
                  href="/dashboard/settings"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  role="menuitem"
                  onClick={() => setIsProfileMenuOpen(false)}
                >
                  Settings
                </Link>
                <button
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  role="menuitem"
                  onClick={handleLogout}
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
} 