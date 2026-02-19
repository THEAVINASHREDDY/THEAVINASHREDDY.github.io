import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Calendar, ChevronRight } from 'lucide-react';

const Experience = () => {
    const experiences = [
        {
            company: "ClickZ Media",
            role: "Specialist Data Scientist",
            period: "Jul 2025 – Present",
            location: "Mumbai / London",
            description: "Leading AI initiatives in B2B media, focusing on hyper-personalization and agentic workflows.",
            tech: ["Python", "NLP", "User Embeddings", "GenAI"],
            highlights: [
                "Developed a subscriber interest modeling system by engineering behavioral features from 2M+ email engagement events.",
                "Applied NLP-based topic extraction on click URLs and built user embedding vectors to predict content preferences across 200K+ B2B subscribers.",
                "Contributed to the architecture of Audience Align, a GenAI SaaS product for ICP-driven content creation.",
                "Defined and built agentic content workflows for 50+ publications, reducing costs by 80% and manual effort by 75%."
            ]
        },
        {
            company: "Blenheim Chalcot",
            role: "Associate Data Scientist",
            period: "Jun 2023 – Jul 2025",
            location: "Mumbai",
            description: "Built GenAI internal tools and automated content generation pipelines.",
            tech: ["Azure Whisper", "OpenAI", "LangChain", "React"],
            highlights: [
                "Contributed to BC-CodeInterpreter, enabling financial data analysis through natural language queries.",
                "Designed and implemented an AI-powered Podcast Debater that converts weekly news into interactive speaker–host podcasts (90% cost reduction).",
                "Enhanced the L&D platform with multilingual text-to-speech (Azure Whisper), expanding accessibility."
            ]
        }
    ];

    return (
        <section id="experience" className="py-20 relative bg-slate-900">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-16"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 flex items-center gap-3">
                        <Briefcase className="text-cyan-400" />
                        Professional Odyssey
                    </h2>
                    <div className="h-1 w-20 bg-cyan-500 rounded-full"></div>
                </motion.div>

                <div className="space-y-12">
                    {experiences.map((exp, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="relative pl-8 border-l border-slate-700 bg-slate-800/10 rounded-r-xl p-6 hover:bg-slate-800/20 transition-colors"
                        >
                            {/* Dot on timeline */}
                            <div className="absolute top-8 -left-[5px] w-2.5 h-2.5 bg-cyan-500 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.5)]"></div>

                            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                                <div>
                                    <h3 className="text-2xl font-bold text-white">{exp.role}</h3>
                                    <div className="text-lg text-cyan-400 font-mono">{exp.company}</div>
                                </div>
                                <div className="flex items-center gap-2 text-slate-400 font-mono text-sm mt-2 md:mt-0">
                                    <Calendar className="w-4 h-4" />
                                    {exp.period} | {exp.location}
                                </div>
                            </div>

                            <p className="text-slate-300 mb-6 italic border-l-4 border-cyan-500/50 pl-4">
                                {exp.description}
                            </p>

                            <ul className="space-y-3 mb-6">
                                {exp.highlights.map((highlight, i) => (
                                    <li key={i} className="flex items-start gap-2 text-slate-400">
                                        <ChevronRight className="w-5 h-5 text-cyan-500 shrink-0 mt-0.5" />
                                        <span>{highlight}</span>
                                    </li>
                                ))}
                            </ul>

                            <div className="flex flex-wrap gap-2">
                                {exp.tech.map((t, i) => (
                                    <span key={i} className="px-3 py-1 bg-slate-800 text-cyan-200 text-xs font-mono rounded-full border border-slate-700">
                                        {t}
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Experience;
