import { useState, useMemo } from 'react';
import { AlertCircle, TrendingUp, Clock, Search, Calendar } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface ToxicityEvent {
  id: string;
  type: string;
  grade: 1 | 2 | 3 | 4;
  date: string;
  description: string;
  intervention?: string;
  resolved?: boolean;
  cycle: number;
}

interface ToxicityData {
  name: string;
  grade: number;
  date: string;
  cycle: number;
}

// Updated content in ToxicityMonitoring.tsx for broader oncology drug toxicities
const TOXICITY_TYPES = [
  'Neutropenia', 'Thrombocytopenia', 'Anemia', 'Nausea', 'Vomiting', 'Diarrhea', 
  'Fatigue', 'Neuropathy', 'Mucositis', 'Cardiotoxicity', 'Hepatotoxicity', 'Nephrotoxicity', 
  'Skin Reaction', 'Infection', 'Febrile Neutropenia', 'Cognitive Changes', 'Myelosuppression',
  'Pulmonary Toxicity', 'Renal Toxicity', 'Ototoxicity', 'Hepatic Toxicity'
] as const;

type ToxicityType = typeof TOXICITY_TYPES[number];

// Modify the list and add descriptions and interventions

const MOCK_TOXICITY_EVENTS: ToxicityEvent[] = [
  {
    id: '1',
    type: 'Cardiotoxicity',
    grade: 2,
    date: '2025-02-08',
    description: 'Mild left ventricular dysfunction',
    intervention: 'Started ACE inhibitor, monitoring closely',
    cycle: 1
  },
  {
    id: '2',
    type: 'Anemia',
    grade: 3,
    date: '2025-02-09',
    description: 'Hgb < 8 g/dL',
    intervention: 'Blood transfusion administered',
    cycle: 1
  },
  {
    id: '3',
    type: 'Neutropenia',
    grade: 3,
    date: '2025-02-10',
    description: 'ANC < 1000/μL',
    intervention: 'G-CSF administered',
    cycle: 1
  },
  {
    id: '4',
    type: 'Renal Toxicity',
    grade: 2,
    date: '2025-02-10',
    description: 'Elevated creatinine',
    intervention: 'Dose reduction and hydration protocol initiated',
    cycle: 1
  },
  {
    id: '5',
    type: 'Hepatotoxicity',
    grade: 2,
    date: '2025-02-10',
    description: 'Elevated liver enzymes',
    intervention: 'Monitoring LFTs, dose modified',
    cycle: 1
  },
  {
    id: '6',
    type: 'Nausea',
    grade: 2,
    date: '2025-02-11',
    description: 'Moderate nausea',
    intervention: 'Additional antiemetics',
    cycle: 1
  },
  {
    id: '7',
    type: 'Mucositis',
    grade: 2,
    date: '2025-02-12',
    description: 'Moderate oral mucositis',
    intervention: 'Oral care protocol and pain management',
    cycle: 1
  },
  {
    id: '8',
    type: 'Neuropathy',
    grade: 2,
    date: '2025-02-13',
    description: 'Moderate peripheral neuropathy',
    intervention: 'Dose reduction, gabapentin started',
    cycle: 1
  }
];

