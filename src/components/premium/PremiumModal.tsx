import React, { useState, useEffect } from 'react';
import { X, Crown, Check, Star, Zap, Shield, Brain, BarChart3, Download, Sparkles, Clock, Target, Trophy, AlertCircle } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { loadRazorpayScript, createRazorpayOrder, verifyPayment, RAZORPAY_KEY } from '../../lib/razorpay';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { PremiumPlan } from '../../types';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgradeSuccess?: () => void;
}

const PREMIUM_PLANS: PremiumPlan[] = [
  {
    id: 'monthly',
    name: 'Monthly',
    price: 20,
    duration: 1,
    features: [
      'AI-Powered Study Insights',
      'Advanced Analytics Dashboard',
      'Unlimited Study Materials Upload',
      'Smart Study Reminders',
      'Export Study Data',
      'Priority Customer Support',
      'Ad-Free Experience',
      'Focus Mode with Lofi Music'
    ]
  },
  {
    id: 'halfyearly',
    name: '6 Months',
    price: 100,
    duration: 6,
    popular: true,
    features: [
      'All Monthly Features',
      'AI Study Plan Generator',
      'Advanced Progress Tracking',
      'Personalized Study Recommendations',
      'Bulk Material Processing',
      'Custom Study Goals',
      'Performance Predictions',
      '50% Cost Savings'
    ]
  },
  {
    id: 'yearly',
    name: 'Yearly',
    price: 160,
    duration: 12,
    features: [
      'All 6-Month Features',
      'Premium AI Tutor Chat',
      'Advanced OCR for Documents',
      'Study Group Management',
      'Detailed Performance Reports',
      'Custom Branding Options',
      'API Access for Developers',
      '67% Cost Savings'
    ]
  }
];

const PREMIUM_FEATURES = [
  {
    icon: Brain,
    title: 'AI-Powered Insights',
    description: 'Get personalized study recommendations based on your learning patterns',
    color: 'text-purple-600'
  },
  {
    icon: BarChart3,
    title: 'Advanced Analytics',
    description: 'Detailed performance tracking with predictive insights',
    color: 'text-blue-600'
  },
  {
    icon: Download,
    title: 'Export & Backup',
    description: 'Export your study data and create backups anytime',
    color: 'text-green-600'
  },
  {
    icon: Shield,
    title: 'Priority Support',
    description: '24/7 premium support with faster response times',
    color: 'text-orange-600'
  },
  {
    icon: Zap,
    title: 'Smart Automation',
    description: 'Automated study schedules and intelligent reminders',
    color: 'text-yellow-600'
  },
  {
    icon: Sparkles,
    title: 'Ad-Free Experience',
    description: 'Enjoy distraction-free studying without any advertisements',
    color: 'text-pink-600'
  }
];

export const PremiumModal: React.FC<PremiumModalProps> = ({ isOpen, onClose, onUpgradeSuccess }) => {
  const [selectedPlan, setSelectedPlan] = useState<string>('halfyearly');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user, refreshUserData } = useAuth();

  useEffect(() => {
    if (isOpen) {
      loadRazorpayScript();
    }
  }, [isOpen]);

  const handleUpgrade = async (planId: string) => {
    if (!user) return;

    setLoading(true);
    setError('');

    try {
      const plan = PREMIUM_PLANS.find(p => p.id === planId);
      if (!plan) throw new Error('Plan not found');

      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Failed to load payment gateway');
      }

      // Create order
      const order = await createRazorpayOrder(plan.price, planId, user.uid);

      // Configure Razorpay options
      const options = {
        key: RAZORPAY_KEY,
        amount: order.amount,
        currency: order.currency,
        name: 'Study Tracker Pro',
        description: `${plan.name} Premium Subscription`,
        order_id: order.id,
        handler: async (response: any) => {
          try {
            // Verify payment
            const verification = await verifyPayment(
              response.razorpay_payment_id,
              response.razorpay_order_id,
              response.razorpay_signature,
              planId,
              user.uid
            );

            if (verification.success) {
              // Update user's premium status in Firestore
              const userRef = doc(db, 'users', user.uid);
              await updateDoc(userRef, {
                isPremium: true,
                premiumPlan: planId,
                premiumExpiresAt: verification.expiresAt,
                subscriptionId: verification.subscriptionId,
                upgradedAt: new Date()
              });

              // Refresh user data
              await refreshUserData();

              // Show success
              onUpgradeSuccess?.();
              onClose();
            } else {
              throw new Error('Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            setError('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: user.displayName || '',
          email: user.email,
          contact: ''
        },
        theme: {
          color: '#7c3aed'
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
          }
        }
      };

      // Open Razorpay checkout
      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error: any) {
      console.error('Upgrade error:', error);
      setError(error.message || 'Failed to process upgrade');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="relative">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white p-6 rounded-t-xl">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Crown className="w-8 h-8 text-yellow-400" />
                <h2 className="text-3xl font-bold">Upgrade to Premium</h2>
              </div>
              <p className="text-purple-100 text-lg">
                Unlock advanced features and supercharge your study sessions
              </p>
            </div>
          </div>

          <div className="p-6">
            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <p className="text-red-600 dark:text-red-400">{error}</p>
                </div>
              </div>
            )}

            {/* Premium Features Grid */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 text-center">
                Premium Features
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {PREMIUM_FEATURES.map((feature, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-lg p-4 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm`}>
                        <feature.icon className={`w-5 h-5 ${feature.color}`} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                          {feature.title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing Plans */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6 text-center">
                Choose Your Plan
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {PREMIUM_PLANS.map((plan) => (
                  <div
                    key={plan.id}
                    className={`relative rounded-xl border-2 transition-all duration-200 hover:shadow-lg ${
                      plan.popular
                        ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20'
                        : selectedPlan === plan.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                          <Star className="w-3 h-3" />
                          Most Popular
                        </span>
                      </div>
                    )}

                    <div className="p-6">
                      <div className="text-center mb-6">
                        <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                          {plan.name}
                        </h4>
                        <div className="mb-2">
                          <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                            ₹{plan.price}
                          </span>
                          <span className="text-gray-600 dark:text-gray-400">
                            /{plan.duration === 1 ? 'month' : `${plan.duration} months`}
                          </span>
                        </div>
                        {plan.duration > 1 && (
                          <div className="text-sm text-green-600 dark:text-green-400 font-medium">
                            Save ₹{(20 * plan.duration) - plan.price}
                          </div>
                        )}
                      </div>

                      <ul className="space-y-3 mb-6">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>

                      <Button
                        onClick={() => handleUpgrade(plan.id)}
                        disabled={loading}
                        className={`w-full ${
                          plan.popular
                            ? 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600'
                            : ''
                        }`}
                      >
                        {loading ? (
                          <div className="flex items-center gap-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                            Processing...
                          </div>
                        ) : (
                          `Upgrade to ${plan.name}`
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Security & Trust */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Shield className="w-5 h-5 text-green-600" />
                <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                  Secure Payment with Razorpay
                </h4>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Your payment information is encrypted and secure. We use industry-standard security measures.
              </p>
              <div className="flex items-center justify-center gap-4 text-xs text-gray-500 dark:text-gray-500">
                <span>🔒 SSL Encrypted</span>
                <span>💳 All Cards Accepted</span>
                <span>🏦 Net Banking</span>
                <span>📱 UPI Supported</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};