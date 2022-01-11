import { IDLE } from "./pose";

let _currentPose = IDLE;

const setPose = (_m) => {
    _currentPose = _m;
    // for debugging
    window.pose = _currentPose;
};

const getPose = () => {
    return _currentPose;
};

const isInGPose = () => {
    return _currentPose != IDLE;
};

export { getPose, isInGPose, setPose };
