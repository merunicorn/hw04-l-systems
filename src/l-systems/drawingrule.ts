import { vec3, mat4, quat} from 'gl-matrix';

class DrawingRule { 
  input: string;
  public translation: vec3;
  public rotation: vec3;
  scale: vec3;
  public color: vec3;
  public q: quat;
  public orientation: vec3;
  public mat: mat4;

  constructor(input: string) {
    this.input = input;
    this.translation = vec3.fromValues(0, 0, 0);
    this.rotation = vec3.fromValues(0, 0, 0);
    this.orientation = vec3.fromValues(0, 1, 0);
    this.q = quat.fromValues(0,0,0,0);
    quat.rotationTo(this.q, this.orientation, this.rotation);
    this.scale = vec3.fromValues(1.0, 1.0, 1.0);
    this.color = vec3.fromValues(0.0, 0.0, 0.0);
    this.mat = mat4.fromValues(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1);
    this.getDrawOp();
    this.setUpTransfMat();
  }

  getDrawOp() {
    if (this.input == "1") {
        this.drawOp1();
    }
    if (this.input == "2") {
        this.drawOp2();
    }
    else {
        this.drawOp3();
    }
  }

  drawOp1() {
    // draws something
  }

  drawOp2() {
    // draws something
  }

  drawOp3() {
    // draws something
  }

  setUpTransfMat() {
    // sets up matrix
    mat4.fromRotationTranslationScale(this.mat, this.q, this.translation, this.rotation);
  }

};

export default DrawingRule;
