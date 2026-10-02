import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import type { Results } from "@mediapipe/pose";
import PhaserGame from "../Play/PhaserGame";
import PoseDetWebcam from "../Webcam/PoseDetWebcam";
import { SelectWebcam } from "../Webcam/SelectWebcam";
import { arenaConfig, ArenaBridge } from "../../games/arena/ArenaScene";
import { ArenaSession } from "../../games/arena/session";
import {
  MovementBus,
  PoseMovementProvider,
  poseReady,
  connectKeyboard,
} from "../../games/arena/movement";
import type { PosePoint } from "../../games/arena/movement";
import {
  ArenaCalibration,
  calibrationHint,
} from "../../games/arena/calibration";
import styles from "./Arena.module.css";

type Phase = "setup" | "playing" | "done";
type RecordRow = {
  at: string;
  mode: string;
  plannedMinutes: number;
  playedSeconds: number;
  score: number;
  success: number;
  failed: number;
  bestCombo: number;
  defeated: number;
  movements: ArenaSession["movements"];
  blocks: number;
  outcome: string;
  rating?: string;
};
const STORAGE = "mgl-arena-prototype-v1";
function history(): RecordRow[] {
  try {
    const rows = JSON.parse(localStorage.getItem(STORAGE) || "[]");
    return Array.isArray(rows)
      ? rows
          .filter(
            (r) => r && typeof r.at === "string" && Number.isFinite(r.score),
          )
          .slice(-50)
      : [];
  } catch {
    return [];
  }
}

