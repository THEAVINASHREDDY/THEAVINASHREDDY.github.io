import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">404: Lost in the Grid</h1>
        <p className="text-slate-400 mb-6">This page drifted out of the known coordinates.</p>
        <Link to="/" className="text-cyan-300 hover:text-cyan-200 font-mono text-sm">Return Home</Link>
      </div>
    </div>
  );
};

export default NotFound;
