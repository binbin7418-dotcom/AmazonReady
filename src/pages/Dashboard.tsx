import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { LogOut, Upload, CreditCard, History } from 'lucide-react';
import BatchImageUploader from '../components/BatchImageUploader';
import ProcessingHistory from '../components/ProcessingHistory';
import CreditBalance from '../components/CreditBalance';

export default function Dashboard() {
  const { user, profile, signOut } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'upload' | 'history'>('upload');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary">AmazonReady AI</h1>
          
          <div className="flex items-center gap-4">
            <CreditBalance />
            
            <button
              onClick={() => signOut()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* User Info */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold mb-1">Welcome back!</h2>
              <p className="text-gray-600">{user?.email || 'Demo User'}</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Subscription</div>
              <div className="text-lg font-semibold capitalize">
                {profile?.subscription_tier || 'Free'}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'upload'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Upload className="w-4 h-4" />
            Upload Images
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'history'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <History className="w-4 h-4" />
            History
          </button>
        </div>

        {/* Content */}
        {activeTab === 'upload' ? (
          <BatchImageUploader />
        ) : (
          <ProcessingHistory />
        )}

        {/* Upgrade CTA */}
        {(!profile || profile?.subscription_tier === 'free') && (
          <div className="mt-8 bg-gradient-to-r from-primary to-blue-600 rounded-lg shadow-lg p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-2">Need More Credits?</h3>
            <p className="mb-6 opacity-90">Upgrade to process 500+ images per month</p>
            <button className="bg-white text-primary hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors">
              <CreditCard className="w-4 h-4 inline mr-2" />
              Upgrade Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
