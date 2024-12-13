import React, { useState, useMemo } from 'react';
import { Brain, Sparkles, BarChart2, Code, Hash, GitBranch, Parentheses, Shield, CheckCircle, AlertTriangle, ChevronRight, Info } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, PolarRadiusAxis } from 'recharts';

interface CustomizationProps {
    backgroundColor: string;
    textColor: string;
    highlightColor: string;
}

interface AIAnalyticsPanelProps {
    customization: CustomizationProps;
    code?: string;
}

interface MetricCardProps {
    icon: typeof Code;
    label: string;
    value: number | string;
    tooltip?: string;
    customization: CustomizationProps;
}

interface SecurityMetric {
    score: number;
    details: Array<{
        name: string;
        passed: boolean;
        impact: 'high' | 'medium' | 'low';
        suggestion?: string;
    }>;
}

const MetricCard: React.FC<MetricCardProps> = ({
    icon: Icon,
    label,
    value,
    tooltip,
    customization,
}) => (
    <div className="flex items-center gap-1 p-2 rounded-lg"
        style={{ backgroundColor: `${customization.highlightColor}08` }}>
        <Icon size={14} style={{ color: customization.textColor }} />
        <div className="flex-1 min-w-0">
            <div className="text-xs opacity-80 flex items-center gap-2 truncate"
                style={{ color: customization.textColor }}>
                {label}
                {tooltip && <Info size={10} className="opacity-50 flex-shrink-0" />}
            </div>
            <div className="text-xs font-semibold truncate"
                style={{ color: customization.textColor }}>
                {value}
            </div>
        </div>
    </div>
);

