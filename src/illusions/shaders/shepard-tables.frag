uniform vec3 uTableColor;
uniform vec3 uBgColor;
uniform float uSeparation;
varying vec2 vUv;

void main() {
  vec2 uv = vUv;
  vec3 color = uBgColor;

  // Table 1 (left) - long and narrow parallelogram (portrait orientation)
  // Described by a parallelogram: tall, narrow, skewed
  vec2 c1 = vec2(0.3 - uSeparation * 0.1, 0.5);
  vec2 p1 = uv - c1;
  // Rotate 90 degrees from table 2
  // Skew transform for parallelogram
  float skew1 = 0.15;
  float hw1 = 0.06; // half width
  float hh1 = 0.18; // half height
  vec2 sp1 = vec2(p1.x - p1.y * skew1, p1.y);
  float table1 = step(-hw1, sp1.x) * step(sp1.x, hw1) *
                 step(-hh1, sp1.y) * step(sp1.y, hh1);

  // Legs for table 1
  float leg1a = step(-0.003, sp1.x - (-hw1)) * step(sp1.x - (-hw1), 0.003) *
                step(hh1, sp1.y + skew1 * hw1) * step(sp1.y, hh1 + 0.06);
  float leg1b = step(-0.003, sp1.x - hw1) * step(sp1.x - hw1, 0.003) *
                step(hh1, sp1.y + skew1 * hw1) * step(sp1.y, hh1 + 0.06);

  // Table 2 (right) - same shape rotated 90 degrees
  vec2 c2 = vec2(0.7 + uSeparation * 0.1, 0.5);
  vec2 p2 = uv - c2;
  float skew2 = 0.15;
  float hw2 = 0.18;
  float hh2 = 0.06;
  vec2 sp2 = vec2(p2.x - p2.y * skew2, p2.y);
  float table2 = step(-hw2, sp2.x) * step(sp2.x, hw2) *
                 step(-hh2, sp2.y) * step(sp2.y, hh2);

  // Legs for table 2
  float leg2a = step(-0.003, sp2.x - (-hw2 + skew2 * hh2)) * step(sp2.x - (-hw2 + skew2 * hh2), 0.003) *
                step(hh2, sp2.y) * step(sp2.y, hh2 + 0.06);
  float leg2b = step(-0.003, sp2.x - (hw2 + skew2 * hh2)) * step(sp2.x - (hw2 + skew2 * hh2), 0.003) *
                step(hh2, sp2.y) * step(sp2.y, hh2 + 0.06);

  float tables = clamp(table1 + table2 + leg1a + leg1b + leg2a + leg2b, 0.0, 1.0);

  // Add slight 3D shading
  float shade1 = table1 * (0.9 + 0.1 * sp1.x / hw1);
  float shade2 = table2 * (0.9 + 0.1 * sp2.x / hw2);

  color = mix(color, uTableColor * (0.85 + shade1 * 0.15 + shade2 * 0.15), tables);

  gl_FragColor = vec4(color, 1.0);
}
