import React from 'react';
import { motion } from 'framer-motion';
import { Database, Brain, Code, Cloud, Terminal } from 'lucide-react';

const categories = [
    { id: 'ml', name: 'Machine Learning', color: 'text-purple-400', border: 'border-purple-500/30' },
    { id: 'genai', name: 'GenAI & LLMs', color: 'text-cyan-400', border: 'border-cyan-500/30' },
    { id: 'dev', name: 'Development', color: 'text-emerald-400', border: 'border-emerald-500/30' },
    { id: 'ops', name: 'Cloud & Ops', color: 'text-orange-400', border: 'border-orange-500/30' }
];

const elements = [
    { symbol: 'Py', name: 'Python', number: 1, category: 'ml', mass: '3.12' },
    { symbol: 'Tf', name: 'TensorFlow', number: 2, category: 'ml', mass: '2.4.1' },
    { symbol: 'Pt', name: 'PyTorch', number: 3, category: 'ml', mass: '1.9.0' },
    { symbol: 'Sk', name: 'Scikit', number: 4, category: 'ml', mass: '0.24' },

    { symbol: 'Oai', name: 'OpenAI', number: 5, category: 'genai', mass: 'GPT-4' },
    { symbol: 'Lc', name: 'LangChain', number: 6, category: 'genai', mass: 'v0.1' },
    { symbol: 'Hf', name: 'HuggingFace', number: 7, category: 'genai', mass: '∞' },
    { symbol: 'Cl', name: 'Claude', number: 8, category: 'genai', mass: '3.5' },

    { symbol: 'Js', name: 'JavaScript', number: 9, category: 'dev', mass: 'ES6+' },
    { symbol: 'Re', name: 'React', number: 10, category: 'dev', mass: '18.2' },
    { symbol: 'Sql', name: 'MySQL', number: 11, category: 'dev', mass: '8.0' },
    { symbol: 'Api', name: 'GraphQL', number: 12, category: 'dev', mass: 'Query' },

    { symbol: 'Aws', name: 'AWS', number: 13, category: 'ops', mass: 'Cloud' },
    { symbol: 'Dk', name: 'Docker', number: 14, category: 'ops', mass: 'Cont.' },
    { symbol: 'Az', name: 'Azure', number: 15, category: 'ops', mass: 'MSFT' },
    { symbol: 'Gi', name: 'Git', number: 16, category: 'ops', mass: 'SCM' },
];

const TechStack = () => {
    return (
        <section className="py-24 bg-slate-900 relative overflow-hidden" id="skills">
            {/* Background Elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>

            <div className="container mx-auto px-4 z-10 relative">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-5xl font-mono font-bold text-white mb-4">
                        <span className="text-cyan-500">Atomic</span> Skills
                    </h2>
                    <p className="text-slate-400 max-w-2xl mx-auto">
                        The fundamental elements that compose my engineering capabilities.
                    </p>
                </motion.div>

                {/* Periodic Table Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 max-w-6xl mx-auto">
                    {elements.map((el, index) => {
                        const cat = categories.find(c => c.id === el.category);
                        return (
                            <motion.div
                                key={el.symbol}
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                                whileHover={{ scale: 1.1, zIndex: 10 }}
                                className={`aspect-square p-2 bg-slate-800/50 border ${cat.border} backdrop-blur-sm cursor-crosshair group flex flex-col justify-between hover:bg-slate-800 transition-colors`}
                            >
                                <div className="flex justify-between items-start">
                                    <span className="text-xs text-slate-500 font-mono">{el.number}</span>
                                    <span className={`text-xs ${cat.color} font-bold opacity-0 group-hover:opacity-100 transition-opacity`}>{el.mass}</span>
                                </div>
                                <div className={`text-2xl md:text-3xl font-bold ${cat.color} text-center font-mono my-2`}>
                                    {el.symbol}
                                </div>
                                <div className="text-xs text-slate-400 text-center font-medium truncate">
                                    {el.name}
                                </div>
                            </motion.div>
                        )
                    })}
                </div>

                {/* Legend */}
                <div className="flex flex-wrap justify-center gap-6 mt-12">
                    {categories.map(cat => (
                        <div key={cat.id} className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${cat.color.replace('text-', 'bg-')}`}></div>
                            <span className="text-slate-400 text-sm font-mono">{cat.name}</span>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default TechStack;
