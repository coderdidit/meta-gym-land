import Phaser from "phaser";

type rectObstacleConstructorParams = {
  scene: Phaser.Scene;
  x: number;
  y: number;
};
export class RectObstacle extends Phaser.GameObjects.Rectangle {
  obstacleGraphics: Phaser.GameObjects.Rectangle;
  constructor(params: rectObstacleConstructorParams) {
    const { scene, x, y } = params;
    super(scene, x, y);

    const width = 120;
    const height = 30;
    const color = 0x898988;

    this.obstacleGraphics = this.scene.add.rectangle(
      x,
      y,
      width,
      height,
      color,
    );
    this.scene.physics.world.enable([this.obstacleGraphics]);
    const body = this.obstacleGraphics.body as Phaser.Physics.Arcade.Body;
    body.setImmovable(true);
  }

  collideWith(
    obj:
      | Phaser.GameObjects.GameObject
      | Phaser.GameObjects.GameObject[]
      | Phaser.GameObjects.Group
      | Phaser.GameObjects.Group[],
  ) {
    this.scene.physics.add.collider(obj, this.obstacleGraphics);
  }

  setVelocityY(vel: any) {
    const body = this.obstacleGraphics.body as Phaser.Physics.Arcade.Body;
    body.setVelocityY(vel);
  }
}
