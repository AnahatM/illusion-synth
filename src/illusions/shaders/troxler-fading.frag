uniform float uRingRadius;
uniform float uDotCount;
uniform float uSoftness;
uniform vec3 uColor;
varying vec2 vUv;

#define PI 3.14159265359

void main() {
  vec2 uv = vUv - 0.5;
  vec3 bg = vec3(0.75);
  vec3 col = bg;

  // Fixation cross
  float crossSize = 0.012;
  float crossW = 0.003;
  if ((abs(uv.x) < crossSize && abs(uv.y) < crossW) ||
      (abs(uv.y) < crossSize && abs(uv.x) < crossW)) {
    col = vec3(0.0);
  }

  // Soft colored blobs arranged in a ring
  float ringR = uRingRadius * 0.2;
  int count = int(uDotCount);
  for (int i = 0; i < 20; i++) {
    if (i >= count) break;
    float a = float(i) * 2.0 * PI / uDotCount;
    vec2 pos = ringR * vec2(cos(a), sin(a));
    float dist = length(uv - pos);
    float blobR = 0.04;
    float soft = uSoftness * 0.05;
    float blob = smoothstep(blobR + soft, blobR * 0.3, dist);
    col = mix(col, uColor, blob * 0.6);
  }

  gl_FragColor = vec4(col, 1.0);
}
