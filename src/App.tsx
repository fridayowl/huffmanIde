import  Home  from './Home';
import AISetup from './ai_integration/AISetup';
import { executeOllama, checkOllamaAPI } from './ai_integration/executeOllama';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import IDEHome from './IDEHome';

// Test Ollama function
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

    const result = await executeOllama(
      'Create a sample Python program that demonstrates object-oriented programming'
    );

    if (result.success) {
      console.log('✅ Response received successfully:');
      console.log('----------------------------');
      console.log(result.data);
      console.log('----------------------------');
    } else {
      console.error('❌ Error:', result.error);
    }
  } catch (error) {
    console.error('❌ Failed to execute Ollama test:', error);
  }
};

// Execute the test immediately
testOllama();

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ide" element={<IDEHome />} />
        <Route path="/aisetup" element={<AISetup />} />
      </Routes>
    </Router>
  );
}

export default App;