import { describe, expect, it, vi } from "vitest";
import type Phaser from "phaser";
import { GameUI } from "./game-ui";

vi.mock("./text", () => ({ createTextBox: vi.fn() }));

describe("GameUI.createScoreBoard", () => {
  it("anchors the score to the top-right, away from the exit hint", () => {
    const scoreBoard = { setOrigin: vi.fn().mockReturnThis() };
    const text = vi.fn().mockReturnValue(scoreBoard);
    const scene = { add: { text } } as unknown as Phaser.Scene;

    expect(GameUI.createScoreBoard(scene, 1200, 800, 42)).toBe(scoreBoard);
    expect(text).toHaveBeenCalledWith(
      1140,
      32,
      "SCORE: 42",
      expect.any(Object),
    );
    expect(scoreBoard.setOrigin).toHaveBeenCalledWith(1, 0);
  });
});
