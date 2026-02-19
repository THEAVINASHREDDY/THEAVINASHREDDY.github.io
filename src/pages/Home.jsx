import React from 'react';
import Hero from '../components/Hero';
import Experience from '../components/Experience';
import TechStack from '../components/TechStack';
import BlogPreview from '../components/BlogPreview';
import Contact from '../components/Contact';

const Home = ({ isLoading = false }) => {
  return (
    <div className="min-h-screen text-white font-sans overflow-x-hidden selection:bg-cyan-500/30">
      <Hero />
      <Experience />
      <TechStack />
      <BlogPreview isLoading={isLoading} />
      <Contact isLoading={isLoading} />

      <footer className="py-8 text-center text-slate-600 font-mono text-sm border-t border-slate-800">
        <p>&copy; {new Date().getFullYear()} Avinash Reddy. Engineered with First Principles.</p>
        <p className="mt-2 text-xs opacity-50">react // vite // tailwind // physics</p>
      </footer>
    </div>
  );
};

export default Home;
