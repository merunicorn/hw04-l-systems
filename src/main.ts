import {vec3} from 'gl-matrix';
import * as Stats from 'stats-js';
import * as DAT from 'dat-gui';
import Square from './geometry/Square';
import ScreenQuad from './geometry/ScreenQuad';
import OpenGLRenderer from './rendering/gl/OpenGLRenderer';
import Camera from './Camera';
import {setGL} from './globals';
import ShaderProgram, {Shader} from './rendering/gl/ShaderProgram';
import {readTextFile} from './globals';
import Mesh from './geometry/Mesh';
//import Turtle from './l-systems/turtle';
//import ExpansionRule from './l-systems/expansionrule';
import LSystem from './l-systems/lsystem';

// Define an object with application parameters and button callbacks
// This will be referred to by dat.GUI's functions that add GUI elements.
const controls = {
};

let square: Square;
let screenQuad: ScreenQuad;
let mesh_test: Mesh;
let numInst: number = 2;

let time: number = 0.0;
let obj0: string = readTextFile('../resources/obj/rose.obj');

//let turtle: Turtle;
//let exprule: ExpansionRule;

function loadScene() {
  square = new Square();
  square.create();
  screenQuad = new ScreenQuad();
  screenQuad.create();

  //call l-system stuff
  let alphabet = new Array<string>();
  alphabet.push("F");
  alphabet.push("X");
  alphabet.push("+");
  alphabet.push("-");
  alphabet.push("[");
  alphabet.push("]");
  let lsys = new LSystem("FX", alphabet, numInst);

  //test if mesh works
  mesh_test = new Mesh(obj0, vec3.fromValues(0,0,0));
  mesh_test.create();

  // Set up instanced rendering data arrays here.
  // This example creates a set of positional
  // offsets and gradiated colors for a 100x100 grid
  // of squares, even though the VBO data for just
  // one square is actually passed to the GPU
  //let offsetsArray = [];
  //let colorsArray = [];
  let transf1Array = [];
  let transf2Array = [];
  let transf3Array = [];
  let transf4Array = [];
  //let n: number = 100.0;
  let k: number = (lsys.transfvecs.length);
  console.log(k);
  k = k / 4.0;
  console.log(k);
  let n: number = 2.0;
  for (let kcount = 0; kcount < k; kcount++) {
      transf1Array.push(lsys.transfvecs[0+ 4*kcount][0]);
      transf1Array.push(lsys.transfvecs[1+ 4*kcount][0]);
      transf1Array.push(lsys.transfvecs[2+ 4*kcount][0]);
      transf1Array.push(lsys.transfvecs[3+ 4*kcount][0]);
      transf2Array.push(lsys.transfvecs[0+ 4*kcount][1]);
      transf2Array.push(lsys.transfvecs[1+ 4*kcount][1]);
      transf2Array.push(lsys.transfvecs[2+ 4*kcount][1]);
      transf2Array.push(lsys.transfvecs[3+ 4*kcount][1]);
      transf3Array.push(lsys.transfvecs[0+ 4*kcount][2]);
      transf3Array.push(lsys.transfvecs[1+ 4*kcount][2]);
      transf3Array.push(lsys.transfvecs[2+ 4*kcount][2]);
      transf3Array.push(lsys.transfvecs[3+ 4*kcount][2]);
      transf4Array.push(lsys.transfvecs[0+ 4*kcount][3]);
      transf4Array.push(lsys.transfvecs[1+ 4*kcount][3]);
      transf4Array.push(lsys.transfvecs[2+ 4*kcount][3]);
      transf4Array.push(lsys.transfvecs[3+ 4*kcount][3]);
  }
  /*
  for(let i = 0; i < n; i++) {
    for(let j = 0; j < n; j++) {
      offsetsArray.push(i);
      offsetsArray.push(j);
      offsetsArray.push(0);

      colorsArray.push(i / n);
      colorsArray.push(j / n);
      colorsArray.push(1.0);
      colorsArray.push(1.0); // Alpha channel
      
      transf1Array.push(lsys.transfvecs[0][0]);
      transf1Array.push(lsys.transfvecs[0][1]);
      transf1Array.push(lsys.transfvecs[0][2]);
      transf1Array.push(lsys.transfvecs[0][3]);
      transf2Array.push(lsys.transfvecs[1][0]);
      transf2Array.push(lsys.transfvecs[1][1]);
      transf2Array.push(lsys.transfvecs[1][2]);
      transf2Array.push(lsys.transfvecs[1][3]);
      transf3Array.push(lsys.transfvecs[2][0]);
      transf3Array.push(lsys.transfvecs[2][1]);
      transf3Array.push(lsys.transfvecs[2][2]);
      transf3Array.push(lsys.transfvecs[2][3]);
      transf4Array.push(lsys.transfvecs[3][0]);
      transf4Array.push(lsys.transfvecs[3][1]);
      transf4Array.push(lsys.transfvecs[3][2]);
      transf4Array.push(lsys.transfvecs[3][3]); 


      transf1Array.push(lsys.transfvecs[0][0]);
      transf1Array.push(lsys.transfvecs[1][0]);
      transf1Array.push(lsys.transfvecs[2][0]);
      transf1Array.push(lsys.transfvecs[3][0]);
      transf2Array.push(lsys.transfvecs[0][1]);
      transf2Array.push(lsys.transfvecs[1][1]);
      transf2Array.push(lsys.transfvecs[2][1]);
      transf2Array.push(lsys.transfvecs[3][1]);
      transf3Array.push(lsys.transfvecs[0][2]);
      transf3Array.push(lsys.transfvecs[1][2]);
      transf3Array.push(lsys.transfvecs[2][2]);
      transf3Array.push(lsys.transfvecs[3][2]);
      transf4Array.push(lsys.transfvecs[0][3]);
      transf4Array.push(lsys.transfvecs[1][3]);
      transf4Array.push(lsys.transfvecs[2][3]);
      transf4Array.push(lsys.transfvecs[3][3]);
      console.log(lsys.transfvecs);
    }
  }*/
  //let offsets: Float32Array = new Float32Array(offsetsArray);
  //let colors: Float32Array = new Float32Array(colorsArray);
  let transf1: Float32Array = new Float32Array(transf1Array);
  let transf2: Float32Array = new Float32Array(transf2Array);
  let transf3: Float32Array = new Float32Array(transf3Array);
  let transf4: Float32Array = new Float32Array(transf4Array);

  mesh_test.setNumInstances(k);
  mesh_test.setVBOTransform(transf1, transf2, transf3, transf4);

  //square.setVBOTransform(transf1, transf2, transf3, transf4);
  //square.setInstanceVBOs(offsets, colors, transf1, transf2, transf3, transf4);
  //square.setNumInstances(n * n); // grid of "particles"
}

