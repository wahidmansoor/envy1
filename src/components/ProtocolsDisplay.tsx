import React, { useState } from "react";
import { Protocol, TreatmentItem } from "../types/protocol";

interface ProtocolDisplayProps {
  protocols: Protocol[];
}

const ProtocolDisplay: React.FC<ProtocolDisplayProps> = ({ protocols }) => {
  const [selectedProtocol, setSelectedProtocol] = useState<Protocol | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const getTreatmentSummary = (treatment: string | (string | TreatmentItem)[]) => {
    if (Array.isArray(treatment)) {
      if (!treatment.length) return 'No treatment';
      const firstItem = treatment[0];
      if (typeof firstItem === 'object' && firstItem !== null) {
        return (firstItem as TreatmentItem).drug;
      }
      return String(firstItem);
    }
    return treatment;
  };

  // Filter protocols based on search query
  const filteredProtocols = protocols.filter((protocol) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      protocol.code.toLowerCase().includes(searchLower) ||
      protocol.tumour_group.toLowerCase().includes(searchLower) ||
      (Array.isArray(protocol.treatment)
        ? protocol.treatment.some(item => {
            if (typeof item === 'string') {
              return item.toLowerCase().includes(searchLower);
            }
            return (item as TreatmentItem).drug.toLowerCase().includes(searchLower);
          })
        : protocol.treatment.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Protocols</h1>
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search protocols..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border border-gray-300 px-4 py-2 rounded-lg shadow-sm w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Protocols Table */}
      <div className="overflow-x-auto shadow rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-transparent">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                Code
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                Tumor Group
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                Treatment Summary
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                More Details
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredProtocols.map((protocol) => (
              <tr key={protocol.id} className="hover:bg-gray-100 transition-colors">
                <td className="px-6 py-4 text-sm text-gray-700">{protocol.code}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{protocol.tumour_group}</td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {getTreatmentSummary(protocol.treatment)}
                </td>
                <td className="px-6 py-4 text-sm">
                  <button
                    onClick={() => setSelectedProtocol(protocol)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none"
                  >
                    More Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {selectedProtocol && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300"
          onClick={() => setSelectedProtocol(null)}
        >
          <div
            className="rounded-lg shadow-xl p-8 relative w-11/12 md:w-2/3 lg:w-1/2 transform transition-all duration-300 scale-95 hover:scale-100"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedProtocol(null)}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 text-3xl focus:outline-none"
            >
              &times;
            </button>
            <h2 className="text-2xl font-semibold mb-6 border-b pb-2">Protocol Details</h2>
            <div className="space-y-4 text-gray-800">
              <div>
                <span className="font-medium">Eligibility: </span> 
                <span>{Array.isArray(selectedProtocol.eligibility) 
                  ? selectedProtocol.eligibility.join(', ') 
                  : selectedProtocol.eligibility || "N/A"}</span>
              </div>
              <div>
                <span className="font-medium">Exclusions: </span> 
                <span>{Array.isArray(selectedProtocol.exclusions)
                  ? selectedProtocol.exclusions.join(', ')
                  : selectedProtocol.exclusions || "N/A"}</span>
              </div>
              <div>
                <span className="font-medium">Treatment: </span> 
                <div className="mt-1 pl-2 border-l-4 border-blue-300">
                  {Array.isArray(selectedProtocol.treatment)
                    ? selectedProtocol.treatment.map((item, index) => (
                        <div key={index} className="mb-2">
                          {typeof item === 'string' ? (
                            item
                          ) : (
                            <div className="grid grid-cols-1 gap-1">
                              <div><span className="font-medium">Drug:</span> {item.drug}</div>
                              <div><span className="font-medium">Dose:</span> {item.dose}</div>
                              <div><span className="font-medium">Administration:</span> {item.administration}</div>
                            </div>
                          )}
                        </div>
                      ))
                    : selectedProtocol.treatment
                  }
                </div>
              </div>
              <div>
                <span className="font-medium">Dose Modifications: </span> 
                {typeof selectedProtocol.dose_modifications === 'object' ? (
                  <div className="mt-2 space-y-4">
                    {Object.entries(selectedProtocol.dose_modifications).map(([category, modifications]) => (
                      <div key={category}>
                        <h4 className="font-medium text-gray-700">{category}</h4>
                        <div className="pl-4">
                          {Object.entries(modifications).map(([type, values]) => (
                            <div key={type} className="mt-2">
                              <div className="font-medium text-gray-600">{type}:</div>
                              <ul className="list-disc pl-5">
                                {(values as string[]).map((value, idx) => (
                                  <li key={idx}>{value}</li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <span>{selectedProtocol.dose_modifications || "N/A"}</span>
                )}
              </div>
              <div>
                <span className="font-medium">Precautions: </span> 
                <span>{Array.isArray(selectedProtocol.precautions)
                  ? selectedProtocol.precautions.join(', ')
                  : selectedProtocol.precautions}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProtocolDisplay;
