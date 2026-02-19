import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import BlogIndex from './pages/BlogIndex';
import BlogPost from './pages/BlogPost';
import NotFound from './pages/NotFound';
import BootLoader from './components/BootLoader';
import TopRouteProgress from './components/TopRouteProgress';

function App() {
  const location = useLocation();
  const [isBooting, setIsBooting] = useState(true);
  const [isRouteLoading, setIsRouteLoading] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsBooting(false), 1450);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isBooting) return;
    setIsRouteLoading(true);
    const timer = window.setTimeout(() => setIsRouteLoading(false), 420);
    return () => window.clearTimeout(timer);
  }, [location.pathname, location.search, isBooting]);

  if (isBooting) {
    return <BootLoader />;
  }

  return (
    <>
      <TopRouteProgress active={isRouteLoading} />
      <Routes>
      <Route path="/" element={<Home isLoading={isRouteLoading} />} />
      <Route path="/blog" element={<BlogIndex />} />
      <Route path="/blog/:slug" element={<BlogPost />} />
      <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
