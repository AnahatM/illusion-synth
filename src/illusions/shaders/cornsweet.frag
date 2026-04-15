uniform float uEdgeWidth;
uniform float uContrast;
varying vec2 vUv;

void main() {
  vec2 uv = vUv;

  // Left half and right half have the same base luminance
  float baseLum = 0.5;

  // Cornsweet edge in the middle
  float center = 0.5;
  float edgeW = uEdgeWidth * 0.1;
  float dist = uv.x - center;

  float edge = 0.0;
  if (abs(dist) < edgeW) {
    // Smooth gradient near the edge
    float t = dist / edgeW;
    edge = sign(t) * pow(abs(t), 0.5) * uContrast * 0.15;
  } else {
    edge = 0.0;
  }

  float lum = baseLum + edge;

  gl_FragColor = vec4(vec3(lum), 1.0);
}
