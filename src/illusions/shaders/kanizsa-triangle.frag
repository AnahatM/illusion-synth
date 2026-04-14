uniform float uRadius;
uniform float uGap;
uniform float uRotation;
uniform vec3 uColor;
varying vec2 vUv;

#define PI 3.14159265359

void main() {
  vec2 uv = vUv - 0.5;

  float r = uRadius * 0.12;
  float gapAngle = uGap * PI / 180.0;

  // Three pac-man positions forming a triangle
  float triR = 0.22;
  vec3 bg = vec3(0.0);
  vec3 col = bg;

  for (int i = 0; i < 3; i++) {
    float angle = float(i) * 2.0 * PI / 3.0 - PI / 2.0 + uRotation;
    vec2 center = triR * vec2(cos(angle), sin(angle));

    float dist = length(uv - center);

    // Angle from center to current pixel
    float a = atan(uv.y - center.y, uv.x - center.x);

    // Pac-man mouth direction: toward triangle center
    float mouthDir = atan(-center.y, -center.x);

    float angleDiff = mod(a - mouthDir + PI, 2.0 * PI) - PI;

    // Draw circle with mouth cut out
    if (dist < r && abs(angleDiff) > gapAngle * 0.5) {
      col = uColor;
    }
  }

  // Subtle illusory triangle edges (very faint lines connecting pac-men)
  // This helps the brain "see" the triangle
  gl_FragColor = vec4(col, 1.0);
}
