import React from 'react';
import { motion } from 'framer-motion';
import {
    User, Star, Heart, Code,
    Users, GraduationCap, MapPin,
    GitPullRequest, Trophy, Clock
} from 'lucide-react';
import { type ProfileData, type Character, type PersonalInfo, type CommunityStats } from './profile-types';

interface ProfileOverviewProps {
    profileData: ProfileData;
}

interface QuickStat {
    label: string;
    value: string | number;
}

interface CommunityMetric {
    icon: typeof Trophy | typeof Users | typeof GitPullRequest;
    label: string;
    value: string | number;
    color: string;
}

const ProfileOverview: React.FC<ProfileOverviewProps> = ({ profileData }) => {
    const { character, personal, communityStats } = profileData;

    const quickStats: QuickStat[] = [
        { label: 'Experience', value: character.experience },
        { label: 'Badges', value: character.badges.length },
        { label: 'Active Time', value: character.activeTime },
        { label: 'Specializations', value: character.specializations.length }
    ];

    const communityMetrics: CommunityMetric[] = [
        {
            icon: Trophy,
            label: 'Reputation',
            value: communityStats.reputation,
            color: 'text-amber-400'
        },
        {
            icon: Users,
            label: 'Helped',
            value: `${communityStats.impact.peopleHelped} people`,
            color: 'text-blue-400'
        },
        {
            icon: GitPullRequest,
            label: 'Reviews',
            value: communityStats.impact.codeReviewed,
            color: 'text-green-400'
        }
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
                <div className="p-3 rounded-lg bg-blue-500/20">
                    <User className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-white">{personal.name}</h2>
                    <p className="text-gray-400 flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {personal.location} • {personal.timezone}
                    </p>
                </div>
            </div>

            {/* Character Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Current Character */}
                <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-6">
                    <h3 className="text-lg font-medium text-white mb-4">Current Character</h3>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-indigo-500/20">
                                <Code className="w-5 h-5 text-indigo-400" />
                            </div>
                            <div>
                                <p className="text-white font-medium">{character.type}</p>
                                <p className="text-sm text-gray-400">Level {character.level}</p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Progress</span>
                                <span className="text-white">{character.progress}%</span>
                            </div>
                            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-indigo-500 rounded-full"
                                    style={{ width: `${character.progress}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-6">
                    <h3 className="text-lg font-medium text-white mb-4">Quick Stats</h3>
                    <div className="grid grid-cols-2 gap-4">
                        {quickStats.map((stat, index) => (
                            <div key={index}>
                                <p className="text-gray-400 text-sm">{stat.label}</p>
                                <p className={`${index < 2 ? 'text-2xl font-bold' : ''} text-white`}>
                                    {stat.value}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Community Impact */}
                <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-6">
                    <h3 className="text-lg font-medium text-white mb-4">Community Impact</h3>
                    <div className="space-y-4">
                        {communityMetrics.map((metric, index) => (
                            <div key={index} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <metric.icon className={`w-4 h-4 ${metric.color}`} />
                                    <span className="text-gray-400">{metric.label}</span>
                                </div>
                                <span className="text-white font-medium">{metric.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Skills & Goals */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-6">
                    <h3 className="text-lg font-medium text-white mb-4">Top Skills</h3>
                    <div className="flex flex-wrap gap-2">
                        {personal.skills.map((skill, index) => (
                            <span
                                key={index}
                                className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm"
                            >
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-6">
                    <h3 className="text-lg font-medium text-white mb-4">Current Goals</h3>
                    <div className="space-y-2">
                        {character.currentGoals.map((goal, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-2 text-gray-400"
                            >
                                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
                                {goal}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ProfileOverview;