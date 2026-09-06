import { useState } from 'react';
import { motion } from 'framer-motion';
import './BubbleSortVisualizer.css';

export default function BubbleSortVisualizer({ explanation }) {
  const [array, setArray] = useState([5, 3, 8, 1, 9, 2, 7, 4]);
  const [comparing, setComparing] = useState([]);
  const [sorted, setSorted] = useState([]);
  const [isRunning, setIsRunning] = useState(false);

  // ✅ NEW: Voice function — returns a promise that resolves once speech finishes,
  // so the caller can `await` it and stay in sync with the narration.
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

  const bubbleSort = async () => {
    setIsRunning(true);
    let arr = [...array];
    let newSorted = [];

    // ✅ Speak at start
    await speakExplanation("Starting bubble sort algorithm");

    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        setComparing([j, j + 1]);
        await new Promise(resolve => setTimeout(resolve, 500));

        if (arr[j] > arr[j + 1]) {
          await speakExplanation(`Swapping ${arr[j]} and ${arr[j + 1]}`);
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          setArray([...arr]);
        }
      }

      newSorted = [...newSorted, arr.length - 1 - i];
      setSorted(newSorted);
    }

    setComparing([]);
    setIsRunning(false);
    
    // ✅ Speak when done
    speakExplanation("Sorting complete");
  };

  const resetArray = () => {
    setArray([5, 3, 8, 1, 9, 2, 7, 4]);
    setComparing([]);
    setSorted([]);
  };

  return (
    <div className="visualizer">
      <h3>Bubble Sort</h3>

      <div className="bars-container">
        {array.map((num, i) => {
          let color = 'blue';
          if (comparing.includes(i)) color = 'red';
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
        <button onClick={bubbleSort} disabled={isRunning}>
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
        {isRunning ? 'Sorting...' : 'Click "Start Sort" to see bubble sort in action'}
      </p>
    </div>
  );
}