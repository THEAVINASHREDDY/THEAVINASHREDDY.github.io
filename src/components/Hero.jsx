import React from 'react';
import { Link } from 'react-router-dom';
import RetroGridBackground from './RetroGridBackground';
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';

const Hero = () => {
    return (
        <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
            <RetroGridBackground />

            <div className="z-10 text-center px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 / 2 }} // Turbo mode: faster animations
                >
                    <h2 className="text-cyan-400 font-mono text-lg mb-4 tracking-widest">
                        HELLO, I AM
                    </h2>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1 / 2, delay: 0.2 / 2 }}
                    className="text-6xl md:text-8xl font-bold text-white mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400"
                >
                    AVINASH REDDY
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 / 2, delay: 0.4 / 2 }}
                    className="text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto font-light"
                >
                    Data Scientist &middot; Physics Enthusiast &middot; Builder
                </motion.p>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 / 2, delay: 0.8 / 2 }}
                    className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <a
                        href="#experience"
                        className="inline-flex items-center gap-2 px-8 py-3 border border-cyan-500/50 rounded-full text-cyan-400 hover:bg-cyan-500/10 transition-all group"
                    >
                        View Experience
                        <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
                    </a>
                    <Link
                        to="/blog"
                        className="inline-flex items-center gap-2 px-8 py-3 border border-slate-700 rounded-full text-slate-200 hover:border-cyan-500/50 hover:text-cyan-300 transition-all"
                    >
                        Read the Blog
                    </Link>
                </motion.div>
            </div>

            <div className="absolute bottom-10 left-10 text-slate-600 font-mono text-xs hidden md:block">
                COORD: 19.0760° N, 72.8777° E
            </div>
            <div className="absolute bottom-10 right-10 text-slate-600 font-mono text-xs hidden md:block">
                SYS: REACT • VITE • TAILWIND
            </div>
        </section>
    );
};

export default Hero;
