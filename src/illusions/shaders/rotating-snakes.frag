uniform float uTime;
uniform float uRingCount;
uniform float uDensity;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
varying vec2 vUv;

#define PI 3.14159265359

// Single disc of the rotating snakes pattern
vec3 drawDisc(vec2 center, float radius, vec2 uv, float dir) {
  vec2 d = uv - center;
  float dist = length(d);

  // Outside disc = return negative alpha signal
  if (dist > radius) return vec3(-1.0);

  float angle = atan(d.y, d.x);
  float normDist = dist / radius;

  // Multiple concentric rings within each disc
  float ringCount = uRingCount;
  float ring = floor(normDist * ringCount);
  float ringFract = fract(normDist * ringCount);

  // Many segments per ring — key to the illusion density
  float segments = 12.0 * uDensity;

  // Offset angle per ring — this creates the "snake" spiral effect
  // Alternate direction for adjacent rings
  float offset = ring * PI / segments * dir;
  float segAngle = angle + offset;

  float segIdx = floor(segAngle * segments / (2.0 * PI));

  // 4-color asymmetric luminance cycle:
  // black → dark → bright → white
  // This specific order creates the peripheral motion illusion
  float phase = mod(segIdx + ring * 1.0, 4.0);

  vec3 color;
  if (phase < 1.0) color = vec3(0.0);        // black
  else if (phase < 2.0) color = uColor2;     // dark green
  else if (phase < 3.0) color = uColor1;     // bright green
  else color = vec3(1.0);                     // white

  // Sharp segment edges (no smoothing — the hard edges help the illusion)
  // But add subtle ring separation
  float ringEdge = smoothstep(0.0, 0.06, ringFract) * smoothstep(1.0, 0.94, ringFract);
  color *= ringEdge;

  // Fade at disc edge
  float edgeFade = smoothstep(1.0, 0.9, normDist);
  color *= edgeFade;

  return color;
}

void main() {
  vec2 uv = vUv;
  float aspect = 1.0; // square viewport assumed

  // Tile multiple discs in a grid
  // 4x4 grid of discs with offset rows (hexagonal packing)
  float cols = 4.0;
  float rows = 4.0;
  float discRadius = 0.5 / cols * 1.15; // slightly overlapping

  vec3 finalColor = vec3(0.05); // very dark background

  for (float row = -1.0; row < rows + 1.0; row += 1.0) {
    for (float col = -1.0; col < cols + 1.0; col += 1.0) {
      // Hex offset for odd rows
      float xOff = mod(row, 2.0) * 0.5 / cols;
      vec2 center = vec2(
        (col + 0.5) / cols + xOff,
        (row + 0.5) / rows
      );

      // Alternate rotation direction per disc
      float dir = mod(row + col, 2.0) < 1.0 ? 1.0 : -1.0;

      vec3 disc = drawDisc(center, discRadius, uv, dir);
      if (disc.r >= 0.0) {
        finalColor = disc;
      }
    }
  }

  gl_FragColor = vec4(finalColor, 1.0);
}
