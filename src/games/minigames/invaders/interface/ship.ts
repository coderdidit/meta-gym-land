import { getGameHeight, getGameWidth } from "games/helpers";
import { PLAYER_KEY } from "games";

export class Ship {
  static create(scene: Phaser.Scene): Phaser.Physics.Arcade.Sprite {
    // basic props
    const width = getGameWidth(scene);
    const height = getGameHeight(scene);

    const ship = scene.physics.add.sprite(
      width / 2,
      height - height * 0.05,
      PLAYER_KEY,
    );
    ship.setCollideWorldBounds(true);
    return ship;
  }
}
