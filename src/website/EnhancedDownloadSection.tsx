import React, { useState } from 'react';
import { Download, Heart, Share2, Send, X, Twitter, Facebook, Linkedin } from 'lucide-react';
import { FaApple, FaWindows, FaLinux } from 'react-icons/fa';
import { IconType } from 'react-icons';
import { Alert } from './Alert';


interface DownloadOption {
    icon: IconType;
    name: string;
    version: string;
    size: string;
    requirements: string;
    url: string;
    color: string;
}

interface Downloads {
    [key: string]: DownloadOption;
}

const EnhancedDownloadSection = () => {
    const [activeTab, setActiveTab] = useState('mac');
    const [isHovering, setIsHovering] = useState(false);
    const [showGratitudeModal, setShowGratitudeModal] = useState(false);
    const [email, setEmail] = useState('');
    const [showShareForm, setShowShareForm] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const downloads: Downloads = {
        mac: {
            icon: FaApple,
            name: 'macOS',
            version: '1.0.0',
            size: '45 MB',
            requirements: 'macOS 10.15 or later',
            url: '#',
            color: 'from-blue-500 to-blue-600'
        },
        windows: {
            icon: FaWindows,
            name: 'Windows',
            version: '1.0.0',
            size: '42 MB',
            requirements: 'Windows 10 or later',
            url: '#',
            color: 'from-indigo-500 to-indigo-600'
        },
        linux: {
            icon: FaLinux,
            name: 'Linux',
            version: '1.0.0',
            size: '40 MB',
            requirements: 'Ubuntu 20.04 or equivalent',
            url: '#',
            color: 'from-purple-500 to-purple-600'
        }
    };

    const gratitudeMessages = [
        `Welcome to the ${downloads[activeTab].name} innovators club! 🚀`,
        `You've just made ${downloads[activeTab].name} development more awesome! ✨`,
        "You're not just downloading - you're joining a revolution in coding! 💫",
        "Every download is a new story. We're thrilled to be part of yours! 🌟"
    ];

    const randomMessage = gratitudeMessages[Math.floor(Math.random() * gratitudeMessages.length)];
    const ActiveIcon = downloads[activeTab].icon;

    const handleShare = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
        setTimeout(() => {
            setShowShareForm(false);
            setEmail('');
        }, 2000);
    };

    return (
        <>
            <div className="max-w-lg mx-auto transform transition-all duration-300">
                <div className="flex justify-center mb-6 bg-gray-800/30 rounded-full p-1">
                    {Object.entries(downloads).map(([key, value]) => (
                        <button
                            key={key}
                            onClick={() => setActiveTab(key)}
                            className={`relative px-8 py-3 text-sm font-medium transition-all duration-300 rounded-full
                                ${activeTab === key
                                    ? 'text-white transform scale-105'
                                    : 'text-gray-400 hover:text-white hover:bg-gray-700/30'}`}
                        >
                            {activeTab === key && (
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full 
                                    transform transition-all duration-300 animate-pulse opacity-90" />
                            )}
                            <div className="relative flex items-center justify-center gap-2">
                                <value.icon className={`w-5 h-5 transition-transform duration-300 
                                    ${activeTab === key ? 'scale-110' : ''}`} />
                                <span className="hidden sm:block">{value.name}</span>
                            </div>
                        </button>
                    ))}
                </div>

                <div className="relative">
                    <div className={`absolute inset-0 bg-gradient-to-br ${downloads[activeTab].color} 
                        opacity-10 blur-xl transition-all duration-500 ${isHovering ? 'scale-105' : 'scale-100'}`} />

                    <div className="relative bg-gray-800/50 backdrop-blur-xl rounded-lg p-6 text-left
                        border border-gray-700/50 transition-all duration-300 hover:border-indigo-500/50"
                        onMouseEnter={() => setIsHovering(true)}
                        onMouseLeave={() => setIsHovering(false)}
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h3 className="text-white font-medium mb-1">
                                    Download for {downloads[activeTab].name}
                                </h3>
                                <p className="text-gray-400 text-sm">
                                    Version {downloads[activeTab].version} •
                                    {downloads[activeTab].size}
                                </p>
                            </div>
                            <ActiveIcon
                                className={`w-8 h-8 text-indigo-400 transition-all duration-300 
                                    ${isHovering ? 'transform scale-110' : ''}`}
                            />
                        </div>

                        <div className="space-y-4">
                            <div className="bg-gray-900/50 rounded-lg p-3">
                                <p className="text-gray-400 text-xs">
                                    System Requirements:
                                    <span className="block mt-1 text-gray-500">
                                        {downloads[activeTab].requirements}
                                    </span>
                                </p>
                            </div>

                            <button
                                onClick={() => setShowGratitudeModal(true)}
                                className={`w-full px-4 py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 
                                    text-white rounded-lg font-medium transition-all duration-300
                                    transform hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/20
                                    flex items-center justify-center gap-2 group`}
                            >
                                <Download
                                    size={20}
                                    className="transition-transform duration-300 group-hover:translate-y-0.5"
                                />
                                <span className="group-hover:tracking-wide transition-all duration-300">
                                    Download Now
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Gratitude Modal */}
            {showGratitudeModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={(e) => e.target === e.currentTarget && setShowGratitudeModal(false)}>
                    <div className="bg-gray-900 rounded-xl max-w-md w-full border border-indigo-500/20 relative overflow-hidden animate-in zoom-in-95 duration-200">
                        {/* Animated hearts background */}
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                            {[...Array(20)].map((_, i) => (
                                <Heart
                                    key={i}
                                    size={16}
                                    className="absolute text-pink-500/20 animate-float"
                                    style={{
                                        left: `${Math.random() * 100}%`,
                                        top: `${Math.random() * 100}%`,
                                        animationDelay: `${Math.random() * 5}s`,
                                        animationDuration: `${5 + Math.random() * 5}s`
                                    }}
                                />
                            ))}
                        </div>

                        {/* Close button */}
                        <button
                            onClick={() => setShowGratitudeModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                        >
                            <X size={20} />
                        </button>

                        {/* Content */}
                        <div className="p-6 relative">
                            <div className="text-center mb-8">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-indigo-500/20 flex items-center justify-center">
                                    <Heart className="w-8 h-8 text-pink-500 animate-pulse" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Thank You!</h3>
                                <p className="text-gray-300">{randomMessage}</p>
                            </div>

                            {/* Share section */}
                            {!showShareForm ? (
                                <div className="space-y-4">
                                    <p className="text-sm text-gray-400 text-center">
                                        Love Huffman? Share it with others who might find it useful!
                                    </p>
                                    <div className="flex justify-center gap-4">
                                        <button className="p-2 bg-blue-600/20 rounded-full hover:bg-blue-600/30 transition-colors">
                                            <Twitter className="w-5 h-5 text-blue-400" />
                                        </button>
                                        <button className="p-2 bg-blue-800/20 rounded-full hover:bg-blue-800/30 transition-colors">
                                            <Facebook className="w-5 h-5 text-blue-500" />
                                        </button>
                                        <button className="p-2 bg-blue-700/20 rounded-full hover:bg-blue-700/30 transition-colors">
                                            <Linkedin className="w-5 h-5 text-blue-400" />
                                        </button>
                                    </div>
                                    <div className="text-center">
                                        <button
                                            onClick={() => setShowShareForm(true)}
                                            className="text-indigo-400 hover:text-indigo-300 text-sm flex items-center gap-2 mx-auto"
                                        >
                                            <Send size={16} />
                                            Share via Email
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <form onSubmit={handleShare} className="space-y-4">
                                    {submitted ? (
                                        <Alert variant="success" className="border-green-500/30 bg-green-500/10">
                                            <p className="text-green-400">
                                                Thanks for sharing! Your friend will receive an invitation soon.
                                            </p>
                                        </Alert>
                                    ) : (
                                        <>
                                            <div>
                                                <label className="text-sm text-gray-400 block mb-2">
                                                    Friend's Email Address
                                                </label>
                                                <input
                                                    type="email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg 
                                                        text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 
                                                        transition-all"
                                                    placeholder="email@example.com"
                                                    required
                                                />
                                            </div>
                                            <button
                                                type="submit"
                                                className="w-full px-4 py-2 bg-gradient-to-r from-indigo-500 to-indigo-600 
                                                    text-white rounded-lg font-medium hover:from-indigo-600 hover:to-indigo-700 
                                                    transition-all duration-300 flex items-center justify-center gap-2"
                                            >
                                                <Share2 size={16} />
                                                Share Huffman
                                            </button>
                                        </>
                                    )}
                                </form>
                            )}
                        </div>

                        {/* Download progress */}
                        <div className="bg-gray-800/50 p-4 border-t border-gray-700/50">
                            <div className="flex items-center gap-3">
                                <div className="flex-1 h-1 bg-gray-700 rounded-full overflow-hidden">
                                    <div className="h-full bg-indigo-500 rounded-full w-full animate-progress" />
                                </div>
                                <span className="text-sm text-gray-400">Starting download...</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default EnhancedDownloadSection;