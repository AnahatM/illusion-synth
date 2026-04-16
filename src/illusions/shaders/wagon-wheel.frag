uniform float uTime;
uniform float uSpeed;
uniform float uSpokeCount;
uniform vec3 uSpokeColor;
uniform vec3 uBgColor;
varying vec2 vUv;

#define PI 3.14159265359

void main() {
  vec2 uv = vUv * 2.0 - 1.0;
  float r = length(uv);
  float angle = atan(uv.y, uv.x);

  float rotAngle = angle + uTime * uSpeed;

  // Outer rim (ring band from r≈0.79 to r≈0.87)
  float rim = smoothstep(0.88, 0.87, r) * smoothstep(0.78, 0.79, r);

  // Hub (ring from r≈0.09 to r≈0.13)
  float hub = smoothstep(0.14, 0.13, r) * smoothstep(0.08, 0.09, r);

  // Spokes — use cos to get distance from nearest spoke center
  float spokePattern = abs(cos(rotAngle * uSpokeCount * 0.5));
  // spokePattern is 1 on a spoke, 0 between spokes
  // Threshold to make thin spokes
  float spokeThickness = 0.96; // higher = thinner spokes
  float spoke = smoothstep(spokeThickness, spokeThickness + 0.02, spokePattern);
  spoke *= step(0.13, r) * step(r, 0.79); // only between hub and rim

  // Combine — only wheel parts are drawn, background shows through gaps
  float wheel = clamp(rim + hub + spoke, 0.0, 1.0);
  vec3 color = mix(uBgColor, uSpokeColor, wheel);

  gl_FragColor = vec4(color, 1.0);
}
