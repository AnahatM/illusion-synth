uniform float uTime;
uniform float uPhase;
uniform vec3 uLeftColor;
uniform vec3 uRightColor;
uniform float uSaturation;
varying vec2 vUv;

void main() {
  vec2 uv = vUv;

  float isAdapt = step(uPhase, 0.5); // phase 0 = adapt, phase 1 = test

  vec3 col = vec3(0.5); // neutral gray

  if (isAdapt > 0.5) {
    // Adaptation phase: show selected colors
    float isRight = step(0.5, uv.x);
    vec3 left = mix(vec3(0.5), uLeftColor, uSaturation);
    vec3 right = mix(vec3(0.5), uRightColor, uSaturation);
    col = mix(left, right, isRight);
  }

  // Fixation cross
  float crossSize = 0.015;
  float crossW = 0.003;
  vec2 c = uv - 0.5;
  if ((abs(c.x) < crossSize && abs(c.y) < crossW) ||
      (abs(c.y) < crossSize && abs(c.x) < crossW)) {
    col = vec3(0.0);
  }

  // Dividing line in test phase
  if (isAdapt < 0.5) {
    float border = step(abs(uv.x - 0.5), 0.002) *
                   step(0.3, uv.y) * step(uv.y, 0.7);
    col = mix(col, vec3(0.4), border);
  }

  gl_FragColor = vec4(col, 1.0);
}
