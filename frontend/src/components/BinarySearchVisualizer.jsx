import { useState } from 'react';
import { motion } from 'framer-motion';
import { useVoiceNarration } from '../hooks/useVoiceNarration';
import { generateSearchArray } from '../utils/arrayPresets';
import './BinarySearchVisualizer.css';

export default function BinarySearchVisualizer({ explanation }) {
  const [arrayType, setArrayType] = useState('unique');
  const [array, setArray] = useState(() => generateSearchArray('unique'));
  const [target, setTarget] = useState(() => array[Math.floor(array.length / 2)]);
  const [low, setLow] = useState(null);
  const [high, setHigh] = useState(null);
  const [mid, setMid] = useState(null);
  const [found, setFound] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const {
    speak: speakExplanation,
    checkpoint,
    reset: resetRun,
    pause: pauseRun,
    resume: resumeRun,
    abort: abortRun,
  } = useVoiceNarration();

  const notInArrayValue = Math.max(...array) + 1;

  const search = async () => {
    resetRun();
    setIsRunning(true);
    setIsPaused(false);
    setFound(null);
    setMid(null);

    let lo = 0;
    let hi = array.length - 1;
    setLow(lo);
    setHigh(hi);

    await speakExplanation(`Searching for ${target}`);
    if (await checkpoint()) return;

    while (lo <= hi) {
      const m = Math.floor((lo + hi) / 2);
      setMid(m);
      await new Promise((resolve) => setTimeout(resolve, 600));
      if (await checkpoint()) return;

      if (array[m] === target) {
        setFound(m);
        await speakExplanation(`Found ${target} at index ${m}`);
        setIsRunning(false);
        return;
      } else if (array[m] < target) {
        await speakExplanation(`${array[m]} is less than ${target}, searching the right half`);
        lo = m + 1;
      } else {
        await speakExplanation(`${array[m]} is greater than ${target}, searching the left half`);
        hi = m - 1;
      }
      if (await checkpoint()) return;

      setLow(lo);
      setHigh(hi);
      setMid(null);
    }

    setFound('not-found');
    await speakExplanation(`${target} was not found in the array`);
    setIsRunning(false);
  };

  const handlePlay = () => {
    if (isPaused) {
      setIsPaused(false);
      resumeRun();
    } else {
      search();
    }
  };

  const handlePause = () => {
    setIsPaused(true);
    pauseRun();
  };

  const randomize = () => {
    if (isRunning) return;
    const newArray = generateSearchArray(arrayType);
    setArray(newArray);
    setTarget(newArray[Math.floor(newArray.length / 2)]);
    setLow(null);
    setHigh(null);
    setMid(null);
    setFound(null);
  };

  const reset = () => {
    abortRun();
    setIsRunning(false);
    setIsPaused(false);
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
          Array:
          <select
            value={arrayType}
            onChange={(e) => setArrayType(e.target.value)}
            disabled={isRunning}
          >
            <option value="unique">Random (unique values)</option>
            <option value="duplicates">With duplicate values</option>
          </select>
        </label>
        <button onClick={randomize} disabled={isRunning}>
          🎲 Randomize Numbers
        </button>
        <label>
          Target:
          <select
            value={target}
            onChange={(e) => setTarget(Number(e.target.value))}
            disabled={isRunning}
          >
            {array.map((num, i) => (
              <option key={i} value={num}>{num}</option>
            ))}
            <option value={notInArrayValue}>{notInArrayValue} (not in array)</option>
          </select>
        </label>
      </div>

      <div className="bars-container">
        {array.map((num, i) => {
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
        <button onClick={handlePlay} disabled={isRunning && !isPaused}>
          ▶ Play
        </button>
        <button className="stop-btn" onClick={handlePause} disabled={!isRunning || isPaused}>
          Stop
        </button>
        <button onClick={reset} disabled={isRunning && !isPaused}>
          Reset
        </button>
        {explanation && (
          <button onClick={() => speakExplanation(explanation)}>
            🔊 Read Explanation
          </button>
        )}
      </div>

      <p className="info">
        {isPaused
          ? 'Paused — click Play to continue'
          : isRunning
          ? 'Searching...'
          : found === null
          ? 'Pick a target and click "Play"'
          : found === 'not-found'
          ? `${target} was not found`
          : `Found ${target} at index ${found}`}
      </p>
    </div>
  );
}
