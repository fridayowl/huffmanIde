import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import {
    Heart, MessageCircle, Share2, ThumbsUp,
    Users, Activity, Code, Calendar,
    Coffee, Timer, GitBranch, Star, Bell
} from 'lucide-react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

const activityData = [
    { day: 'Mon', commits: 12, hours: 6 },
    { day: 'Tue', commits: 8, hours: 5 },
    { day: 'Wed', commits: 15, hours: 8 },
    { day: 'Thu', commits: 10, hours: 7 },
    { day: 'Fri', commits: 18, hours: 9 },
    { day: 'Sat', commits: 5, hours: 3 },
    { day: 'Sun', commits: 3, hours: 2 },
];

const projectStages = {
    'ideation': 'bg-purple-500',
    'development': 'bg-blue-500',
    'testing': 'bg-yellow-500',
    'launched': 'bg-green-500'
};

const EnhancedCommunity = () => {
    const [activeTab, setActiveTab] = useState('feed');

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <div className="container mx-auto px-4 py-6">
                {/* Social Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    {[
                        { icon: Users, label: 'Connections', value: '425' },
                        { icon: Heart, label: 'Project Likes', value: '2.1k' },
                        { icon: Coffee, label: 'Dev Meetups', value: '5 nearby' },
                        { icon: Activity, label: 'Network Activity', value: 'Very Active' }
                    ].map((stat, idx) => (
                        <div key={idx} className="bg-gray-800/50 rounded-lg border border-gray-700 p-4">
                            <div className="flex items-center">
                                <stat.icon className="w-8 h-8 text-indigo-400 mr-3" />
                                <div>
                                    <p className="text-gray-400 text-sm">{stat.label}</p>
                                    <p className="text-2xl font-bold">{stat.value}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Feed & Activity Column */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Social Feed */}
                        <div className="bg-gray-800/50 rounded-lg border border-gray-700">
                            <div className="p-4 border-b border-gray-700">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-xl font-bold">Developer Feed</h2>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setActiveTab('feed')}
                                            className={`px-3 py-1 rounded-md text-sm border border-gray-600 
                                            ${activeTab === 'feed' ? 'bg-gray-700' : 'hover:bg-gray-700/50'}`}
                                        >
                                            Feed
                                        </button>
                                        <button
                                            onClick={() => setActiveTab('trending')}
                                            className={`px-3 py-1 rounded-md text-sm border border-gray-600 
                                            ${activeTab === 'trending' ? 'bg-gray-700' : 'hover:bg-gray-700/50'}`}
                                        >
                                            Trending
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 space-y-4">
                                {[1, 2, 3].map((post) => (
                                    <div key={post} className="bg-gray-700/30 p-4 rounded-lg">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-start space-x-4">
                                                <div className="w-12 h-12 rounded-full bg-gray-600 overflow-hidden">
                                                    <img src="/api/placeholder/48/48" alt="avatar" className="w-full h-full object-cover" />
                                                </div>
                                                <div>
                                                    <div className="flex items-center space-x-2">
                                                        <h3 className="font-semibold">David Node</h3>
                                                        <span className="text-gray-400 text-sm">shared a project</span>
                                                    </div>
                                                    <p className="text-sm text-gray-400 mt-1">Just launched my new AI-Powered Code Review tool! 🚀</p>
                                                    <div className="flex items-center gap-2 mt-2">
                                                        <span className={`px-2 py-0.5 rounded-full text-xs ${projectStages.development}`}>
                                                            Development
                                                        </span>
                                                        <span className="text-xs text-gray-400">2h ago</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-4 flex items-center justify-between">
                                            <div className="flex items-center space-x-6">
                                                <button className="flex items-center space-x-1 text-gray-400 hover:text-indigo-400">
                                                    <Heart className="w-4 h-4" />
                                                    <span>124</span>
                                                </button>
                                                <button className="flex items-center space-x-1 text-gray-400 hover:text-indigo-400">
                                                    <MessageCircle className="w-4 h-4" />
                                                    <span>28</span>
                                                </button>
                                                <button className="flex items-center space-x-1 text-gray-400 hover:text-indigo-400">
                                                    <Share2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <div className="flex -space-x-2">
                                                {[1, 2, 3].map((contributor) => (
                                                    <div key={contributor} className="w-6 h-6 rounded-full border-2 border-gray-800 overflow-hidden">
                                                        <img src={`/api/placeholder/24/24`} alt={`Contributor ${contributor}`} className="w-full h-full object-cover" />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Activity Graph */}
                        <div className="bg-gray-800/50 rounded-lg border border-gray-700">
                            <div className="p-4 border-b border-gray-700">
                                <h2 className="text-xl font-bold">Your Network Activity</h2>
                            </div>
                            <div className="p-4">
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={activityData}>
                                            <XAxis dataKey="day" stroke="#6b7280" />
                                            <YAxis stroke="#6b7280" />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: '#1f2937',
                                                    border: 'none',
                                                    borderRadius: '8px'
                                                }}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="commits"
                                                stroke="#818cf8"
                                                strokeWidth={2}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="hours"
                                                stroke="#34d399"
                                                strokeWidth={2}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Sidebar */}
                    <div className="space-y-6">
                        {/* Nearby Developers */}
                        <div className="bg-gray-800/50 rounded-lg border border-gray-700">
                            <div className="p-4 border-b border-gray-700">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-xl font-bold">Developers Near You</h2>
                                    <button className="px-3 py-1 rounded-md text-sm border border-gray-600 hover:bg-gray-700">
                                        View All
                                    </button>
                                </div>
                            </div>
                            <div className="p-4">
                                <div className="h-64 rounded-lg overflow-hidden">
                                    <MapContainer
                                        center={[40.7128, -74.0060]}
                                        zoom={11}
                                        className="w-full h-full"
                                        zoomControl={false}
                                    >
                                        <TileLayer
                                            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                                        />
                                    </MapContainer>
                                </div>
                            </div>
                        </div>

                        {/* Online Connections */}
                        <div className="bg-gray-800/50 rounded-lg border border-gray-700">
                            <div className="p-4 border-b border-gray-700">
                                <h2 className="text-xl font-bold">Online Connections</h2>
                            </div>
                            <div className="p-4 space-y-4">
                                {[1, 2, 3, 4].map((friend) => (
                                    <div key={friend} className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className="relative">
                                                <div className="w-10 h-10 rounded-full bg-gray-600 overflow-hidden">
                                                    <img src="/api/placeholder/40/40" alt="avatar" className="w-full h-full object-cover" />
                                                </div>
                                                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800" />
                                            </div>
                                            <div>
                                                <p className="font-medium">Sarah Developer</p>
                                                <p className="text-sm text-gray-400">Coding in React</p>
                                            </div>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button className="p-2 rounded-md hover:bg-gray-700">
                                                <MessageCircle className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 rounded-md hover:bg-gray-700">
                                                <Bell className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EnhancedCommunity;