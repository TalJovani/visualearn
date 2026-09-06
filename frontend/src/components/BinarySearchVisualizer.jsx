import { useState } from 'react';
import { motion } from 'framer-motion';
import './BinarySearchVisualizer.css';

const ARRAY = [2, 5, 8, 12, 16, 23, 38, 45, 56, 72, 91];

export default function BinarySearchVisualizer({ explanation }) {
  const [target, setTarget] = useState(45);
  const [low, setLow] = useState(null);
  const [high, setHigh] = useState(null);
  const [mid, setMid] = useState(null);
  const [found, setFound] = useState(null);
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

  const search = async () => {
    setIsRunning(true);
    setFound(null);
    setMid(null);

    let lo = 0;
    let hi = ARRAY.length - 1;
    setLow(lo);
    setHigh(hi);

    await speakExplanation(`Searching for ${target}`);

    while (lo <= hi) {
      const m = Math.floor((lo + hi) / 2);
      setMid(m);
      await new Promise((resolve) => setTimeout(resolve, 600));

      if (ARRAY[m] === target) {
        setFound(m);
        await speakExplanation(`Found ${target} at index ${m}`);
        setIsRunning(false);
        return;
      } else if (ARRAY[m] < target) {
        await speakExplanation(`${ARRAY[m]} is less than ${target}, searching the right half`);
        lo = m + 1;
      } else {
        await speakExplanation(`${ARRAY[m]} is greater than ${target}, searching the left half`);
        hi = m - 1;
      }

      setLow(lo);
      setHigh(hi);
      setMid(null);
    }

    setFound('not-found');
    await speakExplanation(`${target} was not found in the array`);
    setIsRunning(false);
  };

  const reset = () => {
    setLow(null);
    setHigh(null);
    setMid(null);
    setFound(null);
  };

  return (
    <div className="visualizer">
      <h3>Binary Search</h3>

      <div className="search-controls">
        <label>
          Target:
          <select
            value={target}
            onChange={(e) => setTarget(Number(e.target.value))}
            disabled={isRunning}
          >
            {ARRAY.map((num) => (
              <option key={num} value={num}>{num}</option>
            ))}
            <option value={100}>100 (not in array)</option>
          </select>
        </label>
      </div>

      <div className="bars-container">
        {ARRAY.map((num, i) => {
          const inRange = low !== null && high !== null && i >= low && i <= high;
          let className = 'cell';
          if (low !== null && !inRange) className += ' eliminated';
          if (i === mid) className += ' mid';
          if (found === i) className += ' found';

          return (
            <motion.div key={i} className={className} layout>
              <span className="value">{num}</span>
              <span className="index">{i}</span>
            </motion.div>
          );
        })}
      </div>

      <div className="controls">
        <button onClick={search} disabled={isRunning}>
          Start Search
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
        {isRunning
          ? 'Searching...'
          : found === null
          ? 'Pick a target and click "Start Search"'
          : found === 'not-found'
          ? `${target} was not found`
          : `Found ${target} at index ${found}`}
      </p>
    </div>
  );
}
