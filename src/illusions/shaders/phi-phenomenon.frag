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
  float radius = 0.018;

  // Current active dot index (sequential, one at a time)
  float cycle = uTime * uSpeed;
  int activeIdx = int(mod(floor(cycle), uDotCount));

  // Smooth transition: fractional part for fade
  float frac = fract(cycle);

  // Two rows demonstrating the effect
  for (int row = 0; row < 2; row++) {
    float y = float(row) * spacing - spacing * 0.5;
    int rowActive = int(mod(float(activeIdx) + float(row) * uDotCount * 0.5, uDotCount));

    for (int i = 0; i < 20; i++) {
      if (i >= count) break;
      float fi = float(i);
      float x = (fi / uDotCount - 0.5) * 0.8;

      vec2 pos = vec2(x, y);
      float dist = length(uv - pos);

      // Dim position markers
      float marker = smoothstep(radius * 0.6, radius * 0.3, dist);
      col = mix(col, vec3(0.2), marker);

      // Active dot: bright
      if (i == rowActive) {
        float bright = smoothstep(radius, radius * 0.3, dist);
        float fade = 1.0 - frac * 0.3; // slight fade toward end
        col = mix(col, vec3(1.0), bright * fade);
      }

      // Next dot: fading in
      int nextIdx = int(mod(float(rowActive) + 1.0, uDotCount));
      if (i == nextIdx) {
        float bright = smoothstep(radius, radius * 0.3, dist);
        col = mix(col, vec3(1.0), bright * frac * 0.5);
      }
    }
  }

  gl_FragColor = vec4(col, 1.0);
}
