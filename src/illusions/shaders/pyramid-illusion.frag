uniform float uLevels;
uniform vec3 uColor1;
uniform vec3 uColor2;
varying vec2 vUv;

void main() {
  vec2 uv = vUv;
  vec2 center = vec2(0.5);
  vec2 d = uv - center;

  // Diamond/square distance (Chebyshev)
  float dist = max(abs(d.x), abs(d.y));

  // Create nested squares with gradient reversal
  float levels = uLevels;
  float band = dist * levels;
  float bandIdx = floor(band);
  float bandFrac = fract(band);

  // Alternate gradient direction in each band
  float dir = mod(bandIdx, 2.0);
  float grad = mix(bandFrac, 1.0 - bandFrac, dir);

  // Apply brightness/color gradient
  vec3 color = mix(uColor1, uColor2, grad);

  // Fade at edges
  float mask = smoothstep(0.5, 0.48, dist);
  color = mix(vec3(0.5), color, mask);

  gl_FragColor = vec4(color, 1.0);
}
