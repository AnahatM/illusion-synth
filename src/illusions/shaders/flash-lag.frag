uniform float uTime;
uniform float uSpeed;
uniform float uFlashDuration;
uniform vec3 uMovingColor;
uniform vec3 uFlashColor;
uniform vec3 uBgColor;
varying vec2 vUv;

#define PI 3.14159265359

void main() {
  vec2 uv = vUv;
  vec3 color = uBgColor;

  // Draw a horizontal track line
  float trackY = 0.5;
  float trackLine = 1.0 - smoothstep(0.0, 0.002, abs(uv.y - trackY) - 0.001);
  color = mix(color, uBgColor * 0.7, trackLine * 0.3);

  // Moving dot - continuous circular motion
  float t = uTime * uSpeed * 0.5;
  float movingX = 0.5 + 0.35 * sin(t);
  float movingDist = length(uv - vec2(movingX, trackY));
  float movingDot = 1.0 - smoothstep(0.015, 0.02, movingDist);
  color = mix(color, uMovingColor, movingDot);

  // Flash dot - appears briefly when moving dot crosses center
  float flashPeriod = 2.0 * PI / (uSpeed * 0.5);
  float phase = mod(t, 2.0 * PI);
  // Flash near the zero-crossing (when sin ≈ 0 going right)
  float flashTrigger = smoothstep(PI - 0.08, PI, phase) * smoothstep(PI + uFlashDuration * 0.3, PI + 0.02, phase);
  float flashTrigger2 = smoothstep(2.0 * PI - 0.08, 2.0 * PI - 0.001, phase);

  float flash = max(flashTrigger, flashTrigger2);
  float flashDist = length(uv - vec2(0.5, trackY - 0.12));
  float flashDot = (1.0 - smoothstep(0.018, 0.024, flashDist)) * flash;
  color = mix(color, uFlashColor, flashDot);

  // Reference marker at center
  float markerDist = abs(uv.x - 0.5);
  float marker = (1.0 - smoothstep(0.001, 0.002, markerDist)) *
                 step(abs(uv.y - trackY), 0.04);
  color = mix(color, uBgColor * 0.5, marker * 0.3);

  gl_FragColor = vec4(color, 1.0);
}
