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

  // Target squares
  vec2 cellA = vec2(5.5 / checkSize, 1.5 / checkSize); // dark square, no shadow
  vec2 cellB = vec2(2.5 / checkSize, 5.5 / checkSize); // light square, in shadow

  float sqSize = 1.0 / checkSize;
  float cellAx = floor(cellA.x * checkSize);
  float cellAy = floor(cellA.y * checkSize);
  float cellBx = floor(cellB.x * checkSize);
  float cellBy = floor(cellB.y * checkSize);

  float inCellA = step(cellAx, cx) * step(cx, cellAx) * step(cellAy, cy) * step(cy, cellAy);
  float inCellB = step(cellBx, cx) * step(cx, cellBx) * step(cellBy, cy) * step(cy, cellBy);

  vec3 col = vec3(brightness);

  // Subtle corner markers — small triangles in corners of target squares
  vec2 localUv = fract(uv * checkSize);
  float cornerSize = 0.18;
  // Top-left corner triangle
  float tl = step(localUv.x + (1.0 - localUv.y), cornerSize);
  // All four corners
  float tr = step((1.0 - localUv.x) + (1.0 - localUv.y), cornerSize);
  float bl = step(localUv.x + localUv.y, cornerSize);
  float br = step((1.0 - localUv.x) + localUv.y, cornerSize);
  float corners = clamp(tl + tr + bl + br, 0.0, 1.0);

  // Mark with subtle white dots at center of each target square
  vec2 centerA = (vec2(cellAx, cellAy) + 0.5) / checkSize;
  vec2 centerB = (vec2(cellBx, cellBy) + 0.5) / checkSize;
  float dotA = smoothstep(0.012, 0.008, length(uv - centerA));
  float dotB = smoothstep(0.012, 0.008, length(uv - centerB));

  // Small "A" and "B" labels — use dot as marker, very subtle
  float markerA = dotA * 0.7;
  float markerB = dotB * 0.7;
  // Use brightness-adaptive color: white dot on dark, dark dot on light
  float adaptA = step(brightness, 0.4);
  float adaptB = step(brightness, 0.4);
  col = mix(col, vec3(mix(0.1, 0.95, adaptA)), markerA);
  col = mix(col, vec3(mix(0.1, 0.95, adaptB)), markerB);

  // Show proof: solid strip connecting A and B showing equal brightness
  if (uShowProof > 0.5) {
    // Use the actual sampled matching brightness (#4C4C4C ≈ 0.298)
    float proofColor = 0.298;

    // Straight diagonal strip from center of A to center of B
    vec2 pA = centerA;
    vec2 pB = centerB;
    vec2 dir = normalize(pB - pA);
    vec2 perp = vec2(-dir.y, dir.x);

    vec2 d = uv - pA;
    float along = dot(d, dir);
    float across = abs(dot(d, perp));
    float totalLen = length(pB - pA);

    float inStrip = step(0.0, along) * step(along, totalLen) * step(across, 0.015);

    // Also small squares at A and B positions
    float padA = step(abs(uv.x - pA.x), sqSize * 0.35) * step(abs(uv.y - pA.y), sqSize * 0.35);
    float padB = step(abs(uv.x - pB.x), sqSize * 0.35) * step(abs(uv.y - pB.y), sqSize * 0.35);

    float proofMask = clamp(inStrip + padA + padB, 0.0, 1.0);
    col = mix(col, vec3(proofColor), proofMask);
  }

  gl_FragColor = vec4(col, 1.0);
}
