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

  // Create concentric ring structure
  float ring = floor(dist * uRingCount);
  float ringFract = fract(dist * uRingCount);

  // Segment each ring into colored sectors
  float segments = 8.0 * uDensity;
  // Alternate rings offset by half a segment to create the "snake" pattern
  float segAngle = angle + ring * PI / segments;
  float seg = floor(segAngle * segments / (2.0 * PI));

  // Static 4-color cycle: black → dark → light → white
  // This specific asymmetric luminance order is what creates
  // the illusion of rotation in peripheral vision.
  float phase = mod(seg + ring * 2.0, 4.0);
  float p = phase / 4.0;

  vec3 color;
  if (p < 0.25) color = vec3(0.0);       // black
  else if (p < 0.5) color = uColor2;     // dark
  else if (p < 0.75) color = uColor1;    // bright
  else color = vec3(1.0);                 // white

  // Smooth segment boundaries
  float segSmooth = fract(segAngle * segments / (2.0 * PI));
  float edgeFade = smoothstep(0.0, 0.05, segSmooth) * smoothstep(1.0, 0.95, segSmooth);
  float ringFade = smoothstep(0.0, 0.08, ringFract) * smoothstep(1.0, 0.92, ringFract);

  color *= edgeFade * ringFade;

  float outerFade = smoothstep(0.5, 0.4, dist);
  gl_FragColor = vec4(color * outerFade, outerFade);
}
