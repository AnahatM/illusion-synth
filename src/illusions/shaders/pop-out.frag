uniform float uGridSize;
uniform float uTargetType;
uniform vec3 uDistractorColor;
uniform vec3 uTargetColor;
uniform float uItemSize;
uniform float uSeed;
varying vec2 vUv;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

void main() {
  vec2 uv = vUv;

  float gridN = uGridSize;
  float cellSize = 1.0 / gridN;
  float itemR = uItemSize * 0.15;

  // Which cell are we in?
  vec2 cellIdx = floor(uv * gridN);
  vec2 cellUv = fract(uv * gridN) - 0.5;

  // Target position (center-ish based on seed)
  vec2 targetCell = floor(vec2(gridN * 0.5, gridN * 0.5));

  float isTarget = step(0.5, 1.0 - abs(sign(cellIdx.x - targetCell.x))) *
                   step(0.5, 1.0 - abs(sign(cellIdx.y - targetCell.y)));

  float dist = length(cellUv);

  vec3 bg = vec3(0.0);
  vec3 color = bg;

  // Draw items
  if (uTargetType < 0.5) {
    // Color pop-out: all same shape, target different color
    float circle = 1.0 - smoothstep(itemR - 0.02, itemR, dist);
    vec3 itemColor = mix(uDistractorColor, uTargetColor, isTarget);
    color = mix(bg, itemColor, circle);
  } else if (uTargetType < 1.5) {
    // Orientation pop-out: lines at different angles
    float angle = isTarget > 0.5 ? 1.5708 : 0.0; // 90 deg vs 0 deg
    float cosA = cos(angle);
    float sinA = sin(angle);
    vec2 rotUv = vec2(cellUv.x * cosA - cellUv.y * sinA, cellUv.x * sinA + cellUv.y * cosA);
    float lineW = 0.06;
    float line = step(abs(rotUv.y), lineW) * step(abs(rotUv.x), itemR);
    vec3 itemColor = mix(uDistractorColor, uTargetColor, isTarget);
    color = mix(bg, itemColor, line);
  } else {
    // Shape pop-out: circles vs diamond
    float circle = 1.0 - smoothstep(itemR - 0.02, itemR, dist);
    float diamond = 1.0 - smoothstep(itemR - 0.02, itemR, abs(cellUv.x) + abs(cellUv.y));
    float shape = mix(circle, diamond, isTarget);
    vec3 itemColor = mix(uDistractorColor, uTargetColor, isTarget);
    color = mix(bg, itemColor, shape);
  }

  gl_FragColor = vec4(color, 1.0);
}
