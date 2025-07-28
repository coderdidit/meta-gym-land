import Phaser from "phaser";

export class ParticlePresets {
  static explosion(scene: Phaser.Scene, texture: string) {
    return scene.add.particles(0, 0, texture, {
      speed: { min: -800, max: 800 },
      angle: { min: 0, max: 360 },
      scale: { start: 0.5, end: 0 },
      blendMode: Phaser.BlendModes.SCREEN,
      lifespan: 600,
      gravityY: 800,
      emitting: false,
    });
  }

  static trail(scene: Phaser.Scene, texture: string) {
    return scene.add.particles(0, 0, texture, {
      speed: 100,
      scale: { start: 0.2, end: 0 },
      blendMode: Phaser.BlendModes.ADD,
      emitting: false,
    });
  }

  static sparkle(scene: Phaser.Scene, texture: string) {
    return scene.add.particles(0, 0, texture, {
      speed: { min: 50, max: 150 },
      angle: { min: 0, max: 360 },
      scale: { start: 0.3, end: 0 },
      blendMode: Phaser.BlendModes.ADD,
      lifespan: 1000,
      emitting: false,
    });
  }
}
