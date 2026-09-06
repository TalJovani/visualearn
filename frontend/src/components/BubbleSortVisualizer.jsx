import { useState } from 'react';
import { motion } from 'framer-motion';
import './BubbleSortVisualizer.css';

export default function BubbleSortVisualizer() {
  const [array, setArray] = useState([5, 3, 8, 1, 9, 2, 7, 4]);
  const [comparing, setComparing] = useState([]);
  const [sorted, setSorted] = useState([]);
  const [isRunning, setIsRunning] = useState(false);

  const bubbleSort = async () => {
    setIsRunning(true);
    let arr = [...array];
    let newSorted = [];

    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        setComparing([j, j + 1]);
        await new Promise(resolve => setTimeout(resolve, 500));

        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          setArray([...arr]);
        }
      }

      newSorted = [...newSorted, arr.length - 1 - i];
      setSorted(newSorted);
    }

    setComparing([]);
    setIsRunning(false);
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
      </div>

      <p className="info">
        {isRunning ? 'Sorting...' : 'Click "Start Sort" to see bubble sort in action'}
      </p>
    </div>
  );
}