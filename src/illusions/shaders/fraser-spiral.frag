uniform float uTime;
uniform float uRings;
uniform float uTiltDensity;
uniform float uSpeed;
varying vec2 vUv;

#define PI 3.14159265359

void main() {
  vec2 uv = vUv - 0.5;
  float r = length(uv);
  float a = atan(uv.y, uv.x);

  vec3 col = vec3(1.0);

  float rings = uRings;
  float tiltAmt = uTiltDensity * 0.3;

  // Draw concentric circles with tilted arc segments
  for (float i = 1.0; i <= 20.0; i++) {
    if (i > rings) break;
    float ringR = i / (rings + 1.0) * 0.45;
    float ringW = 0.006;

    // Tilt direction alternates
    float tilt = sin(a * tiltAmt + i * PI * 0.5 + uTime * uSpeed * 0.2) * 0.015;
    float dist = abs(r - ringR - tilt);

    float line = smoothstep(ringW, ringW * 0.3, dist);
    col = mix(col, vec3(0.0), line);
  }

  gl_FragColor = vec4(col, 1.0);
}
