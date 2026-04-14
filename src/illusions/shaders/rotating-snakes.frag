uniform float uTime;
uniform float uRingCount;
uniform float uDensity;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
varying vec2 vUv;

#define PI 3.14159265359

void main() {
  vec2 uv = vUv - 0.5;
  float dist = length(uv);
  float angle = atan(uv.y, uv.x);

  // Create ring structures
  float ring = floor(dist * uRingCount);
  float ringFract = fract(dist * uRingCount);

  // Segmented within each ring
  float segments = 8.0 * uDensity;
  float segAngle = angle + ring * PI / segments;
  float seg = floor(segAngle * segments / (2.0 * PI));

  // Color cycling creates apparent rotation
  float phase = mod(seg + ring * 2.0 + uTime * 2.0, 4.0);
  float p = phase / 4.0;

  vec3 color;
  if (p < 0.25) color = uColor1;
  else if (p < 0.5) color = uColor2;
  else if (p < 0.75) color = uColor3;
  else color = vec3(0.0);

  // Smooth segment boundaries
  float segSmooth = fract(segAngle * segments / (2.0 * PI));
  float edgeFade = smoothstep(0.0, 0.05, segSmooth) * smoothstep(1.0, 0.95, segSmooth);
  float ringFade = smoothstep(0.0, 0.1, ringFract) * smoothstep(1.0, 0.9, ringFract);

  color *= edgeFade * ringFade;

  float outerFade = smoothstep(0.5, 0.4, dist);
  gl_FragColor = vec4(color * outerFade, outerFade);
}
