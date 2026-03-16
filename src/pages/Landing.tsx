import { CheckCircle, Zap, Shield, TrendingUp } from 'lucide-react';

interface LandingProps {
  onGetStarted: () => void;
}

export default function Landing({ onGetStarted }: LandingProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Stop Getting Your Amazon Listings <span className="text-primary">Rejected</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Auto-format product photos to Amazon's exact specs (RGB 255,255,255 + 85% frame) in 3 seconds
          </p>
          <button
            onClick={onGetStarted}
            className="bg-primary hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors shadow-lg hover:shadow-xl"
          >
            Start Free - 20 Images
          </button>
          <p className="text-sm text-gray-500 mt-4">No credit card required</p>
        </div>

        {/* Problem Section */}
        <div className="mt-20 bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <h2 className="text-3xl font-bold text-center mb-8">The Problem</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-red-500 mb-2">40%</div>
              <p className="text-gray-600">of sellers waste hours fixing rejected images</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-red-500 mb-2">$50-200</div>
              <p className="text-gray-600">per product for professional photography</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-red-500 mb-2">10 min</div>
              <p className="text-gray-600">manual Photoshop editing per image</p>
            </div>
          </div>
        </div>

        {/* Solution Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center mb-12">The Solution</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              icon={<Zap className="w-8 h-8 text-primary" />}
              title="3 Second Processing"
              description="Upload → AI removes background → Auto-format → Download"
            />
            <FeatureCard
              icon={<CheckCircle className="w-8 h-8 text-green-500" />}
              title="Amazon Compliant"
              description="Guaranteed RGB(255,255,255) white background + 85% frame"
            />
            <FeatureCard
              icon={<TrendingUp className="w-8 h-8 text-purple-500" />}
              title="Batch Processing"
              description="Process 100 images in 5 minutes, not 16 hours"
            />
            <FeatureCard
              icon={<Shield className="w-8 h-8 text-blue-500" />}
              title="Compliance Check"
              description="Auto-verify all Amazon requirements before download"
            />
          </div>
        </div>

        {/* Pricing Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center mb-12">Simple Pricing</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <PricingCard
              name="Starter"
              price="$19"
              period="/month"
              credits="500 images"
              features={[
                'Batch processing',
                'Compliance reports',
                'Email support',
              ]}
              popular={false}
            />
            <PricingCard
              name="Pro"
              price="$49"
              period="/month"
              credits="2000 images"
              features={[
                'Everything in Starter',
                'Priority processing',
                'API access',
                'Priority support',
              ]}
              popular={true}
            />
            <PricingCard
              name="Enterprise"
              price="$199"
              period="/month"
              credits="Unlimited"
              features={[
                'Everything in Pro',
                'White-label service',
                'Dedicated support',
                'Custom integrations',
              ]}
              popular={false}
            />
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center bg-primary text-white rounded-2xl p-12">
          <h2 className="text-3xl font-bold mb-4">Ready to Stop Wasting Time?</h2>
          <p className="text-xl mb-8 opacity-90">Join 500+ sellers who trust AmazonReady AI</p>
          <button
            onClick={onGetStarted}
            className="bg-white text-primary hover:bg-gray-100 px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
          >
            Start Free Trial
          </button>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
      <div className="mb-4">{icon}</div>
      <h3 className="font-bold text-lg mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
}

function PricingCard({ name, price, period, credits, features, popular }: {
  name: string;
  price: string;
  period: string;
  credits: string;
  features: string[];
  popular: boolean;
}) {
  return (
    <div className={`bg-white rounded-xl shadow-lg p-8 ${popular ? 'ring-2 ring-primary scale-105' : ''}`}>
      {popular && (
        <div className="bg-primary text-white text-sm font-bold px-3 py-1 rounded-full inline-block mb-4">
          Most Popular
        </div>
      )}
      <h3 className="text-2xl font-bold mb-2">{name}</h3>
      <div className="mb-4">
        <span className="text-4xl font-bold">{price}</span>
        <span className="text-gray-600">{period}</span>
      </div>
      <p className="text-gray-600 mb-6">{credits}</p>
      <ul className="space-y-3 mb-8">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <span className="text-sm">{feature}</span>
          </li>
        ))}
      </ul>
      <button className="w-full bg-primary hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors">
        Get Started
      </button>
    </div>
  );
}
