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

  float rotAngle = angle + uTime * uSpeed;

  // Outer rim (thick band)
  float rimOuter = smoothstep(0.88, 0.87, r);
  float rimInner = smoothstep(0.78, 0.79, r);
  float rim = rimOuter * (1.0 - rimInner);

  // Inner rim edge highlight
  float innerRimOuter = smoothstep(0.80, 0.79, r);
  float innerRimInner = smoothstep(0.77, 0.78, r);
  float innerRim = innerRimOuter * (1.0 - innerRimInner);

  // Hub (ring, not filled)
  float hubOuter = smoothstep(0.14, 0.13, r);
  float hubInner = smoothstep(0.08, 0.09, r);
  float hub = hubOuter * (1.0 - hubInner);

  // Spokes — thin lines from hub to rim
  float spokeAngle = mod(rotAngle, 2.0 * PI / uSpokeCount);
  float spokeCenter = PI / uSpokeCount;
  // Spoke width varies slightly — thinner at rim, wider at hub
  float spokeWidth = mix(0.04, 0.025, smoothstep(0.14, 0.78, r));
  float spoke = 1.0 - smoothstep(0.0, spokeWidth, abs(spokeAngle - spokeCenter));
  spoke *= step(0.13, r) * step(r, 0.79); // between hub and rim

  // Combine all wheel parts
  float wheel = clamp(rim + innerRim + hub + spoke, 0.0, 1.0);
  color = mix(color, uSpokeColor, wheel);

  // Outer circle mask
  float discMask = smoothstep(0.92, 0.90, r);
  color = mix(uBgColor, color, discMask);

  gl_FragColor = vec4(color, 1.0);
}
