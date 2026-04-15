uniform float uTime;
uniform float uSpeed;
varying vec2 vUv;

#define PI 3.14159265359

void main() {
  vec2 uv = vUv * 2.0 - 1.0;
  float r = length(uv);
  float angle = atan(uv.y, uv.x);

  // Disc boundary
  if (r > 0.92) {
    gl_FragColor = vec4(vec3(0.15), 1.0);
    return;
  }

  // Rotate the disc
  float a = angle + uTime * uSpeed;
  float normA = mod(a, 2.0 * PI);

  // One half is black
  if (normA > PI) {
    gl_FragColor = vec4(vec3(0.0), 1.0);
    return;
  }

  // White half with arc patterns at different radii
  // Three sets of arcs, offset in angle, at different radial bands
  float lineW = 0.018;
  float arcVal = 0.0;

  // Inner arcs (radius ~0.18-0.28)
  float band1 = step(0.18, r) * step(r, 0.28);
  float a1 = normA / PI; // 0..1 within white half
  float arc1 = step(0.05, a1) * step(a1, 0.35);
  float arc1b = step(0.45, a1) * step(a1, 0.75);
  arcVal += band1 * (arc1 + arc1b);

  // Middle arcs (radius ~0.35-0.50)
  float band2 = step(0.35, r) * step(r, 0.50);
  float arc2 = step(0.15, a1) * step(a1, 0.50);
  float arc2b = step(0.55, a1) * step(a1, 0.85);
  arcVal += band2 * (arc2 + arc2b);

  // Outer arcs (radius ~0.57-0.72)
  float band3 = step(0.57, r) * step(r, 0.72);
  float arc3 = step(0.25, a1) * step(a1, 0.60);
  float arc3b = step(0.65, a1) * step(a1, 0.95);
  arcVal += band3 * (arc3 + arc3b);

  arcVal = clamp(arcVal, 0.0, 1.0);
  float brightness = 1.0 - arcVal;

  gl_FragColor = vec4(vec3(brightness), 1.0);
}
