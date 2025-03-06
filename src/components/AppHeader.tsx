import React, { useState, useEffect } from 'react';
import { Menu, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabaseClient } from '../lib/supabase';
import { RibbonIcon } from '../assets/icons/RibbonIcon';

interface Props {
  onOpenSidebar: () => void;
}

function useCurrentTime() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  return time;
}

export default function AppHeader({ onOpenSidebar }: Props) {
  const navigate = useNavigate();
  const currentTime = useCurrentTime();
  const [userData, setUserData] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabaseClient.auth.getUser();
      setUserData(user?.email || null);
    };
    
    fetchUser();
  }, []);
  
  const handleSignOut = async () => {
    await supabaseClient.auth.signOut();
    navigate('/auth');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 shadow-sm">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onOpenSidebar}
              className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors lg:hidden"
              aria-label="Open tools"
            >
              <Menu className="h-6 w-6" />
            </button>

            <div className="bg-indigo-50 rounded-lg px-4 py-2 flex items-center gap-3">
              <div className="text-indigo-600">
                <RibbonIcon />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">
                  Onco<span className="text-indigo-500">GPTassisT</span>
                </h1>
                <p className="text-sm text-indigo-500">
                  Advanced Oncology Support System
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <h1 className="text-sm font-semibold text-gray-900">
                Welcome, {userData ? userData.split('@')[0] : 'User'}
              </h1>
              <p className="text-sm text-indigo-500">
                {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-3 py-2 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
              aria-label="Sign out"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
