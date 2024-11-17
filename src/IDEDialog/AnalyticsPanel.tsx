import React, { useMemo, useState } from 'react';
import { BarChart2, Code, Hash, GitBranch, Parentheses, Shield,CheckCircle, FileText, AlertTriangle, Info, LucideIcon, Zap, Code2, ChevronRight } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip,Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

interface IDESidePanelProps {
    customization: {
        backgroundColor: string;
        textColor: string;
        highlightColor: string;
    };
    code?: string;
}

interface TooltipProps {
    content: string;
    children: React.ReactNode;
    customization: IDESidePanelProps['customization'];
}

interface AnalyticsStats {
    totalLines: number;
    emptyLines: number;
    commentLines: number;
    codeLines: number;
    functions: number;
    classes: number;
    imports: number;
    complexityScore: number;
    indentationLevels: number[];
}

interface ChartDataPoint {
    level: string;
    lines: number;
}

interface Analytics {
    stats: AnalyticsStats;
    chartData: ChartDataPoint[];
}

interface MetricCardProps {
    icon: typeof Code;
    label: string;
    value: number | string;
    tooltip?: string;
    customization: IDESidePanelProps['customization'];
}
// import React, { useMemo, useState } from 'react';
// import { CheckCircle, Shield, AlertTriangle, Info, Lock, Zap, Code2, GitBranch } from 'lucide-react';
// import { RadarChart, PolarGrid, PolarAngleAxis, Radar, Tooltip, ResponsiveContainer, PolarRadiusAxis } from 'recharts';

interface SecurityEvaluationPanelProps {
    code: string;
    customization: {
        backgroundColor: string;
        textColor: string;
        highlightColor: string;
    };
}

interface MetricDetail {
    score: number;
    details: Array<{
        name: string;
        passed: boolean;
        impact: 'high' | 'medium' | 'low';
        suggestion?: string;
    }>;
}



