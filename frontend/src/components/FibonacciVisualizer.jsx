import { useState } from 'react';
import { motion } from 'framer-motion';
import { useVoiceNarration } from '../hooks/useVoiceNarration';
import './FibonacciVisualizer.css';

const COUNT = 10;

export default function FibonacciVisualizer({ explanation }) {
  const [sequence, setSequence] = useState([]);
  const [highlighted, setHighlighted] = useState([]);
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

  const run = async () => {
    resetRun();
    setIsRunning(true);
    setIsPaused(false);
    setHighlighted([]);

    await speakExplanation('Building the Fibonacci sequence');
    if (await checkpoint()) return;

    let seq = [0, 1];
    setSequence([...seq]);
    setHighlighted([0, 1]);
    await new Promise((resolve) => setTimeout(resolve, 500));
    if (await checkpoint()) return;

    for (let i = 2; i < COUNT; i++) {
      setHighlighted([i - 2, i - 1]);
      await new Promise((resolve) => setTimeout(resolve, 500));
      if (await checkpoint()) return;

      const next = seq[i - 1] + seq[i - 2];
      await speakExplanation(`${seq[i - 2]} plus ${seq[i - 1]} equals ${next}`);
      if (await checkpoint()) return;

      seq = [...seq, next];
      setSequence([...seq]);
      setHighlighted([i]);
      await new Promise((resolve) => setTimeout(resolve, 300));
      if (await checkpoint()) return;
    }

    setHighlighted([]);
    setIsRunning(false);
  };

  const handlePlay = () => {
    if (isPaused) {
      setIsPaused(false);
      resumeRun();
    } else {
      run();
    }
  };

  const handlePause = () => {
    setIsPaused(true);
    pauseRun();
  };

  const reset = () => {
    abortRun();
    setIsRunning(false);
    setIsPaused(false);
    setSequence([]);
    setHighlighted([]);
  };

  return (
    <div className="visualizer">
      <h3>Fibonacci Sequence</h3>

      <div className="fib-container">
        {sequence.length === 0 && (
          <p className="fib-placeholder">Click "Play" to build the sequence</p>
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
          ? 'Calculating...'
          : 'Each number is the sum of the two before it'}
      </p>
    </div>
  );
}
