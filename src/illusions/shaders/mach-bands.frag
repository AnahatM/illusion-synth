uniform float uBands;
uniform float uContrast;
varying vec2 vUv;

void main() {
  float x = vUv.x;
  float bands = floor(uBands);
  float step_val = floor(x * bands) / (bands - 1.0);
  float gray = mix(0.5 - uContrast * 0.5, 0.5 + uContrast * 0.5, step_val);
  gl_FragColor = vec4(vec3(gray), 1.0);
}
