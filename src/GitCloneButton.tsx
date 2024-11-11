import React, { useState } from 'react';
import { GitBranch } from 'lucide-react';
import ComingSoon from './ComingSoon';

const GitCloneButton: React.FC = () => {
    const [showComingSoon, setShowComingSoon] = useState(false);

    const handleClone = () => {
        setShowComingSoon(true);
    };

    return (
        <>
            <button
                onClick={handleClone}
                className="group relative w-full bg-[#2b3240] backdrop-blur-xl rounded-lg overflow-hidden
        hover:-translate-y-0.5 transition-all duration-300 
        hover:shadow-lg hover:shadow-indigo-500/20"
            >
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#2b3240] to-[#363d4e] 
        opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Button content */}
                <div className="relative py-2.5 px-4 flex items-center justify-center gap-2">
                    <GitBranch
                        size={16}
                        className="text-gray-400 group-hover:text-indigo-400 transition-colors duration-300"
                    />
                    <span className="text-gray-300 group-hover:text-white transition-colors duration-300">
                        Clone Repository
                    </span>
                </div>

                {/* Glow effect */}
                <div className="absolute inset-0 rounded-lg bg-indigo-500/10 blur-sm opacity-0 
        group-hover:opacity-100 transition-opacity duration-300 -z-10" />
            </button>
            {showComingSoon && (
                <ComingSoon
                    feature="Git Clone"
                    onClose={() => setShowComingSoon(false)}
                />
            )}


            
        </>
    );
};

export default GitCloneButton;
