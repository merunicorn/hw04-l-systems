import {vec3, vec4, quat, mat4} from 'gl-matrix';
import Turtle from './turtle';
import ExpansionRule from './expansionrule';
import DrawingRule from './drawingrule';

class LSystem {
  turtlestack: Array<Turtle>;
  expmap: Map<string, ExpansionRule>;
  drawmap: Map<string, DrawingRule>;
  alphabet: Array<string>;
  axiom: string;
  newaxiom: string;
  public mat: mat4;
  public transfvecs: Array<vec4>;
  public colors: Array<vec4>;

  constructor(input: string, alphabet: Array<string>, iters: number) {
    
    this.axiom = input;
    this.alphabet = alphabet;
    this.expmap = new Map();
    this.drawmap = new Map();
    this.turtlestack = new Array();
    this.mat = mat4.create();
    this.transfvecs = new Array();
    this.colors = new Array();
    console.log(this.axiom);
    this.fillExpMap();
    this.fillDrawMap();
    this.lsysParse(iters);
    this.lsysExecute();
  }

  lsysParse(iters: number) {
      this.newaxiom = "";
      for (var i = 0; i < iters; i++) {
        for (let letter of this.axiom) {
            //console.log(this.newaxiom);
            //find expansion string for letter
            let newstr = this.expmap.get(letter).getExpansion();
            console.log(newstr);
            //replace letter with new expansion
            //axiom[index] = newstr;
            //this.newaxiom.replace(letter, newstr);
            this.newaxiom += newstr;
        }
        console.log("after iters"+i);
        console.log(this.newaxiom);
        if (i != iters-1) {
            this.axiom = this.newaxiom;
            this.newaxiom = "";
        }
      }
  }

  lsysExecute() {
      let recurDepth = 0;
      let turt = new Turtle(vec3.fromValues(0, 0, 0), 
                            quat.create(), recurDepth, 
                            vec3.fromValues(0.0, 0.0, 0.0));
      let currentTurt = turt;
      //this.pushTurtle(currentTurt);
      let arrLength = 0;
      for (let letter of this.newaxiom) {
          console.log("on character "+letter);
          if (letter == "[") {
              recurDepth++;
              // clone turtle
              //let copyTurt = Object.assign({}, currentTurt);
              let new_pos = vec3.create();
              vec3.copy(new_pos, currentTurt.position);
              let new_ori = quat.create();
              quat.copy(new_ori, currentTurt.orientation);
              let new_col = vec3.create();
              vec3.copy(new_col, currentTurt.penColor);
              let copyTurt = new Turtle(new_pos, new_ori, recurDepth, new_col);
              //currentTurt.addTranslation(vec3.fromValues(1.0, 0.0, 1.0));
              
              console.log("currentTurt");
              console.log(currentTurt.position);
              console.log("copyTurt");
              console.log(copyTurt.position);
              // push clone onto stack
              arrLength = this.pushTurtle(copyTurt);
              
              console.log("reached [");
          }
          else if (letter == "]") {
              for (let k = 0; k < arrLength; k++) {
                  console.log("current stack @" + k);
                  console.log(this.turtlestack[k].position);
              }
              // update working turtle to one about to pop
              // pop turtle off stack
              currentTurt = this.popTurtle();
              console.log("current turtle position");
              console.log(currentTurt.position);
              arrLength--;
              recurDepth--;
              console.log("reached ]");
          }
          else if (letter != "F") {
              // don't draw but update turtle
              let draw = this.drawmap.get(letter);
              draw.depth = recurDepth;
              draw.getDrawOp();
              console.log("current turtle stuff");
              console.log(currentTurt.position);
              currentTurt.addTranslation(draw.translation);
              currentTurt.updateOrientation(draw.rotation);
              currentTurt.setDepth(recurDepth);
              currentTurt.setColor(draw.color);
              draw.reset();
          }
          else {
              console.log("recursion depth");
              console.log(recurDepth);
              let draw = this.drawmap.get(letter);
              
              draw.depth = recurDepth;
              draw.getDrawOp();
              let previousPos = vec3.create();
              previousPos = vec3.copy(previousPos, currentTurt.position);
              // apply drawing rule transformations to turtle
              // also calls the drawing function
              currentTurt.addTranslation(draw.translation);
              currentTurt.updateOrientation(draw.rotation);
              currentTurt.setDepth(recurDepth);
              currentTurt.setColor(draw.color);
              console.log("draw translation" + draw.translation);
              console.log("turtle translation" + currentTurt.position);

              let posSize = vec3.create();
              for (let l = 0; l < 3; l++) {
                  posSize[l] = currentTurt.position[l] - previousPos[l];
              }
              let scaleAmt = vec3.length(posSize);
              console.log("scale");
              console.log(scaleAmt);
              let scaleTurt = vec3.create();
              for (let m = 0; m < 3; m++) {
                  scaleTurt[m] = scaleAmt / 30.0;
              }
              console.log(scaleTurt);

              this.setUpTransfMat(currentTurt.orientation, previousPos, scaleTurt);
              //this.setUpTransfMat(vec3.fromValues(0.0,0.0,0.0), currentTurt.position, vec3.fromValues(1.0,1.0,1.0));

              // set up the transformation vec4s
              for (var i = 0; i < 4; i++) {
                this.transfvecs.push(vec4.fromValues(this.mat[i+0],
                                                     this.mat[i+4],
                                                     this.mat[i+8],
                                                     this.mat[i+12]));
              }
              this.colors.push(vec4.fromValues(draw.color[0],
                                               draw.color[1],
                                               draw.color[2],
                                               1.0));
              console.log("color" + this.colors[this.colors.length-1]);
              console.log("transfvecs size");
              console.log(this.transfvecs.length);
              draw.reset();
              //console.log(this.transfvecs);
          }
      }
  }

  fillExpMap() {
    for (var i = 0; i < this.alphabet.length; i++) {
        let letter = this.alphabet[i];
        let exprule = new ExpansionRule(letter);
        this.expmap.set(letter, exprule);
    }
  }

  fillDrawMap() {
    for (var i = 0; i < this.alphabet.length; i++) {
        let letter = this.alphabet[i];
        let drawrule = new DrawingRule(letter);
        this.drawmap.set(letter, drawrule);
    }
  }

  pushTurtle(turt: Turtle) {
      // push turt to stack and return new length
      return this.turtlestack.push(turt);
  }

  popTurtle() {
      // pop stack and return popped turtle
      return this.turtlestack.pop();
  }

  setUpTransfMat(rot: quat, trans: vec3, scale: vec3) {
    let t = mat4.create();
    mat4.fromTranslation(t, trans);
    let r = mat4.create();
    mat4.fromQuat(r, rot);
    let s = mat4.create();
    mat4.fromScaling(s, scale);
    mat4.multiply(this.mat,t,r);
    mat4.multiply(this.mat,this.mat,s);
  }
};

export default LSystem;
