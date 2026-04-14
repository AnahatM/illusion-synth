uniform float uTime;
uniform float uSpeed;
uniform float uDotCount;
uniform float uDotSize;
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

  // Which dot to hide
  int count = int(uDotCount);
  float cycle = uTime * uSpeed;
  int hidden = int(mod(floor(cycle), uDotCount));

  float ringR = 0.2;
  float dotR = uDotSize * 0.025;

  for (int i = 0; i < 16; i++) {
    if (i >= count) break;
    if (i == hidden) continue;

    float a = float(i) * 2.0 * PI / uDotCount;
    vec2 pos = ringR * vec2(cos(a), sin(a));
    float dist = length(uv - pos);

    // Lilac/magenta soft dot
    float dot = smoothstep(dotR, dotR * 0.3, dist);
    vec3 lilac = vec3(0.8, 0.4, 0.8);
    col = mix(col, lilac, dot * 0.9);
  }

  gl_FragColor = vec4(col, 1.0);
}
