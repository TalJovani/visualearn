import { useState } from 'react';
import BubbleSortVisualizer from './components/BubbleSortVisualizer';
import BinarySearchVisualizer from './components/BinarySearchVisualizer';
import FibonacciVisualizer from './components/FibonacciVisualizer';
import QuickSortVisualizer from './components/QuickSortVisualizer';
import './App.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function App() {
  const [topic, setTopic] = useState('bubble-sort');
  const [explanation, setExplanation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTopicChange = (e) => {
    setTopic(e.target.value);
  };

  const handleAsk = async () => {
    setExplanation('');
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/explain?topic=${topic}`);

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split('\n');
        buffer = lines.pop();

        for (const line of lines) {
          if (!line.trim()) continue;
          const { text } = JSON.parse(line);
          setExplanation((prev) => prev + text);
        }
      }
    } catch (err) {
      console.error(err);
      setError('Failed to get explanation. Is the backend running on ' + API_URL + '?');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app">
      <header>
        <h1>🎓 VisuaLearn</h1>
        <p>Visualize any concept with AI explanation</p>
        <p className="tagline">Get ready to fall in love with algorithms 🤩</p>
      </header>

      <main>
        <div className="controls">
          <select value={topic} onChange={handleTopicChange}>
            <option value="bubble-sort">Bubble Sort</option>
            <option value="binary-search">Binary Search</option>
            <option value="fibonacci">Fibonacci</option>
            <option value="quick-sort">Quick Sort</option>
          </select>

          <button onClick={handleAsk} disabled={isLoading}>
            {isLoading ? '⏳ Thinking...' : '🚀 Visualize & Explain'}
          </button>
        </div>

        {error && <p className="error">{error}</p>}

        <div className="content">
          <div className="visualizer-section">
            {topic === 'bubble-sort' && <BubbleSortVisualizer explanation={explanation} />}
            {topic === 'binary-search' && <BinarySearchVisualizer explanation={explanation} />}
            {topic === 'fibonacci' && <FibonacciVisualizer explanation={explanation} />}
            {topic === 'quick-sort' && <QuickSortVisualizer explanation={explanation} />}
          </div>

          {explanation && (
            <div className="explanation-section">
              <h3>Explanation</h3>
              <p>{explanation}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}