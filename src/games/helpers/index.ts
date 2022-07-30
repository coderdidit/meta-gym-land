export const getGameWidth = (scene: Phaser.Scene) => scene.game.scale.width;

export const getGameHeight = (scene: Phaser.Scene) => scene.game.scale.height;

/**
 * Get a fixed width/height size relative to the games dimensions
 * @param {number} size - Size of element
 * @param {Phaser.Scene} scene - Current scene
 * @returns {number} Number representing the fixed size relative to the games dimensions
 */
export const getRelative = (size: number, scene: Phaser.Scene) =>
  (getGameHeight(scene) * size) / 1080;
