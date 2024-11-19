import React, { useState, useEffect } from 'react';
import {
    Brain, Activity, AlertCircle, FileText, Calendar, RefreshCw, Zap
} from 'lucide-react';
import {
    LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
    BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis,
    PolarRadiusAxis, Radar, Legend
} from 'recharts';
import { CodingMentalHealthTracker } from './codingMentalHealthTracker';

interface FileMetrics {
    fileName: string;
    totalFlowScore: number;
    averageFlowScore: number;
    lastModified: number;
    sessions: MentalMetrics[];
}

interface DailyMentalMetrics {
    date: string;
    totalFlowScore: number;
    averageFlowScore: number;
    totalSessions: number;
    fileMetrics: Record<string, FileMetrics>;
    metrics: MentalMetrics[];
}

interface CodingPatterns {
    errorRate: number;
    deletionFrequency: number;
    typingSpeed: number;
    pauseFrequency: number;
    codeComplexity: number;
}

interface MentalMetrics {
    fileName: string;
    timestamp: number;
    patterns: CodingPatterns;
    sessionDuration: number;
    breakDuration: number;
    flowScore: number;
}

interface AggregateMetrics {
    averageFlowScore: number;
    averageTypingSpeed: number;
    totalSessionTime: number;
    totalBreakTime: number;
    errorRate: number;
    complexityScore: number;
}

interface MetricCardProps {
    title: string;
    value: string;
    change: string;
    icon: React.ElementType;
    color: string;
}

interface ChartCardProps {
    title: string;
    children: React.ReactNode;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, icon: Icon, color }) => (
    <div className={`p-6 rounded-lg border border-gray-800 bg-gray-800/50 backdrop-blur-xl`}>
        <div className="flex items-start justify-between mb-4">
            <div className={`p-2 rounded-lg bg-${color}-500/20`}>
                <Icon className={`w-6 h-6 text-${color}-400`} />
            </div>
            <span className={`text-xs px-2 py-1 rounded-full bg-${color}-500/20 text-${color}-400`}>
                {change}
            </span>
        </div>
        <h3 className="text-2xl font-bold text-white mb-1">{value}</h3>
        <p className="text-sm text-gray-400">{title}</p>
    </div>
);

const ChartCard: React.FC<ChartCardProps> = ({ title, children }) => (
    <div className="p-6 rounded-lg border border-gray-800 bg-gray-800/50 backdrop-blur-xl">
        <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
        {children}
    </div>
);

