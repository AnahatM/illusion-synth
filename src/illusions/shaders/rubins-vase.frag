uniform float uTime;
uniform float uSpeed;
uniform vec3 uColor1;
uniform vec3 uColor2;
varying vec2 vUv;

#define PI 3.14159265359

void main() {
  vec2 uv = vUv - 0.5;

  // Subtle breathing animation
  float breathe = 1.0 + sin(uTime * uSpeed) * 0.015;
  uv *= breathe;

  // Mirror horizontally for symmetry
  float ax = abs(uv.x);
  float y = uv.y;

  // Define the vase/face profile curve
  // This creates the classic Rubin's vase silhouette
  // The curve is the boundary between "vase" and "faces"

  // Profile: forehead, nose, lips, chin from top to bottom
  float profile = 0.0;

  // Forehead region (top)
  float t = y + 0.4; // shift so profile starts at bottom

  if (t < 0.0) {
    profile = 0.35; // base of vase
  } else if (t < 0.15) {
    // Chin: inward curve
    float lt = t / 0.15;
    profile = 0.35 - 0.1 * sin(lt * PI);
  } else if (t < 0.25) {
    // Lips: slight outward bump
    float lt = (t - 0.15) / 0.1;
    profile = 0.25 + 0.06 * sin(lt * PI);
  } else if (t < 0.35) {
    // Below nose: inward
    float lt = (t - 0.25) / 0.1;
    profile = 0.25 - 0.04 * sin(lt * PI * 0.5);
  } else if (t < 0.5) {
    // Nose: outward bump
    float lt = (t - 0.35) / 0.15;
    profile = 0.21 + 0.12 * sin(lt * PI);
  } else if (t < 0.6) {
    // Bridge of nose / eye indent
    float lt = (t - 0.5) / 0.1;
    profile = 0.21 - 0.06 * sin(lt * PI);
  } else if (t < 0.72) {
    // Forehead: gentle outward
    float lt = (t - 0.6) / 0.12;
    profile = 0.15 + 0.08 * lt;
  } else if (t < 0.8) {
    // Top of vase rim
    float lt = (t - 0.72) / 0.08;
    profile = 0.23 + 0.05 * sin(lt * PI * 0.5);
  } else {
    profile = 0.28; // rim top
  }

  // Determine if point is inside the vase (between the two profile curves)
  float isVase = step(ax, profile);

  // Edge highlight at the profile boundary
  float edgeDist = abs(ax - profile);
  float edge = smoothstep(0.008, 0.001, edgeDist);

  // Color: vase region vs face region
  // Alternate emphasis with time to help viewer see both interpretations
  float phase = sin(uTime * uSpeed * 0.5) * 0.5 + 0.5;

  vec3 vaseCol = uColor1 * (0.8 + 0.2 * phase);
  vec3 faceCol = uColor2 * (0.8 + 0.2 * (1.0 - phase));

  vec3 col = mix(faceCol, vaseCol, isVase);

  // Add subtle edge glow
  col += edge * 0.3;

  // Only render within a reasonable area
  float bounds = smoothstep(0.45, 0.44, abs(uv.y));
  float alpha = bounds;

  gl_FragColor = vec4(col, alpha);
}
