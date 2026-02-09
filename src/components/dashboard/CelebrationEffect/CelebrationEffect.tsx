'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { useWindowSize } from '@/hooks/use-window-size';
import { ROLE_COLORS, ROLE_LABELS, type RoleKey } from '@/lib/constants/questionnaire';

const Confetti = dynamic(() => import('react-confetti'), { ssr: false });

const ROLE_KEYS: RoleKey[] = ['apostle', 'prophet', 'evangelist', 'herder', 'teacher'];
const DEFAULT_COLORS = ['#22c55e', '#3b82f6', '#f97316', '#8b5cf6', '#ef4444'];

function getRoleKeyFromLabel(primaryRole: string | null): RoleKey | null {
  if (!primaryRole) return null;
  const lower = primaryRole.toLowerCase().trim();
  if (ROLE_KEYS.includes(lower as RoleKey)) return lower as RoleKey;
  const entry = Object.entries(ROLE_LABELS).find(([, label]) => label === primaryRole);
  return entry ? (entry[0] as RoleKey) : null;
}

function getPrimaryColors(primaryRole: string | null): string[] {
  const roleKey = getRoleKeyFromLabel(primaryRole);
  if (!roleKey) return DEFAULT_COLORS;
  const color = ROLE_COLORS[roleKey];
  if (!color) return DEFAULT_COLORS;
  return [
    color,
    color,
    '#ffffff',
    color,
    color,
  ];
}

export interface CelebrationEffectProps {
  show: boolean;
  onComplete?: () => void;
  primaryRole?: string | null;
  message?: string;
}

export default function CelebrationEffect({
  show,
  onComplete,
  primaryRole,
  message = 'Gefeliciteerd! Je beoordeling is voltooid.',
}: CelebrationEffectProps) {
  const [isActive, setIsActive] = useState(false);
  const { width, height } = useWindowSize();

  useEffect(() => {
    if (show) {
      setIsActive(true);
      const timer = setTimeout(() => {
        setIsActive(false);
        onComplete?.();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  const handleContinue = () => {
    setIsActive(false);
    onComplete?.();
  };

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[100] bg-black/20 backdrop-blur-sm">
      {typeof window !== 'undefined' && width > 0 && height > 0 && (
        <Confetti
          width={width}
          height={height}
          numberOfPieces={300}
          gravity={0.15}
          colors={getPrimaryColors(primaryRole ?? null)}
          recycle={false}
        />
      )}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
        className="bg-white p-8 rounded-xl shadow-lg max-w-md text-center relative z-10"
      >
        <motion.div
          initial={{ rotate: -5 }}
          animate={{ rotate: [0, 5, 0, -5, 0] }}
          transition={{ duration: 0.5, repeat: 5, repeatType: 'reverse' }}
          className="mb-4 mx-auto"
        >
          <span className="text-5xl" role="img" aria-label="feest">
            🎉
          </span>
        </motion.div>
        <h2 className="text-2xl font-bold mb-2 text-gray-900">{message}</h2>
        {primaryRole && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-gray-600 mb-4"
          >
            Je primaire bediening is <span className="font-semibold">{primaryRole}</span>
          </motion.p>
        )}
        <motion.button
          type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-[#0F3728] hover:opacity-90 text-white font-medium py-2 px-6 rounded-lg"
          onClick={handleContinue}
        >
          Ga verder
        </motion.button>
      </motion.div>
    </div>
  );
}
