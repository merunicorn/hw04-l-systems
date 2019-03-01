import { vec3, vec4, mat4, quat} from 'gl-matrix';

class DrawingRule { 
  input: string;
  public translation: vec3;
  public rotation: vec3; // euler angles in degrees
  scale: vec3;
  public color: vec3;
  public q: quat;
  public orientation: quat;
  public mat: mat4;
  depth: number;

  constructor(input: string) {
    this.input = input;
    this.translation = vec3.fromValues(0, 0, 0);
    this.rotation = vec3.fromValues(0, 0, 0);
    this.orientation = quat.create();
    this.q = quat.create();
    this.scale = vec3.fromValues(1.0, 1.0, 1.0);
    this.color = vec3.fromValues(0.0, 0.0, 0.0);
    this.mat = mat4.fromValues(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1);
    this.depth = 0;
    this.getDrawOp();
    this.setUpTransfMat();
  }

  getDrawOp() {
    console.log(this.input);
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
    this.rotation[2] += 50.0;
  }

  drawOp2() {
    // draws something
    //this.rotation[0] -= 50.0;
    this.rotation[2] -= 50.0;
  }

  drawOp3() {
    // draws something
    this.translation[1] -= 70.0;
  }

  scaleOp() {
      // scales based on recursion depth
      if (this.depth == 0) {
          this.scale = vec3.fromValues(1.0,1.0,1.0);
      }
      else {
          this.scale[0] *= (0.8 * this.depth);
          this.scale[1] *= (0.8 * this.depth);
          this.scale[2] *= (0.8 * this.depth);
      }
  }

  setUpTransfMat() {
    // sets up matrix
    // TEST VALUES
    // translate y 1 , rotate x 30
    //this.translation = vec3.fromValues(0.0, 1.0, 0.0);
    //this.rotation = vec3.fromValues(0.0, 0.0, 0.0);
    //this.orientation = vec3.fromValues(0.0, 0.0, 0.0);
    //this.scale = vec3.fromValues(0.5, 0.5, 1.0);
    //this.rotation = vec3.fromValues(0.0, 0.0, 30.0);
    quat.fromEuler(this.q, this.rotation[0], this.rotation[1], this.rotation[2]);
    quat.multiply(this.orientation, this.orientation, this.q);
    mat4.identity(this.mat);
    mat4.fromRotationTranslationScale(this.mat, this.q, this.translation, this.scale);
    
    //mat4.identity(this.mat);
    //this.mat[12] = 2.0;
    //this.mat[13] = 2.0;
    //this.mat[14] = 3.0;

    //console.log("MATRIX");
    //console.log(this.mat);
  }

};

export default DrawingRule;
