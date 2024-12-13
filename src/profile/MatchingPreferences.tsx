import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Users, Target, Clock, Globe, Code,
    Book, Heart, Brain, Plus, X,
    LucideIcon
} from 'lucide-react';

interface MatchingPreferencesProps {
    preferences: {
        preferredCharacters: string[];
        skillsInterest: string[];
        collaborationTypes: string[];
        timeOverlap: number;
        mentorshipType: 'mentor' | 'mentee' | 'both' | 'none';
        roles: string[];
        skillLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
        availability: {
            timezone: string;
            preferredHours: string[];
        };
        interests: string[];
        projectTypes: string[];
        teamSize: number;
    };
    onUpdate: (preferences: any) => void;
}

interface CollaborationType {
    id: string;
    label: string;
    icon: LucideIcon;
}

const MatchingPreferences: React.FC<MatchingPreferencesProps> = ({ preferences, onUpdate }) => {
    const [newSkill, setNewSkill] = useState<string>('');

    const collaborationTypes: CollaborationType[] = [
        { id: 'pair', label: 'Pair Programming', icon: Users },
        { id: 'mentor', label: 'Mentorship', icon: Brain },
        { id: 'review', label: 'Code Review', icon: Code },
        { id: 'learn', label: 'Learning Together', icon: Book }
    ];

    const addSkill = () => {
        if (newSkill.trim() && !preferences.skillsInterest.includes(newSkill.trim())) {
            onUpdate({
                ...preferences,
                skillsInterest: [...preferences.skillsInterest, newSkill.trim()]
            });
            setNewSkill('');
        }
    };

    const removeSkill = (skill: string) => {
        onUpdate({
            ...preferences,
            skillsInterest: preferences.skillsInterest.filter(s => s !== skill)
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="max-w-4xl mx-auto space-y-8"
        >
            {/* Header */}
            <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-purple-500/20">
                    <Target className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-white">Matching Preferences</h2>
                    <p className="text-gray-400">Customize how you match with other developers</p>
                </div>
            </div>

            {/* Preferred Characters */}
            <div className="space-y-4">
                <h3 className="text-lg font-medium text-white">Preferred Characters</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {['mentor', 'reviewer', 'learner', 'health'].map((char) => (
                        <button
                            key={char}
                            onClick={() => {
                                const newPrefs = preferences.preferredCharacters.includes(char)
                                    ? preferences.preferredCharacters.filter(c => c !== char)
                                    : [...preferences.preferredCharacters, char];
                                onUpdate({ ...preferences, preferredCharacters: newPrefs });
                            }}
                            className={`p-4 rounded-lg border transition-colors ${preferences.preferredCharacters.includes(char)
                                ? 'bg-purple-500/20 border-purple-500 text-purple-400'
                                : 'bg-gray-800/50 border-gray-700/50 text-gray-400'
                                }`}
                        >
                            {char.charAt(0).toUpperCase() + char.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Skills Interest */}
            <div className="space-y-4">
                <h3 className="text-lg font-medium text-white">Skills Interest</h3>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newSkill}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewSkill(e.target.value)}
                        placeholder="Add a skill..."
                        className="flex-1 px-4 py-2 bg-gray-800/50 rounded-lg border border-gray-700/50 text-white"
                    />
                    <button
                        onClick={addSkill}
                        className="px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30"
                    >
                        <Plus className="w-5 h-5" />
                    </button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {preferences.skillsInterest.map((skill) => (
                        <div
                            key={skill}
                            className="px-3 py-1 bg-gray-800/50 rounded-full border border-gray-700/50 
                                flex items-center gap-2"
                        >
                            <span className="text-white">{skill}</span>
                            <button
                                onClick={() => removeSkill(skill)}
                                className="text-gray-400 hover:text-gray-300"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Collaboration Types */}
            <div className="space-y-4">
                <h3 className="text-lg font-medium text-white">Collaboration Types</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {collaborationTypes.map((type) => (
                        <button
                            key={type.id}
                            onClick={() => {
                                const newTypes = preferences.collaborationTypes.includes(type.id)
                                    ? preferences.collaborationTypes.filter(t => t !== type.id)
                                    : [...preferences.collaborationTypes, type.id];
                                onUpdate({ ...preferences, collaborationTypes: newTypes });
                            }}
                            className={`p-4 rounded-lg border flex flex-col items-center gap-2 transition-colors ${preferences.collaborationTypes.includes(type.id)
                                ? 'bg-purple-500/20 border-purple-500 text-purple-400'
                                : 'bg-gray-800/50 border-gray-700/50 text-gray-400'
                                }`}
                        >
                            <type.icon className="w-6 h-6" />
                            <span>{type.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Time Preferences */}
            <div className="space-y-4">
                <h3 className="text-lg font-medium text-white">Time Preferences</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-gray-400">Minimum Time Overlap</label>
                        <select
                            value={preferences.timeOverlap}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onUpdate({
                                ...preferences,
                                timeOverlap: parseInt(e.target.value)
                            })}
                            className="w-full px-4 py-2 bg-gray-800/50 rounded-lg border border-gray-700/50 text-white"
                        >
                            <option value="1">1 hour</option>
                            <option value="2">2 hours</option>
                            <option value="4">4 hours</option>
                            <option value="6">6 hours</option>
                            <option value="8">8 hours</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-gray-400">Mentorship Type</label>
                        <select
                            value={preferences.mentorshipType}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onUpdate({
                                ...preferences,
                                mentorshipType: e.target.value
                            })}
                            className="w-full px-4 py-2 bg-gray-800/50 rounded-lg border border-gray-700/50 text-white"
                        >
                            <option value="mentor">Want to be a Mentor</option>
                            <option value="mentee">Looking for a Mentor</option>
                            <option value="both">Both</option>
                            <option value="none">Not Interested</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Matching Algorithm Settings */}
            <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-6">
                <h3 className="text-lg font-medium text-white mb-4">Matching Algorithm Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-purple-500/10 rounded-lg">
                        <Target className="w-6 h-6 text-purple-400 mb-2" />
                        <h4 className="font-medium text-white mb-1">Precision Level</h4>
                        <select
                            className="w-full px-3 py-1 bg-gray-800/50 rounded-lg border border-gray-700/50 text-white text-sm mt-2"
                        >
                            <option value="high">High Match Priority</option>
                            <option value="balanced">Balanced</option>
                            <option value="exploratory">More Variety</option>
                        </select>
                    </div>

                    <div className="p-4 bg-indigo-500/10 rounded-lg">
                        <Globe className="w-6 h-6 text-indigo-400 mb-2" />
                        <h4 className="font-medium text-white mb-1">Location Priority</h4>
                        <select
                            className="w-full px-3 py-1 bg-gray-800/50 rounded-lg border border-gray-700/50 text-white text-sm mt-2"
                        >
                            <option value="local">Local First</option>
                            <option value="regional">Regional</option>
                            <option value="global">Global</option>
                        </select>
                    </div>

                    <div className="p-4 bg-rose-500/10 rounded-lg">
                        <Clock className="w-6 h-6 text-rose-400 mb-2" />
                        <h4 className="font-medium text-white mb-1">Update Frequency</h4>
                        <select
                            className="w-full px-3 py-1 bg-gray-800/50 rounded-lg border border-gray-700/50 text-white text-sm mt-2"
                        >
                            <option value="realtime">Real-time</option>
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                        </select>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default MatchingPreferences;