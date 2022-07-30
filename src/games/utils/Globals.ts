let _mainRoomPlayerExitPos: { x: number; y: number };

export const setMainRoomPlayerExitPos = (_x: number, _y: number) => {
  _mainRoomPlayerExitPos = {
    x: _x,
    y: _y,
  };
};

export const getMainRoomPlayerExitPos = () => {
  return _mainRoomPlayerExitPos;
};

export const playerHasExitPos = () => {
  return !!_mainRoomPlayerExitPos;
};
