import { getGameWidth, getGameHeight } from "games/helpers";
import { Alien } from "../alien";
import { AnimationType } from "../factory/animation-factory";

export class AlienManager {
  aliens: Phaser.Physics.Arcade.Group;
  get hasAliveAliens(): boolean {
    return !!this.aliens.children.size;
  }

  constructor(private _scene: Phaser.Scene) {
    this.aliens = this._scene.physics.add.group({
      maxSize: 40,
      classType: Alien,
      runChildUpdate: true,
    });
    this.aliens.setOrigin(0, 0);
    this._sortAliens();
    this._animate();
  }

  getRandomAliveEnemy(): Alien {
    const random = Phaser.Math.RND.integerInRange(1, this.aliens.children.size);
    const aliens = this.aliens.children.getArray() as Alien[];
    return aliens[random];
  }

  reset() {
    this._sortAliens();
    this._animate();
  }

  private _sortAliens() {
    const width = getGameWidth(this._scene);
    const height = getGameHeight(this._scene);

    const ORIGIN_X = width / 7;
    const ORIGIN_Y = height / 3;

    this.aliens.clear(true, true);
    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 10; x++) {
        const alien: Alien = this.aliens.create(
          ORIGIN_X + x * 62,
          ORIGIN_Y + y * 58,
        );
        alien.setOrigin(0.5, 0.5);
        alien.play(AnimationType.Fly);
        alien.setImmovable(false);
      }
    }
  }

  private _animate() {
    const width = getGameWidth(this._scene);
    // Create a single tween that moves the entire group
    this._scene.tweens.add({
      targets: this.aliens.getChildren(),
      ease: "Linear",
      duration: 4000,
      x: `+=${width / 2}`,
      paused: false,
      delay: 0,
      yoyo: true,
      repeat: -1,
    });
  }
}
