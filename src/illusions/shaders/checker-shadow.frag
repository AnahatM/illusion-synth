uniform float uShowProof;
varying vec2 vUv;

void main() {
  vec2 uv = vUv;
  vec3 col = vec3(0.0);

  // Checkerboard
  float checkSize = 8.0;
  float cx = floor(uv.x * checkSize);
  float cy = floor(uv.y * checkSize);
  float check = mod(cx + cy, 2.0);

  // Light and dark squares
  float dark = 0.25;
  float light = 0.65;
  float sq = mix(dark, light, check);

  // Cylinder shadow gradient (elliptical, upper-left area)
  vec2 shadowCenter = vec2(0.35, 0.65);
  float shadowR = 0.28;
  float dist = length((uv - shadowCenter) * vec2(1.0, 1.2));
  float shadow = smoothstep(shadowR, shadowR * 0.3, dist) * 0.4;

  float brightness = sq - shadow;

  // Square A (dark square outside shadow) at ~(3, 3) in grid
  // Square B (light square inside shadow) at ~(3, 5) in grid
  // Both end up at similar luminance

  // Highlight squares A and B with labels
  vec2 sqA = vec2(2.5 / checkSize, 2.5 / checkSize);
  vec2 sqB = vec2(2.5 / checkSize, 5.5 / checkSize);

  col = vec3(brightness);

  // Show proof: draw connecting strip
  if (uShowProof > 0.5) {
    float stripX = 2.5 / checkSize;
    float stripW = 1.0 / checkSize;
    if (abs(uv.x - stripX) < stripW * 0.15 && uv.y > sqA.y && uv.y < sqB.y) {
      col = vec3(clamp(brightness, 0.38, 0.42));
    }
  }

  gl_FragColor = vec4(col, 1.0);
}
