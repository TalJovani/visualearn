import { useState } from 'react';
import BubbleSortVisualizer from './components/BubbleSortVisualizer';
import './App.css';

export default function App() {
  const [topic, setTopic] = useState('bubble-sort');
  const [explanation, setExplanation] = useState('');

  const handleTopicChange = (e) => {
    setTopic(e.target.value);
  };

  const handleAsk = async () => {
    setExplanation(`Understanding ${topic}...`);
  };

  return (
    <div className="app">
      <header>
        <h1>🎓 VisuaLearn</h1>
        <p>Visualize any concept with AI explanation</p>
      </header>

      <main>
        <div className="controls">
          <select value={topic} onChange={handleTopicChange}>
            <option value="bubble-sort">Bubble Sort</option>
            <option value="binary-search">Binary Search</option>
            <option value="quick-sort">Quick Sort</option>
          </select>

          <button onClick={handleAsk}>
            🚀 Visualize & Explain
          </button>
        </div>

        <div className="content">
          <div className="visualizer-section">
            {topic === 'bubble-sort' && <BubbleSortVisualizer />}
            {topic === 'binary-search' && <p>Binary search coming soon</p>}
            {topic === 'quick-sort' && <p>Quick sort coming soon</p>}
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