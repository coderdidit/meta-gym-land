import {
  MovesSpeedCaluclator,
  IDLE,
  SLOWLY,
  MEDIUM,
  FAST,
  VERY_FAST,
} from "./moves-speed-caluclator";

describe(MovesSpeedCaluclator.name, () => {
  const idleVelocityVec = {
    x: 0,
    y: 0,
  };
  const velocityWithYVec = {
    x: 0,
    y: -1,
  };
  describe("calculateCurrentSpeedAndBoost", () => {
    it("should init values correctly", () => {
      const movesSpeedCaluclator = new MovesSpeedCaluclator({
        timeNow: Date.now(),
      });
      expect(movesSpeedCaluclator.averageMovesPerSecond).toEqual(0);
      expect(movesSpeedCaluclator.currentSpeedLabel).toEqual(IDLE);
      expect(
        movesSpeedCaluclator.resolvePlayerYVelocity(idleVelocityVec),
      ).toEqual(0);
      expect(
        movesSpeedCaluclator.resolvePlayerYVelocity(velocityWithYVec),
      ).toEqual(-1);
      expect(movesSpeedCaluclator.resolveSpeed({ baseSpeed: 150 })).toEqual(
        150,
      );
    });
    it("should update speed stats given no moves happened", () => {
      const timeNow = new Date("2022-01-01 10:00:00");
      const movesSpeedCaluclator = new MovesSpeedCaluclator({
        timeNow,
      });
      const time2SecondsLater = new Date("2022-01-01 10:00:02");
      movesSpeedCaluclator.calculateCurrentSpeedAndBoost({
        timeNow: time2SecondsLater,
      });

      expect(movesSpeedCaluclator.averageMovesPerSecond).toEqual(0);
      expect(movesSpeedCaluclator.currentSpeedLabel).toEqual(IDLE);
      expect(
        movesSpeedCaluclator.resolvePlayerYVelocity(idleVelocityVec),
      ).toEqual(0);
      expect(movesSpeedCaluclator.resolveSpeed({ baseSpeed: 150 })).toEqual(
        150,
      );
    });

    it("should update speed stats given 1 move in 2 seconds interval happened", () => {
      const timeNow = new Date("2022-01-01 10:00:00");
      const movesSpeedCaluclator = new MovesSpeedCaluclator({
        timeNow,
      });
      movesSpeedCaluclator.incrementDistanceTraveled();
      const time2SecondsLater = new Date("2022-01-01 10:00:02");
      movesSpeedCaluclator.calculateCurrentSpeedAndBoost({
        timeNow: time2SecondsLater,
      });

      expect(movesSpeedCaluclator.averageMovesPerSecond).toEqual(0.5);
      expect(movesSpeedCaluclator.currentSpeedLabel).toEqual(SLOWLY);
      expect(
        movesSpeedCaluclator.resolvePlayerYVelocity(idleVelocityVec),
      ).toEqual(-1);
      expect(movesSpeedCaluclator.resolveSpeed({ baseSpeed: 150 })).toEqual(
        150,
      );
    });

    it("should update speed stats given 2 moves in 2 seconds interval happened", () => {
      const timeNow = new Date("2022-01-01 10:00:00");
      const movesSpeedCaluclator = new MovesSpeedCaluclator({
        timeNow,
      });
      movesSpeedCaluclator.incrementDistanceTraveled();
      movesSpeedCaluclator.incrementDistanceTraveled();

      const time2SecondsLater = new Date("2022-01-01 10:00:02");
      movesSpeedCaluclator.calculateCurrentSpeedAndBoost({
        timeNow: time2SecondsLater,
      });

      expect(movesSpeedCaluclator.averageMovesPerSecond).toEqual(1);
      expect(movesSpeedCaluclator.currentSpeedLabel).toEqual(MEDIUM);
      expect(
        movesSpeedCaluclator.resolvePlayerYVelocity(idleVelocityVec),
      ).toEqual(-1);
      expect(movesSpeedCaluclator.resolveSpeed({ baseSpeed: 150 })).toEqual(
        450,
      );
    });

    it("should update speed stats given 3 moves in 2 seconds interval happened", () => {
      const timeNow = new Date("2022-01-01 10:00:00");
      const movesSpeedCaluclator = new MovesSpeedCaluclator({
        timeNow,
      });
      movesSpeedCaluclator.incrementDistanceTraveled();
      movesSpeedCaluclator.incrementDistanceTraveled();
      movesSpeedCaluclator.incrementDistanceTraveled();

      const time2SecondsLater = new Date("2022-01-01 10:00:02");
      movesSpeedCaluclator.calculateCurrentSpeedAndBoost({
        timeNow: time2SecondsLater,
      });

      expect(movesSpeedCaluclator.averageMovesPerSecond).toEqual(1.5);
      expect(movesSpeedCaluclator.currentSpeedLabel).toEqual(MEDIUM);
      expect(
        movesSpeedCaluclator.resolvePlayerYVelocity(idleVelocityVec),
      ).toEqual(-1);
      expect(movesSpeedCaluclator.resolveSpeed({ baseSpeed: 150 })).toEqual(
        450,
      );
    });

    it("should update speed stats given 4 moves in 2 seconds interval happened", () => {
      const timeNow = new Date("2022-01-01 10:00:00");
      const movesSpeedCaluclator = new MovesSpeedCaluclator({
        timeNow,
      });
      movesSpeedCaluclator.incrementDistanceTraveled();
      movesSpeedCaluclator.incrementDistanceTraveled();
      movesSpeedCaluclator.incrementDistanceTraveled();
      movesSpeedCaluclator.incrementDistanceTraveled();

      const time2SecondsLater = new Date("2022-01-01 10:00:02");
      movesSpeedCaluclator.calculateCurrentSpeedAndBoost({
        timeNow: time2SecondsLater,
      });

      expect(movesSpeedCaluclator.averageMovesPerSecond).toEqual(2);
      expect(movesSpeedCaluclator.currentSpeedLabel).toEqual(FAST);
      expect(
        movesSpeedCaluclator.resolvePlayerYVelocity(idleVelocityVec),
      ).toEqual(-1);
      expect(movesSpeedCaluclator.resolveSpeed({ baseSpeed: 150 })).toEqual(
        900,
      );
    });

    it("should update speed stats given 6 moves in 2 seconds interval happened", () => {
      const timeNow = new Date("2022-01-01 10:00:00");
      const movesSpeedCaluclator = new MovesSpeedCaluclator({
        timeNow,
      });
      movesSpeedCaluclator.incrementDistanceTraveled();
      movesSpeedCaluclator.incrementDistanceTraveled();
      movesSpeedCaluclator.incrementDistanceTraveled();
      movesSpeedCaluclator.incrementDistanceTraveled();
      movesSpeedCaluclator.incrementDistanceTraveled();
      movesSpeedCaluclator.incrementDistanceTraveled();

      const time2SecondsLater = new Date("2022-01-01 10:00:02");
      movesSpeedCaluclator.calculateCurrentSpeedAndBoost({
        timeNow: time2SecondsLater,
      });

      expect(movesSpeedCaluclator.averageMovesPerSecond).toEqual(3);
      expect(movesSpeedCaluclator.currentSpeedLabel).toEqual(VERY_FAST);
      expect(
        movesSpeedCaluclator.resolvePlayerYVelocity(idleVelocityVec),
      ).toEqual(-1);
      expect(movesSpeedCaluclator.resolveSpeed({ baseSpeed: 150 })).toEqual(
        1350,
      );
    });
  });

  describe("secondsPassed", () => {
    const timeNow = new Date("2022-01-01 10:00:00");
    const movesSpeedCaluclator = new MovesSpeedCaluclator({
      timeNow,
    });
    const time2SecondsLater = new Date("2022-01-01 10:00:02");
    expect(
      movesSpeedCaluclator.secondsPassed({
        timeNow: time2SecondsLater,
        seconds: 2,
      }),
    ).toBeTruthy();

    movesSpeedCaluclator.calculateCurrentSpeedAndBoost({
      timeNow: time2SecondsLater,
    });

    expect(
      movesSpeedCaluclator.secondsPassed({
        timeNow: time2SecondsLater,
        seconds: 2,
      }),
    ).toBeFalsy();

    const time4SecondsLater = new Date("2022-01-01 10:00:04");
    expect(
      movesSpeedCaluclator.secondsPassed({
        timeNow: time4SecondsLater,
        seconds: 2,
      }),
    ).toBeTruthy();
  });
});
