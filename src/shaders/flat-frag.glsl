#version 300 es
precision highp float;

uniform vec3 u_Eye, u_Ref, u_Up;
uniform vec2 u_Dimensions;
uniform float u_Time;

in vec2 fs_Pos;
out vec4 out_Col;

void main() {
  out_Col = vec4((236.0/255.0),(227.0/255.0),(164.0/255.0),1.0);
  //out_Col = vec4(0.5 * (fs_Pos + vec2(1.0)), 0.0, 1.0);
}
