uniform float uTime;
uniform float uRings;
uniform float uTiltDensity;
uniform float uSpeed;
uniform vec3 uColor1;
uniform vec3 uColor2;
varying vec2 vUv;

#define PI 3.14159265359

void main() {
  vec2 uv = vUv - 0.5;
  float r = length(uv);
  float a = atan(uv.y, uv.x);

  vec3 col = vec3(0.15);

  float rings = uRings;
  float cordTwist = uTiltDensity;

  for (float i = 1.0; i <= 20.0; i++) {
    if (i > rings) break;
    float ringR = i / (rings + 1.0) * 0.45;
    float ringW = 0.018;

    float dist = abs(r - ringR);

    if (dist < ringW) {
      float cordAngle = a * cordTwist + (r - ringR) / ringW * PI * 1.5;
      float dir = mod(i, 2.0) < 1.0 ? 1.0 : -1.0;
      cordAngle *= dir;

      float cord = step(0.0, sin(cordAngle + uTime * uSpeed * 0.3));

      float edge = smoothstep(ringW, ringW * 0.5, dist);

      vec3 cordCol = mix(uColor1, uColor2, cord);
      col = mix(col, cordCol, edge);
    }
  }

  gl_FragColor = vec4(col, 1.0);
}
