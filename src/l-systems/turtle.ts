import {vec3, mat4, quat} from 'gl-matrix';

class Turtle {
  position: vec3 = vec3.create();
  public orientation: quat = quat.create();
  recurDepth: number = 0;
  penColor: vec3 = vec3.create();

  constructor(position: vec3, orientation: quat, 
              recurDepth: number, penColor: vec3) {
    this.position = position;
    this.orientation = orientation;
    this.recurDepth = recurDepth;
    this.penColor = penColor;
  }

  addTranslation(pos: vec3) {
    for (let i = 0; i < 3; i++) {
      this.position[i] += pos[i];
    }
  }

  addRotation(rot: vec3) {
    for (let i = 0; i < 3; i++) {
      this.orientation[i] += rot[i];
    }
  }

  setDepth(depth: number) {
    this.recurDepth = depth;
  }

  setColor(color: vec3) {
    this.penColor = color;
  }
};

export default Turtle;
