import React, { useState } from 'react';
import { Heart, Share2, Send, X, Twitter, Facebook, Linkedin } from 'lucide-react';
import { Alert } from './Alert';

interface GratitudeModalProps {
    isOpen: boolean;
    onClose: () => void;
    randomMessage: string;
    email: string;
    setEmail: (email: string) => void;
    showShareForm: boolean;
    setShowShareForm: (show: boolean) => void;
    submitted: boolean;
    handleShare: (e: React.FormEvent) => void;
}

const GratitudeModal: React.FC<GratitudeModalProps> = ({
    isOpen,
    onClose,
    randomMessage,
    email,
    setEmail,
    showShareForm,
    setShowShareForm,
    submitted,
    handleShare,
}) => {
    if (!isOpen) return null;

    const handleModalClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent clicks inside modal from closing it
    };

    const handleCloseClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onClose();
    };

    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose} // Close when clicking the backdrop
        >
            <div
                className="bg-gray-900 rounded-xl max-w-md w-full border border-indigo-500/20 relative overflow-hidden animate-in zoom-in-95 duration-200"
                onClick={handleModalClick} // Prevent closing when clicking the modal content
            >
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
                    onClick={handleCloseClick}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
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
    );
};

export default GratitudeModal;
