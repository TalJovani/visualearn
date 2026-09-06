import { useState } from 'react';
import { motion } from 'framer-motion';
import './QuickSortVisualizer.css';

const INITIAL_ARRAY = [5, 3, 8, 1, 9, 2, 7, 4];

export default function QuickSortVisualizer({ explanation }) {
  const [array, setArray] = useState(INITIAL_ARRAY);
  const [comparing, setComparing] = useState([]);
  const [pivotIndex, setPivotIndex] = useState(null);
  const [sorted, setSorted] = useState([]);
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

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const partition = async (arr, low, high) => {
    const pivotValue = arr[high];
    setPivotIndex(high);
    await speakExplanation(`Choosing ${pivotValue} as the pivot`);

    let i = low - 1;
    for (let j = low; j < high; j++) {
      setComparing([j, high]);
      await sleep(500);

      if (arr[j] < pivotValue) {
        i++;
        if (i !== j) {
          await speakExplanation(`Swapping ${arr[i]} and ${arr[j]}`);
          [arr[i], arr[j]] = [arr[j], arr[i]];
          setArray([...arr]);
        }
      }
    }

    setComparing([]);

    if (i + 1 !== high) {
      await speakExplanation(`Placing pivot ${pivotValue} in its sorted position`);
      [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
      setArray([...arr]);
    }

    setPivotIndex(null);
    return i + 1;
  };

  const quickSortRange = async (arr, low, high) => {
    if (low > high) return;
    if (low === high) {
      setSorted((prev) => [...prev, low]);
      return;
    }

    const p = await partition(arr, low, high);
    setSorted((prev) => [...prev, p]);
    await quickSortRange(arr, low, p - 1);
    await quickSortRange(arr, p + 1, high);
  };

  const startSort = async () => {
    setIsRunning(true);
    setSorted([]);
    setComparing([]);
    setPivotIndex(null);

    const arr = [...array];
    await speakExplanation('Starting quicksort');
    await quickSortRange(arr, 0, arr.length - 1);
    await speakExplanation('Sorting complete');

    setIsRunning(false);
  };

  const resetArray = () => {
    setArray(INITIAL_ARRAY);
    setComparing([]);
    setPivotIndex(null);
    setSorted([]);
  };

  return (
    <div className="visualizer">
      <h3>Quick Sort</h3>

      <div className="bars-container">
        {array.map((num, i) => {
          let color = 'blue';
          if (comparing.includes(i)) color = 'red';
          if (i === pivotIndex) color = 'purple';
          if (sorted.includes(i)) color = 'green';

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
        <button onClick={startSort} disabled={isRunning}>
          Start Sort
        </button>
        <button onClick={resetArray} disabled={isRunning}>
          Reset
        </button>
        {explanation && (
          <button onClick={() => speakExplanation(explanation)}>
            🔊 Read Explanation
          </button>
        )}
      </div>

      <p className="info">
        {isRunning ? 'Sorting...' : 'Click "Start Sort" to see quicksort in action (purple = pivot)'}
      </p>
    </div>
  );
}
