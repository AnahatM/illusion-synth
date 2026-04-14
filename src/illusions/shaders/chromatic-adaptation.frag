uniform float uTime;
uniform float uAdaptDuration;
uniform float uPhase;
varying vec2 vUv;

#define PI 3.14159265359

void main() {
  vec2 uv = vUv;

  // Cycle between adaptation and test phases
  float totalCycle = uAdaptDuration + 4.0; // adapt + test
  float t = mod(uTime, totalCycle);
  float inAdapt = step(t, uAdaptDuration);

  vec3 col = vec3(0.5); // neutral gray

  if (inAdapt > 0.5) {
    // Adaptation phase: strong saturated color
    // Left half: red, right half: green
    float isRight = step(0.5, uv.x);

    vec3 leftColor = vec3(0.9, 0.1, 0.1);
    vec3 rightColor = vec3(0.1, 0.9, 0.1);

    col = mix(leftColor, rightColor, isRight);

    // Fixation cross
    float crossSize = 0.015;
    float crossW = 0.003;
    vec2 c = uv - 0.5;
    if ((abs(c.x) < crossSize && abs(c.y) < crossW) ||
        (abs(c.y) < crossSize && abs(c.x) < crossW)) {
      col = vec3(0.0);
    }
  } else {
    // Test phase: neutral gray — should appear tinted due to adaptation
    col = vec3(0.5);

    // Fixation cross
    float crossSize = 0.015;
    float crossW = 0.003;
    vec2 c = uv - 0.5;
    if ((abs(c.x) < crossSize && abs(c.y) < crossW) ||
        (abs(c.y) < crossSize && abs(c.x) < crossW)) {
      col = vec3(0.0);
    }

    // Faint text area indicator
    float border = step(abs(uv.x - 0.5), 0.002) *
                   step(0.3, uv.y) * step(uv.y, 0.7);
    col = mix(col, vec3(0.4), border);
  }

  gl_FragColor = vec4(col, 1.0);
}
