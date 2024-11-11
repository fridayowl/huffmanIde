import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import IDEHome from './IDEHome'
import Home from './Home';
 
function App() {

  return (
    //  <AnalyticsDashboard userId={"asas"}/>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ide" element={<IDEHome />} />
      </Routes>
    </Router>
    //ffinal d 
   
  );
} 

export default App;