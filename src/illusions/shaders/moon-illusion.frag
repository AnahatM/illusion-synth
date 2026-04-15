uniform vec3 uMoonColor;
uniform vec3 uSkyColor;
uniform float uMoonSize;
uniform float uHorizon;
varying vec2 vUv;

void main() {
  vec2 uv = vUv;

  // Sky gradient (darker at top)
  vec3 sky = uSkyColor * (0.4 + 0.6 * (1.0 - uv.y));

  // Horizon line with terrain
  float horizonY = uHorizon * 0.3;
  float ground = smoothstep(horizonY + 0.01, horizonY - 0.01, uv.y);
  vec3 groundColor = uSkyColor * 0.15;
  vec3 bg = mix(sky, groundColor, ground);

  // Simple horizon features (building-like silhouettes)
  float bldg = 0.0;
  for (float i = 0.0; i < 8.0; i++) {
    float bx = 0.1 + i * 0.11;
    float bw = 0.03 + 0.01 * sin(i * 3.7);
    float bh = horizonY + 0.03 + 0.02 * sin(i * 2.3 + 1.0);
    float b = step(abs(uv.x - bx), bw) * step(uv.y, bh) * step(horizonY - 0.01, uv.y);
    bldg = max(bldg, b);
  }
  bg = mix(bg, groundColor * 0.8, bldg);

  // Moon near horizon (appears larger due to context)
  float moonR = uMoonSize * 0.04;
  vec2 moonPos1 = vec2(0.25, horizonY + moonR + 0.05);
  float d1 = length(uv - moonPos1);
  float moon1 = 1.0 - smoothstep(moonR - 0.003, moonR, d1);

  // Moon high in sky (appears smaller, same actual size)
  vec2 moonPos2 = vec2(0.75, 0.78);
  float d2 = length(uv - moonPos2);
  float moon2 = 1.0 - smoothstep(moonR - 0.003, moonR, d2);

  // Glow around moons
  float glow1 = exp(-d1 * d1 * 800.0) * 0.3;
  float glow2 = exp(-d2 * d2 * 800.0) * 0.3;

  vec3 color = bg;
  color += uMoonColor * glow1;
  color += uMoonColor * glow2;
  color = mix(color, uMoonColor, moon1);
  color = mix(color, uMoonColor, moon2);

  gl_FragColor = vec4(color, 1.0);
}
