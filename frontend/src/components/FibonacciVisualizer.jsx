import { useState } from 'react';
import { motion } from 'framer-motion';
import './FibonacciVisualizer.css';

const COUNT = 10;

export default function FibonacciVisualizer({ explanation }) {
  const [sequence, setSequence] = useState([]);
  const [highlighted, setHighlighted] = useState([]);
  const [isRunning, setIsRunning] = useState(false);

  const speakExplanation = (text) => {
    return new Promise((resolve) => {
      if (!('speechSynthesis' in window)) {
        resolve();
        return;
      }
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.onend = resolve;
      utterance.onerror = resolve;
      window.speechSynthesis.speak(utterance);
    });
  };

  const run = async () => {
    setIsRunning(true);
    setHighlighted([]);

    await speakExplanation('Building the Fibonacci sequence');

    let seq = [0, 1];
    setSequence([...seq]);
    setHighlighted([0, 1]);
    await new Promise((resolve) => setTimeout(resolve, 500));

    for (let i = 2; i < COUNT; i++) {
      setHighlighted([i - 2, i - 1]);
      await new Promise((resolve) => setTimeout(resolve, 500));

      const next = seq[i - 1] + seq[i - 2];
      await speakExplanation(`${seq[i - 2]} plus ${seq[i - 1]} equals ${next}`);

      seq = [...seq, next];
      setSequence([...seq]);
      setHighlighted([i]);
      await new Promise((resolve) => setTimeout(resolve, 300));
    }

    setHighlighted([]);
    setIsRunning(false);
  };

  const reset = () => {
    setSequence([]);
    setHighlighted([]);
  };

  return (
    <div className="visualizer">
      <h3>Fibonacci Sequence</h3>

      <div className="fib-container">
        {sequence.length === 0 && (
          <p className="fib-placeholder">Click "Start" to build the sequence</p>
        )}
        {sequence.map((num, i) => (
          <motion.div
            key={i}
            className={`fib-box ${highlighted.includes(i) ? 'active' : ''}`}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <span className="fib-value">{num}</span>
            <span className="fib-index">F({i})</span>
          </motion.div>
        ))}
      </div>

      <div className="controls">
        <button onClick={run} disabled={isRunning}>
          Start
        </button>
        <button onClick={reset} disabled={isRunning}>
          Reset
        </button>
        {explanation && (
          <button onClick={() => speakExplanation(explanation)}>
            🔊 Read Explanation
          </button>
        )}
      </div>

      <p className="info">
        {isRunning ? 'Calculating...' : 'Each number is the sum of the two before it'}
      </p>
    </div>
  );
}
