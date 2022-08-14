import {
  GYM_ROOM_SCENE,
  SPACE_STRETCH_SCENE,
  FLY_FIT_SCENE,
  CHART_SQUATS,
  MATRIX,
} from "../../games";
import moveDownPng from "./images/move_down.png";
import moveUpPng from "./images/move_up.png";
import moveUp2Png from "./images/move_up2.png";
import moveLeftPng from "./images/move_left.png";
import moveRightPng from "./images/move_right.png";
import pumpThePricePng from "./images/pump_the_price.png";
import moveForwPng from "./images/move_forward.png";
import turnLeftPng from "./images/turn_left.png";
import turnRightPng from "./images/turn_right.png";
import gravityPng from "./images/gravity.png";

export { MiniGameInstructions };

const imgInDiv = (png) => {
  return (
    <div style={{ padding: "0.3rem" }}>
      <img src={png} alt="" />
    </div>
  );
};

const gravityImg = imgInDiv(gravityPng);
const moveUpImg = imgInDiv(moveUpPng);
const moveUp2Img = imgInDiv(moveUp2Png);
const moveDownImg = imgInDiv(moveDownPng);
const moveLeftImg = imgInDiv(moveLeftPng);
const moveRightImg = imgInDiv(moveRightPng);
const pumpThePriceImg = imgInDiv(pumpThePricePng);

const moveForwImg = imgInDiv(moveForwPng);
const turnLeftImg = imgInDiv(turnLeftPng);
const turnRightImg = imgInDiv(turnRightPng);

const beCreative = (
  <div style={{ padding: "0.3rem" }}>
    <hr />
    <div>
      <b>Be creative!</b>
    </div>
    <div>Other simmilar moves</div>
    <div>will workl as well</div>
  </div>
);

const MiniGameInstructions = new Map([
  [
    GYM_ROOM_SCENE,
    {
      title: (
        <>
          <p>How to play</p>
          <p>
            <b>MetaGym room</b>
          </p>
        </>
      ),
      content: (
        <>
          {moveUp2Img}
          {moveDownImg}
          {moveLeftImg}
          {moveRightImg}
          {beCreative}
        </>
      ),
    },
  ],
  [
    SPACE_STRETCH_SCENE,
    {
      title: (
        <>
          <p>How to play</p>
          <p>
            <b>Space stretch</b>
          </p>
        </>
      ),
      content: (
        <>
          {moveUpImg}
          {gravityImg}
          {moveLeftImg}
          {moveRightImg}
          {beCreative}
        </>
      ),
    },
  ],
  [
    FLY_FIT_SCENE,
    {
      title: (
        <>
          <p>How to play</p>
          <p>
            <b>Fly fit</b>
          </p>
        </>
      ),
      content: (
        <>
          {moveForwImg}
          {turnLeftImg}
          {turnRightImg}
          Try to move like a bird
          {beCreative}
        </>
      ),
    },
  ],
  [
    CHART_SQUATS,
    {
      title: (
        <>
          <p>How to play</p>
          <p>
            <b>Chart squats</b>
          </p>
        </>
      ),
      content: (
        <>
          {pumpThePriceImg}
          Do squats Or Both arms up
          {beCreative}
        </>
      ),
    },
  ],
]);

MiniGameInstructions.set(MATRIX, MiniGameInstructions.get(GYM_ROOM_SCENE));