export default function ToxicityMonitoring() {
  const [selectedType, setSelectedType] = useState<'all' | ToxicityType>('all');
  const [minGrade, setMinGrade] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [showResolved, setShowResolved] = useState(true);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  // Filter and process toxicity events
  const filteredEvents = useMemo(() => {
    return MOCK_TOXICITY_EVENTS.filter(event => {
      if (selectedType !== 'all' && event.type !== selectedType) return false;
      if (event.grade < minGrade) return false;
      if (!showResolved && event.resolved) return false;
      
      // Date range filtering
      const eventDate = new Date(event.date);
      if (startDate && eventDate < new Date(startDate)) return false;
      if (endDate && eventDate > new Date(endDate)) return false;
      
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          event.type.toLowerCase().includes(query) ||
          event.description.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [selectedType, minGrade, showResolved, searchQuery, startDate, endDate]);

  // Prepare data for chart
  const chartData = useMemo(() => {
    const data: ToxicityData[] = [];
    MOCK_TOXICITY_EVENTS.forEach(event => {
      if (selectedType === 'all' || event.type === selectedType) {
        data.push({
          name: event.type,
          grade: event.grade,
          date: event.date,
          cycle: event.cycle
        });
      }
    });
    return data;
  }, [selectedType]);

  const formatChartDate = (date: string): string => {
    return new Date(date).toLocaleDateString();
  };

  const tooltipFormatter = (value: number): [string, string] => {
    return [`Grade ${value}`, ''];
  };

  const getGradeSeverityClass = (grade: number): string => {
    switch (grade) {
      case 4: return 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold shadow-md hover:from-indigo-500 hover:to-purple-500 hover:shadow-lg transition-all duration-300';
      case 3: return 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-md hover:from-red-500 hover:to-orange-500 hover:shadow-lg transition-all duration-300';
      case 2: return 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-md hover:from-yellow-400 hover:to-orange-400 hover:shadow-lg transition-all duration-300';
      default: return 'bg-green-100/30 backdrop-blur-md border border-green-200/40 text-green-700 shadow-md hover:shadow-lg transition-all duration-300';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-indigo-600 to-purple-600 backdrop-blur-lg rounded-lg shadow-lg">
            <AlertCircle className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Toxicities in Oncology Drugs
          </h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowResolved(!showResolved)}
            className={`px-3 py-1 rounded-md text-sm ${
              showResolved ? 'bg-green-100/30 backdrop-blur-md border border-green-200/40 text-green-700' : 'bg-gray-100/30 backdrop-blur-md border border-gray-200/40 text-gray-700'
            }`}
          >
            {showResolved ? 'Showing Resolved' : 'Hiding Resolved'}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="grid gap-4 md:grid-cols-6 bg-white/20 backdrop-blur-lg p-6 rounded-xl shadow-lg border border-gray-200/40 hover:shadow-xl transition-all duration-300 ease-in-out">
        <div>
          <label htmlFor="toxicity-type" className="block text-sm font-medium text-gray-700 mb-1">
            Toxicity Type
          </label>
          <select
            id="toxicity-type"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as 'all' | ToxicityType)}
            className="w-full rounded-md bg-white/10 backdrop-blur-md border-gray-200/40 shadow-sm hover:border-purple-300 focus:border-purple-500 focus:ring-purple-500 transition-all duration-300"
          >
            <option value="all">All Types</option>
            {TOXICITY_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="min-grade" className="block text-sm font-medium text-gray-700 mb-1">
            Minimum Grade
          </label>
          <select
            id="min-grade"
            value={minGrade}
            onChange={(e) => setMinGrade(Number(e.target.value))}
            className="w-full rounded-md bg-white/10 backdrop-blur-md border-gray-200/40 shadow-sm hover:border-purple-300 focus:border-purple-500 focus:ring-purple-500 transition-all duration-300"
          >
            {[1, 2, 3, 4].map(grade => (
              <option key={grade} value={grade}>Grade {grade}+</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-1">
            <Calendar className="inline h-4 w-4 mr-1" />
            Start Date
          </label>
          <input
            id="start-date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full rounded-md bg-white/10 backdrop-blur-md border-gray-200/40 shadow-sm hover:border-purple-300 focus:border-purple-500 focus:ring-purple-500 transition-all duration-300"
          />
        </div>

        <div>
          <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 mb-1">
            <Calendar className="inline h-4 w-4 mr-1" />
            End Date
          </label>
          <input
            id="end-date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            min={startDate}
            className="w-full rounded-md bg-white/10 backdrop-blur-md border-gray-200/40 shadow-sm hover:border-purple-300 focus:border-purple-500 focus:ring-purple-500 transition-all duration-300"
          />
        </div>

        <div className="md:flex items-end">
          <button
            onClick={() => { setStartDate(''); setEndDate(''); }}
            className="px-3 py-2 text-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 backdrop-blur-md rounded-md border border-transparent hover:from-indigo-500 hover:to-purple-500 hover:shadow-lg transition-all duration-300"
          >
            Clear Dates
          </button>
        </div>

        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
            Search
          </label>
          <div className="relative">
            <input
              id="search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search toxicities..."
              className="w-full rounded-md bg-white/10 backdrop-blur-md border-gray-200/40 pl-10 shadow-sm hover:border-purple-300 focus:border-purple-500 focus:ring-purple-500 transition-all duration-300"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white/20 backdrop-blur-lg p-6 rounded-xl shadow-lg border border-gray-200/40 hover:shadow-xl transition-all duration-300 ease-in-out">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-gray-500" />
          Toxicity Trends
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" 
                            stroke="rgba(156, 163, 175, 0.2)" />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatChartDate}
              />
              <YAxis
                domain={[0, 4]}
                ticks={[1, 2, 3, 4]}
                label={{ value: 'Grade', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip
                labelFormatter={formatChartDate}
                formatter={tooltipFormatter}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="grade"
                name="Toxicity Grade"
                stroke="#ef4444"
                strokeWidth={2}
                dot={{ fill: '#ef4444' }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Event List */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
          <Clock className="h-5 w-5 text-gray-500" />
          Toxicity Events
        </h3>
        <div className="space-y-3">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className={`p-4 rounded-lg border ${
                event.resolved
                  ? 'bg-green-50/30 backdrop-blur-lg border border-green-200/40 hover:shadow-xl transition-all duration-300'
                  : 'bg-white/20 backdrop-blur-lg border border-gray-200/40 hover:shadow-xl transition-all duration-300'
              }`}
            >
              <div className="flex justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">{event.type}</h4>
                  <p className="text-sm text-gray-600">
                    Grade {event.grade} • Cycle {event.cycle} •{' '}
                    {new Date(event.date).toLocaleDateString()}
                  </p>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm ${
                  getGradeSeverityClass(event.grade)}`}>
                  Grade {event.grade}
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-600">{event.description}</p>
              {event.intervention && (
                <div className="mt-2 text-sm">
                  <span className="font-medium text-gray-900">Intervention: </span>
                  <span className="text-gray-600">{event.intervention}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
