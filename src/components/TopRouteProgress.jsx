import React from 'react';

const TopRouteProgress = ({ active }) => {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
      <div className={`route-progress-track ${active ? 'is-active' : ''}`}>
        <div className="route-progress-bar"></div>
      </div>
    </div>
  );
};

export default TopRouteProgress;
