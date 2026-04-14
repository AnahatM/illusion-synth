uniform float uTime;
uniform float uSpeed;
uniform vec3 uColor;
uniform float uSize;
uniform float uRings;
varying vec2 vUv;

#define PI 3.14159265359

float line(vec2 p, vec2 a, vec2 b, float thickness) {
  vec2 pa = p - a, ba = b - a;
  float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
  return smoothstep(thickness, thickness * 0.3, length(pa - ba * h));
}

void main() {
  vec2 uv = (vUv - 0.5) * 2.0;
  float t = uTime * uSpeed;
  float s = uSize * 0.38;
  int rings = int(uRings);

  float ct = cos(t), st = sin(t);
  float cx = cos(t * 0.6), sx = sin(t * 0.6);

  float result = 0.0;
  float thick = 0.006;

  // Draw longitude lines (meridians)
  for (int m = 0; m < 16; m++) {
    if (m >= rings) break;
    float phi = float(m) * PI / float(rings);

    vec2 prev;
    for (int i = 0; i <= 32; i++) {
      float theta = float(i) * 2.0 * PI / 32.0;
      float x = s * sin(theta) * cos(phi);
      float y = s * cos(theta);
      float z = s * sin(theta) * sin(phi);

      // Rotate Y then X
      float x1 = x * ct - z * st;
      float z1 = x * st + z * ct;
      float y1 = y * cx - z1 * sx;

      vec2 p = vec2(x1, y1);
      if (i > 0) {
        result = max(result, line(uv, prev, p, thick));
      }
      prev = p;
    }
  }

  // Draw latitude lines (parallels)
  for (int lat = 1; lat < 16; lat++) {
    if (lat >= rings) break;
    float theta = float(lat) * PI / float(rings);
    float r = s * sin(theta);
    float y = s * cos(theta);

    vec2 prev;
    for (int i = 0; i <= 32; i++) {
      float phi = float(i) * 2.0 * PI / 32.0;
      float x = r * cos(phi);
      float z = r * sin(phi);

      float x1 = x * ct - z * st;
      float z1 = x * st + z * ct;
      float y1 = y * cx - z1 * sx;

      vec2 p = vec2(x1, y1);
      if (i > 0) {
        result = max(result, line(uv, prev, p, thick));
      }
      prev = p;
    }
  }

  vec3 col = uColor * result;
  gl_FragColor = vec4(col, result);
}
