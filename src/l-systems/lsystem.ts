import {vec3, vec4, quat} from 'gl-matrix';
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
  public transfvecs: Array<vec4>;

  constructor(input: string, alphabet: Array<string>, iters: number) {
    
    this.axiom = input;
    this.alphabet = alphabet;
    this.expmap = new Map();
    this.drawmap = new Map();
    this.turtlestack = new Array();
    this.transfvecs = new Array();
    console.log(this.axiom);
    this.fillExpMap();
    this.fillDrawMap();
    this.lsysParse(iters);
    this.lsysExecute();
  }

  lsysParse(iters: number) {
      //this.newaxiom = this.axiom;
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
            console.log(this.newaxiom);
        }
      }
  }

  lsysExecute() {
      let recurDepth = 0;
      let turt = new Turtle(vec3.fromValues(0, 0, 0), 
                            quat.create(), recurDepth, 
                            vec3.fromValues(0.0, 0.0, 0.0));
      let currentTurt = turt;
      this.pushTurtle(currentTurt);
      let arrLength = 1;
      for (let letter of this.newaxiom) {
          if (letter == "[") {
              // clone turtle
              let copyTurt = Object.assign({}, currentTurt);
              // push clone onto stack
              arrLength = this.pushTurtle(copyTurt);
              recurDepth++;
          }
          else if (letter == "]") {
              // pop turtle off stack
              this.popTurtle();
              arrLength--;
              recurDepth--;
              // update working turtle to new end of stack turtle
              currentTurt = this.turtlestack[arrLength-1];
          }
          else {
              let draw = this.drawmap.get(letter);
              currentTurt.orientation = draw.orientation;
              // apply drawing rule transformations to turtle
              // also calls the drawing function
              currentTurt.addTranslation(draw.translation);
              currentTurt.addRotation(draw.rotation);
              currentTurt.setDepth(recurDepth);
              currentTurt.setColor(draw.color);
              // set up the transformation vec4s
              for (var i = 0; i < 4; i++) {
                  this.transfvecs.push(vec4.fromValues(draw.mat[i+0],
                                                       draw.mat[i+4],
                                                       draw.mat[i+8],
                                                       draw.mat[i+12]));
              }
              console.log("transfvecs size");
              console.log(this.transfvecs.length);
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
      return this.turtlestack.push(turt);
  }

  popTurtle() {
      this.turtlestack.pop();
  }
};

export default LSystem;
