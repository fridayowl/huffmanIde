import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Brain, Code, Heart, BookOpen, Trophy, Star,
    Award, GitPullRequest, TrendingUp, Target, Check,
    LucideIcon
} from 'lucide-react';

interface Level {
    name: string;
    threshold: number;
    description: string;
    perks: string[];
}

interface CharacterMetrics {
    [key: string]: number;
}

interface CharacterData {
    type: string;
    title: string;
    icon: LucideIcon;
    color: string;
    levels: Level[];
    metrics: CharacterMetrics;
}

interface Characters {
    [key: string]: CharacterData;
}

interface CharacterInfo {
    type: string;
    progress: number;
}

interface CharacterSelectionProps {
    character?: CharacterInfo;
    onUpdate: (data: CharacterData) => void;
}

const CharacterSelection: React.FC<CharacterSelectionProps> = ({ character, onUpdate }) => {
    const [selectedType, setSelectedType] = useState<string>(character?.type || 'reviewer');

    const characters: Characters = {
        reviewer: {
            type: 'reviewer',
            title: "Code Reviewer",
            icon: Code,
            color: "indigo",
            levels: [
                { name: "Novice Reviewer", threshold: 0, description: "Starting your review journey", perks: ["Basic review tools", "Community support"] },
                { name: "Quality Checker", threshold: 50, description: "Developing keen eye for code", perks: ["Advanced metrics", "Priority reviews"] },
                { name: "Code Guardian", threshold: 100, description: "Mastering the art of review", perks: ["Mentoring abilities", "Review highlights"] },
                { name: "Master Reviewer", threshold: 200, description: "Leading by example", perks: ["Custom review tools", "Community recognition"] }
            ],
            metrics: {
                reviewedBlocks: 127,
                acceptedChanges: 89,
                codeQuality: 92,
                totalImpact: 1250
            }
        },
        mentor: {
            type: 'mentor',
            title: "Code Mentor",
            icon: Brain,
            color: "purple",
            levels: [
                { name: "Helper", threshold: 0, description: "Beginning to guide others", perks: ["Basic mentoring tools", "Community access"] },
                { name: "Guide", threshold: 30, description: "Growing your impact", perks: ["Session analytics", "Student feedback"] },
                { name: "Mentor", threshold: 75, description: "Shaping future developers", perks: ["Advanced teaching tools", "Recognition"] },
                { name: "Senior Mentor", threshold: 150, description: "Leading the community", perks: ["Custom curriculums", "Featured status"] }
            ],
            metrics: {
                studentsHelped: 45,
                sessionsCompleted: 156,
                satisfaction: 98,
                totalHours: 234
            }
        },
        health: {
            type: 'health',
            title: "Health Guardian",
            icon: Heart,
            color: "rose",
            levels: [
                { name: "Wellness Starter", threshold: 0, description: "Beginning your wellness journey", perks: ["Basic tracking", "Community support"] },
                { name: "Balance Seeker", threshold: 40, description: "Building healthy habits", perks: ["Advanced analytics", "Wellness rewards"] },
                { name: "Health Advocate", threshold: 100, description: "Inspiring others", perks: ["Community features", "Health coaching"] },
                { name: "Wellness Coach", threshold: 200, description: "Leading by example", perks: ["Custom programs", "Recognition"] }
            ],
            metrics: {
                streakDays: 45,
                exerciseHours: 128,
                workLifeScore: 88,
                communityImpact: 756
            }
        },
        learner: {
            type: 'learner',
            title: "Knowledge Seeker",
            icon: BookOpen,
            color: "amber",
            levels: [
                { name: "Curious Mind", threshold: 0, description: "Starting your learning path", perks: ["Basic resources", "Community access"] },
                { name: "Active Learner", threshold: 25, description: "Building knowledge", perks: ["Study analytics", "Learning paths"] },
                { name: "Knowledge Explorer", threshold: 75, description: "Mastering skills", perks: ["Advanced tools", "Mentorship"] },
                { name: "Tech Sage", threshold: 150, description: "Sharing wisdom", perks: ["Custom learning", "Recognition"] }
            ],
            metrics: {
                coursesCompleted: 12,
                skillsLearned: 28,
                projectsBuilt: 15,
                learningHours: 342
            }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
        hover: { scale: 1.02, boxShadow: "0 8px 30px rgba(0,0,0,0.12)" }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-8"
        >
            {/* Character Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Object.entries(characters).map(([type, data]) => (
                    <motion.button
                        key={type}
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        whileHover="hover"
                        onClick={() => {
                            setSelectedType(type);
                            onUpdate(data);
                        }}
                        className={`p-6 rounded-xl border text-left transition-colors ${selectedType === type
                                ? `bg-${data.color}-500/20 border-${data.color}-500`
                                : 'bg-gray-800/50 border-gray-700/50'
                            }`}
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <div className={`p-3 rounded-lg bg-${data.color}-500/20`}>
                                <data.icon className={`w-6 h-6 text-${data.color}-400`} />
                            </div>
                            <div>
                                <h3 className="font-medium text-white">{data.title}</h3>
                                <p className="text-sm text-gray-400">
                                    Level {data.levels.findIndex(l => l.threshold > (character?.progress || 0))}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            {Object.entries(data.metrics).slice(0, 2).map(([key, value]) => (
                                <div key={key} className="flex justify-between text-sm">
                                    <span className="text-gray-400">
                                        {key.replace(/([A-Z])/g, ' $1').trim()}
                                    </span>
                                    <span className="text-white">{value}</span>
                                </div>
                            ))}
                        </div>
                    </motion.button>
                ))}
            </div>

            {/* Selected Character Details */}
            {selectedType && characters[selectedType] && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-6"
                >
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Level Progress */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-white">Level Progress</h3>
                            <div className="space-y-6">
                                {characters[selectedType].levels.map((level, index) => (
                                    <div key={index} className="relative">
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="text-gray-400">{level.name}</span>
                                            <span className="text-gray-400">{level.threshold}+</span>
                                        </div>
                                        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{
                                                    width: `${Math.min(100, ((character?.progress || 0) / level.threshold) * 100)}%`
                                                }}
                                                className={`h-full bg-${characters[selectedType].color}-500`}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Metrics */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-white">Current Metrics</h3>
                            <div className="grid grid-cols-2 gap-4">
                                {Object.entries(characters[selectedType].metrics).map(([key, value]) => (
                                    <div key={key} className="bg-gray-700/30 rounded-lg p-4">
                                        <p className="text-sm text-gray-400 mb-1">
                                            {key.replace(/([A-Z])/g, ' $1').trim()}
                                        </p>
                                        <p className="text-xl font-bold text-white">{value}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Perks */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-white">Level Perks</h3>
                            <div className="space-y-4">
                                {characters[selectedType].levels
                                    .filter(level => level.threshold <= (character?.progress || 0))
                                    .map((level, index) => (
                                        <div key={index} className="bg-gray-700/30 rounded-lg p-4">
                                            <p className="text-sm font-medium text-white mb-2">{level.name}</p>
                                            <ul className="space-y-2">
                                                {level.perks.map((perk, i) => (
                                                    <li key={i} className="text-sm text-gray-400 flex items-center gap-2">
                                                        <Check className="w-4 h-4 text-green-400" />
                                                        {perk}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
};

export default CharacterSelection;