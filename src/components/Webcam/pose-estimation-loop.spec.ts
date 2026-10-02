import { afterEach, expect, it, vi } from "vitest";
import { startPoseEstimationLoop } from "./pose-estimation-loop";

vi.mock("../../dev-utils/debug", () => ({ isInDebug: () => false }));
afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

it("does not resurrect the animation loop after unmount during inference", async () => {
  vi.useFakeTimers();
  let resolve: () => void = () => undefined;
  const pending = new Promise<void>((done) => {
    resolve = done;
  });
  const frames: Array<() => Promise<void>> = [];
  const request = vi.fn((callback: () => Promise<void>) => {
    frames.push(callback);
    return frames.length;
  });
  const cancel = vi.fn();
  vi.stubGlobal("requestAnimationFrame", request);
  vi.stubGlobal("cancelAnimationFrame", cancel);
  const input = {
    poseDetector: { send: vi.fn(() => pending), reset: vi.fn() },
    webcamRef: { current: { video: { readyState: 4 } } },
    window: {},
  } as unknown as Parameters<typeof startPoseEstimationLoop>[0];
  const stop = startPoseEstimationLoop(input);
  vi.advanceTimersByTime(30);
  const frame = frames[0]();
  stop();
  resolve();
  await frame;
  expect(request).toHaveBeenCalledTimes(1);
  expect(cancel).toHaveBeenCalledWith(1);
});
