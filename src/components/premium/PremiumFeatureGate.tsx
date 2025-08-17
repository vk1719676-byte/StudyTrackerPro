import React, { useState } from 'react';
import { Lock, Crown, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { PremiumModal } from './PremiumModal';

interface PremiumFeatureGateProps {
  children: React.ReactNode;
  featureName: string;
  description?: string;
  showUpgradeButton?: boolean;
  className?: string;
}

export const PremiumFeatureGate: React.FC<PremiumFeatureGateProps> = ({
  children,
  featureName,
  description,
  showUpgradeButton = true,
  className = ''
}) => {
  const { isPremium } = useAuth();
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  if (isPremium) {
    return <>{children}</>;
  }

  return (
    <>
      <div className={`relative ${className}`}>
        {/* Blurred content */}
        <div className="filter blur-sm pointer-events-none select-none">
          {children}
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-blue-500/20 to-indigo-500/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
          <div className="text-center p-6 bg-white/90 dark:bg-gray-800/90 rounded-xl shadow-lg border border-purple-200 dark:border-purple-700 max-w-sm">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <Sparkles className="w-5 h-5 text-purple-500 animate-pulse" />
            </div>
            
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
              Premium Feature
            </h3>
            
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              <strong>{featureName}</strong>
            </p>
            
            {description && (
              <p className="text-xs text-gray-500 dark:text-gray-500 mb-4">
                {description}
              </p>
            )}

            {showUpgradeButton && (
              <Button
                onClick={() => setShowPremiumModal(true)}
                size="sm"
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                icon={Crown}
              >
                Upgrade to Premium
              </Button>
            )}
          </div>
        </div>
      </div>

      <PremiumModal
        isOpen={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
        onUpgradeSuccess={() => {
          // Refresh the page or update state to show the unlocked feature
          window.location.reload();
        }}
      />
    </>
  );
};