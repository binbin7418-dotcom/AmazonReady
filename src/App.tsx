import { useEffect, useState } from 'react';
import { useAuthStore } from './store/authStore';
import { Toaster } from 'sonner';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Auth from './pages/Auth';
import { initializeUser } from './services/storageService';

function App() {
  const { user, initialized, initialize } = useAuthStore();
  const [showAuth, setShowAuth] = useState(false);
  const [demoMode, setDemoMode] = useState(false);

  useEffect(() => {
    initialize();
    // Initialize demo user data
    initializeUser();
  }, [initialize]);

  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Demo mode or logged in user
  if (user || demoMode) {
    return (
      <>
        <Toaster position="top-center" richColors />
        <Dashboard />
      </>
    );
  }

  if (showAuth) {
    return (
      <>
        <Toaster position="top-center" richColors />
        <div className="relative">
          <Auth onBack={() => setShowAuth(false)} />
          {/* Demo Mode Button */}
          <div className="fixed bottom-8 right-8">
            <button
              onClick={() => setDemoMode(true)}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition-colors"
            >
              Try Demo (No Login Required)
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Toaster position="top-center" richColors />
      <Landing onGetStarted={() => setShowAuth(true)} />
    </>
  );
}

export default App;
