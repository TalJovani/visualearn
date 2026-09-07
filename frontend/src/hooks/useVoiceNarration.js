import { useCallback, useEffect, useRef } from 'react';

// Speaks text via the Web Speech API and coordinates an async animation
// loop's play/pause/reset lifecycle so voice and animation always match.
//
// - checkpoint(): call between animation steps. Blocks while paused and
//   resolves to `true` if the run should stop entirely, `false` otherwise.
// - pause()/resume(): pause silences speech immediately but keeps the run's
//   local state alive (the async loop stays suspended inside checkpoint()),
//   so resume() picks up exactly where it left off — no restart needed.
// - abort(): fully ends the run (used by Reset, and automatically on
//   unmount / switching to a different algorithm) — checkpoint() returns
//   `true` even if currently paused, releasing the suspended loop.
// - reset(): call at the start of a fresh run to clear leftover
//   cancelled/paused state from a previous run.
export function useVoiceNarration() {
  const cancelledRef = useRef(false);
  const pausedRef = useRef(false);
  const resumeWaiterRef = useRef(null);

  const releaseWaiter = () => {
    if (resumeWaiterRef.current) {
      const resolveFn = resumeWaiterRef.current;
      resumeWaiterRef.current = null;
      resolveFn();
    }
  };

  useEffect(() => {
    return () => {
      cancelledRef.current = true;
      releaseWaiter();
      window.speechSynthesis.cancel();
    };
  }, []);

  const speak = useCallback((text) => {
    return new Promise((resolve) => {
      if (cancelledRef.current || !('speechSynthesis' in window)) {
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
  }, []);

  const reset = useCallback(() => {
    cancelledRef.current = false;
    pausedRef.current = false;
  }, []);

  const pause = useCallback(() => {
    pausedRef.current = true;
    window.speechSynthesis.cancel();
  }, []);

  const resume = useCallback(() => {
    pausedRef.current = false;
    releaseWaiter();
  }, []);

  const abort = useCallback(() => {
    cancelledRef.current = true;
    releaseWaiter();
    window.speechSynthesis.cancel();
  }, []);

  // Resolves false immediately while running normally, blocks while paused
  // (until resume() or abort()), and resolves true when the caller should stop.
  const checkpoint = useCallback(() => {
    if (cancelledRef.current) return Promise.resolve(true);
    if (!pausedRef.current) return Promise.resolve(false);
    return new Promise((resolve) => {
      resumeWaiterRef.current = () => resolve(cancelledRef.current);
    });
  }, []);

  return { speak, checkpoint, reset, pause, resume, abort };
}