export default function Arena() {
  const [phase, setPhase] = useState<Phase>("setup");
  const [mode, setMode] = useState("camera");
  const [minutes, setMinutes] = useState(3);
  const [camera, setCamera] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  const [tracked, setTracked] = useState(false);
  const [startRequested, setStartRequested] = useState(false);
  const [setupHint, setSetupHint] = useState(
    "Enable the webcam, then click Start. Keep your head and shoulders in view.",
  );
  const [paused, setPaused] = useState(false);
  const [snapshot, setSnapshot] = useState({
    remaining: 180000,
    score: 0,
    health: 100,
    enemy: 100,
    combo: 0,
    level: 0,
    defeated: 0,
  });
  const [rows, setRows] = useState<RecordRow[]>(history);
  const [result, setResult] = useState<RecordRow | null>(null);
  const [storageError, setStorageError] = useState(false);
  const [lastMove, setLastMove] = useState(
    "Sit or stand centered, arms relaxed.",
  );
  const bus = useRef(new MovementBus()).current;
  const latest = useRef({
    points: [] as PosePoint[],
    at: null as number | null,
  });
  const calibration = useRef(new ArenaCalibration()).current;
  const provider = useRef<PoseMovementProvider | null>(null);
  const stableSince = useRef(0);
  const bridge = useRef<ArenaBridge>({
    session: null,
    playable: false,
    onFrame: () => undefined,
  }).current;
  const config = useMemo(() => arenaConfig(bridge), [bridge]);
  const finished = useRef(false);

  function finish(outcome: string) {
    const s = bridge.session;
    if (!s || finished.current) return;
    finished.current = true;
    bridge.playable = false;
    s.clearInput();
    provider.current?.reset();
    const record: RecordRow = {
      at: new Date().toISOString(),
      mode,
      plannedMinutes: minutes,
      playedSeconds: Math.round(s.elapsed / 1000),
      score: s.score,
      success: s.success,
      failed: s.failed,
      bestCombo: s.bestCombo,
      defeated: s.defeated,
      movements: { ...s.movements },
      blocks: s.blockCount,
      outcome,
    };
    setResult(record);
    setRows((old) => [...old, record].slice(-50));
    setPhase("done");
  }
  bridge.onFrame = (s) => {
    setSnapshot({
      remaining: s.remaining,
      score: s.score,
      health: s.health,
      enemy: s.enemyHealth,
      combo: s.combo,
      level: s.director.level,
      defeated: s.defeated,
    });
    if (s.done) finish(s.health <= 0 ? "defeated" : "complete");
  };

  useEffect(
    () =>
      bus.subscribe((event) => {
        if (event.active)
          setLastMove(event.action.toLowerCase().replaceAll("_", " "));
        bridge.session?.movement(event);
      }),
    [bus, bridge],
  );

  useEffect(() => {
    if (mode === "keyboard" && phase === "playing") return connectKeyboard(bus);
  }, [mode, phase, bus]);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = performance.now();
      const visible =
        latest.current.at !== null &&
        now - latest.current.at < 500 &&
        poseReady(latest.current.points);
      if (!visible) stableSince.current = 0;
      else if (!stableSince.current) stableSince.current = now;
      const ready = visible && now - stableSince.current > 700;
      setTracked(ready);
      if (!startRequested) {
        setSetupHint(
          !camera
            ? "Enable the webcam, then click Start. Keep your head and shoulders in view."
            : calibrationHint(latest.current.points, latest.current.at, now) ||
                "Upper body visible. Click Start, then hold still with arms relaxed.",
        );
      }
      bridge.playable =
        phase === "playing" &&
        !paused &&
        !document.hidden &&
        (mode === "keyboard" || ready);
      if (!bridge.playable) provider.current?.reset();
    }, 100);
    return () => {
      clearInterval(timer);
      bridge.playable = false;
      provider.current?.reset();
    };
  }, [phase, mode, paused, bridge, camera, startRequested]);

  useEffect(() => {
    const hide = () => {
      if (document.hidden) {
        bridge.playable = false;
        setPaused(true);
        setStartRequested(false);
        calibration.reset();
      }
    };
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        bridge.playable = false;
        setPaused(true);
        setStartRequested(false);
        calibration.reset();
      }
    };
    document.addEventListener("visibilitychange", hide);
    window.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("visibilitychange", hide);
      window.removeEventListener("keydown", key);
    };
  }, [bridge, calibration]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE, JSON.stringify(rows));
      setStorageError(false);
    } catch {
      setStorageError(true);
    }
  }, [rows]);

  function onPose(results: Results) {
    if (cameraError) setCameraError(false);
    const points = results.poseLandmarks || [];
    latest.current = { points, at: performance.now() };
    if (bridge.playable && mode === "camera")
      provider.current?.update(points, performance.now());
    if (!poseReady(points)) {
      bridge.playable = false;
      provider.current?.reset();
    }
  }
  const beginSession = useCallback(() => {
    finished.current = false;
    bridge.session = new ArenaSession(minutes * 60000);
    bridge.playable = false;
    setSnapshot({
      remaining: minutes * 60000,
      score: 0,
      health: 100,
      enemy: 100,
      combo: 0,
      level: 0,
      defeated: 0,
    });
    setPaused(false);
    setResult(null);
    setStartRequested(false);
    setPhase("playing");
    (document.activeElement as HTMLElement)?.blur();
  }, [bridge, minutes]);

  function start() {
    if (mode === "keyboard") {
      beginSession();
      return;
    }
    if (!camera || cameraError) return;
    calibration.reset();
    setSetupHint(
      "Sit or stand comfortably with your head and shoulders in view. The session starts automatically when you hold still.",
    );
    setStartRequested(true);
  }

  useEffect(() => {
    if (!startRequested || mode !== "camera" || cameraError) return;
    const timer = setInterval(() => {
      if (document.hidden) {
        calibration.reset();
        return;
      }
      const state = calibration.update(
        latest.current.points,
        latest.current.at,
        performance.now(),
      );
      setSetupHint(state.hint);
      if (state.baseline) {
        clearInterval(timer);
        provider.current = new PoseMovementProvider(bus, state.baseline);
        beginSession();
      }
    }, 100);
    return () => clearInterval(timer);
  }, [startRequested, mode, cameraError, calibration, bus, beginSession]);
  function exportResults() {
    const url = URL.createObjectURL(
      new Blob(
        [JSON.stringify({ prototype: "arena-v1", sessions: rows }, null, 2)],
        { type: "application/json" },
      ),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "metagymland-arena-results.json";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  function rate(rating: string) {
    if (!result) return;
    setResult({ ...result, rating });
    setRows((old) =>
      old.map((r) => (r.at === result.at ? { ...r, rating } : r)),
    );
  }
  const seconds = Math.ceil(snapshot.remaining / 1000);
  const totalMoves = result
    ? Object.values(result.movements).reduce((a, b) => a + b, 0)
    : 0;
  return (
    <main className={styles.page}>
      <header className={styles.heading}>
        <div>
          <span>METAGYMLAND / PLAYABLE PROTOTYPE</span>
          <h1>Arena</h1>
          <p>Read the attack. Move to survive. Strike back.</p>
        </div>
        <Link to="/minigames">All minigames</Link>
      </header>
      <div className={styles.layout}>
        <section className={styles.game} aria-label="Arena game">
          <div className={styles.hud} aria-live="off">
            <div>
              <small>REMAINING</small>
              <b>
                {Math.floor(seconds / 60)}:
                {String(seconds % 60).padStart(2, "0")}
              </b>
            </div>
            <div>
              <small>SCORE</small>
              <b>{snapshot.score}</b>
            </div>
            <div>
              <small>YOUR HEALTH</small>
              <b>{snapshot.health}</b>
            </div>
            <div>
              <small>ENEMY HEALTH</small>
              <b>{snapshot.enemy}</b>
            </div>
            <div>
              <small>COMBO</small>
              <b>x{Math.max(1, Math.min(snapshot.combo, 5))}</b>
            </div>
            {phase === "playing" && (
              <button
                onClick={() => {
                  bridge.playable = false;
                  setPaused(!paused);
                  (document.activeElement as HTMLElement)?.blur();
                }}
              >
                {" "}
                {paused ? "Resume" : "Pause"}
              </button>
            )}
          </div>
          <div className={styles.stage}>
            <PhaserGame
              config={config}
              id="arena-phaser"
              className={styles.canvas}
            >
              {null}
            </PhaserGame>
            {(phase === "setup" || startRequested) && (
              <div className={styles.overlay}>
                <div className={styles.panel}>
                  <span className={styles.kicker}>ENTER THE ARENA</span>
                  <h2>Outsmart the sentinel.</h2>
                  <p>
                    Duck under high shots. Dodge glowing lanes. Raise your
                    shield for charged blasts. When its core opens, alternate
                    your punches.
                  </p>
                  <p className={styles.muted}>
                    Return to a relaxed stance between actions. Music is not
                    required.
                  </p>
                  <button
                    className={styles.primary}
                    disabled={mode === "camera" && (!camera || cameraError)}
                    onClick={
                      startRequested
                        ? () => {
                            setStartRequested(false);
                            calibration.reset();
                          }
                        : start
                    }
                  >
                    {startRequested
                      ? "Cancel countdown"
                      : `Start ${minutes}-minute session`}
                  </button>
                  <p role="status">
                    {mode === "camera"
                      ? cameraError
                        ? "Camera unavailable. Check browser permission and the selected device."
                        : setupHint
                      : "Keyboard test mode. Controls are shown on the right."}
                  </p>
                </div>
              </div>
            )}
            {phase === "playing" &&
              (paused || (mode === "camera" && !tracked)) && (
                <div className={styles.overlay}>
                  <div className={styles.panel}>
                    <h2>{paused ? "Catch your breath." : "Tracking paused"}</h2>
                    <p>
                      {paused
                        ? "Time, attacks and health are frozen."
                        : "Bring your head and shoulders into view. The battle resumes when tracking is stable; your legs do not need to be visible."}
                    </p>
                    {paused && (
                      <button
                        className={styles.primary}
                        onClick={() => {
                          setPaused(false);
                          (document.activeElement as HTMLElement)?.blur();
                        }}
                      >
                        Resume
                      </button>
                    )}
                    <button onClick={() => finish("ended-early")}>
                      End session
                    </button>
                  </div>
                </div>
              )}
            {phase === "done" && result && !startRequested && (
              <div className={styles.overlay}>
                <div className={`${styles.panel} ${styles.summary}`}>
                  <span className={styles.kicker}>
                    {result.outcome === "complete"
                      ? "ARENA COMPLETE"
                      : result.outcome === "defeated"
                      ? "THE SENTINEL WINS THIS ROUND"
                      : "SESSION SAVED"}
                  </span>
                  <h2>{result.score.toLocaleString()} points</h2>
                  <p>
                    {Math.floor(result.playedSeconds / 60)}:
                    {String(result.playedSeconds % 60).padStart(2, "0")} played
                    · {result.defeated} sentinels defeated · best combo{" "}
                    {result.bestCombo}
                  </p>
                  <div className={styles.stats}>
                    <span>
                      <b>{result.movements.SQUAT}</b> ducks
                    </span>
                    <span>
                      <b>
                        {result.movements.LEAN_LEFT +
                          result.movements.LEAN_RIGHT}
                      </b>{" "}
                      dodges
                    </span>
                    <span>
                      <b>
                        {result.movements.PUNCH_LEFT +
                          result.movements.PUNCH_RIGHT}
                      </b>{" "}
                      punches
                    </span>
                    <span>
                      <b>{result.blocks}</b> blocks
                    </span>
                  </div>
                  <p className={styles.muted}>
                    {totalMoves} detected actions · {result.success} encounters
                    won · {result.failed} missed.{" "}
                    {result.mode === "keyboard"
                      ? "Keyboard test, not a workout record."
                      : "Prototype movement counts, not a form assessment."}
                  </p>
                  <div className={styles.buttons}>
                    <button
                      className={styles.primary}
                      onClick={start}
                      disabled={mode === "camera" && (!camera || cameraError)}
                    >
                      Play again
                    </button>
                    <button
                      onClick={() => {
                        bridge.session = null;
                        setPhase("setup");
                      }}
                    >
                      Setup
                    </button>
                  </div>
                  <p>Would you play another round?</p>
                  <div className={styles.ratings}>
                    {["Yes", "Maybe", "No", "Tracking got in the way"].map(
                      (r) => (
                        <button
                          key={r}
                          aria-pressed={result.rating === r}
                          onClick={() => rate(r)}
                        >
                          {r}
                        </button>
                      ),
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className={styles.status}>
            <span>
              {mode === "keyboard" ? "KEYBOARD TEST" : "BODY CONTROL"}
            </span>
            <span>
              Pace {snapshot.level + 1}/4 · {snapshot.defeated} defeated
            </span>
            <span>{lastMove}</span>
          </div>
        </section>
        <aside className={styles.settings}>
          <h2>Prepare to play</h2>
          <label htmlFor="arena-duration">Session length</label>
          <select
            id="arena-duration"
            disabled={phase === "playing" || startRequested}
            value={minutes}
            onChange={(e) => {
              setMinutes(Number(e.target.value));
              setSnapshot((s) => ({
                ...s,
                remaining: Number(e.target.value) * 60000,
              }));
            }}
          >
            {[3, 5, 10].map((n) => (
              <option key={n} value={n}>
                {n} minutes
              </option>
            ))}
          </select>
          {import.meta.env.DEV && (
            <>
              <label htmlFor="arena-input">Input</label>
              <select
                id="arena-input"
                disabled={phase === "playing" || startRequested}
                value={mode}
                onChange={(e) => {
                  provider.current?.reset();
                  provider.current = null;
                  bridge.session = null;
                  latest.current = { points: [], at: null };
                  calibration.reset();
                  setMode(e.target.value);
                  setPhase("setup");
                }}
              >
                {["camera", "keyboard"].map((m) => (
                  <option key={m} value={m}>
                    {m === "camera" ? "Webcam" : "Keyboard (development only)"}
                  </option>
                ))}
              </select>
            </>
          )}
          {mode === "camera" && (
            <>
              {!camera ? (
                <button
                  className={styles.primary}
                  onClick={() => {
                    setCameraError(false);
                    setCamera(true);
                  }}
                >
                  Enable webcam
                </button>
              ) : (
                <>
                  <PoseDetWebcam
                    sizeProps={{
                      width: "100%",
                      height: "auto",
                      borderRadius: "12px",
                    }}
                    styleProps={{}}
                    onPoseResults={onPose}
                    onCameraError={() => {
                      setCameraError(true);
                      setStartRequested(false);
                      calibration.reset();
                    }}
                  />
                  <SelectWebcam width="100%" />
                </>
              )}
              <p role="status">
                {cameraError
                  ? "Camera unavailable. Check browser permission and the selected device."
                  : phase === "playing" && tracked
                  ? "Tracking ready."
                  : setupHint}
              </p>
            </>
          )}
          <div className={styles.controls}>
            <h3>{mode === "camera" ? "Your moves" : "Test controls"}</h3>
            <p>
              <b>{mode === "camera" ? "Duck" : "S (hold)"}</b> Avoid the high
              shot
            </p>
            <p>
              <b>
                {mode === "camera" ? "Lean left / right" : "Arrow keys (hold)"}
              </b>{" "}
              Leave the glowing lane
            </p>
            <p>
              <b>
                {mode === "camera" ? "Hands above shoulders" : "Space (hold)"}
              </b>{" "}
              Block the charged blast
            </p>
            <p>
              <b>
                {mode === "camera"
                  ? "Alternate side punches"
                  : "A / D (alternate taps)"}
              </b>{" "}
              Hit the exposed core
            </p>
          </div>
          <p>
            Play close to the computer, sitting or standing. Dip your head and
            shoulders to duck; no squat is required. Use short sideways punches
            at shoulder height, then retract. Keep hands and elbows in view for
            punches, and both hands in view for shielding. Leave clear space for
            comfortable arm movements.
          </p>
          <p>
            Stop if uncomfortable. Pause anytime with Escape. Tracking loss
            pauses the battle without a penalty.
          </p>
          <p className={styles.muted}>
            Results and feedback stay in this browser. No video is recorded by
            Arena. Camera and keyboard records are labeled separately.
          </p>
          <button disabled={!rows.length} onClick={exportResults}>
            Export results ({rows.length})
          </button>
          {storageError && <p>Storage unavailable. Export before leaving.</p>}
        </aside>
      </div>
    </main>
  );
}
