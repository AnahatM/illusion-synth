uniform float uScale;
uniform float uDensity;
uniform float uContrast;
uniform vec3 uColor1;
uniform vec3 uColor2;
varying vec2 vUv;

#define PI 3.14159265359

void main() {
  vec2 uv = vUv - 0.5;

  float density = uDensity * 8.0;

  // Tiled pattern of rotating-snake style discs
  vec2 tileUv = uv * density;
  vec2 tileId = floor(tileUv);
  vec2 tileF = fract(tileUv) - 0.5;

  // Checkerboard rotation direction
  float dir = mod(tileId.x + tileId.y, 2.0) * 2.0 - 1.0;

  float a = atan(tileF.y, tileF.x); // -PI..PI
  float r = length(tileF);

  // Curved segment boundaries: angle offset by radius for spiral effect
  float segments = 8.0 * uScale;
  float curvedAngle = a * dir + r * 12.0;
  float phase = mod(floor(curvedAngle / (2.0 * PI) * segments), 4.0);

  // Four distinct luminance levels (black, dark-gray, white, light-gray)
  float lum;
  if (phase < 1.0) lum = 0.02;
  else if (phase < 2.0) lum = 0.30;
  else if (phase < 3.0) lum = 0.98;
  else lum = 0.65;

  lum = mix(0.5, lum, uContrast);

  // Circular mask per tile
  float mask = smoothstep(0.46, 0.38, r);

  // Mid-gray background
  float bg = 0.5;
  float val = mix(bg, lum, mask);
  vec3 col = mix(uColor1, uColor2, val);

  gl_FragColor = vec4(col, 1.0);
}
