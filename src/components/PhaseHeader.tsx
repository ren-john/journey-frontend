'use client';

import { motion } from 'framer-motion';
import type { LifePhase } from '@/lib/types';

interface PhaseHeaderProps {
    phase: LifePhase;
    index: number;
}

export default function PhaseHeader({ phase, index }: PhaseHeaderProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="mb-8 mt-12 first:mt-0"
        >
            <div className={`inline-flex items-center gap-3 ${phase.bgColor} px-6 py-3 rounded-full border-2 ${phase.color.replace('text-', 'border-')}`}>
                <div className={`w-3 h-3 ${phase.color.replace('text-', 'bg-')} rounded-full`} />
                <div>
                    <h2 className={`${phase.color} font-bold uppercase tracking-wider text-sm`}>
                        {phase.name}
                    </h2>
                    <p className="text-xs text-gray-600">{phase.ageRange}</p>
                </div>
            </div>
        </motion.div>
    );
}
