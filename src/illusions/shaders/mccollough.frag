uniform float uPhase;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform float uGratingFreq;
uniform float uFullWidth;
varying vec2 vUv;

void main() {
  vec2 uv = vUv;
  vec3 col = vec3(0.0);
  float freq = uGratingFreq;

  if (uPhase < 0.5) {
    // Phase 1: Horizontal colored grating (color1 + black)
    float stripe = step(0.5, fract(uv.y * freq));
    col = mix(vec3(0.0), uColor1, stripe);
  } else if (uPhase < 1.5) {
    // Phase 2: Vertical colored grating (color2 + black)
    float stripe = step(0.5, fract(uv.x * freq));
    col = mix(vec3(0.0), uColor2, stripe);
  } else {
    // Phase 3: Black & white test gratings
    if (uFullWidth > 0.5) {
      // Full width: horizontal on top half, vertical on bottom half
      if (uv.y > 0.52) {
        float stripe = step(0.5, fract(uv.y * freq));
        col = vec3(stripe);
      } else if (uv.y < 0.48) {
        float stripe = step(0.5, fract(uv.x * freq));
        col = vec3(stripe);
      } else {
        col = vec3(0.3);
      }
    } else {
      // Original: horizontal on left, vertical on right
      if (uv.x < 0.48) {
        float stripe = step(0.5, fract(uv.y * freq));
        col = vec3(stripe);
      } else if (uv.x > 0.52) {
        float stripe = step(0.5, fract(uv.x * freq));
        col = vec3(stripe);
      } else {
        col = vec3(0.3);
      }
    }
  }

  // Phase indicator bar at top
  float barH = 0.02;
  if (uv.y > 1.0 - barH) {
    if (uPhase < 0.5) col = uColor1;
    else if (uPhase < 1.5) col = uColor2;
    else col = vec3(0.5);
  }

  gl_FragColor = vec4(col, 1.0);
}
