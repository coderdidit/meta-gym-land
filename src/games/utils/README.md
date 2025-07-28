# Game Utilities

This directory contains pragmatic utility classes to reduce boilerplate code across games without creating tight coupling.

## Available Utilities

### GameUI

Handles common UI patterns across games.

```typescript
import { GameUI } from "../utils";

// Create ESC hint text box
GameUI.createEscHint(scene, width, height, speed);

// Create score board
const scoreBoard = GameUI.createScoreBoard(scene, width, height, initialScore);

// Create hint text box
const hintBox = GameUI.createHintTextBox(scene, width, height, message, speed);

// Create centered text box
const centeredBox = GameUI.createCenteredTextBox(
  scene,
  width,
  height,
  message,
  speed,
);
```

### TimeoutManager

Manages timeouts and ensures proper cleanup.

```typescript
import { TimeoutManager } from "../utils";

const timeoutManager = new TimeoutManager();

// Add timeout manually
timeoutManager.add(setTimeout(callback, delay));

// Or use convenience method
timeoutManager.setTimeout(callback, delay);

// Clean up all timeouts
timeoutManager.clear();
```

### TweenPresets

Common tween animations used across games.

```typescript
import { TweenPresets } from "../utils";

// Floating animation
TweenPresets.floatingAnimation(scene, targets, distance, duration);

// Rotating animation with random angles
TweenPresets.rotatingAnimation(scene, targets, duration);

// Background parallax effect
TweenPresets.backgroundParallax(scene, target, distance, duration);
```

### ParticlePresets

Common particle effects.

```typescript
import { ParticlePresets } from "../utils";

// Explosion effect
const explosion = ParticlePresets.explosion(scene, texture);

// Trail effect
const trail = ParticlePresets.trail(scene, texture);

// Sparkle effect
const sparkle = ParticlePresets.sparkle(scene, texture);
```

## Migration Example

### Before:

```typescript
const roboTextTimeouts: NodeJS.Timeout[] = [];

// Create ESC hint
createTextBox({
  scene: this,
  x: width * 0.05,
  y: height * 0.015,
  config: { wrapWidth: 280 },
  bg: mainBgColorNum,
  stroke: highlightTextColorNum,
}).start("press ESC to go back", 10);

// Create score board
this.scoreBoard = this.add.text(width * 0.05, height * 0.04, "SCORE: 0", {
  color: highlightTextColor,
  font: `500 20px ${InGameFont}`,
});

// Add timeout
roboTextTimeouts.push(setTimeout(callback, delay));

// Cleanup
roboTextTimeouts.forEach((t) => clearTimeout(t));
```

### After:

```typescript
import { GameUI, TimeoutManager } from "../utils";

const timeoutManager = new TimeoutManager();

// Create ESC hint
GameUI.createEscHint(this, width, height, 10);

// Create score board
this.scoreBoard = GameUI.createScoreBoard(this, width, height, 0);

// Add timeout
timeoutManager.setTimeout(callback, delay);

// Cleanup
timeoutManager.clear();
```

## Benefits

- ✅ **Reduces boilerplate** without coupling games
- ✅ **Maintains game independence**
- ✅ **Type-safe** utilities
- ✅ **Optional usage** - games can opt-in
- ✅ **Easy to implement** incrementally
