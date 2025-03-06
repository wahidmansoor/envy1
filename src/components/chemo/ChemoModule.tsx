import { useState, useEffect, createContext, useContext } from 'react';
import { 
  AlertTriangle, 
  Keyboard,
  Library,
  AlertOctagon,
  Calculator,
  Pill,
  TestTube,
} from 'lucide-react';
import DoseCalculator from './DoseCalculator';
import ToxicityMonitoring from './ToxicityMonitoring';
import PreMedicationManager from './PreMedicationManager';
import RegimensLibrary from './RegimensLibrary';

type TabType = 'regimens' | 'toxicity' | 'calculator' | 'premeds';

interface PatientData {
  weight: number;
  height: number;
  bsa: number;
  age: number;
}

interface ChemoUnitContextType {
  patientData: PatientData;
  updatePatientData: (data: Partial<PatientData>) => void;
  hasUnsavedChanges: boolean;
  setHasUnsavedChanges: (value: boolean) => void;
}

const ChemoUnitContext = createContext<ChemoUnitContextType | undefined>(undefined);

export default function ChemoModule() {
  const [activeTab, setActiveTab] = useState<TabType>('regimens');
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);
  const [patientData, setPatientData] = useState<PatientData>({
    weight: 0,
    height: 0,
    bsa: 0,
    age: 0
  });
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const updatePatientData = (data: Partial<PatientData>) => {
    setPatientData(prev => ({ ...prev, ...data }));
    setHasUnsavedChanges(true);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.altKey) {
        switch (event.key) {
          case '1':
            setActiveTab('regimens');
            break;
          case '2':
            setActiveTab('toxicity');
            break;
          case '3':
            setActiveTab('calculator');
            break;
          case '4':
            setActiveTab('premeds');
            break;
          case 'h':
          case 'H':
            setShowKeyboardHelp(prev => !prev);
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const handleTabChange = (tabId: string) => {
    if (hasUnsavedChanges) {
      const confirm = window.confirm('You have unsaved changes. Are you sure you want to switch tabs?');
      if (!confirm) return;
    }
    
    // Type guard for TabType
    if (tabId === 'regimens' || tabId === 'toxicity' || tabId === 'calculator' || tabId === 'premeds') {
      setActiveTab(tabId);
    }
  };

  const contextValue: ChemoUnitContextType = {
    patientData,
    updatePatientData,
    hasUnsavedChanges,
    setHasUnsavedChanges
  };

  const sections = [
    {
      id: 'regimens',
      title: 'Regimens Library',
      description: 'Browse and select from available chemotherapy regimens and protocols.',
      component: <RegimensLibrary />,
      icon: <Library className="h-6 w-6 text-indigo-500" />
    },
    {
      id: 'toxicity',
      title: 'Toxicities in Oncology Drugs',
      description: 'Monitor and track chemotherapy-related toxicities by grade or type.',
      component: <ToxicityMonitoring />,
      icon: <AlertOctagon className="h-6 w-6 text-indigo-500" />
    },
    {
      id: 'calculator',
      title: 'Dose Calculator',
      description: 'Calculate appropriate doses based on patient measurements and selected regimen.',
      component: <DoseCalculator />,
      icon: <Calculator className="h-6 w-6 text-indigo-500" />
    },
    {
      id: 'premeds',
      title: 'Pre-Medications',
      description: 'Manage pre-medication protocols with contraindications and warnings.',
      component: <PreMedicationManager />,
      icon: <Pill className="h-6 w-6 text-indigo-500" />
    }
  ] as const;

  return (
    <ChemoUnitContext.Provider value={contextValue}>
      <div className="space-y-6 opacity-85 hover:opacity-100 transition-all duration-300">
        {/* Header */}
        <div className="flex justify-between items-start bg-white/30 backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-6 transition-all duration-300 ease-in-out">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-3">
              <TestTube className="h-8 w-8 text-indigo-500" />
              Chemotherapy Unit
            </h1>
            <p className="mt-2 text-gray-600 text-lg max-w-4xl">
              Comprehensive chemotherapy management system for regimens, dosing,
              toxicity monitoring, and pre-medication protocols.</p>
          </div>
          <button
            onClick={() => setShowKeyboardHelp(prev => !prev)}
            className="p-2 text-gray-700 hover:text-gray-900 rounded-lg bg-white/10 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 backdrop-blur-md border border-gray-200/40 hover:border-indigo-300 transition-all duration-300"
            aria-label="Toggle keyboard shortcuts help"
          >
            <Keyboard className="h-5 w-5" />
          </button>
        </div>

        {/* Keyboard Shortcuts Help */}
        {showKeyboardHelp && (
          <div className="p-4 bg-white/20 backdrop-blur-lg rounded-lg border border-gray-200/40 shadow-md hover:shadow-xl transition-all duration-300" role="region" aria-label="Keyboard shortcuts">
            <h2 className="text-sm font-medium text-gray-900 mb-2">Keyboard Shortcuts</h2>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>Alt+1: Regimens Library</div>
              <div>Alt+2: Toxicity Monitor</div>
              <div>Alt+3: Dose Calculator</div>
              <div>Alt+4: Pre-medications</div>
              <div>Alt+H: Toggle this help</div>
            </div>
          </div>
        )}

        {/* Unsaved Changes Warning */}
        {hasUnsavedChanges && (
          <div className="p-4 bg-yellow-50/80 backdrop-blur-md rounded-lg border border-yellow-200/60 shadow-md flex items-center gap-2 transition-all duration-300" role="alert">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            <span className="text-sm text-yellow-700">
              You have unsaved changes. Please save your work before switching tabs.
            </span>
          </div>
        )}

        {/* Selectable Section Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => handleTabChange(section.id)}
              className={`p-5 rounded-xl shadow-md hover:shadow-xl border backdrop-blur-lg transition-all duration-300 hover:scale-105
                        ${activeTab === section.id 
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xl border-transparent hover:from-indigo-500 hover:to-purple-500' 
                          : 'bg-white/20 border-gray-200/40 hover:border-indigo-300 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50'
                        }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className={activeTab === section.id ? 'text-white' : ''}>
                  {section.icon}
                </span>
                <h3 className="font-medium text-lg">{section.title}</h3>
              </div>
              <p className={`text-sm mt-2 ${
                activeTab === section.id ? 'text-white/90' : 'text-gray-600'
              }`}>
                {section.description}
              </p>
            </button>
          ))}
        </div>

        {/* Display Selected Section */}
        {activeTab && (
          <div className="mt-6 p-6 rounded-xl shadow-md hover:shadow-xl border border-gray-200/40 bg-white/20 
                        backdrop-blur-lg transition-all duration-300 ease-in-out">
            <div className="max-w-7xl mx-auto">
              {sections.find((s) => s.id === activeTab)?.component}
            </div>
            {/* Context-sensitive help */}
            <div className="mt-6 p-4 bg-white/10 backdrop-blur-lg rounded-lg border border-gray-300/30 
                          shadow-md hover:shadow-[0_0_10px_rgba(255,255,255,0.3)] transition-all duration-300">
              <h3 className="text-sm font-medium text-gray-900">Quick Help</h3>
              <p className="mt-1 text-sm text-gray-600">
                {sections.find((s) => s.id === activeTab)?.description}
              </p>
            </div>
          </div>
        )}
      </div>
    </ChemoUnitContext.Provider>
  );
}

// Export context for use in child components
export const useChemoUnit = () => {
  const context = useContext(ChemoUnitContext);
  if (context === undefined) {
    throw new Error('useChemoUnit must be used within a ChemoUnitProvider');
  }
  return context;
};
