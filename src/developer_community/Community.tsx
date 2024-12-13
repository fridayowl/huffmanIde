import React, { useState, useEffect } from 'react';
import {
    Users, Code, Brain, Heart, Search, Filter,
    MessageCircle, Star, GitPullRequest, Eye,
    Clock, Globe, Target, Loader, AlertTriangle,
    CheckCircle2, CircleDot, Circle, X
} from 'lucide-react';
import NavBarMinimal from '../NavBar';

// Types
interface CharacterType {
    id: string;
    label: string;
    icon: React.ElementType;
}

interface CommunityMember {
    id: number;
    name: string;
    character: string;
    title: string;
    level: number;
    metrics: {
        [key: string]: string | number;
    };
    availability: string;
    timezone: string;
    skills: string[];
}

interface MatchCategory {
    type: string;
    matchScore: number;
    reason: string;
    skills?: string[];
}

interface AIMatches {
    recommendedMembers?: CommunityMember[];
    mentorshipMatches?: MatchCategory[];
    collaborationSuggestions?: MatchCategory[];
    [key: string]: CommunityMember[] | MatchCategory[] | undefined;
}

// Dummy data for initial testing
const dummyMembers: CommunityMember[] = [
    {
        id: 1,
        name: "Alex Chen",
        character: "reviewer",
        title: "Code Reviewer",
        level: 4,
        metrics: {
            reviewedCode: "1.2k",
            acceptedChanges: 892,
            reputation: 4.8
        },
        availability: "Active",
        timezone: "PST",
        skills: ["Python", "React", "TypeScript"]
    },
    {
        id: 2,
        name: "Sarah Miller",
        character: "mentor",
        title: "Code Mentor",
        level: 3,
        metrics: {
            studentsHelped: 45,
            sessionHours: 156,
            rating: 4.9
        },
        availability: "Available in 2h",
        timezone: "EST",
        skills: ["Java", "Spring", "Architecture"]
    },
    {
        id: 3,
        name: "Mike Johnson",
        character: "health",
        title: "Health Guardian",
        level: 5,
        metrics: {
            wellnessScore: 95,
            activeStreak: "45 days",
            impact: 756
        },
        availability: "Active",
        timezone: "GMT",
        skills: ["Work-Life Balance", "Stress Management", "Team Wellness"]
    }
];

const roadmapItems = [
    {
        status: "in-progress",
        title: "Early Prototype Stage",
        description: "Building core matching functionality and temporary profile system"
    },
    {
        status: "upcoming",
        title: "Real User Profiles",
        description: "Implementation of persistent user profiles and authentication"
    },
    {
        status: "planned",
        title: "Advanced Matching Algorithm",
        description: "Enhanced AI-powered matching based on real user data and interactions"
    },
    {
        status: "planned",
        title: "Community Features",
        description: "Direct messaging, collaboration tools, and project sharing"
    }
];

// Component for displaying individual member cards
const MemberCard: React.FC<{ member: CommunityMember }> = ({ member }) => (
    <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-6 hover:border-indigo-500/50 transition-all duration-300">
        <div className="flex items-start justify-between mb-4">
            <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                    <Users className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                    <h3 className="text-lg font-medium text-white">{member.name}</h3>
                    <p className="text-gray-400">{member.title}</p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <span className="px-2 py-1 rounded-full bg-green-500/20 text-green-400 text-sm">
                    {member.availability}
                </span>
                <span className="px-2 py-1 rounded-full bg-gray-700/50 text-gray-400 text-sm">
                    {member.timezone}
                </span>
            </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
            {Object.entries(member.metrics).map(([key, value]) => (
                <div key={key} className="bg-gray-700/30 rounded-lg p-3">
                    <p className="text-sm text-gray-400 mb-1">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                    </p>
                    <p className="text-lg font-semibold text-white">{value}</p>
                </div>
            ))}
        </div>

        <div className="flex flex-wrap gap-2">
            {member.skills.map((skill, index) => (
                <span
                    key={index}
                    className="px-2 py-1 rounded-full bg-indigo-500/20 text-indigo-400 text-sm"
                >
                    {skill}
                </span>
            ))}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-700/50 flex justify-between">
            <button className="px-4 py-2 rounded-lg bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30 transition-colors">
                Connect
            </button>
            <button className="px-4 py-2 rounded-lg bg-gray-700/30 text-gray-400 hover:bg-gray-700/50 transition-colors">
                View Profile
            </button>
        </div>
    </div>
);

