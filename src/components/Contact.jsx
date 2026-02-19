import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Linkedin, Github, Send } from 'lucide-react';

const Contact = () => {
    return (
        <section id="contact" className="py-24 bg-slate-900 relative">
            <div className="container mx-auto px-4 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                        Initialize <span className="text-cyan-500">Connection</span>
                    </h2>
                    <p className="text-slate-400 text-lg">
                        Ready to build something extraordinary? Let's discuss first principles.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-12">
                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-8"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-cyan-400">
                                <Mail className="w-6 h-6" />
                            </div>
                            <div>
                                <div className="text-slate-500 text-sm font-mono">EMAIL</div>
                                <a href="mailto:duggempudireddy1233@gmail.com" className="text-white hover:text-cyan-400 transition-colors">
                                    duggempudireddy1233@gmail.com
                                </a>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-cyan-400">
                                <Linkedin className="w-6 h-6" />
                            </div>
                            <div>
                                <div className="text-slate-500 text-sm font-mono">LINKEDIN</div>
                                <a href="https://linkedin.com/in/avinash-reddy-6b9b56207" target="_blank" rel="noopener noreferrer" className="text-white hover:text-cyan-400 transition-colors">
                                    linkedin.com/in/avinash-reddy...
                                </a>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-cyan-400">
                                <Github className="w-6 h-6" />
                            </div>
                            <div>
                                <div className="text-slate-500 text-sm font-mono">GITHUB</div>
                                <a href="https://github.com/THEAVINASHREDDY" target="_blank" rel="noopener noreferrer" className="text-white hover:text-cyan-400 transition-colors">
                                    github.com/THEAVINASHREDDY
                                </a>
                            </div>
                        </div>
                    </motion.div>

                    {/* Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700 backdrop-blur-sm"
                    >
                        <form className="space-y-6">
                            <div>
                                <label className="block text-slate-400 text-sm font-mono mb-2">IDENTITY</label>
                                <input type="text" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors" placeholder="Name" />
                            </div>
                            <div>
                                <label className="block text-slate-400 text-sm font-mono mb-2">COORDINATES</label>
                                <input type="email" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors" placeholder="Email" />
                            </div>
                            <div>
                                <label className="block text-slate-400 text-sm font-mono mb-2">TRANSMISSION</label>
                                <textarea className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors h-32 resize-none" placeholder="Message"></textarea>
                            </div>
                            <button type="submit" className="w-full bg-cyan-500 hover:bg-cyan-600 text-slate-900 font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2">
                                <Send className="w-5 h-5" />
                                Send Transmission
                            </button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
