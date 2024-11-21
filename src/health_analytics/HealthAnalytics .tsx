import React, { useState, useEffect } from 'react';
import {
    ActivitySquare, Brain, Heart, Clock, Battery, Zap,
    X, Code, Timer, FileCode, AlertCircle, Info,
    Coffee, Target, Workflow, Sparkles, Flame,
    Calculator, ChevronDown, ChevronUp,
    LucideIcon
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import NavBarMinimal from '../NavBar';
import { HealthMetricsService, HealthMetricResult } from './HealthMetricsService';
import { WaterReminder } from './reminders/WaterReminder';
import { BreakReminder } from './reminders/BreakReminder';
import { useSessionMetrics } from './useSessionMetrics';
import { SessionGraph } from './SessionGraph';

interface MetricData {
    title: string;
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
    value: string;
    change: string;
}

const baseMetrics: Record<string, Omit<MetricData, 'value' | 'change'>> = {
    flowState: {
        title: "Flow State",
        icon: Brain,
        category: "Mental State",
        description: "Your deep focus and coding rhythm metrics.",
        impact: "Flow state is your peak performance zone where coding feels effortless and time flies.",
        calculation: {
            formula: "flowScore = (focusTime * 0.4) + (typingConsistency * 0.3) + (codeQuality * 0.3)",
            factors: [
                "Duration of uninterrupted coding",
                "Consistency in typing patterns",
                "Code complexity changes",
                "Context switches frequency"
            ],
            frequency: "Updated in real-time"
        },
        tips: [
            "Block notifications during deep work sessions",
            "Use noise-canceling headphones",
            "Break large tasks into focused sprints"
        ],
        bgColor: "bg-gradient-to-br from-indigo-950 to-indigo-900",
        animation: "animate-pulse"
    },
    codeQuality: {
        title: "Code Quality",
        icon: FileCode,
        category: "Performance",
        description: "Analysis of code structure and maintainability.",
        impact: "High-quality code reduces debugging time and improves collaboration.",
        calculation: {
            formula: "qualityScore = (complexity * 0.4) + (consistency * 0.3) + (patterns * 0.3)",
            factors: [
                "Code complexity metrics",
                "Pattern consistency",
                "Error rates",
                "Documentation quality"
            ],
            frequency: "Updated after each save"
        },
        tips: [
            "Review code before commits",
            "Write comprehensive tests",
            "Maintain consistent style",
            "Document complex logic"
        ],
        bgColor: "bg-gradient-to-br from-emerald-950 to-emerald-900"
    },
    focusScore: {
        title: "Focus Score",
        icon: Target,
        category: "Productivity",
        description: "Measurement of concentrated coding time.",
        impact: "High focus leads to faster problem-solving and fewer errors.",
        calculation: {
            formula: "focusScore = (sessionLength * 0.4) + (continuousWork * 0.3) + (mentalClarity * 0.3)",
            factors: [
                "Session duration",
                "Break patterns",
                "Context switching",
                "Distraction metrics"
            ],
            frequency: "Updated every minute"
        },
        tips: [
            "Use Pomodoro technique",
            "Create a dedicated workspace",
            "Minimize interruptions",
            "Take regular breaks"
        ],
        bgColor: "bg-gradient-to-br from-blue-950 to-blue-900"
    },
    codingRhythm: {
        title: "Coding Rhythm",
        icon: Workflow,
        category: "Performance",
        description: "Analysis of your coding flow and consistency.",
        impact: "Good rhythm leads to more efficient code writing and fewer errors.",
        calculation: {
            formula: "rhythmScore = (typingSpeed * 0.3) + (consistency * 0.4) + (errorRate * 0.3)",
            factors: [
                "Typing speed patterns",
                "Code flow consistency",
                "Error correction rate",
                "Command usage efficiency"
            ],
            frequency: "Updated in real-time"
        },
        tips: [
            "Practice touch typing",
            "Learn keyboard shortcuts",
            "Use code snippets",
            "Master IDE features"
        ],
        bgColor: "bg-gradient-to-br from-cyan-950 to-cyan-900"
    },
    codingStreak: {
        title: "Coding Streak",
        icon: Flame,
        category: "Achievement",
        description: "Your continuous coding session metrics.",
        impact: "Long focused sessions often lead to breakthrough solutions.",
        calculation: {
            formula: "streakScore = (duration * 0.4) + (quality * 0.3) + (efficiency * 0.3)",
            factors: [
                "Session duration",
                "Code quality",
                "Problem-solving rate",
                "Break optimization"
            ],
            frequency: "Updated continuously"
        },
        tips: [
            "Build streak length gradually",
            "Prepare environment beforehand",
            "Stay hydrated",
            "Document breakthroughs"
        ],
        bgColor: "bg-gradient-to-br from-pink-950 to-pink-900",
        animation: "animate-pulse"
    }
};

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

const MetricCard: React.FC<MetricCardProps> = ({
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

const HealthAnalytics = () => {
    const [showInfo, setShowInfo] = useState<string | null>(null);
    const [metrics, setMetrics] = useState<Record<string, HealthMetricResult>>({});
    const [updateCounter, setUpdateCounter] = useState(0);

    useEffect(() => {
        updateMetrics();
        const intervalId = setInterval(() => {
            setUpdateCounter(prev => prev + 1);
        }, 60000);
        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        updateMetrics();
    }, [updateCounter]);

    const updateMetrics = () => {
        const newMetrics = HealthMetricsService.calculateAllMetrics();
        setMetrics(newMetrics);
    };

    const formatValue = (metric: HealthMetricResult) => {
        if (typeof metric.value === 'number') {
            return `${metric.value.toFixed(1)}%`;
        }
        return metric.value;
    };

    const getMetricCards = () => {
        return Object.entries(metrics).map(([key, metricResult]) => {
            const baseMetric = baseMetrics[key];
            if (!baseMetric) return null;
            return {
                ...baseMetric,
                value: formatValue(metricResult),
                change: metricResult.change || 'No change',
            } as MetricData;
        }).filter((metric): metric is MetricData => metric !== null);
    };

    return (
        <div className="min-h-screen bg-[#0D1117] pb-24">
            <NavBarMinimal />

            <main className="container mx-auto px-4 py-6 space-y-8">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-800 rounded-lg">
                            <ActivitySquare className="w-6 h-6 text-gray-400" />
                        </div>
                        <div>
                            <h1 className="text-xl font-medium text-white">Developer Health Analytics</h1>
                            <p className="text-sm text-gray-400">Your personalized coding wellness dashboard</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-min">
                    {/* First three metric cards */}
                    {getMetricCards().slice(0, 3).map((metric, index) => (
                        <MetricCard
                            key={index}
                            {...metric}
                            onInfoToggle={setShowInfo}
                            isInfoVisible={showInfo === metric.title}
                        />
                    ))}

                    {/* Fourth column with focus card and timers */}
                    <div className="space-y-4">
                        {getMetricCards()[3] && (
                            <MetricCard
                                {...getMetricCards()[3]}
                                onInfoToggle={setShowInfo}
                                isInfoVisible={showInfo === getMetricCards()[3].title}
                            />
                        )}
                        <div className="flex gap-4">
                            <WaterReminder />
                            <BreakReminder />
                        </div>
                    </div>

                    {/* Fifth column with taller coding streak card */}
                    {getMetricCards()[4] && (
                        <MetricCard
                            {...getMetricCards()[4]}
                            onInfoToggle={setShowInfo}
                            isInfoVisible={showInfo === getMetricCards()[4].title}
                        />)}
                </div>
            </main>
        </div>
    );
};

// Utility type for strict type checking of metric keys
type MetricKey = keyof typeof baseMetrics;

// Additional types for better type safety
interface ExtendedHealthMetricResult extends HealthMetricResult {
    details?: {
        sessionCount?: number;
        totalDuration?: number;
        averageDuration?: number;
    };
}

// Export the component
export default HealthAnalytics;