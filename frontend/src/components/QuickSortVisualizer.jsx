import { useState } from 'react';
import { motion } from 'framer-motion';
import { useVoiceNarration } from '../hooks/useVoiceNarration';
import { generateSortArray } from '../utils/arrayPresets';
import './QuickSortVisualizer.css';

export default function QuickSortVisualizer({ explanation }) {
  const [arrayType, setArrayType] = useState('random');
  const [array, setArray] = useState(() => generateSortArray('random'));
  const [comparing, setComparing] = useState([]);
  const [pivotIndex, setPivotIndex] = useState(null);
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

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const partition = async (arr, low, high) => {
    const pivotValue = arr[high];
    setPivotIndex(high);
    await speakExplanation(`Choosing ${pivotValue} as the pivot`);
    if (await checkpoint()) return high;

    let i = low - 1;
    for (let j = low; j < high; j++) {
      setComparing([j, high]);
      await sleep(500);
      if (await checkpoint()) return high;

      if (arr[j] < pivotValue) {
        i++;
        if (i !== j) {
          await speakExplanation(`Swapping ${arr[i]} and ${arr[j]}`);
          if (await checkpoint()) return high;
          [arr[i], arr[j]] = [arr[j], arr[i]];
          setArray([...arr]);
        }
      }
    }

    setComparing([]);

    if (i + 1 !== high) {
      await speakExplanation(`Placing pivot ${pivotValue} in its sorted position`);
      if (await checkpoint()) return high;
      [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
      setArray([...arr]);
    }

    setPivotIndex(null);
    return i + 1;
  };

  const quickSortRange = async (arr, low, high) => {
    if (low > high) return;
    if (await checkpoint()) return;
    if (low === high) {
      setSorted((prev) => [...prev, low]);
      return;
    }

    const p = await partition(arr, low, high);
    if (await checkpoint()) return;
    setSorted((prev) => [...prev, p]);
    await quickSortRange(arr, low, p - 1);
    await quickSortRange(arr, p + 1, high);
  };

  const startSort = async () => {
    resetRun();
    setIsRunning(true);
    setIsPaused(false);
    setSorted([]);
    setComparing([]);
    setPivotIndex(null);

    const arr = [...array];
    await speakExplanation('Starting quicksort');
    if (await checkpoint()) return;
    await quickSortRange(arr, 0, arr.length - 1);
    if (await checkpoint()) return;
    await speakExplanation('Sorting complete');

    setIsRunning(false);
  };

  const handlePlay = () => {
    if (isPaused) {
      setIsPaused(false);
      resumeRun();
    } else {
      startSort();
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
    setPivotIndex(null);
    setSorted([]);
  };

  const resetArray = () => {
    abortRun();
    setIsRunning(false);
    setIsPaused(false);
    setComparing([]);
    setPivotIndex(null);
    setSorted([]);
  };

  return (
    <div className="visualizer">
      <h3>Quick Sort</h3>

      <div className="array-controls">
        <label>
          Array:
          <select
            value={arrayType}
            onChange={(e) => setArrayType(e.target.value)}
            disabled={isRunning}
          >
            <option value="random">Random</option>
            <option value="sorted">Already sorted (worst case)</option>
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
          if (i === pivotIndex) color = 'var(--color-pivot)';
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
          : 'Click "Play" to see quicksort in action (gold = pivot)'}
      </p>
    </div>
  );
}
