import React from 'react';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
  footer?: React.ReactNode;
}

export default function Card({ children, title, className = '', footer }: CardProps) {
  return (
    <div className={`bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg ${className}`}>
      {title && (
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">{title}</h3>
        </div>
      )}
      <div className="px-4 py-5 sm:p-6 text-gray-900 dark:text-white">{children}</div>
      {footer && (
        <div className="px-4 py-4 sm:px-6 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-700">
          {footer}
        </div>
      )}
    </div>
  );
} 