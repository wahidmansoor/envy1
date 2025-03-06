import React from 'react';

const toxicityData = [
  {
    category: 'Hematologic',
    toxicities: [
      {
        name: 'Neutropenia',
        monitoring: 'CBC with differential weekly',
        management: 'G-CSF support if indicated, dose reduction/delay',
        grading: ['ANC > 1.5', 'ANC 1.0-1.5', 'ANC 0.5-1.0', 'ANC < 0.5']
      },
      {
        name: 'Thrombocytopenia',
        monitoring: 'Platelet count weekly',
        management: 'Platelet transfusion if indicated, dose reduction',
        grading: ['PLT > 75', 'PLT 50-75', 'PLT 25-50', 'PLT < 25']
      }
    ]
  },
  {
    category: 'Gastrointestinal',
    toxicities: [
      {
        name: 'Nausea/Vomiting',
        monitoring: 'Daily assessment during therapy',
        management: 'Antiemetic protocol, hydration',
        grading: ['Minimal', 'Oral intake reduced', 'IV fluids indicated', 'Life-threatening']
      },
      {
        name: 'Mucositis',
        monitoring: 'Oral examination at each visit',
        management: 'Oral care protocol, pain management',
        grading: ['Mild', 'Moderate pain', 'Severe pain', 'Life-threatening']
      }
    ]
  }
];

export default function ToxicityTable() {
  return (
    <div className="overflow-x-auto rounded-xl bg-white/20 backdrop-blur-lg shadow-lg border border-gray-200/40">
      <table className="min-w-full divide-y divide-gray-200/40">
        <thead className="bg-white/10">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Toxicity
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Monitoring
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Management
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Grading (1-4)
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200/40">
          {toxicityData.map((category) => (
            <React.Fragment key={category.category}>
              <tr className="bg-white/10 backdrop-blur-md">
                <td colSpan={4} className="px-6 py-2 text-sm font-medium text-gray-900 hover:bg-white/20 transition-colors duration-200">
                  {category.category}
                </td>
              </tr>
              {category.toxicities.map((toxicity, index) => (
                <tr key={index} className="hover:bg-white/10 transition-all duration-200">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {toxicity.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {toxicity.monitoring}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {toxicity.management}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    <div className="flex gap-2">
                      {toxicity.grading.map((grade, i) => (
                        <span
                          key={i}
                          className={`px-2 py-1 rounded-full text-xs backdrop-blur-md shadow-sm transition-all duration-200 ${
                            i === 3 ? 'bg-red-100/30 text-red-800 border border-red-200/40 hover:bg-red-100/40' :
                            i === 2 ? 'bg-orange-100/30 text-orange-800 border border-orange-200/40 hover:bg-orange-100/40' :
                            i === 1 ? 'bg-yellow-100/30 text-yellow-800 border border-yellow-200/40 hover:bg-yellow-100/40' :
                            'bg-green-100/30 text-green-800 border border-green-200/40 hover:bg-green-100/40'
                          } hover:shadow-md`}
                        >
                          {grade}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
