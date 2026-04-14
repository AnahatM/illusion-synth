uniform float uPersonPos;
uniform float uShowGrid;
varying vec2 vUv;

void main() {
  vec2 uv = vUv;
  vec3 col = vec3(0.85, 0.82, 0.78); // room color

  // Ames room: trapezoidal room using perspective trick
  // Far wall
  float wallLeft = 0.15;
  float wallRight = 0.85;
  float wallTop = 0.8;
  float wallBottom = 0.15;

  // Floor (perspective: wider at bottom)
  float floorLeft = mix(0.0, wallLeft, (uv.y - 0.0) / wallBottom);
  float floorRight = mix(1.0, wallRight, (uv.y - 0.0) / wallBottom);

  // Far wall is actually at an angle — left side is farther
  // Making left side smaller and right side bigger

  // Walls
  float inFloor = step(uv.y, wallBottom);
  float inCeiling = step(wallTop, uv.y);
  float inLeftWall = step(uv.x, wallLeft) * step(wallBottom, uv.y) * step(uv.y, wallTop);
  float inRightWall = step(wallRight, uv.x) * step(wallBottom, uv.y) * step(uv.y, wallTop);

  // Floor shade
  col = mix(col, vec3(0.55, 0.50, 0.45), inFloor);
  // Ceiling
  col = mix(col, vec3(0.75, 0.72, 0.68), inCeiling);
  // Walls
  col = mix(col, vec3(0.65, 0.60, 0.55), inLeftWall);
  col = mix(col, vec3(0.65, 0.60, 0.55), inRightWall);

  // Grid lines on floor and walls for depth (optional)
  if (uShowGrid > 0.5) {
    float gridFreq = 12.0;
    float grid = step(0.95, fract(uv.x * gridFreq)) + step(0.95, fract(uv.y * gridFreq));
    col = mix(col, col * 0.7, clamp(grid, 0.0, 1.0) * 0.5);
  }

  // Two "people" (rectangles) — same height in pixels but different visual size
  float personW = 0.03;

  // Person on the left (appears small because "far away")
  float leftPersonH = 0.2;
  vec2 lp = vec2(0.28, wallBottom);
  float inLP = step(lp.x - personW, uv.x) * (1.0 - step(lp.x + personW, uv.x)) *
               step(lp.y, uv.y) * (1.0 - step(lp.y + leftPersonH, uv.y));

  // Person on the right (appears large)
  float rightPersonH = 0.2;
  vec2 rp = vec2(0.72, wallBottom);
  float pPos = uPersonPos;
  rp.x = mix(0.72, 0.28, pPos);
  float rScale = mix(1.0, 0.5, pPos);
  float actualRH = rightPersonH * rScale;

  float inRP = step(rp.x - personW * rScale, uv.x) * (1.0 - step(rp.x + personW * rScale, uv.x)) *
               step(rp.y, uv.y) * (1.0 - step(rp.y + actualRH, uv.y));

  col = mix(col, vec3(0.2, 0.35, 0.6), inLP);
  col = mix(col, vec3(0.7, 0.25, 0.2), inRP);

  gl_FragColor = vec4(col, 1.0);
}
