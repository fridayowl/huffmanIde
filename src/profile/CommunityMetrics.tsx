import React from 'react';
import { motion } from 'framer-motion';
import {
    Users, Award, TrendingUp, MessageCircle,
    Heart, Star, Shield, Zap, GitPullRequest,
    Code, Brain, BookOpen, LucideIcon
} from 'lucide-react';
import {
    LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
    RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';

interface CommunityStats {
    connections: number;
    contributions: number;
    reputation: number;
    helpScore: number;
}

interface Character {
    type: string;
    level: number;
    // Add other character properties as needed
}

interface ActivityData {
    name: string;
    value: number;
}

interface RadarData {
    subject: string;
    A: number;
}

interface RecentActivity {
    icon: LucideIcon;
    text: string;
    time: string;
    type: 'review' | 'mentor' | 'help' | 'learn';
}

interface CommunityMetricsProps {
    stats: {
        reputation: number;
        contributions: number;
        connections: number;
        projectsCompleted: number;
        mentorshipHours: number;
        helpScore: number;
        endorsements: {
            skill: string;
            count: number;
        }[];
    };
    character: Character;
}
const CommunityMetrics: React.FC<CommunityMetricsProps> = ({ stats, character }) => {
    const activityData: ActivityData[] = [
        { name: 'Mon', value: 65 },
        { name: 'Tue', value: 78 },
        { name: 'Wed', value: 82 },
        { name: 'Thu', value: 75 },
        { name: 'Fri', value: 85 },
        { name: 'Sat', value: 45 },
        { name: 'Sun', value: 40 }
    ];

    const radarData: RadarData[] = [
        { subject: 'Code Quality', A: 85 },
        { subject: 'Collaboration', A: 75 },
        { subject: 'Communication', A: 90 },
        { subject: 'Problem Solving', A: 82 },
        { subject: 'Learning Speed', A: 88 }
    ];

    const recentActivities: RecentActivity[] = [
        { icon: Code, text: 'Reviewed 3 pull requests', time: '2 hours ago', type: 'review' },
        { icon: Brain, text: 'Mentored a junior developer', time: '5 hours ago', type: 'mentor' },
        { icon: MessageCircle, text: 'Answered 5 questions', time: '1 day ago', type: 'help' },
        { icon: BookOpen, text: 'Completed a learning path', time: '2 days ago', type: 'learn' }
    ];

    const statItems: Array<{
        label: string;
        value: number;
        icon: LucideIcon;
        color: string;
    }> = [
            { label: 'Connections', value: stats.connections, icon: Users, color: 'blue' },
            { label: 'Contributions', value: stats.contributions, icon: GitPullRequest, color: 'green' },
            { label: 'Reputation', value: stats.reputation, icon: Star, color: 'amber' },
            { label: 'Help Score', value: stats.helpScore, icon: Heart, color: 'rose' }
        ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-8"
        >
            {/* Header */}
            <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-emerald-500/20">
                    <Users className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-white">Community Impact</h2>
                    <p className="text-gray-400">Your influence and contributions</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {statItems.map((stat, index) => (
                    <div key={index} className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-6">
                        <div className={`w-10 h-10 rounded-lg bg-${stat.color}-500/20 flex items-center justify-center mb-4`}>
                            <stat.icon className={`w-5 h-5 text-${stat.color}-400`} />
                        </div>
                        <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                        <p className="text-sm text-gray-400">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Activity Timeline */}
                <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-6">
                    <h3 className="text-lg font-medium text-white mb-6">Weekly Activity</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={activityData}>
                                <XAxis dataKey="name" stroke="#6B7280" />
                                <YAxis stroke="#6B7280" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#1F2937',
                                        border: '1px solid #374151',
                                        borderRadius: '0.5rem'
                                    }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#10B981"
                                    strokeWidth={2}
                                    dot={{ fill: '#10B981' }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Skills Radar */}
                <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-6">
                    <h3 className="text-lg font-medium text-white mb-6">Skills Assessment</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart data={radarData}>
                                <PolarGrid stroke="#374151" />
                                <PolarAngleAxis dataKey="subject" stroke="#6B7280" />
                                <PolarRadiusAxis stroke="#6B7280" />
                                <Radar
                                    name="Skills"
                                    dataKey="A"
                                    stroke="#10B981"
                                    fill="#10B981"
                                    fillOpacity={0.2}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#1F2937',
                                        border: '1px solid #374151',
                                        borderRadius: '0.5rem'
                                    }}
                                />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-6">
                <h3 className="text-lg font-medium text-white mb-6">Recent Activity</h3>
                <div className="space-y-4">
                    {recentActivities.map((activity, index) => (
                        <div key={index} className="flex items-center gap-4 p-4 bg-gray-700/20 rounded-lg">
                            <activity.icon className="w-5 h-5 text-gray-400" />
                            <div className="flex-1">
                                <p className="text-white">{activity.text}</p>
                                <p className="text-sm text-gray-400">{activity.time}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default CommunityMetrics;