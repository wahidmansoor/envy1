import React from 'react';
import { Activity, Clock, Stethoscope, PieChart } from 'lucide-react';

interface PainScale {
  score: number;
  description: string;
  intervention: string;
}

const painScales: PainScale[] = [
  { score: 1, description: 'Mild discomfort', intervention: 'Consider non-pharmacological approaches' },
  { score: 2, description: 'Moderate pain', intervention: 'Non-opioid analgesics' },
  { score: 3, description: 'Severe pain', intervention: 'Regular opioid dosing' },
  { score: 4, description: 'Very severe pain', intervention: 'Urgent pain management review' }
];

export default function PainManagement() {
  return (
    <div className="space-y-8">
      {/* Pain Assessment Tools */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
          <Activity className="h-6 w-6 text-indigo-500" />
          <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Pain Assessment</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {painScales.map((scale) => (
            <div key={scale.score} 
              className="bg-white/20 backdrop-blur-lg p-4 rounded-xl border border-gray-300/30 shadow-md 
                       hover:shadow-[0_0_10px_rgba(255,255,255,0.3)] opacity-75 hover:opacity-100 transition-all duration-300 ease-in-out">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900">Pain Level {scale.score}</span>
                <span className="px-3 py-1 text-sm rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm">
                  Level {scale.score}
                </span>
              </div>
              <p className="text-gray-700 mb-2">{scale.description}</p>
              <p className="text-sm text-indigo-600 font-medium">{scale.intervention}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pain Management Guidelines */}
      <section className="bg-gradient-to-br from-indigo-50/10 to-purple-50/10 backdrop-blur-lg p-6 rounded-xl border border-white/20 shadow-md 
                         hover:shadow-xl transition-all duration-300 ease-in-out">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
          <Stethoscope className="h-6 w-6 text-indigo-500" />
          <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Treatment Guidelines</span>
        </h3>
        <div className="space-y-4">
          <div className="bg-white/20 backdrop-blur-lg p-4 rounded-xl border border-gray-200/40 shadow-md 
                         hover:shadow-xl hover:border-purple-300 hover:bg-gradient-to-r hover:from-indigo-50/30 hover:to-purple-50/30 transition-all duration-300 ease-in-out">
            <h4 className="font-medium bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">Step 1: Initial Assessment</h4>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-2 pl-2">
              <li>Complete pain history</li>
              <li>Physical examination</li>
              <li>Pain severity scoring</li>
            </ul>
          </div>
          <div className="bg-white/20 backdrop-blur-lg p-4 rounded-xl border border-gray-200/40 shadow-md 
                         hover:shadow-xl hover:border-purple-300 hover:bg-gradient-to-r hover:from-indigo-50/30 hover:to-purple-50/30 transition-all duration-300 ease-in-out">
            <h4 className="font-medium bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">Step 2: Treatment Selection</h4>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-2 pl-2">
              <li>Non-pharmacological options</li>
              <li>WHO analgesic ladder</li>
              <li>Adjuvant medications</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Monitoring and Follow-up */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-indigo-50/10 to-purple-50/10 backdrop-blur-lg p-6 rounded-xl border border-gray-200/40 shadow-md 
                      hover:shadow-xl hover:scale-102 transition-all duration-300 ease-in-out">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-3">
            <Clock className="h-6 w-6 text-indigo-500" />
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Monitoring Schedule</span>
          </h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>Daily assessment for inpatients</li>
            <li>Weekly follow-up for outpatients</li>
            <li>Regular dose titration reviews</li>
          </ul>
        </div>
        <div className="bg-gradient-to-br from-indigo-50/10 to-purple-50/10 backdrop-blur-lg p-6 rounded-xl border border-gray-200/40 shadow-md 
                      hover:shadow-xl hover:scale-102 transition-all duration-300 ease-in-out">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-3">
            <PieChart className="h-6 w-6 text-indigo-500" />
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Outcome Measures</span>
          </h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>Pain intensity scores</li>
            <li>Functional improvement</li>
            <li>Quality of life assessment</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
