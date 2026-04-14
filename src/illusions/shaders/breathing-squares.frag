uniform float uTime;
uniform float uSpeed;
uniform float uCount;
uniform vec3 uColor1;
uniform vec3 uColor2;
varying vec2 vUv;

#define PI 3.14159265359

void main() {
  vec2 uv = vUv - 0.5;

  // Concentric squares using max(abs())
  float squareDist = max(abs(uv.x), abs(uv.y));

  float rings = squareDist * uCount * 2.0 - uTime * uSpeed;
  float pattern = sin(rings * PI) * 0.5 + 0.5;

  // Pulsing intensity
  float pulse = 0.85 + 0.15 * sin(uTime * uSpeed * 3.0);
  pattern *= pulse;

  pattern = smoothstep(0.35, 0.65, pattern);

  float fade = smoothstep(0.5, 0.45, squareDist);

  vec3 color = mix(uColor1, uColor2, pattern);
  gl_FragColor = vec4(color, fade);
}
