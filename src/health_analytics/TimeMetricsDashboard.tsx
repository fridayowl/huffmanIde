import React, { useState, useEffect } from 'react';
import {
    Activity, Clock, Timer, AlertCircle, Calendar,
    Zap, Coffee, Brain, BarChart2, RefreshCw, FileText
} from 'lucide-react';
import {
    LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
    BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';

interface TimeMetricsDashboardProps {
    customization: {
        backgroundColor: string;
        textColor: string;
        highlightColor: string;
    };
}

interface Session {
    sessionStart: number;
    activeEditingTime: number;
    breaks: { start: number; end: number | null; duration: number; }[];
    totalKeystrokes: number;
    fileName?: string;
    continuousCodingPeriods: { start: number; end: number; duration: number; }[];
}

interface FileMetrics {
    fileName: string;
    totalEditingTime: number;
    lastModified: number;
    sessions: Session[];
}

interface DailyMetrics {
    date: string;
    totalCodingTime: number;
    totalBreakTime: number;
    longestCodingStreak: number;
    averageCodingStreak: number;
    totalSessions: number;
    fileMetrics: Record<string, FileMetrics>;
    metrics: Session[];
    activeMetrics?: FileMetrics;
}

interface MetricCardProps {
    icon: React.ElementType;
    title: string;
    value: string | number;
    subtitle: string;
    color: string;
}

const TimeMetricsDashboard: React.FC<TimeMetricsDashboardProps> = ({ customization }) => {
    const [metricsData, setMetricsData] = useState<DailyMetrics | null>(null);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedFile, setSelectedFile] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);

    const loadMetricsData = () => {
        setIsLoading(true);
        const metrics = localStorage.getItem('coding_time_metrics');
        if (metrics) {
            const parsedMetrics = JSON.parse(metrics);
            const dailyData = parsedMetrics[selectedDate] as DailyMetrics;

            if (dailyData && selectedFile && dailyData.fileMetrics[selectedFile]) {
                setMetricsData({
                    ...dailyData,
                    activeMetrics: dailyData.fileMetrics[selectedFile]
                });
            } else {
                setMetricsData(dailyData);
            }
        }
        setIsLoading(false);
    };

    useEffect(() => {
        loadMetricsData();
    }, [selectedDate, selectedFile]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <RefreshCw className="animate-spin text-indigo-400" size={24} />
            </div>
        );
    }

    if (!metricsData) {
        return (
            <div className="flex flex-col items-center justify-center h-full gap-4">
                <AlertCircle className="text-yellow-400" size={48} />
                <p className="text-gray-400">No metrics data available for {selectedDate}</p>
            </div>
        );
    }

    const formatTime = (ms: number) => {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        return `${hours}h ${minutes % 60}m`;
    };

    const formatDuration = (ms: number) => {
        const minutes = Math.floor(ms / 60000);
        return `${minutes} min`;
    };

    const MetricCard: React.FC<MetricCardProps> = ({ icon: Icon, title, value, subtitle, color }) => (
        <div className="p-4 rounded-lg" style={{ backgroundColor: `${customization.highlightColor}10` }}>
            <div className="flex items-center gap-3 mb-2">
                <Icon className={`text-${color}-400`} size={20} />
                <h3 className="font-medium" style={{ color: customization.textColor }}>{title}</h3>
            </div>
            <div className="space-y-1">
                <div className="text-2xl font-bold" style={{ color: customization.highlightColor }}>
                    {value}
                </div>
                <div className="text-sm" style={{ color: `${customization.textColor}80` }}>
                    {subtitle}
                </div>
            </div>
        </div>
    );

    const getMetricsData = () => {
        if (!metricsData) return null;

        const fileSpecific = selectedFile && metricsData.fileMetrics[selectedFile];
        return {
            totalCodingTime: fileSpecific ? fileSpecific.totalEditingTime : metricsData.totalCodingTime,
            totalBreakTime: metricsData.totalBreakTime,
            longestStreak: fileSpecific ? Math.max(...(fileSpecific.sessions.map(s =>
                Math.max(...s.continuousCodingPeriods.map(p => p.duration))
            ))) : metricsData.longestCodingStreak,
            metrics: fileSpecific ? fileSpecific.sessions : metricsData.metrics
        };
    };

    const data = getMetricsData();
    if (!data) return null;

    const sessionData = data.metrics.map((session: Session, index: number) => ({
        name: `Session ${index + 1}`,
        activeTime: session.activeEditingTime / 60000,
        keystrokes: session.totalKeystrokes,
        fileName: session.fileName
    }));

    const timeDistribution = [
        { name: 'Active Coding', value: data.totalCodingTime },
        { name: 'Breaks', value: data.totalBreakTime },
    ];

    const COLORS = ['#6366f1', '#f59e0b', '#10b981'];

    return (
        <div className="p-6 space-y-6">
            {/* Date and File Selector */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <Calendar className="text-indigo-400" size={24} />
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="px-3 py-1.5 rounded-lg"
                        style={{
                            backgroundColor: `${customization.highlightColor}10`,
                            color: customization.textColor,
                            border: `1px solid ${customization.textColor}20`
                        }}
                    />
                    {metricsData?.fileMetrics && (
                        <select
                            value={selectedFile}
                            onChange={(e) => setSelectedFile(e.target.value)}
                            className="px-3 py-1.5 rounded-lg"
                            style={{
                                backgroundColor: `${customization.highlightColor}10`,
                                color: customization.textColor,
                                border: `1px solid ${customization.textColor}20`
                            }}
                        >
                            <option value="">All Files</option>
                            {Object.keys(metricsData.fileMetrics).map((fileName: string) => (
                                <option key={fileName} value={fileName}>{fileName}</option>
                            ))}
                        </select>
                    )}
                </div>
                <button
                    onClick={loadMetricsData}
                    className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                    style={{ color: customization.textColor }}
                >
                    <RefreshCw size={20} />
                </button>
            </div>

            {/* File Metrics Summary */}
            {selectedFile && (
                <div className="p-4 rounded-lg" style={{ backgroundColor: `${customization.highlightColor}10` }}>
                    <div className="flex items-center gap-2 mb-2">
                        <FileText size={20} className="text-indigo-400" />
                        <h3 className="font-medium" style={{ color: customization.textColor }}>
                            {selectedFile}
                        </h3>
                    </div>
                    <p className="text-sm" style={{ color: `${customization.textColor}80` }}>
                        Last modified: {new Date(metricsData.fileMetrics[selectedFile].lastModified).toLocaleString()}
                    </p>
                </div>
            )}

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                    icon={Timer}
                    title="Total Coding Time"
                    value={formatTime(data.totalCodingTime)}
                    subtitle={selectedFile ? "File editing time" : "Today's total active time"}
                    color="indigo"
                />
                <MetricCard
                    icon={Zap}
                    title="Longest Streak"
                    value={formatDuration(data.longestStreak)}
                    subtitle="Longest continuous coding"
                    color="yellow"
                />
                <MetricCard
                    icon={Coffee}
                    title="Break Time"
                    value={formatTime(data.totalBreakTime)}
                    subtitle="Total break duration"
                    color="emerald"
                />
                <MetricCard
                    icon={Brain}
                    title="Focus Score"
                    value={Math.round(
                        (data.totalCodingTime / (data.totalCodingTime + data.totalBreakTime)) * 100
                    )}
                    subtitle="Coding time ratio"
                    color="purple"
                />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Session Activity Chart */}
                <div className="p-4 rounded-lg" style={{ backgroundColor: `${customization.highlightColor}10` }}>
                    <h3 className="text-sm font-medium mb-4" style={{ color: customization.textColor }}>
                        Session Activity
                    </h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={sessionData}>
                                <XAxis
                                    dataKey="name"
                                    stroke={`${customization.textColor}60`}
                                    fontSize={12}
                                />
                                <YAxis
                                    stroke={`${customization.textColor}60`}
                                    fontSize={12}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: customization.backgroundColor,
                                        border: `1px solid ${customization.textColor}20`,
                                    }}
                                />
                                <Bar dataKey="activeTime" fill={customization.highlightColor} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Time Distribution */}
                <div className="p-4 rounded-lg" style={{ backgroundColor: `${customization.highlightColor}10` }}>
                    <h3 className="text-sm font-medium mb-4" style={{ color: customization.textColor }}>
                        Time Distribution
                    </h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={timeDistribution}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    label={({ name, percent }) =>
                                        `${name} ${(percent * 100).toFixed(0)}%`
                                    }
                                >
                                    {timeDistribution.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={COLORS[index % COLORS.length]}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: customization.backgroundColor,
                                        border: `1px solid ${customization.textColor}20`,
                                    }}
                                    formatter={(value: any) => formatTime(value)}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Session Details */}
            <div className="rounded-lg overflow-hidden"
                style={{ backgroundColor: `${customization.highlightColor}10` }}>
                <div className="p-4 border-b" style={{ borderColor: `${customization.textColor}10` }}>
                    <h3 className="font-medium" style={{ color: customization.textColor }}>
                        Session Details {selectedFile && `for ${selectedFile}`}
                    </h3>
                </div>
                <div className="p-4 space-y-4">
                    {data.metrics.map((session: Session, index: number) => (
                        <div
                            key={index}
                            className="p-3 rounded-lg"
                            style={{ backgroundColor: `${customization.highlightColor}05` }}
                        >
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-medium" style={{ color: customization.textColor }}>
                                    Session {index + 1} {session.fileName && `- ${session.fileName}`}
                                </span>
                                <span className="text-sm" style={{ color: `${customization.textColor}80` }}>
                                    {new Date(session.sessionStart).toLocaleTimeString()}
                                </span>
                            </div>
                            <div className="grid grid-cols-3 gap-4 text-sm">
                                <div>
                                    <span style={{ color: `${customization.textColor}60` }}>Active Time:</span>
                                    <div style={{ color: customization.textColor }}>
                                        {formatTime(session.activeEditingTime)}
                                    </div>
                                </div>
                                <div>
                                    <span style={{ color: `${customization.textColor}60` }}>Keystrokes:</span>
                                    <div style={{ color: customization.textColor }}>
                                        {session.totalKeystrokes}
                                    </div>
                                </div>
                                <div>
                                    <span style={{ color: `${customization.textColor}60` }}>Breaks:</span>
                                    <div style={{ color: customization.textColor }}>
                                        {session.breaks.length}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TimeMetricsDashboard;