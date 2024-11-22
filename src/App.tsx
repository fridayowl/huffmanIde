import { useState, useEffect } from 'react';
import Home from './Home';
import AISetup from './ai_integration/AISetup';
import { executeOllamaStreaming, checkOllamaAPI } from './ai_integration/executeOllama';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import IDEHome from './IDEHome';
import HealthAnalytics from './health_analytics/HealthAnalytics ';
import Community from './developer_community/Community';
import AutoUpdater from './AutoUpdater';
 

function App() {
  return (
    <Router>
      <div className="relative">
        {/* AutoUpdater positioned at the top of the app */}
        <div className="absolute top-4 right-4 z-50">
          <AutoUpdater />
        </div>

        {/* Main routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ide" element={<IDEHome />} />
          <Route path="/aisetup" element={<AISetup />} />
          <Route path="/health" element={<HealthAnalytics />} />
          <Route path="/community" element={<Community />} />
        </Routes>
      </div>
    </Router>
  );
}


export default App;