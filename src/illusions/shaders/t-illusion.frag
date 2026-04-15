uniform float uLineLength;
uniform float uLineWidth;
uniform float uAngle;
uniform vec3 uColor;
uniform vec3 uBgColor;
varying vec2 vUv;

void main() {
  vec2 uv = vUv - 0.5;

  // Rotate
  float ca = cos(uAngle);
  float sa = sin(uAngle);
  uv = vec2(uv.x * ca - uv.y * sa, uv.x * sa + uv.y * ca);

  float hw = uLineWidth * 0.003;
  float hl = uLineLength * 0.15;

  // Horizontal line (top of the T)
  float hLine = step(-hl, uv.x) * step(uv.x, hl) *
                step(-hw, uv.y) * step(uv.y, hw);

  // Vertical line (stem of the T) going downward from the horizontal bar
  // Same total length as horizontal: from y=0 down to y=-2*hl
  float vLine = step(-hw, uv.x) * step(uv.x, hw) *
                step(-2.0 * hl, uv.y) * step(uv.y, 0.0);

  float shape = clamp(hLine + vLine, 0.0, 1.0);

  vec3 color = mix(uBgColor, uColor, shape);

  gl_FragColor = vec4(color, 1.0);
}
