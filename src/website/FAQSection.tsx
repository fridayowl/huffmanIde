import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQSection = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const faqs = [
        {
            question: "How does visual programming work?",
            answer: "Our visual programming interface allows you to create code through an intuitive block-based system, making it easier to understand and manage complex codebases."
        },
        {
            question: "Can I use Huffman with existing projects?",
            answer: "Yes! Huffman seamlessly integrates with your existing Python projects, allowing you to visualize and enhance your current codebase."
        },
        {
            question: "Is there a free version available?",
            answer: "We offer a free Community Edition with essential features for individual developers. Upgrade to Pro or Enterprise for additional capabilities."
        },
        {
            question: "What programming languages are supported?",
            answer: "Currently, we support Python with plans to add support for JavaScript, TypeScript, and Go in future releases."
        },
        {
            question: "How does the AI integration work?",
            answer: "Our AI system analyzes your code patterns, suggests optimizations, and helps identify potential bugs. It also provides intelligent code completion and can generate documentation based on your codebase."
        },
        {
            question: "Can I collaborate with my team in real-time?",
            answer: "Enterprise users can collaborate in real-time with features like simultaneous editing, visual diff tools, and team-based version control integration. Changes are synchronized instantly across all team members."
        },
        {
            question: "What kind of performance impact does visual programming have?",
            answer: "Huffman generates optimized native code that runs at near-identical speeds to hand-written code. Our block-based system is just a visualization layer that doesn't affect runtime performance."
        },
        {
            question: "How does version control integration work?",
            answer: "Huffman seamlessly integrates with Git and other VCS systems. You can visualize branches, merges, and conflicts directly in the block interface, making version control more intuitive."
        },
        {
            question: "Can I export my visual blocks as traditional code?",
            answer: "Yes! You can export your visual blocks as clean, well-documented code in your chosen programming language. This makes it easy to share your work with developers who don't use Huffman."
        },
        {
            question: "What kind of learning curve should I expect?",
            answer: "Most developers become productive within a few hours thanks to our intuitive interface and interactive tutorials. We also provide comprehensive documentation and video guides to help you get started."
        },
        {
            question: "How does debugging work in a visual environment?",
            answer: "Our visual debugger allows you to see program flow in real-time, inspect variables with visual representations, and set breakpoints directly on blocks. You can even replay execution steps to better understand program behavior."
        },
        {
            question: "What about custom blocks and extensions?",
            answer: "Pro and Enterprise users can create custom blocks, import external libraries, and share block collections with their team. Our marketplace also offers pre-built blocks for common programming patterns."
        }
    ];

    return (
        <section id="faq" className="scroll-mt-24">
            <div className="text-center max-w-3xl mx-auto mb-16">
                <span className="text-indigo-400 font-medium">FAQ</span>
                <h2 className="text-3xl font-bold text-white mt-2 mb-4">
                    Frequently Asked Questions
                </h2>
            </div>
            <div className="max-w-3xl mx-auto space-y-2">
                {faqs.map((faq, index) => (
                    <div
                        key={index}
                        className="border border-gray-700/50 rounded-lg overflow-hidden bg-gray-800/30 backdrop-blur-sm"
                    >
                        <button
                            onClick={() => setOpenIndex(openIndex === index ? null : index)}
                            className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-700/20 transition-colors duration-200"
                        >
                            <h3 className="text-white font-medium">{faq.question}</h3>
                            <ChevronDown
                                className={`w-5 h-5 text-indigo-400 transition-transform duration-200 
                                ${openIndex === index ? 'rotate-180' : ''}`}
                            />
                        </button>
                        <div
                            className={`px-6 transition-all duration-200 ease-in-out overflow-hidden
                            ${openIndex === index ? 'py-4 max-h-48' : 'max-h-0'}`}
                        >
                            <p className="text-gray-400">{faq.answer}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default FAQSection;