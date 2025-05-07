import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  HomeIcon, 
  KeyIcon, 
  BeakerIcon, 
  DocumentTextIcon,
  CodeBracketIcon,
  CreditCardIcon,
  UserCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'API Keys', href: '/dashboard/api-keys', icon: KeyIcon },
  { name: 'Playground', href: '/dashboard/playground', icon: BeakerIcon },
  { name: 'Billing', href: '/dashboard/billing', icon: CreditCardIcon },
  { name: 'Documentation', href: '/dashboard/docs', icon: DocumentTextIcon },
  { name: 'Code Examples', href: '/dashboard/examples', icon: CodeBracketIcon },
  { name: 'Profile', href: '/dashboard/profile', icon: UserCircleIcon },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile backdrop */}
      <div
        className={`fixed inset-0 bg-gray-900/80 md:hidden ${
          isOpen ? 'block' : 'hidden'
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={`fixed md:static inset-y-0 left-0 z-40 flex flex-col h-full bg-gray-800 dark:bg-gray-900 w-64 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-700 dark:border-gray-800">
          <Link href="/dashboard" className="flex items-center">
            <span className="text-xl font-bold text-white">Serika.dev</span>
            <span className="ml-2 bg-indigo-600 text-white text-xs px-2 py-1 rounded-md">API</span>
          </Link>
          <button
            type="button"
            className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-200"
            onClick={onClose}
          >
            <span className="sr-only">Close sidebar</span>
            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="px-2 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => {
                    // Close sidebar on mobile when clicking a link
                    if (window.innerWidth < 768) {
                      onClose();
                    }
                  }}
                  className={`group flex items-center px-4 py-3 text-sm rounded-md ${
                    isActive
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700 dark:hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 ${
                      isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-300'
                    }`}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="p-4 border-t border-gray-700 dark:border-gray-800">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="inline-block h-8 w-8 rounded-full bg-gray-600 dark:bg-gray-700"></span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">Developer Portal</p>
              <p className="text-xs text-gray-400">Serika.dev</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 