import React, { useState } from 'react';
import { Slider } from '../../../components/ui/Slider';
import { LineChart, Clock, Save } from 'lucide-react';
import { supabaseClient as supabase } from '../../../lib/supabase';

interface PainScore {
  score: number;
  timestamp: string;
}

interface AssessmentTool {
  name: string;
  description: string;
  usage: string;
  frequency: string;
}

interface SliderValue {
  value: number[];
  onValueChange: (values: number[]) => void;
  max?: number;
  step?: number;
}

export default function PainAssessment() {
  const [currentScore, setCurrentScore] = useState(0);
  const [painHistory, setPainHistory] = useState<PainScore[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const assessmentTools: AssessmentTool[] = [
    {
      name: 'Numerical Rating Scale (NRS)',
      description: 'Score from 0-10',
      usage: 'Primary tool for verbal patients',
      frequency: 'Every 4 hours and PRN'
    },
    {
      name: 'Visual Analog Scale (VAS)',
      description: '10cm line marking pain intensity',
      usage: 'Alternative to NRS',
      frequency: 'Every shift and PRN'
    },
    {
      name: 'PAINAD Scale',
      description: 'For non-verbal/dementia patients',
      usage: 'Observational assessment',
      frequency: 'Every 4 hours and with interventions'
    }
  ];

  const getPainDescription = (score: number): string => {
    if (score === 0) return 'No pain';
    if (score <= 3) return 'Mild pain';
    if (score <= 6) return 'Moderate pain';
    if (score <= 8) return 'Severe pain';
    return 'Worst possible pain';
  };

  const handleSavePainScore = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('pain_scores')
        .insert([
          {
            score: currentScore,
            timestamp: new Date().toISOString()
          }
        ]);

      if (error) throw error;

      setPainHistory([
        ...painHistory,
        { score: currentScore, timestamp: new Date().toISOString() }
      ]);
    } catch (error) {
      console.error('Error saving pain score:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
      <h3 className="text-lg sm:text-xl font-medium mb-4 sm:mb-6 text-transparent bg-clip-text 
                   bg-gradient-to-r from-blue-600 to-purple-600">
        Pain Assessment Tools
      </h3>
      
      <div className="space-y-6 sm:space-y-8">
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-4 sm:p-6 border border-blue-100">
          <h4 className="font-medium text-blue-900 mb-4">Current Pain Score</h4>
          <div className="space-y-6">
            <Slider
              value={[currentScore]}
              onValueChange={(values: number[]) => setCurrentScore(values[0])}
              max={10}
              step={1}
              className="w-full touch-none"
            />
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div className="text-sm sm:text-base text-gray-600">
                Score: {currentScore} - {getPainDescription(currentScore)}
              </div>
              <button
                onClick={handleSavePainScore}
                disabled={isLoading}
                className={`
                  flex items-center justify-center gap-2 px-4 py-2
                  text-sm font-medium text-white rounded-md 
                  bg-gradient-to-r from-blue-600 to-purple-600
                  hover:from-blue-700 hover:to-purple-700
                  transition-all duration-200 transform hover:scale-[1.02]
                  disabled:opacity-50 disabled:cursor-not-allowed sm:w-auto w-full
                `}
              >
                <Save className="h-4 w-4" />
                Save Score
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          {assessmentTools.map((tool: AssessmentTool) => (
            <div 
              key={tool.name} 
              className="bg-white rounded-lg p-4 sm:p-5 border border-gray-100
                       transition-all duration-200 hover:shadow-md
                       hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50"
            >
              <h4 className="font-medium text-blue-900">{tool.name}</h4>
              <div className="mt-2 space-y-2 text-sm">
                <p className="text-gray-600">
                  <span className="font-medium text-purple-700">Description:</span> {tool.description}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium text-purple-700">Usage:</span> {tool.usage}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium text-purple-700">Frequency:</span> {tool.frequency}
                </p>
              </div>
            </div>
          ))}
        </div>

        {painHistory.length > 0 && (
          <div className="bg-white rounded-lg p-4 border border-blue-100">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-4 w-4 text-blue-600" />
              <h4 className="font-medium text-gray-900">Recent Pain Scores</h4>
            </div>
            <div className="space-y-2">
              {painHistory.slice(-3).map((score: PainScore, idx: number) => (
                <div key={idx} className="flex flex-col sm:flex-row justify-between gap-1 text-sm">
                  <span className="text-gray-600">
                    {new Date(score.timestamp).toLocaleTimeString()}
                  </span>
                  <span className="font-medium text-blue-700">
                    Score: {score.score} - {getPainDescription(score.score)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
