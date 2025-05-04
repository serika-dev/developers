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

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full bg-gray-900 w-64 text-white">
      <div className="flex items-center justify-center p-6 border-b border-gray-800">
        <Link href="/dashboard" className="flex items-center">
          <span className="text-xl font-bold">Serika.dev</span>
          <span className="ml-2 bg-indigo-600 text-white text-xs px-2 py-1 rounded-md">API</span>
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="px-2 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center px-4 py-3 text-sm rounded-md ${
                  isActive
                    ? 'bg-indigo-700 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
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
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <span className="inline-block h-8 w-8 rounded-full bg-gray-700"></span>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-white">Developer Portal</p>
            <p className="text-xs text-gray-400">Serika.dev</p>
          </div>
        </div>
      </div>
    </div>
  );
} 