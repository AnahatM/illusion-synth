uniform float uTime;
uniform float uSpeed;
uniform float uDotCount;
uniform float uSpacing;
varying vec2 vUv;

#define PI 3.14159265359

void main() {
  vec2 uv = vUv - 0.5;
  vec3 col = vec3(0.1);

  int count = int(uDotCount);
  float spacing = uSpacing * 0.08;
  float radius = 0.015;

  // Two rows of dots
  for (int row = 0; row < 2; row++) {
    float y = float(row) * spacing - spacing * 0.5;
    float phase = float(row) * PI; // offset phase

    for (int i = 0; i < 20; i++) {
      if (i >= count) break;
      float fi = float(i);
      float x = (fi / uDotCount - 0.5) * 0.8;

      // Alternate on/off to create phi motion
      float t = uTime * uSpeed;
      float onOff = step(0.0, sin(t + fi * PI + phase));

      vec2 pos = vec2(x, y);
      float dist = length(uv - pos);
      float dot = smoothstep(radius, radius * 0.4, dist);

      col = mix(col, vec3(1.0), dot * onOff);
    }
  }

  gl_FragColor = vec4(col, 1.0);
}