const SecurityEvaluationPanel: React.FC<SecurityEvaluationPanelProps> = ({ code, customization }) => {
    const [expandedSection, setExpandedSection] = useState<string | null>(null);

    const analyzeCode = (code: string) => {
        const metrics: Record<string, MetricDetail> = {
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
                        name: 'Environment Variables',
                        passed: /process\.env/.test(code),
                        impact: 'high',
                        suggestion: 'Use environment variables for configuration.'
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
                    },
                    {
                        name: 'Code Injection Prevention',
                        passed: !/eval\(|Function\(|new\s+Function/.test(code),
                        impact: 'high',
                        suggestion: 'Avoid using eval() and new Function().'
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
                        name: 'Custom Error Handling',
                        passed: /throw\s+new\s+(\w+Error|Error)/.test(code),
                        impact: 'medium',
                        suggestion: 'Use custom error types.'
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
                    },
                    {
                        name: 'Promise Handling',
                        passed: /\.catch\s*\(|try\s*{[\s\S]*?catch/.test(code),
                        impact: 'high',
                        suggestion: 'Handle promise rejections.'
                    }
                ]
            },
            maintainability: {
                score: 0,
                details: [
                    // {
                    //     name: 'Documentation',
                    //     passed: /\/\*\*[\s\S]*?\*\/|\/\//.test(code),
                    //     impact: 'medium',
                    //     suggestion: 'Add JSDoc documentation.'
                    // },
                    {
                        name: 'Type Definitions',
                        passed: /interface|type\s+\w+\s*=/.test(code),
                        impact: 'medium',
                        suggestion: 'Use TypeScript interfaces.'
                    },
                    {
                        name: 'Constants Usage',
                        passed: /const/.test(code),
                        impact: 'low',
                        suggestion: 'Use constants for fixed values.'
                    },
                    {
                        name: 'Module Structure',
                        passed: /export|import/.test(code),
                        impact: 'medium',
                        suggestion: 'Use ES modules.'
                    },
                    {
                        name: 'Function Length',
                        passed: code.split('\n').length <= 30,
                        impact: 'medium',
                        suggestion: 'Keep functions small and focused.'
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
                        name: 'String Concatenation',
                        passed: !/\+\s*"/.test(code),
                        impact: 'low',
                        suggestion: 'Use template literals.'
                    },
                    {
                        name: 'Method Chaining',
                        passed: !/\.[a-zA-Z]+\(\)\.[a-zA-Z]+\(\)/.test(code),
                        impact: 'medium',
                        suggestion: 'Minimize method chaining.'
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

        return metrics;
    };

    const securityMetrics = useMemo(() => {
        const metrics = analyzeCode(code);
        const totalScore = Object.values(metrics).reduce((acc, { score }) => acc + score, 0);
        return { metrics, totalScore };
    }, [code]);

    const radarData = [
        { subject: 'Security', score: securityMetrics.metrics.security.score, fullMark: 25 },
        { subject: 'Reliability', score: securityMetrics.metrics.reliability.score, fullMark: 25 },
        { subject: 'Maintainability', score: securityMetrics.metrics.maintainability.score, fullMark: 25 },
        { subject: 'Performance', score: securityMetrics.metrics.performance.score, fullMark: 25 }
    ];

    const getScoreColor = (score: number) => {
        if (score >= 80) return '#10B981';
        if (score >= 50) return '#FBBF24';
        return '#EF4444';
    };

    return (
        <div className="w-full p-6 rounded-lg" style={{
            backgroundColor: customization.backgroundColor,
            color: customization.textColor,
            border: `1px solid ${customization.textColor}20`,
            fontSize: '14px'
        }}>
            {/* Header */}
            {/* <div className="flex items-center gap-3 mb-6">
                <Shield className="w-6 h-6" style={{ color: customization.highlightColor }} />
                <h2 className="text-xl font-semibold">Code Quality Analysis</h2>
            </div> */}

            {/* Chart Section */}
            <div className="flex flex-col items-center">
                {/* Radar Chart */}
                <div className="w-52 h-52 mb-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart outerRadius="80%" data={radarData}>
                            <defs>
                                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor={customization.highlightColor} stopOpacity={0.8} />
                                    <stop offset="100%" stopColor={customization.highlightColor} stopOpacity={0.2} />
                                </linearGradient>
                            </defs>
                            <PolarGrid
                                stroke={`${customization.textColor}30`}
                                gridType="circle"
                            />
                            <PolarAngleAxis
                                dataKey="subject"
                                tick={{
                                    fill: customization.textColor,
                                    fontSize: 8,
                                    fontWeight: 500
                                }}
                            />
                            <Radar
                                name="Score"
                                dataKey="score"
                                stroke={customization.highlightColor}
                                fill="url(##FBBF24)"
                                fillOpacity={0.6}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: customization.backgroundColor,
                                    border: `1px solid ${customization.textColor}30`,
                                    borderRadius: '4px',
                                    padding: '8px'
                                }}
                                itemStyle={{ color: customization.textColor }}
                                labelStyle={{ color: customization.textColor }}
                            />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>

                {/* Total Score Display */}
                <div className="text-center">
                    <div className="text-3xl font-bold mb-1" style={{ color: getScoreColor(securityMetrics.totalScore) }}>
                        {securityMetrics.totalScore}
                        <span className="text-lg opacity-60 ml-1">/100</span>
                    </div>
                    <div className="text-sm opacity-70">Overall Quality Score</div>
                </div>
            </div>

            {/* Metrics List */}
            <div className="space-y-4">
                {Object.entries(securityMetrics.metrics).map(([key, { score, details }]) => {
                    const isExpanded = expandedSection === key;
                    const scorePercentage = (score / 25) * 100;

                    return (
                        <div key={key} className="rounded-lg overflow-hidden">
                            <button
                                onClick={() => setExpandedSection(isExpanded ? null : key)}
                                className="w-full p-4 flex items-center gap-4 transition-colors"
                                style={{
                                    backgroundColor: `${customization.highlightColor}10`,
                                }}
                            >
                                <ChevronRight
                                    className={`transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                                    size={20}
                                />

                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-medium capitalize">{key}</span>
                                        <span className="font-bold" style={{ color: getScoreColor(scorePercentage) }}>
                                            {score}/25
                                        </span>
                                    </div>

                                    <div className="w-full h-1.5 rounded-full bg-gray-700/50 overflow-hidden">
                                        <div
                                            className="h-full transition-all duration-500 rounded-full"
                                            style={{
                                                width: `${scorePercentage}%`,
                                                backgroundColor: getScoreColor(scorePercentage)
                                            }}
                                        />
                                    </div>
                                </div>
                            </button>

                            {isExpanded && (
                                <div
                                    className="p-4 space-y-3 animate-fadeIn"
                                    style={{
                                        backgroundColor: `${customization.highlightColor}05`,
                                    }}
                                >
                                    {details.map((detail, index) => (
                                        <div
                                            key={index}
                                            className="flex items-start gap-3 p-3 rounded-lg"
                                            style={{
                                                backgroundColor: `${customization.backgroundColor}90`
                                            }}
                                        >
                                            {detail.passed ? (
                                                <CheckCircle className="w-5 h-5 mt-0.5 text-emerald-500" />
                                            ) : (
                                                <AlertTriangle className="w-5 h-5 mt-0.5 text-amber-500" />
                                            )}
                                            <div className="flex-1">
                                                <div className="font-medium mb-1">{detail.name}</div>
                                                {!detail.passed && (
                                                    <div className="text-sm opacity-70">{detail.suggestion}</div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.2s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default SecurityEvaluationPanel;
//

 
const InfoTooltip: React.FC<TooltipProps> = ({ content, children, customization }) => {
    const [show, setShow] = useState(false);

    return (
        <div className="relative inline-flex items-center">
            {children}
            <button
                className="ml-1 p-1 rounded-full hover:bg-white/5 transition-colors"
                onMouseEnter={() => setShow(true)}
                onMouseLeave={() => setShow(false)}
            >
                <Info size={12} style={{ color: customization.textColor }} />
            </button>
            {show && (
                <div
                    className="absolute z-50 w-48 p-2 text-xs rounded-lg shadow-lg"
                    style={{
                        backgroundColor: customization.backgroundColor,
                        border: `1px solid ${customization.textColor}20`,
                        color: customization.textColor,
                        top: "100%",
                        left: "50%",
                        transform: "translateX(-50%)",
                    }}
                >
                    {content}
                </div>
            )}
        </div>
    );
};

interface AnalyticsStats {
    totalLines: number;
    emptyLines: number;
    commentLines: number;
    codeLines: number;
    functions: number;
    classes: number;
    imports: number;
    complexityScore: number;
    indentationLevels: number[];
}

interface Analytics {
    stats: AnalyticsStats;
    chartData: Array<{
        level: string;
        lines: number;
    }>;
}



interface TabButtonProps {
    active: boolean;
    onClick: () => void;
     icon: LucideIcon;
    label: string;
    customization: any;
}

const TabButton: React.FC<TabButtonProps> = ({ active, onClick, icon: Icon, label, customization }) => (
    <button
        onClick={onClick}
        className={`
            px-4 py-2 text-sm font-medium transition-all duration-200 
            flex items-center gap-2 border-b-2
            hover:bg-white/5
            ${active ? 'border-current opacity-100' : 'border-transparent opacity-70 hover:opacity-100'}
        `}
        style={{
            color: active ? customization.highlightColor : customization.textColor, fontSize: '0.8rem' 
        }}
    >
        <Icon size={14} />
        {label}
    </button>
);

const MetricCard: React.FC<MetricCardProps> = ({
    icon: Icon,
    label,
    value,
    tooltip,
    customization,

}) => (
    <div
        className="flex items-center gap-1 p-2 rounded-lg"
        style={{ backgroundColor: `${customization.highlightColor}08` }}
    >
        <Icon size={14} style={{ color: customization.textColor }} />
        <div className="flex-1 min-w-0">
            <div
                className="text-[8px] opacity-80 flex items-center gap-2 truncate"
                style={{ color: customization.textColor }}
            >
                {label}
                {tooltip && (
                    <Info size={10} className="opacity-50 flex-shrink-0" />
                )}
            </div>
            <div
                className="text-xs font-semibold truncate"
                style={{ color: customization.textColor }}
            >
                {value}
            </div>
        </div>
    </div>
);

export const AnalyticsPanel: React.FC<IDESidePanelProps> = ({ customization, code = '' }) => {
    const [activeTab, setActiveTab] = useState<'analytics' | 'security'>('analytics');

    const analytics = useMemo(() => {
        const lines = code.split('\n');
        const stats: AnalyticsStats = {
            totalLines: lines.length,
            emptyLines: lines.filter(line => !line.trim()).length,
            commentLines: lines.filter(line => line.trim().startsWith('#')).length,
            codeLines: 0,
            functions: 0,
            classes: 0,
            imports: 0,
            complexityScore: 0,
            indentationLevels: Array(10).fill(0), // Initialize with zeros to prevent undefined
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

        // Ensure we only include levels that are actually used
        const chartData = stats.indentationLevels
            .slice(0, maxIndentation + 1)
            .map((count, level) => ({
                level: `Level ${level}`,
                lines: count || 0
            }))
            .filter(item => item.lines > 0); // Only include levels with actual lines

        return { stats, chartData };
    }, [code]);

    const getComplexityLevel = (score: number): 'Low' | 'Moderate' | 'High' => {
        if (score < 5) return 'Low';
        if (score < 10) return 'Moderate';
        return 'High';
    };

    const getComplexityColor = (level: 'Low' | 'Moderate' | 'High'): string => {
        switch (level) {
            case 'Low': return '#10B981';
            case 'Moderate': return '#F59E0B';
            case 'High': return '#EF4444';
        }
    };

    const complexityLevel = getComplexityLevel(analytics.stats.complexityScore);

    return (
        <div
            className="rounded-lg border overflow-hidden shadow-lg"
            style={{
                backgroundColor: customization.backgroundColor,
                borderColor: `${customization.textColor}10`,
                height: '100vh',
                overflow: 'auto'
            }}
        >
            {/* Tab Header */}
            <div
                className="sticky top-0 z-10 border-b flex items-center bg-opacity-95 backdrop-blur-sm"
                style={{
                    backgroundColor: customization.backgroundColor,
                    borderColor: `${customization.textColor}10`
                }}
            >
                <TabButton
                    active={activeTab === 'analytics'}
                    onClick={() => setActiveTab('analytics')}
                    icon={BarChart2}
                    label="Code info"
                    customization={customization}
                />
                <TabButton
                    active={activeTab === 'security'}
                    onClick={() => setActiveTab('security')}
                    icon={Shield}
                    label="Code Analytics"
                    customization={customization}
                />
            </div>

            {activeTab === 'analytics' ? (
                <div className="p-2 space-y-2">
                    {/* Code Structure */}
                    <div className="grid grid-cols-2 gap-1.5">
                        <MetricCard
                            icon={Code}
                            label="Total Lines"
                            value={analytics.stats.totalLines}
                            tooltip="Total number of lines in the file"
                            customization={customization}
                        />
                        <MetricCard
                            icon={Hash}
                            label="Code Lines"
                            value={analytics.stats.codeLines}
                            tooltip="Executable code lines"
                            customization={customization}
                        />
                        <MetricCard
                            icon={Parentheses}
                            label="Functions"
                            value={analytics.stats.functions}
                            tooltip="Function definitions"
                            customization={customization}
                        />
                        <MetricCard
                            icon={GitBranch}
                            label="Classes"
                            value={analytics.stats.classes}
                            tooltip="Class definitions"
                            customization={customization}
                        />
                    </div>

                    {/* Complexity Indicator */}
                    <div
                        className="p-1 rounded-lg flex items-center justify-between"
                        style={{
                            backgroundColor: `${customization.highlightColor}08`,
                            borderLeft: `3px solid ${getComplexityColor(complexityLevel)}`
                        }}
                    >
                        <div className="flex items-center gap-2">
                            <AlertTriangle size={14} style={{ color: customization.textColor }} />
                            <span className="text-xs" style={{ color: customization.textColor, fontSize: '0.8rem' }}>
                                Complexity Score: {analytics.stats.complexityScore}
                            </span>
                        </div>
                        <span
                            className="text-sm font-medium"
                            style={{ color: getComplexityColor(complexityLevel), fontSize: '0.8rem' }}
                        >
                            {complexityLevel}
                        </span>
                    </div>

                    {/* Distribution Chart */}
                    <div className="mt-5">
                        <h4
                            className="text-sm font-medium mb-4"
                            style={{ color: customization.textColor, fontSize: '0.8rem' }}
                        >
                            Indentation Distribution
                        </h4>
                        <div className="h-[100px]"> {/* Reduced the height from 150px to 100px */}
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart
                                    data={analytics.chartData}
                                    margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                                >
                                    <XAxis
                                        dataKey="level"
                                        stroke={`${customization.textColor}80`}
                                        tick={{ fontSize: 10 }}
                                        tickLine={{ stroke: `${customization.textColor}40` }}
                                        axisLine={{ stroke: `${customization.textColor}40` }}
                                    />
                                    <YAxis
                                        stroke={`${customization.textColor}80`}
                                        tick={{ fontSize: 10 }}
                                        tickLine={{ stroke: `${customization.textColor}40` }}
                                        axisLine={{ stroke: `${customization.textColor}40` }}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: customization.backgroundColor,
                                            border: `1px solid ${customization.textColor}20`,
                                            borderRadius: '6px',
                                            fontSize: '12px'
                                        }}
                                        formatter={(value: number) => [`${value} lines`, 'Lines of Code']}
                                        labelFormatter={(label: string) => `Indentation ${label}`}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="lines"
                                        stroke={customization.highlightColor}
                                        strokeWidth={2}
                                        dot={{
                                            fill: customization.highlightColor,
                                            r: 3,
                                            strokeWidth: 1,
                                            stroke: customization.highlightColor
                                        }}
                                        activeDot={{
                                            r: 5,
                                            stroke: customization.highlightColor,
                                            strokeWidth: 2
                                        }}
                                        isAnimationActive={true}
                                        animationDuration={1000}
                                        animationEasing="ease-out"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Code Composition */}
                    <div className="space-y-1 pt-1">
                        <h4
                            className="text-sm font-medium"
                            style={{ color: customization.textColor, fontSize: '0.8rem' }}
                        >
                            Code Composition
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
                        <div className="flex justify-between text-xs">
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
                </div>
            ) : (
                <SecurityEvaluationPanel customization={customization} code={code} />
            )}
        </div>
    );
};

