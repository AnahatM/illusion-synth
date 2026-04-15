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

  vec3 color = uBgColor;

  // Wheel rim
  float rimOuter = smoothstep(0.88, 0.87, r);
  float rimInner = smoothstep(0.82, 0.83, r);
  float rim = rimOuter * (1.0 - rimInner);

  // Hub
  float hub = 1.0 - smoothstep(0.06, 0.07, r);

  // Spokes
  float rotAngle = angle + uTime * uSpeed;
  float spokeAngle = mod(rotAngle, 2.0 * PI / uSpokeCount);
  float spokeCenter = PI / uSpokeCount;
  float spokeWidth = 0.06;
  float spoke = 1.0 - smoothstep(0.0, spokeWidth, abs(spokeAngle - spokeCenter));
  spoke *= step(0.07, r) * step(r, 0.87);

  // Combine
  float wheel = clamp(rim + hub + spoke, 0.0, 1.0);
  color = mix(color, uSpokeColor, wheel);

  // Circle mask
  float discMask = smoothstep(0.92, 0.90, r);
  color = mix(uBgColor, color, discMask);

  gl_FragColor = vec4(color, 1.0);
}
