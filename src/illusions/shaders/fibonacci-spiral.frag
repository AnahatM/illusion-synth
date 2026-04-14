uniform float uTime;
uniform float uSpeed;
uniform float uZoom;
uniform vec3 uColor1;
uniform vec3 uColor2;
varying vec2 vUv;

#define PI 3.14159265359
#define PHI 1.61803398875

void main() {
  vec2 uv = vUv - 0.5;
  float angle = atan(uv.y, uv.x);
  float dist = length(uv);

  // Golden spiral: r = a * phi^(theta/2pi)
  float logDist = log(max(dist, 0.001)) / log(PHI);
  float spiral = angle / (2.0 * PI) - logDist * uZoom + uTime * uSpeed;

  float pattern = sin(spiral * PI * 6.0) * 0.5 + 0.5;

  // Pulsing effect
  pattern *= 0.8 + 0.2 * sin(uTime * uSpeed * 2.0);

  pattern = smoothstep(0.3, 0.7, pattern);

  float fade = smoothstep(0.0, 0.03, dist) * smoothstep(0.5, 0.4, dist);

  vec3 color = mix(uColor1, uColor2, pattern);
  gl_FragColor = vec4(color, fade);
}
