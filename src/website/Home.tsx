import React, { useState } from 'react';
import {
    Hexagon, Download, Code,
    Settings, Brain, Workflow,
    TestTube, FileCode, LineChart,
    Blocks, GitBranch, Calendar,
    Users, Puzzle,
    Shield
} from 'lucide-react';
import { FaApple, FaWindows, FaLinux } from 'react-icons/fa';
import InteractiveGridBackground from './InteractiveGridBackground';
import EnhancedDownloadSection from './EnhancedDownloadSection';
import FAQSection from './FAQSection';


export default function Home() {
    const [showCodeFlowAnimation, setShowCodeFlowAnimation] = useState(false);
    const [activeTab, setActiveTab] = useState('mac');

    const features = [
        { name: 'Code Flow', icon: Workflow, available: true, description: 'Advanced visual programming flow', onClick: () => setShowCodeFlowAnimation(true) },
        { name: 'Block Execution', icon: Blocks, available: true, description: 'Intuitive block-based coding' },
        { name: 'Documentation', icon: FileCode, available: true, description: 'Auto-generated documentation' },
        { name: 'Analytics', icon: LineChart, available: true, description: 'Real-time performance insights' },
        { name: 'Testing', icon: TestTube, available: true, description: 'Integrated testing ecosystem' },
        { name: 'AI Integration', icon: Brain, available: true, description: 'Smart code suggestions & analysis' },
        { name: 'Multi-File Flow', icon: GitBranch, available: false, description: 'Complex project visualization' },
        { name: 'Auto Generation', icon: Puzzle, available: false, description: 'AI-powered code generation' },
        { name: 'Priority System', icon: Calendar, available: false, description: 'Intelligent task prioritization' },
        { name: 'Collaboration', icon: Users, available: false, description: 'Real-time team collaboration' }
    ];

    const downloads = {
        mac: {
            icon: FaApple,
            name: 'macOS',
            version: '1.0.0',
            size: '45 MB',
            requirements: 'macOS 10.15 or later',
            url: '#'
        },
        windows: {
            icon: FaWindows,
            name: 'Windows',
            version: '1.0.0',
            size: '42 MB',
            requirements: 'Windows 10 or later',
            url: '#'
        },
        linux: {
            icon: FaLinux,
            name: 'Linux',
            version: '1.0.0',
            size: '40 MB',
            requirements: 'Ubuntu 20.04 or equivalent',
            url: '#'
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative pb-24">
            <InteractiveGridBackground />

            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 bg-gray-900/80 backdrop-blur-md z-50">
                <div className="container mx-auto px-4 md:px-6 py-4">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <div className="flex items-center gap-3">
                            <div className="group relative w-10 h-10">
                                <div className="absolute inset-0 bg-indigo-600/20 rounded-xl backdrop-blur-xl 
                                    border border-indigo-500/20 group-hover:border-indigo-500/40 
                                    transition-all duration-300" />
                                <div className="relative w-full h-full flex items-center justify-center">
                                    <Hexagon className="w-6 h-6 text-indigo-400 group-hover:text-indigo-300 
                                        transition-colors duration-300" />
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-white font-medium">Huffman</span>
                                <span className="text-gray-400 text-sm hidden sm:block">Visual Development Platform</span>
                            </div>
                        </div>

                        {/* Navigation Links */}
                        <div className="hidden md:flex items-center gap-6">
                            <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
                            <a href="#download" className="text-gray-300 hover:text-white transition-colors">Download</a>
                            <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</a>
                            <a href="#docs" className="text-gray-300 hover:text-white transition-colors">Documentation</a>
                        </div>

                        {/* Mobile Menu Button */}
                        <button className="md:hidden p-2 text-gray-400 hover:text-white transition-colors">
                            <Settings size={20} />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="container mx-auto px-4 md:px-6 pt-24 space-y-24">
                {/* Hero Section */}
                <section className="text-center space-y-8 max-w-4xl mx-auto pt-12">
                    <div className="inline-block mb-4 px-4 py-2 bg-indigo-500/10 rounded-full 
                        border border-indigo-500/20">
                        <span className="text-indigo-400 text-sm font-medium">Revolutionize Your Development Workflow</span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight">
                        Visual Development Platform for Modern Developers
                    </h1>
                    <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                        Transform your coding experience with our innovative block-based approach.
                        Build faster, visualize better, ship with confidence.
                    </p>

                    {/* Download Tabs */}
                   <EnhancedDownloadSection/>
                </section>

                {/* Features Grid */}
                <section id="features" className="scroll-mt-24">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="text-indigo-400 font-medium">Features</span>
                        <h2 className="text-3xl font-bold text-white mt-2 mb-4">
                            Powerful Development Tools
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                        {features.map((feature, index) => (
                            <div key={index}>
                                <div
                                    className="group relative bg-gray-800/50 backdrop-blur-xl rounded-lg 
                                        hover:-translate-y-1 transition-all duration-300 p-4 cursor-pointer"
                                    onClick={feature.onClick}
                                >
                                    <div className="absolute inset-0 rounded-lg bg-indigo-500/10 opacity-0 
                                        group-hover:opacity-100 transition-all duration-300 blur-sm" />
                                    <div className="relative flex flex-col items-center text-center">
                                        <feature.icon className={`w-6 h-6 text-indigo-400 mb-2 
                                            ${feature.onClick ? 'group-hover:animate-pulse' : ''}`} />
                                        <h3 className="text-sm font-medium text-white mb-1">{feature.name}</h3>
                                        <p className="text-xs text-gray-400">{feature.description}</p>
                                        {!feature.available && (
                                            <span className="absolute top-0 right-0 text-xs px-2 py-1 
                                                bg-indigo-500/20 text-indigo-400 rounded-full">
                                                Coming Soon
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Pricing Section */}
                <section id="pricing" className="scroll-mt-24">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="text-indigo-400 font-medium">Pricing</span>
                        <h2 className="text-3xl font-bold text-white mt-2 mb-4">
                            Simple, Transparent Pricing
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {/* Python IDE - Free Tier */}
                        <div className="relative bg-gray-800/50 backdrop-blur-xl rounded-lg p-6 border border-gray-700/50">
                            <h3 className="text-xl font-bold text-white mb-4">Python IDE</h3>
                            <p className="text-4xl font-bold text-white mb-2">Free</p>
                            <p className="text-sm text-indigo-400 mb-6">Lifetime Access</p>
                            <ul className="space-y-3 mb-8">
                                <li className="flex items-center text-gray-300">
                                    <Code className="w-5 h-5 mr-2 text-indigo-400" />
                                    Visual Programming Interface
                                </li>
                                <li className="flex items-center text-gray-300">
                                    <FileCode className="w-5 h-5 mr-2 text-indigo-400" />
                                    Python Code Generation
                                </li>
                                <li className="flex items-center text-gray-300">
                                    <TestTube className="w-5 h-5 mr-2 text-indigo-400" />
                                    Basic Testing Tools
                                </li>
                            </ul>
                            <button className="w-full px-4 py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 
                text-white rounded-lg font-medium hover:from-indigo-600 hover:to-indigo-700 
                transition-all duration-300">
                                Download Now
                            </button>
                        </div>

                        {/* Go & React IDE - Coming Soon */}
                        <div className="relative bg-indigo-600/20 backdrop-blur-xl rounded-lg p-6 border border-indigo-500/50">
                            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                <span className="bg-indigo-500 text-white text-xs px-3 py-1 rounded-full">
                                    Coming Soon
                                </span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-4">Go & React IDE</h3>
                            <p className="text-4xl font-bold text-white mb-2">$20</p>
                            <p className="text-sm text-indigo-400 mb-6">per month</p>
                            <ul className="space-y-3 mb-8">
                                <li className="flex items-center text-gray-300">
                                    <Code className="w-5 h-5 mr-2 text-indigo-400" />
                                    Go Language Support
                                </li>
                                <li className="flex items-center text-gray-300">
                                    <Brain className="w-5 h-5 mr-2 text-indigo-400" />
                                    React Components Builder
                                </li>
                                <li className="flex items-center text-gray-300">
                                    <TestTube className="w-5 h-5 mr-2 text-indigo-400" />
                                    Advanced Testing Suite
                                </li>
                                <li className="flex items-center text-gray-300">
                                    <LineChart className="w-5 h-5 mr-2 text-indigo-400" />
                                    Performance Monitoring
                                </li>
                            </ul>
                            <button className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg font-medium
                hover:bg-gray-600 transition-all duration-300">
                                Join Waitlist
                            </button>
                        </div>

                        {/* Developer Health Analytics */}
                        <div className="relative bg-gray-800/50 backdrop-blur-xl rounded-lg p-6 border border-gray-700/50">
                            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                <span className="bg-indigo-500 text-white text-xs px-3 py-1 rounded-full">
                                    Coming Soon
                                </span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-4">Developer Health Analytics</h3>
                            <p className="text-4xl font-bold text-white mb-2">$20</p>
                            <p className="text-sm text-indigo-400 mb-6">per month</p>
                            <ul className="space-y-3 mb-8">
                                <li className="flex items-center text-gray-300">
                                    <Users className="w-5 h-5 mr-2 text-indigo-400" />
                                    Developer Productivity Tracking
                                </li>
                                <li className="flex items-center text-gray-300">
                                    <Settings className="w-5 h-5 mr-2 text-indigo-400" />
                                    Health Metrics Dashboard
                                </li>
                                <li className="flex items-center text-gray-300">
                                    <Brain className="w-5 h-5 mr-2 text-indigo-400" />
                                    AI-Powered Insights
                                </li>
                                <li className="flex items-center text-gray-300">
                                    <Shield className="w-5 h-5 mr-2 text-indigo-400" />
                                    Wellness Recommendations
                                </li>
                            </ul>
                            <button className="w-full px-4 py-3 border border-indigo-500 text-indigo-400 
                rounded-lg font-medium hover:bg-indigo-500 hover:text-white 
                transition-all duration-300">
                                Join Waitlist
                            </button>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
               <FAQSection/>

                {/* CTA Section */}
               
            </main>

            {/* Footer */}
            <footer className="mt-24 border-t border-gray-800/30">
                <div className="container mx-auto px-4 md:px-6 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <Hexagon className="w-6 h-6 text-indigo-400" />
                                <span className="text-white font-medium">Huffman</span>
                            </div>
                            <p className="text-gray-400 text-sm">
                                Transform your development workflow with our innovative visual programming platform.
                            </p>
                        </div>

                        <div>
                            <h4 className="text-white font-medium mb-4">Product</h4>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Documentation</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Updates</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-white font-medium mb-4">Company</h4>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Careers</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-white font-medium mb-4">Legal</h4>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Security</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-12 pt-8 border-t border-gray-800/30 text-center text-gray-400 text-sm">
                        © {new Date().getFullYear()} Huffman. All rights reserved.
                    </div>
                </div>
            </footer>

            
        </div>
    );
}



<section className="max-w-4xl mx-auto text-center">
    <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-2xl p-8 md:p-12
                        backdrop-blur-xl border border-indigo-500/20">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Development Workflow?
        </h2>
        <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of developers who've already enhanced their coding experience with Huffman's
            visual programming platform.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-indigo-600 
                                text-white rounded-lg font-medium hover:from-indigo-600 hover:to-indigo-700
                                transition-all duration-300 flex items-center justify-center gap-2">
                <Download className="w-5 h-5" />
                Download Now
            </button>
            <button className="px-8 py-4 border border-indigo-500/50 text-indigo-400 
                                rounded-lg font-medium hover:bg-indigo-500 hover:text-white
                                transition-all duration-300">
                View Documentation
            </button>
        </div>
    </div>
</section>