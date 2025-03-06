import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation, matchPath } from 'react-router-dom';
import { supabaseClient } from './lib/supabase';
import { User } from '@supabase/supabase-js';
import LandingPage from './components/landing/LandingPage';
import AuthPage from './components/auth/AuthPage';
import Layout from './components/Layout';

// Import all module components
import AIHandbookModule from './components/handbook/AIHandbookModule';
import OPDModule from './components/opd/OPDModule';
import ChemoModule from './components/chemo/ChemoModule';
import InpatientModule from './components/inpatient/InpatientModule';
import PalliativeCareModule from './components/palliative/PalliativeCareModule';
import AIChatTool from './components/tools/AIChatTool';
import FlashcardTool from './components/tools/FlashcardTool';

function DashboardContent() {
  const location = useLocation();
  const match = matchPath(
    '/dashboard/:module/*',
    location.pathname
  );
  const currentModule = match?.params?.module || 'handbook';

  switch (currentModule) {
    case 'handbook':
      return <AIHandbookModule />;
    case 'opd':
      return <OPDModule />;
    case 'chemo':
      return <ChemoModule />;
    case 'inpatient':
      return <InpatientModule />;
    case 'palliative':
      return <PalliativeCareModule />;
    case 'chat':
      return <AIChatTool />;
    case 'flashcards':
      return <FlashcardTool />;
    default:
      return <AIHandbookModule />;
  }
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const match = matchPath(
    '/dashboard/:module/*',
    location.pathname
  );
  const currentModule = match?.params?.module || 'handbook';

  useEffect(() => {
    // Check current auth status
    supabaseClient.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route 
        path="/" 
        element={user ? <Navigate to="/dashboard/handbook" /> : <LandingPage />} 
      />
      <Route 
        path="/auth" 
        element={user ? <Navigate to="/dashboard/handbook" /> : <AuthPage />} 
      />
      <Route
        path="/dashboard/:module/*"
        element={
          user ? (
            <Layout currentModule={currentModule}>
              <DashboardContent />
            </Layout>
          ) : (
            <Navigate to="/auth" />
          )
        }
      />
    </Routes>
  );
}
