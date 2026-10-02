import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { SelectWebcam } from "../Webcam/SelectWebcam";
import {
  ArenaCalibration,
  calibrationHint,
} from "../../games/arena/calibration";
import { poseReady, type PosePoint } from "../../games/arena/movement";
import {
  BodyCircuit,
  frameBody,
  instructions,
  type CircuitMode,
  type Presentation,
  type Point,
} from "../../games/body-arena/circuit";
import { renderCircuit } from "../../games/body-arena/render";
import CameraStage, { type CameraFrame } from "./CameraStage";
import styles from "./BodyArena.module.css";

type Phase = "setup" | "calibrate" | "running" | "paused" | "done";
type Trial = {
  id: string;
  presentation: Presentation;
  mode: CircuitMode;
  input: "camera" | "demo";
  seconds: number;
  plannedSeconds: number;
  strikes: number;
  weaves: number;
  reaches: number;
  heldSeconds: number;
  score: number;
  outcome: "complete" | "ended-early";
  effort?: string;
  replay?: string;
};
const KEY = "mgl-body-arena-trials-v1";
function readTrials(): Trial[] {
  try {
    const data = JSON.parse(localStorage.getItem(KEY) || "[]");
    return Array.isArray(data)
      ? data
          .filter(
            (x) => x && typeof x.id === "string" && typeof x.score === "number",
          )
          .slice(-50)
      : [];
  } catch {
    return [];
  }
}
function demoPose(
  pointer: Point | null,
  circuit: BodyCircuit | null,
): PosePoint[] {
  const p = Array.from({ length: 17 }, () => ({
    x: 0.5,
    y: 0.55,
    visibility: 0,
  }));
  p[0] = { x: 0.5, y: 0.25, visibility: 1 };
  p[11] = { x: 0.36, y: 0.45, visibility: 1 };
  p[12] = { x: 0.64, y: 0.45, visibility: 1 };
  p[13] = { x: 0.31, y: 0.58, visibility: 1 };
  p[14] = { x: 0.69, y: 0.58, visibility: 1 };
  p[15] = { x: 0.43, y: 0.62, visibility: 1 };
  p[16] = { x: 0.57, y: 0.62, visibility: 1 };
  if (pointer && circuit) {
    if (circuit.exercise === "weave") {
      const shift = pointer.x - 0.5;
      p.forEach((point) => {
        point.x += shift;
      });
      p[0].y = pointer.y;
    } else p[circuit.wrist] = { ...pointer, visibility: 1 };
  }
  return p;
}
const initialHud = {
  remaining: 90000,
  block: 20000,
  title: "Your movement is the game.",
  detail: "No extra webcam panel. No music required.",
  reps: 0,
  score: 0,
  hint: "Enable the camera or explore the pointer demo.",
  stalled: false,
};

