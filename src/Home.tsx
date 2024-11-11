import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Hexagon, Folder, Clock, Users, LineChart, Code,
    Settings, Share2, MessageCircle, Blocks, FileCode,
    GitBranch, TestTube, Brain, Workflow, Timer, Zap,
    Target, Activity, Cpu, Coffee, ChevronLeft, ChevronRight,
    Bell, PlusCircle, PanelRightClose, Puzzle, Calendar
} from 'lucide-react';
import { FaPython, FaReact } from 'react-icons/fa';
import ComingSoon from './ComingSoon';
import CodeFlowAnimation from './CodeFlowAnimation';
import InteractiveGridBackground from './InteractiveGridBackground';
interface NavItem {
    label: string;
    action: () => void;
    primary?: boolean;
}

export default function Home() {
    const navigate = useNavigate();
    const [activeSlide, setActiveSlide] = useState(0);
    const [showComingSoon, setShowComingSoon] = useState(false);
    const projectsSliderRef = useRef<HTMLDivElement>(null);
    const [showCodeFlowAnimation, setShowCodeFlowAnimation] = useState(false);

    const scrollLeft = () => {
        if (projectsSliderRef.current) {
            projectsSliderRef.current.scrollBy({ left: -400, behavior: 'smooth' });
            setActiveSlide(prev => Math.max(0, prev - 1));
        }
    };

    const scrollRight = () => {
        if (projectsSliderRef.current) {
            projectsSliderRef.current.scrollBy({ left: 400, behavior: 'smooth' });
            setActiveSlide(prev => Math.min(3, prev + 1));
        }
    };
    // Safe scroll to section function
    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const features = [
        { name: 'Code Flow', component: CodeFlowAnimation, icon: Workflow, available: true, description: 'Visual programming workflow', onClick: () => setShowCodeFlowAnimation(true) },
        { name: 'Block Execution', icon: Blocks, available: true, description: 'Modular code execution' },
        { name: 'Block Documentation', icon: FileCode, available: true, description: 'Automated documentation on Block Level' },
        { name: 'Block Analytics', icon: LineChart, available: true, description: 'Performance insights on Block Level' },
        { name: 'Block Testing', icon: TestTube, available: true, description: 'Integrated testing suite and recorder' },
        { name: 'AI Integration', icon: Brain, available: true, description: 'Local LLM support' },
        { name: 'Multi-File Flow', icon: GitBranch, available: false, description: 'Complex project support' },
        { name: 'Auto Generation', icon: Puzzle, available: false, description: 'AI-powered code gen' },
        { name: 'Priority System', icon: Calendar, available: false, description: 'Smart task management' },
        { name: 'Collaboration', icon: Users, available: false, description: 'Team features' }
    ];

    const recentProjects = [
        {
            name: "E-commerce Dashboard",
            description: "React-based analytics dashboard with real-time data visualization",
            lastUpdated: "2h ago",
            collaborators: 3,
            status: "In Progress",
            progress: 65,
            tech: ["React", "TypeScript", "Node.js"]
        },
        {
            name: "AI Chat Interface",
            description: "Python-powered chat application with advanced NLP capabilities",
            lastUpdated: "1d ago",
            collaborators: 2,
            status: "Completed",
            progress: 100,
            tech: ["Python", "TensorFlow", "FastAPI"]
        },
        {
            name: "Data Visualization",
            description: "Interactive data visualization platform with real-time updates",
            lastUpdated: "3d ago",
            collaborators: 4,
            status: "Review",
            progress: 90,
            tech: ["D3.js", "Vue.js", "GraphQL"]
        },
        {
            name: "Cloud Infrastructure",
            description: "Scalable cloud infrastructure management system",
            lastUpdated: "4d ago",
            collaborators: 5,
            status: "In Progress",
            progress: 45,
            tech: ["AWS", "Terraform", "Docker"]
        }
    ];

    const healthMetrics = [
        {
            title: "Coding Time",
            value: "6.5h",
            change: "+2.5h",
            icon: Timer,
            color: "text-blue-400",
            gradient: "from-blue-500/20 to-indigo-500/20",
            description: "Daily active coding time"
        },
        {
            title: "Productivity",
            value: "85%",
            change: "+5%",
            icon: Zap,
            color: "text-yellow-400",
            gradient: "from-yellow-500/20 to-orange-500/20",
            description: "Efficiency score"
        },
        {
            title: "Focus Time",
            value: "4.2h",
            change: "+0.8h",
            icon: Target,
            color: "text-emerald-400",
            gradient: "from-emerald-500/20 to-teal-500/20",
            description: "Deep work sessions"
        },
        {
            title: "Code Quality",
            value: "A+",
            change: "↑",
            icon: Activity,
            color: "text-purple-400",
            gradient: "from-purple-500/20 to-pink-500/20",
            description: "Overall code health"
        },
        {
            title: "System Load",
            value: "42%",
            change: "-8%",
            icon: Cpu,
            color: "text-red-400",
            gradient: "from-red-500/20 to-pink-500/20",
            description: "Resource usage"
        },
        {
            title: "Break Time",
            value: "1.5h",
            change: "On Track",
            icon: Coffee,
            color: "text-orange-400",
            gradient: "from-orange-500/20 to-red-500/20",
            description: "Rest intervals"
        },
        {
            title: "Pro Analysis",
            value: "$20",
            change: "Upgrade",
            icon: PlusCircle,
            color: "text-indigo-400",
            gradient: "from-indigo-500/20 to-purple-500/20",
            description: "Advanced insights",
            isUpgrade: true
        }
    ];

    const navItems: NavItem[] = [
        {
            label: 'Start Coding',
            action: () => navigate('/ide'),
            primary: true
        },
        {
            label: 'Features',
            action: () => scrollToSection('features')
        },
        {
            label: 'Projects',
            action: () => scrollToSection('projects')
        },
        {
            label: 'Development',
            action: () => scrollToSection('development')
        },
        {
            label: 'Analytics',
            action: () => scrollToSection('analytics')
        }
    ];
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative pb-24">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(255,255,255,0.05)_1px,_transparent_1px)] bg-[length:24px_24px] pointer-events-none" />
           <InteractiveGridBackground/>
            {/* Logo and Brand */}
            <div className="container mx-auto px-6 py-4">
                <div className="flex items-center gap-3">
                    <div className="group relative w-10 h-10">
                        <div className="absolute inset-0 bg-indigo-600/20 rounded-xl backdrop-blur-xl 
                            border border-indigo-500/20 group-hover:border-indigo-500/40 
                            transition-all duration-300" />
                        <div className="absolute inset-0 rounded-xl bg-indigo-500/20 blur-sm opacity-0 
                            group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="relative w-full h-full flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 124 124" fill="none">
                                <rect width="124" height="124" rx="24" fill="#222556" />
                                <path d="M19.375 36.7818V100.625C19.375 102.834 21.1659 104.625 23.375 104.625H87.2181C90.7818 104.625 92.5664 100.316 90.0466 97.7966L26.2034 33.9534C23.6836 31.4336 19.375 33.2182 19.375 36.7818Z" fill="#5f68bf" />
                                <circle cx="63.2109" cy="37.5391" r="15.1641" fill="#5f68bf" />
                                
                            </svg>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-white font-medium hover:text-indigo-300 transition-colors duration-300">
                            Huffman
                        </span>
                        <span className="text-gray-400 text-sm">Modern Development Platform</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="container mx-auto px-6 space-y-24">
                {/* Hero Section */}
                <section className="text-center space-y-8 max-w-4xl mx-auto pt-12">
                    <div className="inline-block mb-4 px-4 py-2 bg-indigo-500/10 rounded-full 
                        border border-indigo-500/20">
                        <span className="text-indigo-400 text-sm font-medium">Welcome to the future of development</span>
                    </div>
                    <h1 className="text-5xl font-bold text-white leading-tight bg-clip-text text-transparent 
                        bg-gradient-to-r from-white to-gray-300">
                        Visual Development Platform for Modern Developers
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                        Transform your coding experience with our innovative block-based approach.
                        Build faster, collaborate better, and ship with confidence.
                    </p>
                    <div className="flex items-center justify-center gap-4 pt-4">
                        <button
                            onClick={() => navigate('/ide')}
                            className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-indigo-600 
                                text-white rounded-lg font-medium hover:from-indigo-600 
                                hover:to-indigo-700 transition-all duration-300 
                                shadow-lg hover:shadow-xl hover:shadow-indigo-500/20
                                hover:-translate-y-0.5 transform
                                flex items-center gap-2"
                        >
                            <Code className="w-5 h-5" />
                            Start Coding Now
                        </button>
                        <button className="px-8 py-4 bg-gray-800/50 text-gray-300 rounded-lg 
                            font-medium hover:bg-gray-800 transition-all duration-300
                            hover:-translate-y-0.5 transform border border-gray-700/50">
                            Watch Demo
                        </button>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="scroll-mt-24">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="text-indigo-400 font-medium">Features</span>
                        <h2 className="text-3xl font-bold text-white mt-2 mb-4">
                            Powerful Tools for Modern Development
                        </h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                        {features.map((feature, index) => (
                            <div key={index}>
                                <div
                                    className="group relative bg-gray-800/50 backdrop-blur-xl rounded-lg hover:-translate-y-1 transition-all duration-300 p-4 cursor-pointer"
                                    onClick={feature.onClick}
                                >
                                    <div className="absolute inset-0 rounded-lg bg-indigo-500/10 opacity-0 group-hover:opacity-100 transition-all duration-300 blur-sm" />
                                    <div className="relative flex flex-col items-center text-center">
                                        <feature.icon className={`w-6 h-6 text-indigo-400 mb-2 ${feature.onClick ? 'group-hover:animate-pulse' : ''}`} />
                                        <h3 className="text-sm font-medium text-white mb-1">{feature.name}</h3>
                                        <p className="text-xs text-gray-400">{feature.description}</p>
                                        {!feature.available && (
                                            <span className="absolute top-0 right-0 text-xs px-2 py-1 bg-indigo-500/20 text-indigo-400 rounded-full">
                                                Soon
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                        <CodeFlowAnimation
                            isOpen={showCodeFlowAnimation}
                            onClose={() => setShowCodeFlowAnimation(false)}
                        />
                        </div>
                </section>





                {/* Projects Section */}
                {/* <section id="projects" className="scroll-mt-24 relative">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="text-indigo-400 font-medium">Projects</span>
                        <h2 className="text-3xl font-bold text-white mt-2 mb-4">
                            Recent Projects
                        </h2>
                    </div>

                    <div className="relative">
                        <button
                            onClick={scrollLeft}
                            className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-gray-800/80 
                                rounded-full text-white hover:bg-gray-700 transition-colors duration-300"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>

                        <div
                            ref={projectsSliderRef}
                            className="flex overflow-x-hidden gap-6 scroll-smooth pb-4"
                        >
                            {recentProjects.map((project, index) => (
                                <div key={index} className="min-w-[400px] flex-shrink-0">
                                    <div className="group relative bg-gray-800/50 backdrop-blur-xl rounded-lg 
                                        hover:-translate-y-1 transition-all duration-300 p-6 h-full">
                                        <div className="flex items-start gap-4">
                                            <div className="p-3 bg-gray-700/50 rounded-lg">
                                                <Folder className="w-6 h-6 text-indigo-400" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-lg font-medium text-white mb-2">
                                                    {project.name}
                                                </h3>
                                                <p className="text-sm text-gray-400 mb-4">
                                                    {project.description}
                                                </p>
                                                <div className="flex flex-wrap gap-2 mb-4">
                                                    {project.tech.map((tech, i) => (
                                                        <span key={i} className="text-xs px-2 py-1 
                                                            bg-gray-700/50 text-gray-300 rounded-full">
                                                            {tech}
                                                        </span>
                                                    ))}
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-4">
                                                        <div className="flex items-center gap-2">
                                                            <Clock className="w-4 h-4 text-gray-400" />
                                                            <span className="text-sm text-gray-400">
                                                                {project.lastUpdated}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Users className="w-4 h-4 text-gray-400" />
                                                            <span className="text-sm text-gray-400">
                                                                {project.collaborators}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <span className={`text-sm px-3 py-1 rounded-full 
                                                        ${project.status === 'Completed'
                                                            ? 'bg-emerald-500/20 text-emerald-400'
                                                            : project.status === 'Review'
                                                                ? 'bg-amber-500/20 text-amber-400'
                                                                : 'bg-indigo-500/20 text-indigo-400'}`}>
                                                        {project.status}
                                                    </span>
                                                </div>
                                                <div className="mt-4 relative h-1.5 bg-gray-700/50 rounded-full overflow-hidden">
                                                    <div
                                                        className={`absolute top-0 left-0 h-full rounded-full transition-all duration-300
                                                            ${project.status === 'Completed'
                                                                ? 'bg-emerald-500'
                                                                : project.status === 'Review'
                                                                    ? 'bg-amber-500'
                                                                    : 'bg-indigo-500'}`}
                                                        style={{ width: `${project.progress}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={scrollRight}
                            className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-gray-800/80 
                                rounded-full text-white hover:bg-gray-700 transition-colors duration-300"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </div>

                    
                    <div className="flex justify-center gap-2 mt-6">
                        {[0, 1, 2, 3].map((dot) => (
                            <button
                                key={dot}
                                className={`w-2 h-2 rounded-full transition-colors duration-300 
                                    ${activeSlide === dot ? 'bg-indigo-500' : 'bg-gray-600 hover:bg-gray-500'}`}
                                onClick={() => setActiveSlide(dot)}
                            />
                        ))}
                    </div>
                </section> */}

                {/* Development Section */}
                <section id="development" className="scroll-mt-24">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="text-indigo-400 font-medium">Development</span>
                        <h2 className="text-3xl font-bold text-white mt-2 mb-4">
                            Choose Your IDE
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Python IDE */}
                        <div className="group relative bg-gray-800/50 backdrop-blur-xl rounded-lg p-6 
                            hover:-translate-y-1 transition-all duration-300">
                            <div className="absolute inset-0 rounded-lg bg-blue-500/10 opacity-0 
                                group-hover:opacity-100 transition-all duration-300 blur-sm" />
                            <div className="relative">
                                <FaPython className="w-12 h-12 text-blue-400 mb-4" />
                                <h3 className="text-xl font-bold text-white mb-2">Python IDE</h3>
                                <p className="text-gray-400 mb-4">Full-featured Python development environment</p>
                                <p className="text-emerald-400 text-sm mb-4">Free Forever</p>
                                <button
                                    onClick={() => navigate('/ide')}
                                    className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 
                                        text-white rounded-lg font-medium hover:from-blue-600 
                                        hover:to-blue-700 transition-all duration-300"
                                >
                                    Start Coding
                                </button>
                            </div>
                        </div>

                        {/* Go IDE - Coming Soon */}
                        <div
                            onClick={() => setShowComingSoon(true)}
                            className="group relative bg-gray-800/50 backdrop-blur-xl rounded-lg p-6 
                                hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                        >
                            <div className="absolute inset-0 rounded-lg bg-cyan-500/10 opacity-0 
                                group-hover:opacity-100 transition-all duration-300 blur-sm" />
                            <div className="relative">
                                <div className="w-12 h-12 bg-cyan-500 rounded-full flex items-center 
                                    justify-center mb-4">
                                    <span className="text-white font-bold">Go</span>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Go IDE</h3>
                                <p className="text-gray-400 mb-4">Professional Go development suite</p>
                                <p className="text-gray-400 text-sm mb-4">$20/month</p>
                                <button className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg 
                                    font-medium">
                                    Coming Soon
                                </button>
                            </div>
                        </div>

                        {/* React IDE - Coming Soon */}
                        <div
                            onClick={() => setShowComingSoon(true)}
                            className="group relative bg-gray-800/50 backdrop-blur-xl rounded-lg p-6 
                                hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                        >
                            <div className="absolute inset-0 rounded-lg bg-indigo-500/10 opacity-0 
                                group-hover:opacity-100 transition-all duration-300 blur-sm" />
                            <div className="relative">
                                <FaReact className="w-12 h-12 text-blue-400 mb-4" />
                                <h3 className="text-xl font-bold text-white mb-2">React IDE</h3>
                                <p className="text-gray-400 mb-4">Modern React development environment</p>
                                <p className="text-gray-400 text-sm mb-4">$20/month</p>
                                <button className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg 
                                    font-medium">
                                    Coming Soon
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Analytics Section */}
                <section id="analytics" className="scroll-mt-24">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="text-indigo-400 font-medium">Analytics</span>
                        <h2 className="text-3xl font-bold text-white mt-2 mb-4">
                            Developer Health & Analytics (Coming Soon)
                        </h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
                        {healthMetrics.map((metric, index) => (
                            <div
                                key={index}
                                onClick={() => metric.isUpgrade && setShowComingSoon(true)}
                                className={`group relative backdrop-blur-xl rounded-lg 
                                    hover:-translate-y-1 transition-all duration-300 
                                    ${metric.isUpgrade ? 'cursor-pointer' : ''}`}
                            >
                                <div className={`absolute inset-0 rounded-lg bg-gradient-to-br ${metric.gradient} 
                                    opacity-80`} />
                                <div className="relative p-4">
                                    <div className="flex flex-col items-center text-center">
                                        <metric.icon className={`w-6 h-6 ${metric.color} mb-2`} />
                                        <h3 className="text-sm font-medium text-white mb-1">{metric.title}</h3>
                                        <div className="text-lg font-bold text-white mb-1">{metric.value}</div>
                                        <span className={`text-xs ${metric.isUpgrade ? 'text-indigo-300' :
                                            metric.change.includes('+') ? 'text-emerald-400' :
                                                metric.change.includes('-') ? 'text-red-400' : 'text-blue-400'
                                            }`}>
                                            {metric.change}
                                        </span>
                                        <p className="text-xs text-gray-300 mt-2">{metric.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            {/* Fixed Navigation */}
            <nav className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
                <div className="flex items-center gap-2 bg-gray-800/90 backdrop-blur-xl rounded-full p-2 
                    shadow-lg shadow-black/20 border border-gray-700/50">
                    {navItems.map((item, index) => (
                        <button
                            key={index}
                            onClick={item.action}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
                                ${item.primary
                                    ? 'bg-indigo-500 text-white hover:bg-indigo-600'
                                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                                }`}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            </nav>

            {showComingSoon && (
                <ComingSoon
                    feature="Coming Soon"
                    onClose={() => setShowComingSoon(false)}
                />
            )}
           
        </div>
    );
}