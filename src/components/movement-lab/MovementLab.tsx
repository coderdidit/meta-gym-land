import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import type { Results } from "@mediapipe/pose";
import PoseDetWebcam from "../Webcam/PoseDetWebcam";
import { SelectWebcam } from "../Webcam/SelectWebcam";
import {
  calibrate,
  mapHands,
  MovementRound,
  rules,
  ROUND_MS,
} from "../../games/movement-lab/engine";
import type {
  Calibration,
  Difficulty,
  InputMode,
  Landmark,
  Point,
} from "../../games/movement-lab/engine";
import styles from "./MovementLab.module.css";

type Phase = "ready" | "playing" | "paused" | "done";
type Session = {
  id: string;
  at: string;
  mode: InputMode;
  difficulty: Difficulty;
  score: number;
  completed: number;
  missed: number;
  bestCombo: number;
  trackingPauses: number;
  rating?: string;
};
const STORAGE = "mgl-reach-flow-v1";
function readSessions(): Session[] {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE) || "[]");
    return Array.isArray(value)
      ? value
          .filter(
            (s) => s && typeof s.id === "string" && Number.isFinite(s.score),
          )
          .slice(-50)
      : [];
  } catch {
    return [];
  }
}

export default function MovementLab() {
  const [mode, setMode] = useState<InputMode>("camera");
  const [difficulty, setDifficulty] = useState<Difficulty>("gentle");
  const [phase, setPhase] = useState<Phase>("ready");
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  const [sessions, setSessions] = useState<Session[]>(readSessions);
  const [saveFailed, setSaveFailed] = useState(false);
  const [view, setView] = useState({
    hands: [] as Point[],
    tracked: false,
    countdown: 0,
    tick: 0,
  });
  const latest = useRef({ landmarks: [] as Landmark[], at: 0 });
  const calibration = useRef<Calibration | null>(null);
  const pointer = useRef<Point | null>(null);
  const round = useRef(new MovementRound("gentle"));
  const countdown = useRef(0);
  const stable = useRef(0);
  const interruptions = useRef(0);
  const wasActive = useRef(false);
  const finished = useRef(false);
  const sessionId = useRef("");
  const game = round.current;
  const locked = phase === "playing" || phase === "paused";

  const receivePose = (results: Results) => {
    latest.current = {
      landmarks: results.poseLandmarks || [],
      at: performance.now(),
    };
  };

  useEffect(() => {
    let frame = 0;
    let previous = performance.now();
    const update = (now: number) => {
      const dt = Math.min(now - previous, 100);
      previous = now;
      const fresh = now - latest.current.at < 400;
      const area =
        phase === "ready"
          ? calibrate(latest.current.landmarks)
          : calibration.current;
      const hands =
        mode === "mouse"
          ? pointer.current
            ? [pointer.current]
            : []
          : fresh && area
          ? mapHands(latest.current.landmarks, area)
          : [];
      const tracked = hands.length > 0;
      stable.current = tracked ? stable.current + dt : 0;
      const active = tracked && stable.current >= 600;
      if (phase === "playing") {
        if (!tracked && wasActive.current) interruptions.current++;
        wasActive.current = tracked;
        if (countdown.current > 0) {
          if (active) countdown.current = Math.max(0, countdown.current - dt);
        } else {
          round.current.advance(dt, hands, active);
          if (round.current.done && !finished.current) {
            finished.current = true;
            const r = round.current;
            const session: Session = {
              id: sessionId.current,
              at: new Date().toISOString(),
              mode,
              difficulty: r.difficulty,
              score: r.score,
              completed: r.completed,
              missed: r.missed,
              bestCombo: r.bestCombo,
              trackingPauses: interruptions.current,
            };
            setSessions((old) => [...old, session].slice(-50));
            setPhase("done");
          }
        }
      }
      setView({
        hands,
        tracked: active,
        countdown: Math.ceil(countdown.current / 1000),
        tick: now,
      });
      frame = requestAnimationFrame(update);
    };
    frame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frame);
  }, [mode, phase]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE, JSON.stringify(sessions));
      setSaveFailed(false);
    } catch {
      setSaveFailed(true);
    }
  }, [sessions]);

  useEffect(() => {
    const pause = () => {
      if (document.hidden) setPhase((p) => (p === "playing" ? "paused" : p));
    };
    const key = (event: KeyboardEvent) => {
      if (event.key === "Escape")
        setPhase((p) => (p === "playing" ? "paused" : p));
    };
    document.addEventListener("visibilitychange", pause);
    window.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("visibilitychange", pause);
      window.removeEventListener("keydown", key);
    };
  }, []);

  function start() {
    if (mode === "camera") {
      calibration.current = calibrate(latest.current.landmarks);
      if (!calibration.current || !view.tracked) return;
    }
    round.current = new MovementRound(difficulty);
    sessionId.current = crypto.randomUUID();
    finished.current = false;
    interruptions.current = 0;
    wasActive.current = false;
    countdown.current = 3000;
    stable.current = 0;
    setPhase("playing");
  }

  function reset() {
    calibration.current = null;
    countdown.current = 0;
    stable.current = 0;
    round.current = new MovementRound(difficulty);
    setPhase("ready");
  }

  function exportSessions() {
    const url = URL.createObjectURL(
      new Blob(
        [JSON.stringify({ prototype: "reach-flow-v1", sessions }, null, 2)],
        { type: "application/json" },
      ),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "reach-flow-results.json";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  const best = Math.max(
    0,
    ...sessions
      .filter((s) => s.mode === mode && s.difficulty === difficulty)
      .map((s) => s.score),
  );
  const result = sessions.find((s) => s.id === sessionId.current);
  const showTargets = phase === "playing" && view.countdown === 0;

  return (
    <main className={styles.page}>
      <div className={styles.heading}>
        <div>
          <p className={styles.eyebrow}>MOVEMENT LAB / 01</p>
          <h1>Reach &amp; Flow</h1>
          <p>A little movement. A clear head. No sound needed.</p>
        </div>
        <Link to="/minigames">Back to minigames</Link>
      </div>
      <div className={styles.layout}>
        <section className={styles.game} aria-label="Movement arcade">
          <div className={styles.hud}>
            <div>
              <small>TIME LEFT</small>
              <strong>
                {Math.ceil((ROUND_MS - game.elapsed) / 1000)}
                <span>s</span>
              </strong>
            </div>
            <div>
              <small>SCORE</small>
              <strong>{game.score}</strong>
            </div>
            <div>
              <small>BEST / {difficulty.toUpperCase()}</small>
              <strong>{best}</strong>
            </div>
            <button
              disabled={!locked}
              onClick={() =>
                setPhase(phase === "paused" ? "playing" : "paused")
              }
            >
              {phase === "paused" ? "Resume" : "Pause"}
            </button>
          </div>
          <div className={styles.field}>
            <svg
              viewBox="0 0 1000 600"
              role="img"
              aria-label="Reach into the numbered circles. Follow connected circles in order."
              onPointerMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                pointer.current = {
                  x: ((e.clientX - rect.left) / rect.width) * 1000,
                  y: ((e.clientY - rect.top) / rect.height) * 600,
                };
              }}
              onPointerLeave={() => {
                pointer.current = null;
              }}
            >
              <defs>
                <pattern
                  id="flow-grid"
                  width="40"
                  height="40"
                  patternUnits="userSpaceOnUse"
                >
                  <circle cx="20" cy="20" r="1.2" fill="#cfddd9" />
                </pattern>
              </defs>
              <rect width="1000" height="600" fill="url(#flow-grid)" />
              <ellipse
                cx="500"
                cy="310"
                rx="330"
                ry="225"
                fill="none"
                stroke="#c6d8d2"
                strokeDasharray="5 12"
              />
              {showTargets && game.cooldown <= 0 && (
                <g>
                  {game.pattern.length > 1 && (
                    <polyline
                      points={game.pattern
                        .map((p) => `${p.x},${p.y}`)
                        .join(" ")}
                      fill="none"
                      stroke="#a3c1b7"
                      strokeWidth="10"
                      strokeLinecap="round"
                    />
                  )}
                  {game.pattern.map((p, i) => (
                    <g
                      key={`${game.patternIndex}-${i}`}
                      opacity={
                        i < game.checkpoint
                          ? 0.25
                          : i > game.checkpoint
                          ? 0.45
                          : 1
                      }
                    >
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r={rules(difficulty).radius}
                        fill={i === game.checkpoint ? "#087e68" : "#e5efea"}
                        stroke="#087e68"
                        strokeWidth="3"
                      />
                      {i === game.checkpoint && (
                        <circle
                          cx={p.x}
                          cy={p.y}
                          r={rules(difficulty).radius + 9}
                          fill="none"
                          stroke="#e5a83c"
                          strokeWidth="5"
                          strokeDasharray={`${
                            (1 -
                              game.targetElapsed / rules(difficulty).targetMs) *
                            2 *
                            Math.PI *
                            (rules(difficulty).radius + 9)
                          } 1000`}
                          transform={`rotate(-90 ${p.x} ${p.y})`}
                        />
                      )}
                      <text
                        x={p.x}
                        y={p.y + 10}
                        textAnchor="middle"
                        fill={i === game.checkpoint ? "white" : "#087e68"}
                        fontSize="30"
                        fontWeight="600"
                      >
                        {i < game.checkpoint ? "OK" : i + 1}
                      </text>
                    </g>
                  ))}
                </g>
              )}
              {view.hands.map((p, i) => (
                <g key={i} pointerEvents="none">
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r="22"
                    fill={i === 0 ? "#edb64f" : "#ef8598"}
                    fillOpacity=".7"
                    stroke="white"
                    strokeWidth="4"
                  />
                  <circle cx={p.x} cy={p.y} r="4" fill="#193d35" />
                </g>
              ))}
              {showTargets && game.feedbackMs > 0 && (
                <text
                  x="500"
                  y="535"
                  textAnchor="middle"
                  fill="#087e68"
                  fontSize="25"
                >
                  {game.feedback}
                </text>
              )}
            </svg>
            {phase === "ready" && (
              <div className={styles.overlay}>
                <div className={styles.intro}>
                  <span className={styles.pill}>60 SECONDS / SILENT PLAY</span>
                  <h2>Find your flow.</h2>
                  <p>
                    Reach into a circle and settle for a moment. For a trail,
                    sweep through the numbers in order. Either hand works.
                  </p>
                  <button
                    className={styles.primary}
                    onClick={start}
                    disabled={mode === "camera" && !view.tracked}
                  >
                    Start a round
                  </button>
                  <small>
                    {mode === "mouse"
                      ? "Move your mouse into the play area after starting. No clicking needed."
                      : "Stand comfortably, face the camera and bring your hands into view."}
                  </small>
                </div>
              </div>
            )}
            {phase === "playing" && (!view.tracked || view.countdown > 0) && (
              <div className={`${styles.overlay} ${styles.passive}`}>
                <div className={styles.notice}>
                  <h2>
                    {!view.tracked
                      ? mode === "mouse"
                        ? "Move into the play area"
                        : "Bring your hands into view"
                      : view.countdown}
                  </h2>
                  <p>
                    {!view.tracked
                      ? "The timer is paused. Take your time."
                      : "Get comfortable. Follow the circles."}
                  </p>
                </div>
              </div>
            )}
            {phase === "paused" && (
              <div className={styles.overlay}>
                <div className={styles.intro}>
                  <h2>Take a breath.</h2>
                  <p>Your round is paused.</p>
                  <button
                    className={styles.primary}
                    onClick={() => {
                      stable.current = 0;
                      setPhase("playing");
                    }}
                  >
                    Resume
                  </button>
                  <button onClick={reset}>End round</button>
                </div>
              </div>
            )}
            {phase === "done" && (
              <div className={styles.overlay}>
                <div className={styles.intro}>
                  <span className={styles.pill}>BREAK COMPLETE</span>
                  <h2>Nicely moved.</h2>
                  <p>
                    <b>{game.completed}</b> patterns completed ·{" "}
                    <b>{game.bestCombo}</b> best streak
                    <br />
                    {game.missed} patterns passed · {game.score} points
                  </p>
                  <button
                    className={styles.primary}
                    onClick={start}
                    disabled={mode === "camera" && !view.tracked}
                  >
                    Play again
                  </button>
                  <button onClick={reset}>Change settings</button>
                  <p>How did that feel?</p>
                  <div className={styles.ratings}>
                    {[
                      "Enjoyed it",
                      "Too easy",
                      "Too hard",
                      "Tracking felt off",
                    ].map((rating) => (
                      <button
                        key={rating}
                        aria-pressed={result?.rating === rating}
                        onClick={() =>
                          setSessions((old) =>
                            old.map((s) =>
                              s.id === sessionId.current ? { ...s, rating } : s,
                            ),
                          )
                        }
                      >
                        {rating}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className={styles.footer}>
            <span>{mode === "mouse" ? "MOUSE DEMO" : "WEBCAM PLAY"}</span>
            <span>
              {showTargets
                ? game.pattern.length === 1
                  ? "REACH / settle inside the circle"
                  : "SWEEP / follow 1, 2, 3"
                : "Move at your own comfortable range"}
            </span>
            <span>{game.combo} in a row</span>
          </div>
        </section>
        <aside className={styles.settings}>
          <h2>Your setup</h2>
          <label htmlFor="flow-input">Play with</label>
          <select
            id="flow-input"
            value={mode}
            disabled={locked}
            onChange={(e) => {
              setMode(e.target.value as InputMode);
              setPhase("ready");
              calibration.current = null;
              stable.current = 0;
              countdown.current = 0;
              round.current = new MovementRound(difficulty);
            }}
          >
            <option value="camera">Webcam / move your hands</option>
            <option value="mouse">Mouse / test the game</option>
          </select>
          <label htmlFor="flow-difficulty">Challenge</label>
          <select
            id="flow-difficulty"
            value={difficulty}
            disabled={locked}
            onChange={(e) => {
              setDifficulty(e.target.value as Difficulty);
              setPhase("ready");
              round.current = new MovementRound(e.target.value as Difficulty);
            }}
          >
            <option value="gentle">Gentle / larger targets</option>
            <option value="focused">Focused / smaller targets</option>
          </select>
          {mode === "camera" && (
            <>
              {!cameraEnabled ? (
                <button
                  className={styles.primary}
                  onClick={() => setCameraEnabled(true)}
                >
                  Enable webcam
                </button>
              ) : (
                <>
                  <PoseDetWebcam
                    sizeProps={{
                      width: "100%",
                      maxWidth: "250px",
                      height: "auto",
                      borderRadius: "12px",
                    }}
                    styleProps={{}}
                    onPoseResults={receivePose}
                    onCameraError={() => setCameraError(true)}
                  />
                  <SelectWebcam width="100%" />
                </>
              )}
              <p role="status" className={styles.status}>
                {cameraError
                  ? "Camera unavailable. Check browser permissions and your selected camera, or try mouse mode."
                  : view.tracked
                  ? "Tracking ready. The dots follow your hands."
                  : "Waiting for shoulders and at least one hand. Allow camera access and keep your upper body in view."}
              </p>
              <p>
                Stand centered before starting. Reach is scaled to your
                shoulders. To recenter, end the round and start again.
              </p>
            </>
          )}
          <div className={styles.note}>
            <b>A movement experiment</b>
            <p>
              No music, jumps or equipment. You can pause at any time. Stop if a
              movement feels uncomfortable.
            </p>
          </div>
          <p className={styles.small}>
            Finished rounds and feedback stay in this browser. Webcam and mouse
            scores are kept separate. No video is saved by this prototype.
          </p>
          <button onClick={exportSessions} disabled={!sessions.length}>
            Export results ({sessions.length})
          </button>
          {saveFailed && (
            <p role="status">
              Browser storage is unavailable. Export results before leaving.
            </p>
          )}
        </aside>
      </div>
    </main>
  );
}
