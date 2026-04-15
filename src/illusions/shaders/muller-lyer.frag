uniform float uArrowSize;
uniform float uLineLength;
uniform float uLineWidth;
uniform vec3 uLineColor;
uniform vec3 uBgColor;
varying vec2 vUv;

float sdSegment(vec2 p, vec2 a, vec2 b) {
  vec2 pa = p - a, ba = b - a;
  float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
  return length(pa - ba * h);
}

float drawLine(vec2 p, vec2 a, vec2 b, float w) {
  return 1.0 - smoothstep(w - 0.002, w + 0.002, sdSegment(p, a, b));
}

void main() {
  vec2 uv = vUv - 0.5;
  vec3 bg = uBgColor;
  vec3 lineCol = uLineColor;
  float halfLen = uLineLength * 0.15;
  float arrow = uArrowSize * 0.04;
  float w = uLineWidth * 0.003;

  float shape = 0.0;

  // Top line with outward arrows (appears longer)
  float yTop = 0.1;
  vec2 tl = vec2(-halfLen, yTop);
  vec2 tr = vec2(halfLen, yTop);
  shape += drawLine(uv, tl, tr, w);
  // Left outward arrows
  shape += drawLine(uv, tl, tl + vec2(-arrow, arrow), w);
  shape += drawLine(uv, tl, tl + vec2(-arrow, -arrow), w);
  // Right outward arrows
  shape += drawLine(uv, tr, tr + vec2(arrow, arrow), w);
  shape += drawLine(uv, tr, tr + vec2(arrow, -arrow), w);

  // Bottom line with inward arrows (appears shorter)
  float yBot = -0.1;
  vec2 bl = vec2(-halfLen, yBot);
  vec2 br = vec2(halfLen, yBot);
  shape += drawLine(uv, bl, br, w);
  // Left inward arrows
  shape += drawLine(uv, bl, bl + vec2(arrow, arrow), w);
  shape += drawLine(uv, bl, bl + vec2(arrow, -arrow), w);
  // Right inward arrows
  shape += drawLine(uv, br, br + vec2(-arrow, arrow), w);
  shape += drawLine(uv, br, br + vec2(-arrow, -arrow), w);

  shape = clamp(shape, 0.0, 1.0);
  vec3 col = mix(bg, lineCol, shape);
  gl_FragColor = vec4(col, 1.0);
}
