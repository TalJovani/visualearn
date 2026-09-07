import { useState } from 'react';
import { motion } from 'framer-motion';
import { useVoiceNarration } from '../hooks/useVoiceNarration';
import { generateSortArray } from '../utils/arrayPresets';
import './BubbleSortVisualizer.css';

export default function BubbleSortVisualizer({ explanation }) {
  const [arrayType, setArrayType] = useState('random');
  const [array, setArray] = useState(() => generateSortArray('random'));
  const [comparing, setComparing] = useState([]);
  const [sorted, setSorted] = useState([]);
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

  const bubbleSort = async () => {
    resetRun();
    setIsRunning(true);
    setIsPaused(false);

    let arr = [...array];
    let newSorted = [];

    await speakExplanation('Starting bubble sort algorithm');
    if (await checkpoint()) return;

    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        setComparing([j, j + 1]);
        await new Promise((resolve) => setTimeout(resolve, 500));
        if (await checkpoint()) return;

        if (arr[j] > arr[j + 1]) {
          await speakExplanation(`Swapping ${arr[j]} and ${arr[j + 1]}`);
          if (await checkpoint()) return;
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          setArray([...arr]);
        }
      }

      newSorted = [...newSorted, arr.length - 1 - i];
      setSorted(newSorted);
    }

    setComparing([]);
    setIsRunning(false);

    await speakExplanation('Sorting complete');
  };

  const handlePlay = () => {
    if (isPaused) {
      setIsPaused(false);
      resumeRun();
    } else {
      bubbleSort();
    }
  };

  const handlePause = () => {
    setIsPaused(true);
    pauseRun();
  };

  const randomize = () => {
    if (isRunning) return;
    setArray(generateSortArray(arrayType));
    setComparing([]);
    setSorted([]);
  };

  const resetArray = () => {
    abortRun();
    setIsRunning(false);
    setIsPaused(false);
    setComparing([]);
    setSorted([]);
  };

  return (
    <div className="visualizer">
      <h3>Bubble Sort</h3>

      <div className="array-controls">
        <label>
          Array:
          <select
            value={arrayType}
            onChange={(e) => setArrayType(e.target.value)}
            disabled={isRunning}
          >
            <option value="random">Random</option>
            <option value="sorted">Already sorted (best case)</option>
            <option value="reverse">Reverse sorted (worst case)</option>
            <option value="duplicates">All same value</option>
          </select>
        </label>
        <button onClick={randomize} disabled={isRunning}>
          🎲 Randomize Numbers
        </button>
      </div>

      <div className="bars-container">
        {array.map((num, i) => {
          let color = 'var(--color-default)';
          if (comparing.includes(i)) color = 'var(--color-compare)';
          if (sorted.includes(i)) color = 'var(--color-sorted)';

          return (
            <motion.div
              key={i}
              className="bar"
              animate={{
                height: `${num * 30}px`,
                backgroundColor: color,
              }}
              transition={{ duration: 0.3 }}
            >
              <span>{num}</span>
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
        <button onClick={resetArray} disabled={isRunning && !isPaused}>
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
          ? 'Sorting...'
          : 'Click "Play" to see bubble sort in action'}
      </p>
    </div>
  );
}