function main() {
  // Initial display for framerate
  const stats = Stats();
  stats.setMode(0);
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '0px';
  stats.domElement.style.top = '0px';
  document.body.appendChild(stats.domElement);

  // Add controls to the gui
  const gui = new DAT.GUI();

  // get canvas and webgl context
  const canvas = <HTMLCanvasElement> document.getElementById('canvas');
  const gl = <WebGL2RenderingContext> canvas.getContext('webgl2');
  if (!gl) {
    alert('WebGL 2 not supported!');
  }
  // `setGL` is a function imported above which sets the value of `gl` in the `globals.ts` module.
  // Later, we can import `gl` from `globals.ts` to access it
  setGL(gl);

  // Initial call to load scene
  loadScene();

  const camera = new Camera(vec3.fromValues(10, 10, 10), vec3.fromValues(0, 0, 0));

  const renderer = new OpenGLRenderer(canvas);
  renderer.setClearColor(0.2, 0.2, 0.2, 1);
  //gl.enable(gl.BLEND); // Alpha blending
  gl.enable(gl.DEPTH_TEST);
  //gl.blendFunc(gl.ONE, gl.ONE); // Additive blending

  const instancedShader = new ShaderProgram([
    new Shader(gl.VERTEX_SHADER, require('./shaders/instanced-vert.glsl')),
    new Shader(gl.FRAGMENT_SHADER, require('./shaders/instanced-frag.glsl')),
  ]);

  const flat = new ShaderProgram([
    new Shader(gl.VERTEX_SHADER, require('./shaders/flat-vert.glsl')),
    new Shader(gl.FRAGMENT_SHADER, require('./shaders/flat-frag.glsl')),
  ]);

  // This function will be called every frame
  function tick() {
    camera.update();
    stats.begin();
    instancedShader.setTime(time);
    flat.setTime(time++);
    gl.viewport(0, 0, window.innerWidth, window.innerHeight);
    renderer.clear();
    renderer.render(camera, flat, [screenQuad]);
    renderer.render(camera, instancedShader, [
      mesh_test
    ]);
    /*renderer.render(camera, instancedShader, [
      square
    ]);*/
    stats.end();

    // Tell the browser to call `tick` again whenever it renders a new frame
    requestAnimationFrame(tick);
  }

  window.addEventListener('resize', function() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.setAspectRatio(window.innerWidth / window.innerHeight);
    camera.updateProjectionMatrix();
    flat.setDimensions(window.innerWidth, window.innerHeight);
  }, false);

  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.setAspectRatio(window.innerWidth / window.innerHeight);
  camera.updateProjectionMatrix();
  flat.setDimensions(window.innerWidth, window.innerHeight);

  // Start the render loop
  tick();
}

main();
