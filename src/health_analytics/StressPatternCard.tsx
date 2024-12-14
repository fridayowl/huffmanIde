import React, { useState, useEffect } from 'react';
import { AlertTriangle, Activity, Brain, RefreshCw, ChevronDown, ChevronUp, X, Info } from 'lucide-react';
import { StressPatternService, StressAnalysis } from './StressPatternService';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface StressPatternCardProps {
    onInfoToggle: (title: string | null) => void;
    isInfoVisible: boolean;
}

export default function StressPatternCard({ onInfoToggle, isInfoVisible }: StressPatternCardProps) {
    const [analysis, setAnalysis] = useState<StressAnalysis | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showDetails, setShowDetails] = useState(false);

    const updateAnalysis = async () => {
        setIsLoading(true);
        try {
            const newAnalysis = await StressPatternService.analyzeStressPatterns();
            setAnalysis(newAnalysis);
        } catch (error) {
            console.error('Error updating stress analysis:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const savedAnalysis = StressPatternService.getLastAnalysis();
        if (savedAnalysis) {
            setAnalysis(savedAnalysis);
        } else {
            updateAnalysis();
        }

        const intervalId = setInterval(updateAnalysis, 5 * 60 * 1000);
        return () => clearInterval(intervalId);
    }, []);

    const getStressLevelColor = (level: string) => {
        switch (level) {
            case 'low': return 'text-green-500';
            case 'moderate': return 'text-yellow-500';
            case 'high': return 'text-red-500';
            default: return 'text-gray-500';
        }
    };

    const getStressLevelBg = (level: string) => {
        switch (level) {
            case 'low': return 'bg-green-500/20';
            case 'moderate': return 'bg-yellow-500/20';
            case 'high': return 'bg-red-500/20';
            default: return 'bg-gray-500/20';
        }
    };

    if (isLoading) {
        return (
            <div className="relative h-full bg-transparent p-6 rounded-xl">
                {/* AI Processing Indicator */}
                <div className="mb-4 bg-blue-500/10 border border-blue-400/20 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
                            <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse delay-75" />
                            <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse delay-150" />
                        </div>
                        <p className="text-sm text-blue-200">
                            Analyzing with <span className="font-semibold">Gemini-1.5-flash-002</span>
                        </p>
                    </div>
                </div>

                <div className="flex items-start justify-between mb-6">
                    <div className="flex flex-col">
                        <div className="p-2 bg-white/5 rounded-lg w-fit animate-pulse">
                            <Brain className="w-5 h-5 text-gray-300" />
                        </div>
                        <div className="mt-2">
                            <p className="text-xs text-gray-400 font-medium">Mental Health</p>
                            <h3 className="text-lg font-medium text-gray-200">Stress Patterns</h3>
                        </div>
                    </div>
                </div>

                {/* Loading Placeholder Content */}
                <div className="space-y-6">
                    <div className="h-20 bg-white/5 rounded-lg animate-pulse" />
                    <div className="space-y-4">
                        <div className="h-40 bg-white/5 rounded-lg animate-pulse" />
                        <div className="space-y-2">
                            <div className="h-6 w-1/3 bg-white/5 rounded animate-pulse" />
                            <div className="h-4 w-full bg-white/5 rounded animate-pulse" />
                            <div className="h-4 w-2/3 bg-white/5 rounded animate-pulse" />
                        </div>
                    </div>
                    <div className="text-xs text-gray-400 animate-pulse">
                        Analyzing stress patterns...
                    </div>
                </div>
            </div>
        );
    }

    if (!analysis) return null;

    return (
        <div className="relative h-full bg-transparent p-6 rounded-xl">
            {/* Gemini Attribution */}
            <div className="mb-4 bg-white/5 border border-white/10 rounded-lg p-3">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                    <p className="text-sm text-gray-200">
                        Analysis by <span className="font-semibold">Gemini-1.5-flash-002</span>
                    </p>
                </div>
            </div>

            <div className="flex items-start justify-between mb-6">
                <div className="flex flex-col">
                    <div className="p-2 bg-white/5 rounded-lg w-fit">
                        <Brain className="w-5 h-5 text-gray-300" />
                    </div>
                    <div className="mt-2">
                        <p className="text-xs text-gray-400 font-medium">Mental Health</p>
                        <h3 className="text-lg font-medium text-gray-200">Stress Patterns</h3>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => updateAnalysis()}
                        className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                        disabled={isLoading}
                    >
                        <RefreshCw className={`w-4 h-4 text-gray-300 ${isLoading ? 'animate-spin' : ''}`} />
                    </button>
                    <button
                        onClick={() => onInfoToggle(isInfoVisible ? null : 'stressPattern')}
                        className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                    >
                        {isInfoVisible ? (
                            <X className="w-4 h-4 text-gray-300" />
                        ) : (
                            <Info className="w-4 h-4 text-gray-300" />
                        )}
                    </button>
                </div>
            </div>

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <AlertTriangle className={`w-5 h-5 ${getStressLevelColor(analysis.stressLevel)}`} />
                        <span className={`text-lg font-semibold ${getStressLevelColor(analysis.stressLevel)}`}>
                            {analysis.stressLevel.charAt(0).toUpperCase() + analysis.stressLevel.slice(1)} Stress
                        </span>
                    </div>
                    <div className={`px-3 py-1 rounded-full ${getStressLevelBg(analysis.stressLevel)}`}>
                        <span className={`text-sm ${getStressLevelColor(analysis.stressLevel)}`}>
                            {analysis.stressScore.toFixed(0)}%
                        </span>
                    </div>
                </div>

                <div className="space-y-4">
                    <button
                        onClick={() => setShowDetails(!showDetails)}
                        className="w-full flex items-center justify-between text-sm text-gray-300 hover:text-gray-100"
                    >
                        <span>View {showDetails ? 'Less' : 'More'}</span>
                        {showDetails ? (
                            <ChevronUp className="w-4 h-4" />
                        ) : (
                            <ChevronDown className="w-4 h-4" />
                        )}
                    </button>

                    {showDetails && (
                        <div className="space-y-6 animate-in fade-in">
                            <div className="h-40 bg-black/20 rounded-lg p-2">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart
                                        data={[
                                            { name: 'Cognitive', value: analysis.metrics.cognitiveLoad },
                                            { name: 'Physical', value: analysis.metrics.physicalStrain }
                                        ]}
                                    >
                                        <XAxis dataKey="name" stroke="#9CA3AF" />
                                        <YAxis stroke="#9CA3AF" />
                                        <Tooltip />
                                        <Line type="monotone" dataKey="value" stroke="#3B82F6" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>

                            {analysis.metrics.contributingFactors.length > 0 && (
                                <div>
                                    <h4 className="text-sm font-medium text-gray-200 mb-2">
                                        Contributing Factors
                                    </h4>
                                    <ul className="space-y-1">
                                        {analysis.metrics.contributingFactors.map((factor, index) => (
                                            <li key={index} className="text-sm text-gray-300 flex items-start gap-2">
                                                <span className="text-yellow-400">•</span>
                                                {factor}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {analysis.recommendations.length > 0 && (
                                <div>
                                    <h4 className="text-sm font-medium text-gray-200 mb-2">
                                        Recommended Actions
                                    </h4>
                                    <ul className="space-y-1">
                                        {analysis.recommendations.map((recommendation, index) => (
                                            <li key={index} className="text-sm text-gray-300 flex items-start gap-2">
                                                <span className="text-green-400">•</span>
                                                {recommendation}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="text-xs text-gray-400">
                    Last updated: {new Date(analysis.timestamp).toLocaleTimeString()}
                </div>
            </div>
        </div>
    );
}