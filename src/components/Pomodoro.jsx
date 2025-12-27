import React, { useState, useEffect, useRef } from "react";
import "./Pomodoro.css";

const WORK_SEC = 25 * 60;
const BREAK_SEC = 5 * 60;

function Pomodoro() {
  const [visible, setVisible] = useState(false);
  const [running, setRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(WORK_SEC);
  const [totalWorkSec, setTotalWorkSec] = useState(0);

  // refs for precise timing
  const rafRef = useRef(null);
  const sessionEndRef = useRef(null); // timestamp in ms when current session ends
  const lastWorkUpdateRef = useRef(null); // timestamp in ms used to accumulate total work seconds

  useEffect(() => {
    function tick() {
      const now = Date.now();

      if (!sessionEndRef.current) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      let remainingMs = sessionEndRef.current - now;
      // if remainingMs <= 0, session ended
      if (remainingMs <= 0) {
        // handle transition
        if (!isBreak) {
          // finished work
          try {
            if (typeof Notification !== "undefined") {
              if (Notification.permission === "granted") {
                new Notification("Pomodoro", { body: "Time for a 5 minute break" });
              } else {
                Notification.requestPermission();
              }
            }
          } catch (e) {}
          try { alert("Time for a 5 minute break"); } catch (e) {}
          // start break
          setIsBreak(true);
          sessionEndRef.current = now + BREAK_SEC * 1000;
          // reset lastWorkUpdate so we don't count break time
          lastWorkUpdateRef.current = now;
          remainingMs = sessionEndRef.current - now;
        } else {
          // finished break -> start work again
          setIsBreak(false);
          sessionEndRef.current = now + WORK_SEC * 1000;
          // start counting work from now
          lastWorkUpdateRef.current = now;
          remainingMs = sessionEndRef.current - now;
        }
      }

      // update secondsLeft from sessionEnd
      const secLeft = Math.max(0, Math.ceil(remainingMs / 1000));
      setSecondsLeft(secLeft);

      // update totalWorkSec precisely (only during work)
      if (!isBreak && lastWorkUpdateRef.current) {
        const elapsedWorkMs = now - lastWorkUpdateRef.current;
        if (elapsedWorkMs >= 1000) {
          const add = Math.floor(elapsedWorkMs / 1000);
          setTotalWorkSec((t) => t + add);
          // send increment to backend for each add (batched as add seconds)
          if (currentUser && currentUser.token) {
            try {
              fetch('http://localhost:3000/api/pomodoro/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${currentUser.token}` },
                body: JSON.stringify({ seconds: add }),
              }).catch(() => {})
            } catch (e) {}
          }
          lastWorkUpdateRef.current = lastWorkUpdateRef.current + add * 1000;
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    }

    if (running) {
      // start or resume
      if (!sessionEndRef.current) {
        // starting fresh
        sessionEndRef.current = Date.now() + (isBreak ? BREAK_SEC : WORK_SEC) * 1000;
        lastWorkUpdateRef.current = Date.now();
      } else {
        // resuming: adjust sessionEndRef by the pause duration
        // we store a pauseStart in state by clearing rafRef; to simplify we'll keep sessionEnd as-is
        if (!lastWorkUpdateRef.current) lastWorkUpdateRef.current = Date.now();
      }

      if (!rafRef.current) rafRef.current = requestAnimationFrame(tick);
    }

    if (!running) {
      // stop loop
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      // clear session data
      sessionEndRef.current = null;
      lastWorkUpdateRef.current = null;
    }

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [running]);

  // load today's total from server on mount (if logged in)
  useEffect(() => {
    let mounted = true
    if (currentUser && currentUser.token) {
      fetch('http://localhost:3000/api/pomodoro/', { headers: { Authorization: `Bearer ${currentUser.token}` } })
        .then(r => r.json())
        .then(data => { if (mounted && data && typeof data.totalSeconds === 'number') setTotalWorkSec(data.totalSeconds) })
        .catch(() => {})
    }
    return () => { mounted = false }
  }, [currentUser])

  function togglePanel() {
    const opening = !visible;
    setVisible(opening);
    if (opening) {
      setIsBreak(false);
      setSecondsLeft(WORK_SEC);
      setTotalWorkSec((t) => t); // no-op to keep state hook stable
      setRunning(true);
    } else {
      setRunning(false);
    }
  }

  function stopTimer() {
    setRunning(false);
    setIsBreak(false);
    setSecondsLeft(WORK_SEC);
    // do not reset totalWorkSec, keep accumulated
  }

  function format(sec) {
    const m = Math.floor(sec / 60).toString().padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }

  return (
    <div className="pomodoro-widget">
      <div
        className="dashboard-btn pomodoro-btn"
        role="button"
        tabIndex={0}
        onClick={() => togglePanel()}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') togglePanel(); }}
      >
        Pomodoro
      </div>

      {visible && (
        <div className="pomodoro-panel" onClick={(e) => e.stopPropagation()}>
          <div className="pomodoro-top">
            <div className="pomodoro-state">{isBreak ? "Break" : "Work"}</div>
            <div className="pomodoro-timer">{format(secondsLeft)}</div>
          </div>

          <div className="pomodoro-controls">
            {running ? (
              <button className="pom-btn stop" onClick={stopTimer}>Stop</button>
            ) : (
              <button className="pom-btn" onClick={() => setRunning(true)}>Start</button>
            )}
            <button className="pom-btn" onClick={() => { setVisible(false); setRunning(false); }}>Close</button>
          </div>
          <div className="pomodoro-total">Total work time: {Math.floor(totalWorkSec / 60)}m {totalWorkSec % 60}s</div>
        </div>
      )}
    </div>
  );
}

export default React.memo(Pomodoro);
