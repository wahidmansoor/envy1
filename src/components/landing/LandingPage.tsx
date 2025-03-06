import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    console.log('Navigating to auth page');
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        {/* Hero Section */}
        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight mb-8">
            <span className="gradient-text">
              OncoGPTassisT
            </span>{' '}
            Platform
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-gray-500 mb-10">
            Empowering oncology professionals with AI-powered tools,
            clinical guidelines, and comprehensive patient management.
          </p>
          <div className="flex justify-center gap-4 mb-20">
            <button
              onClick={handleGetStarted}
              className="button-hover px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium 
                hover:bg-indigo-700 active:bg-indigo-800 transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Get Started
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-20">
          <FeatureCard
            icon="📚"
            title="AI-Powered Handbook"
            description="Access intelligent clinical guidelines and medical resources."
          />
          <FeatureCard
            icon="👥"
            title="Patient Management"
            description="Streamline patient evaluations and treatment planning."
          />
          <FeatureCard
            icon="💊"
            title="Chemotherapy Tools"
            description="Comprehensive chemotherapy management and monitoring."
          />
        </div>
      </div>
    </div>
  );
}

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="feature-card p-6 bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500">{description}</p>
    </div>
  );
}