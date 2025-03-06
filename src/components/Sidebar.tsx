import React from 'react';
import { useNavigate, useLocation, matchPath } from 'react-router-dom';
import { Stethoscope, TestTube, Building2, Heart, BookOpen, MessageSquareText, BrainCircuit, LucideIcon } from 'lucide-react';
import SidebarButton from './ui/SidebarButton';

interface Module {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  route: string;
}

const modules: Module[] = [
  {
    id: 'handbook',
    title: 'AI Handbook',
    description: 'Guidelines & practices',
    icon: BookOpen,
    route: '/dashboard/handbook'
  },
  {
    id: 'opd',
    title: 'Oncology OPD',
    description: 'Patient evaluations',
    icon: Stethoscope,
    route: '/dashboard/opd'
  },
  {
    id: 'chemo',
    title: 'Chemotherapy',
    description: 'Regimens & monitoring',
    icon: TestTube,
    route: '/dashboard/chemo'
  },
  {
    id: 'inpatient',
    title: 'Inpatient',
    description: 'Care & emergencies',
    icon: Building2,
    route: '/dashboard/inpatient'
  },
  {
    id: 'palliative',
    title: 'Palliative',
    description: 'Pain & end-of-life care',
    icon: Heart,
    route: '/dashboard/palliative'
  },
  {
    id: 'chat',
    title: 'AI Chat',
    description: 'Interactive assistant',
    icon: MessageSquareText,
    route: '/dashboard/chat'
  },
  {
    id: 'flashcards',
    title: 'Flashcards',
    description: 'Study & review',
    icon: BrainCircuit,
    route: '/dashboard/flashcards'
  },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

function Sidebar({ isOpen, onClose, className = '' }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  
  const match = matchPath(
    '/dashboard/:module/*',
    location.pathname
  );
  const currentModule = match?.params?.module || 'handbook';

  const handleModuleSelect = (route: string) => {
    navigate(route);
    if (window.innerWidth < 1024) { // lg breakpoint
      onClose(); // Close sidebar on mobile after selection
    }
  };

  return (
    <div className={`flex flex-col h-full ${className}`}>
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Modules</h2>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-4">
        {modules.map((module) => (
          <SidebarButton
            key={module.id}
            icon={module.icon}
            title={module.title}
            description={module.description}
            isSelected={currentModule === module.id}
            onClick={() => handleModuleSelect(module.route)}
            type={module.id as any}
          />
        ))}
      </nav>

      <button
        onClick={onClose}
        className="lg:hidden text-gray-500 hover:text-gray-700 px-4 py-3 border-t border-gray-200"
      >
        Close
      </button>
    </div>
  );
}

export default Sidebar;
