import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import DocumentUploader from './tools/DocumentUploader';

export default function FloatingUploadButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [error, setError] = useState('');

  const handlePasswordSubmit = () => {
    if (password === 'Mwahid3932@$') {
      setShowPasswordModal(false);
      setIsOpen(true);
      setError('');
    } else {
      setError('Incorrect password');
    }
    setPassword('');
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setShowPasswordModal(true)}
        className="fixed right-6 bottom-6 p-4 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 z-50 animate-bounce hover-gradient"
        aria-label="Upload Document"
      >
        <Plus className="h-6 w-6" />
      </button>

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h2 className="text-xl font-semibold mb-4">Enter Password</h2>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded mb-4 focus:border-teal-500 focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50"
              placeholder="Enter password"
            />
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setError('');
                  setPassword('');
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                aria-label="Cancel"
              >
                Cancel
              </button>
              <button
                onClick={handlePasswordSubmit}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                aria-label="Submit"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold">Upload Document</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close Upload Modal"
              >
                <Plus className="h-6 w-6 transform rotate-45" />
              </button>
            </div>
            <DocumentUploader onClose={() => setIsOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