const MentalHealthDashboard: React.FC = () => {
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [selectedFile, setSelectedFile] = useState<string>('');
    const [dailyMetrics, setDailyMetrics] = useState<DailyMentalMetrics | null>(null);
    const [availableFiles, setAvailableFiles] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const loadMetrics = () => {
        setIsLoading(true);
        try {
            const metrics = CodingMentalHealthTracker.getDailyMetrics(selectedDate);
            if (metrics) {
                setDailyMetrics(metrics);
                setAvailableFiles(Object.keys(metrics.fileMetrics));
            } else {
                setDailyMetrics(null);
                const allMetrics = CodingMentalHealthTracker.getAllMetrics();
                const allFiles = new Set<string>();
                Object.values(allMetrics).forEach(dailyMetric => {
                    Object.keys(dailyMetric.fileMetrics).forEach(file => allFiles.add(file));
                });
                setAvailableFiles(Array.from(allFiles));
            }
        } catch (error) {
            console.error('Error loading metrics:', error);
            setDailyMetrics(null);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        loadMetrics();
    }, [selectedDate]);

    const getRelevantMetrics = (): MentalMetrics[] => {
        if (!dailyMetrics) return [];
        if (!selectedFile) return dailyMetrics.metrics;
        return dailyMetrics.fileMetrics[selectedFile]?.sessions || [];
    };

    const calculateAggregateMetrics = (): AggregateMetrics | null => {
        const metrics = getRelevantMetrics();
        if (metrics.length === 0) return null;

        return {
            averageFlowScore: metrics.reduce((acc, curr) => acc + curr.flowScore, 0) / metrics.length,
            averageTypingSpeed: metrics.reduce((acc, curr) => acc + curr.patterns.typingSpeed, 0) / metrics.length,
            totalSessionTime: metrics.reduce((acc, curr) => acc + curr.sessionDuration, 0),
            totalBreakTime: metrics.reduce((acc, curr) => acc + curr.breakDuration, 0),
            errorRate: metrics.reduce((acc, curr) => acc + curr.patterns.errorRate, 0) / metrics.length,
            complexityScore: metrics.reduce((acc, curr) => acc + curr.patterns.codeComplexity, 0) / metrics.length
        };
    };

    const aggregateMetrics = calculateAggregateMetrics();

    const chartData = getRelevantMetrics().map(metric => ({
        time: new Date(metric.timestamp).toLocaleTimeString(),
        flowScore: metric.flowScore,
        typingSpeed: metric.patterns.typingSpeed,
        errorRate: metric.patterns.errorRate * 100,
        complexity: metric.patterns.codeComplexity
    }));

    const radarData = aggregateMetrics ? [
        { metric: 'Flow Score', value: aggregateMetrics.averageFlowScore },
        { metric: 'Typing Speed', value: Math.min(100, (aggregateMetrics.averageTypingSpeed / 100) * 100) },
        { metric: 'Error Rate', value: Math.max(0, 100 - aggregateMetrics.errorRate * 100) },
        { metric: 'Code Quality', value: Math.max(0, 100 - aggregateMetrics.complexityScore * 10) },
        { metric: 'Break Balance', value: Math.min(100, (aggregateMetrics.totalBreakTime / aggregateMetrics.totalSessionTime) * 300) }
    ] : [];

    // Calculate metric changes based on previous data
    const calculateChange = (current: number, metric: string): string => {
        // In a full implementation, you would compare with previous day's data
        // For now, we'll return placeholder values
        const changes: Record<string, string> = {
            'Flow Score': '+5%',
            'Typing Speed': '+2.3%',
            'Error Rate': '-1.2%',
            'Code Quality': 'Stable'
        };
        return changes[metric] || 'N/A';
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6 p-6">
            {/* Controls */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="px-3 py-2 rounded-lg bg-gray-800 text-white border border-gray-700"
                    />
                    <select
                        value={selectedFile}
                        onChange={(e) => setSelectedFile(e.target.value)}
                        className="px-3 py-2 rounded-lg bg-gray-800 text-white border border-gray-700"
                    >
                        <option value="">All Files</option>
                        {availableFiles.map(file => (
                            <option key={file} value={file}>{file}</option>
                        ))}
                    </select>
                </div>
                <button
                    onClick={loadMetrics}
                    className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                    <RefreshCw className="w-5 h-5 text-gray-400" />
                </button>
            </div>

            {!dailyMetrics || getRelevantMetrics().length === 0 ? (
                <div className="flex flex-col items-center justify-center h-96 gap-4">
                    <AlertCircle className="w-12 h-12 text-yellow-400" />
                    <p className="text-gray-400">No mental health data available for {selectedDate}</p>
                    {availableFiles.length > 0 && (
                        <p className="text-gray-400">Try selecting a different date or file</p>
                    )}
                </div>
            ) : (
                <>
                    {/* Metrics Grid */}
                    {aggregateMetrics && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <MetricCard
                                title="Flow Score"
                                value={`${aggregateMetrics.averageFlowScore.toFixed(1)}%`}
                                change={calculateChange(aggregateMetrics.averageFlowScore, 'Flow Score')}
                                icon={Brain}
                                color="indigo"
                            />
                            <MetricCard
                                title="Typing Speed"
                                value={`${aggregateMetrics.averageTypingSpeed.toFixed(1)} WPM`}
                                change={calculateChange(aggregateMetrics.averageTypingSpeed, 'Typing Speed')}
                                icon={Zap}
                                color="yellow"
                            />
                            <MetricCard
                                title="Error Rate"
                                value={`${(aggregateMetrics.errorRate * 100).toFixed(1)}%`}
                                change={calculateChange(aggregateMetrics.errorRate * 100, 'Error Rate')}
                                icon={AlertCircle}
                                color="red"
                            />
                            <MetricCard
                                title="Code Quality"
                                value={`${aggregateMetrics.complexityScore.toFixed(1)}`}
                                change={calculateChange(aggregateMetrics.complexityScore, 'Code Quality')}
                                icon={FileText}
                                color="emerald"
                            />
                        </div>
                    )}

                    {/* Charts Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Flow Score Timeline */}
                        <ChartCard title="Flow Score & Typing Speed Timeline">
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={chartData}>
                                        <XAxis dataKey="time" stroke="#6B7280" fontSize={12} />
                                        <YAxis stroke="#6B7280" fontSize={12} />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: '#1F2937',
                                                border: '1px solid #374151'
                                            }}
                                        />
                                        <Legend />
                                        <Line
                                            type="monotone"
                                            dataKey="flowScore"
                                            stroke="#818cf8"
                                            strokeWidth={2}
                                            dot={false}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="typingSpeed"
                                            stroke="#34d399"
                                            strokeWidth={2}
                                            dot={false}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </ChartCard>

                        {/* Developer Health Radar */}
                        <ChartCard title="Developer Health Radar">
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart outerRadius="80%" data={radarData}>
                                        <PolarGrid stroke="#374151" />
                                        <PolarAngleAxis
                                            dataKey="metric"
                                            tick={{ fill: '#9CA3AF', fontSize: 12 }}
                                        />
                                        <PolarRadiusAxis stroke="#4B5563" />
                                        <Radar
                                            name="Performance"
                                            dataKey="value"
                                            stroke="#818cf8"
                                            fill="#818cf8"
                                            fillOpacity={0.3}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: '#1F2937',
                                                border: '1px solid #374151'
                                            }}
                                        />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>
                        </ChartCard>
                    </div>

                    {/* Session Timeline */}
                    <ChartCard title="Session Timeline">
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData}>
                                    <XAxis dataKey="time" stroke="#6B7280" fontSize={12} />
                                    <YAxis stroke="#6B7280" fontSize={12} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#1F2937',
                                            border: '1px solid #374151'
                                        }}
                                    />
                                    <Legend />
                                    <Bar
                                        dataKey="complexity"
                                        fill="#818cf8"
                                        radius={[4, 4, 0, 0]}
                                    />
                                    <Bar
                                        dataKey="errorRate"
                                        fill="#ef4444"
                                        radius={[4, 4, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </ChartCard>
                </>
            )}
        </div>
    );
};

export default MentalHealthDashboard;