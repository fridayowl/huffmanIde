import React, { useState } from 'react';
import NavBarMinimal from '../NavBar';
import { ActivitySquare, Brain, Heart, Clock, Battery, Zap, LucideIcon } from 'lucide-react';
import TimeMetricsDashboard from './TimeMetricsDashboard';
import MentalHealthDashboard from './MentalHealthDashboard';
// import FocusScoreSystem from './Enhanced Focus Score System';

interface HealthMetric {
    title: string;
    value: string;
    change: string;
    icon: LucideIcon;
    description: string;
    gradient: string;
}

interface HealthMetricCardProps extends HealthMetric { }

interface DashboardCustomization {
    backgroundColor: string;
    textColor: string;
    highlightColor: string;
}

type TabType = 'overview' | 'focus' | 'mental';

const HealthAnalytics: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabType>('overview');

    // Theme customization
    const dashboardCustomization: DashboardCustomization = {
        backgroundColor: "transparent",
        textColor: "#ffffff",
        highlightColor: "#818cf8"
    };

    const metrics: HealthMetric[] = [
        {
            title: "Focus Score",
            value: "85%",
            change: "+5%",
            icon: Brain,
            description: "Daily cognitive performance",
            gradient: "from-purple-900/50 to-purple-800/50"
        },
        {
            title: "Stress Level",
            value: "Low",
            change: "Optimal",
            icon: Heart,
            description: "Based on activity patterns",
            gradient: "from-red-900/50 to-red-800/50"
        },
        {
            title: "Break Time",
            value: "45m",
            change: "On Track",
            icon: Clock,
            description: "Total break duration",
            gradient: "from-blue-900/50 to-blue-800/50"
        },
        {
            title: "Energy Level",
            value: "High",
            change: "+10%",
            icon: Battery,
            description: "Based on productivity",
            gradient: "from-green-900/50 to-green-800/50"
        },
        {
            title: "Productivity",
            value: "92%",
            change: "+3%",
            icon: Zap,
            description: "Task completion rate",
            gradient: "from-yellow-900/50 to-yellow-800/50"
        }
    ];

    const HealthMetricCard: React.FC<HealthMetricCardProps> = ({
        title,
        value,
        change,
        icon: Icon,
        description,
        gradient
    }) => (
        <div className="relative group">
            <div className={`p-6 rounded-lg border border-gray-800 bg-gradient-to-br ${gradient} backdrop-blur-xl transition-all duration-300 hover:-translate-y-1`}>
                <div className="flex items-start justify-between mb-4">
                    <div className="p-2 bg-white/5 rounded-lg">
                        <Icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-white">{change}</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">{value}</h3>
                <p className="text-sm text-gray-400 mb-2">{title}</p>
                <p className="text-xs text-gray-500">{description}</p>
            </div>
        </div>
    );

    const tabs: TabType[] = ['overview', 'focus', 'mental'];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            <NavBarMinimal />

            <main className="container mx-auto px-6 py-8 space-y-12">
                {/* Header Section */}
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <ActivitySquare className="w-8 h-8 text-indigo-400" />
                        <h1 className="text-3xl font-bold text-white">Developer Health Analytics</h1>
                    </div>
                    <p className="text-gray-400 max-w-2xl">
                        Monitor and optimize your development habits with real-time health metrics and personalized insights.
                    </p>
                </div>

                {/* Navigation Tabs */}
                <div className="flex gap-4 border-b border-gray-700">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${activeTab === tab
                                    ? 'text-indigo-400 border-indigo-400'
                                    : 'text-gray-400 border-transparent hover:text-gray-300'
                                }`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Dynamic Content Based on Active Tab */}
                {activeTab === 'overview' && (
                    <>
                        {/* Metrics Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                            {metrics.map((metric, index) => (
                                <HealthMetricCard key={index} {...metric} />
                            ))}
                        </div>

                        {/* Time Metrics Dashboard */}
                        <div className="bg-gray-800/50 backdrop-blur-xl rounded-lg border border-gray-700">
                            <div className="p-6 border-b border-gray-700">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-6 h-6 text-indigo-400" />
                                    <h2 className="text-xl font-bold text-white">Time Analytics</h2>
                                </div>
                                <p className="text-gray-400 mt-1">
                                    Detailed breakdown of your coding sessions and time management metrics
                                </p>
                            </div>
                            <TimeMetricsDashboard customization={dashboardCustomization} />
                        </div>
                    </>
                )}

                {activeTab === 'focus' && (
                    <div className="bg-gray-800/50 backdrop-blur-xl rounded-lg border border-gray-700">
                        {/* <FocusScoreSystem /> */}
                    </div>
                )}

                {activeTab === 'mental' && (
                    <div className="bg-gray-800/50 backdrop-blur-xl rounded-lg border border-gray-700">
                        <MentalHealthDashboard />
                    </div>
                )}
            </main>
        </div>
    );
};

export default HealthAnalytics;