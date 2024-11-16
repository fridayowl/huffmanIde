// App.tsx
import { Home } from 'lucide-react';
import AISetup from './ai_integration/AISetup';
import { executeOllama, checkOllamaAPI } from './ai_integration/executeOllama'
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

    // Test parameters
    const modelName = 'qwen2.5-coder';
    const prompt = 'Create a sample Python program that demonstrates object-oriented programming';
    const parameters = {
      temperature: 0.7,
      max_tokens: 2048
    };

    console.log('📝 Sending request to Ollama...');
    console.log('🤖 Model:', modelName);
    console.log('💭 Prompt:', prompt);

    const result = await executeOllama(
      modelName,
      prompt,
      parameters
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