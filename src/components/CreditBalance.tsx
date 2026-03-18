import { Coins } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function CreditBalance() {
  const { profile } = useAuthStore();
  const credits = profile?.credits_balance ?? 0;
  const isUnlimited = credits === 999999;

  return (
    <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-lg">
      <Coins className="w-5 h-5 text-green-600" />
      <div>
        <div className="text-xs text-gray-600">Credits</div>
        <div className="text-lg font-bold text-green-600">
          {isUnlimited ? '∞' : credits}
        </div>
      </div>
    </div>
  );
}
