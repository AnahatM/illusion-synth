uniform float uTime;
uniform float uSpeed;
uniform float uFrequency;
uniform float uPhase;
varying vec2 vUv;

#define PI 3.14159265359

void main() {
  vec2 uv = vUv - 0.5;

  // Phase: adaptation (moving) then test (static)
  float totalCycle = 8.0 + 5.0;
  float t = mod(uTime, totalCycle);
  float inAdapt = step(t, 8.0);

  float r = length(uv);
  float a = atan(uv.y, uv.x);

  vec3 col = vec3(0.5);

  if (inAdapt > 0.5) {
    // Downward moving pattern (spiral/radial)
    float pattern = sin(r * uFrequency * 40.0 - uTime * uSpeed * 3.0);
    col = vec3(0.5 + 0.4 * pattern);

    // Fixation
    float crossSize = 0.015;
    float crossW = 0.003;
    if ((abs(uv.x) < crossSize && abs(uv.y) < crossW) ||
        (abs(uv.y) < crossSize && abs(uv.x) < crossW)) {
      col = vec3(1.0, 0.0, 0.0);
    }
  } else {
    // Static pattern — should appear to move upward due to aftereffect
    float pattern = sin(r * uFrequency * 40.0);
    col = vec3(0.5 + 0.3 * pattern);

    // Fixation
    float crossSize = 0.015;
    float crossW = 0.003;
    if ((abs(uv.x) < crossSize && abs(uv.y) < crossW) ||
        (abs(uv.y) < crossSize && abs(uv.x) < crossW)) {
      col = vec3(0.0, 1.0, 0.0);
    }
  }

  gl_FragColor = vec4(col, 1.0);
}
