import React from 'react';
import { ClipboardList } from 'lucide-react';
import AdmissionChecklist from './admission/AdmissionChecklist';
import AdmissionCriteria from './admission/AdmissionCriteria';

export default function AdmissionGuidelines() {
  return (
    <div className="space-y-6 transition-all duration-300">
      <div className="flex items-center gap-3">
        <ClipboardList className="h-6 w-6 text-indigo-500" />
        <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent transition-colors duration-300">Admission Guidelines</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2 transition-all duration-300">
        <AdmissionCriteria />
        <AdmissionChecklist />
      </div>
    </div>
  );
}
