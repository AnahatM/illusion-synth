uniform float uTime;
uniform float uSpeed;
uniform vec3 uColor;
uniform float uThickness;
varying vec2 vUv;

#define PI 3.14159265359

// Signed distance to a line segment
float sdSegment(vec2 p, vec2 a, vec2 b) {
  vec2 pa = p - a, ba = b - a;
  float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
  return length(pa - ba * h);
}

// Signed distance to a parallelogram (bar) defined by 4 corners
float sdBar(vec2 p, vec2 a, vec2 b, vec2 c, vec2 d) {
  // a-b and d-c are the long edges, a-d and b-c are the short edges
  vec2 ab = normalize(b - a);
  vec2 ad = normalize(d - a);
  
  // Project onto bar local frame
  float along = dot(p - a, ab);
  float across = dot(p - a, ad);
  float len = length(b - a);
  float wid = length(d - a);
  
  // SDF as max of half-planes
  float d1 = -along;
  float d2 = along - len;
  float d3 = -across;
  float d4 = across - wid;
  
  return max(max(d1, d2), max(d3, d4));
}

void main() {
  vec2 uv = (vUv - 0.5) * 2.0;
  
  // Slow rotation
  float angle = uTime * uSpeed * 0.3;
  float ca = cos(angle), sa = sin(angle);
  uv = mat2(ca, -sa, sa, ca) * uv;
  
  float s = 0.65; // overall scale
  float w = uThickness * 0.15; // bar width
  
  // Equilateral triangle vertices
  vec2 v0 = s * vec2(0.0, 1.0);
  vec2 v1 = s * vec2(-0.866, -0.5);
  vec2 v2 = s * vec2(0.866, -0.5);
  
  // For each side, compute outward normal
  vec2 e01 = normalize(v1 - v0);
  vec2 e12 = normalize(v2 - v1);
  vec2 e20 = normalize(v0 - v2);
  
  vec2 n01 = vec2(-e01.y, e01.x); // outward normal
  vec2 n12 = vec2(-e12.y, e12.x);
  vec2 n20 = vec2(-e20.y, e20.x);
  
  // Outer and inner edge lines for each bar
  // Bar 0: v0 -> v1 (outer edge on left, inner on right)
  vec2 o0a = v0 + n01 * w * 0.5;
  vec2 o0b = v1 + n01 * w * 0.5;
  vec2 i0a = v0 - n01 * w * 0.5;
  vec2 i0b = v1 - n01 * w * 0.5;
  
  // Bar 1: v1 -> v2
  vec2 o1a = v1 + n12 * w * 0.5;
  vec2 o1b = v2 + n12 * w * 0.5;
  vec2 i1a = v1 - n12 * w * 0.5;
  vec2 i1b = v2 - n12 * w * 0.5;
  
  // Bar 2: v2 -> v0
  vec2 o2a = v2 + n20 * w * 0.5;
  vec2 o2b = v0 + n20 * w * 0.5;
  vec2 i2a = v2 - n20 * w * 0.5;
  vec2 i2b = v0 - n20 * w * 0.5;
  
  // For each bar, test if point is inside using half-plane method
  // Bar is between outer and inner edges, and between perpendicular caps
  
  // Bar 0 test
  float b0_out = dot(uv - o0a, n01);   // negative = inside outer edge
  float b0_in = dot(uv - i0a, -n01);   // negative = inside inner edge  
  float b0_capA = dot(uv - v0, e01);   // positive along bar direction
  float b0_capB = dot(uv - v1, -e01);  // positive before end
  float b0 = max(max(b0_out, b0_in), max(-b0_capA, -b0_capB));
  
  // Bar 1 test
  float b1_out = dot(uv - o1a, n12);
  float b1_in = dot(uv - i1a, -n12);
  float b1_capA = dot(uv - v1, e12);
  float b1_capB = dot(uv - v2, -e12);
  float b1 = max(max(b1_out, b1_in), max(-b1_capA, -b1_capB));
  
  // Bar 2 test
  float b2_out = dot(uv - o2a, n20);
  float b2_in = dot(uv - i2a, -n20);
  float b2_capA = dot(uv - v2, e20);
  float b2_capB = dot(uv - v0, -e20);
  float b2 = max(max(b2_out, b2_in), max(-b2_capA, -b2_capB));
  
  // Extend bars past corners for overlap
  float ext = w * 0.8;
  float b0e = max(max(b0_out, b0_in), max(-dot(uv - (v0 - e01 * ext), e01), -dot(uv - (v1 + e01 * ext), -e01)));
  float b1e = max(max(b1_out, b1_in), max(-dot(uv - (v1 - e12 * ext), e12), -dot(uv - (v2 + e12 * ext), -e12)));
  float b2e = max(max(b2_out, b2_in), max(-dot(uv - (v2 - e20 * ext), e20), -dot(uv - (v0 + e20 * ext), -e20)));
  
  float px = 2.0 / 800.0; // AA pixel width
  
  // Different shading per bar face for 3D illusion
  float shade0 = 0.6;
  float shade1 = 1.0;
  float shade2 = 0.35;
  
  vec3 col = vec3(0.0);
  float alpha = 0.0;
  
  // Draw bars in layered order with impossible overlaps at corners
  // Default layer order: bar2 (bottom), bar0 (middle), bar1 (top)
  
  // Layer: bar2
  float d2 = 1.0 - smoothstep(-px, px, b2e);
  if (d2 > 0.01) { col = uColor * shade2; alpha = d2; }
  
  // Layer: bar0
  float d0 = 1.0 - smoothstep(-px, px, b0e);
  if (d0 > 0.01) { col = mix(col, uColor * shade0, d0); alpha = max(alpha, d0); }
  
  // Layer: bar1
  float d1 = 1.0 - smoothstep(-px, px, b1e);
  if (d1 > 0.01) { col = mix(col, uColor * shade1, d1); alpha = max(alpha, d1); }
  
  // Now apply impossible corner overrides:
  // At vertex v0: bar2 should appear ON TOP of bar0
  vec2 center = (v0 + v1 + v2) / 3.0;
  float cv0 = dot(uv - v0, normalize(v0 - center));
  if (cv0 > 0.0 && d2 > 0.01 && d0 > 0.01) {
    col = uColor * shade2;
  }
  
  // At vertex v1: bar0 should appear ON TOP of bar1
  float cv1 = dot(uv - v1, normalize(v1 - center));
  if (cv1 > 0.0 && d0 > 0.01 && d1 > 0.01) {
    col = uColor * shade0;
  }
  
  // At vertex v2: bar1 should appear ON TOP of bar2
  float cv2 = dot(uv - v2, normalize(v2 - center));
  if (cv2 > 0.0 && d1 > 0.01 && d2 > 0.01) {
    col = uColor * shade1;
  }
  
  // Edge highlights
  if (alpha > 0.01) {
    float me = min(min(abs(b0e), abs(b1e)), abs(b2e));
    col += smoothstep(px * 4.0, 0.0, me) * 0.15;
  }
  
  gl_FragColor = vec4(col, alpha);
}
