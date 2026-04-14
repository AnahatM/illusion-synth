uniform float uShowProof;
varying vec2 vUv;

void main() {
  vec2 uv = vUv;

  // Checkerboard
  float checkSize = 8.0;
  float cx = floor(uv.x * checkSize);
  float cy = floor(uv.y * checkSize);
  float check = mod(cx + cy, 2.0);

  // Light and dark squares
  float dark = 0.3;
  float light = 0.6;
  float sq = mix(dark, light, check);

  // Shadow: soft elliptical gradient from upper-left
  vec2 shadowCenter = vec2(0.37, 0.62);
  float shadowDist = length((uv - shadowCenter) * vec2(1.2, 1.0));
  float shadow = smoothstep(0.35, 0.08, shadowDist) * 0.35;

  float brightness = sq - shadow;

  // Square A: dark square outside shadow — cell (1, 1) bottom-left area
  // Square B: light square inside shadow — near shadow center
  // We pick cells so that dark_no_shadow ≈ light_in_shadow
  // dark = 0.3, light = 0.6, shadow ≈ 0.3 at center → light_in_shadow ≈ 0.3

  // Target squares for the illusion
  vec2 cellA = vec2(5.5 / checkSize, 1.5 / checkSize); // dark square, no shadow
  vec2 cellB = vec2(2.5 / checkSize, 5.5 / checkSize); // light square, in shadow

  // Mark squares A and B with subtle borders
  float sqSize = 1.0 / checkSize;
  float cellAx = floor(cellA.x * checkSize);
  float cellAy = floor(cellA.y * checkSize);
  float cellBx = floor(cellB.x * checkSize);
  float cellBy = floor(cellB.y * checkSize);

  float inCellA = step(cellAx, cx) * step(cx, cellAx) * step(cellAy, cy) * step(cy, cellAy);
  float inCellB = step(cellBx, cx) * step(cx, cellBx) * step(cellBy, cy) * step(cy, cellBy);

  vec3 col = vec3(brightness);

  // Subtle markers for A and B
  float edgeDist = min(
    min(fract(uv.x * checkSize), 1.0 - fract(uv.x * checkSize)),
    min(fract(uv.y * checkSize), 1.0 - fract(uv.y * checkSize))
  );
  float border = smoothstep(0.08, 0.04, edgeDist);
  col = mix(col, vec3(1.0, 0.3, 0.3), border * inCellA * 0.8);
  col = mix(col, vec3(0.3, 0.5, 1.0), border * inCellB * 0.8);

  // Show proof: constant color strip connecting A and B
  if (uShowProof > 0.5) {
    // Compute what brightness A and B actually have
    // A: dark square (0.3) with no shadow
    float brightA = dark; // 0.3
    // B: light square (0.6) with shadow (~0.3 at that point)
    float shadowAtB = smoothstep(0.35, 0.08, length((cellB - shadowCenter) * vec2(1.2, 1.0))) * 0.35;
    float brightB = light - shadowAtB;
    float proofColor = (brightA + brightB) * 0.5;

    // Horizontal strip from A to B
    float stripY1 = min(cellA.y, cellB.y);
    float stripY2 = max(cellA.y, cellB.y) + sqSize;
    float stripMidY = (cellA.y + cellB.y) * 0.5 + sqSize * 0.5;
    float stripH = 0.02;

    // Vertical strip connecting A and B
    float stripMidX = (cellA.x + cellB.x) * 0.5;
    float vertStrip = step(stripMidX - 0.015, uv.x) * step(uv.x, stripMidX + 0.015) *
                      step(cellA.y, uv.y) * step(uv.y, cellB.y + sqSize);

    // Horizontal bars at A and B
    float hBarA = step(cellA.x - sqSize * 0.3, uv.x) * step(uv.x, cellA.x + sqSize * 1.3) *
                  step(cellA.y + sqSize * 0.4, uv.y) * step(uv.y, cellA.y + sqSize * 0.6);
    float hBarB = step(cellB.x - sqSize * 0.3, uv.x) * step(uv.x, cellB.x + sqSize * 1.3) *
                  step(cellB.y + sqSize * 0.4, uv.y) * step(uv.y, cellB.y + sqSize * 0.6);

    float proofMask = clamp(vertStrip + hBarA + hBarB, 0.0, 1.0);
    col = mix(col, vec3(proofColor), proofMask);
  }

  gl_FragColor = vec4(col, 1.0);
}
