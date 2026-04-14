uniform float uTime;
uniform float uSpeed;
uniform vec3 uColor;
uniform float uSize;
varying vec2 vUv;

#define PI 3.14159265359

// Draw a line segment with given thickness
float line(vec2 p, vec2 a, vec2 b, float thickness) {
  vec2 pa = p - a, ba = b - a;
  float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
  return smoothstep(thickness, thickness * 0.3, length(pa - ba * h));
}

void main() {
  vec2 uv = (vUv - 0.5) * 2.0;

  float t = uTime * uSpeed;
  float s = uSize * 0.35;

  // 3D cube vertices
  float ct = cos(t), st = sin(t);
  float cp = cos(t * 0.7), sp = sin(t * 0.7);

  // 8 vertices of a cube centered at origin
  vec3 verts[8];
  verts[0] = vec3(-1, -1, -1) * s;
  verts[1] = vec3( 1, -1, -1) * s;
  verts[2] = vec3( 1,  1, -1) * s;
  verts[3] = vec3(-1,  1, -1) * s;
  verts[4] = vec3(-1, -1,  1) * s;
  verts[5] = vec3( 1, -1,  1) * s;
  verts[6] = vec3( 1,  1,  1) * s;
  verts[7] = vec3(-1,  1,  1) * s;

  // Rotate all vertices (Y then X rotation)
  vec2 proj[8];
  for (int i = 0; i < 8; i++) {
    vec3 v = verts[i];
    // Y rotation
    float x1 = v.x * ct - v.z * st;
    float z1 = v.x * st + v.z * ct;
    // X rotation
    float y1 = v.y * cp - z1 * sp;
    // Orthographic projection (no depth — ambiguous!)
    proj[i] = vec2(x1, y1);
  }

  float thick = 0.012;
  float result = 0.0;

  // 12 edges of a cube
  // Front face
  result = max(result, line(uv, proj[0], proj[1], thick));
  result = max(result, line(uv, proj[1], proj[2], thick));
  result = max(result, line(uv, proj[2], proj[3], thick));
  result = max(result, line(uv, proj[3], proj[0], thick));
  // Back face
  result = max(result, line(uv, proj[4], proj[5], thick));
  result = max(result, line(uv, proj[5], proj[6], thick));
  result = max(result, line(uv, proj[6], proj[7], thick));
  result = max(result, line(uv, proj[7], proj[4], thick));
  // Connecting edges
  result = max(result, line(uv, proj[0], proj[4], thick));
  result = max(result, line(uv, proj[1], proj[5], thick));
  result = max(result, line(uv, proj[2], proj[6], thick));
  result = max(result, line(uv, proj[3], proj[7], thick));

  // Vertex dots
  for (int i = 0; i < 8; i++) {
    float d = length(uv - proj[i]);
    result = max(result, smoothstep(0.025, 0.015, d));
  }

  vec3 col = uColor * result;
  gl_FragColor = vec4(col, result);
}