// Main Community Component
const Community: React.FC = () => {
    const [selectedCharacter, setSelectedCharacter] = useState<string>('reviewer');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [matches, setMatches] = useState<AIMatches | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [showAlert, setShowAlert] = useState<boolean>(true);
    const [showRoadmap, setShowRoadmap] = useState<boolean>(false);

    const characterTypes: CharacterType[] = [
        { id: 'reviewer', label: 'Code Reviewers', icon: Code },
        { id: 'mentor', label: 'Code Mentors', icon: Brain },
        { id: 'health', label: 'Health Guardians', icon: Heart },
        { id: 'learner', label: 'Knowledge Seekers', icon: Star }
    ];

    const fetchMatches = async () => {
        setIsLoading(true);
        try {
            // Simulate API call with dummy data
            await new Promise(resolve => setTimeout(resolve, 1500));
            setMatches({
                recommendedMembers: dummyMembers.filter(m => m.character === selectedCharacter)
            });
        } catch (err) {
            console.error('Failed to fetch matches:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMatches();
    }, [selectedCharacter]);

    return (
        <div className="min-h-screen bg-[#0D1117]">
            {/* Sticky NavBar */}
            <div className="sticky top-0 z-50 bg-[#0D1117] border-b border-gray-800">
                <NavBarMinimal />
            </div>

            <main className="container mx-auto px-4 py-6 space-y-8">
                {/* Early Stage Alert Banner */}
                {showAlert && (
                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-1" />
                        <div className="flex-1 flex justify-between items-start">
                            <div>
                                <h3 className="text-amber-500 font-medium">Early Prototype Stage</h3>
                                <p className="text-gray-400">Currently using generated temporary accounts for testing. Matching algorithm is in development but using a temporary user database.</p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setShowRoadmap(true)}
                                    className="px-4 py-2 bg-amber-500/20 text-amber-400 rounded-lg hover:bg-amber-500/30 transition-colors"
                                >
                                    View Roadmap
                                </button>
                                <button
                                    onClick={() => setShowAlert(false)}
                                    className="p-2 hover:bg-gray-700/50 rounded-lg"
                                >
                                    <X className="w-5 h-5 text-gray-400" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Roadmap Modal */}
                {showRoadmap && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
                        <div className="bg-gray-800 rounded-xl p-6 max-w-2xl w-full mx-4">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-xl font-bold text-white">Development Roadmap</h2>
                                    <p className="text-gray-400">Our journey to building a robust developer community platform</p>
                                </div>
                                <button
                                    onClick={() => setShowRoadmap(false)}
                                    className="p-1 hover:bg-gray-700 rounded-lg"
                                >
                                    <X className="w-5 h-5 text-gray-400" />
                                </button>
                            </div>
                            <div className="space-y-4">
                                {roadmapItems.map((item, index) => (
                                    <div key={index} className="flex items-start gap-4 p-4 bg-gray-700/20 rounded-lg">
                                        <div className="mt-1">
                                            {item.status === "in-progress" ? (
                                                <div className="w-3 h-3 rounded-full bg-blue-400 ring-4 ring-blue-400/20" />
                                            ) : (
                                                <div className="w-3 h-3 rounded-full bg-gray-600" />
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="text-white font-medium">{item.title}</h4>
                                            <p className="text-gray-400 text-sm">{item.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Page Header */}
                <div className="sticky top-16 z-40 bg-[#0D1117] pt-4 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-800 rounded-lg">
                            <Users className="w-6 h-6 text-gray-400" />
                        </div>
                        <div>
                            <h1 className="text-xl font-medium text-white">Community Hub</h1>
                            <p className="text-sm text-gray-400">Connect with developers based on their characters</p>
                        </div>
                    </div>
                </div>

                {/* Search and Filter */}
                <div className="flex gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search community members..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-800/50 rounded-xl border border-gray-700/50 text-white placeholder-gray-400 focus:border-indigo-500/50"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button className="px-4 py-2 bg-gray-800/50 rounded-xl border border-gray-700/50 text-gray-400 hover:border-indigo-500/50 transition-all flex items-center gap-2">
                        <Filter className="w-5 h-5" />
                        Filters
                    </button>
                </div>

                {/* Character Type Selection */}
                <div className="grid grid-cols-4 gap-4">
                    {characterTypes.map((char) => (
                        <button
                            key={char.id}
                            onClick={() => setSelectedCharacter(char.id)}
                            className={`p-4 rounded-xl border transition-all ${selectedCharacter === char.id
                                ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-400'
                                : 'bg-gray-800/50 border-gray-700/50 text-gray-400'
                                }`}
                        >
                            <char.icon className="w-6 h-6 mb-2" />
                            <span className="block text-sm font-medium">{char.label}</span>
                        </button>
                    ))}
                </div>

                {/* Content Display */}
                {isLoading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="flex flex-col items-center gap-4">
                            <Loader className="w-8 h-8 text-indigo-400 animate-spin" />
                            <p className="text-gray-400">Finding your community matches...</p>
                        </div>
                    </div>
                ) : matches?.recommendedMembers ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {matches.recommendedMembers.map((member) => (
                            <MemberCard key={member.id} member={member} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-400">No matches found. Try adjusting your filters.</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Community;