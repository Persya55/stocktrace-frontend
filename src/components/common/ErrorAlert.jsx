import React from 'react';
import { AlertCircle } from 'lucide-react';

const ErrorAlert = ({ error }) => (
  <div className="mb-6 bg-red-50 border-l-4 border-red-500 rounded-r-lg p-4 flex items-start space-x-3 shadow-sm">
    <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
    <div>
      <p className="text-sm font-semibold text-red-800">Error</p>
      <p className="text-sm text-red-700 mt-1">{error}</p>
    </div>
  </div>
);

export default ErrorAlert;