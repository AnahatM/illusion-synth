uniform float uLineLength;
uniform float uLineWidth;
uniform vec3 uColor;
uniform vec3 uBgColor;
varying vec2 vUv;

void main() {
  vec2 uv = vUv - 0.5;
  float aspect = 1.0;
  float hw = uLineWidth * 0.003;
  float hl = uLineLength * 0.15;

  // Horizontal line (top of the T)
  float hLine = step(-hl, uv.x) * step(uv.x, hl) *
                step(0.0 - hw, uv.y) * step(uv.y, 0.0 + hw);

  // Vertical line (stem of the T) going downward from center
  float vLine = step(-hw, uv.x) * step(uv.x, hw) *
                step(-hl, uv.y) * step(uv.y, 0.0);

  float shape = clamp(hLine + vLine, 0.0, 1.0);

  vec3 color = mix(uBgColor, uColor, shape);

  gl_FragColor = vec4(color, 1.0);
}
