import { vec3, vec4, mat4, quat} from 'gl-matrix';

class DrawingRule { 
  input: string;
  //public translation: vec3;
  public translation: number;
  public rotation: vec3; // euler angles in degrees
  scale: vec3;
  public color: vec3;
  public q: quat;
  public orientation: quat;
  public mat: mat4;
  public depth: number;

  constructor(input: string) {
    this.input = input;
    //this.translation = vec3.fromValues(0, 0, 0);
    this.translation = 0;
    this.rotation = vec3.fromValues(0, 0, 0);
    this.orientation = quat.create();
    this.q = quat.create();
    this.scale = vec3.fromValues(1.0, 1.0, 1.0);
    this.color = vec3.fromValues(1.0, 0.0, 0.0);
    this.mat = mat4.fromValues(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1);
    this.depth = 0;
    this.getDrawOp();
    this.reset();
  }

  reset() {
    //this.translation = vec3.fromValues(0, 0, 0);
    this.translation = 0;
    this.rotation = vec3.fromValues(0, 0, 0);
    this.orientation = quat.create();
    this.q = quat.create();
    this.scale = vec3.fromValues(1.0, 1.0, 1.0);
    this.color = vec3.fromValues(1.0, 0.0, 0.0);
    this.mat = mat4.fromValues(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1);
  }

  getDrawOp() {
    console.log(this.input);
    console.log("called scale op");
    this.scaleOp();
    if (this.input == "+") {
        this.drawOp1();
    }
    else if (this.input == "-") {
        this.drawOp2();
    }
    else if (this.input == "F") {
        this.drawOp3();
    }
    else {
        console.log("invalid char");
    }
  }

  drawOp1() {
    // draws something
    //this.rotation[0] += 50.0;
    this.rotation[2] += 30.0;
  }

  drawOp2() {
    // draws something
    //this.rotation[0] -= 50.0;
    this.rotation[2] -= 30.0;
  }

  drawOp3() {
    // draws something
    console.log("original:" + this.translation);
    //this.translation[1] += 30.0;
    //this.translation[1] += (30.0 * (this.scale[0]));
    this.translation += 30.0 * this.scale[0];
    console.log("final:" + this.translation);
  }

  scaleOp() {
      // scales based on recursion depth
      if (this.depth == 0) {
          this.scale = vec3.fromValues(0.5,0.5,0.5);
          this.color = vec3.fromValues(1.0, 0.0, 0.0);
          console.log("same scale");
      }
      else if (this.depth == 1) {
            this.scale[0] *= (0.8 * (1.0 / this.depth) * 0.5);
            this.scale[1] *= (0.8 * (1.0 / this.depth) * 0.5);
            this.scale[2] *= (0.8 * (1.0 / this.depth) * 0.5);
            this.color = vec3.fromValues(0.0, 0.0, 1.0);
            console.log("scaled down");
      }
      else {
          this.scale[0] *= (0.8 * (1.0 / this.depth) * 0.5);
          this.scale[1] *= (0.8 * (1.0 / this.depth) * 0.5);
          this.scale[2] *= (0.8 * (1.0 / this.depth) * 0.5);
          this.color = vec3.fromValues(0.0, 1.0, 0.0);
          console.log("scaled down");
      }
  }
};

export default DrawingRule;
