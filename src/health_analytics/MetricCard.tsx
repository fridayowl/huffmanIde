import React, { useState } from 'react';
import { X, Info, Sparkles, Calculator, ChevronDown, ChevronUp, Flame, LucideIcon } from 'lucide-react';
import { useSessionMetrics } from './useSessionMetrics';
import { SessionGraph } from './SessionGraph';

interface MetricCardProps {
    title: string;
    value: string;
    change: string;
    icon: LucideIcon;
    description: string;
    impact: string;
    tips: string[];
    calculation: {
        formula: string;
        factors: string[];
        frequency: string;
    };
    bgColor: string;
    category: string;
    animation?: string;
    onInfoToggle: (title: string | null) => void;
    isInfoVisible: boolean;
}

export const MetricCard: React.FC<MetricCardProps> = ({
    title,
    value,
    change,
    icon: Icon,
    description,
    impact,
    tips,
    calculation,
    category,
    bgColor,
    onInfoToggle,
    isInfoVisible,
    animation
}) => {
    const [showCalculation, setShowCalculation] = useState(false);
    const sessionData = useSessionMetrics();
    const isCodingStreak = title === "Coding Streak";

    return (
        <div className={`${bgColor} ${animation} p-5 rounded-xl border border-white/5 backdrop-blur-sm 
            transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-gray-800/20 
            ${isCodingStreak ? 'lg:row-span-2' : ''}`}>
            <div className="flex items-start justify-between mb-4">
                <div className="flex flex-col">
                    <div className="p-2 bg-white/5 rounded-lg w-fit">
                        <Icon className="w-5 h-5 text-white/80" />
                    </div>
                    <div className="mt-2">
                        <p className="text-xs text-gray-400 font-medium">{category}</p>
                        <h3 className="text-base font-medium text-gray-200 mt-0.5 line-clamp-1">{title}</h3>
                    </div>
                </div>
                <button
                    onClick={() => onInfoToggle(isInfoVisible ? null : title)}
                    className="p-1.5 hover:bg-white/5 rounded-lg transition-colors"
                >
                    {isInfoVisible ? (
                        <X className="w-4 h-4 text-gray-400" />
                    ) : (
                        <Info className="w-4 h-4 text-gray-400" />
                    )}
                </button>
            </div>

            <div className="flex-1">
                {!isInfoVisible ? (
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <div className="text-3xl font-semibold text-white">{value}</div>
                            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-white/5">
                                <Sparkles className="w-3 h-3 text-gray-300" />
                                <span className="text-xs text-gray-300">{change}</span>
                            </div>
                        </div>
                        <p className="text-sm text-gray-400 leading-relaxed line-clamp-3">
                            {description}
                        </p>
                        {isCodingStreak && <SessionGraph data={sessionData} />}
                    </div>
                ) : (
                    <div className="space-y-3">
                        <div>
                            <div className="text-xs font-medium text-gray-300 mb-1">Why it matters</div>
                            <p className="text-xs text-gray-400 leading-relaxed">{impact}</p>
                        </div>

                        <div>
                            <button
                                onClick={() => setShowCalculation(!showCalculation)}
                                className="flex items-center justify-between w-full text-xs font-medium text-gray-300 mb-1 hover:text-gray-200"
                            >
                                <div className="flex items-center gap-1.5">
                                    <Calculator className="w-3 h-3" />
                                    <span>How it's calculated</span>
                                </div>
                                {showCalculation ? (
                                    <ChevronUp className="w-3 h-3" />
                                ) : (
                                    <ChevronDown className="w-3 h-3" />
                                )}
                            </button>
                            {showCalculation && (
                                <div className="bg-black/20 rounded-lg p-3 space-y-2 mt-2">
                                    <p className="text-xs text-gray-400 font-mono">{calculation.formula}</p>
                                    <div className="space-y-1">
                                        <p className="text-xs text-gray-500">Factors considered:</p>
                                        <ul className="space-y-1">
                                            {calculation.factors.map((factor, index) => (
                                                <li key={index} className="flex items-start gap-1.5">
                                                    <span className="text-gray-500 text-xs">•</span>
                                                    <span className="text-xs text-gray-400">{factor}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        Updated: {calculation.frequency}
                                    </p>
                                </div>
                            )}
                        </div>

                        <div>
                            <div className="text-xs font-medium text-gray-300 mb-1">Tips to improve</div>
                            <ul className="space-y-2">
                                {tips.map((tip, index) => (
                                    <li key={index} className="flex items-start gap-1.5">
                                        <Flame className="w-3 h-3 text-gray-500 mt-0.5 flex-shrink-0" />
                                        <span className="text-xs text-gray-400 leading-relaxed">{tip}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};