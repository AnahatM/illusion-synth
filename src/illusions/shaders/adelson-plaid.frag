uniform float uFrequency;
uniform float uPlaidAngle;
uniform vec3 uColor1;
uniform vec3 uColor2;
varying vec2 vUv;

#define PI 3.14159265359

void main() {
  vec2 uv = vUv;

  // Create corrugated (folded) surface effect
  float fold = sin(uv.x * uFrequency * PI * 2.0);
  float foldShade = fold * 0.5 + 0.5;

  // Plaid pattern: two sets of stripes at angles
  float angle = uPlaidAngle * PI / 180.0;
  vec2 dir1 = vec2(cos(angle), sin(angle));
  vec2 dir2 = vec2(cos(-angle), sin(-angle));

  float stripe1 = step(0.5, fract(dot(uv * 8.0, dir1)));
  float stripe2 = step(0.5, fract(dot(uv * 8.0, dir2)));

  // Create plaid by combining stripes
  float plaid = stripe1 * 0.5 + stripe2 * 0.5;

  // Apply corrugation shading - this creates the brightness illusion
  // Patches on the "lit" side of the fold appear different from "shadow" side
  float brightness = mix(0.3, 1.0, foldShade);
  vec3 plaidColor = mix(uColor1, uColor2, plaid);
  vec3 color = plaidColor * brightness;

  gl_FragColor = vec4(color, 1.0);
}
