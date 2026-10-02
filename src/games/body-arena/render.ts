import { landmarksVisible, type PosePoint } from "../arena/movement";
import { BodyCircuit, type Presentation } from "./circuit";

export function renderCircuit(
  ctx: CanvasRenderingContext2D,
  video: HTMLVideoElement | null,
  points: PosePoint[],
  circuit: BodyCircuit | null,
  presentation: Presentation,
  fresh: boolean,
  demo: boolean,
) {
  const w = ctx.canvas.width,
    h = ctx.canvas.height;
  ctx.clearRect(0, 0, w, h);
  const bg = ctx.createLinearGradient(0, 0, w, h);
  bg.addColorStop(0, "#071d29");
  bg.addColorStop(1, "#133d40");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);
  if (presentation === "mirror" && video && video.readyState >= 2 && !demo) {
    // MediaPipe is configured in selfie mode; mirror the raw video to match its landmarks.
    ctx.save();
    ctx.translate(w, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, w, h);
    ctx.restore();
    ctx.fillStyle = "#071d2945";
    ctx.fillRect(0, 0, w, h);
  } else {
    ctx.strokeStyle = "#7df9d411";
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += w / 12) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += h / 9) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
  }
  if (fresh) {
    ctx.save();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.shadowColor = "#65ffe0";
    ctx.shadowBlur = presentation === "dark" || demo ? 18 : 4;
    for (const [a, b] of [
      [11, 12],
      [11, 13],
      [13, 15],
      [12, 14],
      [14, 16],
    ]) {
      if (!landmarksVisible(points, [a, b])) continue;
      ctx.beginPath();
      ctx.strokeStyle = "#6ef7de";
      ctx.lineWidth = Math.max(4, h * 0.012);
      ctx.moveTo(points[a].x * w, points[a].y * h);
      ctx.lineTo(points[b].x * w, points[b].y * h);
      ctx.stroke();
    }
    if (landmarksVisible(points, [0, 11, 12])) {
      const nose = points[0],
        radius = Math.abs(points[11].x - points[12].x) * w * 0.18;
      ctx.beginPath();
      ctx.arc(nose.x * w, nose.y * h, radius, 0, Math.PI * 2);
      ctx.strokeStyle = "#bcfff0";
      ctx.lineWidth = 3;
      ctx.stroke();
    }
    for (const i of [15, 16])
      if (landmarksVisible(points, [i])) {
        ctx.beginPath();
        ctx.arc(points[i].x * w, points[i].y * h, h * 0.018, 0, Math.PI * 2);
        ctx.fillStyle = "#fff0bc";
        ctx.fill();
      }
    ctx.restore();
  }
  if (!circuit || circuit.done) return;
  const exercise = circuit.exercise;
  if (exercise === "recover") {
    ctx.save();
    ctx.strokeStyle = "#bfffe170";
    ctx.lineWidth = 3;
    const r = h * (0.12 + 0.015 * Math.sin(circuit.elapsed / 700));
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
    return;
  }
  const target = circuit.target,
    x = target.x * w,
    y = target.y * h,
    r = circuit.radius * h;
  ctx.save();
  ctx.shadowColor = "#ffc870";
  ctx.shadowBlur = 24;
  ctx.fillStyle = "#ffb44c24";
  ctx.strokeStyle = "#ffcf87";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  if (circuit.holdProgress > 0) {
    ctx.strokeStyle = "#73ffe3";
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.arc(
      x,
      y,
      r + 10,
      -Math.PI / 2,
      -Math.PI / 2 + circuit.holdProgress * Math.PI * 2,
    );
    ctx.stroke();
  }
  ctx.shadowBlur = 0;
  ctx.fillStyle = "#fff6de";
  ctx.textAlign = "center";
  ctx.font = `700 ${Math.max(13, h * 0.022)}px sans-serif`;
  ctx.fillText(
    exercise === "weave"
      ? "HEAD"
      : circuit.side === -1
      ? "LEFT HAND"
      : "RIGHT HAND",
    x,
    y + 5,
  );
  if (circuit.flash > 0) {
    ctx.fillStyle = `rgba(110,255,214,${circuit.flash / 800})`;
    ctx.fillRect(0, h - 8, w, 8);
    ctx.fillStyle = "#a0ffe7";
    ctx.font = `700 ${h * 0.044}px sans-serif`;
    ctx.fillText(
      "+ " + (exercise === "reach" ? "200" : "100"),
      w / 2,
      h * 0.85,
    );
  }
  ctx.restore();
}