const AnalyticsPanel: React.FC<AIAnalyticsPanelProps> = ({ customization, code = '' }) => {
    const [activeTab, setActiveTab] = useState<'analytics' | 'security'>('analytics');
    const [expandedSection, setExpandedSection] = useState<string | null>(null);

    // Code Analysis
    const analytics = useMemo(() => {
        const lines = code.split('\n');
        const stats = {
            totalLines: lines.length,
            emptyLines: lines.filter(line => !line.trim()).length,
            commentLines: lines.filter(line => line.trim().startsWith('#')).length,
            codeLines: 0,
            functions: 0,
            classes: 0,
            imports: 0,
            complexityScore: 0,
            indentationLevels: Array(10).fill(0),
        };

        let currentIndentation = 0;
        let maxIndentation = 0;

        lines.forEach(line => {
            const trimmedLine = line.trim();
            if (!trimmedLine || trimmedLine.startsWith('#')) return;

            stats.codeLines++;
            if (trimmedLine.startsWith('def ')) stats.functions++;
            if (trimmedLine.startsWith('class ')) stats.classes++;
            if (trimmedLine.startsWith('import ') || trimmedLine.startsWith('from ')) stats.imports++;

            const indentation = line.search(/\S/);
            if (indentation >= 0) {
                currentIndentation = Math.floor(indentation / 4);
                maxIndentation = Math.max(maxIndentation, currentIndentation);
                if (currentIndentation < stats.indentationLevels.length) {
                    stats.indentationLevels[currentIndentation]++;
                }
            }

            if (trimmedLine.match(/\b(if|elif|else|for|while|try|except)\b/)) {
                stats.complexityScore++;
            }
        });

        const chartData = stats.indentationLevels
            .slice(0, maxIndentation + 1)
            .map((count, level) => ({
                level: `Level ${level}`,
                lines: count || 0
            }))
            .filter(item => item.lines > 0);

        return { stats, chartData };
    }, [code]);

    // Security Analysis
    const securityMetrics = useMemo(() => {
        const metrics: Record<string, SecurityMetric> = {
            security: {
                score: 0,
                details: [
                    {
                        name: 'Sensitive Data Exposure',
                        passed: !/password|secret|key|token|api[_-]?key/i.test(code),
                        impact: 'high',
                        suggestion: 'Avoid hardcoding sensitive data. Use environment variables.'
                    },
                    {
                        name: 'Error Handling',
                        passed: /try\s*{[\s\S]*?catch/.test(code),
                        impact: 'medium',
                        suggestion: 'Implement proper error handling.'
                    },
                    {
                        name: 'Input Validation',
                        passed: /typeof|instanceof|\.test\(|\.match\(/.test(code),
                        impact: 'high',
                        suggestion: 'Validate all inputs.'
                    }
                ]
            },
            reliability: {
                score: 0,
                details: [
                    {
                        name: 'Error Recovery',
                        passed: /finally\s*{/.test(code),
                        impact: 'medium',
                        suggestion: 'Implement cleanup in finally blocks.'
                    },
                    {
                        name: 'Type Checking',
                        passed: /typeof|instanceof/.test(code),
                        impact: 'medium',
                        suggestion: 'Implement type checking.'
                    },
                    {
                        name: 'Null Checks',
                        passed: /(\?\.|===\s*null|!==\s*null)/.test(code),
                        impact: 'high',
                        suggestion: 'Add null checks.'
                    }
                ]
            },
            performance: {
                score: 0,
                details: [
                    {
                        name: 'Loop Optimization',
                        passed: !/(for|while).*\n.*for/.test(code),
                        impact: 'high',
                        suggestion: 'Avoid nested loops.'
                    },
                    {
                        name: 'Memory Usage',
                        passed: !/\.slice\(0\)|\.concat\(/.test(code),
                        impact: 'medium',
                        suggestion: 'Avoid unnecessary array copies.'
                    },
                    {
                        name: 'Async Operations',
                        passed: /async|await/.test(code),
                        impact: 'high',
                        suggestion: 'Use async/await for better performance.'
                    }
                ]
            }
        };

        // Calculate scores
        Object.keys(metrics).forEach(key => {
            let score = 0;
            metrics[key].details.forEach(detail => {
                const impactScore = detail.impact === 'high' ? 7 : detail.impact === 'medium' ? 5 : 3;
                if (detail.passed) score += impactScore;
            });
            metrics[key].score = Math.min(25, score);
        });

        const totalScore = Object.values(metrics).reduce((acc, { score }) => acc + score, 0);
        return { metrics, totalScore };
    }, [code]);

    // AI Insights
    const aiInsights = useMemo(() => [
        {
            title: "Code Structure",
            insight: `AI analysis detected ${analytics.stats.functions} functions and ${analytics.stats.classes} classes. Structure is ${analytics.stats.complexityScore > 10 ? 'highly complex' : 'moderately complex'}.`,
            confidence: 0.92
        },
        {
            title: "Security Assessment",
            insight: `Security score: ${securityMetrics.totalScore}/100. Key areas for improvement: ${Object.values(securityMetrics.metrics)
                    .flatMap(m => m.details.filter(d => !d.passed))
                    .slice(0, 2)
                    .map(d => d.name.toLowerCase())
                    .join(', ')
                }.`,
            confidence: 0.88
        },
        {
            title: "Performance Analysis",
            insight: `Code shows ${analytics.stats.complexityScore > 8 ? 'potential performance bottlenecks' : 'good performance characteristics'}. Consider optimizing nested operations.`,
            confidence: 0.85
        }
    ], [analytics, securityMetrics]);

    const radarData = [
        { subject: 'Security', score: securityMetrics.metrics.security.score, fullMark: 25 },
        { subject: 'Reliability', score: securityMetrics.metrics.reliability.score, fullMark: 25 },
        { subject: 'Performance', score: securityMetrics.metrics.performance.score, fullMark: 25 }
    ];

    const getScoreColor = (score: number) => {
        if (score >= 80) return '#10B981';
        if (score >= 50) return '#FBBF24';
        return '#EF4444';
    };

    return (
        <div className="rounded-lg border shadow-lg overflow-auto" style={{
            backgroundColor: customization.backgroundColor,
            borderColor: `${customization.textColor}20`,
            maxHeight: '90vh'
        }}>
            {/* AI Badge */}
            <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1 rounded-full" style={{
                backgroundColor: `${customization.highlightColor}15`,
                border: `1px solid ${customization.highlightColor}30`
            }}>
                {/* <Brain className="w-4 h-4" style={{ color: customization.highlightColor }} />
                <span className="text-xs font-medium" style={{ color: customization.highlightColor }}>
                    AI-Powered Analysis
                </span> */}
            </div>

            {/* Tabs */}
            <div className="flex border-b" style={{ borderColor: `${customization.textColor}20` }}>
                <button
                    onClick={() => setActiveTab('analytics')}
                    className={`px-4 py-2 flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'analytics' ? 'border-current' : 'border-transparent'
                        }`}
                    style={{
                        color: activeTab === 'analytics' ? customization.highlightColor : customization.textColor
                    }}
                >
                    <BarChart2 size={16} />
                    <span>Analysis</span>
                </button>
                <button
                    onClick={() => setActiveTab('security')}
                    className={`px-4 py-2 flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'security' ? 'border-current' : 'border-transparent'
                        }`}
                    style={{
                        color: activeTab === 'security' ? customization.highlightColor : customization.textColor
                    }}
                >
                    <Shield size={16} />
                    <span>Security</span>
                </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-6">
                {/* AI Insights */}
                <div className="space-y-3">
                    <h3 className="text-sm font-medium flex items-center gap-2" style={{ color: customization.textColor }}>
                        <Sparkles className="w-4 h-4" style={{ color: customization.highlightColor }} />
                        AI-Generated Insights
                    </h3>
                    <div className="space-y-2">
                        {aiInsights.map((insight, index) => (
                            <div
                                key={index}
                                className="p-3 rounded-lg"
                                style={{ backgroundColor: `${customization.highlightColor}08` }}
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <span className="font-medium text-sm" style={{ color: customization.textColor }}>
                                        {insight.title}
                                    </span>
                                    <div className="flex items-center gap-1">
                                        <Brain className="w-3 h-3" style={{ color: customization.highlightColor }} />
                                        <span className="text-xs" style={{ color: customization.highlightColor }}>
                                            {Math.round(insight.confidence * 100)}% confidence
                                        </span>
                                    </div>
                                </div>
                                <p className="text-sm" style={{ color: `${customization.textColor}90` }}>
                                    {insight.insight}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {activeTab === 'analytics' ? (
                    <>
                        {/* Metrics Grid */}
                        <div className="grid grid-cols-2 gap-2">
                            <MetricCard
                                icon={Code}
                                label="Total Lines"
                                value={analytics.stats.totalLines}
                                customization={customization}
                            />
                            <MetricCard
                                icon={Hash}
                                label="Code Lines"
                                value={analytics.stats.codeLines}
                                customization={customization}
                            />
                            <MetricCard
                                icon={Parentheses}
                                label="Functions"
                                value={analytics.stats.functions}
                                customization={customization}
                            />
                            <MetricCard
                                icon={GitBranch}
                                label="Classes"
                                value={analytics.stats.classes}
                                customization={customization}
                            />
                        </div>

                        {/* Complexity Score */}
                        <div className="p-3 rounded-lg" style={{ backgroundColor: `${customization.highlightColor}08` }}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Brain size={16} style={{ color: customization.highlightColor }} />
                                    <span className="font-medium" style={{ color: customization.textColor }}>
                                        AI Complexity Score
                                    </span>
                                </div>
                                <span className="text-2xl font-bold" style={{ color: customization.highlightColor }}>
                                    {analytics.stats.complexityScore}
                                </span>
                            </div>
                        </div>

                        {/* Distribution Chart */}
                        <div>
                            <h4 className="text-sm font-medium mb-2" style={{ color: customization.textColor }}>
                                Code Distribution
                            </h4>
                            <div className="h-40">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={analytics.chartData}>
                                        <XAxis dataKey="level" stroke={customization.textColor} />
                                        <YAxis stroke={customization.textColor} />
                                        <Tooltip />
                                        <Line
                                            type="monotone"
                                            dataKey="lines"
                                            stroke={customization.highlightColor}
                                            strokeWidth={2}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="lines"
                                            stroke={customization.highlightColor}
                                            strokeWidth={2}
                                            dot={{
                                                fill: customization.highlightColor,
                                                r: 4
                                            }}
                                            activeDot={{
                                                r: 6,
                                                stroke: customization.highlightColor,
                                                strokeWidth: 2
                                            }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Code Composition */}
                        <div>
                            <h4 className="text-sm font-medium mb-2" style={{ color: customization.textColor }}>
                                Code Composition Analysis
                            </h4>
                            <div className="flex gap-1 h-2 rounded-full overflow-hidden">
                                {[
                                    { color: '#3B82F6', width: analytics.stats.codeLines },
                                    { color: '#10B981', width: analytics.stats.commentLines },
                                    { color: '#6B7280', width: analytics.stats.emptyLines }
                                ].map((segment, i) => (
                                    <div
                                        key={i}
                                        style={{
                                            backgroundColor: segment.color,
                                            width: `${(segment.width / analytics.stats.totalLines) * 100}%`
                                        }}
                                    />
                                ))}
                            </div>
                            <div className="flex justify-between text-xs mt-2">
                                <span style={{ color: customization.textColor }}>
                                    Code: {Math.round((analytics.stats.codeLines / analytics.stats.totalLines) * 100)}%
                                </span>
                                <span style={{ color: customization.textColor }}>
                                    Comments: {Math.round((analytics.stats.commentLines / analytics.stats.totalLines) * 100)}%
                                </span>
                                <span style={{ color: customization.textColor }}>
                                    Empty: {Math.round((analytics.stats.emptyLines / analytics.stats.totalLines) * 100)}%
                                </span>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        {/* Security Analysis */}
                        <div className="space-y-4">
                            {/* Radar Chart */}
                            <div className="flex justify-center">
                                <div className="w-64 h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RadarChart outerRadius="80%" data={radarData}>
                                            <PolarGrid stroke={`${customization.textColor}30`} />
                                            <PolarAngleAxis
                                                dataKey="subject"
                                                tick={{ fill: customization.textColor, fontSize: 12 }}
                                            />
                                            <PolarRadiusAxis
                                                angle={30}
                                                domain={[0, 25]}
                                                tick={{ fill: customization.textColor }}
                                            />
                                            <Radar
                                                name="Score"
                                                dataKey="score"
                                                stroke={customization.highlightColor}
                                                fill={customization.highlightColor}
                                                fillOpacity={0.5}
                                            />
                                            <Tooltip />
                                        </RadarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Overall Score */}
                            <div className="text-center">
                                <div className="text-3xl font-bold" style={{ color: getScoreColor(securityMetrics.totalScore) }}>
                                    {securityMetrics.totalScore}
                                    <span className="text-lg opacity-60 ml-1">/100</span>
                                </div>
                                <div className="text-sm opacity-70" style={{ color: customization.textColor }}>
                                    Overall Security Score
                                </div>
                            </div>

                            {/* Detailed Metrics */}
                            <div className="space-y-3">
                                {Object.entries(securityMetrics.metrics).map(([key, { score, details }]) => (
                                    <div key={key} className="rounded-lg overflow-hidden">
                                        <button
                                            onClick={() => setExpandedSection(expandedSection === key ? null : key)}
                                            className="w-full p-3 flex items-center gap-3"
                                            style={{ backgroundColor: `${customization.highlightColor}10` }}
                                        >
                                            <ChevronRight
                                                className={`transition-transform ${expandedSection === key ? 'rotate-90' : ''}`}
                                                size={16}
                                                style={{ color: customization.textColor }}
                                            />
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between">
                                                    <span className="font-medium capitalize" style={{ color: customization.textColor }}>
                                                        {key}
                                                    </span>
                                                    <span className="font-bold" style={{ color: getScoreColor((score / 25) * 100) }}>
                                                        {score}/25
                                                    </span>
                                                </div>
                                                <div className="w-full h-1 mt-2 rounded-full bg-black/20">
                                                    <div
                                                        className="h-full rounded-full transition-all"
                                                        style={{
                                                            width: `${(score / 25) * 100}%`,
                                                            backgroundColor: getScoreColor((score / 25) * 100)
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </button>

                                        {expandedSection === key && (
                                            <div className="p-3 space-y-2" style={{ backgroundColor: `${customization.highlightColor}05` }}>
                                                {details.map((detail, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex items-start gap-2 p-2 rounded"
                                                        style={{ backgroundColor: customization.backgroundColor }}
                                                    >
                                                        {detail.passed ? (
                                                            <CheckCircle className="w-5 h-5 mt-0.5 text-emerald-500" />
                                                        ) : (
                                                            <AlertTriangle className="w-5 h-5 mt-0.5 text-amber-500" />
                                                        )}
                                                        <div>
                                                            <div className="font-medium" style={{ color: customization.textColor }}>
                                                                {detail.name}
                                                            </div>
                                                            {!detail.passed && detail.suggestion && (
                                                                <div className="text-sm mt-1" style={{ color: `${customization.textColor}80` }}>
                                                                    {detail.suggestion}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default AnalyticsPanel;