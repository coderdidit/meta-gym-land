import Phaser from "phaser";

export class TweenPresets {
  static floatingAnimation(
    scene: Phaser.Scene,
    targets: any[],
    distance = 12,
    duration = 500,
  ) {
    return scene.tweens.add({
      targets,
      props: { y: `-=${distance}` },
      ease: Phaser.Math.Easing.Sine.InOut,
      repeat: -1,
      yoyo: true,
      duration,
    });
  }

  static rotatingAnimation(
    scene: Phaser.Scene,
    targets: any[],
    duration = 500,
  ) {
    return scene.tweens.add({
      targets,
      props: {
        angle: {
          getEnd: function (target: { angle: number }) {
            let a = 45;
            if (Math.random() > 0.5) {
              a = 60;
            }
            return Math.random() > 0.5 ? target.angle + a : target.angle - a;
          },
          getStart: function (target: { angle: number }) {
            return target.angle;
          },
        },
      },
      ease: Phaser.Math.Easing.Sine.InOut,
      repeat: -1,
      yoyo: true,
      duration,
    });
  }

  static backgroundParallax(
    scene: Phaser.Scene,
    target: any,
    distance = 10,
    duration = 1000,
  ) {
    return scene.tweens.add({
      targets: target,
      y: `-=${distance}`,
      ease: Phaser.Math.Easing.Sine.InOut,
      repeat: -1,
      yoyo: true,
      duration,
    });
  }
}
