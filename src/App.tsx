import { useState, useEffect } from 'react';
import Home from './Home';
import AISetup from './ai_integration/AISetup';
import { executeOllamaStreaming, checkOllamaAPI } from './ai_integration/executeOllama';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import IDEHome from './IDEHome';
import HealthAnalytics from './health_analytics/HealthAnalytics ';
import Community from './developer_community/Community';

// Test Ollama function with streaming support
const testOllama = async () => {
  try {
    // First check if Ollama API is accessible
    const isApiAccessible = await checkOllamaAPI();

    if (!isApiAccessible) {
      console.error('Ollama API is not accessible. Please make sure Ollama is running.');
      return;
    }

    console.log('📝 Sending request to Ollama...');
    console.log('💭 Prompt: Create a sample Python program that demonstrates object-oriented programming');

    let responseText = '';
    console.log('Response streaming:');
    console.log('----------------------------');

    const result = await executeOllamaStreaming(
      'Create a sample Python program that demonstrates object-oriented programming',
      // Token callback - called for each new piece of the response
      (token) => {
        process.stdout.write(token); // This will print without newlines
        responseText += token;
      },
      // Complete callback - called when the response is finished
      (fullResponse) => {
        console.log('\n----------------------------');
        console.log('✅ Full response received:');
        console.log(fullResponse);
      },
      // Error callback
      (error) => {
        console.error('❌ Error:', error);
      }
    );

    if (!result.success) {
      console.error('❌ Error:', result.error);
    }
  } catch (error) {
    console.error('❌ Failed to execute Ollama test:', error);
  }
};

function App() {
  // State to track whether we've run the test
  const [hasRunTest, setHasRunTest] = useState(false);

  useEffect(() => {
    // Only run the test once when the component mounts
    if (!hasRunTest) {
      testOllama();
      setHasRunTest(true);
    }
  }, [hasRunTest]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ide" element={<IDEHome />} />
        <Route path="/aisetup" element={<AISetup />} />
        <Route path="/health" element={<HealthAnalytics />} />
        <Route path="/community" element={<Community/>} />
      </Routes>
    </Router>
  );
}

export default App;