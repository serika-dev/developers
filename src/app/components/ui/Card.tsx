import React from 'react';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
  footer?: React.ReactNode;
}

export default function Card({ children, title, className = '', footer }: CardProps) {
  return (
    <div className={`bg-white overflow-hidden shadow rounded-lg ${className}`} style={{ color: '#111827' }}>
      {title && (
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium" style={{ color: '#111827' }}>{title}</h3>
        </div>
      )}
      <div className="px-4 py-5 sm:p-6" style={{ color: '#111827' }}>{children}</div>
      {footer && (
        <div className="px-4 py-4 sm:px-6 bg-gray-50 border-t border-gray-200">
          {footer}
        </div>
      )}
    </div>
  );
} 