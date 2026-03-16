import { useEffect, useState } from 'react';
import { Coins } from 'lucide-react';
import { getCredits } from '../services/storageService';

export default function CreditBalance() {
  const [credits, setCredits] = useState(getCredits());

  useEffect(() => {
    // Update credits every second
    const interval = setInterval(() => {
      setCredits(getCredits());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-lg">
      <Coins className="w-5 h-5 text-green-600" />
      <div>
        <div className="text-xs text-gray-600">Credits</div>
        <div className="text-lg font-bold text-green-600">{credits}</div>
      </div>
    </div>
  );
}
