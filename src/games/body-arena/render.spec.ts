import { expect, it, vi } from "vitest";
import { renderCircuit } from "./render";

function context() {
  const drawImage = vi.fn();
  const translate = vi.fn();
  const scale = vi.fn();
  const ctx = {
    canvas: { width: 960, height: 720 },
    createLinearGradient: () => ({ addColorStop: vi.fn() }),
    clearRect: vi.fn(),
    fillRect: vi.fn(),
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    stroke: vi.fn(),
    save: vi.fn(),
    restore: vi.fn(),
    drawImage,
    translate,
    scale,
  } as unknown as CanvasRenderingContext2D;
  return { ctx, drawImage, translate, scale };
}
const video = { readyState: 4 } as HTMLVideoElement;

it("never draws camera pixels in Dark Arena, even when the camera is running", () => {
  const { ctx, drawImage } = context();
  renderCircuit(ctx, video, [], null, "dark", false, false);
  expect(drawImage).not.toHaveBeenCalled();
});
it("mirrors the raw camera image to match the selfie-mode landmarks", () => {
  const { ctx, drawImage, translate, scale } = context();
  renderCircuit(ctx, video, [], null, "mirror", false, false);
  expect(translate).toHaveBeenCalledWith(960, 0);
  expect(scale).toHaveBeenCalledWith(-1, 1);
  expect(drawImage).toHaveBeenCalledWith(video, 0, 0, 960, 720);
});
it("does not use camera pixels in the pointer demo", () => {
  const { ctx, drawImage } = context();
  renderCircuit(ctx, video, [], null, "mirror", false, true);
  expect(drawImage).not.toHaveBeenCalled();
});