export default function BodyArena({
  presentation,
}: {
  presentation: Presentation;
}) {
  const [phase, setPhase] = useState<Phase>("setup");
  const [enabled, setEnabled] = useState(false);
  const [demo, setDemo] = useState(false);
  const [mode, setMode] = useState<CircuitMode>("pulse");
  const [duration, setDuration] = useState(90000);
  const [error, setError] = useState("");
  const [hud, setHud] = useState(initialHud);
  const [trials, setTrials] = useState<Trial[]>(readTrials);
  const [result, setResult] = useState<Trial | null>(null);
  const [storageError, setStorageError] = useState(false);
  const runtime = useRef({
    phase: "setup" as Phase,
    circuit: null as BodyCircuit | null,
    calibration: new ArenaCalibration(),
    pointer: null as Point | null,
    lastHud: 0,
  }).current;
  const title = presentation === "mirror" ? "Mirror Arena" : "Dark Arena";
  const locked =
    phase === "calibrate" || phase === "running" || phase === "paused";
  function transition(next: Phase) {
    runtime.phase = next;
    setPhase(next);
  }
  function finish(outcome: Trial["outcome"]) {
    const c = runtime.circuit;
    if (!c || runtime.phase === "done") return;
    c.suspend();
    transition("done");
    const row: Trial = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      presentation,
      mode,
      input: demo ? "demo" : "camera",
      seconds: Math.round(c.elapsed / 1000),
      plannedSeconds: duration / 1000,
      strikes: c.strikes,
      weaves: c.weaves,
      reaches: c.reaches,
      heldSeconds: Math.round(c.heldMs / 1000),
      score: c.score,
      outcome,
    };
    setResult(row);
    setTrials((old) => [...old, row].slice(-50));
  }
  function start() {
    runtime.calibration.reset();
    runtime.circuit = null;
    runtime.pointer = null;
    setResult(null);
    transition("calibrate");
    (document.activeElement as HTMLElement)?.blur();
  }
  function pause() {
    runtime.circuit?.suspend();
    transition("paused");
  }
  useEffect(() => {
    const stop = () => {
      if (runtime.phase === "running") {
        runtime.circuit?.suspend();
        runtime.phase = "paused";
        setPhase("paused");
      }
      if (runtime.phase === "calibrate") {
        runtime.calibration.reset();
        runtime.phase = "setup";
        setPhase("setup");
      }
    };
    const hide = () => {
      if (document.hidden) stop();
    };
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") stop();
    };
    document.addEventListener("visibilitychange", hide);
    window.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("visibilitychange", hide);
      window.removeEventListener("keydown", key);
      runtime.circuit?.suspend();
    };
  }, [runtime]);
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(trials));
      setStorageError(false);
    } catch {
      setStorageError(true);
    }
  }, [trials]);
  function frame({
    ctx,
    video,
    points: input,
    receivedAt,
    now,
    delta,
  }: CameraFrame) {
    const points = demo ? demoPose(runtime.pointer, runtime.circuit) : input;
    const timestamp = demo ? now : receivedAt;
    const fresh =
      timestamp !== null &&
      now - timestamp < 500 &&
      poseReady(points) &&
      !error;
    let hint = demo
      ? "Pointer demo: move onto the ring. This is not a workout record."
      : !enabled
      ? "Enable the camera or explore the pointer demo."
      : calibrationHint(points, timestamp, now) ||
        "Upper body ready. Your legs can stay outside the frame.";
    if (runtime.phase === "calibrate" && !document.hidden) {
      const check = runtime.calibration.update(points, timestamp, now);
      hint = check.hint;
      const framing =
        check.baseline &&
        frameBody(points, ctx.canvas.width / ctx.canvas.height);
      if (framing && !error) {
        runtime.circuit = new BodyCircuit(framing, mode, duration);
        transition("running");
      }
    }
    const c = runtime.circuit;
    if (c && runtime.phase === "running") {
      c.tick(delta, points, fresh && !document.hidden);
      if (c.done) finish("complete");
      if (!fresh)
        hint =
          "Tracking paused. Bring your face and shoulders into view. Time and targets are frozen.";
      else if (!demo)
        hint =
          c.exercise === "weave"
            ? "Move your shoulders too, not just your head."
            : c.exercise === "recover"
            ? "Relax your arms. No movements needed."
            : "Keep the active hand visible. Return it toward your chest between repetitions.";
    }
    renderCircuit(ctx, video, points, c, presentation, fresh, demo);
    if (now - runtime.lastHud > 80) {
      runtime.lastHud = now;
      const instruction = c ? instructions[c.exercise] : null;
      setHud({
        remaining: c?.remaining ?? duration,
        block: c?.blockRemaining ?? 20000,
        title: instruction?.title ?? initialHud.title,
        detail: instruction?.detail ?? initialHud.detail,
        reps: c?.reps ?? 0,
        score: c?.score ?? 0,
        hint: error || hint,
        stalled: runtime.phase === "running" && !fresh,
      });
    }
  }
  function feedback(field: "effort" | "replay", value: string) {
    if (!result) return;
    setResult({ ...result, [field]: value });
    setTrials((old) =>
      old.map((row) =>
        row.id === result.id ? { ...row, [field]: value } : row,
      ),
    );
  }
  function exportTrials() {
    const url = URL.createObjectURL(
      new Blob([JSON.stringify({ version: 1, trials }, null, 2)], {
        type: "application/json",
      }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "body-arena-trials.json";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return (
    <main className={styles.page} data-presentation={presentation}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>
            MOVEMENT PROTOTYPES / {presentation === "mirror" ? "02" : "03"}
          </p>
          <h1>{title}</h1>
          <p>
            {presentation === "mirror"
              ? "You, inside the game. Turn your camera into a movement space."
              : "Leave the room behind. Move as light inside the game."}
          </p>
        </div>
        <nav aria-label="Compare prototypes">
          <Link to="/arena">Original Arena</Link>
          <Link
            to="/mirror_arena"
            aria-current={presentation === "mirror" ? "page" : undefined}
          >
            Mirror
          </Link>
          <Link
            to="/dark_arena"
            aria-current={presentation === "dark" ? "page" : undefined}
          >
            Dark
          </Link>
        </nav>
      </header>
      <div className={styles.layout}>
        <section className={styles.game} aria-label={title}>
          <div className={styles.hud}>
            <span>
              <small>TIME LEFT</small>
              <b>
                {Math.floor(Math.ceil(hud.remaining / 1000) / 60)}:
                {String(Math.ceil(hud.remaining / 1000) % 60).padStart(2, "0")}
              </b>
            </span>
            <span>
              <small>REPETITIONS</small>
              <b>{hud.reps}</b>
            </span>
            <span>
              <small>POINTS</small>
              <b>{hud.score}</b>
            </span>
            <span className={styles.badge}>
              {demo ? "POINTER DEMO" : "UPPER BODY ONLY"}
            </span>
            {phase === "running" && <button onClick={pause}>Pause</button>}
          </div>
          <div className={styles.stage}>
            <CameraStage
              enabled={enabled && !demo}
              onFrame={frame}
              onError={(message) => {
                setError(message);
                runtime.circuit?.suspend();
                if (runtime.phase === "running") pause();
                if (runtime.phase === "calibrate") transition("setup");
              }}
              onPointer={(x, y) => {
                if (demo) runtime.pointer = { x, y };
              }}
            />
            {(phase === "running" || phase === "paused") && (
              <div className={styles.cue}>
                <span>{Math.ceil(hud.block / 1000)}s IN THIS BLOCK</span>
                <h2>{hud.title}</h2>
                <p>{hud.detail}</p>
              </div>
            )}
            {(phase === "setup" || phase === "calibrate") && (
              <div className={styles.overlay}>
                <div className={styles.panel}>
                  <p className={styles.eyebrow}>
                    {mode === "pulse" ? "CONTINUOUS MOVEMENT" : "SLOW REACHES"}
                  </p>
                  <h2>
                    {phase === "calibrate"
                      ? "Find your neutral position."
                      : "Less waiting. More moving."}
                  </h2>
                  <p>
                    {phase === "calibrate"
                      ? hud.hint
                      : "20-second movement blocks. Six-second resets. Targets sized to your upper body, not your room."}
                  </p>
                  {phase === "setup" ? (
                    <button
                      className={styles.primary}
                      disabled={(!enabled && !demo) || !!error}
                      onClick={start}
                    >
                      Start {duration === 90000 ? "90-second" : "3-minute"}{" "}
                      circuit
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        runtime.calibration.reset();
                        transition("setup");
                      }}
                    >
                      Cancel countdown
                    </button>
                  )}
                  <p className={styles.fine}>
                    {demo
                      ? "Move your pointer to control the glowing body."
                      : "Sit or stand comfortably. No full-body framing or music needed."}
                  </p>
                </div>
              </div>
            )}
            {(phase === "paused" || hud.stalled) && phase !== "done" && (
              <div className={styles.overlay}>
                <div className={styles.panel}>
                  <h2>
                    {phase === "paused" ? "Take your time." : "Tracking paused"}
                  </h2>
                  <p>
                    {phase === "paused"
                      ? "The timer is frozen. Resume when ready."
                      : hud.hint}
                  </p>
                  {phase === "paused" && !error && (
                    <button
                      className={styles.primary}
                      onClick={() => transition("running")}
                    >
                      Resume
                    </button>
                  )}
                  <button onClick={() => finish("ended-early")}>
                    End circuit
                  </button>
                </div>
              </div>
            )}
            {phase === "done" && result && (
              <div className={styles.overlay}>
                <div className={styles.panel}>
                  <p className={styles.eyebrow}>
                    {result.outcome === "complete"
                      ? "CIRCUIT COMPLETE"
                      : "CIRCUIT SAVED"}
                  </p>
                  <h2>{result.score} points</h2>
                  <p>
                    {result.seconds}s played · {result.strikes} strikes ·{" "}
                    {result.weaves} weaves · {result.reaches} held reaches
                  </p>
                  <p>
                    {result.heldSeconds}s of detected reach holds.{" "}
                    {result.input === "demo"
                      ? "Pointer demo, not a workout."
                      : "Movement counts, not a fitness assessment."}
                  </p>
                  <button className={styles.primary} onClick={start}>
                    Play again
                  </button>
                  <button
                    onClick={() => {
                      runtime.circuit = null;
                      transition("setup");
                    }}
                  >
                    Setup
                  </button>
                  <fieldset>
                    <legend>How did the movement feel?</legend>
                    {["Too light", "About right", "Too much"].map((value) => (
                      <button
                        key={value}
                        aria-pressed={result.effort === value}
                        onClick={() => feedback("effort", value)}
                      >
                        {value}
                      </button>
                    ))}
                  </fieldset>
                  <fieldset>
                    <legend>Another round?</legend>
                    {["Yes", "Maybe", "No"].map((value) => (
                      <button
                        key={value}
                        aria-pressed={result.replay === value}
                        onClick={() => feedback("replay", value)}
                      >
                        {value}
                      </button>
                    ))}
                  </fieldset>
                </div>
              </div>
            )}
          </div>
          <p role="status" className={styles.status}>
            {phase === "done"
              ? "Results saved locally. Compare the other presentation with the same circuit."
              : hud.hint}
          </p>
        </section>
        <aside className={styles.settings}>
          <h2>Make it your pace.</h2>
          <label htmlFor="body-mode">Movement circuit</label>
          <select
            id="body-mode"
            value={mode}
            disabled={locked}
            onChange={(e) => {
              setMode(e.target.value as CircuitMode);
              runtime.circuit = null;
              transition("setup");
            }}
          >
            <option value="pulse">Pulse · repeated movement</option>
            <option value="reach">Reach · slow holds</option>
          </select>
          <label htmlFor="body-duration">Session length</label>
          <select
            id="body-duration"
            value={duration}
            disabled={locked}
            onChange={(e) => {
              setDuration(Number(e.target.value));
              runtime.circuit = null;
              transition("setup");
            }}
          >
            <option value={90000}>90-second comparison</option>
            <option value={180000}>3 minutes</option>
          </select>
          {!locked && (
            <>
              <button
                className={styles.primary}
                onClick={() => {
                  setError("");
                  setDemo(false);
                  setEnabled((value) => demo || !value);
                  runtime.circuit = null;
                  transition("setup");
                }}
              >
                {enabled && !demo ? "Turn camera off" : "Enable camera"}
              </button>
              <button
                onClick={() => {
                  setEnabled(false);
                  setDemo(true);
                  setError("");
                  runtime.circuit = null;
                  transition("setup");
                }}
              >
                Try pointer demo
              </button>
            </>
          )}
          {enabled && !demo && !locked && <SelectWebcam width="100%" />}
          {error && (
            <p role="alert">{error} Turn the camera off and on to retry.</p>
          )}
          <div className={styles.notes}>
            <h3>Move, don't wait.</h3>
            <p>
              <b>Pulse</b> repeats alternating strikes and side-to-side weaves.
              Targets wait for you, not a beat.
            </p>
            <p>
              <b>Reach</b> asks for gentle two-second holds and a return to
              center. Use a comfortable range, not maximum extension.
            </p>
          </div>
          <p className={styles.fine}>
            Only head, shoulders and active hands need to be in view. Make room
            for your arms; stop if uncomfortable. Escape pauses.
          </p>
          <p className={styles.fine}>
            Dark mode hides the camera image, but still uses the camera for
            tracking. No video is recorded or uploaded by this prototype.
            Results stay in this browser.
          </p>
          <button disabled={!trials.length} onClick={exportTrials}>
            Export comparison results ({trials.length})
          </button>
          {storageError && (
            <p role="alert">
              Local storage unavailable. Export results before leaving.
            </p>
          )}
          <Link to="/minigames">All minigames</Link>
        </aside>
      </div>
    </main>
  );
}
