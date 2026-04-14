uniform float uLineCount;
uniform float uRayCount;
varying vec2 vUv;

#define PI 3.14159265359

void main() {
  vec2 uv = vUv - 0.5;
  vec3 col = vec3(1.0); // white bg

  // Draw radiating lines from center
  float angle = atan(uv.y, uv.x);
  float rays = uRayCount;
  float rayAngle = PI / rays;
  float rayPattern = abs(mod(angle, rayAngle * 2.0) - rayAngle);
  float ray = smoothstep(0.02, 0.01, rayPattern);
  col = mix(col, vec3(0.0), ray * 0.8);

  // Draw two parallel vertical lines
  float lineCount = uLineCount;
  float spacing = 0.3;
  float lineW = 0.004;
  float line1 = smoothstep(lineW, lineW * 0.3, abs(uv.x - spacing * 0.5));
  float line2 = smoothstep(lineW, lineW * 0.3, abs(uv.x + spacing * 0.5));

  col = mix(col, vec3(1.0, 0.0, 0.0), max(line1, line2));

  gl_FragColor = vec4(col, 1.0);
}
